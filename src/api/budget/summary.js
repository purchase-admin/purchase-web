//发起流程
import request from '@/utils/request'

export function startSummaryProcess(query) {
  return request({
    url: '/budget/summary/start',
    method:'post',
    data: query
  })
}
