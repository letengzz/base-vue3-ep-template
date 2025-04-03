import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

/**
 * 自动注册Vue组件的插件配置
 * 该插件可以自动导入组件，无需手动import
 * 提高开发效率并减少样板代码
 */
const useComponents = () => {
  return Components({
    resolvers: [
      // Element Plus组件库解析器
      ElementPlusResolver({
        importStyle: 'sass', // 使用Sass样式
      }),
    ],
    dts: './types/components.d.ts', // 生成组件类型声明文件的路径
  })
}

export default useComponents
