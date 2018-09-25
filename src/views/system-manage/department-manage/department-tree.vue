<template>
  <el-dialog title="选择上级组织" :visible.sync="visible" width="400px">
    <el-tree :data="treeData" ref="tree" node-key="id" highlight-current
             :expand-on-click-node="false"></el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" size="small" round>取 消</el-button>
      <el-button type="primary" @click="handleOkClick" size="small" round>确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
/**
   * @method：show() 显示对话框
   * @method: hidden() 隐藏对话框
   * @event: selected 参数：selectedNode 被选择的node
   */
export default {
  name: 'DepartmentTree',
  data() {
    return {
      visible: false,
      treeData: []
    }
  },
  mounted() {
  },
  methods: {
    show() {
      this.loadTreeData()
      this.visible = true
    },
    hidden() {
      this.visible = false
    },
    loadTreeData() {
      const self = this
      self.$request.get('/api/ucenter/sys/department/tree.json').then(response => {
        self.treeData = [{
          id: '-1',
          label: '根节点',
          children: response.data
        }]
      })
    },
    handleOkClick() {
      const checkedNodes = this.$refs.tree.getCurrentNode()
      if (checkedNodes == null) {
        this.$message.warning('请选择一个节点')
      }
      console.log(checkedNodes)
      this.$emit('selected', checkedNodes)
      this.visible = false
    }
  }
}
</script>

<style scoped>

</style>
