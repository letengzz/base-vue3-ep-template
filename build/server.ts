// 服务器选项
import useProxy from './proxy'

export function useServer(viteEnv: ViteEnv) {
  return {
    // 监听所有公共ip
    host: '0.0.0.0',
    // cors: true,
    hmr: true,
    port: viteEnv.VITE_PORT,
    proxy: useProxy(viteEnv.VITE_PROXY),
    // 提前转换和缓存文件以进行预热。可以在服务器启动时提高初始页面加载速度，并防止转换瀑布。
    warmup: {
      // 请注意，只应该预热频繁使用的文件，以免在启动时过载 Vite 开发服务器
      // 可以通过运行 npx vite --debug transform 并检查日志来找到频繁使用的文件
      clientFiles: ['./index.html', './src/{components,api}/*'],
    },
  }
}
