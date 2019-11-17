<template>
  <el-select
    class="component-selector"
    v-model="selected"
    filterable
    placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      default: []
    },
    value: {
      default: null
    }
  },

  computed: {
    selected: {
      get () { return this.value },
      set (v) { this.$emit('input', v) }
    }
  }
}
</script>
