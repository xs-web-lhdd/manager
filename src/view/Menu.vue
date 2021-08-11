<template>
  <div class="user-manager">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="form">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="queryForm.menuName" placeholder="请输入菜单名称"/>
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState">
          <el-select v-model="queryForm.menuState">
            <el-option :value="1" label="正常"></el-option>
            <el-option :value="2" label="停用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="() => handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd(1)">创建</el-button>
      </div>
      <el-table
        :data="menuList"
        row-key="_id"
      >
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
          width="220">
          <template #default="scope">
            <el-button @click="handleAdd(2, scope.row)" type="primary" size="mini">新增</el-button>
            <el-button @click="handleEdit(scope.row)" size="mini">编辑</el-button>
            <el-button type="danger" size="mini" @click="() => handleDel(scope.row._id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>


    <el-dialog title="菜单新增" v-model="showModal" @close="handleClose">
      <el-form ref="dialogForm" :model="menuForm" :rules="rules" label-width="100px">
        <el-form-item label="父级菜单" prop="parentId">
          <el-cascader
            v-model="menuForm.parentId"
            :options="menuList"
            :props="{ checkStrictly: true, value: '_id', label: 'menuName' }"
            clearable
            placeholder="请选择父级菜单"
          />
          <span style="margin-left: 20px">不选，则直接创建一级菜单</span>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="menuForm.menuType">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="menuForm.menuName" placeholder="请菜单名称"/>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon" v-show="menuForm.menuType === 1">
          <el-input v-model="menuForm.icon" placeholder="请输入菜单图标"/>
        </el-form-item>
        <el-form-item label="路由地址" prop="path" v-show="menuForm.menuType === 1">
          <el-input v-model="menuForm.path" placeholder="请输入路由地址"/>
        </el-form-item>
        <el-form-item label="权限标识" prop="menuCode" v-show="menuForm.menuType === 2">
          <el-input v-model="menuForm.menuCode" placeholder="请输入权限标识"/>
        </el-form-item>
        <el-form-item label="组件路径" prop="component" v-show="menuForm.menuType === 1">
          <el-input v-model="menuForm.component" placeholder="请输入组件路径"/>
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState" v-show="menuForm.menuType === 1">
          <el-radio-group v-model="menuForm.menuState">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
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
import utils from './../untils/utils'

const columns = ref([
  { label: '菜单名称', prop: 'menuName', width: 180 },
  { label: '图标', prop: 'icon' },
  { 
    label: '菜单类型', prop: 'menuType',
    formatter(row, column, value) {
      return {
        1: '菜单',
        2: '按钮'
      }[value]
    }
  },
  { label: '权限标识', prop: 'menuCode' },
  { label: '路由地址', prop: 'path' },
  { label: '组件路径', prop: 'component' },
  {
    label: '菜单状态', prop: 'menuState', width: 90,
    formatter(row, column, value) {
      return {
        1: '正常',
        2: '停用'
      }[value]
    }
  },
  { 
    label: '创建时间', prop: 'createTime',
    formatter(row, column, value) {
      return utils.formateDate(new Date(value))
    }
  }
])
const rules = reactive({
  menuName: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在2-8个字符', trigger: 'blur' }
  ]
})
const menuForm = reactive({
  menuType: 1,
  menuState: 1
})
const queryForm = reactive({
  menuState: 1
})

export default {
  name: 'Menu',
  setup () {
    // 实例化上下文对象
    const { ctx, proxy } = getCurrentInstance()
    const showModal = ref(false)
    const action = ref('add')
    // 查询
    const handleQuery = () => {
      getMenuList()
    }
    // 重置
    const handleReset = (form) => {
      ctx.$refs[form].resetFields()
    }
    // 新增
    const handleAdd = (type, row) => {
      showModal.value = true
      action.value = 'add'
      if (type === 2) {
        menuForm.parentId = [...row.parentId, row._id].filter(item => item)
      }
    }
    // 编辑
    const handleEdit = (row) => {
      showModal.value = true
      action.value = 'edit'
      // 通过nextTick以及浅拷贝实现重置编辑
      proxy.$nextTick(() => {
        // 浅拷贝 --- yyds
        Object.assign(menuForm, row)
      })
    }
    // 删除
    const handleDel = async (_id) => {
      action.value = 'delete'
      await proxy.$api.menuSubmit({_id, action})
      proxy.$message.success('删除成功')
      getMenuList()
    }
    // 提交
    const handleSubmit = () => {
      proxy.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let { menuForm } = proxy
          const active = action.value
          let params = { ...menuForm, active } 
          const res = await proxy.$api.menuSubmit(params)
          showModal.value = false
          proxy.$message.success('操作成功')
          handleReset('dialogForm')
          getMenuList()
        }
      })
    }
    // 取消
    const handleClose = () => {
      showModal.value = false
      handleReset('dialogForm')
    }
    const menuList = ref([])
    onMounted(() => {
      getMenuList()
    })
    // 获取菜单接口
    const getMenuList = async () => {
      try {
        const list = await proxy.$api.MenuList(proxy.$refs.form);
        menuList.value = list
      } catch (error) {
        console.log(error);
      }
    }
    return { queryForm, menuList, columns, showModal, menuForm, rules,
    handleQuery, handleReset, handleAdd, handleSubmit, handleClose,
    handleEdit, handleDel
    }
  }
}
</script>