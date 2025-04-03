const useViteBuild = (viteEnv: ViteEnv) => {
  const { VITE_BUILD_VENDOR } = viteEnv

  return {
    // 10kb以下，转Base64
    assetsInlineLimit: 1024 * 10,
    // chunkSizeWarningLimit: 1500,//配置文件大小提醒限制，默认500
    rollupOptions: {
      output: {
        // 每个node_modules模块分成一个js文件
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            // return 'vendor'
            return VITE_BUILD_VENDOR
              ? 'vendor'
              : id.toString().split('node_modules/')[2].split('/')[0].toString()
          }
          // return 'vendor'
        },
        // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
        entryFileNames: 'assets/js/[name].[hash].js', // 用于命名代码拆分时创建的共享块的输出命名
        chunkFileNames: 'assets/js/[name].[hash].js', // 用于输出静态资源的命名，[ext]表示文件扩展名
        assetFileNames: 'assets/[ext]/[name].[hash].[ext]',
      },
    },
  }
}

export default useViteBuild
