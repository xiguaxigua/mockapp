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
      <content-editor @confirm="confirm" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import db from '../../../db'
import { start, stop } from '../../utils/server'
import Sidebar from '../../components/sidebar'
import ContentEditor from './content-editor'

export default {
  components: { Sidebar, ContentEditor },

  data () {
    return {
      status: false
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
    },
    confirm (v) {
      console.log('confirmchange', v)
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