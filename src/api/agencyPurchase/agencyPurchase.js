import request from '@/utils/request'

// 查询代理采购 列表
export function listAgencyPurchase(query) {
    return request({
        url: '/agencyPurchase/agencyPurchase/list',
        method: 'get',
        params: query
    })
}

// 查询代理采购 详细
export function getAgencyPurchase(id) {
    return request({
        url: '/agencyPurchase/agencyPurchase/' + id,
        method: 'get'
    })
}

// 新增代理采购 
export function addAgencyPurchase(data) {
    return request({
        url: '/agencyPurchase/agencyPurchase',
        method: 'post',
        data: data
    })
}

// 修改代理采购 
export function updateAgencyPurchase(data) {
    return request({
        url: '/agencyPurchase/agencyPurchase',
        method: 'put',
        data: data
    })
}

// 删除代理采购 
export function delAgencyPurchase(id) {
    return request({
        url: '/agencyPurchase/agencyPurchase/' + id,
        method: 'delete'
    })
}

// 导出代理采购 
export function exportAgencyPurchase(query) {
    return request({
        url: '/agencyPurchase/agencyPurchase/export',
        method: 'get',
        params: query
    })
}