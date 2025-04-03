import type { RequestOptions } from './src/http/request'
import { generateService } from '@umijs/openapi'

const re = /controller[-_ .](\w)/gi

// swagger-typescript-api
generateService({
  // 重点1 这个地址就是你在线 swagger json 地址
  schemaPath: 'http://localhost:8080/api-docs/hjc-admin',
  // schemaPath: 'http://10.102.33.126:6540/api/v3/api-docs',
  serversPath: './src',
  requestOptionsType: 'RequestOptions',
  // 自定义网络请求函数路径
  requestImportStatement: `
  /**
   * 该文件为 @umijs/openapi 插件自动生成，请勿随意修改。如需修改请通过配置 openapi.config.ts 进行定制化。
   * */

  import { request, type RequestOptions } from "@/http/request";
  `,
  hook: {
    afterOpenApiDataInited(openAPIData) {
      const schemas = openAPIData.components?.schemas
      if (schemas) {
        Object.values(schemas).forEach((schema) => {
          if ('$ref' in schema) {
            return
          }
          if (schema.properties) {
            Object.values(schema.properties).forEach((prop) => {
              if ('$ref' in prop) {
                return
              }
              // 匡正文件上传的参数类型
              if (prop.format === 'binary') {
                prop.type = 'object'
              }
            })
          }
        })
      }
      return openAPIData
    },
    // 重点2 这个函数是用来生成接口名称的 可以根据你自己的需求进行修改
    // @ts-ignore
    customFunctionName(operationObject, apiPath) {
      const { operationId, path } = operationObject
      // console.log('🚀 ~ customFunctionName ~ operationObject:', operationObject)

      if (!operationId) {
        console.warn('[Warning] no operationId', apiPath)
        return
      }

      // 首字母大写
      function capitalizeFirstLetter(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1)
      }

      // 提取路径中的部分
      const parts = path.split('/').filter(part => part !== '')
      let str = ''
      for (let i = 0; i < parts.length; i++) {
        if (!parts[i].includes('{')) {
          if (i === 0) {
            str += parts[i]
          }
          else {
            str += capitalizeFirstLetter(parts[i])
          }
        }
      }

      // const funcName = operationId.replace(re, (_all, letter) => letter.toUpperCase())

      // operationObject.operationId = funcName

      return `${str}Req`
    },
    // @ts-ignore
    customFileNames(operationObject, apiPath) {
      const { operationId } = operationObject

      if (!operationId) {
        console.warn('[Warning] no operationId', apiPath)
        return
      }
      const controllerName = operationId.split(re)[0]
      const moduleName = operationObject.tags?.[0].split(' - ')[0]

      // 移除 query 参数的默认值
      operationObject.parameters?.forEach((param) => {
        if ('in' in param && param.in === 'query' && param.schema) {
          if (!('$ref' in param.schema) && param.schema.default) {
            Reflect.deleteProperty(param.schema, 'default')
          }
        }
      })

      if (moduleName === controllerName) {
        return [controllerName]
      }
      else if (moduleName && moduleName !== controllerName) {
        return [`${moduleName}_${controllerName}`]
      }
    },
    // 重点3 写返回值类型
    customType(schemaObject, namespace, defaultGetType) {
      // 修改接口返回值类型
      // function appendDataIfApiResponse(type: string): string {
      //   const regex = /API\.ResponseEntity/
      //   if (regex.test(type)) {
      //     return `${type}['data']`
      //   }
      //   return type
      // }

      const type = defaultGetType(schemaObject, namespace)
      // 提取出 data 的类型
      const regex = /API\.ResponseEntity & \{ 'data'\?: (.+); \}/
      return type.replace(regex, '$1')

      // return appendDataIfApiResponse(type)
    },
    // 重点4 这个函数是用来给接口返回值加message 提示用的
    customOptionsDefaultValue(data): RequestOptions {
      const { summary } = data

      if (summary?.startsWith('创建') || summary?.startsWith('新增')) {
        return { successMsg: '创建成功' }
      }
      else if (summary?.startsWith('更新')) {
        return { successMsg: '更新成功' }
      }
      else if (summary?.startsWith('编辑')) {
        return { successMsg: '编辑成功' }
      }
      else if (summary?.startsWith('删除')) {
        return { successMsg: '删除成功' }
      }
      else if (summary?.startsWith('重置')) {
        return { successMsg: '重置成功' }
      }
      else if (summary?.startsWith('保存')) {
        return { successMsg: '保存成功' }
      }
      else if (summary?.startsWith('清空')) {
        return { successMsg: '清空成功' }
      }
      else if (summary?.startsWith('登录')) {
        return { successMsg: '登录成功' }
      }
      else if (summary?.startsWith('退出')) {
        return { successMsg: '退出成功' }
      }
      else if (summary?.startsWith('修改')) {
        return { successMsg: '修改成功' }
      }
      return {}
    },
  },
})
