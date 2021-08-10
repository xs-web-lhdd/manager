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
          <el-button @click="() => handleReset('from')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate">创建</el-button>
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
            <el-button @click="handleAdd" size="mini">新增</el-button>
            <el-button @click="handleEdit(scope.row)" size="mini">编辑</el-button>
            <el-button type="danger" size="mini" @click="() => handleDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { reactive, ref, onMounted, getCurrentInstance } from 'vue'
import utils from './../untils/utils'
export default {
  name: 'Menu',
  setup () {
    // 查询
    const handleQuery = () => {}
    const queryForm = reactive({
      menuState: 1
    })
    // 新增
    const handleReset = () => {}
    const menuList = ref([])
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
    onMounted(() => {
      getMenuList()
    })
    // 获取菜单接口
    const { ctx, proxy } = getCurrentInstance()
    const getMenuList = async () => {
      const list = await proxy.$api.MenuList(proxy.$refs.queryForm);
      menuList.value = list
    }
    return { queryForm, menuList, columns, handleQuery, handleReset }
  }
}
</script>