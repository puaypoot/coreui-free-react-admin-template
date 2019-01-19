import request from '../utils/request'

export function fetchList(query) {
  return request({
    url: '/categories/',
    method: 'get',
    params: query
  })
}

export function fetchCategory(slug) {
  return request({
    url: `category/${slug}/`,
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

export function updateCategory(data) {
  return request({
    url: '/category/update',
    method: 'put',
    data
  })
}
