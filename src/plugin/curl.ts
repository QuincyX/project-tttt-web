'use strict'

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

const instance = axios.create({
  timeout: 20 * 1000,
  withCredentials: false
})

instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return Promise.resolve(response)
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

export default instance
