import BScroll from 'better-scroll'
export default {
  props: {
    betterScrollOptions: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  data () {
    return {
      BS: null
    }
  },
  mounted () {
    this.scrollInit()
  },
  beforeDestroy () {
    this.scrollDestroy()
  },
  methods: {
    scrollInit () {
      this.BS = new BScroll(this.$refs.wrapper, Object.assign({
        mouseWheel: true,
        scrollbar: {
          fade: true,
          interactive: false,
          bounce: {
            top: true,
            bottom: true,
            left: true,
            right: true
          },
          deceleration: 0.001
        }
      }, this.betterScrollOptions))
    },
    scrollDestroy () {
      if (this.BS) {
        this.BS.destroy()
      }
    }
  }
}
