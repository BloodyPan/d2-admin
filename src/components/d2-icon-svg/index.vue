<template>
  <svg @click="iconClick($event)" aria-hidden="true">
    <use :xlink:href="icon"></use>
  </svg>
</template>

<script>
export default {
  name: 'd2-icon-svg',
  props: {
    name: {
      type: String,
      required: true
    }
  },
  computed: {
    icon () {
      return `#d2-${this.name}`
    }
  },
  methods: {
		iconClick: function (event) {
			this.$emit('clickicon', event);
		}
  }
}
</script>
