<template>
  <div class="page-home">
    <vue-json-editor
      v-model="json"
      mode="code"
      @json-change="onJsonChange">
    </vue-json-editor>
    <el-button @click="start">start</el-button>
    <el-button @click="stop">stop</el-button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import db from '../../../db'
import vueJsonEditor from 'vue-json-editor'
import { start, stop } from '../../utils/server'

export default {
  components: { vueJsonEditor },

  data () {
    return {
      json: {}
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

<style lang="sass">

</style>