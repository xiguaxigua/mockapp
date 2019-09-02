<template>
  <el-form label-width="80px">
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
      <el-button type="text" @click="reset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { cloneDeep } from 'lodash'
import Selector from '../../../components/selector'
import vueJsonEditor from 'vue-json-editor'
import { METHODS_LIST } from '../data'

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

  watch: {
    form (v) {
      this.formData = cloneDeep(v)
    }
  },

  methods: {
    reset () {
      this.formData = cloneDeep(this.form)
    },

    confirm () {
      this.$emit('confirm', this.formData)
    }
  }
}
</script>