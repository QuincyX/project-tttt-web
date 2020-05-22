import { AxiosResponse } from 'axios'

declare module 'axios/types/axios' {
  interface AxiosResponse {
    page?: any
    list?: any[]
  }
}
