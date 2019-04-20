<template>
  <div class="input-container">
    <img v-if="icon !== ''" class="icon" src="" >
    <input :type="type" :placeholder="placeholder" :value="value" @input="inputHandler" />
  </div>
</template>

<script>
export default {
  props: {
    value,
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
    },
    icon: {
      type: String,
      default: ''
    }
  },
  methods: {
    inputHandler(e) {
      this.$emit('input', e.target.value)
    }
  }
}
</script>

<style lang="less" scoped>
.input-container {
  
}
</style>
