/**
 * Vite插件配置文件
 * 根据不同环境加载相应的插件
 */
import type { PluginOption } from 'vite'

import vue from '@vitejs/plugin-vue'

import vueJsx from '@vitejs/plugin-vue-jsx'
import useAutoImport from './autoImport' // 自动导入API
import useChecker from './checker' // 代码检查工具
import useComponents from './component' // 组件自动注册
import useCompress from './compress' // 压缩相关插件
import useVueDevTools from './devTools' // Vue开发者工具
import useUnocss from './unocss' // 原子化CSS工具

/**
 * 配置并返回Vite插件列表
 * @param isBuild 是否为生产环境构建
 * @param viteEnv 环境变量
 * @returns 插件数组
 */
const useVitePlugins = (isBuild: boolean, viteEnv: ViteEnv) => {
  const { VITE_BUILD_GZIP } = viteEnv
  const plugins: PluginOption[] = [
    vue(),
    vueJsx(),
  ]

  plugins.push(useUnocss())
  plugins.push(useAutoImport())
  plugins.push(useComponents())

  if (!isBuild) {
    plugins.push(useVueDevTools())
    plugins.push(useChecker())
  }

  if (isBuild) {
    // 打包开启 进度条 图片压缩 gzip压缩 代码分析
    // plugins.push(useImagemin())
    VITE_BUILD_GZIP && plugins.push(useCompress())
  }
  return plugins
}

export default useVitePlugins
