<template>
  <div class="component-sidebar">
    <div
      v-for="(option, index) in options"
      :key="index"
      @click="innerSelected = option"
      :class="`${innerSelected === option && 'selected'}`"
      class="side-item">
      [{{option.method}}]{{option.path}}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      default: []
    },
    selected: {}
  },

  computed: {
    innerSelected: {
      get () { return this.selected },
      set (v) { this.$emit('update:selected', v) }
    }
  }
}
</script>

<style lang="scss">
.component-sidebar {
  width: 200px;
  height: 100%;
  border-right: 1px solid #eee;
  overflow-y: auto;

  .side-item {
    height: 30px;
    line-height: 30px;
    text-align: left;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    padding: 0 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #ccc;

    &.selected {
      color: #409EFF;
    }
  }
}
</style>
