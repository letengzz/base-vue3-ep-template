# 配置项目

## 前置条件

### node 版本

> node 最好>20 因为 eslint9 的需要 本次项目 node 为 22.14.0

![image-20250327181856839](https://cdn.jsdelivr.net/gh/LetengZzz/img@main/img/202504022111354.png)

### 包管理器

> 包管理器 采用 pnpm

![image-20250327181916848](https://cdn.jsdelivr.net/gh/LetengZzz/img@main/img/202504022111640.png)

### vscode 插件

> vscode 插件 eslint prettier stylelint unocss vue-official postcss

![image-20240828103527225](https://cdn.jsdelivr.net/gh/LetengZzz/img@main/img/202504022111861.png)

![image-20240828103542672](https://cdn.jsdelivr.net/gh/LetengZzz/img@main/img/202504022112183.png)

![image-20240828103556492](https://cdn.jsdelivr.net/gh/LetengZzz/img@main/img/202504022112500.png)

![image-20240828103620621](https://cdn.jsdelivr.net/gh/LetengZzz/img@main/img/202504022113378.png)

![image-20240828103706879](https://cdn.jsdelivr.net/gh/LetengZzz/img@main/img/202504022112988.png)

![image-20240828140147090](https://cdn.jsdelivr.net/gh/LetengZzz/img@main/img/202504022112391.png)

### git

> 安装官方 git 用代码仓库管理

## 创建项目

创建 Vue 项目：

```shell
pnpm create vue@latest
```

![image-20250326213731717](https://cdn.jsdelivr.net/gh/LetengZzz/img@main/img/202504022112246.png)

## 配置.npmrc

> .npmrc 是 npm 运行时配置文件，用于设置依赖包的安装来源。 [https://pnpm.io/zh/npmrc](https://gitee.com/link?target=https%3A%2F%2Fpnpm.io%2Fzh%2Fnpmrc)

根目录新建 `.npmrc `以便于 pnpm

```shell
# 使用淘宝镜像源
registry = https://registry.npmmirror.com
# registry = https://registry.npmjs.org

# 根据需要提升含有以下的依赖包到根 node_modules 目录下
public-hoist-pattern[]=husky
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=@eslint*
public-hoist-pattern[]=*prettier*
public-hoist-pattern[]=lint-staged
public-hoist-pattern[]=*stylelint*
public-hoist-pattern[]=@commitlint*
public-hoist-pattern[]=core-js

# 提升所有依赖到根 node_modules 目录下，相当于 public-hoist-pattern[]=*，与上面一种方式一般二选一使用
# 极不推荐用这样的方式解决依赖问题，这样没有充分利用 pnpm 依赖访问安全性的优势，又走回了 npm / yarn 的老路。
# shamefully-hoist=true

enable-pre-post-scripts=true
engine-strict=true
package-manager-strict=false
```

## 强制使用 pnpm & 限制 node & pnpm 版本

> package.json

```shell
 "engines": {
    "node": "^18.18.0 || ^20.9.0 || >=21.1.0",
    "pnpm": ">=7.33.7"
  },
"scripts": {
    "preinstall": "npx only-allow pnpm",
  // ...
  },
```

## 调整 Router

调整 router：

> src/router/index.ts

```typescript
import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// export default router
export function useRouter(app: App) {
  app.use(router)
}
```

调整 main.ts

> src/main.ts

```typescript
import { createPinia } from 'pinia'

import { createApp } from 'vue'
import App from './App.vue'

import { useRouter } from './router'

const app = createApp(App)

app.use(createPinia())
useRouter(app)

app.mount('#app')
```

## 调整 Pinia

添加持久化插件：

```shell
pnpm install pinia-plugin-persistedstate
```

新建 stores/index.ts：

> src/stores/index.ts

```typescript
import type { App } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export function usePinia(app: App) {
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  app.use(pinia)
}
```

调整 main.ts

> src/main.ts

```typescript
import { createApp } from 'vue'
import App from './App.vue'

import { useRouter } from './router'
import { usePinia } from './stores'

const app = createApp(App)

useRouter(app)
usePinia(app)

app.mount('#app')
```

使用：

> AboutView.vue

```vue
<script setup>
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()
</script>

<template>
  <div class="about">
    <h1>This is an about page {{ counter.count }}</h1>
    <button @click="counter.increment">加一</button>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    display: flex;
    align-items: center;
    min-height: 100vh;
  }
}
</style>
```

> src/stores/counter.ts

```typescript
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useCounterStore = defineStore(
  'counter',
  () => {
    const count = ref(0)
    const doubleCount = computed(() => count.value * 2)
    function increment() {
      count.value++
    }
    return { count, doubleCount, increment }
  },
  {
    persist: [
      {
        pick: ['count'], // 指定字段
        storage: localStorage // 存储方式
      }
    ]
  }
)
```

## antfu 组合 prettier&eslint

配置网站：https://github.com/antfu/eslint-config/tree/feat/support-eslint-9?tab=readme-ov-file

### 命令行界面 (CLI) 安装

> 空格选择 回车下一步

```shell
npx @antfu/eslint-config@latest
```

![image-20250326220230817](https://cdn.jsdelivr.net/gh/LetengZzz/img@main/img/202504022112388.png)

### 安装依赖包

> "@antfu/eslint-config": "^2.27.3",
>
> "eslint": "^9.9.1",
>
> "eslint-plugin-format": "^0.1.2",
>
> "@unocss/eslint-plugin": "^0.62.3",

```shell
pnpm i
```

### 配置文件

> 修改生成配置文件 eslint.config.js 为 eslint.config.mjs 用于 eslint 规则校验

```shell
import antfu from '@antfu/eslint-config'

export default antfu({
  // @stylistic/eslint-plugin-plus
  stylistic: true,
  // eslint-plugin-format
  formatters: true,
  // unocss 检测&格式化 暂时注释 等配置了unocss再开放为true
  unocss: true,
  // vue的eslint配置
  vue: true,
  // 保存删除未引入的代码
  // isInEditor: false,
  // 9x版本 忽略文件这种配置方式 废弃掉eslintignore
  ignores: [
    '*.sh',
    'node_modules',
    '*.md',
    '*.woff',
    '*.ttf',
    '.idea',
    '/public',
    '/docs',
    '.husky',
    '.local',
    '/bin',
    'Dockerfile',
  ],
  lessOpinionated: true,
  rules: {
    'eslint-comments/no-unlimited-disable': 'off',
    'ts/no-use-before-define': 'off',
    'style/no-mixed-operators': 'off',
    'no-console': 'warn',
    'ts/no-unused-expressions': 'off',
    'style/max-statements-per-line': 'off',
    'ts/prefer-namespace-keyword': 'off',
    'antfu/top-level-function': 'off',
    'node/prefer-global/process': 'off',
    'ts/consistent-type-definitions': 'off',
    'ts/ban-ts-comment': 'off',
    'vue/singleline-html-element-content-newline': 'off', // vue 标签强制换行
    // 关闭一些耗时的规则
    'import/no-cycle': 'off',
    'import/no-deprecated': 'off',
    'import/no-named-as-default': 'off',
    'prefer-promise-reject-errors': 'off',
  },
})
```

### 新增脚本

> package.json

```json
{
  "scripts": {
    // ...
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

### .vscode 配置文件

> 用于保存带代码格式化

生成.vscode/setting.json 修改为：

```json
{
  // Disable the default formatter, use eslint instead
  "prettier.enable": false,
  "editor.formatOnSave": false,
  // Auto fix
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  },
  // Silent the stylistic rules in you IDE, but still auto fix them
  "eslint.rules.customizations": [
    {
      "rule": "style/*",
      "severity": "off",
      "fixable": true
    },
    {
      "rule": "format/*",
      "severity": "off",
      "fixable": true
    },
    {
      "rule": "*-indent",
      "severity": "off",
      "fixable": true
    },
    {
      "rule": "*-spacing",
      "severity": "off",
      "fixable": true
    },
    {
      "rule": "*-spaces",
      "severity": "off",
      "fixable": true
    },
    {
      "rule": "*-order",
      "severity": "off",
      "fixable": true
    },
    {
      "rule": "*-dangle",
      "severity": "off",
      "fixable": true
    },
    {
      "rule": "*-newline",
      "severity": "off",
      "fixable": true
    },
    {
      "rule": "*quotes",
      "severity": "off",
      "fixable": true
    },
    {
      "rule": "*semi",
      "severity": "off",
      "fixable": true
    }
  ],
  // Enable eslint for all supported languages
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue",
    "html",
    "markdown",
    "json",
    "jsonc",
    "yaml",
    "toml",
    "xml",
    "gql",
    "graphql",
    "astro",
    "svelte",
    "css",
    "less",
    "scss",
    "pcss",
    "postcss"
  ]
}
```

## 调整类型声明文件

新建 types 文件夹并将 env.d.ts 文件移动到 types：

![image-20250327224407186](https://cdn.jsdelivr.net/gh/LetengZzz/img@main/img/202504022112013.png)

调整 tsconfig.node.json：

> tsconfig.node.json

```json
{
  "extends": "@tsconfig/node22/tsconfig.json",
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",

    "module": "ESNext",
    "moduleResolution": "Bundler",
    "types": ["node"],
    "noEmit": true
  },
  "include": [
    "vite.config.*",
    "vitest.config.*",
    "cypress.config.*",
    "nightwatch.conf.*",
    "playwright.config.*",
    "eslint.config.*",
    "types"
  ]
}
```

调整 tsconfig.app.json：

> tsconfig.app.json

```json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",

    "paths": {
      "@/*": ["./src/*"],
      "#/*": ["./types/*"]
    }
  },
  "include": ["types", "src/**/*", "src/**/*.vue"],
  "exclude": ["src/**/__tests__/*"]
}
```

## 调整不能识别 vue 文件

typescript 不能识别 .vue 文件

解决方法：可以在 env.d.ts 文件中添加以下代码：

```typescript
/// <reference types="vite/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const vueComponent: DefineComponent<object, object, any>
  export default vueComponent
}
```

## UnoCSS

添加依赖：

```shell
pnpm install -D unocss @unocss/preset-rem-to-px @unocss/transformer-directives
```

安装图标：

```shell
pnpm install -D @iconify-json/ep @iconify-json/ant-design @iconify/utils
```

引入 UnoCSS：

> vite.config.ts

```typescript
// unocss vite插件
import UnoCSS from 'unocss/vite'

// https://vite.dev/config/
export default defineConfig({
  // ...
  plugins: [
    // ...
    UnoCSS()
  ]
})
```

配置 UnoCSS：

> uno.config.ts

```typescript
// uno.config.ts
import fs from 'node:fs'
import path from 'node:path'
// 预设rem转px
import presetRemToPx from '@unocss/preset-rem-to-px'
// transformerDirectives 可以使用 @apply @screen theme函数
import transformerDirective from '@unocss/transformer-directives'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerVariantGroup
} from 'unocss'

// import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
// loader helpers -- pnpm i @iconify/utils -D 官网的不晓得为啥 jenkins 打包总会出点问题
// TODO: 上面失效用下面替代 pnpm i unplugin-icons -D
import { FileSystemIconLoader } from 'unplugin-icons/loaders'

// SVG图标基础目录
const SVG_BASE_DIR = './src/assets/svg'

export default defineConfig({
  presets: [
    presetAttributify(),
    // {
    // 忽略的属性
    // ignoreAttributes: ['container', 'table'],
    // }
    presetUno(),
    // 现在mt-1会转换为 margin-top: 1px
    presetRemToPx({
      baseFontSize: 4
    }),
    // 自动引入图标配置
    presetIcons({
      scale: 1.2,
      // warn: true,
      // 全局自定义图标转换
      customizations: {
        transform(svg, collection) {
          // 如果是menu图标，则添加fill="currentColor"
          if (collection === 'menu') {
            return svg.replace(/^<svg /, '<svg fill="currentColor" ')
          }
          return svg
        }
      },
      collections: {
        // 本地SVG图标集合 自动读取SVG_BASE_DIR下面文件夹里面的图标 使用方式为 i-文件夹名称-图标名称
        ...loadLocalSvgCollections(),
        // 按需加载的图标集合 非必须
        // 'ant-design': () => import('@iconify-json/ant-design/icons.json').then(i => i.default),
        ep: () => import('@iconify-json/ep/icons.json').then(i => i.default)
      }
    })
  ],
  // 安全列表 动态图标需要 例如：<div i-menu-home /> 菜单图标是后端返回的需要动态处理
  safelist: generateSafeList(['menu']), // 传入数组参数
  transformers: [transformerDirective(), transformerVariantGroup()],
  // 自定义配置
  rules: [
    // 自定义配置
    // 以下官网规则可自定义转换
    // [/^m-(\d+)$/, ([, d]) => ({ margin: `${d / 4}rem` })],
    // [/^p-(\d+)$/, match => ({ padding: `${match[1] / 4}rem` })],
    /** 以下官网规则可自定义转换 */
    /* 例如 m-1 转换为 margin:0.25rem */
    // [/^m-(\d+)$/, ([, d]) => ({margin: `${d / 4}rem`})],
    // [/^p-(\d+)$/, match => ({padding: `${match[1] / 4}rem`})],
    [
      /^bg-img-\[(.+)\]$/,
      ([, value]) => {
        // 替换下划线为正常的路径分隔符
        const path = value.replace(/_/g, '/')
        return {
          'background-image': `url(${path})`,
          'background-repeat': 'no-repeat',
          'background-size': '100% 100%'
        }
      }
    ]
  ],
  // 自定义属性 一个属性可以对应多个unocss类值
  shortcuts: [
    // 动态快捷方式
    /**
     *   t+字号+透明度+加粗
     *   t14 就变成 text-14 color=rgba(37,51,71,1)
     *   t145 就变成 text-14 color=rgba(37,51,71,0.55)
     *   t14b5 就变成 text-14 color=rgba(37,51,71,1) font-weight: 500
     *   t145b5 就变成 text-14 color=rgba(37,51,71,0.55) font-weight: 500
     */
    [
      /^t(\d{2})(\d)?(b\d+)?$/,
      ([, size, opacity, weight]) => {
        const fontSize = `text-${size}`
        const fontWeight = weight ? `font-${weight.slice(1)}00` : ''
        const opacityValue = opacity
          ? (Number(opacity) * 0.1 + 0.05).toFixed(2)
          : '1'
        const color = `text-[rgba(37,51,71,${opacityValue})]`
        return `${fontSize} ${fontWeight} ${color}`
      }
    ],
    {
      // 垂直水平居中
      'flex-center': 'flex justify-center items-center',
      // 放在最后
      'flex-col-end': 'flex justify-end items-center',
      // 垂直居中
      'flex-middle': 'flex items-center',
      // 分开两边
      'flex-between': 'flex justify-between items-center',
      // 竖直居中
      'flex-col-center': 'flex flex-col justify-center',
      // 字体基线对其
      'flex-baseline': 'flex items-baseline'
    }
  ],
  theme: {
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    }
  }
})
// 本地 SVG 图标存放目录 用于动态渲染图标 例如：菜单按钮
function generateSafeList(collections: string[]) {
  const safeList: string[] = []
  collections.forEach((collection) => {
    try {
      const dirPath = path.resolve(SVG_BASE_DIR, collection)
      if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
        const files = fs.readdirSync(dirPath)
        const icons = files
          .filter(file => file.endsWith('.svg'))
          .map(file => `i-${collection}-${path.basename(file, '.svg')}`)
        safeList.push(...icons)
      }
    }
    catch (error) {
      console.error(`无法读取图标集合 ${collection}:`, error)
    }
  })

  return safeList
}

// 加载本地SVG图标集合
function loadLocalSvgCollections() {
  const result: Record<string, ReturnType<typeof FileSystemIconLoader>> = {}

  try {
    // 读取SVG_BASE_DIR目录下的所有内容
    const items = fs.readdirSync(SVG_BASE_DIR)

    // 筛选出文件夹
    const collections = items.filter((item) => {
      const itemPath = path.join(SVG_BASE_DIR, item)
      return fs.existsSync(itemPath) && fs.statSync(itemPath).isDirectory()
    })

    // 为每个文件夹创建FileSystemIconLoader
    collections.forEach((collection) => {
      result[collection] = FileSystemIconLoader(
        path.join(SVG_BASE_DIR, collection)
      )
    })
  }
  catch (error) {
    console.error(`无法读取SVG图标目录 ${SVG_BASE_DIR}:`, error)
  }
  return result
}
```

全局配置：

> main.ts

```
import 'virtual:uno.css' // 引入 uno.css
```

使用：

> 使用图标时：`i前缀-ep图库名:lock图标名称`

```vue
<script setup></script>

<template>
  <div>
    <h1>UnoCSS</h1>
    <div class="box" />
    <hr>
    <div class="h-100 w-100 bg-red-800 text-30 text-blue hover:text-black">
      小猫米
    </div>
    <hr>
    <div class="box2">小猫咪</div>
    <hr>
    <div mt10 h100 w100 bg-bluegray py20 text-fuchsia>小猫咪</div>
    <hr>
    <div class="wrap" h100 w200 flex-center gap10>
      <div h20 w20 bg-blue />
      <div h20 w20 bg-blue />
      <div h20 w20 bg-blue />
    </div>
    <hr>
    <div i-ep:dish />
    <i i-ep:switch-button block h100 w100 />
  </div>
</template>

<style lang="scss" scoped>
.box {
  width: 100px;
  height: 100px;
  background-color: salmon;
}
.box2 {
  @apply h-100 w-100 bg-red-800 text-30 text-blue hover:text-black;
}
.wrap {
  border: 1px solid #ddd;
}
</style>
```

## 使用 styleLint

### 依赖包

> "less": "^4.2.0",
>
> "postcss": "^8.4.41",
>
> "postcss-html": "^1.7.0",
>
> "postcss-less": "^6.0.0",
>
> "postcss-scss": "^4.0.9",
>
> "sass": "^1.77.8",
>
> "stylelint": "^16.8.2",
>
> "stylelint-config-recess-order": "^5.1.0",
>
> "stylelint-config-standard": "^36.0.1",

### 安装

```shell
# 选择sass 可以选择不安装包含less相关 反之亦然
npm i less sass postcss postcss-html postcss-less postcss-scss sass stylelint stylelint-config-recess-order stylelint-config-standard -D
```

### 配置文件

> stylelint.config.mjs

```js
/** @type {import('stylelint').Config} */
export default {
  // stylelint-config-standard 基础配置
  // stylelint-config-recess-order 样式顺序
  extends: ['stylelint-config-standard', 'stylelint-config-recess-order'],
  // 不同文件类型用不同解析器
  overrides: [
    {
      files: ['**/*.(css|html|vue)'],
      customSyntax: 'postcss-html'
    },
    // 选less可以注释scss
    {
      files: ['*.less', '**/*.less'],
      customSyntax: 'postcss-less'
    },
    // 选sass可以注释上面的less
    {
      files: ['*.scss', '**/*.scss'],
      customSyntax: 'postcss-scss',
      rule: {
        'scss/percent-placeholder-pattern': null,
        'scss/at-mixin-pattern': null
      }
    }
  ],
  rules: {
    // 'prettier/prettier': true,
    'media-feature-range-notation': null,
    'selector-not-notation': null,
    'import-notation': null,
    'function-no-unknown': null,
    'selector-class-pattern': null,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'deep']
      }
    ],
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep', ':deep']
      }
    ],
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
          'function',
          'if',
          'each',
          'include',
          'mixin',
          'extend',
          'use'
        ]
      }
    ],
    'no-empty-source': null,
    'named-grid-areas-no-invalid': null,
    'no-descending-specificity': null,
    'font-family-no-missing-generic-family-keyword': null,
    'rule-empty-line-before': [
      'always',
      {
        ignore: ['after-comment', 'first-nested']
      }
    ],
    'unit-no-unknown': [true, { ignoreUnits: ['rpx'] }],
    'order/order': [
      [
        'dollar-variables',
        'custom-properties',
        'at-rules',
        'declarations',
        {
          type: 'at-rule',
          name: 'supports'
        },
        {
          type: 'at-rule',
          name: 'media'
        },
        'rules'
      ],
      { severity: 'error' }
    ]
  },
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts']
}
```

### 新增脚本

> package.json

```sh
{
    "scripts": {
        // ...
        "lint:stylelint": "stylelint  \"**/*.{css,scss,less,vue,html}\" --fix"
    }
}
```

### 忽略文件

> .stylelintignore

```sh
/dist/*
/public/*
```

## gzip 压缩

安装：

```shell
pnpm i vite-plugin-compression -D
```

vite.config.ts 配置：

```typescript
// gzip压缩
import viteCompression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // ...
    viteCompression({
      verbose: true, // 默认即可
      disable: false, // 开启压缩(不禁用)，默认即可
      deleteOriginFile: false, // 删除源文件
      threshold: 10240, // 压缩阈值，以字节为单位。如果一个资源比这个值小，它就不会被压缩。默认是 10240
      algorithm: 'gzip', // 压缩算法，默认是 gzip
      ext: '.gz' // 文件类型，默认是 .gz
    })
  ]
})
```

## 自动引入

安装：

```shell
pnpm install -D unplugin-vue-components unplugin-auto-import
```

vite.config.ts 配置：

```typescript
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

// https://vite.dev/config/
export default defineConfig({
  // ...
  plugins: [
    // ...
    AutoImport({
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
        'pinia' // 自动导入Pinia API
      ],
      dts: './types/auto-imports.d.ts', // 生成类型声明文件的路径
      dirs: ['src/api/**/*.ts', 'src/utils/**/*.ts'] // 自动导入项目中自定义的API和工具函数
    }),
    Components({
      resolvers: [
        //   ElementPlusResolver(), // Element Plus组件库解析器（已禁用）
        //   AntDesignVueResolver({
        //     resolveIcons: true, // 自动导入图标组件
        //     importStyle: false, // 不导入CSS，使用CSS-in-JS方式
        //   }),
      ],
      dts: './types/components.d.ts' // 生成组件类型声明文件的路径
    })
  ]
})
```

## 代码检查

安装：

```shell
pnpm i vite-plugin-checker -D
```

vite.config.ts 配置：

```typescript
import checker from 'vite-plugin-checker'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // ...
    checker({
      eslint: {
        useFlatConfig: true,
        lintCommand: 'eslint "./src/**/*.{ts,tsx,vue}"',
        dev: {
          logLevel: ['error']
        }
      },
      overlay: {
        initialIsOpen: true
      }
    })
  ]
})
```

## 抽离插件

官网：https://cn.vitejs.dev/config/#conditional-config

vite.config.ts 抽离出插件，打包配置 server 配置等复杂配置。

调整 tsconfig.node.json：

> tsconfig.node.json

```json
{
  "extends": "@tsconfig/node22/tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",

    "module": "ESNext",
    "moduleResolution": "Bundler",
    "types": ["node"],
    "noEmit": true
  },
  "include": [
    "vite.config.*",
    "vitest.config.*",
    "cypress.config.*",
    "nightwatch.conf.*",
    "playwright.config.*",
    "eslint.config.*",
    "types",
    "build"
  ]
}
```

调整 tsconfig.app.json：

> tsconfig.app.json

```json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "#/*": ["./types/*"]
    },
    "noUnusedParameters": true
  },
  "include": ["build", "types", "src/**/*", "src/**/*.vue"],
  "exclude": ["src/**/__tests__/*"]
}
```

> import-meta.d.ts

```typescript
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
```

> build/utils.ts

```typescript
/* eslint-disable */
// Read all environment variable configuration files to process.env
export function wrapperEnv(envConf: any) {
  const ret: any = {}

  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, '\n')
    realName =
      realName === 'true' ? true : realName === 'false' ? false : realName

    if (envName === 'VITE_PORT') {
      realName = Number(realName)
    }
    if (envName === 'VITE_PROXY' && realName) {
      try {
        realName = JSON.parse(realName.replace(/'/g, '"'))
      } catch (error) {
        realName = ''
      }
    }
    ret[envName] = realName
    if (typeof realName === 'string') {
      process.env[envName] = realName
    } else if (typeof realName === 'object') {
      process.env[envName] = JSON.stringify(realName)
    }
  }
  return ret
}
```

> build/build.ts

```typescript
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
        assetFileNames: 'assets/[ext]/[name].[hash].[ext]'
      }
    }
  }
}

export default useViteBuild
```

> build/server.ts

```typescript
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
      clientFiles: ['./index.html', './src/{components,api}/*']
    }
  }
}
```

> build/proxy.ts

```typescript
/**
 * Used to parse the .env.development proxy configuration
 */
import type { ProxyOptions } from 'vite'

type ProxyItem = [string, string]

type ProxyList = ProxyItem[]

type ProxyTargetList = Record<string, ProxyOptions>

const httpsRE = /^https:\/\//

/**
 * Generate proxy
 * @param list
 */
export default function useProxy(list: ProxyList = []) {
  const ret: ProxyTargetList = {}
  for (const [prefix, target] of list) {
    const isHttps = httpsRE.test(target)
    // https://github.com/http-party/node-http-proxy#options
    ret[prefix] = {
      target,
      changeOrigin: true,
      ws: true,
      rewrite: path => path.replace(new RegExp(`^${prefix}`), '/api'),
      // https is require secure=false
      ...(isHttps ? { secure: false } : {})
    }
  }
  return ret
}
```

在 build 下新建 plugins 文件夹，新建文件：

- 抽离自动导入：

  > build/plugins/autoImport.ts：

  ```typescript
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
        'pinia' // 自动导入Pinia API
        //   '@vueuse/core', // 自动导入VueUse工具函数
        //   {
        //     'vue-request': ['useRequest', 'usePagination'], // 自动导入vue-request的特定函数
        //     // 'dayjs': [['default', 'dayjs']],
        //   },
      ],
      dts: './types/auto-imports.d.ts', // 生成类型声明文件的路径
      dirs: ['src/api/**/*.ts', 'src/utils/**/*.ts'] // 自动导入项目中自定义的API和工具函数
    })
  }

  export default useAutoImport
  ```

- 抽离代码检查：

  > build/plugins/checker.ts：

  ```typescript
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
          logLevel: ['error']
        }
      },
      overlay: {
        initialIsOpen: true
      }
    })
  }
  ```

- 抽离组件：

  > build/plugins/component.ts：

  ```typescript
  // import { ElementPlusResolver, AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
  // import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
  import Components from 'unplugin-vue-components/vite'

  /**
   * 自动注册Vue组件的插件配置
   * 该插件可以自动导入组件，无需手动import
   * 提高开发效率并减少样板代码
   */
  const useComponents = () => {
    return Components({
      resolvers: [
        //   ElementPlusResolver(), // Element Plus组件库解析器（已禁用）
        //   AntDesignVueResolver({
        //     resolveIcons: true, // 自动导入图标组件
        //     importStyle: false, // 不导入CSS，使用CSS-in-JS方式
        //   }),
      ],
      dts: './types/components.d.ts' // 生成组件类型声明文件的路径
    })
  }

  export default useComponents
  ```

- 抽离压缩：

  > build/plugins/compress.ts：

  ```typescript
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
      ext: '.gz' // 文件类型
    })
  }

  export default useCompress
  ```

- 抽离 DevTools：

  > build/plugins/devTools.ts：

  ```typescript
  import VueDevTools from 'vite-plugin-vue-devtools'
  /**
   *  开启DevTools
   */
  const useVueDevTools = () => {
    return VueDevTools({
      componentInspector: {
        // 如果是windows 'control-shift' , 如果是macOS 'meta-shift'
        toggleComboKey: 'control-shift'
      }
    })
  }

  export default useVueDevTools
  ```

> vite.config.ts

```typescript
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'

// 自动引入样式
import useViteBuild from './build/build'
import useVitePlugins from './build/plugins'
import { useServer } from './build/server'
import { wrapperEnv } from './build/utils'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // 模式
  const isBuild = command === 'build'
  // 获取当前文件夹地址 current working directory
  const root = process.cwd()
  // 读取包含VITE_开头的环境变量
  const env = loadEnv(mode, root)
  // 环境变量值转换
  const viteEnv = wrapperEnv(env)
  return {
    base: env.VITE_BUILD_URL || '/',
    plugins: useVitePlugins(isBuild, viteEnv),
    build: useViteBuild(viteEnv),
    server: useServer(viteEnv),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '#': fileURLToPath(new URL('./types', import.meta.url))
      }
    },
    css: {
      // 预加载
      preprocessorOptions: {
        // 全局样式变量预注入
        scss: {
          api: 'modern-compiler', // or "modern", "legacy"
          additionalData: `
            @use "@/styles/variables.scss" as *;
            @use "@/styles/mixin.scss" as *;
          `,
          globalVars: {
            'theme-color': env.VITE_APP_THEME_COLOR,
            'split-line': '#ECEFF8'
          }
        }
      }
    }
  }
})
```

## 代码提交检查

Husky + Lint-staged + Commitlint + Commitizen + cz-git 来配置 Git 提交代码规范。

> 核心内容是配置 Husky 的 pre-commit 和 commit-msg 两个钩子:
>
> pre-commit：Husky + Lint-staged 整合实现 Git 提交前代码规范检测/格式化 (前提：ESlint + Prettier + Stylelint 代码统一规范)；
>
> commit-msg: Husky + Commitlint + Commitizen + cz-git 整合实现生成规范化且高度自定义的 Git commit message。

### husky

Husky 是 Git 钩子工具，可以设置在 git 各个阶段（`pre-commit`、`commit-msg` 等）触发。

官网https://typicode.github.io/husky 推荐安装指令

1. 前提条件 项目有.git 如果没有需要生成 有 git 的话不需要这一步

```shell
git init
```

2. 自动配置 husky

```shell
npx husky-init
```

![image-20250107210102300](https://cdn.jsdelivr.net/gh/LetengZzz/img@main/img/202504022112090.png)

3. 安装 husky 执行 `pnpm i`

```shell
pnpm i
```

![image-20250107210141221](https://cdn.jsdelivr.net/gh/LetengZzz/img@main/img/202504022112817.png)

### Lint-staged 增量检测提交代码

lint-staged 是一个在 git add 到暂存区的文件运行 linters (ESLint/Prettier/StyleLint) 的工具，避免在 git commit 提交时在整个项目执行。

1. 安装：

```shell
pnpm i lint-staged -D
```

2. 新建 lint-staged.config.mjs 配置文件

> lint-staged.config.mjs

```js
/**  @type {import('lint-staged').Config} */
export default {
  '*.{js,jsx,ts,tsx}': ['eslint --fix'],
  '*.json': ['eslint --fix'],
  '*.vue': ['eslint --fix'],
  '*.{scss,less,styl,html}': ['stylelint --fix --allow-empty-input'],
  '*.md': ['prettier --write']
}
```

3. 添加指令

> package.json

```shell
"scripts": {
  // ...
  "lint:lint-staged": "lint-staged"
},
```

4. 文件`.husky/pre-commit`**修改提交前钩子命令**

npx 命令会自动执行安装过的 lint-staged 插件，从而执行 lint-staged.config.mjs 配置文件

```shell
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm run lint:lint-staged --allow-empty
```

![image-20240207143016869](https://cdn.jsdelivr.net/gh/LetengZzz/img@main/img/202504022113919.png)

### Commitlint

Commitlint 检查您的提交消息是否符合 Conventional commit format。

Commitlint 官网：https://commitlint.js.org/)

1. 安装：

```shell
pnpm i @commitlint/cli @commitlint/config-conventional -D
```

2. 根目录创建 `commitlint.config.mjs` 配置文件：

> commitlint.config.mjs

```js
/** @type {import("@commitlint/types").UserConfig} */
export default {
  ignores: [commit => commit.includes('init')],
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 108],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'subject-case': [0],
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新增功能
        'fix', // 修复缺陷
        'docs', // 文档变更
        'style', // 代码格式（不影响功能，例如空格、分号等格式修正）
        'refactor', // 代码重构（不包括 bug 修复、功能新增）
        'perf', // 性能优化
        'test', // 添加疏漏测试或已有测试改动
        'build', // 构建流程、外部依赖变更（如升级 npm 包、修改 webpack 配置等）
        'ci', // 修改 CI 配置、脚本
        'revert', // 回滚 commit
        'chore' // 对构建过程或辅助工具和库的更改（不影响源文件、测试用例）
      ]
    ]
  }
}
```

3. 执行下面命令生成 `commint-msg` 钩子用于 git 提交信息校验

```shell
npx husky add .husky/commit-msg "npx --no -- commitlint --edit $1"
```

![image-20240207142542813](https://cdn.jsdelivr.net/gh/LetengZzz/img@main/img/202504022113844.png)

### Commitizen

安装：

```shell
pnpm install -D commitizen cz-vinyl
```

添加 `.czvinylrc` 文件：

```json
{
  "headerFormat": "{type}: {subject}",
  "commitTypes": [
    {
      "description": "一个新的功能",
      "value": "feat"
    },
    {
      "description": "一个BUG修复",
      "value": "fix"
    },
    {
      "description": "辅助工具更改或者无法分类的提交",
      "value": "chore"
    },
    {
      "description": "提高性能的代码更改",
      "value": "perf"
    },
    {
      "description": "不修复错误也不增加功能的重构代码",
      "value": "refactor"
    },
    {
      "description": "更新代码格式",
      "value": "style"
    },
    {
      "description": "添加测试用例",
      "value": "test"
    },
    {
      "description": "更新文档",
      "value": "docs"
    },
    {
      "description": "更新CI发版代码",
      "value": "ci"
    },
    {
      "description": "更新构建依赖等模块",
      "value": "build"
    }
  ],
  "skipScope": true,
  "skipTicketId": true,
  "subjectMaxLength": 70,
  "subjectMinLength": 3,
  "typeQuestion": "请选择一个提交类型：",
  "subjectQuestion": "请输入一个提交信息：",
  "bodyQuestion": "请输入一个提交详细内容（可跳过）："
}
```

在 scripts 中添加：

```shell
"scripts": {
   // ...
   "cz": "git-cz"
 },
 "config": {
   "commitizen": {
     "path": "cz-vinyl"
   }
 },
```

使用 `npm run cz` 运行：

![image-20250316110304316](https://cdn.jsdelivr.net/gh/LetengZzz/img@main/img/202504022111050.png)
