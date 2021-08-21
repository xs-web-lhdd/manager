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
        <el-button type="primary" @click="handleCreate" v-has="'dept-create'">创建</el-button>
      </div>
      <el-table :data="deptList" row-key="_id">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
          :align="item.align"
        >
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="160"
          align="center"
        >
          <template #default="scope">
            <el-button type="primary" size="mini" @click="handleEdit(scope.row)" v-has="'dept-edit'">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDel(scope.row._id)" v-has="'dept-delete'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :title="action=='create'?'创建部门':'编辑部门'"
      v-model="showModal"
      @close="handleClose"
    >
      <el-form ref="dialogForm" :model="deptForm" :rules="rules" label-width="120px">
        <el-form-item label="上级部门" prop="parentId">
          <el-cascader
            v-model="deptForm.parentId"
            placeholder="请选择上级部门"
            :options="deptList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
            style="width: 100%"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input placeholder="请输入部门名称" v-model="deptForm.deptName" />
        </el-form-item>
        <el-form-item label="负责人" prop="user">
          <el-select placeholder="请选择部门负责人" v-model="deptForm.user" @change="handleUser">
            <el-option
              v-for="item in userList" 
              :key="item.userId"
              :label="item.userName"
              :value="`${item.userId}/${item.userName}/${item.userEmail}`"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责人邮箱" prop="userEmail">
          <el-input
            v-model="deptForm.userEmail"
            disabled
          >
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getCurrentInstance ,reactive, ref, onMounted } from 'vue'
import utils from '../untils/utils'

const queryForm = reactive({})
const columns = ref([
  { label: '部门名称', prop: 'deptName', width: '120', align: 'left' },
  { label: '负责人', prop: 'userName', align: 'center' },
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
const userList = ref([])
const deptForm = reactive({
  parentId: [null]
})
const rules = reactive({
  parentId: [{ required: true, message: '请选择上级部门', trigger: 'blur' }],
  deptName: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
  user: [{ required: true, message: '请选择部门负责人', trigger: 'blur' }]
})
export default {
  name: 'Dept',
  setup () {
    onMounted(() => {
      getDeptList()
      getUserList()
    })
    const { proxy } = getCurrentInstance()
    const handleReset = (form) => {
      proxy.$refs[form].resetFields()
    }
    const getDeptList = async () => {
      const list = await proxy.$api.getDeptList({
        ...queryForm
      })
      deptList.value = list
    }
    const action = ref('')
    const showModal = ref(false)
    // 创建
    const handleCreate = () => {
      action.value = 'create'
      showModal.value = true
    }
    // 编辑
    const handleEdit = (row) => {
      action.value = 'edit'
      showModal.value = true
      proxy.$nextTick(() => {
        Object.assign(deptForm, row, {user: `${row.userId}/${row.userName}/${row.userEmail}`})
      })
    }
    // 删除
    const handleDel = async (_id) => {
      action.value = 'delete'
      let res = await proxy.$api.deptOperate({_id, action: action.value})
      proxy.$message.success('删除成功')
      getDeptList()
    }
    // 关闭按钮
    const handleClose = () => {
      showModal.value = false
      handleReset('dialogForm')
    }
    // 确定提交
    const handleSubmit = () => {
      proxy.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let params = {...deptForm, action: action.value}
          delete params.user
          let res = await proxy.$api.deptOperate(params)
          let info
          action.value == 'create'? info = '创建成功' : info = '编辑成功'
          proxy.$message.success(info)
          handleReset('dialogForm')
          showModal.value = false
          getDeptList()
        }
      })
    }
    // 查询所有用户
    const getUserList = async () => {
      // const { list } = await proxy.$api.getUserList()
      const list = await proxy.$api.getAllUserList()
      userList.value = list
    }
    // 根据选择不同用户显示不同邮箱
    const handleUser = (value) => {
      const [userId, userName, userEmail] = value.split('/')
      Object.assign(deptForm, {userId, userName, userEmail})
    }
    return { queryForm, columns, deptList, action, showModal, userList,
    deptForm, rules,
    getDeptList, handleReset, getDeptList, handleCreate,
    handleEdit, handleDel, handleClose, handleSubmit, handleUser
    }
  }
}
</script>