<template>
  <el-card class="swiper-container">
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
        label="轮播图"
        width="200">
        <template #default="scope">
          <img class="view-img" :src="scope.row.carouselUrl" alt="轮播图">
        </template>
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
        prop="carouselRank"
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
        width="120">
        <template #default="scope">
          <el-button type="text" @click="handleEdit(scope.row.carouselId)">修改</el-button>
          <el-popconfirm
            title="确定删除吗？"
            confirmButtonText='确定'
            cancelButtonText='取消'
            @confirm="handleDeleteOne(scope.row.carouselId)"
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
  <DialogAddSwiper ref="addSwiper" :reload="getCarousels" :type="type"/>
</template>

<script>
import { onMounted, reactive, ref, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import axios from '@/utils/axios'
import DialogAddSwiper from '@/components/DialogAddSwiper.vue'
export default {
  name: "Swiper",
  components: {
    DialogAddSwiper
  },
  setup() {
    const multipleTable = ref(null)
    const addSwiper = ref(null)
    const state = reactive({
      loading: false,
      tableData: [],
      multipleSelection: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      type: 'add'
    })
    onMounted(() => {
      getCarousels()
    })
    const getCarousels = () => {
      state.loading = true
      axios.get('/carousels', {
        params: {
          pageNumber: state.currentPage,
          pageSize: state.pageSize
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
      addSwiper.value.openDialog()
    }
    const handleEdit = (id) => {
      state.type = 'edit'
      addSwiper.value.openDialog(id)
    }
    const handleSelectionChange = (val) => {
      state.multipleSelection = val
    }
    const handleDelete = () => {
      if (!state.multipleSelection.length) {
        return ElMessage.error('请选择项')
      }
      axios.delete('/carousels', {
        data: {
          ids: state.multipleSelection.map(i => i.carouselId)
        }
      }).then(res => {
        ElMessage.success('删除成功')
        getCarousels()
      })
    }
    const handleDeleteOne = (id) => {
      axios.delete('/carousels', {
        data: {
          ids: [id]
        }
      }).then(res => {
        ElMessage.success('删除成功')
        getCarousels()
      })
    }
    const changePage = (val) => {
      state.currentPage = val
      getCarousels()
    }
    return {
      ...toRefs(state),
      multipleTable,
      addSwiper,
      getCarousels,
      handleAdd,
      handleEdit,
      changePage,
      handleSelectionChange,
      handleDelete,
      handleDeleteOne
    }
  }
}
</script>

<style scoped>
.swiper-container {
  min-height: 100%;
}

.view-img {
  width: 100px;
  height: 100px;
}
.el-card.is-always-shadow {
  min-height: 100%!important;
}
</style>