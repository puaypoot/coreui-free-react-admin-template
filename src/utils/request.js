import axios from 'axios'

// create an axios instance
const service = axios.create({
  baseURL: 'http://localhost/api/dashboard', // api 的 base_url
  timeout: 5000 // request timeout
})

// // request interceptor
// service.interceptors.request.use(
//   // config => {
//   //   if (store.getters.token) {
//   //     config.headers['X-Token'] = getToken()
//   //   }
//   //   return config
//   // },
//   error => {
//     // Do something with request error
//     console.log(error) // for debug
//     Promise.reject(error)
//   }
// )

// response interceptor
service.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(error)
  }
)

export default service
