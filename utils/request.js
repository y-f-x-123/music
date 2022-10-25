import store from 'store'

const BASE_URL = 'http://localhost:3000'
export const request = options => {
  // console.log(uni.getStorageSync('music_cookie'));
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + options.url, //默认本地，并非真实接口地址。
      data: options.data,
      method: options.method || 'get',
      header: {
        ...options.header,
        cookie: uni.getStorageSync('music_cookie') || '',
      },
      withCredentials: true,
      success: res => {
        resolve(res.data)
      },
      fail: error => {
        reject(error)
      },
    })
  })
}
