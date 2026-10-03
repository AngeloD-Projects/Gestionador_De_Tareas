import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

// En desarrollo "/api" lo reenvía el proxy de Vite; en producción se define VITE_API_URL.
const baseURL = import.meta.env.VITE_API_URL ?? '/api'

/** Para endpoints públicos (login, registro, refresh): sin token ni reintentos. */
export const httpClientPublico = axios.create({ baseURL })

/** Para todo lo demás: agrega el token y, si vence, lo renueva solo. */
export const httpClient = axios.create({ baseURL })

// ---------------------------------------------------------------------------
// "Enchufe" de autenticación: shared/ no conoce la feature auth (regla de capas),
// así que auth se conecta aquí desde app/ al arrancar.
// ---------------------------------------------------------------------------
export interface ConfiguracionAutenticacion {
  obtenerAccessToken: () => string | null
  /** Pide tokens nuevos y devuelve el access token nuevo. Lanza un error si no se pudo. */
  refrescarSesion: () => Promise<string>
  /** Se llama cuando la sesión ya no se puede renovar. */
  alExpirarSesion: () => void
}

let autenticacion: ConfiguracionAutenticacion | null = null

export function configurarAutenticacion(configuracion: ConfiguracionAutenticacion) {
  autenticacion = configuracion
}

httpClient.interceptors.request.use((config) => {
  const token = autenticacion?.obtenerAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ---------------------------------------------------------------------------
// Renovación del token con UN SOLO refresh a la vez: el backend rota el refresh
// token, así que si varias peticiones reciben 401 juntas, todas esperan el mismo
// refresh en lugar de lanzar uno cada una (el segundo fallaría y cerraría la sesión).
// ---------------------------------------------------------------------------
let refrescoEnCurso: Promise<string> | null = null

function refrescarUnaSolaVez(config: ConfiguracionAutenticacion): Promise<string> {
  refrescoEnCurso ??= config.refrescarSesion().finally(() => {
    refrescoEnCurso = null
  })
  return refrescoEnCurso
}

type PeticionReintentable = InternalAxiosRequestConfig & { _reintentada?: boolean }

httpClient.interceptors.response.use(undefined, async (error: AxiosError) => {
  const peticion = error.config as PeticionReintentable | undefined

  // Solo se intenta renovar una vez por petición, y solo ante un 401.
  if (error.response?.status !== 401 || !peticion || peticion._reintentada || !autenticacion) {
    throw error
  }
  peticion._reintentada = true

  try {
    // Si otra petición ya renovó el token mientras esta viajaba, se reintenta sin refrescar de nuevo.
    const tokenActual = autenticacion.obtenerAccessToken()
    const tokenUsado = String(peticion.headers.Authorization ?? '').replace('Bearer ', '')
    const tokenNuevo =
      tokenActual && tokenActual !== tokenUsado
        ? tokenActual
        : await refrescarUnaSolaVez(autenticacion)

    peticion.headers.Authorization = `Bearer ${tokenNuevo}`
    return httpClient(peticion)
  } catch {
    autenticacion.alExpirarSesion()
    throw error
  }
})
