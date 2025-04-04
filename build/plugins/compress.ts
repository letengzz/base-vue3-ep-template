import viteCompression from 'vite-plugin-compression'
/**
 *  开启gzip压缩
 */
const useCompress = () => {
  return viteCompression({
    verbose: true, // 默认即可
    disable: false, // 开启压缩(不禁用)，默认即可
    deleteOriginFile: false, // 删除源文件
    threshold: 10240, // 压缩前最小文件大小
    algorithm: 'gzip', // 压缩算法
    ext: '.gz', // 文件类型
  })
}

export default useCompress
