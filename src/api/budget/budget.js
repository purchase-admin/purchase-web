import request from '@/utils/request'

// 查询采购预算 列表
export function listBudget(query) {
    return request({
        url: '/budget/budget/list',
        method: 'get',
        params: query
    })
}
// 查询采购预算汇总(年度汇总) 列表
export function listCollectBudget(query) {
    return request({
        // /dev-api/
        url: '/budget/summary',
        method: 'get',
        params: query
    })
}
//  查询采购预算汇总(年度汇总)实例的详情列表
export function listCollectBudgetList(id,query) {
    return request({
        // /dev-api/
        url: '/budget/summary/detail/'+id,
        method: 'get',
        params: query
    })
}
//  删除采购预算汇总(年度汇总)实例的详情列表一列
export function deleteListCollectBudgetList(id,ids) {
    return request({
        // /dev-api/
        url: `/budget/summary/${id}/data/${ids}`,
        method: 'delete',
    })
}
//  查询采购预算汇总(年度汇总)实例的详情列表（专门用于查看按钮，点击标题查看）
export function seeListCollectBudgetList(id,query) {
    return request({
        // /dev-api/
        url: `/budget/summary/detail/${id}`,
        method: 'get',
        params: query
    })
}
//  查询采购预算汇总(年度汇总)实例的批数据
export function getById(id) {
    return request({
        url: '/budget/summary/'+id,
        method: 'get',
    })
}
// 新增采购预算汇总 (年度汇总)
export function addListCollectBudget(query) {
    return request({
        // /dev-api/
        url: '/budget/summary',
        method: 'post',
        data: query
    })
}
// 修改采购预算汇总 (年度汇总)
export function updateListCollectBudget(query) {
    return request({
        // /dev-api/
        url: '/budget/summary/'+query.id,
        method: 'put',
        data: query
    })
}
// 删除采购预算汇总 (年度汇总)
export function deleteListCollectBudget(ids) {
    return request({
        // /dev-api/
        url: '/budget/summary/'+ids,
        method: 'delete',
    })
}
// 查询采购预算 详细
export function getBudget(id) {
    return request({
        url: '/budget/budget/' + id,
        method: 'get'
    })
}

// 新增采购预算
export function addBudget(data) {
    return request({
        url: '/budget/budget',
        method: 'post',
        data: data
    })
}

// 修改采购预算
export function updateBudget(data) {
    return request({
        url: '/budget/budget',
        method: 'put',
        data: data
    })
}

// 删除采购预算
export function delBudget(id) {
    return request({
        url: '/budget/budget/' + id,
        method: 'delete'
    })
}

// 导出采购预算
export function exportBudget(query) {
    return request({
        url: '/budget/budget/export',
        method: 'get',
        params: query
    })
}