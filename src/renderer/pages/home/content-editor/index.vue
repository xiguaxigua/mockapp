<template>
  <el-form label-width="80px">
    <el-form-item>
      <el-button @click="copy">拷贝链接</el-button>
      <el-button @click="open">在浏览器中打开链接</el-button>
    </el-form-item>
    <el-form-item label="路径">
      <el-input v-model="formData.path"></el-input>
    </el-form-item>
    <el-form-item label="方式">
      <selector :options="methodsList" v-model="formData.method"/>
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
      <el-button type="text" @click="del">删除</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { cloneDeep } from 'lodash'
import Selector from '../../../components/selector'
import vueJsonEditor from '../../../components/jsoneditor'
import { METHODS_LIST } from '../data'
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

    return {
      formData: {
        path: '',
        method: METHODS_LIST[0].value,
        content: {}
      }
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
      this.$emit('del')
    },

    copy () {
      copy(this.link)
      this.$message('复制成功')
    },

    open () {
      open(this.link)
    }
  }
}
</script>