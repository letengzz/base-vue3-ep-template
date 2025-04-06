import { reactive } from 'vue'

interface DialogModel {
  title: string
  visible: boolean
  width: number
  height: number
}

export default function useDialog() {
  // 定义弹框属性
  const dialog = reactive<DialogModel>({
    title: '弹框',
    visible: false,
    width: 630,
    height: 280,
  })
  // 展示
  const onShow = () => {
    // 显示数据
    dialog.visible = true
  }
  // 关闭
  const onClose = () => {
    dialog.visible = false
  }
  // 确定
  const onConfirm = () => {
    dialog.visible = false
  }
  return {
    dialog,
    onShow,
    onClose,
    onConfirm,
  }
}
