import request from '../utils/request'

export function fetchList(query) {
  return request({
    url: '/categories/',
    method: 'get',
    params: query
  })
}

export function fetchCategory(id) {
  return request({
    url: `category/${id}/`,
    method: 'get'
  })
}

export function createCategory(data) {
  return request({
    url: '/category/',
    method: 'post',
    data
  })
}

export function updateCategory(id, data) {
  return request({
    url: `category/${id}/`,
    method: 'put',
    data
  })
}
