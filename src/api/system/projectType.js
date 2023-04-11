import request from '@/utils/request'

// 查询项目分类列表
export function listProjectType(query) {
  return request({
    url: '/system/projectType/list',
    method: 'get',
    params: query
  })
}

// 查询项目分类列表（排除节点）
export function listProjectTypeExcludeChild(id) {
  return request({
    url: '/system/projectType/list/exclude/' + id,
    method: 'get'
  })
}

// 项目 树结构列表 
export function projectTypeTreeselect() {
  return request({
      url: '/system/projectType/treeselect',
      method: 'get',
  })
}

// 查询项目分类详细
export function getProjectType(id) {
  return request({
    url: '/system/projectType/' + id,
    method: 'get'
  })
}

// 查询项目分类下拉树结构
export function treeselect() {
  return request({
    url: '/system/projectType/treeselect',
    method: 'get'
  })
}

// 根据角色ID查询项目分类树结构
export function roleProjectTypeTreeselect(roleId) {
  return request({
    url: '/system/projectType/roleProjectTypeTreeselect/' + roleId,
    method: 'get'
  })
}

// 新增项目分类
export function addProjectType(data) {
  return request({
    url: '/system/projectType',
    method: 'post',
    data: data
  })
}

// 修改项目分类
export function updateProjectType(data) {
  return request({
    url: '/system/projectType',
    method: 'put',
    data: data
  })
}

// 删除项目分类
export function delProjectType(id) {
  return request({
    url: '/system/projectType/' + id,
    method: 'delete'
  })
}