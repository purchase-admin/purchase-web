import request from '@/utils/request'

// 根据文件id 下载文件
export function downloadFile(id, type) {
  return request({
      url: `/sys/storage/${id}/resource`,
      method: 'get',
      responseType: type
  })
}


/**
 * 上传文件  数据类型是FormData模拟表单提交键值对；也可以异步上传二进制文件。 
   原理：可以把所有表单元素的name与value组成一个queryString,提交到后台
 */
// 单个上传
export function uploadFile(data) {
  return request({
      url: '/sys/storage/single/upload',
      method: 'post2',
      data
  })
}
// 批处理上传
export function uploadFiles(data) {
  return request({
      url: '/sys/storage/batch/upload',
      method: 'post2',
      data
  })
}