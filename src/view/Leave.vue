<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="queryForm">
        <el-form-item label="审批状态" prop="applyState">
          <el-select v-model="queryForm.applyState" placeholder="请选择审批状态">
            <el-option value="" label="全部"></el-option>
            <el-option :value="1" label="待审批"></el-option>
            <el-option :value="2" label="审批中"></el-option>
            <el-option :value="3" label="审批拒绝"></el-option>
            <el-option :value="4" label="审批通过"></el-option>
            <el-option :value="5" label="作废"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getApplyList">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleApply">申请休假</el-button>
      </div>
      <el-table :data="applyList">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        >
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="mini" @click="handleDetail(scope.row)">查看</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row._id)">作废</el-button>
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
      />
    </div>
    <el-dialog title="申请休假" v-model="showModal" width="70%" @close="handleClose">
      <el-form
        ref="dialogForm"
        :model="leaveForm"
        label-width="120px"
        :rules="rules"
      >
        <el-form-item label="休假类型" prop="applyType">
          <el-select v-model="leaveForm.applyType" placeholder="请选择休假类型">
            <el-option label="事假" :value="1"></el-option>
            <el-option label="调休" :value="2"></el-option>
            <el-option label="年假" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="休假时间段" required>
          <el-row>
            <el-col :span="8">
              <el-form-item prop="startTime">
                <el-date-picker
                  v-model="leaveForm.startTime"
                  type="date"
                  placeholder="选择开始日期"
                  @change="(val) => handleDateChange('startTime', val)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="1">-</el-col>
            <el-col :span="8">
              <el-form-item prop="endTime">
                <el-date-picker
                  v-model="leaveForm.endTime"
                  type="date"
                  placeholder="选择结束日期"
                  @change="(val) => handleDateChange('endTime', val)"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="休假时长">
          {{ leaveForm.leaveTime }}天
        </el-form-item>
        <el-form-item label="休假原因" prop="reasons">
          <el-input
            type="textarea"
            :row="3"
            placeholder="请输入休假原因"
            v-model="leaveForm.reasons"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      title="申请休假详情"
      width="50%"
      v-model="showDetailModal"
      destroy-on-close
    >
      <el-steps
        :active="detail.applyState > 2 ? 3 : detail.applyState"
        align-center
      >
        <el-step title="待审批"></el-step>
        <el-step title="审批中"></el-step>
        <el-step title="审批通过/审批拒绝"></el-step>
      </el-steps>
      <el-form label-width="120px" label-suffix=":">
        <el-form-item label="休假类型">
          <div>{{ detail.applyTypeName }}</div>
        </el-form-item>
        <el-form-item label="休假时间">
          <div>{{ detail.time }}</div>
        </el-form-item>
        <el-form-item label="休假时长">
          <div>{{ detail.leaveTime }}</div>
        </el-form-item>
        <el-form-item label="休假原因">
          <div>{{ detail.reasons }}</div>
        </el-form-item>
        <el-form-item label="审批状态">
          <div>{{ detail.applyStateName }}</div>
        </el-form-item>
        <el-form-item label="审批人">
          <div>{{ detail.curAuditUserName }}</div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, ref, onMounted, getCurrentInstance } from 'vue'
import utils from './../untils/utils'

const queryForm = reactive({})
const applyList = ref([])
// 定义动态表格-格式
const columns = reactive([
  { label: "单号", prop: "orderNo", width: '100' },
  { label: "休假时间", prop: "",
    formatter(row) {
      return (
        utils.formateDate(new Date(row.startTime), "yyyy-MM-dd") +
        "到" +
        utils.formateDate(new Date(row.endTime), "yyyy-MM-dd")
      );
    },
  },
  { label: "休假时长", prop: "leaveTime" },
  { label: "休假类型", prop: "applyType",
    formatter(row, column, value) {
      return {
        1: "事假",
        2: "调休",
        3: "年假",
      }[value];
    },
  },
  { label: "休假原因", prop: "reasons" },
  { label: "申请时间", prop: "createTime", width: 140,
    formatter: (row, column, value) => {
      return utils.formateDate(new Date(value));
    },
  },
  { label: "审批人", prop: "auditUsers" },
  { label: "当前审批人", prop: "curAuditUserName" },
  { label: "审批状态", prop: "applyState",
    formatter: (row, column, value) => {
      // 1:待审批 2:审批中 3:审批拒绝 4:审批通过 5:作废
      return {
        1: "待审批",
        2: "审批中",
        3: "审批拒绝",
        4: "审批通过",
        5: "作废",
      }[value];
    },
  },
]);
const pager = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 1
})
const leaveForm = reactive({
  leaveTime: 2
})
const action = ref('')
const detail = reactive({})
const rules = reactive({
  applyType: [{ required: true, message: '请选择休假类型', trigger: 'blur' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'blur' }],
  reasons: [{ required: true, message: '请输入休假原因', trigger: 'blur' }]
})
export default {
  name: 'Leave',
  setup () {
    const { proxy } = getCurrentInstance()
    // 初始化接口调用
    onMounted(() => {
      getApplyList()
    })
    // 重置
    const handleReset = (form) => {
      proxy.$refs[form].resetFields()
    }
    const showModal = ref(false)
    // 申请休假
    const handleApply = () => {
      showModal.value = true
      action.value = 'create'
    }
    // 关闭
    const handleClose = () => {
      showModal.value = false
      handleReset('dialogForm')
    }
    // 确定提交
    const handleSubmit = () => {
      proxy.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let params = { ...leaveForm, action: action.value }
          const res = await proxy.$api.leaveOperate(params)
          proxy.$message.success('创建成功')
          handleClose()
          getApplyList()
        }
      })
    }
    // 日期
    const handleDateChange = (key, value) => {
      let { startTime, endTime } = leaveForm
      if (!startTime || !endTime) return
      if (startTime > endTime) {
        proxy.$message.error('开始时期不能晚于结束时间')
        leaveForm.leaveTime = '0天'
        leaveForm.startTime = ''
        leaveForm.endTime = ''
      }
      leaveForm.leaveTime = (endTime - startTime) / (60*60*24*1000) + 1
    }
    // 分页
    const handleCurrentChange = () => {

    }
    // 加载申请列表：
    const getApplyList = async () => {
      let params = { ...queryForm, ...pager }
      const { list, page } = await proxy.$api.getLeaveList(params)
      applyList.value = list
      pager.total = page.total
    }
    const showDetailModal = ref(false)
    // 查看申请详情
    const handleDetail = (row) => {
      showDetailModal.value = true
    }
    return { queryForm, applyList, columns, pager, showModal,
      leaveForm, showDetailModal, action, detail, rules,
      handleApply, handleDateChange,
      getApplyList, handleReset, handleClose, handleSubmit,
      handleCurrentChange, handleDetail
    }
  }
}
</script>