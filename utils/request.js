const BASE_URL = 'http://localhost:3000'

export const request = (options) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + options.url, //默认本地，并非真实接口地址。
      data: options.data,
      header: {
        'custom-header': 'hello', //自定义请求头信息
        ...options.header
      },
      success: (res) => {
        resolve(res.data)
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}
