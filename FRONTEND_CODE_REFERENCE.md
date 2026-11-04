# 前端代码参考文档（vue-desai）

> 车机测试平台前端。Vue 3 + Vite 单页应用，主视图 `Test.vue`（8023 行，占代码量 94%）承载全部功能。
> 文档基于代码静态分析生成（2026-09-16）。

---

## 一、技术栈

| 项 | 选型 |
|----|------|
| 框架 | Vue 3.3（`<script setup>` 组合式 API 为主，Test.vue 用 `setup()`）|
| 构建 | Vite 5（`@vitejs/plugin-vue` + `plugin-vue-jsx`）|
| UI | **Vuetify 3**（mdi 图标）+ **Element Plus**（双 UI 库混用）|
| 语言 | JavaScript（无 TS，`vue-tsc` 仅做 type-check）|
| 路由 | vue-router 4（`createWebHistory`，全局守卫做认证）|
| 投屏 | web-scrcpy 思路：WebUSB ADB（`@yume-chan/adb-credential-web`/`adb-daemon-webusb`）+ `<video>` + `webm-muxer` |
| 终端 | xterm + xterm-addon-fit |
| 表格 | exceljs + xlsx + file-saver（.xlsm 导入/报告导出）|
| 本地存储 | idb-keyval（IndexedDB）+ localStorage |
| Markdown | markdown-it（渲染 LLM 回复）|

**package.json name**：`web-scrcpy`（沿用投屏项目名）
**scripts**：`dev`(vite) / `build`(vite build) / `preview` / `type-check`(vue-tsc --noEmit) / `lint`(eslint)

---

## 二、文件结构

```
vue-desai/
├── index.html                  # Vite 入口
├── vite.config.js              # 开发 proxy：/dev-api → 127.0.0.1:8004
├── nginx/
│   └── prod-frontend.conf      # 生产 nginx（已纳入 git，commit 53d2fd5）
└── src/
    ├── main.js                 # 应用入口（28 行）
    ├── App.vue                 # 根组件（16 行，纯 <router-view>）
    ├── router/index.js         # 路由 + 认证守卫（41 行）
    ├── utils/db.js             # IndexedDB 用例存储（85 行）
    ├── assets/                 # svg/logo 图标
    └── views/
        ├── Login.vue           # 登录页（311 行）
        ├── Test.vue            # ★ 主视图（8023 行，全部功能）
        ├── report-template.html# 测试报告 HTML 模板
        └── langOptions.json    # 语言选项
```

---

## 三、入口与路由

### `main.js`
```
createApp(App)
  .use(vuetify)        // Vuetify 3（mdi 图标集）
  .use(ElementPlus)    // Element Plus
  .use(router)
  .mount('#app')
```

### `router/index.js`
两条路由：
| 路径 | 组件 | 说明 |
|------|------|------|
| `/` | `Login.vue` | 登录页 |
| `/test` | `Test.vue` | 主视图，`meta.requiresAuth=true` |

**全局守卫** `router.beforeEach`：`requiresAuth` 路由检查 `localStorage.getItem('isAuthenticated')==='true'`，未登录跳 `/`。

### `App.vue`
纯 `<router-view></router-view>`，无逻辑。

---

## 四、前端 → 后端链路（nginx 代理）

### 生产（`nginx/prod-frontend.conf`，容器 `vue-desai-frontend`）
```
浏览器
  /dev-api/v1/chat/completions  → sseclient_backend (8004)   [LLM 流式]
  /dev-api/(result|mobile-agent|test_list|mobile)/ → 127.0.0.1:8005  [轮询走护城河]
  /dev-api/                     → sseclient_backend (8004)   [其余]
  /record-api/                  → sseclient_backend (8004)   [录制]
  /                             → 前端静态
```

### 开发（`vite.config.js` proxy）
```
/dev-api → http://127.0.0.1:8004 （rewrite 去掉 /dev-api 前缀）
```

> **关键点**：轮询路径（`/result/*`、`/mobile-agent/*`、`/test_list*`、`/mobile/*`）走 **8005 护城河**，其余 `/dev-api` 直连 8004。这是 2026-09-14 修 502 时的设计（轮询高频率、需保护 8004）。

---

## 五、登录流程（Login.vue）

1. `fetch('/dev-api/icdqm/users', POST)` —— 验证用户名密码
2. 成功后 `fetch('/dev-api/icdqm/projects', POST)` —— 拉项目列表（下拉选择）
3. `handleLogin()`：写 localStorage：
   - `isAuthenticated = 'true'`
   - `currentUser` / `currentUserInfo`
   - `currentProjectId` / `currentProjectName` / `currentProject`
4. `router.push('/test')`

**登出**（Test.vue `handleLogout` L3125）：清掉上述所有 localStorage key，跳回 `/`。

---

## 六、Test.vue —— 主视图详解（8023 行）

**结构**：
- `<template>` L1-2301（2300 行 UI）
- `<script>` L2303-7458（5155 行，`setup()` 组合式 API，187 个函数）
- `<style scoped>` L7460+

**template 布局**：`.header`（顶部工具栏 L4）→ `.content-layout`（L209）→ `.main-content`（L210）+ 侧栏。内含用例表格、执行日志表、ADB 投屏 canvas、Mobile-Agent 审批面板、录制向导、用例转换窗等。

### 6.1 功能模块与关键函数

#### A. Mobile-Agent 审批 / 事件（L2369-2677）
安卓操作需要人工审批时，前端轮询后端并展示确认 UI。
| 函数 | 行 | 功能 |
|------|----|------|
| `activeMobileAgentTestIds` | 2369 | 活动中的 MA test_id 集合 |
| `cleanupMobileAgentSession` | 2378 | 清理 MA 会话（定时器/状态）|
| `appendMobileAgentExecutionLog` | 2386 | 追加 MA 执行日志 |
| `fetchMobileAgentConfirmations` | 2436 | 轮询 `/dev-api/mobile-agent/*` 取待审批项 |
| `fetchMobileAgentEvents` | 2522 | 轮询 MA 事件流 |
| `selectMobileAgentCoordinate` | 2574 | 用户在投屏上选坐标（审批辅助）|
| `submitMobileAgentConfirmation` | 2595 | 提交审批结果（通过/拒绝）|
| `closeMobileAgentConfirmation` | 2677 | 关闭审批弹窗 |
| `handleStepScreenshotExpand` | 2412 | 展开步骤截图 |

#### B. 任务轮询 / 结果上报（L2737-2925）
| 函数 | 行 | 功能 |
|------|----|------|
| `pollLoop` | 2737 | 轮询主循环（`MOBILE_AGENT_POLL_BASE_MS=3000` 起步，退避）|
| `stopPolling` | 2764 | 停轮询 |
| `fetchTasks` | 2772 | `fetch(${taskBaseUrl}/task-stream/tasks)` 拉任务 |
| `handleNewTask` | 2792 | 处理新任务（触发执行）|
| `parseRow` | 2809 | 解析任务行 |
| `reportCaseResult` | 2893 | POST `/task-stream/tasks/case-result` 上报用例结果 |
| `reportTaskComplete` | 2925 | POST `/task-stream/tasks/complete` 上报任务完成 |

> `taskBaseUrl = "http://127.0.0.1:8000"`（L2762，直连，非 /dev-api）——任务流走独立端口。

#### C. 上传 / 记录（L3008-3065）
| 函数 | 行 | 功能 |
|------|----|------|
| `openUploadRecordDialog` | 3008 | 打开上传弹窗 |
| `submitUpload` | 3065 | POST `/dev-api/icdqm/test_record` 提交测试记录 |
| `formatTime` / `pad` | 3038/3041 | 时间格式化 |

#### D. 认证 / 项目上下文（L3100-3170）
| 函数 | 行 | 功能 |
|------|----|------|
| `getProjectLocalStorageKey` | 3100 | 项目级存储 key |
| `loadAuthContext` | 3105 | 读 localStorage 恢复用户/项目上下文 |
| `handleLogout` | 3125 | 登出（清 localStorage）|

#### E. DBC / 用例表格（L3171-3395）
| 函数 | 行 | 功能 |
|------|----|------|
| `handleInfoTypeChange` | 3171 | 信息类型切换 |
| `dbcDisplayName` | 3180 | DBC 信号显示名 |
| `onRowRightClick` | 3210 | 行右键菜单 |
| `runSingleRow` | 3218 | 运行单行用例 |
| `scheduleCasesSave` / `scheduleCasesTableSave` | 3242/3254 | 防抖保存用例（→ IndexedDB）|
| `flushAutoSave` | 3266 | 立即落盘 |

watch：`cases`/`casesTable` 深度变化 → 自动保存；`currentLang`/`url` 变化联动。

#### F. 图标点位标注（L3444-3911）
canvas 上标注 icon 点位（用于视觉定位/投屏点击）。
| 函数 | 行 | 功能 |
|------|----|------|
| `iconConfig` | 3444 | icon 配置响应式 |
| `loadIconConfigShot` | 3456 | 加载 icon 配置截图 |
| `_getImgVisibleRect` | 3497 | 计算图片可见矩形 |
| `getScreenAndCoords` | 3528 | 屏幕尺寸 + 坐标映射 |
| `_drawGestureLine` | 3559 | 画手势线 |
| `submitIconDots` | 3875 | 提交 icon 点位 |
| `delDot` | 3911 | 删点位 |

#### G. ADB 投屏 / 手势（L3587-4105）
web-scrcpy 投屏 + 鼠标手势 → ADB 命令。
| 函数 | 行 | 功能 |
|------|----|------|
| `addAdbLog` / `buildAdbLogMsg` / `clearAdbLogs` / `deleteAdbLogAt` | 3587-3651 | ADB 日志管理 |
| `exportSelectedAdbSequence` | 3665 | 导出选中 ADB 序列 |
| `sendAdbTap` / `sendAdbSwipe` / `sendAdbKey` | 3727/3747/3766 | 发 ADB 点击/滑动/按键 |
| `keyCodeName` | 3784 | 按键码名 |
| `onScreenMouseDown/Move/Up` | 3790-3815 | 投屏 canvas 鼠标手势 → 轨迹点 |
| `redrawDots` | 3849 | 重绘轨迹点 |
| `getDeviceSize` | 4031 | `fetch(url + "/adb/runCmd?cmd=shell wm size")` 取设备分辨率 |
| `resizeCanvas` | 4039 | canvas 自适应 |
| `onVideoClick` | 4067 | 视频点击 |
| `connectInstrumentStream` / `connectMobileStream` | 4094/4098 | 连接投屏流（仪表/手机）|

#### H. 用例管理（L4105-4448）
| 函数 | 行 | 功能 |
|------|----|------|
| `addTestCase` / `confirmAddTestCase` / `deleteTestCase` | 4124-4156 | 增删用例 |
| `clearTestCase` / `clearTestResults` / `clearLogs` | 4200-4291 | 清空 |
| `syncSelectedRowsAll` / `selectRows` / `handleSelectionChange` | 4300-4387 | 行选择 |
| `handlePageChange*` | 4406-4418 | 分页 |
| `importXlsmFile` | 4418 | 导入 .xlsm（exceljs）|
| `fetchActualResultForExcel` | 4422 | 取实际结果填表 |
| `exportTestReport` | 4438 | 导出测试报告（report-template.html）|

#### I. 知识图谱 / 语义裁剪（L4526-4535）
| 函数 | 行 | 功能 |
|------|----|------|
| `generateKnowledgeGraph` | 4526 | 触发知识图谱生成（`/dev-api/adb/autotest`）|
| `fetchActualResult` / `crop_by_semantics` | 4424/6006 | 语义裁剪（`/dev-api/api/crop_by_semantics`）|

#### J. DBC 文件上传（L4665-4670）
`selectDbcFile` / `handleFileUpload` / `handleDbcFileUpload`（L6033）/ `removeDbcFile`（L6090）

#### K. 测试执行核心（L4942-5315）★
| 函数 | 行 | 功能 |
|------|----|------|
| `runMockTestCase` | 4942 | mock 运行 |
| `startDebugging` | 5005 | **启动测试**（发起 `/dev-api/chat` SSE，流式输出测试步骤执行过程）|
| `runTestCase` | 5077 | 运行单个用例 |
| `promptCaseConversion` | 5090 | 提示用例转换 |
| `stopDebugging` | 5110 | 停止 |
| `abortCurrentTest` | 5148 | 中止当前测试（`/dev-api/cancelsession`）|
| `startPollingForDebugResults` | 5248 | 轮询调试结果 |
| `pollForResult` | 5437 | `fetch(/dev-api/result/${test_id})` 取结果 |

#### L. 用例转换（自然语言→序列化测试序列）（L5570-5828）
| 函数 | 行 | 功能 |
|------|----|------|
| `toggleConversionPause` / `cancelConversion` | 5570/5580 | 暂停/取消转换 |
| `waitIfConversionPaused` | 5612 | 转换暂停等待 |
| `caseConversion` | 5633 | 转换主逻辑 |
| `convertRow` / `runCaseConversion` / `startCaseConversion` | 5730-5793 | 逐行/批量转换 |

#### M. 用例转换 API 调用（`callApi`）（L5855-5953）
`callApi(id, input, task, stream, step, predict)`：
- `xhr.open("POST", "/dev-api/v1/chat/completions")`
- body：`{input, task, stream, dbc, prompt, predict}`
- 返回 `choices[0].message.content`，按 `step` 写入用例字段：
  - `step='A'` → `InitTestSequences`（初始条件序列）
  - `step='B'` → `ActionTestSequences`（操作序列）
  - `step='E'` → `ExpectedTestSequences`（预期序列）
- **作用**：把自然语言用例转成序列化测试步骤（A 初始条件 / B 操作 / E 预期），供后续 `runTestCase` 执行。
- `conversionActiveXhr` 跟踪进行中的转换请求，取消时抛 `CONVERSION_CANCELED`。

#### N. 测试列表 / 日志（L5955-5980）
`fetchTestList`（`/dev-api/test_list?page=&page_size=10`）/ `fetchTestLogs`（`/dev-api/test_logs/${test_id}`）

#### O. 录制向导（L6116-6909）★ 大块
`rec*` 前缀函数（50+ 个）——轨迹录制：在投屏上点选初始条件/操作步骤，逐帧标注截图+ADB 命令，保存到后端。
| 函数 | 行 | 功能 |
|------|----|------|
| `getRecordApiBase` | 6121 | 录制 API base（`/record-api` 或 `/api/record`）|
| `fetchAdbDeviceList` | 6123 | `fetch(base + "/adb/runCmd?cmd=devices")` |
| `buildCaseContent` | 6155 | 构建用例内容 |
| `recordSaveStep` / `recordComplete` | 6166/6184 | 保存步骤/完成录制 |
| `openRecordWizard` | 6365 | 打开录制向导 |
| `recLoadShot` / `recResizeWrap` / `recOnImgLoaded` | 6391-6440 | 加载截图/缩放 |
| `recGetVisRect` / `recGetCoords` | 6447/6461 | 可见矩形/坐标 |
| `recDrawDot` / `recDrawSwipe` / `recClearCanvas` | 6473-6488 | 画点/画滑动/清画布 |
| `recAdb` / `recSendTap` / `recSendSwipe` / `recSendKey` | 6499-6531 | 发 ADB |
| `recOnMouseDown/Move/Up` | 6542-6560 | 手势 |
| `recBuildSeqPayload` | 6604 | 构建序列 payload |
| `recJumpInitialStep` / `recPrevInitialStep` / `recJumpActionStep` / `recPrevActionStep` | 6624-6680 | 步骤跳转 |
| `recMergeSubsteps` / `recBackTo` / `recSkipInitial` / `recSkipAction` | 6683-6726 | 子步合并/回退/跳过 |
| `recSaveInitial` / `recSaveAction` | 6770/6863 | 保存初始条件/操作步骤 |
| `recExpectedWrong` / `recExpectedCorrect` | 6909/7037 | 标注预期结果 |
| `recResetAll` / `doPing` | 7019/6955 | 重置/心跳 |
| computed：`initFinished`/`actFinished`/`initDone`/`actDone`/`initTotal`/`initOk`/`initSkip`/`actTotal`/`actOk`/`actSkip`（L7040-7117）|  | 录制进度统计 |

---

## 七、前端 ↔ 后端 API 对照表

| 前端调用 | 方法 | nginx 路由 | 后端 | 用途 |
|----------|------|-----------|------|------|
| `/dev-api/chat` | POST (SSE) | → 8004 | sseclient | **测试步骤流式执行**（startDebugging 发起，流式输出步骤/执行成功/失败）|
| `/dev-api/v1/chat/completions` | POST | → 8004 | sseclient | **用例转换**（callApi，自然语言→A初始条件/B操作/E预期序列）|
| `/dev-api/result/{test_id}` | GET | → **8005** | sseclient | 轮询结果 |
| `/dev-api/mobile-agent/*` | GET/POST | → **8005** | sseclient | MA 审批/事件 |
| `/dev-api/test_list` | GET | → **8005** | sseclient | 测试列表 |
| `/dev-api/test_logs/{test_id}` | GET | → 8004 | sseclient | 测试日志 |
| `/dev-api/cancelsession` | POST | → 8004 | sseclient | 取消会话 |
| `/dev-api/icdqm/users` | POST | → 8004 | sseclient | 登录验证 |
| `/dev-api/icdqm/projects` | POST | → 8004 | sseclient | 项目列表 |
| `/dev-api/icdqm/test_record` | POST | → 8004 | sseclient | 提交测试记录 |
| `/dev-api/addicons` | POST | → 8004 | sseclient | 添加 icon |
| `/dev-api/api/crop_by_semantics` | POST | → 8004 | sseclient | 语义裁剪 |
| `/dev-api/api/getcurrenticon` / `setcurrenticon` | GET/POST | → 8004 | sseclient | icon 当前值 |
| `/dev-api/adb/autotest` | POST | → 8004 | sseclient | 自动测试/知识图谱 |
| `/dev-api/upload/batch` | POST | → 8004 | sseclient | 批量上传 |
| `{url}/adb/runCmd?cmd=...` | GET | 直连车机 ADB 代理 | 8081/ADB | ADB 命令（devices/wm size/点击）|
| `/record-api/*` 或 `/api/record` | POST | → 8004 | sseclient | 轨迹录制保存 |
| `taskBaseUrl=/127.0.0.1:8000` 的 `/task-stream/*` | GET/POST | 直连 | 任务服务 | 任务流/结果上报 |

---

## 八、本地存储

| 位置 | key | 用途 |
|------|-----|------|
| localStorage | `isAuthenticated` | 登录态（路由守卫）|
| localStorage | `currentUser`/`currentUserInfo` | 当前用户 |
| localStorage | `currentProjectId`/`currentProjectName`/`currentProject` | 当前项目 |
| IndexedDB（idb-keyval）| `cases` / `casesTable`（+ `__proj__{projectKey}` 作用域）| 用例/用例表（按项目隔离）|
| IndexedDB 迁移 | `migrated_from_ls` | 一次性从 localStorage 迁到 IndexedDB 的标记 |

`utils/db.js`：`saveCases`/`loadCases`/`saveCasesTable`/`loadCasesTable`（`toRaw`+`cloneDeep` 去响应式后存；`scopedKey` 按项目隔离；`migrateOnce` 兼容旧 localStorage 数据）。

---

## 九、与后端的对应关系

前端 `Test.vue` 各模块 ↔ 后端 `adb_server_copy.py` 工具：
| 前端 | 触发后端工具 |
|------|-------------|
| `startDebugging`（`/dev-api/chat`）| sseclient LLM 编排 → `process_serial_codes` / `detect_dashboard` / `replay_recorded_case` 等 |
| MA 审批面板 | `replay_recorded_case` 的 mobile-agent 审批（`mobile_agent_confirmation`）|
| ADB 投屏 + 手势 | 8081 ADB 代理（`/adb/runCmd`）+ `mobilerun_remote` |
| 录制向导 | `mobile_trajectory`（`finalize_trajectory` 提交轨迹）|
| `pollForResult` | `insert_result`（结果入库）后前端轮询 |
| 用例转换（`callApi` → `/dev-api/v1/chat/completions`）| sseclient 用例转换（自然语言→A/B/E 序列化测试序列）|

---

## 十、部署

- **开发**：`npm run dev`（Vite 5173/3000，proxy `/dev-api` → 8004）
- **构建**：`npm run build` → dist/
- **生产**：Docker 容器 `vue-desai-frontend`（端口 3000），nginx 用仓库内 `nginx/prod-frontend.conf`（已 git 化），静态文件 + 反向代理

> 前端代码在 `/data/model/vue-desai`（独立 git 仓库，gitee `li-jiti/vue-desai`），与后端 `mcp-desai` 分开管理。
