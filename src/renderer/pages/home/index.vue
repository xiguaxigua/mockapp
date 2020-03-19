<template>
  <div class="page-home">
    <div class="path-content">
      <div class="status-content ip-container">
        {{ip}}:9527
      </div>
      <div class="status-content">
        <label>服务状态：</label>
        <el-switch
          active-color="#13ce66"
          inactive-color="#909399"
          v-model="status" />
      </div>
      <div class="status-content center">
        <el-button
          type="primary"
          icon="el-icon-circle-plus"
          @click="addNewPath">
          新增路径
        </el-button>
      </div>
      <sidebar key="paths" :options="paths" :selected.sync="pathSelected" />
    </div>
    <div class="page-content">
      <content-editor
        :form="currentItem"
        @confirm="confirm"
        @del="deleteItem" />
    </div>
    <el-button
      type="primary"
      class="settings-btn"
      icon="el-icon-setting"
      circle
      @click="showSettings" />
    <el-dialog :visible.sync="visible" title="设置">
      <settings-dialog />
    </el-dialog>
  </div>
</template>

<script>
import db from '../../../db'
import { start, stop, restart } from '../../utils/server'
import Sidebar from '../../components/sidebar'
import ContentEditor from './content-editor'
import SettingsDialog from './settings-dialog'
import { find, findIndex } from 'lodash'
import ip from 'ip'

export const getRandomId = _ => `${Date.now()}${(Math.random() * 1e5).toFixed()}`

export default {
  components: { Sidebar, ContentEditor, SettingsDialog },

  data () {
    return {
      status: false,
      projects: [],
      paths: [],
      projectSelected: null,
      pathSelected: null,
      addData: null,
      visible: false,
      currPort: 9527,
      ip: ip.address()
    }
  },

  computed: {
    currentItem ({ projectSelected, pathSelected, allData }) {
      if (!projectSelected || !pathSelected || !allData) return null
      const currEnv = find(this.allData, { env: projectSelected })
      return find(currEnv.data, { id: pathSelected.id })
    },
    selectedEnv ({ projectSelected }) {
      return find(this.allData, { env: projectSelected })
    }
  },

  methods: {
    init () {
      const data = db.get('mockData').value()
      this.allData = this.checkId(data)
      this.initProjects(data)
      this.initPaths(data)
    },
    checkId (data) {
      data[0].data = data[0].data.map(item => {
        if (!item.id) item.id = getRandomId()
        return item
      })
      return data
    },
    initProjects (data) {
      this.projects = data.map(({ env }) => env)
      this.projectSelected = this.projects[0]
    },
    initPaths (data, selected) {
      this.paths = data[0].data
      this.pathSelected = selected || this.paths[0]
    },
    save () {
      db.set('mockData', this.allData).write()
      restart(this.selectedEnv.data)
    },
    confirm (v) {
      const { projectSelected, pathSelected } = this

      const currEnv = find(this.allData, { env: projectSelected })
      const currPathIndex = findIndex(currEnv.data, { id: pathSelected.id })
      currEnv.data[currPathIndex] = v
      this.save()
      this.initPaths(this.allData, v)
      this.$message.success('保存成功')
    },
    getDefaultContent () {
      return {
        path: `/${Date.now()}`,
        id: getRandomId(),
        method: 'get',
        status: 200,
        time: 200,
        content: {}
      }
    },
    addNewPath () {
      const { projectSelected } = this
      const currEnv = find(this.allData, { env: projectSelected })
      currEnv.data.push(this.getDefaultContent())

      this.save()
      this.initPaths(this.allData, currEnv.data[currEnv.data.length - 1])
    },
    deleteItem () {
      const { projectSelected, pathSelected } = this
      const currEnv = find(this.allData, { env: projectSelected })
      const currPathIndex = findIndex(currEnv.data, { id: pathSelected.id })
      currEnv.data.splice(currPathIndex, 1)

      this.save()
      this.initPaths(this.allData)
    },
    showSettings () {
      this.visible = true
    }
  },

  watch: {
    status (v) {
      v ? start(this.selectedEnv.data) : stop()
    }
  },

  mounted () {
    this.init()
  }
}
</script>

<style lang="scss">
.page-home {
  height: 100%;
  display: flex;
  min-width: 700px;

  .settings-btn {
    position: fixed;
    left: 5px;
    bottom: 5px;
  }

  .ip-container {
    font-size: 14px;
    color: #666;
  }

  .path-content {
    width: 200px;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #eee;

    .port-input {
      width: 80px;
    } 

    .status-content {
      border-bottom: 1px solid #eee;
      height: 40px;
      line-height: 40px;
      padding-left: 5px;
      text-align: center;
    }

    .component-sidebar {
      flex: 1;
    }
  }

  .page-content {
    flex: 1;
    padding: 5px;

    .jsoneditor-vue {
      height: 400px;
    }
  }
}
</style>
