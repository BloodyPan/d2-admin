<template>
  <d2-container type="card">
    <template slot="header">
    </template>
    <user-chat>
    </user-chat>
  </d2-container>
</template>

<script>
  import userChat from '../../../components/user-chat'
  export default {
    components: {
      'user-chat': userChat
    },
    data() {
      return {

      }
    }
  }
</script>

<style>
</style>
