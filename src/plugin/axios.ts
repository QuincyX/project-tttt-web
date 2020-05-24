'use strict'

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
const isDev = process.env.NODE_ENV === 'development'
import { log } from '@/util/index'
import store from '@/plugin/store'
import router from '@/plugin/router'

const instance = axios.create({
  timeout: 20 * 1000,
  withCredentials: false,
  baseURL: 'http://127.0.0.1:3001/'
})

instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (config.params) {
      delete config.params.total
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add a response interceptor
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    const { config } = response
    if (response?.data?.page && response?.data?.list) {
      // 如果返回数据是分页列表
      const page: PageQuery = {
        ...response.data.page
      }
      printList(response, page)
      return Promise.resolve({
        list: response?.data?.list,
        page
      })
    } else {
      // 默认返回数据是对象
      printData(response)
      return Promise.resolve(
        response.data?.data || response.data?.list || response.data
      )
    }
  },
  (error: AxiosError) => {
    store.dispatch('userTrack/addError', {
      message: error.message,
      stack: error.stack,
      url: error.config ? error.config.url : '',
      method: error.config ? error.config.method : '',
      time: Date.now()
    })
    if (!isDev && error.response?.status && error.response?.status >= 500) {
      router.push('/redirect/serverError')
    }
    return Promise.reject(error)
  }
)

export default instance

const printError = (response: any) => {
  if (isDev) {
    let url = response.config.url.replace(response.config.baseURL, '')
    console.groupCollapsed(
      '%cError >>>>>>>>>>>>>>> ' +
        response.config.method.toUpperCase() +
        ' ' +
        url,
      'color: #e74c3c'
    )
    printReq('request query', response.config.params)
    printReq('request payload', response.config.data)
    if (response.data) {
      printErrorCode(response.data.code)
      printMessage(response.data.message)
    }
    console.groupEnd()
  }
}
const printList = (response: any, page: any) => {
  if (isDev) {
    let url = response.config.url.replace(response.config.baseURL, '')
    groupStart(response.config.method.toUpperCase() + ' ' + url)
    printReq('请求参数, url query', response.config.params)
    printReq('请求参数, payload body', response.config.data)
    if (page) {
      printRes('返回内容, page', page)
    }
    printRes('返回内容, list', response.data.list)
    printMessage(response.data.message)
    console.groupEnd()
  }
}
const printData = (response: any) => {
  if (isDev) {
    let url = response.config.url.replace(response.config.baseURL, '')
    groupStart(response.config.method.toUpperCase() + ' ' + url)
    printReq('请求参数, url query', response.config.params)
    printReq('请求参数, payload body', response.config.data)
    printRes('返回内容', response.data.data || response.data)
    printMessage(response.data.message)
    console.groupEnd()
  }
}

const rainbow = [
  'color: #e74c3c',
  'color: #e67e22',
  'color: #f1c40f',
  'color: #2ecc71',
  'color: #1abc9c',
  'color: #3498db',
  'color: #9b59b6',
  'color: #333'
]
const printErrorCode = (val: any) => {
  if (val) {
    console.log(
      '%c' + 'server error code: ' + val,
      'background:linear-gradient(to right,#ff6b81, #ff4757);color:#fff;padding:5px 10px'
    )
  }
}
const printMessage = (val: any) => {
  if (val) {
    console.log(
      '%c' + 'response message: ' + val,
      'background:linear-gradient(to top,#ff7f50, #ff6b81);color:#fff;padding:5px 10px'
    )
  }
}
const printRes = (type: string, val: any) => {
  if (val) {
    console.log(
      '%c' + (type || 'response data') + ':',
      'background:linear-gradient(to left,#2ed573, #1e90ff);color:#fff;padding:5px 15px;'
    )
    console.log({ ...val })
  }
}
const printReq = (type: string, val: any) => {
  if (val) {
    if (typeof val === 'string') {
      try {
        val = JSON.parse(val)
      } catch (err) {
        val = val
      }
    }
    console.log(
      '%c' + (type || 'request payload') + ':',
      'background:linear-gradient(to right,#2ed573, #1e90ff);color:#fff;padding:5px 15px'
    )
    console.log(val)
  }
}
const groupStart = (val: any) => {
  let cord: Array<string> = []
  while (cord.length < 7) {
    let n = Math.floor(Math.random() * 7)
    if (!cord.includes(rainbow[n])) {
      cord.push(rainbow[n])
    }
  }
  console.groupCollapsed(
    '%cSuccess %c>>>%c>>>%c>>>%c>>>%c>>>%c>>>%c>>>%c ' + val,
    'color: #2ecc71',
    ...cord,
    'color: #333'
  )
}
