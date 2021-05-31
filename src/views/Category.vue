<template>
  <el-card class="category-container">
    <template #header>
      <div class="header">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="handleAdd">
          增加
        </el-button>
        <el-popconfirm
          title="确定删除吗？"
          confirmButtonText="确定"
          cancelButtonText="取消"
          @confirm="handleDelete">
          <template #reference>
            <el-button
              type="danger"
              size="small"
              icon="el-icon-plus">
              批量删除
            </el-button>
          </template>
        </el-popconfirm>
      </div>
    </template>
    <el-table
      :loading="loading"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="categoryName"
        label="分类名称"
      >
      </el-table-column>
      <el-table-column
        prop="categoryRank"
        label="排序值"
        width="120"
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
        width="220">
        <template #default="scope">
          <a style="cursor: pointer; margin-right: 10px" @click="handleEdit(scope.row.categoryId)">修改</a>
          <a style="cursor: pointer; margin-right: 10px" @click="handleNext(scope.row)">下级分类</a>
          <el-popconfirm
            title="确定删除吗？"
            @confirm="handleDeleteOne(scope.row.categoryId)">
            <template #reference>
              <a style="cursor: pointer;">删除</a>
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
      @current-change="changePage"/>
    <DialogAddCategory ref="addCate" :reload="getCategory" :type="type"/>
  </el-card>
</template>

<script>
import { onMounted, onUnmounted, reactive, ref, toRefs } from "vue";
import DialogAddCategory from '@/components/DialogAddCategory.vue'
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus"
import axios from "@/utils/axios"
export default {
  name: "Category",
  components: {
    DialogAddCategory
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const addCate = ref(null)
    const state = reactive({
      loading: false,
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      type: "add",
      level: 1,
      parent_id: 0,
      multipleSelection: []
    })
    const unWatch = router.afterEach(to => {
      if(['category', 'level2', 'level1'].includes(to.name)) {
        getCategory()
      }
    })
    onUnmounted(() => {
      unWatch()
    })
    onMounted(() => {
      getCategory()
    })
    const handleAdd = () => {
      state.type = 'add'
      addCate.value.openDialog()
    }
    const handleEdit = (id) => {
      state.type = 'edit' // 传入弹窗组件用于弹窗 title 判断
      addCate.value.openDialog(id)
    }
    const handleSelectionChange = (val) => {
      // 多选 checkbox
      state.multipleSelection = val
    }
    const handleDelete = () => {
      if (!state.multipleSelection.length) {
        return ElMessage.error('请选择项')
      }
      axios.delete('/categories', {
        data: {
          ids: state.multipleSelection.map(selection => selection.categoryId)
        }
      }).then(() => {
        ElMessage.success('删除成功')
        getCategory()
      })
    }
    const handleDeleteOne = (id) => {
      axios.delete('/categories', {
        data: {
          ids: [id]
        }
      }).then(() => {
        ElMessage.success('删除成功')
        getCategory()
      })
    }
    const handleNext = item => {
      const level = item.categoryLevel + 1
      if (level === 4) {
        return ElMessage.error("没有下一级")
      }
      router.push({
        name: `level${level}`,
        query: {
          level,
          parent_id: item.categoryId
        }
      })
    }
    const getCategory = () => {
      const { level = 1, parent_id = 0 } = route.query
      state.loading = true
      axios.get('/categories', {
        params: {
          pageNumber: state.currentPage,
          pageSize: state.pageSize,
          categoryLevel: level,
          parentId: parent_id
        }
      }).then((res) => {
        const { list: tableData, totalCount: total, currPage: currentPage } = res
        state.tableData = tableData
        state.total = total
        state.currentPage = currentPage
        state.loading = false
        state.level = level
        state.parentId = parent_id
      })
    }
    const changePage = val => {
      state.currentPage = val
      getCategory()
    }
    return {
      ...toRefs(state),
      getCategory,
      changePage,
      handleNext,
      handleSelectionChange,
      addCate,
      handleAdd,
      handleEdit,
      handleDelete,
      handleDeleteOne
    }
  }
}
</script>

<style scoped>

</style>