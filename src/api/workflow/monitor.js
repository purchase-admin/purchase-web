import request from '@/utils/request'

export function list(query) {
  console.log(query)
  return request({
    url: '/workflow/run/process-instances',
    method: 'get',
    params: query
  })
// return static_data
}

export function detailList() {
  return static_data
}

export const static_data = {
  rows: [
    {
      category: 1,
      projectName: '电脑',
      number: 100,
      money: '1,000',
      size: '笔记本',
      moneyFrom: '固有资金',
      startTime: '2020-04-08 11:10',
      starter: 'admin'
    },
    {
      category: 5,
      projectName: '电脑',
      number: 10,
      money: '5,000',
      size: '台式机',
      moneyFrom: '固有资金',
      startTime: '2020-04-08 11:10',
      starter: 'admin'
    }
  ]
}

export function migrationProcessInstance(data) {
  return request({
    url: '/workflow/run/migration',
    method: 'post',
    data: data
  })
}
