<template>
  <el-dialog
    :title="type === 'add' ? '添加商品' : '修改商品'"
    v-model="visible"
    width="400px">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="formRef"
      label-width="100px"
      class="good-form">
      <el-form-item label="商品名称" prop="name">
        <el-input type="text" v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="跳转链接" prop="link">
        <el-input type="text" v-model="ruleForm.link"></el-input>
      </el-form-item>
      <el-form-item label="商品编号" prop="id">
        <el-input type="number" min="0" max="200" v-model="ruleForm.id"></el-input>
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
import { ElMessage } from 'element-plus'
export default {
  name: "DialogAddGood",
  props: {
    type: String,
    configType: Number,
    reload: Function
  },
  setup(props) {
    const formRef = ref(null)
    const state = reactive({
      visible: false,
      ruleForm: {
        name: '',
        link: '',
        id: '',
        sort: ''
      },
      rules: {
        name: [
          { required: 'true', message: '名称不能为空', trigger: ['change'] }
        ],
        id: [
          { required: 'true', message: '编号不能为空', trigger: ['change'] }
        ],
        sort: [
          { required: 'true', message: '排序不能为空', trigger: ['change'] }
        ]
      },
      id: ''
    })
    const getDetail = (id) => {
      axios.get(`/indexConfigs/${id}`).then(res => {
        const { configName: name, goodsId: id, redirectUrl: link, configRank: sort } = res
        state.ruleForm = {
          name,
          id,
          link,
          sort
        }
      })
    }
    const openDialog = (id) => {
      state.visible = true
      if (id) {
        state.id = id
        getDetail(id)
      } else {
        state.ruleForm = {
          name: '',
          id: '',
          link: '',
          sort: ''
        }
      }
    }
    const closeDialog = () => {
      state.visible = false
      state.ruleForm = {
        name: '',
        id: '',
        link: '',
        sort: ''
      }
    }
    const submitForm = () => {
      formRef.value.validate(valid => {
        if (valid) {
          const data = {
            configType: props.configType,
            configName: state.ruleForm.name,
            redirectUrl: state.ruleForm.link,
            goodsId: state.ruleForm.id,
            configRank: state.ruleForm.sort
          }
          props.type === 'add' ? data.configId = state.id : ''
          if (props.type === 'add') {
            axios.post('/indexConfigs', data).then(() => {
              ElMessage.success('添加成功')
              state.visible = false
              if (props.reload) props.reload()
            })
          } else {
            axios.put('/indexConfigs', data).then(() => {
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
      formRef,
      submitForm
    }
  }
}
</script>

<style scoped>

</style>