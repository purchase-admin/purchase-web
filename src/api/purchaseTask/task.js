import request from '@/utils/request'

//查询采购询价列表
export function listPurchaseTaskToDolistTask(query) {
    return request({
        url: '/purchaseTask/task/getPurchaseTaskToDo',
        method: 'get',
        params: query
    })
}

//新增采购询价信息
export function addPurchaseTaskToDolistTask(data) {
    return request({
        url: '/inquiryPurchase/purchase',
        method: 'post',
        data: data
    })
}

//新增采购询价信息 (公开招标)
export function addPurchaseTaskToDolistTaskOpen(data) {
    return request({
        url: '/purchaseTask/task',
        method: 'put',
        data: data
    })
}

//作废（重置）采购询价信息
export function resetPurchaseTaskToDolistTask(data) {
    return request({
        url: '/inquiryPurchase/purchase/remove',
        method: 'post',
        data: data
    })
}

//作废（重置）采购询价信息 (公开招标)
export function resetPurchaseTaskToDolistTaskOpen(data) {
    return request({
        url: '/purchaseTask/task/cancel',
        method: 'post',
        data: data
    })
}

// 查询采购任务 列表
export function listTask(query) {
    return request({
        url: '/purchaseTask/task/list',
        method: 'get',
        params: query
    })
}

// 查询采购任务 详细
export function getTask(id) {
    return request({
        url: '/purchaseTask/task/' + id,
        method: 'get'
    })
}

// 新增采购任务 
export function addTask(data) {
    return request({
        url: '/purchaseTask/task',
        method: 'post',
        data: data
    })
}

// 修改采购任务 
export function updateTask(data) {
    return request({
        url: '/purchaseTask/task',
        method: 'put',
        data: data
    })
}

// 删除采购任务 
export function delTask(id) {
    return request({
        url: '/purchaseTask/task/' + id,
        method: 'delete'
    })
}

// 导出采购任务 
export function exportTask(query) {
    return request({
        url: '/purchaseTask/task/export',
        method: 'get',
        params: query
    })
}