<template>
  <div class="add">
    <el-card class="add-container">
      <el-form
        :model="goodForm"
        :rules="rules"
        ref="goodRef"
        label-width="100px"
        class="goodForm">
        <el-form-item label="商品分类" required>
          <el-cascader
            placeholder="请选择商品分类"
            :props="props"
            @change="handleChangeCate"/>
        </el-form-item>
        <el-form-item label="商品名称" prop="goodsName">
          <el-input
            v-model="goodForm.goodsName"
            placeholder="请输入商品名称"/>
        </el-form-item>
        <el-form-item label="商品简介" prop="goodsIntro">
          <el-input
            type="textarea"
            v-model="goodForm.goodsIntro"
            placeholder="请输入商品简介"/>
        </el-form-item>
        <el-form-item label="商品价格" prop="goodsPrice">
          <el-input
            type="number"
            min="0"
            v-model="goodForm.goodsPrice"
            placeholder="请输入商品价格"/>
        </el-form-item>
        <el-form-item label="商品售卖价" prop="sellingPrice">
          <el-input
            type="number"
            min="0"
            v-model="goodForm.sellingPrice"
            placeholder="请输入商品售卖价"/>
        </el-form-item>
        <el-form-item label="商品库存" prop="stockNum">
          <el-input
            type="number"
            min="0"
            v-model="goodForm.stockNum"
            placeholder="请输入商品库存"/>
        </el-form-item>
        <el-form-item label="商品标签" prop="tag">
          <el-input
            v-model="goodForm.tag"
            placeholder="请输入商品标签"/>
        </el-form-item>
        <el-form-item label="上架状态" prop="goodsSellStatus">
          <el-radio-group v-model="goodForm.goodsSellStatus">
            <el-radio label="0">上架</el-radio>
            <el-radio label="1">下架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商品主图" prop="goodsCoverImg">
          <el-upload
            class="avatar-uploader"
            :action="uploadImgServer"
            accept="jpg,jpeg,png"
            :show-file-list="false"
            :headers="{
              token: token
            }"
            :on-success="handleUrlSuccess"
            :before-upload="handleBeforeUpload"
          >
            <img v-if="goodForm.goodsCoverImg" :src="goodForm.goodsCoverImg" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button class="btn-submit" type="primary" @click="submitAdd">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  reactive,
  ref,
  toRefs,
  onMounted
} from 'vue'
import axios from '@/utils/axios'
import {localGet, uploadImgServer} from '@/utils'
import {ElMessage} from 'element-plus'
export default {
  name: 'AddGood',
  setup() {
    const goodRef = ref(null)
    const state = reactive({
      uploadImgServer,
      token: localGet('token') || '',
      goodForm: {
        goodsName: '',
        goodsIntro: '',
        originalPrice: '',
        sellingPrice: '',
        stockNum: '',
        goodsSellStatus: '0',
        goodsCoverImg: '',
        tag: ''
      },
      rules: {
        goodsName: [
          { required: 'true', message: '请填写商品名称', trigger: ['change'] }
        ],
        originalPrice: [
          { required: 'true', message: '请填写商品价格', trigger: ['change'] }
        ],
        sellingPrice: [
          { required: 'true', message: '请填写商品售价', trigger: ['change'] }
        ],
        stockNum: [
          { required: 'true', message: '请填写商品库存', trigger: ['change'] }
        ]
      },
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level = 0, value } = node
          axios.get('/categories', {
            params: {
              pageNumber: 1,
              pageSize: 1000,
              categoryLevel: level + 1,
              parentId: value || 0
            }
          }).then(res => {
            const { list } = res
            const nodes = list.map(item => ({
              value: item.categoryId,
              label: item.categoryName,
              leaf: level > 1
            }))
            resolve(nodes)
          })
        }
      }
    })

    const handleBeforeUpload = (file) => {
      const suffix = file.name.split('.')[1] || ''
      if (!['jpg', 'jpeg', 'png'].includes(suffix)) {
        ElMessage.error('请上传 jpg、jpeg、png 格式的图片')
        return false
      }
    }

    const handleUrlSuccess = (val) => {
      state.goodForm.goodsCoverImg = val.data || ''
    }

    const submitAdd = () => {
      goodRef.value.validate(valid => {
        if (valid) {
          let data = {
            goodsIntro: state.goodForm.goodsIntro,
            goodsCoverImg: state.goodForm.goodsCoverImg,
            goodsName: state.goodForm.goodsName,
            goodsSellStatus: state.goodForm.goodsSellStatus,
            originalPrice: state.goodForm.originalPrice,
            sellingPrice: state.goodForm.sellingPrice,
            stockNum: state.goodForm.stockNum,
            tag: state.goodForm.tag
          }
          axios.post('/goods', data).then(res => {
            ElMessage.success('添加成功')
          })
        }
      })
    }
    return {
      ...toRefs(state),
      goodRef,
      handleBeforeUpload,
      handleUrlSuccess,
      submitAdd
    }
  }
}
</script>

<style scoped>
.add {
  display: flex;
}
.add-container {
  flex: 1;
  height: 100%;
}

.btn-submit {
  width: 100%;
}

.add-container >>> .el-cascader {
  width: 100%;
}

.avatar-uploader {
  width: 100px;
  height: 100px;
  color: #ddd;
  font-size: 30px;
}

.avatar-uploader img {
  width: 100px;
  height: 100px;
  border: 1px solid #e9e9e9;
}
.avatar-uploader-icon {
  display: block;
  width: 100%;
  height: 100%;
  border: 1px solid #e9e9e9;
  padding: 32px 17px;
}
</style>