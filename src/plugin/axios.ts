'use strict'

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
const isDev = process.env.NODE_ENV === 'development'
import { log } from '@/util/index'
import store from '@/store/index'
import router from '@/plugin/router'

const instance = axios.create({
  timeout: 20 * 1000,
  withCredentials: false,
})

instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (config.params) {
      delete config.params.finished
    }
    if (config.data) {
      delete config.data.finished
    }
    // 自动处理URL
    if (config.url && config.url.substring(0, 4) !== 'http') {
      if (config.url.substring(0, 1) === '/') {
        config.url = config.url.substring(1, config.url.length)
      }
      if (config.url.split('/')[0].includes('-api')) {
        config.url = process.env.VUE_APP_BASE_API_URL + config.url
      } else {
        config.url =
          process.env.VUE_APP_BASE_API_URL + 'major-api/' + config.url
      }
    }
    // 请求携带自定义token
    if (localStorage.getItem('token')) {
      config.headers['jwt-token'] = localStorage.getItem('token')
    }
    config.headers['driver'] = 'web'
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
    if (response.data.code === -11) {
      log('token expired , response code -11')
      store.dispatch('user/logout')
      store.dispatch('user/visitorLogin')
      return Promise.resolve({})
    } else if (response.data.code && response.data.code !== '00000') {
      const { url = '' } = config
      if (
        url.indexOf('/major-api/user/v1/homepage/') > -1 &&
        (response.data.code === -215 ||
          response.data.code === -214 ||
          response.data.code === -207)
      ) {
      } else if (response.data.code === -215 || response.data.code === -214) {
        store.dispatch('notification/push', {
          code: response.data.code,
          message: response.data.message || '',
          button: '我要申诉',
        })
      }
      // 返回错误处理
      printError(response)
      return Promise.reject(response.data)
    } else {
      // 返回成功处理
      if (response.headers['jwt-token']) {
        // 自动刷新token
        localStorage.setItem('token', response.headers['jwt-token'])
      }
      if (response.data.data && response.data.data.list) {
        // 如果返回数据是分页列表
        // 分页信息再包装，添加 finished 判断
        // response.data.data.list.length < response.config.params.count
        const finished = response.data.data.hasNext != 1
        let count = 0
        let size = 0
        if (response.config.method === 'post') {
          const requestData = JSON.parse(response.config.data)
          count = requestData.count
          size = requestData.size
        } else {
          count = response.config.params.count
          size = response.config.params.size
        }
        const page = {
          page: response.data.data.page,
          timeline: response.data.data.timeline,
          count,
          size,
          finished,
        }
        if (!response.data.data.page) {
          delete page.page
        }
        if (!size) {
          delete page.size
        }
        const result = response.data.data
        printList(response, page)
        return Promise.resolve({
          list: response.data.data.list,
          result,
          page,
        })
      } else {
        // 默认返回数据是对象
        printData(response)
        return Promise.resolve(response.data.data || response.data)
      }
    }
  },
  (error: AxiosError) => {
    store.dispatch('userTrack/addError', {
      message: error.message,
      stack: error.stack,
      url: error.config ? error.config.url : '',
      method: error.config ? error.config.method : '',
      time: Date.now(),
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
    printRes('返回内容, list', response.data.data.list)
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
  'color: #333',
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
