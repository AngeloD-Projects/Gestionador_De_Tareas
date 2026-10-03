import '@tanstack/react-query'

// Tipa el "meta" de las mutaciones para que { silenciarError: true } tenga autocompletado y no se escriba mal.
declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      silenciarError?: boolean
    }
  }
}
