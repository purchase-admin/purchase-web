import request from '@/utils/request'

// 查询合同管理 列表
export function listContract(query) {
    return request({
        url: '/contract/contract/list',
        method: 'get',
        params: query
    })
}

// 查询合同管理 详细
export function getContract(id) {
    return request({
        url: '/contract/contract/' + id,
        method: 'get'
    })
}

// 新增合同管理 
export function addContract(data) {
    return request({
        url: '/contract/contract',
        method: 'post',
        data: data
    })
}

// 修改合同管理 
export function updateContract(data) {
    return request({
        url: '/contract/contract',
        method: 'put',
        data: data
    })
}

// 删除合同管理 
export function delContract(id) {
    return request({
        url: '/contract/contract/' + id,
        method: 'delete'
    })
}

// 导出合同管理 
export function exportContract(query) {
    return request({
        url: '/contract/contract/export',
        method: 'get',
        params: query
    })
}