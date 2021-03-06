<template>
  <el-form label-width="80px">
    <el-form-item>
      <el-button @click="copy">复制链接</el-button>
      <el-button @click="open">在浏览器中打开链接</el-button>
    </el-form-item>
    <el-form-item label="请求">
      <selector
        class="method"
        :options="methodsList"
        v-model="formData.method" />
      <el-input class="path-input" v-model="formData.path" />
    </el-form-item>
    <el-form-item label="响应">
      <selector
        class="method"
        :options="responseList"
        v-model="formData.status"/>
      <el-input
        prefix-icon="el-icon-time"
        class="time-input"
        v-model="formData.time" />
    </el-form-item>
    <el-form-item label="内容">
      <vue-json-editor
        v-model="formData.content"
        mode="code">
      </vue-json-editor>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="confirm">保存</el-button>
      <el-button type="default" @click="reset">重置</el-button>
      <el-popover
        placement="top"
        width="160"
        v-model="visible">
        <p>确定删除吗？</p>
        <div style="text-align: right; margin: 0">
          <el-button
            size="mini"
            type="text"
            @click="visible = false">
            取消
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="del">
            确定
          </el-button>
        </div>
        <el-button
          class="delete-button"
          slot="reference"
          type="text">
          删除
        </el-button>
      </el-popover>
    </el-form-item>
  </el-form>
</template>

<script>
import { cloneDeep } from 'lodash'
import Selector from '../../../components/selector'
import vueJsonEditor from '../../../components/jsoneditor'
import { METHODS_LIST, RESPONSE_LIST } from '../data'
import copy from 'copy-to-clipboard'
import open from 'open'

export default {
  components: { Selector, vueJsonEditor },
  props: {
    form: {
      type: Object
    }
  },

  data () {
    this.methodsList = METHODS_LIST
    this.responseList = RESPONSE_LIST

    return {
      formData: {
        path: '',
        status: RESPONSE_LIST[0].value,
        method: METHODS_LIST[0].value,
        content: {},
        time: 200
      },
      visible: false
    }
  },

  computed: {
    link () {
      return `http://localhost:9527${this.formData.path}`
    }
  },

  watch: {
    form (v) {
      if (v) this.formData = cloneDeep(v)
    }
  },

  methods: {
    reset () {
      this.formData = cloneDeep(this.form)
    },

    confirm () {
      this.$emit('confirm', this.formData)
    },

    del () {
      this.visible = false
      this.$emit('del')
    },

    copy () {
      copy(this.link)
      this.$notify.success({
        title: '复制成功',
        duration: 1000
      })
    },

    open () {
      open(this.link)
    }
  }
}
</script>

<style lang="scss">
.path-input {
  width: 300px !important;
}

.time-input {
  width: 100px !important;
}

.method {
  width: 100px;
}

.delete-button {
  margin-left: 10px !important;
}

.el-form-item {
  margin-bottom: 10px !important;
}
</style>
