<template>
  <div class="user-manager">
    <div class="query-form">
      <el-form :inline="true" :model="user" ref="ruleForm">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="user.userId" placeholder="请输入用户id"/>
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="user.userName" placeholder="请输入用户名称"/>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="user.state">
            <el-option :value="0" label="所有"></el-option>
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="() => handleReset('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate">新增</el-button>
        <el-button type="danger" @click="handlePatchDel">批量删除</el-button>
      </div>
      <el-table
        :data="userList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"/>
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        >
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template #default="scope">
            <el-button @click="handleEdit(scope.row)" size="mini">编辑</el-button>
            <el-button type="danger" size="mini" @click="() => handleDel(scope.row)">删除</el-button>
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


    <el-dialog title="用户新增" v-model="showModal" @close="handleClose" >
      <el-form ref="dialogForm" :model="userForm" :rules="rules" label-width="100px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="userForm.userName" :disabled="active === 'edit'" placeholder="请输入用户名称"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="userForm.userEmail" :disabled="active === 'edit'" placeholder="请输入用户邮箱">
            <template #append>@liang.com</template>
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userForm.mobile" placeholder="请输入手机号"/>
        </el-form-item>
        <el-form-item label="岗位" prop="job">
          <el-input v-model="userForm.job" placeholder="请输入岗位"/>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="userForm.state">
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统角色" prop="roleList">
          <el-select clearable v-model="userForm.roleList" placeholder="请选择用户系统角色" multiple style="width: 100%">
            <el-option
              v-for="role in roleList"
              :key="role._id"
              :label="role.roleName"
              :value="role._id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门" prop="deptId">
          <el-cascader
            v-model="userForm.deptId"
            placeholder="请选择所属部门"
            :options="deptList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
            style="width: 100%"
          >
          </el-cascader>
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
import { getCurrentInstance, onMounted, reactive, ref, toRaw } from 'vue'
// 表单格式
const columns = reactive([
  { label: '用户ID', prop: 'userId' },
  { label: '用户名称', prop: 'userName' },
  { label: '用户邮箱', prop: 'userEmail' },
  { 
    label: '用户角色',
    prop: 'role',
    formatter(row, column, value) {  //格式化 --- 根据不同的数值转换为不同的名称
      return {
        0: '管理员',
        1: '普通用户'
      }[value]
    } 
  },
  { 
    label: '用户状态',
    prop: 'state',
    formatter(row, column, value) {
      return {
        1: '在职',
        2: '离职',
        3: '试用期'
      }[value]
    }
  },
  { label: '注册时间', prop: 'createTime' },
  { label: '登录时间', prop: 'lastLoginTime' }
])

export default {
  name: 'User',
  setup () {
    const { ctx, proxy } = getCurrentInstance()
    const user = reactive({
      state: 0,
      userId: '',
      userName: ''
    })
    const userList = ref([])
    // 初始化分页数据
    const pager = reactive({
      pageNum: 1,
      pageSize: 10, // 通常服务端会给我们的一个具体的值
      total: 100
    })
    onMounted(() => {
      getUserList()
      getDeptList()
      getRoleList()
    })
    // 获取用户列表
    const getUserList = async () => {
      let params = {...user, ...pager}
      try {
        // vue3中想获取自己定义的全局对象要用proxy这个方法
        const { list, page } = await proxy.$api.getUserList(params);
        userList.value = list;
        pager.total = page.total
      } catch (error) { console.log(error); }
    }
    // 查询表单数据，获取用户列表
    const handleQuery = () => {
      getUserList()
    }
    // 重置查询表单，获取用户列表
    const handleReset = (form) => {
      ctx.$refs[form].resetFields()
    }
    // 分页事件处理：
    const handleCurrentChange = (current) => {
      pager.pageNum = current
      getUserList()
    }
    // 用户单个删除
    const handleDel = async (row) => {
      await proxy.$api.userDel({
        userId: [row.userId]
      })
      proxy.$message.success('删除成功')
      getUserList()
    }
    // 多个用户批量删除
    const checkedUserIds = ref([])
    const handlePatchDel = async () => {
      // 没有选中一个的情况：
      if (checkedUserIds.value.length === 0) {
        proxy.$message.error('请选择要删除的用户')
        return
      }
      const res = await proxy.$api.userDel({
        userId: checkedUserIds.value
      })
      if (res.nModified > 0) {
        proxy.$message.success('批量删除成功')
        getUserList()
      } else {
        proxy.$message.error('批量删除失败')
      }
    }
    // 表格多选
    const handleSelectionChange = (list) => {
      let arr = []
      list.map(item => arr.push(item.userId))
      checkedUserIds.value = arr
    }

    // 用户新增
    const userForm = reactive({
      state: 3
    })
    const showModal = ref(false)
    // 定义表单校验规则
    const rules = reactive({
      userName: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
      userEmail: [{ required: true, message: '请输入用户邮箱', trigger: 'blur' }],
      mobile: [
        { message: '请输入手机号', trigger: 'blur' },
        { pattern: /1\d{10}/, message: '请输入正确手机号格式', trigger: 'blur' }
      ],
      deptId: [{ required: true, message: '请选择所属部门', trigger: 'blur' }]
    })
    const handleCreate = () => {
      showModal.value = true
      active.active = 'add'
    }
    // 部门列表
    const deptList = ref([])
    const getDeptList = async () => {
      let list = await proxy.$api.getDeptList()
      deptList.value = list
    } 
    // 获取角色列表
    const roleList = ref([])
    const getRoleList = async () => {
      let list = await proxy.$api.getRoleList()
      roleList.value = list
    }

    // 新增用户弹窗确定and取消：
    const handleClose = () => {
      showModal.value = false
      active.value = 'add'
      handleReset('dialogForm')
    }
    const active = ref('add')
    const handleSubmit = () => {
      ctx.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let params = toRaw(userForm)
          params.userEmail += '@liang.com'
          params.active = active.value
          let res = await proxy.$api.userSubmit(params)
          if (res) {
            showModal.value = false
            proxy.$message.success('用户创建成功')
            handleReset('dialogForm')
            getUserList()
          }
        }
      })
    }
    // 用户编辑
    const handleEdit = (row) => {
      active.value = 'edit'
      showModal.value = true
      proxy.$nextTick(() => {
        Object.assign(userForm, row)
      })
    }
    return { user, userList, pager , checkedUserIds,
    columns, userForm, showModal, rules, deptList, roleList, active, getUserList, handleQuery, handleReset,
    handleCurrentChange, handleDel, handlePatchDel,
    handleSelectionChange, handleCreate, getRoleList, getDeptList,
    handleClose, handleSubmit, handleEdit }
  }
}
</script>

<style lang="scss" scoped>

</style>