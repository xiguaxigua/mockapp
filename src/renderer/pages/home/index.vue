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
      let result = null
      this.allData.some(({ env, data }) => {
        if (env === projectSelected) {
          data.some(d => {
            if (d.path === pathSelected) {
              result = d
              return true
            }
          })
          return true
        }
      })
      return result
    },
    selectedEnv ({ projectSelected }) {
      let result = null
      this.allData.some(({ env, data }) => {
        if (env === projectSelected) {
          result = data
          return true
        }
      })
      return result
    }
  },

  methods: {
    init () {
      const data = db.get('mockData').value()
      this.allData = data
      this.projects = data.map(({ env }) => env)
      this.projectSelected = this.projects[0]
      this.initList(data)
    },
    initList (data, selected) {
      this.paths = data[0].data.map(({ path }) => path)
      this.pathSelected = selected ? selected.path : this.paths[0]
    },
    confirm (v) {
      const { projectSelected, pathSelected } = this
      this.allData.some(({ env, data }) => {
        if (env === projectSelected) {
          data.some((d, index) => {
            if (d.path === pathSelected) {
              data[index] = v
              return true
            }
          })
          return true
        }
      })
      db.set('mockData', this.allData).write()
      restart(this.selectedEnv)
      this.initList(this.allData, v)
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
      this.allData.some(({ env, data }) => {
        if (env === projectSelected) {
          data.push(this.getDefaultContent())
          return true
        }
      })
      db.set('mockData', this.allData).write()
      restart(this.selectedEnv)
      this.initList(this.allData, { path: pathSelected })
    },
    deleteItem () {
      this.$confirm('是否确认删除？').then(() => {
        const { projectSelected, pathSelected } = this
        this.allData.some(({ env, data }) => {
          if (env === projectSelected) {
            data.some((d, index) => {
              if (d.path === pathSelected) {
                data.splice(index, 1)
                return true
              }
            })
            return true
          }
        })
        db.set('mockData', this.allData).write()
        restart(this.selectedEnv)
        this.initList(this.allData)
      }, () => {})
    },
    showSettings () {
      this.visible = true
    }
  },

  watch: {
    status (v) {
      v ? start(this.selectedEnv) : stop()
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