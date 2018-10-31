<template>
  <div>
    <div style="padding-bottom: 5px">
      <el-button type="primary" size="small" @click="loadMenuTreeData">刷新</el-button>
    </div>
    <tree-table :data="treeData.data" :expand-all="expandAll" border v-loading="treeData.loading">
      <el-table-column type="expand" slot="head">
        <template slot-scope="props">
          <el-tag
            v-for="tag in tags"
            :key="tag.name"
            closable
            :type="tag.type">
            {{ tag.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title"></el-table-column>
      <el-table-column label="启用" prop="enabled"></el-table-column>
      <el-table-column label="权限点"></el-table-column>
    </tree-table>
  </div>
</template>

<script>
import treeTable from '@/components/TreeTable'
import treeToArray from './customEval'
export default {
  name: 'permission-manage',
  components: { treeTable },
  data() {
    return {
      func: treeToArray,
      args: [null, null, 'timeLine'],
      expandAll: false,
      treeData: {
        data: [],
        defaultProps: {
          children: 'children',
          label: 'title'
        },
        loading: false
      },
      tags: [
        { name: '标签一', type: '' },
        { name: '标签二', type: 'success' },
        { name: '标签三', type: 'info' },
        { name: '标签四', type: 'warning' },
        { name: '标签五', type: 'danger' }
      ]
    }
  },
  mounted() {
    this.loadMenuTreeData()
  },
  methods: {
    loadMenuTreeData() {
      const self = this
      self.treeData.loading = true
      self.$request.get('/api/ucenter/sys/menu/menu_tree.json').then(response => {
        self.treeData.data = response.data.treeList
        self.treeData.loading = false
      })
    },
    treeNodeClick(data) {}
  }
}
</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
