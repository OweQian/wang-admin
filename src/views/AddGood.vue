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
            :placeholder="defaultCate"
            :props="category"
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
        <el-form-item label="商品价格" prop="originalPrice">
          <el-input
            type="number"
            min="0"
            v-model="goodForm.originalPrice"
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
            :headers="{
              token: token
            }"
            :show-file-list="false"
            :on-success="handleUrlSuccess"
            :before-upload="handleBeforeUpload"
          >
            <img
              v-if="goodForm.goodsCoverImg"
              :src="goodForm.goodsCoverImg"
              class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="详情内容">
          <div ref='editor'></div>
        </el-form-item>
        <el-form-item>
          <el-button class="btn-submit" type="primary" @click="submitAdd">{{id ? '立即修改' : '立即创建'}}</el-button>
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
  onMounted,
  onBeforeUnmount,
  getCurrentInstance
} from 'vue'
import WangEditor from 'wangeditor'
import axios from '@/utils/axios'
import { useRouter, useRoute } from "vue-router"
import { localGet, uploadImgServer, uploadImgsServer } from '@/utils'
import { ElMessage } from 'element-plus'
export default {
  name: 'AddGood',
  setup() {
    let instance
    const { proxy } = getCurrentInstance()
    const editor = ref(null)
    const goodRef = ref(null)
    const route = useRoute()
    const router = useRouter()
    const { id } = route.query
    const state = reactive({
      uploadImgServer, // 单图上传
      token: localGet('token') || '',
      id: id,
      defaultCate: '',
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
      categoryId: '',
      category: {
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

    onMounted(() => {
      instance = new WangEditor(editor.value)
      instance.config.showLinkImg = false
      instance.config.showLinkImgAlt = false
      instance.config.showLinkImgHref = false
      instance.config.uploadImgMaxSize = 2 * 1024 * 1024
      instance.config.uploadFileName = 'file'
      instance.config.uploadImgHeaders = {
        token: state.token // 添加 token，否则没有权限调用上传接口
      }
      // 图片返回格式不同，需要自定义返回格式
      instance.config.uploadImgHooks = {
        // 图片上传并返回了结果，想要自己把图片插入到编辑器中
        // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
        customInsert: function(insertImgFn, result) {
          console.log('result', result)
          // result 即服务端返回的接口
          // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
          if (result.data && result.data.length) {
            result.data.forEach(item => insertImgFn(item))
          }
        }
      }
      instance.config.uploadImgServer = uploadImgsServer // 上传接口地址配置
      Object.assign(instance.config, {
        onchange() {
          console.log('change')
        },
      })
      instance.create()
      if (id) {
        // 获取商品信息
        axios.get(`/goods/${id}`).then(res => {
          const { goods, firstCategory, secondCategory, thirdCategory } = res
          state.goodForm = {
            goodsName: goods.goodsName,
            goodsIntro: goods.goodsIntro,
            originalPrice: goods.originalPrice,
            sellingPrice: goods.sellingPrice,
            stockNum: goods.stockNum,
            goodsSellStatus: String(goods.goodsSellStatus),
            goodsCoverImg: proxy.$filters.prefix(goods.goodsCoverImg),
            tag: goods.tag
          }
          state.categoryId = goods.goodsCategoryId
          state.defaultCate = `${firstCategory.categoryName}/${secondCategory.categoryName}/${thirdCategory.categoryName}`
          if (instance) {
            // 初始化商品详情 html
            instance.txt.html(goods.goodsDetailContent)
          }
        })
      }
    })
    onBeforeUnmount(() => {
      instance.destroy()
      instance = null
    })
    const handleChangeCate = (val) => {
      state.categoryId = val[2] || 0
    }
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
          let httpOption
          if (id) {
            data.goodsId = id
            httpOption = axios.put
          } else {
            httpOption = axios.post
          }
          let data = {
            goodsCategoryId: state.categoryId,
            goodsIntro: state.goodForm.goodsIntro,
            goodsDetailContent: instance.txt.html(),
            goodsCoverImg: state.goodForm.goodsCoverImg,
            goodsName: state.goodForm.goodsName,
            goodsSellStatus: state.goodForm.goodsSellStatus,
            originalPrice: state.goodForm.originalPrice,
            sellingPrice: state.goodForm.sellingPrice,
            stockNum: state.goodForm.stockNum,
            tag: state.goodForm.tag
          }
          httpOption('/goods', data).then(res => {
            ElMessage.success(id ? '修改成功' : '添加成功')
            router.push({
              path: '/good'
            })
          })
        }
      })
    }
    return {
      ...toRefs(state),
      goodRef,
      editor,
      handleChangeCate,
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