interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface ViteEnv {
  VITE_APP_THEME_COLOR: string
  VITE_BASE_URL: string
  VITE_BASE_TARGET_URL: string
  VITE_VISUALIZER_OPEN: boolean
  VITE_BUILD_GZIP: boolean
  VITE_BUILD_VENDOR: boolean
  VITE_PROXY: any
  VITE_PORT: number
}

interface ImportMetaEnv extends ViteEnv {
  __: unknown
}
