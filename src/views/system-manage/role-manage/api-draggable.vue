<template>
  <div class="dndList">
    <div class="dndList-list" :style="{width:width1}">
      <h3>已选</h3>
      <draggable :list="list1" class="dragArea" :options="{group:'article'}">
        <div class="list-complete-item" v-for="element in list1" :key="element.id">
          <div class="list-complete-item-handle">[{{ element.name }}] {{ element.url }}</div>
          <div style="position:absolute;right:0px;">
            <span style="float: right ;margin-top: -20px;margin-right:5px;" @click="deleteEle(element)">
              <i style="color:#ff4949" class="el-icon-delete"/>
            </span>
          </div>
        </div>
      </draggable>
    </div>
    <div class="dndList-list" :style="{width:width2}">
      <h3>待选</h3>
      <draggable :list="filterList2" class="dragArea" :options="{group:'article'}">
        <div class="list-complete-item" v-for="element in filterList2" :key="element.id">
          <div class="list-complete-item-handle2" @click="pushEle(element)"> [{{ element.name }}] {{ element.url }}</div>
        </div>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'ApiDraggable',
  components: { draggable },
  props: {
    width1: {
      type: String,
      default: '48%'
    },
    width2: {
      type: String,
      default: '48%'
    },
    roleId: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      list1: [],
      list2: []
    }
  },
  computed: {
    filterList2() {
      return this.list2.filter(v => {
        if (this.isNotInList1(v)) {
          return v
        }
        return false
      })
    }
  },
  watch: {
    roleId: function(value) {
      this.loadData()
    }
  },
  updated() {
    // 加载list数据
  },
  mounted() {
    this.loadData()
  },
  methods: {
    isNotInList1(v) {
      return this.list1.every(k => v.id !== k.id)
    },
    isNotInList2(v) {
      return this.list2.every(k => v.id !== k.id)
    },
    deleteEle(ele) {
      for (const item of this.list1) {
        if (item.id === ele.id) {
          const index = this.list1.indexOf(item)
          this.list1.splice(index, 1)
          break
        }
      }
      if (this.isNotInList2(ele)) {
        this.list2.unshift(ele)
      }
    },
    pushEle(ele) {
      this.list1.push(ele)
    },
    loadData() {
      const self = this
      self.$request.get('/api/ucenter/sys/api/draggable_list.json?roleId=' + self.roleId).then(response => {
        self.list2 = response.data.all
        self.list1 = response.data.selected
      })
    },
    getList1() {
      return this.list1
    },
    getList2() {
      return this.list2
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dndList {
  background: #fff;
  padding-bottom: 40px;
  &:after {
    content: "";
    display: table;
    clear: both;
  }
  .dndList-list {
    float: left;
    padding-bottom: 30px;
    &:first-of-type {
      margin-right: 2%;
    }
    .dragArea {
      margin-top: 15px;
      min-height: 50px;
      padding-bottom: 30px;
    }
  }
}

.list-complete-item {
  cursor: pointer;
  position: relative;
  font-size: 14px;
  padding: 5px 12px;
  margin-top: 4px;
  border: 1px solid #bfcbd9;
  transition: all 1s;
}

.list-complete-item-handle {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 50px;
}

.list-complete-item-handle2 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 20px;
}

.list-complete-item.sortable-chosen {
  background: #4AB7BD;
}

.list-complete-item.sortable-ghost {
  background: #30B08F;
}

.list-complete-enter,
.list-complete-leave-active {
  opacity: 0;
}
</style>
