import request from '../utils/request'

export function fetchList(query) {
  return request({
    url: '/post/',
    method: 'get',
    params: query
  })
}

export function fetchCategory(id) {
  return request({
    url: `post/${id}/`,
    method: 'get'
  })
}

export function createCategory(data) {
  return request({
    url: '/post/',
    method: 'post',
    data
  })
}

export function updateCategory(id, data) {
  return request({
    url: `post/${id}/`,
    method: 'put',
    data
  })
}

export function deleteCategory(id) {
  return request({
    url: `post/${id}/`,
    method: 'delete'
  })
}
