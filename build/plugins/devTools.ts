import VueDevTools from 'vite-plugin-vue-devtools'
/**
 *  开启DevTools
 */
const useVueDevTools = () => {
  return VueDevTools({
    componentInspector: {
      // 如果是windows 'control-shift' , 如果是macOS 'meta-shift'
      toggleComboKey: 'control-shift',
    },
  })
}

export default useVueDevTools
