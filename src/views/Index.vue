<template>
  <el-card class="introduce">
    <div class="order">
      <el-card class="order-item">
        <template #header>
          <div class="card-header">
            <span>今日订单数</span>
          </div>
        </template>
        <div class="item">1888</div>
      </el-card>
      <el-card class="order-item">
        <template #header>
          <div class="card-header">
            <span>今日日活</span>
          </div>
        </template>
        <div class="item">36271</div>
      </el-card>
      <el-card class="order-item">
        <template #header>
          <div class="card-header">
            <span>转化率</span>
          </div>
        </template>
        <div class="item">20%</div>
      </el-card>
    </div>
    <div id="zoom"></div>
  </el-card>
</template>

<script>
import * as echarts from 'echarts'
import { onMounted, onUnmounted } from 'vue'
import { chartIndex } from '@/config/charts'
let myChart = null
export default {
  name: "index",
  setup() {
    onMounted(() => {
      if (echarts) {
        myChart = echarts.init(document.getElementById('zoom'))
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(chartIndex)
      }
    })
    onUnmounted(() => {
      myChart.dispose()
    })
  }
}
</script>

<style scoped>
.introduce .order {
  display: flex;
  margin-bottom: 50px;
}
.introduce .order .order-item {
  flex: 1;
  margin-right: 20px;
}
.introduce .order .order-item:last-child{
  margin-right: 0;
}
#zoom {
  min-height: 600px;
}
</style>