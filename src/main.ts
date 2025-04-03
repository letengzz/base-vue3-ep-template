import { createApp } from 'vue'
import App from './App.vue'

import { useRouter } from './router'
import { usePinia } from './stores'
import 'virtual:uno.css' // 引入 uno.css
// 引入全局样式
import '@/styles/index.scss'
import '@unocss/reset/sanitize/sanitize.css'
import '@unocss/reset/sanitize/assets.css'

const app = createApp(App)
useRouter(app)
usePinia(app)

app.mount('#app')
