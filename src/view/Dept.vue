<template>
  <div class="dept-manage">
    <div class="query-form">
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item label="部门名称名称" prop="deptName">
          <el-input placeholder="请输入部门名称" v-model="queryForm.deptName"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDeptList">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary">创建</el-button>
      </div>
      <el-table :data="deptList">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
          align="center"
        >
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="160"
          align="center"
        >
          <template #default="scope">
            <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleEdit(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance ,reactive, ref, onMounted } from 'vue'
import utils from '../untils/utils'

const queryForm = reactive({
  deptName: ''
})
const columns = ref([
  { label: '部门名称', prop: 'deptName' },
  { label: '负责人', prop: 'userName' },
  { 
    label: '更新时间', prop: 'updateTime',
    formatter(row, column, value) {
      return utils.formateDate(new Date(value))
    }
  },
  { 
    label: '创建时间', prop: 'createTime',
    formatter(row, column, value) {
      return utils.formateDate(new Date(value))
    }
  }
])
const deptList = ref([])
const pager= {
  pageNum: 1,
  pageSize: 10
}
export default {
  name: 'Dept',
  setup () {
    onMounted(() => {
      getDeptList()
    })
    const { proxy } = getCurrentInstance()
    const handleReset = (form) => {
      proxy.$refs[form].resetFields()
    }
    const getDeptList = async () => {
      const list = await proxy.$api.getDeptList({
        ...queryForm, ...pager
      })
      deptList.value = list
    }
    return { queryForm, columns, deptList,
    getDeptList, handleReset, getDeptList
    }
  }
}
</script>