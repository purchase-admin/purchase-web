import request from '@/utils/request'

// task action
/**
 * task submit
 * @param taskId task id
 * @param params comment,opinion
 * @returns action status
 */
export function submitTask(taskId, params) {
  return request({
    url: '/workflow/run/tasks/'+taskId+'/submit/',
    method: 'post',
    data: params
  })
}
