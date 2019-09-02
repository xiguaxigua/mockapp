<template>
  <div class="component-sidebar">
    <div
      v-for="(option, index) in options"
      :key="index"
      @click="clickHandler(option)"
      class="side-item">
      {{option}}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      default: []
    }
  },
  methods: {
    clickHandler (option) {
      this.$emit('select', option)
    }
  }
}
</script>

<style lang="scss">
.component-sidebar {
  width: 150px;
  height: 100%;
  border-right: 1px solid #eee;

  .side-item {
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    padding: 0 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>