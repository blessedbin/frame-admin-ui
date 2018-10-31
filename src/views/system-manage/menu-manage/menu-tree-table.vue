<template>
  <div class="main-contain-holder">

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>菜单列表</span>
      </div>
      <el-button-group style="margin-bottom: 5px;margin-left: 10px;">
        <el-button type="primary" @click="handleAddButton" size="small">添 加</el-button>
        <el-button type="primary" @click="loadMenuTreeData" size="small">刷 新</el-button>
      </el-button-group>
      <el-row :gutter="20">
        <!--菜单树-->
        <el-col :span="8">
          <el-tree :data="treeData.data" highlight-current default-expand-all :expand-on-click-node="false"
                   @node-click="treeNodeClick" v-loading="treeData.loading" node-key="id" ref="menuTree"
                   :props="treeData.defaultProps">

            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span>
                <el-tooltip class="item" effect="dark" content="添加菜单" placement="top">
                  <el-button type="primary" size="mini" icon="el-icon-plus" circle
                             class="tree-button" :disabled="addMenuButtonDisabled(node,data)"
                             @click="() => handleAddMenu(node, data)">
                  </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                  <el-button type="danger" size="mini" class="tree-button" :disabled="!node.isLeaf"
                             @click="() => handleDeleteMenu(node, data)"
                             icon="el-icon-delete" circle>
                  </el-button>
                </el-tooltip>
              </span>
            </span>

          </el-tree>
        </el-col>
        <el-col :span="16">
          <el-card class="box-card" v-loading="dialogEditMenu.loading">
            <div slot="header" class="clearfix">
              <span>菜单详情</span>
            </div>
            <div>
              <el-form :model="dialogEditMenu.data" ref="editMenuForm" label-width="80px" size="small">
                <el-row>
                  <el-col :span="20">
                    <el-form-item label="上级菜单">
                      <el-input v-model="dialogEditMenu.data.pName" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="20">
                    <el-form-item label="菜单标题">
                      <el-input v-model="dialogEditMenu.data.title" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="菜单编码">
                      <el-input v-model="dialogEditMenu.data.name"></el-input>
                    </el-form-item>
                    <el-form-item label="前端组件">
                      <el-input v-model="dialogEditMenu.data.component"></el-input>
                    </el-form-item>
                    <el-form-item label="前端路径">
                      <el-input v-model="dialogEditMenu.data.path"></el-input>
                    </el-form-item>
                    <el-form-item label="跳转路径">
                      <el-input v-model="dialogEditMenu.data.redirect"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="20">
                    <el-form-item label="图标">
                      <el-input v-model="dialogEditMenu.data.icon"></el-input>
                    </el-form-item>

                    <el-row>
                      <el-col :span="8">
                        <el-form-item label="启用">
                          <el-switch v-model="dialogEditMenu.data.enabled" active-color="#13ce66" inactive-color="#ff4949">
                          </el-switch>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="总是显示" label-width="100px">
                          <el-switch v-model="dialogEditMenu.data.alwaysShow" active-color="#13ce66" inactive-color="#ff4949">
                          </el-switch>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="是否隐藏">
                          <el-switch v-model="dialogEditMenu.data.hidden" active-color="#13ce66" inactive-color="#ff4949">
                          </el-switch>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-form-item label="描述">
                      <el-input v-model="dialogEditMenu.data.remark"></el-input>
                    </el-form-item>
                    <el-form-item label="排序">
                      <el-input v-model="dialogEditMenu.data.sort" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="附加信息">
                      <el-input v-model="dialogEditMenu.data.meta"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col>
                    <el-form-item label="">
                      <el-button size="small" round>重 置</el-button>
                      <el-button type="primary" @click="handleEditMenuSubmit" size="small" round>确 定</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>

              </el-form>
            </div>
          </el-card>
        </el-col>
      </el-row>

    </el-card>

    <!--添加菜单-->
    <el-dialog
      title="添加菜单" width="1000px"
      :visible.sync="dialogAddMenu.visible">
      <div>
        <el-form :model="dialogAddMenu.data" ref="addMenuForm" label-width="80px" size="small">
          <el-row>
            <el-col :span="12">
              <el-form-item label="上级菜单">
                <el-input v-model="dialogAddMenu.data.pidName" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="菜单标题">
                <el-input v-model="dialogAddMenu.data.title" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="菜单编码">
                <el-input v-model="dialogAddMenu.data.name"></el-input>
              </el-form-item>
              <el-form-item label="前端组件">
                <el-input v-model="dialogAddMenu.data.component"></el-input>
              </el-form-item>
              <el-form-item label="前端路径">
                <el-input v-model="dialogAddMenu.data.path"></el-input>
              </el-form-item>
              <el-form-item label="跳转路径">
                <el-input v-model="dialogAddMenu.data.redirect"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="图标">
                <el-input v-model="dialogAddMenu.data.icon"></el-input>
              </el-form-item>

              <el-row>
                <el-col :span="8">
                  <el-form-item label="启用">
                    <el-switch v-model="dialogAddMenu.data.enabled" active-color="#13ce66" inactive-color="#ff4949">
                    </el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="总是显示" label-width="100px">
                    <el-switch v-model="dialogAddMenu.data.alwaysShow" active-color="#13ce66" inactive-color="#ff4949">
                    </el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="是否隐藏">
                    <el-switch v-model="dialogAddMenu.data.hidden" active-color="#13ce66" inactive-color="#ff4949">
                    </el-switch>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="描述">
                <el-input v-model="dialogAddMenu.data.remark"></el-input>
              </el-form-item>
              <el-form-item label="排序">
                <el-input v-model="dialogAddMenu.data.sort" type="number"></el-input>
              </el-form-item>
              <el-form-item label="附加信息">
                <el-input v-model="dialogAddMenu.data.meta"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddMenu.visible = false" size="small" round>取 消</el-button>
        <el-button type="primary" @click="handleAddMenuSubmit" size="small" round>确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import datatable from '@/components/DataTable/datatable.vue'
export default {
  name: 'menu-tree-table',
  components: {
    datatable
  },
  data() {
    return {
      treeData: {
        activePanelName: 'first',
        data: [],
        defaultProps: {
          children: 'children',
          label: 'title'
        },
        loading: false
      },
      dialogAddMenu: {
        visible: false,
        type: 'add',
        isRoot: false,
        data: {
          pidName: '',
          title: '',
          name: '',
          pid: -1,
          component: '',
          path: '',
          redirect: '',
          icon: '',
          enabled: true,
          alwaysShow: true,
          hidden: false,
          remark: '',
          sort: 1,
          meta: ''
        }
      },
      dialogEditMenu: {
        loading: false,
        data: {
          id: '',
          title: '',
          name: '',
          pid: -1,
          pName: '',
          component: '',
          path: '',
          redirect: '',
          icon: '',
          enabled: true,
          alwaysShow: true,
          hidden: false,
          remark: '',
          sort: 1,
          meta: ''
        }
      },
      baseUrl: '/api/ucenter/sys/menu'
    }
  },
  watch: {
    'dialogAddMenu.data.name': function(value) {
      if (this.dialogAddMenu.isRoot) {
        this.dialogAddMenu.data.path = '/' + value
      } else {
        this.dialogAddMenu.data.path = value
      }
    }
  },
  mounted() {
    this.loadMenuTreeData()
  },
  methods: {
    handleAddButton() {
      const self = this
      self.dialogAddMenu.data.pidName = '顶级菜单'
      self.dialogAddMenu.data.pid = -1
      self.dialogAddMenu.visible = true
      self.dialogAddMenu.isRoot = true
      self.dialogAddMenu.data.component = 'layout/Layout'
    },
    handleAddMenuSubmit() {
      const self = this
      const data = self.dialogAddMenu.data
      self.$request.post(self.baseUrl, data).then(response => {
        self.$message.success(response.message)
        self.dialogAddMenu.visible = false
        self.$refs['addMenuForm'].resetFields()
        self.loadMenuTreeData()
      })
    },
    handleDeleteMenu(node, data) {
      const permissionId = data.id
      const self = this
      this.$confirm('删除, 是否继续?删除菜单会删除相应的权限，建议禁用即可', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.$request.delete(self.baseUrl + '?id=' + permissionId).then(response => {
          self.$message.success(response.message)
          self.loadMenuTreeData()
        })
      })
    },
    handleAddMenu(node, data) {
      const pid = data.id
      const pidName = data.label
      const self = this
      this.$nextTick(function() {
        self.$refs.addMenuForm.resetFields()
      })
      self.dialogAddMenu.isRoot = false
      self.dialogAddMenu.data.pid = pid
      self.dialogAddMenu.data.pidName = pidName
      self.dialogAddMenu.visible = true
    },
    // 编辑后提交
    handleEditMenuSubmit() {
      const self = this
      const data = self.dialogEditMenu.data
      self.$request.put(self.baseUrl, data).then(response => {
        self.$message.success(response.message)
      })
    },
    loadMenuTreeData() {
      const self = this
      self.treeData.loading = true
      self.$request.get('/api/ucenter/sys/menu/menu_tree.json').then(response => {
        self.treeData.data = response.data.treeList
        self.treeData.loading = false
      })
    },
    treeNodeClick(data) {
      const self = this
      const id = data.id
      self.dialogEditMenu.data.id = id
      self.dialogEditMenu.loading = true
      self.$request.get(self.baseUrl + '/' + id).then(response => {
        self.dialogEditMenu.data = response.data
        const pid = self.dialogEditMenu.data.pid
        if (pid === null || pid === -1) {
          self.dialogEditMenu.data.pName = ''
        } else {
          const node = self.$refs.menuTree.getNode(pid)
          console.log(node)
          self.dialogEditMenu.data.pName = node.label
        }
        self.dialogEditMenu.loading = false
      })
    },
    // //////////////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////////////////////////
    addMenuButtonDisabled(node, data) {
      if (data.tag === 'ACTION') {
        return true
      }
      if (data.children && data.children.length > 0 && data.children[0].tag === 'ACTION') {
        return true
      }
      return false
    }
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
  .tree-button {
    padding: 3px;
    margin-left: 0;
  }
</style>
