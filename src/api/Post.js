import request from '../utils/request'

export function fetchList(query) {
  return request({
    url: '/posts/',
    method: 'get',
    params: query
  })
}

export function fetchPost(id) {
  return request({
    url: `post/${id}/`,
    method: 'get'
  })
}

export function createPost(data) {
  return request({
    url: '/post/',
    method: 'post',
    data
  })
}

export function updatePost(id, data) {
  return request({
    url: `post/${id}/`,
    method: 'put',
    data
  })
}

export function deletePost(id) {
  return request({
    url: `post/${id}/`,
    method: 'delete'
  })
}
