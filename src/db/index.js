import Datastore from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import fs from 'fs-extra'
import { app, remote } from 'electron'

const defaultData = {
  mockData: [
    {
      env: 'env',
      data: [
        {
          path: `/${Date.now()}`,
          method: 'get',
          content: {}
        }
      ]
    }
  ]
}

const APP = process.type === 'renderer' ? remote.app : app

const STORE_PATH = APP.getPath('userData') // 获取electron应用的用户目录

if (!fs.pathExistsSync(STORE_PATH)) { // 如果不存在路径
  fs.mkdirpSync(STORE_PATH) // 就创建
}

const adapter = new FileSync(path.join(STORE_PATH, '/mockapp-data.json')) // 初始化lowdb读写的json文件名以及存储路径

const db = Datastore(adapter) // lowdb接管该文件

db.defaults(defaultData).write()

export default db // 暴露出去
