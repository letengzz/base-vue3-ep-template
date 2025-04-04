import type { AxiosRequestConfig, AxiosResponse } from 'axios'
// import { useUserStore } from '@/store/user'
// import { message as $message } from 'ant-design-vue'
import axios, { CanceledError } from 'axios'
import { isString } from 'lodash-es'
import qs from 'qs'
// import router from '../router/index'

export interface RequestOptions extends AxiosRequestConfig {
  /** 是否直接将数据从响应中提取出，例如直接返回 res.data，而忽略 res.code 等信息 */
  isReturnResult?: boolean
  /** 请求成功是提示信息 */
  successMsg?: string
  /** 请求失败是提示信息 */
  errorMsg?: string
  /** 成功时，是否显示后端返回的成功信息 */
  showSuccessMsg?: boolean
  /** 失败时，是否显示后端返回的失败信息 */
  showErrorMsg?: boolean
  requestType?: 'json' | 'form'
}

const UNKNOWN_ERROR = '未知错误，请重试'

/** 真实请求的路径前缀 */
export const baseApiUrl = import.meta.env.VITE_BASE_URL
/** mock请求路径前缀 */
// const baseMockUrl = import.meta.env.VITE_MOCK_API;

const controller = new AbortController()
const service = axios.create({
  baseURL: baseApiUrl,
  // adapter: 'fetch',
  timeout: 10000,
  signal: controller.signal,
  paramsSerializer(params) {
    return qs.stringify(params, { arrayFormat: 'brackets' })
  },
})

service.interceptors.request.use(
  (config) => {
    // const token = useUserStore().token
    // if (token && config.headers) {
    //   // 请求头token信息，请根据实际情况进行修改
    //   config.headers.token = token
    // }
    return config
  },
  (error) => {
    Promise.reject(error)
  },
)

service.interceptors.response.use(
  (response: AxiosResponse<BaseResponse>) => {
    const res = response.data

    // 二进制数据则直接返回
    const responseType = response.request?.responseType
    if (responseType === 'blob' || responseType === 'arraybuffer') {
      return response
    }

    // if the custom code is not 200, it is judged as an error.
    if (res.code !== 200) {
    //   $message.error(res.msg || UNKNOWN_ERROR)
      // Illegal token
      // if ([997].includes(res.code!)) {
      //   // to re-login
      //   Modal.confirm({
      //     title: '警告',
      //     content: res.msg || '账号异常，您可以取消停留在该页上，或重新登录',
      //     okText: '重新登录',
      //     cancelText: '取消',
      //     onOk: () => {
      //       useUserStore().clear()
      //       const to = router.currentRoute.value
      //       router.push({
      //         path: '/login',
      //         query: { redirect: to.fullPath },
      //       })
      //       // localStorage.clear()
      //       // window.location.reload()
      //     },
      //   })
      // }

      // throw other
      const error = new Error(res.msg || UNKNOWN_ERROR) as Error & { code: any }
      error.code = res.code
      return Promise.reject(error)
    }
    else {
      return response
    }
  },
  (error) => {
    if (!(error instanceof CanceledError)) {
      // 处理 422 或者 500 的错误异常提示
      const errMsg = error?.response?.data?.message ?? UNKNOWN_ERROR
      //   $message.error({ content: errMsg, key: errMsg })
      error.message = errMsg
    }
    return Promise.reject(error)
  },
)

// TODO: 需要根据后端实际返回的类型进行修改
type BaseResponse<T = any> = Omit<API.ResponseEntity, 'data'> & {
  data: T
}

export function request<T = any>(
  url: string,
  config: { isReturnResult: false } & RequestOptions,
): Promise<BaseResponse<T>>
export function request<T = any>(
  url: string,
  config: RequestOptions,
): Promise<BaseResponse<T>['data']>
export function request<T = any>(
  config: { isReturnResult: false } & RequestOptions,
): Promise<BaseResponse<T>>
export function request<T = any>(config: RequestOptions): Promise<BaseResponse<T>['data']>
/**
 *
 * @param _url - request url
 * @param _config - AxiosRequestConfig
 */
export async function request(_url: string | RequestOptions, _config: RequestOptions = {}) {
  const url = isString(_url) ? _url : _url.url
  const config = isString(_url) ? _config : _url
  try {
    // 兼容 from data 文件上传的情况
    const { requestType, isReturnResult = true, ...rest } = config

    const response = (await service.request({
      url,
      ...rest,
      headers: {
        ...rest.headers,
        ...(requestType === 'form' ? { 'Content-Type': 'multipart/form-data' } : {}),
      },
    })) as AxiosResponse<BaseResponse>
    const { data } = response
    const { code, msg } = data || {}
    const hasSuccess = data && Reflect.has(data, 'code') && code === 100

    if (hasSuccess) {
      // @ts-ignore
      const { successMsg, showSuccessMsg } = config
      if (successMsg) {
        // $message.success(successMsg)
      }
      else if (showSuccessMsg && msg) {
        // $message.success(msg)
      }
    }

    // 页面代码需要获取 code，data，message 等信息时，需要将 isReturnResult 设置为 false
    if (!isReturnResult) {
      return data
    }
    else {
      return data.data
    }
  }
  catch (error: any) {
    return Promise.reject(error)
  }
}
