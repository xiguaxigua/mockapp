<template>
  <div class="settings-dialog">
    <el-form label-width="80px">
      <el-form-item label="数据位置">
        {{ dataPosition }}
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { remote } from 'electron'

export default {
  data () {
    return {
      dataPosition: ''
    }
  },

  methods: {
    init () {
      const APP = remote.app
      const STORE_PATH = APP.getPath('userData')
      this.dataPosition = `${STORE_PATH}/mockapp-data.json`
    }
  },

  mounted () {
    this.init()
  }
}
</script>