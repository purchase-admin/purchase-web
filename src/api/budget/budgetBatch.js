import request from '@/utils/request'

// 查询批处理采购预算 列表
export function list(query) {
    return request({
        url: '/budgetBatch/batch/list',
        method: 'get',
        params: query
    })
}

export function getById(id) {
    return request({
        url: '/budgetBatch/batch/'+id,
        method: 'get',
    })
}
// 新增批处理采购预算
export function add(data) {
  return request({
      url: '/budgetBatch/batch',
      method: 'post',
      data: data
  })
}

// 删除批处理采购预算
export function del(id) {
  return request({
      url: '/budgetBatch/batch/' + id,
      method: 'delete'
  })
}
//发起预算汇总流程
export function startBudgetBatchProcess(query) {
  return request({
    url:'/budgetBatch/batch/start',
    method:'post',
    data: query
  })
}

// 退回采购预算批处理中的一条
export function submitBackTask(query) {
  return request({
    url:'/budgetBatch/batch/back-to-resubmit',
    method:'post',
    data: query
  })
}