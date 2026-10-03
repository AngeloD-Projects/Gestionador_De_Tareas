# TaskManagement — Frontend

SPA en React que consume la API de `../backend`.

**Stack:** React 19 · TypeScript · Vite · React Router · TanStack Query · Axios · Zustand ·
React Hook Form + Zod · Tailwind CSS + shadcn/ui · ESLint + Prettier

## Requisitos

- Node 24 LTS (`nvm use 24`)
- El backend corriendo en `http://localhost:5238` (perfil `http`)

## Comandos

| Comando          | Qué hace                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------- |
| `npm install`    | Instala dependencias                                                                        |
| `npm run dev`    | Servidor de desarrollo en `http://localhost:5173` (las rutas `/api` se reenvían al backend) |
| `npm run build`  | Verifica tipos y genera la versión de producción en `dist/`                                 |
| `npm run lint`   | ESLint, incluidas las reglas de arquitectura de carpetas                                    |
| `npm run format` | Formatea todo con Prettier                                                                  |

## Estructura

```
src/
├── app/          arranque: App, providers (caché, notificaciones) y router (todas las rutas)
├── layouts/      estructuras de página: AppLayout (menú según rol), AuthLayout
├── shared/       reutilizable y sin lógica de negocio
│   ├── api/          cliente HTTP (token + refresh) y manejo de errores
│   ├── components/   componentes comunes; ui/ = componentes de shadcn/ui
│   ├── hooks/        hooks genéricos
│   └── lib/          utilidades
└── features/     una carpeta por funcionalidad: auth, proyectos, tareas, usuarios
    └── <feature>/
        ├── api/          llamadas HTTP de la feature
        ├── components/   componentes propios de la feature
        ├── hooks/        hooks (consultas y mutaciones con TanStack Query)
        ├── pages/        páginas (delgadas: solo arman componentes)
        ├── schemas/      validaciones de formularios (Zod)
        └── index.ts      puerta de entrada: lo único visible desde fuera
```

## Reglas (las verifica `npm run lint`)

1. Una feature usa otra **solo** por su `index.ts`: `@/features/tareas`, nunca `@/features/tareas/components/...`.
2. `shared/` no importa features, layouts ni app.
3. Las features no importan `app/` ni `layouts/`.
4. Nada de rutas relativas largas (`../../`): usar el alias `@/`.
5. Un componente usado por **una** feature vive en ella; si lo usan **dos o más**, sube a `shared/components/`.
6. Ningún componente llama a la API directamente: componente → hook → `api/` → cliente HTTP.
