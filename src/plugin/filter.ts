// @ts-nocheck
import Vue from 'vue'

const filters = {
  /**
   * 日期格式化
   * @param {*} val 日期字符串、GMT时间、时间戳
   * @returns {String} yyyy-mm-dd
   */
  formatDate: (val) => {
    if (val) {
      if (typeof val === 'string') {
        val = val.replace(/-/g, '/')
      }
      let date = new Date(val)
      return (
        date.getFullYear() +
        '-' +
        (date.getMonth() < 9
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) +
        '-' +
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
      )
    } else {
      return '-'
    }
  },
  formatYear: (val) => {
    if (val) {
      if (typeof val === 'string') {
        val = val.replace(/-/g, '/')
      }
      let date = new Date(val)
      return date.getFullYear()
    } else {
      return '-'
    }
  },
  /**
   * 包含时间的日期格式化
   * @param {*} val 日期字符串、GMT时间、时间戳
   * @returns {String} yyyy-mm-dd hh:mm
   */
  formatFullDate: (val) => {
    if (val) {
      if (String(val).length === 10) {
        val = val * 1000
      }
      let date = new Date(val)
      return (
        date.getFullYear() +
        '-' +
        (date.getMonth() < 9
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) +
        '-' +
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
        ' ' +
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
        ':' +
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
      )
    } else {
      return '-'
    }
  },
  /**
   * 时间戳格式化
   * @param {*} val 时间戳
   * @returns {String} hh:mm:ss
   */
  formatTime: (val) => {
    if (val) {
      let theTime = parseInt(val)
      if (theTime < 0) {
        theTime = Math.abs(theTime)
      }
      let theTime1 = 0
      let theTime2 = 0
      if (theTime > 60) {
        theTime1 = parseInt(theTime / 60)
        theTime = parseInt(theTime % 60)
        if (theTime1 > 60) {
          theTime2 = parseInt(theTime1 / 60)
          theTime1 = parseInt(theTime1 % 60)
        }
      }
      let result = '' + parseInt(theTime)
      if (theTime1 > 0) {
        result = '' + parseInt(theTime1) + ':' + result
      }
      if (theTime2 > 0) {
        result = '' + parseInt(theTime2) + ':' + result
      }
      return result
    } else {
      return '-'
    }
  },
  /**
   * 年龄格式化
   * @param {*} val 日期字符串、GMT时间、时间戳
   * @returns {Number} 年龄
   */
  formatAge: (val) => {
    if (val) {
      if (typeof val === 'string') {
        val = val.replace(/-/g, '/')
      }
      let date = new Date(val)
      let currentY = new Date().getFullYear()
      return currentY - date.getFullYear()
    } else {
      return '-'
    }
  },
  /**
   * 截取部分字符串
   * @param {String} val 需要截取的原始字符串
   * @returns {String} 截取后的字符串
   */
  sliceString: (val, length = 12) => {
    if (val && val.length > length) {
      return val.slice(0, length) + '...'
    } else {
      return val
    }
  },
  /**
   * 隐藏手机号中间四位数
   * @param {String || Number} num 手机号
   * @returns {String} 截取后的手机号
   */
  lockPhoneNumber: (num) => {
    let val = String(num)
    if (val && val.length === 11) {
      return (val = val.substr(0, 3) + '****' + val.substr(-4, 4))
    } else {
      return val
    }
  },
  /**
   * 获取传入的时间戳距离现在时间的描述
   * @param {timestamp} timestamp 时间戳
   * @param {Number} overDaysToShowTime 多少天之后就显示具体时间
   * @param {Boolean} simple 简单模式
   * @returns {String} 计算后的时间描述
   */
  formatLastDate: (timestamp, overDaysToShowTime = 365, simple = true) => {
    const d = new Date(timestamp)
    const _date = `${d.getFullYear()}/${d.getMonth() +
      1}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
    const dateTime = new Date(_date)
    const currentTime = new Date()
    let totalTime = currentTime.getTime() - dateTime.getTime()
    let _, years, months, weeks, days, hours, minutes
    const getNumber = () => Math.floor(totalTime / _)
    const modTimestamp = () => totalTime % _
    _ = 1000 * 60 * 60 * 24 * 365
    years = getNumber()
    totalTime = modTimestamp()
    _ = 1000 * 60 * 60 * 24 * 30
    months = getNumber()
    totalTime = modTimestamp()
    if (years > 0) return simple ? `${years}年前` : `${years}年${months}月前`
    _ = 1000 * 60 * 60 * 24 * 7
    weeks = getNumber()
    totalTime = modTimestamp()
    if (months > 0) return simple ? `${months}月前` : `${months}月${weeks}周前`
    _ = 1000 * 60 * 60 * 24
    days = getNumber()
    totalTime = modTimestamp()
    if (weeks > 0) return simple ? `${weeks}周前` : `${weeks}周${days}天前`
    _ = 1000 * 60 * 60
    hours = getNumber()
    totalTime = modTimestamp()
    if (days > 1 && days < 2) return simple ? `昨天` : `${days}天${hours}小时前`
    if (days > 2 && days < 3) return simple ? `前天` : `${days}天${hours}小时前`
    if (days > 0) return simple ? `${days}天前` : `${days}天${hours}小时前`
    _ = 1000 * 60
    minutes = getNumber()
    totalTime = modTimestamp()
    if (hours > 0)
      return simple ? `${hours}小时前` : `${hours}小时${minutes}分前`
    if (minutes > 0) return `${minutes}分钟前`
    return '刚刚'
  },
  /**
   * 格式化数量，超过千以千单位显示，超过万以万单位显示
   * @param {Number} val 数量
   * @returns {String}
   */
  filterCount: (val) => {
    if (!val || isNaN(val)) {
      if (typeof val === 'string') {
        return val
      }
      return 0
    } else if (val > 10000) {
      return parseFloat(val / 10000).toFixed(1) + '万'
    } else {
      return val
    }
  },
  /**
   * 补全七牛的静态资源地址
   * @param {String} val 七牛的key值
   * @returns {String}
   */
  formatStaticUrl: (val) => {
    if (val) {
      if (val.substring(0, 4) === 'http') {
        return val
      } else {
        return process.env.VUE_APP_BASE_STATIC_URL + val
      }
    } else {
      return ''
    }
  },
  /**
   * 七牛图片正方形缩略图200x200
   * @param {String} val 图片URL
   * @returns {String}
   */
  thumbSquare: (val, size = 200, height = size, split = false) => {
    //判断url是否是视频
    if (val && val.indexOf('vframe') > -1) {
      if (split) {
        val = val.split('?')[0]
      }
      return `${val}?vframe/jpg/offset/3/w/${size}`
    }
    if (val) {
      return val + `?imageView2/1/w/${size}/h/${height}`
    } else {
      return ''
    }
  },
  /**
   * 七牛图片缩略图等比缩放600
   * @param {String} val 图片URL
   * @returns {String}
   */
  thumbSquareFull: (val, size = 600) => {
    if (val) {
      return val + `?imageView2/3/w/${size}/h/${size}`
    } else {
      return ''
    }
  },
  /**
   * 七牛视频缩略图
   * @param {String} val 图片URL
   * @returns {String}
   */
  videoThumbPost: (val, time = 3) => {
    if (val) {
      return val + `?vframe/jpg/offset/${time}`
    } else {
      return ''
    }
  },
  /**
   * 手机号格式化
   * @param {String} numb 手机号
   * @returns {String}
   */
  phoneFilter: (numb) => {
    let num = numb.toString()
    if (num === '') return
    return num.replace(/^(.{3})(.*)(.{4})$/, '$1 $2 $3')
  },
  /**
   * 性别格式化
   * @param {Number} index 传入对应的性别下标
   * @return:
   */
  filterGender: (index) => {
    const list = [
      '外星人',
      '女性',
      '男性',
      '',
      '',
      '女性改为男性',
      '男性改为女性',
      '',
      '',
      '外星人'
    ]
    return list[index]
  },
  formatExamineStatus: (val) => {
    const list = ['审核中', '已通过', '已违规']
    return list[val]
  },
  formatShareType: (val) => {
    const list = ['', '微信', '朋友圈', 'QQ', 'QQ空间', '微博', '复制链接']
    return list[val]
  },
  formatUiAssetUrl: (val) => {
    return 'http://ui-asset.besmile.me/v1/' + val
  }
}

Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

export default filters
