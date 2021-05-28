<template>
  <el-card class="category-container">
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
  </el-card>
</template>

<script>
import { onMounted, onUnmounted, reactive, ref, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus"
import axios from "@/utils/axios"
export default {
  name: "Category",
  setup() {
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      loading: false,
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      type: "add",
      level: 1,
      parent_id: 0
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
      handleNext
    }
  }
}
</script>

<style scoped>

</style>