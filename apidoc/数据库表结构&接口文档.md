### 数据库表结构

```shell
//  用户集合：users
{
    "userId" : 1000001,//用户ID，自增长
    "userName" : "admin",//用户名称
    "userPwd" : "e10adc3949ba59abbe56e057f20f883e",//用户密码，md5加密
    "userEmail" : "admin@imooc.com",//用户邮箱
    "mobile":13788888888,//手机号
    "sex":0,//性别 0:男  1：女 
    "deptId":[ObjectId("")],//部门
    "job":"前端架构师",//岗位
    "state" : 1,// 1: 在职 2: 离职 3: 试用期
    "role": 0, // 用户角色 0：系统管理员  1： 普通用户
    "roleList" : [ObjectId("")], //系统角色
    "createTime" : ISODate("2021-01-17T13:32:06.381Z"),//创建时间
    "lastLoginTime" : ISODate("2021-01-17T13:32:06.381Z"),//更新时间
}

// 菜单集合：menus
{
		"menuType":1,//菜单类型 1:菜单 2:按钮
    "menuName":"系统管理",//菜单名称
    "menuCode":"",//菜单标识符，只有按钮类型才有，用于确定按钮权限
    "path":"/system",//菜单路由
    "icon":"el-icon-setting",//菜单图标
    "component":"",//组件地址
    "parentId":[null],//父菜单ID
    "createTime":ISODate("2021-01-17T13:32:06.381Z"),//创建时间
}

// 部门集合：depts
{
    "parentId":[null],//父对象Id，一级部门默认为null
    "deptName":"前端开发部",
    "userId":1000001,//负责人，用户ID
    "userName":"Jack",//部门负责人
    "userEmail":"jack@163.com",//同上
    "createTime":ISODate("2021-01-17T13:32:06.381Z"),//创建时间
    "updateTime":ISODate("2021-01-17T13:32:06.381Z"),//更新时间
}

// 角色集合：roles
{
    "roleName":"产品经理",//角色名称
    "remark":"产品专用",//备注信息
    "permissionList":{
    		"checkedKeys":[ObjectId("")],//选中的子菜单
    		"halfCheckedKeys":[ObjectId("")],//半选中的父菜单
    },//权限列表
    "createTime":"2020-11-20 19:29:42",//创建时间
}

// 自增集合：counters
{
	"_id":"userId",//增长字段
	"sequence_value":1000001//增长值
}

// 审批流集合：leaves
{
		"orderNo":"XJ2020030522001",//申请单号
		"applyType":1,//申请类型  1:事假 2：调休 3:年假
    "startTime":"2020-11-20 19:29:42",//开始时间
    "endTime":"2020-11-20 19:29:42",//结束时间
    "applyUser":{//申请人信息
    	"userId":1000001,
    	"userName":"Jack",
    	"userEmail":"admin@163.com"
    },
    "leaveTime":"2天",//休假时间
    "reason":"生病",//休假原因
    "auditUser":'BaiDu，Ali，JD，CaiWu',//完整审批人
    "curAuditUserName":"BaiDu",//当前审批人
    "applyState":1,// 1:待审批 2:审批中 3:审批拒绝 4:审批通过 5:作废
    "auditFlows":[//审批流
        {userId: 1000005, userName: "BaiDu", userEmail: "BaiDu@163.com"},
        {userId: 1000008, userName: "Ali", userEmail: "Ali@163.com"},
        {userId: 1000009, userName: "JD", userEmail: "JD@163.com"}
    ],
    "auditLogs":[
    		{
    			userId: 1000005, 
    			userName: "BaiDu", 
    			createTime: "2020-11-20 19:29:42",
    			remark"同意",
    			action:"审核通过"
    		},
    		{
    			userId: 1000008, 
    			userName: "Ali", 
    			createTime: "2020-11-20 19:29:42",
    			remark"同意",
    			action:"审核拒绝"
    		},
    ],
    "createTime":'',//申请时间
}
```

### 接口文档

**文档形式：**Swagger、YAPI、EasyMock、MarkDown

**地址前缀：**http://localhost:3000/api

**通用结构体**

```
// 分页结构
{
	pageNum:1, 		// 当前页码
  pageSize:10 // 每页条数，默认10
}

// 返回结构
{
  code:200,// 状态码 200：成功，非200：失败
  data:"",// 返回结果
  msg:""//错误信息
}

// 错误码
{
    SUCCESS: 200,
    PARAM_ERROR: 10001,//'参数不正确',
    USER_ACCOUNT_ERROR:20001,//用户账号密码错误
    USER_LOGIN_ERROR:20002,//用户未登录
    BUSINESS_ERROR: 30001,//业务请求失败
    AUTH_ERROR: 40001,//认证失败或TOKEN过期
}

// 公共请求头携带token
{
  Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MTUxMTA3NzcsImRhdGEiOnsidXNlck5hbWUiOiJhZG1pbiIsInVzZXJJZCI6MTAwMDAwMiwiZGVwdElkIjpbIjYwMTY3MDU5YzkwMjdiN2QyYzUyMGE2MSIsIjYwMTY3MzQ1YzZhNDQxN2YyZDI3NTA2ZiJdLCJyb2xlIjoiMCJ9LCJpYXQiOjE2MTUwMjQzNzd9.gaXhcyer27m35ouHPLwC51TP1cjBl5BMroHxknXcABI"
}

// 角色
role:0 管理员 1：普通用户
```

#### 登录

**POST  "/users/login"**

> request

```
{
  userName,
  userPwd
}
```

> response

success

```json
{
  code:200,
  data:{
    userId
    userName,
    userEmail,
    state,
    deptId,
    role,
    token,
    roleList:[]
  }
}
```

fail

```
{
	code:20001,
	data:'',
	msg:'账号或密码不正确'
}
```

#### 用户列表

**GET  "/users/list"**

> request

```
{
	userId,
  userName,
  state, 			// 0:所有 1：在职 2：离职 3：试用期
  pageNum:1, 		// 当前页码
  pageSize:10 // 每页条数，默认10
}
```

> response

success

```json
{
  "code": 200,
  "data": {
    "page": {
      "pageNum": 1,
      "pageSize": 10,
      "total": 24
    },
    "list": [
      {
        "state": 1,
        "role": "0",
        "roleList": [
          "60180b07b1eaed6c45fbebdb",
          "60150cb764de99631b2c3cd3",
          "60180b59b1eaed6c45fbebdc"
        ],
        "deptId": [
          "60167059c9027b7d2c520a61",
          "60167345c6a4417f2d27506f"
        ],
        "userId": 1000002,
        "userName": "admin",
        "userEmail": "admin@imooc.com",
        "createTime": "2021-01-17T13:32:06.381Z",
        "lastLoginTime": "2021-01-17T13:32:06.381Z",
        "__v": 0,
        "job": "前端架构师",
        "mobile": "17611020000"
      }
    ]
  },
  "msg": ""
}
```

fail

```
{
	code:30001,
	data:'',
	msg:'查询失败'
}
```

#### 所有用户列表

**GET  "/users/all/list"**

> request

```
{}
```

> response

success

```json
{
  "code": 200,
  "data": [
    {
      "state": 1,
      "role": "0",
      "roleList": [
        "60180b07b1eaed6c45fbebdb",
        "60150cb764de99631b2c3cd3",
        "60180b59b1eaed6c45fbebdc"
      ],
      "deptId": [
        "60167059c9027b7d2c520a61",
        "60167345c6a4417f2d27506f"
      ],
      "userId": 1000002,
      "userName": "admin",
      "userEmail": "admin@imooc.com",
      "createTime": "2021-01-17T13:32:06.381Z",
      "lastLoginTime": "2021-01-17T13:32:06.381Z",
      "__v": 0,
      "job": "前端架构师",
      "mobile": "17611020000"
    }
  ],
  "msg": ""
}
```

fail

```
{
	code:30001,
	data:'',
	msg:'查询失败'
}
```

#### 用户创建/编辑

**POST  "/users/operate"**

> request

```
{
	userId,userName,userEmail,mobile,job,state,roleList,deptId,
	action // edit:编辑 add:新增
}
```

> response

success

```json
{
  "code": 200,
  "data": '修改成功/创建成功',
  "msg": ""
}
```

fail

```
{
	code:30001,
	data:'',
	msg:'修改失败/创建失败'
}
```

#### 用户删除

**POST  "/users/delete"**

> request

```
{
	userIds:[userId,userId]//可单个删除，也可批量删除
}
```

> response

success

```json
{
  "code": 200,
  "data": {
    nModified:1 //删除成功条数	
  },
  "msg": "删除成功1条"
}
```

fail

```
{
	code:30001,
	data:'',
	msg:'删除失败'
}
```

#### 用户权限列表

**GET  "/users/getPermissionList"**

> request

```
{}
```

> response

success

```json
{
  "code": 200,
  "data": {
    "menuList": [
      {
        "parentId": [
          null
        ],
        "updateTime": "2021-03-06T10:03:38.947Z",
        "createTime": "2021-01-30T09:22:00.000Z",
        "_id": "600d4075e218daaf4ec77e52",
        "menuType": "1",
        "menuName": "系统管理",
        "menuCode": "",
        "path": "/system",
        "icon": "el-icon-setting",
        "order": "0",
        "component": "",
        "children": [
          {
            "parentId": [
              "600d4075e218daaf4ec77e52"
            ],
            "updateTime": "2021-02-04T07:12:21.077Z",
            "createTime": "2021-01-30T08:10:00.000Z",
            "_id": "600d525e602f452aaeeffcd9",
            "menuType": "1",
            "menuName": "用户管理",
            "menuCode": "",
            "path": "/system/user",
            "icon": "",
            "order": "1",
            "component": "/system/user",
            "menuState": "1",
            "children": [
              {
                "parentId": [
                  "600d4075e218daaf4ec77e52",
                  "600d525e602f452aaeeffcd9"
                ],
                "updateTime": "2021-02-21T09:54:44.242Z",
                "createTime": "2021-02-20T06:46:50.711Z",
                "_id": "6030ca8f93f0e159c8390f0c",
                "menuType": "2",
                "menuState": "1",
                "menuName": "新增",
                "menuCode": "user-create",
                "__v": 0
              },
              {
                "parentId": [
                  "600d4075e218daaf4ec77e52",
                  "600d525e602f452aaeeffcd9"
                ],
                "updateTime": "2021-02-21T09:54:50.464Z",
                "createTime": "2021-02-21T08:50:47.217Z",
                "_id": "603226d9257d15a8c54cf9f8",
                "menuType": "2",
                "menuState": "1",
                "menuName": "批量删除",
                "menuCode": "user-delete",
                "__v": 0
              },
              {
                "parentId": [
                  "600d4075e218daaf4ec77e52",
                  "600d525e602f452aaeeffcd9"
                ],
                "updateTime": "2021-02-21T11:06:19.345Z",
                "createTime": "2021-02-21T11:06:19.345Z",
                "_id": "603253e0a821c6bb59084541",
                "menuType": "2",
                "menuState": "1",
                "menuName": "查看",
                "menuCode": "user-query",
                "__v": 0
              }
            ],
            "action": [
              {
                "parentId": [
                  "600d4075e218daaf4ec77e52",
                  "600d525e602f452aaeeffcd9"
                ],
                "updateTime": "2021-02-21T09:54:44.242Z",
                "createTime": "2021-02-20T06:46:50.711Z",
                "_id": "6030ca8f93f0e159c8390f0c",
                "menuType": "2",
                "menuState": "1",
                "menuName": "新增",
                "menuCode": "user-create",
                "__v": 0
              },
              {
                "parentId": [
                  "600d4075e218daaf4ec77e52",
                  "600d525e602f452aaeeffcd9"
                ],
                "updateTime": "2021-02-21T09:54:50.464Z",
                "createTime": "2021-02-21T08:50:47.217Z",
                "_id": "603226d9257d15a8c54cf9f8",
                "menuType": "2",
                "menuState": "1",
                "menuName": "批量删除",
                "menuCode": "user-delete",
                "__v": 0
              },
              {
                "parentId": [
                  "600d4075e218daaf4ec77e52",
                  "600d525e602f452aaeeffcd9"
                ],
                "updateTime": "2021-02-21T11:06:19.345Z",
                "createTime": "2021-02-21T11:06:19.345Z",
                "_id": "603253e0a821c6bb59084541",
                "menuType": "2",
                "menuState": "1",
                "menuName": "查看",
                "menuCode": "user-query",
                "__v": 0
              }
            ]
          },
          {
            "parentId": [
              "600d4075e218daaf4ec77e52"
            ],
            "updateTime": "2021-02-04T09:52:40.576Z",
            "createTime": "2021-02-04T09:52:40.576Z",
            "_id": "601bc4f8a794e23c2e42efa9",
            "menuType": "1",
            "menuState": "1",
            "menuName": "菜单管理",
            "path": "/system/menu",
            "component": "/system/menu",
            "__v": 0,
            "children": [
              {
                "parentId": [
                  "600d4075e218daaf4ec77e52",
                  "601bc4f8a794e23c2e42efa9"
                ],
                "updateTime": "2021-02-21T11:06:19.345Z",
                "createTime": "2021-02-21T11:06:19.345Z",
                "_id": "60325400a821c6bb59084543",
                "menuType": "2",
                "menuState": "1",
                "menuName": "查看",
                "menuCode": "menu-query",
                "__v": 0
              },
              {
                "parentId": [
                  "600d4075e218daaf4ec77e52",
                  "601bc4f8a794e23c2e42efa9"
                ],
                "updateTime": "2021-02-21T11:06:19.345Z",
                "createTime": "2021-02-21T11:06:19.345Z",
                "_id": "6032540fa821c6bb59084544",
                "menuType": "2",
                "menuState": "1",
                "menuName": "创建",
                "menuCode": "menu-create",
                "__v": 0
              }
            ],
            "action": [
              {
                "parentId": [
                  "600d4075e218daaf4ec77e52",
                  "601bc4f8a794e23c2e42efa9"
                ],
                "updateTime": "2021-02-21T11:06:19.345Z",
                "createTime": "2021-02-21T11:06:19.345Z",
                "_id": "60325400a821c6bb59084543",
                "menuType": "2",
                "menuState": "1",
                "menuName": "查看",
                "menuCode": "menu-query",
                "__v": 0
              },
              {
                "parentId": [
                  "600d4075e218daaf4ec77e52",
                  "601bc4f8a794e23c2e42efa9"
                ],
                "updateTime": "2021-02-21T11:06:19.345Z",
                "createTime": "2021-02-21T11:06:19.345Z",
                "_id": "6032540fa821c6bb59084544",
                "menuType": "2",
                "menuState": "1",
                "menuName": "创建",
                "menuCode": "menu-create",
                "__v": 0
              }
            ]
          },
          {
            "parentId": [
              "600d4075e218daaf4ec77e52"
            ],
            "updateTime": "2021-02-04T09:52:40.576Z",
            "createTime": "2021-02-04T09:52:40.576Z",
            "_id": "601ca9a8a794e23c2e42efab",
            "menuType": "1",
            "menuState": "1",
            "menuName": "角色管理",
            "path": "/system/role",
            "component": "/system/role",
            "__v": 0,
            "children": [
              {
                "parentId": [
                  "600d4075e218daaf4ec77e52",
                  "601ca9a8a794e23c2e42efab"
                ],
                "updateTime": "2021-02-21T12:38:19.650Z",
                "createTime": "2021-02-21T11:06:19.345Z",
                "_id": "60325425a821c6bb59084545",
                "menuType": "2",
                "menuState": "1",
                "menuName": "查看",
                "menuCode": "role-query",
                "__v": 0
              },
              {
                "parentId": [
                  "600d4075e218daaf4ec77e52",
                  "601ca9a8a794e23c2e42efab"
                ],
                "updateTime": "2021-02-21T11:06:19.345Z",
                "createTime": "2021-02-21T11:06:19.345Z",
                "_id": "60325461a821c6bb59084546",
                "menuType": "2",
                "menuState": "1",
                "menuName": "创建",
                "menuCode": "role-create",
                "__v": 0
              }
            ],
            "action": [
              {
                "parentId": [
                  "600d4075e218daaf4ec77e52",
                  "601ca9a8a794e23c2e42efab"
                ],
                "updateTime": "2021-02-21T12:38:19.650Z",
                "createTime": "2021-02-21T11:06:19.345Z",
                "_id": "60325425a821c6bb59084545",
                "menuType": "2",
                "menuState": "1",
                "menuName": "查看",
                "menuCode": "role-query",
                "__v": 0
              },
              {
                "parentId": [
                  "600d4075e218daaf4ec77e52",
                  "601ca9a8a794e23c2e42efab"
                ],
                "updateTime": "2021-02-21T11:06:19.345Z",
                "createTime": "2021-02-21T11:06:19.345Z",
                "_id": "60325461a821c6bb59084546",
                "menuType": "2",
                "menuState": "1",
                "menuName": "创建",
                "menuCode": "role-create",
                "__v": 0
              }
            ]
          },
          {
            "parentId": [
              "600d4075e218daaf4ec77e52"
            ],
            "updateTime": "2021-02-04T09:52:40.576Z",
            "createTime": "2021-02-04T09:52:40.576Z",
            "_id": "601cb172a794e23c2e42efac",
            "menuType": "1",
            "menuState": "1",
            "menuName": "部门管理",
            "path": "/system/dept",
            "component": "/system/dept",
            "__v": 0,
            "children": [
              {
                "parentId": [
                  "600d4075e218daaf4ec77e52",
                  "601cb172a794e23c2e42efac"
                ],
                "updateTime": "2021-02-21T11:06:19.345Z",
                "createTime": "2021-02-21T11:06:19.345Z",
                "_id": "60325470a821c6bb59084547",
                "menuType": "2",
                "menuState": "1",
                "menuName": "查看",
                "menuCode": "dept-query",
                "__v": 0
              },
              {
                "parentId": [
                  "600d4075e218daaf4ec77e52",
                  "601cb172a794e23c2e42efac"
                ],
                "updateTime": "2021-02-21T11:06:19.345Z",
                "createTime": "2021-02-21T11:06:19.345Z",
                "_id": "6032547da821c6bb59084548",
                "menuType": "2",
                "menuState": "1",
                "menuName": "创建",
                "menuCode": "dept-create",
                "__v": 0
              }
            ],
            "action": [
              {
                "parentId": [
                  "600d4075e218daaf4ec77e52",
                  "601cb172a794e23c2e42efac"
                ],
                "updateTime": "2021-02-21T11:06:19.345Z",
                "createTime": "2021-02-21T11:06:19.345Z",
                "_id": "60325470a821c6bb59084547",
                "menuType": "2",
                "menuState": "1",
                "menuName": "查看",
                "menuCode": "dept-query",
                "__v": 0
              },
              {
                "parentId": [
                  "600d4075e218daaf4ec77e52",
                  "601cb172a794e23c2e42efac"
                ],
                "updateTime": "2021-02-21T11:06:19.345Z",
                "createTime": "2021-02-21T11:06:19.345Z",
                "_id": "6032547da821c6bb59084548",
                "menuType": "2",
                "menuState": "1",
                "menuName": "创建",
                "menuCode": "dept-create",
                "__v": 0
              }
            ]
          }
        ]
      },
      {
        "parentId": [
          null
        ],
        "updateTime": "2021-02-18T01:42:15.243Z",
        "createTime": "2021-02-04T06:56:46.506Z",
        "_id": "601b9eb25929c81a1f988bb0",
        "menuType": "1",
        "menuState": "1",
        "menuName": "审批管理",
        "path": "/audit",
        "icon": "el-icon-s-promotion",
        "__v": 0,
        "children": [
          {
            "parentId": [
              "601b9eb25929c81a1f988bb0"
            ],
            "updateTime": "2021-02-19T14:50:00.555Z",
            "createTime": "2021-02-04T09:52:40.576Z",
            "_id": "601bc763a794e23c2e42efaa",
            "menuType": "1",
            "menuState": "1",
            "menuName": "休假申请",
            "path": "/audit/leave",
            "component": "/audit/leave",
            "__v": 0,
            "children": [
              {
                "parentId": [
                  "601b9eb25929c81a1f988bb0",
                  "601bc763a794e23c2e42efaa"
                ],
                "updateTime": "2021-02-21T11:06:19.345Z",
                "createTime": "2021-02-21T11:06:19.345Z",
                "_id": "603254a8a821c6bb59084549",
                "menuType": "2",
                "menuState": "1",
                "menuName": "查看",
                "menuCode": "leave-query",
                "__v": 0
              },
              {
                "parentId": [
                  "601b9eb25929c81a1f988bb0",
                  "601bc763a794e23c2e42efaa"
                ],
                "updateTime": "2021-02-21T11:06:19.345Z",
                "createTime": "2021-02-21T11:06:19.345Z",
                "_id": "603254baa821c6bb5908454a",
                "menuType": "2",
                "menuState": "1",
                "menuName": "申请休假",
                "menuCode": "leave-create",
                "__v": 0
              }
            ],
            "action": [
              {
                "parentId": [
                  "601b9eb25929c81a1f988bb0",
                  "601bc763a794e23c2e42efaa"
                ],
                "updateTime": "2021-02-21T11:06:19.345Z",
                "createTime": "2021-02-21T11:06:19.345Z",
                "_id": "603254a8a821c6bb59084549",
                "menuType": "2",
                "menuState": "1",
                "menuName": "查看",
                "menuCode": "leave-query",
                "__v": 0
              },
              {
                "parentId": [
                  "601b9eb25929c81a1f988bb0",
                  "601bc763a794e23c2e42efaa"
                ],
                "updateTime": "2021-02-21T11:06:19.345Z",
                "createTime": "2021-02-21T11:06:19.345Z",
                "_id": "603254baa821c6bb5908454a",
                "menuType": "2",
                "menuState": "1",
                "menuName": "申请休假",
                "menuCode": "leave-create",
                "__v": 0
              }
            ]
          },
          {
            "parentId": [
              "601b9eb25929c81a1f988bb0"
            ],
            "updateTime": "2021-02-19T14:53:04.590Z",
            "createTime": "2021-02-04T09:52:40.576Z",
            "_id": "602fd045bf465a015fef54dc",
            "menuType": "1",
            "menuState": "1",
            "menuName": "待我审批",
            "path": "/audit/approve",
            "component": "/audit/approve",
            "__v": 0,
            "children": [
              {
                "parentId": [
                  "601b9eb25929c81a1f988bb0",
                  "602fd045bf465a015fef54dc"
                ],
                "updateTime": "2021-02-21T11:06:19.345Z",
                "createTime": "2021-02-21T11:06:19.345Z",
                "_id": "60361f35a821c6bb5908454d",
                "menuType": "2",
                "menuState": "1",
                "menuName": "查看",
                "menuCode": "approve-query",
                "__v": 0
              }
            ],
            "action": [
              {
                "parentId": [
                  "601b9eb25929c81a1f988bb0",
                  "602fd045bf465a015fef54dc"
                ],
                "updateTime": "2021-02-21T11:06:19.345Z",
                "createTime": "2021-02-21T11:06:19.345Z",
                "_id": "60361f35a821c6bb5908454d",
                "menuType": "2",
                "menuState": "1",
                "menuName": "查看",
                "menuCode": "approve-query",
                "__v": 0
              }
            ]
          }
        ]
      }
    ],
    "actionList": [
      "approve-query",
      "leave-query",
      "leave-create",
      "dept-query",
      "dept-create",
      "role-query",
      "role-create",
      "menu-query",
      "menu-create",
      "user-create",
      "user-delete",
      "user-query"
    ]
  },
  "msg": ""
}
```

fail

```
{
	code:30001,
	data:'',
	msg:'查询失败'
}
```

#### 菜单列表

**POST  "/menu/list"**

> request

```
{
  menuName,
  menuState
}
```

> response

success

```json
{
  "code": 200,
  "data": [
    {
      "parentId": [
        null
      ],
      "updateTime": "2021-03-06T10:03:38.947Z",
      "createTime": "2021-01-30T09:22:00.000Z",
      "_id": "600d4075e218daaf4ec77e52",
      "menuType": "1",
      "menuName": "系统管理",
      "menuCode": "",
      "path": "/system",
      "icon": "el-icon-setting",
      "order": "0",
      "component": "",
      "children": [
        {
          "parentId": [
            "600d4075e218daaf4ec77e52"
          ],
          "updateTime": "2021-02-04T07:12:21.077Z",
          "createTime": "2021-01-30T08:10:00.000Z",
          "_id": "600d525e602f452aaeeffcd9",
          "menuType": "1",
          "menuName": "用户管理",
          "menuCode": "",
          "path": "/system/user",
          "icon": "",
          "order": "1",
          "component": "/system/user",
          "menuState": "1",
          "children": [
            {
              "parentId": [
                "600d4075e218daaf4ec77e52",
                "600d525e602f452aaeeffcd9"
              ],
              "updateTime": "2021-02-21T09:54:44.242Z",
              "createTime": "2021-02-20T06:46:50.711Z",
              "_id": "6030ca8f93f0e159c8390f0c",
              "menuType": "2",
              "menuState": "1",
              "menuName": "新增",
              "menuCode": "user-create",
              "__v": 0
            },
            {
              "parentId": [
                "600d4075e218daaf4ec77e52",
                "600d525e602f452aaeeffcd9"
              ],
              "updateTime": "2021-02-21T09:54:50.464Z",
              "createTime": "2021-02-21T08:50:47.217Z",
              "_id": "603226d9257d15a8c54cf9f8",
              "menuType": "2",
              "menuState": "1",
              "menuName": "批量删除",
              "menuCode": "user-delete",
              "__v": 0
            },
            {
              "parentId": [
                "600d4075e218daaf4ec77e52",
                "600d525e602f452aaeeffcd9"
              ],
              "updateTime": "2021-02-21T11:06:19.345Z",
              "createTime": "2021-02-21T11:06:19.345Z",
              "_id": "603253e0a821c6bb59084541",
              "menuType": "2",
              "menuState": "1",
              "menuName": "查看",
              "menuCode": "user-query",
              "__v": 0
            }
          ],
          "action": [
            {
              "parentId": [
                "600d4075e218daaf4ec77e52",
                "600d525e602f452aaeeffcd9"
              ],
              "updateTime": "2021-02-21T09:54:44.242Z",
              "createTime": "2021-02-20T06:46:50.711Z",
              "_id": "6030ca8f93f0e159c8390f0c",
              "menuType": "2",
              "menuState": "1",
              "menuName": "新增",
              "menuCode": "user-create",
              "__v": 0
            },
            {
              "parentId": [
                "600d4075e218daaf4ec77e52",
                "600d525e602f452aaeeffcd9"
              ],
              "updateTime": "2021-02-21T09:54:50.464Z",
              "createTime": "2021-02-21T08:50:47.217Z",
              "_id": "603226d9257d15a8c54cf9f8",
              "menuType": "2",
              "menuState": "1",
              "menuName": "批量删除",
              "menuCode": "user-delete",
              "__v": 0
            },
            {
              "parentId": [
                "600d4075e218daaf4ec77e52",
                "600d525e602f452aaeeffcd9"
              ],
              "updateTime": "2021-02-21T11:06:19.345Z",
              "createTime": "2021-02-21T11:06:19.345Z",
              "_id": "603253e0a821c6bb59084541",
              "menuType": "2",
              "menuState": "1",
              "menuName": "查看",
              "menuCode": "user-query",
              "__v": 0
            }
          ]
        },
        {
          "parentId": [
            "600d4075e218daaf4ec77e52"
          ],
          "updateTime": "2021-02-04T09:52:40.576Z",
          "createTime": "2021-02-04T09:52:40.576Z",
          "_id": "601bc4f8a794e23c2e42efa9",
          "menuType": "1",
          "menuState": "1",
          "menuName": "菜单管理",
          "path": "/system/menu",
          "component": "/system/menu",
          "__v": 0,
          "children": [
            {
              "parentId": [
                "600d4075e218daaf4ec77e52",
                "601bc4f8a794e23c2e42efa9"
              ],
              "updateTime": "2021-02-21T11:06:19.345Z",
              "createTime": "2021-02-21T11:06:19.345Z",
              "_id": "60325400a821c6bb59084543",
              "menuType": "2",
              "menuState": "1",
              "menuName": "查看",
              "menuCode": "menu-query",
              "__v": 0
            },
            {
              "parentId": [
                "600d4075e218daaf4ec77e52",
                "601bc4f8a794e23c2e42efa9"
              ],
              "updateTime": "2021-02-21T11:06:19.345Z",
              "createTime": "2021-02-21T11:06:19.345Z",
              "_id": "6032540fa821c6bb59084544",
              "menuType": "2",
              "menuState": "1",
              "menuName": "创建",
              "menuCode": "menu-create",
              "__v": 0
            }
          ],
          "action": [
            {
              "parentId": [
                "600d4075e218daaf4ec77e52",
                "601bc4f8a794e23c2e42efa9"
              ],
              "updateTime": "2021-02-21T11:06:19.345Z",
              "createTime": "2021-02-21T11:06:19.345Z",
              "_id": "60325400a821c6bb59084543",
              "menuType": "2",
              "menuState": "1",
              "menuName": "查看",
              "menuCode": "menu-query",
              "__v": 0
            },
            {
              "parentId": [
                "600d4075e218daaf4ec77e52",
                "601bc4f8a794e23c2e42efa9"
              ],
              "updateTime": "2021-02-21T11:06:19.345Z",
              "createTime": "2021-02-21T11:06:19.345Z",
              "_id": "6032540fa821c6bb59084544",
              "menuType": "2",
              "menuState": "1",
              "menuName": "创建",
              "menuCode": "menu-create",
              "__v": 0
            }
          ]
        },
        {
          "parentId": [
            "600d4075e218daaf4ec77e52"
          ],
          "updateTime": "2021-02-04T09:52:40.576Z",
          "createTime": "2021-02-04T09:52:40.576Z",
          "_id": "601ca9a8a794e23c2e42efab",
          "menuType": "1",
          "menuState": "1",
          "menuName": "角色管理",
          "path": "/system/role",
          "component": "/system/role",
          "__v": 0,
          "children": [
            {
              "parentId": [
                "600d4075e218daaf4ec77e52",
                "601ca9a8a794e23c2e42efab"
              ],
              "updateTime": "2021-02-21T12:38:19.650Z",
              "createTime": "2021-02-21T11:06:19.345Z",
              "_id": "60325425a821c6bb59084545",
              "menuType": "2",
              "menuState": "1",
              "menuName": "查看",
              "menuCode": "role-query",
              "__v": 0
            },
            {
              "parentId": [
                "600d4075e218daaf4ec77e52",
                "601ca9a8a794e23c2e42efab"
              ],
              "updateTime": "2021-02-21T11:06:19.345Z",
              "createTime": "2021-02-21T11:06:19.345Z",
              "_id": "60325461a821c6bb59084546",
              "menuType": "2",
              "menuState": "1",
              "menuName": "创建",
              "menuCode": "role-create",
              "__v": 0
            }
          ],
          "action": [
            {
              "parentId": [
                "600d4075e218daaf4ec77e52",
                "601ca9a8a794e23c2e42efab"
              ],
              "updateTime": "2021-02-21T12:38:19.650Z",
              "createTime": "2021-02-21T11:06:19.345Z",
              "_id": "60325425a821c6bb59084545",
              "menuType": "2",
              "menuState": "1",
              "menuName": "查看",
              "menuCode": "role-query",
              "__v": 0
            },
            {
              "parentId": [
                "600d4075e218daaf4ec77e52",
                "601ca9a8a794e23c2e42efab"
              ],
              "updateTime": "2021-02-21T11:06:19.345Z",
              "createTime": "2021-02-21T11:06:19.345Z",
              "_id": "60325461a821c6bb59084546",
              "menuType": "2",
              "menuState": "1",
              "menuName": "创建",
              "menuCode": "role-create",
              "__v": 0
            }
          ]
        },
        {
          "parentId": [
            "600d4075e218daaf4ec77e52"
          ],
          "updateTime": "2021-02-04T09:52:40.576Z",
          "createTime": "2021-02-04T09:52:40.576Z",
          "_id": "601cb172a794e23c2e42efac",
          "menuType": "1",
          "menuState": "1",
          "menuName": "部门管理",
          "path": "/system/dept",
          "component": "/system/dept",
          "__v": 0,
          "children": [
            {
              "parentId": [
                "600d4075e218daaf4ec77e52",
                "601cb172a794e23c2e42efac"
              ],
              "updateTime": "2021-02-21T11:06:19.345Z",
              "createTime": "2021-02-21T11:06:19.345Z",
              "_id": "60325470a821c6bb59084547",
              "menuType": "2",
              "menuState": "1",
              "menuName": "查看",
              "menuCode": "dept-query",
              "__v": 0
            },
            {
              "parentId": [
                "600d4075e218daaf4ec77e52",
                "601cb172a794e23c2e42efac"
              ],
              "updateTime": "2021-02-21T11:06:19.345Z",
              "createTime": "2021-02-21T11:06:19.345Z",
              "_id": "6032547da821c6bb59084548",
              "menuType": "2",
              "menuState": "1",
              "menuName": "创建",
              "menuCode": "dept-create",
              "__v": 0
            }
          ],
          "action": [
            {
              "parentId": [
                "600d4075e218daaf4ec77e52",
                "601cb172a794e23c2e42efac"
              ],
              "updateTime": "2021-02-21T11:06:19.345Z",
              "createTime": "2021-02-21T11:06:19.345Z",
              "_id": "60325470a821c6bb59084547",
              "menuType": "2",
              "menuState": "1",
              "menuName": "查看",
              "menuCode": "dept-query",
              "__v": 0
            },
            {
              "parentId": [
                "600d4075e218daaf4ec77e52",
                "601cb172a794e23c2e42efac"
              ],
              "updateTime": "2021-02-21T11:06:19.345Z",
              "createTime": "2021-02-21T11:06:19.345Z",
              "_id": "6032547da821c6bb59084548",
              "menuType": "2",
              "menuState": "1",
              "menuName": "创建",
              "menuCode": "dept-create",
              "__v": 0
            }
          ]
        }
      ]
    },
    {
      "parentId": [
        null
      ],
      "updateTime": "2021-02-18T01:42:15.243Z",
      "createTime": "2021-02-04T06:56:46.506Z",
      "_id": "601b9eb25929c81a1f988bb0",
      "menuType": "1",
      "menuState": "1",
      "menuName": "审批管理",
      "path": "/audit",
      "icon": "el-icon-s-promotion",
      "__v": 0,
      "children": [
        {
          "parentId": [
            "601b9eb25929c81a1f988bb0"
          ],
          "updateTime": "2021-02-19T14:50:00.555Z",
          "createTime": "2021-02-04T09:52:40.576Z",
          "_id": "601bc763a794e23c2e42efaa",
          "menuType": "1",
          "menuState": "1",
          "menuName": "休假申请",
          "path": "/audit/leave",
          "component": "/audit/leave",
          "__v": 0,
          "children": [
            {
              "parentId": [
                "601b9eb25929c81a1f988bb0",
                "601bc763a794e23c2e42efaa"
              ],
              "updateTime": "2021-02-21T11:06:19.345Z",
              "createTime": "2021-02-21T11:06:19.345Z",
              "_id": "603254a8a821c6bb59084549",
              "menuType": "2",
              "menuState": "1",
              "menuName": "查看",
              "menuCode": "leave-query",
              "__v": 0
            },
            {
              "parentId": [
                "601b9eb25929c81a1f988bb0",
                "601bc763a794e23c2e42efaa"
              ],
              "updateTime": "2021-02-21T11:06:19.345Z",
              "createTime": "2021-02-21T11:06:19.345Z",
              "_id": "603254baa821c6bb5908454a",
              "menuType": "2",
              "menuState": "1",
              "menuName": "申请休假",
              "menuCode": "leave-create",
              "__v": 0
            }
          ],
          "action": [
            {
              "parentId": [
                "601b9eb25929c81a1f988bb0",
                "601bc763a794e23c2e42efaa"
              ],
              "updateTime": "2021-02-21T11:06:19.345Z",
              "createTime": "2021-02-21T11:06:19.345Z",
              "_id": "603254a8a821c6bb59084549",
              "menuType": "2",
              "menuState": "1",
              "menuName": "查看",
              "menuCode": "leave-query",
              "__v": 0
            },
            {
              "parentId": [
                "601b9eb25929c81a1f988bb0",
                "601bc763a794e23c2e42efaa"
              ],
              "updateTime": "2021-02-21T11:06:19.345Z",
              "createTime": "2021-02-21T11:06:19.345Z",
              "_id": "603254baa821c6bb5908454a",
              "menuType": "2",
              "menuState": "1",
              "menuName": "申请休假",
              "menuCode": "leave-create",
              "__v": 0
            }
          ]
        },
        {
          "parentId": [
            "601b9eb25929c81a1f988bb0"
          ],
          "updateTime": "2021-02-19T14:53:04.590Z",
          "createTime": "2021-02-04T09:52:40.576Z",
          "_id": "602fd045bf465a015fef54dc",
          "menuType": "1",
          "menuState": "1",
          "menuName": "待我审批",
          "path": "/audit/approve",
          "component": "/audit/approve",
          "__v": 0,
          "children": [
            {
              "parentId": [
                "601b9eb25929c81a1f988bb0",
                "602fd045bf465a015fef54dc"
              ],
              "updateTime": "2021-02-21T11:06:19.345Z",
              "createTime": "2021-02-21T11:06:19.345Z",
              "_id": "60361f35a821c6bb5908454d",
              "menuType": "2",
              "menuState": "1",
              "menuName": "查看",
              "menuCode": "approve-query",
              "__v": 0
            }
          ],
          "action": [
            {
              "parentId": [
                "601b9eb25929c81a1f988bb0",
                "602fd045bf465a015fef54dc"
              ],
              "updateTime": "2021-02-21T11:06:19.345Z",
              "createTime": "2021-02-21T11:06:19.345Z",
              "_id": "60361f35a821c6bb5908454d",
              "menuType": "2",
              "menuState": "1",
              "menuName": "查看",
              "menuCode": "approve-query",
              "__v": 0
            }
          ]
        }
      ]
    }
  ],
  "msg": ""
}
```

fail

```
{
	code:30001,
	data:'',
	msg:'查询失败'
}
```

#### 菜单创建/编辑/删除

**POST  "/menu/operate"**

> request

```
{
  "_id",
  "action", // create: 创建 edit:编辑 delete:删除
  "menuType":1,//菜单类型 1:菜单 2:按钮
  "menuName":"系统管理",//菜单名称
  "menuCode":"",//菜单标识符，只有按钮类型才有，用于确定按钮权限
  "path":"/system",//菜单路由
  "icon":"el-icon-setting",//菜单图标
  "component":"",//组件地址
  "parentId":[null],//父菜单ID
}
```

> response

success

```json
{
  code:200,
  data:{},
  msg:'菜单创建/修改/删除成功'
}
```

fail

```
{
	code:30001,
	data:'',
	msg:'操作失败'
}
```

#### 部门列表

**GET  "/dept/list"**

> request

```
{
  deptName
}
```

> response

success

```json
{
  "code": 200,
  "data": [
    {
      "parentId": [
        null
      ],
      "updateTime": "2021-01-31T08:53:37.418Z",
      "createTime": "2021-01-31T08:53:37.418Z",
      "_id": "60167059c9027b7d2c520a61",
      "deptName": "橘子皮",
      "userId": "1000002",
      "userName": "admin",
      "userEmail": "admin@imooc.com",
      "__v": 0,
      "children": [
        {
          "parentId": [
            "60167059c9027b7d2c520a61"
          ],
          "updateTime": "2021-01-31T09:03:23.337Z",
          "createTime": "2021-01-31T09:03:23.337Z",
          "_id": "6016728fc6a4417f2d27506e",
          "deptName": "研发部门",
          "userId": "1000003",
          "userName": "jack",
          "userEmail": "jack@imooc.com",
          "__v": 0,
          "children": [
            {
              "parentId": [
                "60167059c9027b7d2c520a61",
                "6016728fc6a4417f2d27506e"
              ],
              "updateTime": "2021-02-01T13:05:06.188Z",
              "createTime": "2021-01-31T09:19:09.081Z",
              "_id": "60167621531124822b79e124",
              "deptName": "JAVA小组-1",
              "userId": "1000010",
              "userName": "Tim",
              "userEmail": "Tim@imooc.com",
              "__v": 0
            }
          ]
        },
        {
          "parentId": [
            "60167059c9027b7d2c520a61"
          ],
          "updateTime": "2021-02-21T12:44:16.249Z",
          "createTime": "2021-01-31T09:03:23.337Z",
          "_id": "60167345c6a4417f2d27506f",
          "deptName": "前端部门",
          "userId": "1000004",
          "userName": "tom",
          "userEmail": "tom@imooc.com",
          "__v": 0
        },
        {
          "parentId": [
            "60167059c9027b7d2c520a61"
          ],
          "updateTime": "2021-01-31T09:03:23.337Z",
          "createTime": "2021-01-31T09:03:23.337Z",
          "_id": "6016734ec6a4417f2d275070",
          "deptName": "测试部门",
          "userId": "1000005",
          "userName": "Lucy",
          "userEmail": "Lucy@imooc.com",
          "__v": 0
        },
        {
          "parentId": [
            "60167059c9027b7d2c520a61"
          ],
          "updateTime": "2021-01-31T09:03:23.337Z",
          "createTime": "2021-01-31T09:03:23.337Z",
          "_id": "6016735ac6a4417f2d275071",
          "deptName": "UED部门",
          "userId": "1000006",
          "userName": "Jim",
          "userEmail": "Jim@imooc.com",
          "__v": 0
        },
        {
          "parentId": [
            "60167059c9027b7d2c520a61"
          ],
          "updateTime": "2021-01-31T09:03:23.337Z",
          "createTime": "2021-01-31T09:03:23.337Z",
          "_id": "60167375c6a4417f2d275072",
          "deptName": "大数据部门",
          "userId": "1000007",
          "userName": "MaLi",
          "userEmail": "MaLi@imooc.com",
          "__v": 0
        },
        {
          "parentId": [
            "60167059c9027b7d2c520a61"
          ],
          "updateTime": "2021-02-01T14:06:49.922Z",
          "createTime": "2021-02-01T14:06:49.922Z",
          "_id": "60180ce5b1eaed6c45fbebe5",
          "deptName": "市场部门",
          "userId": "1000011",
          "userName": "Baidu",
          "userEmail": "Baidu@imooc.com",
          "__v": 0
        },
        {
          "parentId": [
            "60167059c9027b7d2c520a61"
          ],
          "updateTime": "2021-02-01T14:06:49.922Z",
          "createTime": "2021-02-01T14:06:49.922Z",
          "_id": "6018119bb1eaed6c45fbebe6",
          "deptName": "运营部门",
          "userId": "1000012",
          "userName": "TengXun",
          "userEmail": "TengXun@imooc.com",
          "__v": 0
        },
        {
          "parentId": [
            "60167059c9027b7d2c520a61"
          ],
          "updateTime": "2021-02-01T14:06:49.922Z",
          "createTime": "2021-02-01T14:06:49.922Z",
          "_id": "601811dfb1eaed6c45fbebe7",
          "deptName": "运维部门",
          "userId": "1000014",
          "userName": "Apple",
          "userEmail": "Apple@imooc.com",
          "__v": 0
        },
        {
          "parentId": [
            "60167059c9027b7d2c520a61"
          ],
          "updateTime": "2021-02-18T16:29:35.671Z",
          "createTime": "2021-02-18T16:29:35.671Z",
          "_id": "602f0e679aac702f1dc8b0f3",
          "deptName": "人事部",
          "userId": "1000011",
          "userName": "Baidu",
          "userEmail": "Baidu@imooc.com",
          "__v": 0
        },
        {
          "parentId": [
            "60167059c9027b7d2c520a61"
          ],
          "updateTime": "2021-02-18T16:29:35.671Z",
          "createTime": "2021-02-18T16:29:35.671Z",
          "_id": "602f0e779aac702f1dc8b0f4",
          "deptName": "财务部",
          "userId": "1000013",
          "userName": "Ali",
          "userEmail": "Ali@imooc.com",
          "__v": 0
        }
      ]
    }
  ],
  "msg": ""
}
```

fail

```
{
	code:30001,
	data:'',
	msg:'操作失败'
}
```

#### 部门创建/编辑/删除

**POST  "/dept/operate"**

> request

```
{
  "parentId":[null],//父对象Id，一级部门默认为null
  "deptName":"前端开发部",
  "userId":1000001,//负责人，用户ID
  "userName":"Jack",//部门负责人
  "userEmail":"jack@163.com",//同上
  "updateTime":ISODate("2021-01-17T13:32:06.381Z"),//更新时间
}
```

> response

success

```json
{
  code:200,
  data:{},
  msg:'部门创建/修改/删除成功'
}
```

fail

```
{
	code:30001,
	data:'',
	msg:'操作失败'
}
```

#### 角色列表

**GET  "/roles/list"**

> request

```
{
  "roleName":"",//角色名称
}
```

> response

success

```json
{
  "code": 200,
  "data": {
    "page": {
      "pageNum": 1,
      "pageSize": 10,
      "total": 8
    },
    "list": [
      {
        "permissionList": {
          "checkedKeys": [
            "6030ca8f93f0e159c8390f0c",
            "603226d9257d15a8c54cf9f8",
            "603253e0a821c6bb59084541",
            "6032572ba821c6bb5908454b"
          ],
          "halfCheckedKeys": [
            "600d525e602f452aaeeffcd9",
            "600d4075e218daaf4ec77e52"
          ]
        },
        "_id": "60150cb764de99631b2c3cd3",
        "roleName": "产品经理",
        "remark": "产品人员使用",
        "createTime": "2021-01-30T07:37:27.793Z",
        "__v": 0
      },
      {
        "permissionList": {
          "checkedKeys": [
            "6030ca8f93f0e159c8390f0c",
            "603226d9257d15a8c54cf9f8",
            "603253e0a821c6bb59084541",
            "6032572ba821c6bb5908454b",
            "60325b51a821c6bb5908454c",
            "60325400a821c6bb59084543",
            "6032540fa821c6bb59084544",
            "603254a8a821c6bb59084549",
            "603254baa821c6bb5908454a"
          ],
          "halfCheckedKeys": [
            "600d525e602f452aaeeffcd9",
            "601bc4f8a794e23c2e42efa9",
            "601bc763a794e23c2e42efaa",
            "600d4075e218daaf4ec77e52",
            "601b9eb25929c81a1f988bb0"
          ]
        },
        "_id": "60180b07b1eaed6c45fbebdb",
        "roleName": "研发",
        "remark": "Javascript",
        "createTime": "2021-02-01T14:07:03.592Z",
        "__v": 0
      },
      {
        "permissionList": {
          "checkedKeys": [
            "603253e0a821c6bb59084541",
            "60325400a821c6bb59084543",
            "60325425a821c6bb59084545",
            "60325470a821c6bb59084547",
            "603254a8a821c6bb59084549"
          ],
          "halfCheckedKeys": [
            "600d4075e218daaf4ec77e52",
            "600d525e602f452aaeeffcd9",
            "601bc4f8a794e23c2e42efa9",
            "601ca9a8a794e23c2e42efab",
            "601cb172a794e23c2e42efac",
            "601b9eb25929c81a1f988bb0",
            "601bc763a794e23c2e42efaa"
          ]
        },
        "_id": "60180b59b1eaed6c45fbebdc",
        "roleName": "测试",
        "createTime": "2021-02-01T14:08:25.722Z",
        "__v": 0
      },
      {
        "permissionList": {
          "checkedKeys": [
            "60325470a821c6bb59084547",
            "6032547da821c6bb59084548",
            "603254a8a821c6bb59084549",
            "603254baa821c6bb5908454a"
          ],
          "halfCheckedKeys": [
            "601cb172a794e23c2e42efac",
            "601bc763a794e23c2e42efaa",
            "600d4075e218daaf4ec77e52",
            "601b9eb25929c81a1f988bb0"
          ]
        },
        "_id": "60180b5eb1eaed6c45fbebdd",
        "roleName": "JAVA",
        "createTime": "2021-02-01T14:08:30.757Z",
        "__v": 0
      },
      {
        "permissionList": {
          "checkedKeys": [
            "60325425a821c6bb59084545",
            "60325461a821c6bb59084546",
            "60325470a821c6bb59084547",
            "6032547da821c6bb59084548",
            "603254a8a821c6bb59084549",
            "603254baa821c6bb5908454a"
          ],
          "halfCheckedKeys": [
            "601ca9a8a794e23c2e42efab",
            "601cb172a794e23c2e42efac",
            "601bc763a794e23c2e42efaa",
            "600d4075e218daaf4ec77e52",
            "601b9eb25929c81a1f988bb0"
          ]
        },
        "_id": "60180b64b1eaed6c45fbebde",
        "roleName": "运维",
        "createTime": "2021-02-01T14:08:36.100Z",
        "__v": 0
      },
      {
        "permissionList": {
          "checkedKeys": [
            "6030ca8f93f0e159c8390f0c",
            "603226d9257d15a8c54cf9f8",
            "603253e0a821c6bb59084541",
            "6032572ba821c6bb5908454b",
            "60325b51a821c6bb5908454c"
          ],
          "halfCheckedKeys": [
            "600d525e602f452aaeeffcd9",
            "600d4075e218daaf4ec77e52"
          ]
        },
        "_id": "60180b69b1eaed6c45fbebdf",
        "roleName": "运营",
        "createTime": "2021-02-01T14:08:41.342Z",
        "__v": 0
      },
      {
        "permissionList": {
          "checkedKeys": [
            "60325400a821c6bb59084543",
            "6032540fa821c6bb59084544",
            "60325425a821c6bb59084545",
            "60325461a821c6bb59084546"
          ],
          "halfCheckedKeys": [
            "601bc4f8a794e23c2e42efa9",
            "601ca9a8a794e23c2e42efab",
            "600d4075e218daaf4ec77e52"
          ]
        },
        "_id": "60180b76b1eaed6c45fbebe0",
        "roleName": "市场",
        "createTime": "2021-02-01T14:08:54.316Z",
        "__v": 0
      },
      {
        "permissionList": {
          "checkedKeys": [
            "6030ca8f93f0e159c8390f0c",
            "603226d9257d15a8c54cf9f8",
            "603253e0a821c6bb59084541",
            "6032572ba821c6bb5908454b",
            "60325b51a821c6bb5908454c",
            "60325400a821c6bb59084543",
            "6032540fa821c6bb59084544",
            "60325425a821c6bb59084545",
            "60325461a821c6bb59084546",
            "60325470a821c6bb59084547",
            "6032547da821c6bb59084548",
            "603254a8a821c6bb59084549",
            "603254baa821c6bb5908454a",
            "602fd045bf465a015fef54dc"
          ],
          "halfCheckedKeys": [
            "600d4075e218daaf4ec77e52",
            "600d525e602f452aaeeffcd9",
            "601bc4f8a794e23c2e42efa9",
            "601ca9a8a794e23c2e42efab",
            "601cb172a794e23c2e42efac",
            "601b9eb25929c81a1f988bb0",
            "601bc763a794e23c2e42efaa"
          ]
        },
        "_id": "60180b80b1eaed6c45fbebe1",
        "roleName": "管理层",
        "createTime": "2021-02-01T14:09:04.759Z",
        "__v": 0
      }
    ]
  },
  "msg": ""
}
```

fail

```
{
	code:30001,
	data:'',
	msg:'操作失败'
}
```

#### 角色名称列表

> (创建用户时，需要设置对应角色)

**GET  "/roles/allList"**

> request

```
{}
```

> response

success

```json
{
  "code": 200,
  "data": [
    {
      "_id": "60150cb764de99631b2c3cd3",
      "roleName": "产品经理"
    },
    {
      "_id": "60180b07b1eaed6c45fbebdb",
      "roleName": "研发"
    },
    {
      "_id": "60180b59b1eaed6c45fbebdc",
      "roleName": "测试"
    },
    {
      "_id": "60180b5eb1eaed6c45fbebdd",
      "roleName": "JAVA"
    },
    {
      "_id": "60180b64b1eaed6c45fbebde",
      "roleName": "运维"
    },
    {
      "_id": "60180b69b1eaed6c45fbebdf",
      "roleName": "运营"
    },
    {
      "_id": "60180b76b1eaed6c45fbebe0",
      "roleName": "市场"
    },
    {
      "_id": "60180b80b1eaed6c45fbebe1",
      "roleName": "管理层"
    }
  ],
  "msg": ""
}
```

fail

```
{
	code:30001,
	data:'',
	msg:'操作失败'
}
```

#### 角色创建/编辑/删除

**POST  "/roles/operate"**

> request

```
{
	"_id":"",
	"action":"", // create:创建 edit:编辑 delete:删除
  "roleName":"产品经理",//角色名称
  "remark":"产品专用",//备注信息
}
```

> response

success

```json
{
  code:200,
  data:{},
  msg:'角色创建/修改/删除成功'
}
```

fail

```
{
	code:30001,
	data:'',
	msg:'操作失败'
}
```

#### 角色设置权限

**POST  "/roles/update/permission"**

> request

```
{
	"_id":"",
  "permissionList":{
    "checkedKeys":[ObjectId("")],//选中的子菜单
    "halfCheckedKeys":[ObjectId("")],//半选中的父菜单
  },//权限列表
}
```

> response

success

```json
{
  code:200,
  data:{},
  msg:'角色权限更新成功'
}
```

fail

```
{
	code:30001,
	data:'',
	msg:'操作失败'
}
```

#### 审批列表

> 申请列表和审核列表接口公用，通过type区分

**GET  "/leave/list"**

> request

```
{
	"type":"",// approve:审核  默认用户审批列表
  "applyState":"",
  "pageNum":"",
  "pageSize":"",
}
```

> response

success

```json
{
  "code": 200,
  "data": {
    "page": {
      "pageNum": 1,
      "pageSize": 10,
      "total": 4
    },
    "list": [
      {
        "applyUser": {
          "userId": "1000002",
          "userName": "admin"
        },
        "applyState": 4,
        "_id": "603081dd525ae1359dd7e2fb",
        "applyType": 1,
        "startTime": "2021-02-17T16:00:00.000Z",
        "endTime": "2021-02-18T16:00:00.000Z",
        "leaveTime": "2天",
        "reasons": "测试",
        "orderNo": "XJ202102200",
        "auditUsers": "tom,Baidu,Ali",
        "curAuditUserName": "Ali",
        "auditFlows": [
          {
            "_id": "603081dd525ae1359dd7e2fc",
            "userId": "1000004",
            "userName": "tom",
            "userEmail": "tom@imooc.com"
          },
          {
            "_id": "603081dd525ae1359dd7e2fd",
            "userId": "1000011",
            "userName": "Baidu",
            "userEmail": "Baidu@imooc.com"
          },
          {
            "_id": "603081dd525ae1359dd7e2fe",
            "userId": "1000013",
            "userName": "Ali",
            "userEmail": "Ali@imooc.com"
          }
        ],
        "auditLogs": [
          {
            "_id": "603082f316663b36f713b16b",
            "userId": "1000004",
            "userName": "tom",
            "createTime": "2021-02-20T03:33:07.175Z",
            "remark": "tongyi",
            "action": "审核通过"
          },
          {
            "_id": "6030b1df93f0e159c8390f01",
            "userId": "1000011",
            "userName": "Baidu",
            "createTime": "2021-02-20T06:53:19.493Z",
            "remark": "同意",
            "action": "审核通过"
          },
          {
            "_id": "6030b1fb93f0e159c8390f04",
            "userId": "1000013",
            "userName": "Ali",
            "createTime": "2021-02-20T06:53:47.955Z",
            "remark": "OK",
            "action": "审核通过"
          }
        ],
        "createTime": "2021-02-20T03:28:29.850Z",
        "__v": 0
      }
    ]
  },
  "msg": ""
}
```

fail

```
{
	code:30001,
	data:'',
	msg:'操作失败'
}
```

#### 待审批通知数量

**GET  "/leave/count"**

> request

```
{}
```

> response

success

```json
{
  "code": 200,
  "data": 3, // 通知数量
  "msg": ""
}
```

fail

```
{
	code:30001,
	data:'',
	msg:'操作失败'
}
```

#### 创建申请单

**POST  "/leave/operate"**

> request

```
{
	// 参照审批流 申请  数据结构
	action: "" //create:创建 edit:编辑 delete:删除
}
```

> response

success

```json
{
  code:200,
  data:{},
  msg:'创建/修改/删除成功'
}
```

fail

```
{
	code:30001,
	data:'',
	msg:'操作失败'
}
```

#### 审核

**POST  "/leave/approve"**

> request

```
{
	_id,
	remark,
	action: "" //create:创建 edit:编辑 delete:删除
}
```

> response

success

```json
{
  code:200,
  data:{},
  msg:'审核通过/审核拒绝'
}
```

fail

```
{
	code:30001,
	data:'',
	msg:'操作失败'
}
```

#### 