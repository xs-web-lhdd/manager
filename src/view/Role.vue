<template>
  <div class="role-manager">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="form">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="queryForm.roleName" placeholder="请输入角色名称"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="() => handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate">创建</el-button>
      </div>
      <el-table
        :data="roleList"
      >
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
          width="240"
          align="center"
        >
          <template #default="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini">设置权限</el-button>
            <el-button type="danger" size="mini" @click="() => handleDel(scope.row._id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="pager.total"
        :page-size="pager.pageSize"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>


    <el-dialog title="菜单新增" v-model="showModal" @close="handleClose">
      <el-form ref="dialogForm" :model="roleForm" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="2" v-model="roleForm.remark" placeholder="请输入备注" />
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
import { reactive, ref, onMounted, getCurrentInstance } from 'vue'
import utils from '../untils/utils'

const columns = ref([
  { label: '角色名称', prop: 'roleName' },
  { label: '备注', prop: 'remark' },
  { label: '权限列表', prop: '' },
  { 
    label: '创建时间', prop: 'createTime',
    formatter(row, column, value) {
      return utils.formateDate(new Date(value))
    }
  }
])

const queryForm = reactive({})
const roleList = ref([])
const pager = reactive({
  pageNum: 1,
  total: 100,
  pageSize: 1
})
const roleForm = reactive({})
const rules = reactive({
  roleName: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在2-8个字符', trigger: 'blur' }
  ]
})

// 获取角色管理列表接口
const useRolesListEffect = (proxy) => {
  // 获取请求接口
  const getRoleAllList = async () => {
    const { list, page }  = await proxy.$api.getRoleAllList(queryForm)
    roleList.value = list
    pager.total = page.total
  }
  // 查询
  const handleQuery = () => {
    getRoleAllList()
  }
  return { getRoleAllList, handleQuery }
}
// 创建、编辑、删除
const useCreateEditDeleteEffect = (action, proxy, showModal) => {
  // 创建
  const handleCreate = () => {
    showModal.value = true
    action.value = 'create'
  }
  // 编辑
  const handleEdit = (row) => {
    showModal.value = true
    action.value = 'edit'
    proxy.$nextTick(() => {
      Object.assign(roleForm, row)
    })
  }
  // 删除
  const handleDel = async (id) => {
    action.value = 'delete'
    let params = { id, action }
    const res = await proxy.$api.rolesOperate(params)
    if (res) {
      proxy.$message.success('删除成功')
    }
  }
  return { handleCreate, handleEdit, handleDel }
}
// 取消和提交和重置
const useCloseAndSubmitEffect = (showModal, proxy, action) => {
  // 取消弹框
  const handleClose = () => {
    showModal.value = false
    handleReset('dialogForm')
  }
  // 确定提交
  const handleSubmit = () => {
    proxy.$refs.dialogForm.validate(async (valid) => {
      if (valid) {
        showModal.value = false
        let params = { ...roleForm, action }
        const res = await proxy.$api.rolesOperate(params)
        if (res) {
          handleReset('dialogForm')
          proxy.$message.success('提交成功')
        }
      }
    })
  }
  // 重置
  const handleReset = (form) => {
    proxy.$refs[form].resetFields()
  }
  return { handleClose, handleSubmit, handleReset }
}
export default {
  name: 'Menu',
  setup () {
    onMounted(() => {
      getRoleAllList()
    })
    // 实例化上下文对象
    const { proxy } = getCurrentInstance()
    const action = ref('')
    const showModal = ref(false)
    const { getRoleAllList, handleQuery } = useRolesListEffect(proxy)
    const { handleCreate, handleEdit, handleDel } = useCreateEditDeleteEffect(action, proxy, showModal)
    const { handleClose, handleSubmit, handleReset } = useCloseAndSubmitEffect(showModal, proxy, action)
    // 分页
    const handleCurrentChange = () => {}

    return { columns, queryForm, roleList, pager, roleForm, rules, showModal,
    handleQuery, handleSubmit, handleReset, handleClose, handleCreate,
    handleCurrentChange, handleEdit, handleDel
    }
  }
}
</script>