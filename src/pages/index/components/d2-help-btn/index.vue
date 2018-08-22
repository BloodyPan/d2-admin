<template>
  <div>
    <el-tooltip effect="dark" content="疑问" placement="bottom">
      <el-button class="d2-ml-0 d2-mr btn-text can-hover" type="text" @click="dialogVisible = true">
        <d2-icon name="question-circle" style="font-size: 20px"/>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'd2-page-cover',
  data () {
    return {
      dialogVisible: false
    }
  }
}
</script>
