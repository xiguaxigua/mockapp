<template>
  <div class="page-home">
    <sidebar key="projects" :options="projects" :selected.sync="projectSelected" />
    <div class="path-content">
      <div class="status-content">
        <el-switch v-model="status" />
      </div>
      <sidebar key="paths" :options="paths" :selected.sync="pathSelected" />
    </div>
    <div class="page-content">
      <content-editor :form="currentItem" @confirm="confirm" />
    </div>
  </div>
</template>

<script>
import db from '../../../db'
import { start, stop, restart } from '../../utils/server'
import Sidebar from '../../components/sidebar'
import ContentEditor from './content-editor'

export default {
  components: { Sidebar, ContentEditor },

  data () {
    return {
      status: false,
      projects: [],
      paths: [],
      projectSelected: null,
      pathSelected: null,
      addData: null
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
    }
  },

  watch: {
    status (v) {
      v ? start(this.selectedEnv) : stop()
    }
  },

  mounted () {
    this.init()
    // const data = db.get('mockData').value()
    // console.log(data)
    // db.get('mockData').set('env1', {}).write()
    // console.log(db.get('mockData').value())
    // console.log(this.projects)
  }
}
</script>

<style lang="scss">
.page-home {
  height: 100%;
  display: flex;

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