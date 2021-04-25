<template>
  <el-dialog
    v-model="visible"
    width="400px"
    :title="type === 'add' ? '添加轮播图' : '修改轮播图'">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="formRef"
      label-width="100px"
      class="good-form">
      <el-form-item label="图片" prop="url">
        <el-upload
          class="avatar-uploader"
          :action="uploadImgServer"
          accept="jpg,jpeg,png"
          :headers="{
            token: token
          }"
          :show-file-list="false"
          :before-upload="handleBeforeUpload"
          :on-success="handleUrlSuccess">
          <img v-if="ruleForm.url" :src="ruleForm.url" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="跳转链接" prop="link">
        <el-input type="text" v-model="ruleForm.link"></el-input>
      </el-form-item>
      <el-form-item label="排序值" prop="sort">
        <el-input type="number" min="0" v-model="ruleForm.sort"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, ref, toRefs } from 'vue'
import axios from '@/utils/axios'
import { localGet, uploadImgServer } from '@/utils'
import { ElMessage } from 'element-plus'
export default {
  name: "DialogAddSwiper",
  props: {
    type: String,
    reload: Function
  },
  setup(props) {
    const formRef = ref(null)
    const state = reactive({
      uploadImgServer,
      token: localGet('token') || '',
      visible: false,
      ruleForm: {
        url: '',
        link: '',
        sort: ''
      },
      rules: {
        url: [
          { required: 'true', message: '图片不能为空', trigger: ['change'] }
        ],
        sort: [
          { required: 'true', message: '排序不能为空', trigger: ['change'] }
        ]
      },
      id: ''
    })
    const getDetail = (id) => {
      axios.get(`/carousels/${id}`).then(res => {
        const { carouselUrl: url, redirectUrl: link, carouselRank: sort } = res
        state.ruleForm = {
          url,
          link,
          sort
        }
      })
    }
    const handleBeforeUpload = (file) => {
      const suffix = file.name.split('.')[1] || ''
      if (!['jpg', 'jpeg', 'png'].includes(suffix)) {
        ElMessage.error('请上传 jpg、jpeg、png 格式的图片')
        return false
      }
    }
    // 上传图片
    const handleUrlSuccess = (val) => {
      state.ruleForm.url = val.data || ''
    }
    const openDialog = (id) => {
      state.visible = true
      if (id) {
        state.id = id
        getDetail(id)
      } else {
        state.ruleForm = {
          url: '',
          link: '',
          sort: ''
        }
      }
    }
    const closeDialog = () => {
      state.visible = false
      state.ruleForm = {
        url: '',
        link: '',
        sort: ''
      }
    }
    const submitForm = () => {
      formRef.value.validate(valid => {
        if (valid) {
          const data = {
            carouselUrl: state.ruleForm.url,
            redirectUrl: state.ruleForm.link,
            carouselRank: state.ruleForm.sort
          }
          props.type === 'add' ? data.carouselId = state.id : ''
          if (props.type === 'add') {
            axios.post('/carousels', data).then(() => {
              ElMessage.success('添加成功')
              state.visible = false
              if (props.reload) props.reload()
            })
          } else {
            axios.put('/carousels', data).then(() => {
              ElMessage.success('修改成功')
              state.visible = false
              if (props.reload) props.reload()
            })
          }
        }
      })
    }
    return {
      ...toRefs(state),
      openDialog,
      closeDialog,
      handleBeforeUpload,
      handleUrlSuccess,
      formRef,
      submitForm
    }
  }
}
</script>

<style scoped>
.avatar-uploader {
  width: 100px;
  height: 100px;
  color: #ddd;
  font-size: 30px;
}
.avatar-uploader-icon {
  display: block;
  width: 100%;
  height: 100%;
  border: 1px solid #e9e9e9;
  padding: 32px 17px;
}
.avatar-uploader img {
  width: 100px;
  height: 100px;
  border: 1px solid #e9e9e9;
}
</style>