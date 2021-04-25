<template>
  <el-card class="index-container">
    <template #header>
      <el-button
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="handleAdd">增加</el-button>
      <el-popconfirm
        confirmButtonText='确定'
        cancelButtonText='取消'
        title="确定删除吗？"
        @confirm="handleDelete"
      >
        <template #reference>
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete">批量删除</el-button>
        </template>
      </el-popconfirm>
    </template>
    <el-table
      :loading="loading"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="configName"
        label="商品名称">
      </el-table-column>
      <el-table-column
        label="跳转链接">
        <template #default="scope">
          <a :href="scope.row.redirectUrl" target="_blank">
            {{scope.row.redirectUrl}}
          </a>
        </template>
      </el-table-column>
      <el-table-column
        prop="configRank"
        label="排序值"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="goodsId"
        label="商品编号"
        width="200"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="添加时间"
        width="200"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        width="120"
      >
        <template #default="scope">
          <el-button type="text" @click="handleEdit(scope.row.configId)">修改</el-button>
          <el-popconfirm
            title="确定删除吗？"
            confirmButtonText='确定'
            cancelButtonText='取消'
            @confirm="handleDeleteOne(scope.row.configId)"
          >
            <template #reference>
              <el-button
                type="text"
                icon="el-icon-delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="changePage"
    />
  </el-card>
  <DialogAddGood
    ref="addGood"
    :reload="getIndexConfig"
    :type="type"
    :configType="configType"/>
</template>

<script>
import { onUnmounted, onMounted, reactive, ref, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { configTypeMap } from '@/config'
import { ElMessage } from 'element-plus'
import DialogAddGood from '@/components/DialogAddGood'
import axios from '@/utils/axios'
export default {
  name: "IndexConfig",
  components: {
    DialogAddGood
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const addGood = ref(null)
    const multipleTable = ref(null)
    const state = reactive({
      loading: false,
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      type: 'add',
      configType: 3,
      multipleSelection: []
    })
    const unWatch = router.beforeEach(to => {
      if (['hot', 'new', 'recommend'].includes(to.name)) {
        state.configType = configTypeMap[to.name]
        state.currentPage = 1
        getIndexConfig()
      }
    })
    onMounted(() => {
      state.configType = configTypeMap[route.name]
      getIndexConfig()
    })
    onUnmounted(() => {
      unWatch()
    })
    const getIndexConfig = () => {
      state.loading = true
      axios.get('/indexConfigs', {
        params: {
          pageNumber: state.currentPage,
          pageSize: state.pageSize,
          configType: state.configType
        }
      }).then(res => {
        const { list, totalCount, currPage } = res
        state.tableData = list
        state.total = totalCount
        state.currentPage = currPage
        state.loading = false
      })
    }
    const handleAdd = () => {
      state.type = 'add'
      addGood.value.openDialog()
    }
    const handleEdit = (id) => {
      state.type = 'edit'
      addGood.value.openDialog(id)
    }
    const handleSelectionChange = (val) => {
      state.multipleSelection = val
    }
    const handleDelete = () => {
      if (!state.multipleSelection.length) {
        return ElMessage.error('请选择项')
      }
      axios.delete('/indexConfigs/delete', {
        data: {
          ids: state.multipleSelection.map(i => i.carouselId)
        }
      }).then(res => {
        ElMessage.success('删除成功')
        getIndexConfig()
      })
    }
    const handleDeleteOne = (id) => {
      axios.delete('/indexConfigs/delete', {
        data: {
          ids: [id]
        }
      }).then(res => {
        ElMessage.success('删除成功')
        getIndexConfig()
      })
    }
    const changePage = (val) => {
      state.currentPage = val
      getIndexConfig()
    }
    return {
      ...toRefs(state),
      handleEdit,
      handleAdd,
      handleDelete,
      handleDeleteOne,
      handleSelectionChange,
      addGood,
      multipleTable,
      getIndexConfig,
      changePage
    }
  }
}
</script>

<style scoped>

</style>