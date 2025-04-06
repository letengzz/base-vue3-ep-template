<script setup lang="ts">
interface DialogProps {
  title?: string
  visible?: boolean
  width?: number
  height?: number
}
// 接收父组件传值
const props = withDefaults(defineProps<DialogProps>(), {
  title: '标题',
  visible: false,
  width: 600,
  height: 300,
})
const emit = defineEmits(['onClose', 'onConfirm'])
// 定义关闭的方法
function onClose() {
  emit('onClose')
}

// 定义确定的方法
function onConfirm() {
  emit('onConfirm')
}
</script>

<template>
  <!-- 弹框 -->
  <el-dialog
    :model-value="props.visible" :title="props.title" :width="`${props.width}px`" :before-close="onClose"
    append-to-body :close-on-click-modal="false"
  >
    <div class="container" :style="{ height: `${props.height}px` }">
      <slot name="content" />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="danger" @click="onClose">
          取消
        </el-button>
        <el-button type="primary" @click="onConfirm">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss">
.container {
  overflow-x: initial;
  overflow-y: auto;
}

.el-dialog {
  padding: 0;
  @include border-radius(10px);
  background-color: $background-color;
  .el-dialog__header {
    padding: 20px 20px 10px !important;
    margin-right: 0;
    border-bottom: none;
    @include box-shadow(0, 2px, 4px, $shadow-color);
    border-bottom: 1px solid $border-color;
    @include border-radius(10px 10px 0 0);

    .el-dialog__title {
      font-size: 16px;
      font-weight: 600;
      color: $text-color;
    }

    .el-dialog__headerbtn {
      top: 8px;

      .el-dialog__close {
        color: $text-color;
      }
    }
  }
  .el-dialog__body {
    padding: 10px;
    // background-color: #f9f9f9;
  }
  .el-dialog__footer {
    padding: 15px 20px;
    border-top: 1px solid $border-color;
    @include border-radius(0 0 10px 10px);
    @include box-shadow(0, -2px, 4px, $shadow-color);

    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;

      .el-button {
        padding: 10px 20px;
        @include border-radius(5px);
      }

      // .el-button--danger {
      //   background-color: $danger-color;
      //   border-color: $danger-color;
      // }
      //   .el-button--primary {
      //     background-color: $primary-color;
      //     border-color: $primary-color;
      //   }
    }
  }
}
</style>
