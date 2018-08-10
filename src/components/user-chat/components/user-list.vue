<template>
  <ul class="user-list-ul">
    <li>
      a
    </li>
    <li>
      a
    </li>
  </ul>
</template>

<script>
  export default {
    name: "user-list",
    data() {
    	return {
				listData: [],
				total: 0,
				currentPage: 1,
				currentPageSize: 10
      }
    },
		mounted() {
			this.$axios({
				method: 'get',
				url: 'ChatUserList',
				params: {
					limit: this.currentPageSize,
					offset: (this.currentPage - 1) * this.currentPageSize
				}
			})
				.then(res => {

				})
				.catch(err => {
					this.$message.error(err)
				})
		},
		methods: {

    }
  }
</script>

<style scoped>
  .user-list-ul{
    list-style: none;
  }
</style>