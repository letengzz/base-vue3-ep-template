// vite.config.ts
import checker from 'vite-plugin-checker'
/**
 * vite-plugin-checker 配置
 * 用于在开发环境下进行代码检查
 *
 * @returns {import('vite-plugin-checker').default} checker插件实例
 *
 * 配置说明:
 * - eslint: ESLint配置
 *   - useFlatConfig: 使用扁平配置
 *   - lintCommand: 检查命令
 *   - dev.logLevel: 开发环境日志级别
 * - overlay: 错误覆盖层配置
 *   - initialIsOpen: 初始是否打开
 */

export default function configChecker() {
  return checker({
    eslint: {
      useFlatConfig: true,
      lintCommand: 'eslint "./src/**/*.{ts,tsx,vue}"',
      dev: {
        logLevel: ['error'],
      },
    },
    overlay: {
      initialIsOpen: true,
    },
  })
}
