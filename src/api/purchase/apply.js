import request from '@/utils/request'

// 查询采购申请 列表
export function listApply(query) {
    return request({
        url: '/purchase/apply/list',
        method: 'get',
        params: query
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
        data
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

// 删除采购申请 
export function delApply(id) {
    return request({
        url: '/purchase/apply/' + id,
        method: 'delete'
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

// 查看项目标的的列表
export function listProjects(query) {
    return request({
        url: '/purchase/apply/contractProjectList',
        method: 'get',
        params: query
    })
}

export function startApplyProcess(query) {
    return request({
        url:'/purchase/apply/start',
        method:'post',
        data: query
    })
}