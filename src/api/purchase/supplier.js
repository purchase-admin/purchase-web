
import request from '@/utils/request'

// 获取供应商 列表
export function listSupplier(query) {
    return request({
        url: '/supplier/supplier/list',
        method: 'get',
        params: query
    })
}
// 获取供应商列表 询价采购详情 查询供应商列表特定版
export function newListSupplier(query) {
    return request({
        url: '/supplier/supplier/relation-supplier',
        method: 'get',
        params: query
    })
}
//获得中标资格的供应商
export function listSupplierConfirm(query) {
    return request({
        url: '/inquiryPurchase/purchase/list',
        method: 'get',
        params: query
    })
}

// 选择供应商中标 (询价和评选采购)
export function changeSupplierConfirmCheck(data) {
    return request({
        url: '/inquiryPurchase/purchase/chooseSupplier2',
        method: 'post',
        data: data
    })
}

//评选和询价的取消中标接口 
export function changeSupplierCheckCancel(data) {
    return request({
        url: '/inquiryPurchase/purchase/cancel',
        method: 'post1',
        data: data
    })
}

//补充 询价供应商中标信息
export function addSupplierConfirmInfo(data) {
    return request({
        url: '/purchaseTask/task/isSure2',
        method: 'post',
        data: data
    })
}
