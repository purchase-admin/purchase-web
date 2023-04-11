import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/workflow/run/tasks2',
    method: 'get',
    params: query
  })
}

export function listRecordByTask(params) {
  return request({
    url: '/workflow/history/task/record/' + params,
    method: 'get'
  })
}
export function listRecord(params) {
  return request({
    url: '/workflow/history/record/' + params,
    method: 'get'
  })
}

