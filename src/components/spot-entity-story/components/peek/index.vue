<template>
  <div class="peek-div">
    <video
      ref="peekVideo"
      class="chat-peek"
      v-if="peekContent.video"
      :src="peekContent.video"
      autoplay
      onclick="this.play()">
    </video>
    <img
      class="chat-peek-photo chat-peek-doodle"
      v-if="peekContent.video && peekContent.photo"
      :src="peekContent.photo"
      @click="playPeek">
    <img
      class="chat-peek-photo"
      v-if="peekContent.video == '' || peekContent.video == void 0"
      :src="peekContent.photo">
  </div>
</template>

<script>
export default {
  name: 'peek',
  props: {
    content: {
      type: Object
    }
  },
  data () {
    return {
      peekContent: {}
    }
  },
  watch: {
    content: function (val) {
      this.peekContent = val
    }
  },
  methods: {
    playPeek () {
      if (this.peekContent.video) {
        this.$refs.peekVideo.play()
      }
    },
    stopPeek () {
      if (this.peekContent.video) {
        this.$refs.peekVideo.pause()
      }
    }
  }
}
</script>

<style scoped>
  .peek-div {
    display: inline-block;
  }

  .chat-peek {
    width: 200px;
    cursor: pointer;
  }

  .chat-peek-photo {
    width: 200px;
    z-index: 999;
    position: relative;
  }

  .chat-peek-doodle {
    margin-left: -200px;
    cursor: pointer;
  }
</style>
