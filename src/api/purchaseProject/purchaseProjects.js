import request from '@/utils/request'

// 查询采购申请项目 列表
export function listPurchaseProjects(query) {
    return request({
        url: '/purchaseProject/purchaseProjects/list',
        method: 'get',
        params: query
    })
}

// 查询采购申请项目 详细
export function getPurchaseProjects(id) {
    return request({
        url: '/purchaseProject/purchaseProjects/' + id,
        method: 'get'
    })
}

// 新增采购申请项目 
export function addPurchaseProjects(data) {
    return request({
        url: '/purchaseProject/purchaseProjects',
        method: 'post',
        data: data
    })
}

// 修改采购申请项目 
export function updatePurchaseProjects(data) {
    return request({
        url: '/purchaseProject/purchaseProjects',
        method: 'put',
        data: data
    })
}

// 删除采购申请项目 
export function delPurchaseProjects(id) {
    return request({
        url: '/purchaseProject/purchaseProjects/' + id,
        method: 'delete'
    })
}

// 导出采购申请项目 
export function exportPurchaseProjects(query) {
    return request({
        url: '/purchaseProject/purchaseProjects/export',
        method: 'get',
        params: query
    })
}