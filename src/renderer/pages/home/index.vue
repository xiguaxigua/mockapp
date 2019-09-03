<template>
  <div class="page-home">
    <sidebar key="projects" :options="projects" :selected.sync="projectSelected" />
    <div class="path-content">
      <div class="status-content">
        <el-switch v-model="status" />
      </div>
      <div class="status-content">
        <el-button @click="addNewPath">新增路径</el-button>
      </div>
      <sidebar key="paths" :options="paths" :selected.sync="pathSelected" />
    </div>
    <div class="page-content">
      <content-editor :form="currentItem" @confirm="confirm" @del="deleteItem" />
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
import { find, noop, findIndex } from 'lodash'

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
      visible: false
    }
  },

  computed: {
    currentItem ({ projectSelected, pathSelected, allData }) {
      if (!projectSelected || !pathSelected || !allData) return null
      const currEnv = find(this.allData, { env: projectSelected })
      return find(currEnv.data, { path: pathSelected })
    },
    selectedEnv ({ projectSelected }) {
      return find(this.allData, { env: projectSelected })
    }
  },

  methods: {
    init () {
      const data = db.get('mockData').value()
      this.allData = data
      this.initProjects(data)
      this.initPaths(data)
    },
    initProjects (data) {
      this.projects = data.map(({ env }) => env)
      this.projectSelected = this.projects[0]
    },
    initPaths (data, selected) {
      this.paths = data[0].data.map(({ path }) => path)
      this.pathSelected = selected ? selected.path : this.paths[0]
    },
    save () {
      db.set('mockData', this.allData).write()
      restart(this.selectedEnv.data)
    },
    confirm (v) {
      const { path } = v
      if (this.paths.includes(path)) {
        this.$message('路径存在重复，请检查~')
        return
      }

      const { projectSelected, pathSelected } = this
      const currEnv = find(this.allData, { env: projectSelected })
      const currPathIndex = findIndex(currEnv.data, { path: pathSelected })
      currEnv.data[currPathIndex] = v

      this.save()
      this.initPaths(this.allData, v)
    },
    getDefaultContent () {
      return {
        path: `/${Date.now()}`,
        method: 'get',
        content: {}
      }
    },
    addNewPath () {
      const { projectSelected, pathSelected } = this
      const currEnv = find(this.allData, { env: projectSelected })
      currEnv.data.push(this.getDefaultContent())

      this.save()
      this.initPaths(this.allData, { path: pathSelected })
    },
    deleteItem () {
      this.$confirm('是否确认删除？').then(() => {
        const { projectSelected, pathSelected } = this
        const currEnv = find(this.allData, { env: projectSelected })
        const currPathIndex = findIndex(currEnv.data, { path: pathSelected })
        currEnv.data.splice(currPathIndex, 1)

        this.save()
        this.initPaths(this.allData)
      }, noop)
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

  .settings-btn {
    position: fixed;
    left: 5px;
    bottom: 5px;
  }

  .path-content {
    width: 150px;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #eee;

    .status-content {
      text-align: center;
      border-bottom: 1px solid #eee;
      height: 50px;
      line-height: 50px;
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