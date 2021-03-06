const isDev = process.env.NODE_ENV === 'development'

export function log(val1 = '>>>>>>>>', val2?: any) {
  if (isDev) {
    if (val2 || typeof val2 === 'boolean') {
      colorLog(`👇🏻 ${val1}`)
      console.log(val2)
    } else {
      const t = typeof val1
      if (t !== 'object' && t !== 'function') {
        colorLog(val1)
      } else {
        colorLog('👇🏻')
        console.log(val1)
      }
    }
  }
}
log.trace = () => {
  if (isDev) {
    try {
      // @ts-ignore
      THIS_IS_AN_ERROR++
    } catch (e) {
      const traceList = e.stack.split('\n')
      let n = traceList.length > 4 ? 2 : 1
      const traceLine = traceList[n].match(/\((.+?)\)/g)[0]
      if (traceLine) {
        const r = traceLine.split(':')
        const v = r[1].split('?')
        let o
        if (v.length > 3) {
          o = v[2].replace('!', '')
        } else {
          o = v[0]
        }
        console.log(
          `%cTrace >>>>> %cLine: ${r[r.length - 2]} %c ${o} `,
          'background: #2ed573;color: white;padding:3px 12px;border-radius:20px 0 0 20px;',
          'background: #ffa502;color: white;padding:3px 12px;border-radius:0;',
          'background: #1e90ff;color: white;padding:3px 12px;border-radius:0 20px 20px 0;'
        )
        console.log(traceLine)
      }
    }
  }
}
function colorLog(val: any) {
  console.log(
    `%cDebug info%c${val}`,
    'background: #ffa502;color: white;padding:3px 12px;border-radius:20px 0 0 20px;',
    'background: #1e90ff;color: white;padding:3px 12px;border-radius:0 20px 20px 0;'
  )
}

export function getCurlScript(payload: any) {
  if (payload) {
    console.log(payload?.config.params)

    const headers = payload?.config?.headers || {}
    let curl = `curl -X ${payload?.config?.method.toUpperCase()} `
    let url = `${payload?.config?.baseURL || ''}${payload?.config?.url}`
    if (payload?.config?.params) {
      url += '?'
      for (let i in payload?.config?.params) {
        url += `${i}=${payload?.config?.params[i]}&`
      }
      if (url.substring(url.length - 1) === '&') {
        url = url.substring(0, url.length - 1)
      }
    }
    curl += `'${url}' `
    for (let i in headers) {
      if (i.toLowerCase() !== 'content-length') {
        curl += `-H '${i}: ${headers[i]}' `
      }
    }
    if (
      payload?.config?.method === 'post' ||
      payload?.config?.method === 'put'
    ) {
      curl += `-d '${JSON.stringify(payload?.config?.data)}'`
    }
    return curl
  } else {
    return ``
  }
}
