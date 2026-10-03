import js from '@eslint/js'
import pluginQuery from '@tanstack/eslint-plugin-query'
import prettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

// ---------------------------------------------------------------------------
// Reglas de arquitectura: protegen el orden de carpetas (como los tests de
// arquitectura del backend). Si alguien rompe la estructura, el lint falla.
// ---------------------------------------------------------------------------
const soloPorIndex = {
  group: ['@/features/*/*'],
  message:
    'Otra feature solo se usa por su puerta de entrada: importa desde "@/features/<feature>" (su index.ts).',
}
const sinRutasRelativasLargas = {
  group: ['../../*'],
  message: 'Usa el alias "@/..." en lugar de rutas relativas largas.',
}
const restringirImports = (...patrones) => ({
  'no-restricted-imports': [
    'error',
    { patterns: [soloPorIndex, sinRutasRelativasLargas, ...patrones] },
  ],
})

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      pluginQuery.configs['flat/recommended'],
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: restringirImports(),
  },
  {
    // shared/ es la base: no conoce features, layouts ni la app.
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: restringirImports({
      group: ['@/features/*', '@/layouts/*', '@/app/*'],
      message:
        'shared/ no puede depender de features, layouts ni app: es código reutilizable sin negocio.',
    }),
  },
  {
    // Las features no conocen el arranque de la app.
    files: ['src/features/**/*.{ts,tsx}'],
    rules: restringirImports({
      group: ['@/app/*', '@/layouts/*'],
      message:
        'Una feature no depende de app/ ni de layouts/: ellos usan a las features, no al revés.',
    }),
  },
  {
    // Los tests pueden preparar el estado interno de una feature (ej: reiniciar la sesión).
    // Las demás reglas siguen aplicando.
    files: ['src/**/*.test.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [sinRutasRelativasLargas] }],
    },
  },
  {
    // Los componentes de shadcn/ui exportan variantes junto al componente: es su diseño.
    files: ['src/shared/components/ui/**/*.tsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
  // Siempre al final: desactiva las reglas de estilo que se ocupa Prettier.
  prettier,
])
