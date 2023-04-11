import request from '@/utils/request'

// 查询供应商信息 供应商数据列表
export function listSupplier(query) {
    return request({
        url: '/supplier/supplier/list',
        method: 'get',
        params: query
    })
}

// 查询供应商信息 供应商数据详细
export function getSupplier(id) {
    return request({
        url: '/supplier/supplier/' + id,
        method: 'get'
    })
}

// 查询供应商的投标历史记录
export function getSupplierHistory(query) {
    return request({
        url: '/supplier/supplier/joinList',
        method: 'get',
        params: query
    })
}

// 新增供应商信息 供应商数据
export function addSupplier(data) {
    return request({
        url: '/supplier/supplier',
        method: 'post',
        data: data
    })
}

// 修改供应商信息 供应商数据
export function updateSupplier(data) {
    return request({
        url: '/supplier/supplier',
        method: 'put',
        data: data
    })
}

// 删除供应商信息 供应商数据
export function delSupplier(id) {
    return request({
        url: '/supplier/supplier/' + id,
        method: 'delete'
    })
}

// 导出供应商信息 供应商数据
export function exportSupplier(query) {
    return request({
        url: '/supplier/supplier/export',
        method: 'get',
        params: query
    })
}

// 导入供应商信息 批量导入供应商数据
export function importSupplier(data) {
    return request({
        url: '/supplier/supplier/import',
        method: 'post2',
        data
    })
}

// 下载供应商导入的模板
export function downloadSupplierModel(query) {
    return request({
        url: '/supplier/supplier/download',
        method: 'get1'
    })
}
