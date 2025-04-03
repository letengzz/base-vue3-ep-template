// 此插件用于自动导入API和组件
// 可以减少手动import语句，提高开发效率，并提供类型提示
import AutoImport from 'unplugin-auto-import/vite'
// import { ElementPlusResolver, AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
// import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

/**
 * 配置自动导入功能
 * 支持Vue、Vue Router、Pinia等框架API的自动导入
 * 支持Ant Design Vue组件的自动导入
 * 自动导入src/api和src/utils目录下的函数
 * @returns Vite插件配置
 */
const useAutoImport = () => {
  return AutoImport({
    resolvers: [
    //   ElementPlusResolver(), // 自动导入Element Plus组件
    //   AntDesignVueResolver(), // 自动导入Ant Design Vue组件
    //   TDesignResolver({
    //     library: 'vue-next',
    //   }),
    ],
    imports: [
      'vue', // 自动导入Vue核心API
      'vue-router', // 自动导入Vue Router API
      'pinia', // 自动导入Pinia API
    //   '@vueuse/core', // 自动导入VueUse工具函数
    //   {
    //     'vue-request': ['useRequest', 'usePagination'], // 自动导入vue-request的特定函数
    //     // 'dayjs': [['default', 'dayjs']],
    //   },
    ],
    dts: './types/auto-imports.d.ts', // 生成类型声明文件的路径
    dirs: ['src/api/**/*.ts', 'src/utils/**/*.ts'], // 自动导入项目中自定义的API和工具函数
  })
}

export default useAutoImport
