<template>
  <div class="page-home">
    <sidebar key="projects" :options="projects" />
    <div class="path-content">
      <div class="status-content">
        <el-switch v-model="status" />
      </div>
      <sidebar key="paths" :options="paths" @select="pathSelect" />
    </div>
    <div class="page-content">
      <el-form label-width="80px">
        <el-form-item label="路径">
          <el-input v-model="form.path"></el-input>
        </el-form-item>
        <el-form-item label="方式">
          <selector :options="methodsList" v-model="form.method"/>
        </el-form-item>
        <el-form-item label="内容">
          <vue-json-editor
            v-model="json"
            mode="code">
          </vue-json-editor>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">保存</el-button>
          <el-button type="text">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import db from '../../../db'
import vueJsonEditor from 'vue-json-editor'
import { start, stop } from '../../utils/server'
import Sidebar from '../../components/sidebar'
import Selector from '../../components/selector'
import { METHODS_LIST } from './data'

export default {
  components: { vueJsonEditor, Sidebar, Selector },

  data () {
    this.methodsList = METHODS_LIST
    return {
      json: {},
      status: false,
      form: {
        path: '',
        method: METHODS_LIST[0].value
      }
    }
  },

  computed: {
    ...mapState({
      projects: state => state.Mock.projects,
      paths: state => state.Mock.paths
    })
  },

  methods: {
    onJsonChange (v) {
      console.log(v)
    },
    start () {
      start()
    },
    stop () {
      stop()
    },
    pathSelect (option) {
      console.log('pathselect', option)
    }
  },

  watch: {
    status (v) {
      v ? start() : stop()
    }
  },

  mounted () {
    const data = db.get('mockData').value()
    console.log(data)
    db.get('mockData').set('env1', {}).write()
    console.log(db.get('mockData').value())
    console.log(this.projects)
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