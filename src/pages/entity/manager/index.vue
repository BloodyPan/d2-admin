<template>
  <d2-container type="card">
    <template slot="header">
      校园一天管理
    </template>
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 15px"
      max-height="500"
      :row-class-name="tableRowClassName">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="icon">
        <template slot-scope="scope">
          <img class="icon" :src="scope.row.icon">
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column label="创建日期">
        <template slot-scope="scope">
          <span>{{ timeFormat(scope.row.createAt) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              size="mini"
              type="primary"
              @click="viewStroy(0, scope.row.entityId, scope.row.name)">
              查看Story
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="viewStroy(1, scope.row.entityId, scope.row.name)">
              审查违规内容
            </el-button>
            <el-button
              size="mini"
              type="info"
              plain
              @click="viewStroy(2, scope.row.entityId, scope.row.name)">
              历史数据
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <entity-story ref="story">
    </entity-story>
  </d2-container>
</template>

<script>
import util from '@/libs/util.js'
import { EntityList } from '@/api/pages/entity/manager'
import entityStory from '../../../components/spot-entity-story'

export default {
  components: {
    'entity-story': entityStory
  },
  data () {
    return {
      tableData: []
    }
  },
  methods: {
    timeFormat: time => util.spot.formatTimestamp(time, 'yyyy-MM-dd hh:mm:ss'),
    tableRowClassName ({row, rowIndex}) {
      if (rowIndex % 2 === 1) {
        return 'success-row'
      }
      return ''
    },
    async fetch () {
      const res = await EntityList({})
      this.tableData = res.content.areas
    },
    viewStroy (type, entityId, name) {
      // enum FeedType{
      //   FEED_ENTITY = 0;
      //   FEED_BLOCKED_ENTITY = 1;
      //   FEED_ENTITY_HISTORY = 2;
      // }
      this.$refs.story.fetchData(type, entityId, name)
    }
  },
  mounted () {
    this.fetch()
  }
}
</script>

<style>
  .el-table .success-row {
    background: #f0f9eb;
  }

  .el-table td, .el-table th {
    padding: 8px 0 0 0;
    cursor: pointer;
  }

  .icon{
    width: 45px;
  }
</style>
