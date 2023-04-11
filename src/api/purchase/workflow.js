import request from '@/utils/request'

// 获取流程模型 列表
export function listApply(query) {
    return request({
        url: '/workflow/models/list',
        method: 'get',
        params: query
    })
}
// 获取指定流程模型的历史列表
export function listHistoryApply(id,query) {
  return request({
      url: `/workflow/model/${id}/history`,
      method: 'get',
      params: query
  })
}
// 新增or编辑流程模型 
export function saveBpmnApply(data) {
  return request({
      url: '/workflow/models/save' ,
      method: 'post',
      data: data
  })
  // if(data.id){

  // }else{
  //   return request({
  //       url: '/workflow/models/save' ,
  //       method: 'post',
  //       data: data
  //   })
  // }
}

// 获取流程模型的实例用于回显 
export function getBpmnModelApply(id) {
  return request({
      url: `/repository/models/${id}/source`,
      method: 'get',
  })
}

// 获取历史版本流程模型的实例用于回显 
export function getBpmnHistoryModelApply(id,hid) {
  return request({
      url: `/repository/deployments/${id}/resourcedata/${hid}`,
      method: 'get',
  })
}
// 部署流程模型 
export function deployBpmnModelApply(id) {
  return request({
      url: `workflow/models/deploy/${id}`,
      method: 'post',
  })
}

// 删除流程模型
export function delApply(id) {
  return request({
      url: '/repository/models/' + id,
      method: 'delete'
  })
}

// 查询采购申请 详细
export function getApply(id) {
    return request({
        url: '/purchase/apply/' + id,
        method: 'get'
    })
}

// 新增采购申请 
export function addApply(data) {
    return request({
        url: '/purchase/apply',
        method: 'post',
        data: data
    })
}

// 修改采购申请 
export function updateApply(data) {
    return request({
        url: '/purchase/apply',
        method: 'put',
        data: data
    })
}



// 导出采购申请 
export function exportApply(query) {
    return request({
        url: '/purchase/apply/export',
        method: 'get',
        params: query
    })
}