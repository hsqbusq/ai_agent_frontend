<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="header-left">
        <div class="nav-buttons">
          <div class="nav-left">
            <el-button
              type="primary"
              size="small"
              @click="startDebugging"
              style="padding: 15px"
            >
              <img src="../assets/01.svg" alt="" style="width: 14px; height: 14px" />
              开始测试
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="stopDebugging"
              style="padding: 15px"
            >
              <img src="../assets/07.svg" alt="" style="width: 14px; height: 14px" />
              停止测试
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="addTestCase"
              style="padding: 15px"
            >
              <img src="../assets/02.svg" alt="" style="width: 14px; height: 14px" />
              增加用例
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="importXlsmFile"
              style="padding: 15px"
            >
              <img src="../assets/02.svg" alt="" style="width: 14px; height: 14px" />
              导入用例
            </el-button>
            <!-- <el-button type="primary" size="small" @click="showToast('导出用例')" style="padding: 15px">
                        <img src="../assets/03.svg" alt="" style="width: 14px;height: 14px" /> 导出测试用例
                    </el-button> -->
            <el-button
              type="primary"
              size="small"
              @click="exportTestReport(false)"
              style="padding: 15px"
            >
              <img src="../assets/04.svg" alt="" style="width: 14px; height: 14px" />
              导出报告(不含截图)
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="exportTestReport(true)"
              style="padding: 15px"
            >
              <img src="../assets/04.svg" alt="" style="width: 14px; height: 14px" />
              导出报告(含截图)
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="generateKnowledgeGraph"
              style="padding: 15px"
            >
              <img src="../assets/05.svg" alt="" style="width: 14px; height: 14px" />
              形成知识图谱
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="promptCaseConversion"
              style="padding: 15px"
            >
              <img src="../assets/06.svg" alt="" style="width: 14px; height: 14px" />
              序列化用例转化
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="deleteTestCase"
              style="padding: 15px"
            >
              <img src="../assets/10.svg" alt="" style="width: 14px; height: 14px" />
              删除用例
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="clearTestCase"
              style="padding: 15px"
            >
              <img src="../assets/10.svg" alt="" style="width: 14px; height: 14px" />
              清空用例
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="clearTestResults"
              style="padding: 15px"
            >
              <img src="../assets/10.svg" alt="" style="width: 14px; height: 14px" />
              清除测试结果
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="iconConfig"
              style="padding: 15px"
            >
              <img src="../assets/02.svg" alt="" style="width: 14px; height: 14px" />
              图标配置
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="openTestConfigDialog"
              style="padding: 15px"
            >
              <img src="../assets/07.svg" alt="" style="width: 14px; height: 14px" />
              测试配置
            </el-button>

            <!-- <el-button type="primary" size="small" @click="selectDbcFile" style="padding: 15px">
                        <img src="../assets/02.svg" alt="" style="width: 14px;height: 14px" /> 读取dbc
                    </el-button>
                    <span v-if="dbcFileName" class="file-name">已选择：{{ dbcFileName.name }}</span> -->
            <el-button
              type="primary"
              size="small"
              @click="openUploadRecordDialog"
              style="padding: 15px"
            >
              <img src="../assets/02.svg" alt="" style="width: 14px; height: 14px" />
              上传测试记录
            </el-button>
            <div class="file-button-group">
              <el-button
                type="primary"
                size="small"
                @click="selectDbcFile"
                style="padding: 15px"
                :loading="dbcUploadLoading"
              >
                <img src="../assets/02.svg" alt="" style="width: 14px; height: 14px" />
                {{ dbcUploadLoading ? "上传中..." : "读取DBC" }}
              </el-button>
              <el-button
                type="success"
                size="small"
                @click="selectUePdfFile"
                style="padding: 15px"
                :loading="uePdfLoading"
              >
                <img src="../assets/02.svg" alt="" style="width: 14px; height: 14px" />
                {{ uePdfLoading ? "导入中..." : "导入UE文件" }}
              </el-button>
              <div v-if="dbcFiles.length" class="dbc-file-list">
                <el-select v-model="selectedDbcName" placeholder="已加载 DBC（点击查看）" size="small" class="dbc-summary">
                  <el-option v-for="file in dbcFiles" :key="file.name" :label="dbcDisplayName(file.name)" :value="file.name">
                    <span :title="file.name">{{ dbcDisplayName(file.name) }}</span>
                  </el-option>
                </el-select>
                <span class="dbc-count">{{ dbcFiles.length }} 个文件</span>
                <el-button
                  v-if="selectedDbcName"
                  link
                  type="danger"
                  size="small"
                  title="删除当前 DBC"
                  @click="removeDbcFile(selectedDbcName)"
                >删除</el-button>
              </div>
            </div>
          </div>

          <div class="nav-right">
            <el-select
              v-model="currentLang"
              placeholder="选择语言"
              style="width: 120px; margin-left: 12px"
            >
              <el-option
                v-for="item in langOptions"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              />
            </el-select>

            <div v-if="userDisplayName || projectDisplayName" class="user-meta">
              <el-divider direction="vertical" />
              <el-tooltip v-if="projectDisplayName" :content="projectDisplayName" placement="bottom">
                <span class="meta-item">项目：{{ projectDisplayName }}</span>
              </el-tooltip>
              <el-tooltip v-if="userDisplayName" :content="userDisplayName" placement="bottom">
                <span class="meta-item">用户：{{ userDisplayName }}</span>
              </el-tooltip>
              <el-button type="danger" size="small" plain @click="handleLogout">退出</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <input
      type="file"
      ref="fileInput"
      accept=".xlsm,.xlsx"
      @change="handleFileUpload"
      style="display: none"
    />
    <input
      type="file"
      ref="dbcFileInput"
      accept=".dbc"
      multiple
      @change="handleDbcFileUpload"
      style="display: none"
    />
    <input
      type="file"
      ref="uePdfFileInput"
      accept=".pdf"
      @change="handleUePdfUpload"
      style="display: none"
    />

    <!-- UE 知识图谱弹窗 -->
    <el-dialog
      v-model="ueKgDialogVisible"
      title="UE 知识图谱（可编辑）"
      width="70%"
      :close-on-click-modal="false"
    >
      <div style="margin-bottom: 8px; color: #606266; font-size: 13px;">
        以下是 LLM 从 UE 文件生成的知识图谱 JSON，可直接编辑。保存时会校验 JSON 格式。
      </div>
      <el-input
        v-model="ueKgJsonContent"
        type="textarea"
        :rows="22"
        style="font-family: monospace; font-size: 13px;"
        placeholder="知识图谱 JSON"
      />
      <template #footer>
        <el-button @click="ueReupload">重新上传</el-button>
        <el-button type="primary" :loading="ueKgSaveLoading" @click="ueSaveToSession">
          保存到当前会话
        </el-button>
      </template>
    </el-dialog>

    <!-- 主内容区 -->
    <div class="content-layout">
      <div class="main-content">
        <div class="card">
          <div class="control-container">
            <el-button @click="selectRows">选择测试用例</el-button>
            <el-button @click="clearAllSelection">取消选择</el-button>
            <el-select
              v-model="infoType"
              placeholder="请选择信息类型"
              @change="handleInfoTypeChange"
              class="half-width"
            >
              <el-option label="关键信息" value="critical"></el-option>
              <el-option label="全部信息" value="all"></el-option>
            </el-select>
            <div class="half-width input-wrapper">
              <span style="margin-right: 8px; flex-shrink: 0; white-space: nowrap">URL地址：</span>
              <el-input
                v-model="url"
                placeholder="请输入URL地址"
                style="flex: 1; min-width: 0"
              ></el-input>
            </div>
          </div>
          <div>
            <el-table
              ref="caseTable"
              :data="paginatedCases"
              :key="tableKey"
              class="editable-table"
              height="450"
              highlight-current-row
              @selection-change="handleSelectionChange"
              @row-contextmenu="onRowRightClick"
              style="width: 100%"
              row-key="id"
              :row-class-name="rowClassName"
            >
              <el-table-column
                type="selection"
                :selectable="selectable"
                reserve-selection
                width="55"
              ></el-table-column>

              <!-- Case ID - 不可编辑 -->
              <el-table-column
                prop="id"
                label="Case ID"
                width="80"
                align="center"
              ></el-table-column>

              <!-- 测试用例ID - 可编辑 -->
              <el-table-column
                prop="TestCaseID"
                label="测试用例ID"
                min-width="120"
                v-if="showTestKey"
              >
                <template #default="scope">
                  <el-input
                    v-if="scope.row.editing"
                    v-model="scope.row.TestCaseID"
                    @blur="scope.row.editing = false"
                    size="small"
                  ></el-input>
                  <span @click="scope.row.editing = true" v-else>{{
                    scope.row.TestCaseID
                  }}</span>
                </template>
              </el-table-column>

              <!-- SyRD/FSRD ID - 可编辑 -->
              <el-table-column
                prop="SyRDIDFSRD"
                label="SyRD/FSRD ID"
                min-width="120"
                v-if="showTestKey"
              >
                <template #default="scope">
                  <el-input
                    v-if="scope.row.editing"
                    v-model="scope.row.SyRDIDFSRD"
                    @blur="scope.row.editing = false"
                    size="small"
                  ></el-input>
                  <span @click="scope.row.editing = true" v-else>{{
                    scope.row.SyRDIDFSRD
                  }}</span>
                </template>
              </el-table-column>

              <!-- 自动测试ID - 可编辑 -->
              <el-table-column
                prop="Auto_testID"
                label="自动测试ID"
                min-width="120"
                v-if="showTestKey"
              >
                <template #default="scope">
                  <el-input
                    v-if="scope.row.editing"
                    v-model="scope.row.Auto_testID"
                    @blur="scope.row.editing = false"
                    size="small"
                  ></el-input>
                  <span @click="scope.row.editing = true" v-else>{{
                    scope.row.Auto_testID
                  }}</span>
                </template>
              </el-table-column>

              <!-- TSR - 可编辑 -->
              <el-table-column prop="TSR" label="TSR" min-width="120" v-if="showTestKey">
                <template #default="scope">
                  <el-input
                    v-if="scope.row.editing"
                    v-model="scope.row.TSR"
                    @blur="scope.row.editing = false"
                    size="small"
                  ></el-input>
                  <span @click="scope.row.editing = true" v-else>{{
                    scope.row.TSR
                  }}</span>
                </template>
              </el-table-column>

              <!-- 用例优先级 - 可编辑 -->
              <el-table-column
                prop="CasePriority"
                label="用例优先级"
                min-width="120"
                v-if="showTestKey"
              >
                <template #default="scope">
                  <el-input
                    v-if="scope.row.editing"
                    v-model="scope.row.CasePriority"
                    @blur="scope.row.editing = false"
                    size="small"
                  ></el-input>
                  <span @click="scope.row.editing = true" v-else>{{
                    scope.row.CasePriority
                  }}</span>
                </template>
              </el-table-column>

              <!-- 测试方法 - 可编辑 -->
              <el-table-column
                prop="TestMethod"
                label="测试方法"
                min-width="120"
                v-if="showTestKey"
              >
                <template #default="scope">
                  <el-input
                    v-if="scope.row.editing"
                    v-model="scope.row.TestMethod"
                    @blur="scope.row.editing = false"
                    size="small"
                  ></el-input>
                  <span @click="scope.row.editing = true" v-else>{{
                    scope.row.TestMethod
                  }}</span>
                </template>
              </el-table-column>

              <!-- 测试策略 - 可编辑 -->
              <el-table-column
                prop="TestStrategy"
                label="测试策略"
                min-width="120"
                v-if="showTestKey"
              >
                <template #default="scope">
                  <el-input
                    v-if="scope.row.editing"
                    v-model="scope.row.TestStrategy"
                    @blur="scope.row.editing = false"
                    size="small"
                  ></el-input>
                  <span @click="scope.row.editing = true" v-else>{{
                    scope.row.TestStrategy
                  }}</span>
                </template>
              </el-table-column>

              <!-- 设计方法 - 可编辑 -->
              <el-table-column
                prop="DesignMethod"
                label="设计方法"
                min-width="120"
                v-if="showTestKey"
              >
                <template #default="scope">
                  <el-input
                    v-if="scope.row.editing"
                    v-model="scope.row.DesignMethod"
                    @blur="scope.row.editing = false"
                    size="small"
                  ></el-input>
                  <span @click="scope.row.editing = true" v-else>{{
                    scope.row.DesignMethod
                  }}</span>
                </template>
              </el-table-column>

              <!-- 测试功能点 - 可编辑 -->
              <el-table-column
                prop="TestKey"
                label="测试功能点"
                min-width="120"
                v-if="showTestKey"
              >
                <template #default="scope">
                  <el-input
                    v-if="scope.row.editing"
                    v-model="scope.row.TestKey"
                    @blur="scope.row.editing = false"
                    size="small"
                  ></el-input>
                  <span @click="scope.row.editing = true" v-else>{{
                    scope.row.TestKey
                  }}</span>
                </template>
              </el-table-column>

              <!-- 初始条件 - 可编辑 -->
              <el-table-column prop="Initial_Condition" label="初始条件" min-width="200">
                <template #default="scope">
                  <el-input
                    v-if="scope.row.editing"
                    v-model="scope.row.Initial_Condition"
                    @blur="scope.row.editing = false"
                    type="textarea"
                    autosize
                  ></el-input>
                  <span @click="scope.row.editing = true" v-else>{{
                    scope.row.Initial_Condition
                  }}</span>
                </template>
              </el-table-column>

              <!-- 动作 - 可编辑 -->
              <el-table-column prop="Action" label="动作" min-width="180">
                <template #default="scope">
                  <el-input
                    v-if="scope.row.editing"
                    v-model="scope.row.Action"
                    @blur="scope.row.editing = false"
                    type="textarea"
                    autosize
                  ></el-input>
                  <span @click="scope.row.editing = true" v-else>{{
                    scope.row.Action
                  }}</span>
                </template>
              </el-table-column>

              <!-- 预期结果 - 可编辑 -->
              <el-table-column prop="Expected_Result" label="预期结果" min-width="180">
                <template #default="scope">
                  <el-input
                    v-if="scope.row.editing"
                    v-model="scope.row.Expected_Result"
                    @blur="scope.row.editing = false"
                    type="textarea"
                    autosize
                  ></el-input>
                  <span @click="scope.row.editing = true" v-else>{{
                    scope.row.Expected_Result
                  }}</span>
                </template>
              </el-table-column>

              <!-- 初始条件序列 - 可编辑 -->
              <el-table-column
                prop="InitTestSequences"
                label="初始条件序列"
                min-width="180"
              >
                <template #default="scope">
                  <el-input
                    v-if="scope.row.editing"
                    v-model="scope.row.InitTestSequences"
                    @blur="scope.row.editing = false"
                    type="textarea"
                    autosize
                  ></el-input>
                  <span @click="scope.row.editing = true" v-else>{{
                    scope.row.InitTestSequences
                  }}</span>
                </template>
              </el-table-column>

              <!-- 操作步骤序列 - 可编辑 -->
              <el-table-column
                prop="ActionTestSequences"
                label="操作步骤序列"
                min-width="140"
              >
                <template #default="scope">
                  <el-input
                    v-if="scope.row.editing"
                    v-model="scope.row.ActionTestSequences"
                    @blur="scope.row.editing = false"
                    type="textarea"
                    autosize
                  ></el-input>
                  <span @click="scope.row.editing = true" v-else>{{
                    scope.row.ActionTestSequences
                  }}</span>
                </template>
              </el-table-column>

              <!-- 预期结果序列 - 可编辑 -->
              <el-table-column
                prop="ExpectedTestSequences"
                label="预期结果序列"
                min-width="140"
              >
                <template #default="scope">
                  <el-input
                    v-if="scope.row.editing"
                    v-model="scope.row.ExpectedTestSequences"
                    @blur="scope.row.editing = false"
                    type="textarea"
                    autosize
                  ></el-input>
                  <span @click="scope.row.editing = true" v-else>{{
                    scope.row.ExpectedTestSequences
                  }}</span>
                </template>
              </el-table-column>

              <!-- 测试结果 - 可编辑 -->
              <el-table-column prop="Result" label="测试结果" min-width="180">
                <template #default="scope">
                  <el-select
                    v-if="scope.row.Result !== undefined && scope.row.Result !== ''"
                    v-model="scope.row.Result"
                    size="small"
                    style="width: 120px"
                  >
                    <el-option label="Pass" value="Pass" />
                    <el-option label="Fail" value="Fail" />
                  </el-select>
                  <span v-else>{{ scope.row.Result }}</span>
                  <br />
                  <el-button
                    v-if="scope.row.Testid && scope.row.Result !== undefined && scope.row.Result !== ''"
                    type="primary"
                    size="small"
                    @click="fetchTestLogs(scope.row.Testid)"
                    style="padding: 15px"
                  >
                    <img
                      src="../assets/11.svg"
                      alt=""
                      style="width: 14px; height: 14px"
                    />
                    查看
                  </el-button>
                </template>
              </el-table-column>

              <!-- 📹 ADB 操作序列录制（新增） -->
              <el-table-column label="ADB 录制" width="200" align="center" fixed="right">
                <template #default="scope">
                  <div style="display: flex; flex-direction: column; gap: 6px; align-items: center;">
                    <div style="font-size: 12px; line-height: 1.2;">
                      <el-tag v-if="scope.row._adb_recorded" size="small" type="success">✅ 已录制</el-tag>
                    </div>
                    <el-button
                      type="primary"
                      plain
                      size="small"
                      @click="openRecordWizard(scope.row)"
                    >
                      🎬 {{ scope.row._adb_recorded ? '重新录制' : '录制 ADB 序列' }}
                    </el-button>
                  </div>
                </template>
              </el-table-column>

              <!-- 实际结果 - 不可编辑：展示 AI 判定依据的语义裁剪图，失败时回退"查看"按钮 -->
              <el-table-column prop="ActualResult" label="实际结果" min-width="180">
                <template #default="scope">
                  <br />
                  <!-- AI 判定依据：与"测试结果"列同款蓝色查看按钮，点击弹出裁剪依据图+取部位日志 -->
                  <el-button
                    v-if="scope.row.Testid && scope.row.Result !== undefined && scope.row.Result !== ''"
                    type="primary"
                    size="small"
                    @click="
                      fetchActualResult(scope.row.Testid, scope.row.ExpectedTestSequences)
                    "
                    style="padding: 15px"
                  >
                    <img
                      src="../assets/11.svg"
                      alt=""
                      style="width: 14px; height: 14px"
                    />
                    查看
                  </el-button>
                </template>
              </el-table-column>

              <!-- 是否选中 - 可编辑 -->
              <el-table-column
                prop="Selected"
                label="是否选中"
                min-width="120"
                v-if="showTestKey"
              >
                <template #default="scope">
                  <el-input
                    v-if="scope.row.editing"
                    v-model="scope.row.Selected"
                    @blur="scope.row.editing = false"
                    size="small"
                  ></el-input>
                  <span @click="scope.row.editing = true" v-else>{{
                    scope.row.Selected
                  }}</span>
                </template>
              </el-table-column>

              <!-- PR号 - 可编辑 -->
              <el-table-column
                prop="PRNo"
                label="PR号"
                min-width="120"
                v-if="showTestKey"
              >
                <template #default="scope">
                  <el-input
                    v-if="scope.row.editing"
                    v-model="scope.row.PRNo"
                    @blur="scope.row.editing = false"
                    size="small"
                  ></el-input>
                  <span @click="scope.row.editing = true" v-else>{{
                    scope.row.PRNo
                  }}</span>
                </template>
              </el-table-column>

              <!-- 测试日志 - 可编辑 -->
              <el-table-column
                prop="TestLogs"
                label="测试日志"
                min-width="120"
                v-if="showTestKey"
              >
                <template #default="scope">
                  <el-input
                    v-if="scope.row.editing"
                    v-model="scope.row.TestLogs"
                    @blur="scope.row.editing = false"
                    size="small"
                  ></el-input>
                  <span @click="scope.row.editing = true" v-else>{{
                    scope.row.TestLogs
                  }}</span>
                </template>
              </el-table-column>

              <!-- 测试次数 - 可编辑 -->
              <el-table-column
                prop="Numberoftests"
                label="测试次数"
                min-width="120"
                v-if="showTestKey"
              >
                <template #default="scope">
                  <el-input
                    v-if="scope.row.editing"
                    v-model="scope.row.Numberoftests"
                    @blur="scope.row.editing = false"
                    size="small"
                  ></el-input>
                  <span @click="scope.row.editing = true" v-else>{{
                    scope.row.Numberoftests
                  }}</span>
                </template>
              </el-table-column>

              <!-- 测试日期 - 可编辑 -->
              <el-table-column
                prop="TestDate"
                label="测试日期"
                min-width="120"
                v-if="showTestKey"
              >
                <template #default="scope">
                  <el-input
                    v-if="scope.row.editing"
                    v-model="scope.row.TestDate"
                    @blur="scope.row.editing = false"
                    size="small"
                  ></el-input>
                  <span @click="scope.row.editing = true" v-else>{{
                    scope.row.TestDate
                  }}</span>
                </template>
              </el-table-column>

              <!-- 备注 - 可编辑 -->
              <el-table-column
                prop="Remark"
                label="备注"
                min-width="120"
                v-if="showTestKey"
              >
                <template #default="scope">
                  <el-input
                    v-if="scope.row.editing"
                    v-model="scope.row.Remark"
                    @blur="scope.row.editing = false"
                    size="small"
                  ></el-input>
                  <span @click="scope.row.editing = true" v-else>{{
                    scope.row.Remark
                  }}</span>
                </template>
              </el-table-column>

              <!-- Testid - 保持原有 -->
              <el-table-column label="Testid" v-if="showTestidColumn"> </el-table-column>
            </el-table>
            <!-- <el-table-column label="查看" min-width="260">
                            <el-button type="primary" size="small" @click="fetchTestLogs(row.id)" style="padding: 15px"
                                v-if="scope.row.Result !== null">
                                <img src="../assets/11.svg" alt="" style="width: 14px;height: 14px" />
                                查看
                            </el-button>
                        </el-table-column> -->
            <ul
              v-show="contextMenu.visible"
              :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
              class="context-menu"
              @mouseleave="contextMenu.visible = false"
            >
              <li @click="startDebugging">执行已选用例</li>
              <li @click="runSingleRow(contextMenu.row)">本用例执行</li>
              <li @click="convertRow(contextMenu.row)">本用例序列化转换</li>
            </ul>
          </div>

          <!-- <div class="pagination-container">
                        <el-pagination background layout="prev, pager, next" :total="cases.length" :page-size="pageSize"
                            :current-page="currentPage" @current-change="handlePageChange">
                        </el-pagination>
                    </div> -->
          <div class="pagination-container">
            <el-pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              :total="cases.length"
              v-model:page-size="pageSize"
              :page-sizes="pageSizeOptions"
              :current-page="currentPage"
              @current-change="handlePageChange"
              @size-change="handleSizeChange"
            >
            </el-pagination>
          </div>
        </div>

        <!-- 日志输出 -->
        <div style="display: flex">
          <div class="card" style="flex: 5; padding: 10px">
            <el-tabs v-model="activeName" type="card">
              <el-tab-pane label="过往测试记录" name="first">
                <el-table
                  :data="logCases"
                  class="logs-table"
                  height="440"
                  style="width: 100%"
                >
                  <el-table-column
                    prop="id"
                    label="序号"
                    width="80"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    prop="time"
                    label="时间"
                    min-width="160"
                    sortable
                  ></el-table-column>
                  <el-table-column
                    prop="message"
                    label="消息"
                    min-width="260"
                  ></el-table-column>
                  <el-table-column label="操作" min-width="260">
                    <template #default="{ row }">
                      <el-button
                        type="primary"
                        size="small"
                        @click="fetchTestLogs(row.id)"
                        style="padding: 15px"
                      >
                        <img
                          src="../assets/11.svg"
                          alt=""
                          style="width: 14px; height: 14px"
                        />
                        查看
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div style="display: flex; align-items: center">
                  <div>每页{{ pageSize1 }}条，共{{ logs_total }}条</div>
                  <div class="pagination-container">
                    <el-pagination
                      background
                      layout="prev, pager, next"
                      :total="logs_total"
                      :page-size="pageSize1"
                      :current-page="currentPage1"
                      @current-change="handlePageChange1"
                    >
                    </el-pagination>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="测试执行日志" name="third">
                <el-select
                  v-model="selectedCase"
                  placeholder="请选择测试用例"
                  style="margin-bottom: 20px"
                  @change="printInfo"
                >
                  <el-option
                    v-for="testCase in debugRows"
                    :key="testCase.id"
                    :label="`${testCase.id} - ${testCase.ExpectedTestSequences}`"
                    :value="testCase.id"
                  >
                  </el-option>
                </el-select>
                <div v-if="selectedCase">
                  <div class="table-title">测试用例 {{ selectedCase }}</div>
                  <el-table
                    :data="filteredExecutionLogs"
                    class="logs-table execution-logs-table"
                    max-height="440"
                    style="width: 100%"
                    ref="executionLogsTable"
                  >
                    <el-table-column
                      prop="log_id"
                      label="序号"
                      width="80"
                      align="center"
                    ></el-table-column>
                    <el-table-column
                      prop="time"
                      label="时间"
                      min-width="160"
                      sortable
                    ></el-table-column>
                    <el-table-column
                      prop="message"
                      label="消息"
                      min-width="260"
                    >
                      <template #default="{ row }">
                        <div class="execution-log-message">{{ row.message }}</div>
                        <el-collapse
                          v-if="row.imageId"
                          class="step-screenshot-collapse"
                          @change="(names) => handleStepScreenshotExpand(row, names)"
                        >
                          <el-collapse-item title="查看步骤截图" name="image">
                            <div v-if="row.imageLoading">截图加载中...</div>
                            <el-alert v-else-if="row.imageError" :title="row.imageError" type="error" :closable="false" />
                            <el-image
                              v-else-if="row.imageUrl"
                              :src="row.imageUrl"
                              :preview-src-list="[row.imageUrl]"
                              fit="contain"
                              class="execution-step-screenshot"
                            />
                          </el-collapse-item>
                        </el-collapse>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <div v-else>请选择一个测试用例以查看其执行日志。</div>
              </el-tab-pane>

              <el-tab-pane label="用户日志" name="fourth">
                <el-table
                  :data="userLogs"
                  :row-style="getRowStyle"
                  class="logs-table execution-logs-table"
                  max-height="440"
                  style="width: 100%"
                  row-key="step_id"
                >
                  <el-table-column
                    prop="step_id"
                    label="序号"
                    width="80"
                    align="center"
                  />

                  <el-table-column label="内容" min-width="260">
                    <template #default="{ row }">
                      <div :style="row.rowStyle">{{ row.msg }}</div>

                      <div
                        v-for="(sub, idx) in row.subSteps"
                        :key="idx"
                        class="user-logs-sub"
                      >
                        └─ {{ idx + 1 }}. {{ sub.text }}

                        <el-button
                          v-if="sub.hasTapIcon"
                          size="small"
                          style="
                            margin-left: 6px;
                            height: 20px;
                            padding: 0 8px;
                            font-size: 12px;
                          "
                          @click="showIcon"
                        >
                          点击失败? 去修改
                        </el-button>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </div>
          <div class="card" style="flex: 5; padding: 10px">
            <el-tabs v-model="activeDevice" type="card" @tab-click="handleClick">
              <!-- 车机设备 -->
              <el-tab-pane label="车机设备" name="five">
                <!-- 保留坐标提示 -->
                <div v-if="mobilePoint" class="coord-info">
                  当前坐标：({{ mobilePoint.x }}, {{ mobilePoint.y }})
                </div>

                <div class="video-container">
                  <el-input v-model="mobileVideoUrl" size="small" placeholder="车机视频流地址（仅用于连接视频）" class="video-url-input" />
                  <!-- 视频流 -->
                  <iframe
                    ref="videoPlayer"
                    width="100%"
                    height="480"
                    frameborder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowfullscreen
                  >
                  </iframe>
                  <!-- 连接按钮 -->
                  <div class="device-controls">
                    <el-button type="primary" @click="connectMobileStream">
                      连接视频流
                    </el-button>
                  </div>
                </div>
              </el-tab-pane>

              <!-- 仪表设备 -->
              <el-tab-pane label="仪表设备" name="six">
                <div class="video-container">
                  <el-input v-model="instrumentVideoUrl" size="small" placeholder="仪表视频流地址（仅用于连接视频）" class="video-url-input" />
                  <iframe
                    ref="instrumentVideoPlayer"
                    width="100%"
                    height="480"
                    frameborder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowfullscreen
                  >
                  </iframe>

                  <div class="device-controls">
                    <el-button type="primary" @click="connectInstrumentStream">
                      连接视频流
                    </el-button>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="testConfigVisible"
      title="测试配置"
      width="480px"
      :close-on-click-modal="true"
    >
      <el-form label-width="160px" style="padding: 0 8px">
        <el-card shadow="never" style="margin-bottom: 16px">
          <template #header>
            <div style="font-weight: 600">图像匹配相关设置</div>
          </template>
          <el-form-item label="前置等待时间">
            <el-input-number
              v-model="testConfig.preWaitSec"
              :min="0"
              :max="999"
              :step="0.1"
              :precision="3"
              style="width: 100%"
            />
            <div style="font-size: 12px; color: #999">单位：秒</div>
          </el-form-item>
          <el-form-item label="是否 检测超时时间">
            <el-switch v-model="testConfig.isClip" active-text="是" inactive-text="否" />
          </el-form-item>

          <el-form-item label="执行前重置信号">
            <el-switch
              v-model="testConfig.isReset"
              active-text="是"
              inactive-text="否"
            />
          </el-form-item>
          <el-form-item v-if="testConfig.isReset" label="重置后延时">
            <el-input-number
              v-model="testConfig.resetDelaySec"
              :min="0"
              :max="999"
              :step="0.1"
              :precision="3"
              style="width: 100%"
            />
            <div style="font-size: 12px; color: #999">
              单位：秒。信号复位完成后等待该时间才开始测试
            </div>
          </el-form-item>
          <el-form-item label="安卓执行模式">
            <el-radio-group v-model="testConfig.explorationMode">
              <el-radio-button value="approval">审批模式</el-radio-button>
              <el-radio-button value="exploration">探索模式</el-radio-button>
            </el-radio-group>
            <div style="font-size: 12px; color: #999">
              探索模式自动执行滑动、等待等探索动作；坐标图标点击仍需确认，XML 明确文字继续免审批。
            </div>
          </el-form-item>
        </el-card>

        <el-card shadow="never" style="margin-bottom: 16px">
          <template #header>
            <div style="font-weight: 600">ADB 录制服务设置</div>
          </template>
          <el-form-item label="ADB 设备 ID">
            <div style="display: flex; gap: 8px">
              <el-select
                v-model="testConfig.recordMachineId"
                placeholder="请选择或手动输入"
                style="flex: 1"
                filterable
                allow-create
                default-first-option
              >
                <el-option
                  v-for="d in adbDeviceList"
                  :key="d.id"
                  :label="`${d.id} (${d.state})`"
                  :value="d.id"
                />
              </el-select>
              <el-button
                type="primary"
                plain
                :loading="adbDeviceLoading"
                @click="fetchAdbDeviceList"
              >
                刷新列表
              </el-button>
            </div>
            <div style="font-size: 12px; color: #999">设备唯一标识（ADB 序列号），作为录制记录的唯一索引之一</div>
          </el-form-item>
        </el-card>
        <!-- <el-card shadow="never">
                    <template #header>
                        <div style="font-weight:600">执行用例流程设置</div>
                    </template>
                    <el-form-item label="失败后继续执行当前行其他步骤">
                        <el-switch v-model="testConfig.continueOnFail" active-text="是" inactive-text="否" />
                    </el-form-item>
                    <el-form-item label="所有再发报文改为默认值">
                        <el-switch v-model="testConfig.defaultAllIn" active-text="是" inactive-text="否" />
                    </el-form-item>
                </el-card> -->
      </el-form>
      <template #footer>
        <el-button @click="testConfigVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveTestConfig">保 存</el-button>
      </template>
    </el-dialog>

    <!-- 图标查看弹窗 -->
    <el-dialog
      v-model="iconDialogVisible"
      title="当前图标"
      width="70%"
      :close-on-click-modal="true"
    >
      <div style="text-align: center">
        <img
          v-if="iconInfo.img_base64"
          :src="'data:image/png;base64,' + iconInfo.img_base64"
          style="max-width: 100%; border: 1px solid #ccc; border-radius: 4px"
        />
        <div v-if="iconInfo.iconList" style="margin-top: 12px; text-align: left">
          <div
            v-for="item in iconInfo.iconList"
            :key="item.index"
            style="
              display: flex;
              align-items: center;
              margin-bottom: 6px;
              line-height: 1.8;
            "
          >
            <span style="min-width: 36px; font-weight: bold">{{ item.index }}.</span>
            <span style="color: #999; margin-right: 6px">{{ item.coord }}:</span>
            <el-input v-model="item.name" size="small" style="flex: 1" />
          </div>
        </div>
        <span v-if="!iconInfo.img_base64 && !iconInfo.icon_names">暂无图标</span>
      </div>
      <template #footer>
        <el-button type="primary" :loading="saveIconLoading" @click="saveIconNames"
          >保 存</el-button
        >
        <el-button @click="iconDialogVisible = false">关 闭</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="caseConversionDialogVisible" title="序列化用例转化" width="50%">
      <el-form label-width="150px" @submit.prevent>
        <el-form-item label="提示词">
          <el-input
            v-model="prompt1"
            placeholder="请输入序列化用例转化的提示词"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="caseConversionDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="caseConversion">开始转换</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 用例转化进度弹窗 -->
    <el-dialog
      v-model="conversionDialogVisible"
      title="用例转化中..."
      width="400px"
      :close-on-click-modal="isConversionPaused"
      :close-on-press-escape="isConversionPaused"
      :show-close="isConversionPaused"
      :modal="!isConversionPaused"
      :lock-scroll="!isConversionPaused"
    >
      <div style="padding: 20px 0">
        <!-- 进度条 -->
        <el-progress
          :percentage="conversionProgress"
          :stroke-width="20"
          :text-inside="true"
          status="success"
        >
        </el-progress>

        <!-- 进度信息 -->
        <div style="margin-top: 15px; text-align: center; color: #666">
          <div style="font-size: 14px; margin-bottom: 8px">
            正在转化：{{ conversionStatusText }}
          </div>
          <div style="font-size: 13px">
            进度：{{ conversionCurrent }} / {{ conversionTotal }} 条
          </div>
        </div>

        <div style="margin-top: 14px; text-align: center">
          <el-button
            size="small"
            @click="toggleConversionPause"
            :disabled="!isConverting"
          >
            {{ isConversionPaused ? "继续转换" : "暂停转换" }}
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="cancelConversion"
            :disabled="!isConverting"
          >
            取消转换
          </el-button>
        </div>

        <!-- 转化提示 -->
        <div
          style="
            margin-top: 15px;
            padding: 10px;
            background: #f5f7fa;
            border-radius: 4px;
            font-size: 12px;
            color: #909399;
          "
        >
          <i class="el-icon-info"></i>
          正在使用 AI 将自然语言转化为测试序列，请耐心等待...
        </div>
      </div>
    </el-dialog>

    <div
      v-if="isConverting && isConversionPaused && !conversionDialogVisible"
      class="conversion-paused-float"
    >
      <el-tag type="warning" effect="dark">转换已暂停</el-tag>
      <div class="conversion-paused-actions">
        <el-button size="small" type="primary" @click="toggleConversionPause">继续转换</el-button>
        <el-button size="small" @click="conversionDialogVisible = true">查看进度</el-button>
        <el-button size="small" type="danger" @click="cancelConversion">取消</el-button>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" title="增加用例" width="50%">
      <el-form :model="newCase" label-width="120px">
        <el-form-item label="测试功能点">
          <el-input v-model="newCase.TestKey" placeholder="请输入测试功能点"></el-input>
        </el-form-item>
        <el-form-item label="初始条件">
          <el-input
            v-model="newCase.Initial_Condition"
            placeholder="请输入初始条件"
          ></el-input>
        </el-form-item>
        <el-form-item label="动作">
          <el-input v-model="newCase.Action" placeholder="请输入动作"></el-input>
        </el-form-item>
        <el-form-item label="预期结果">
          <el-input
            v-model="newCase.Expected_Result"
            placeholder="请输入预期结果"
          ></el-input>
        </el-form-item>
        <el-form-item label="初始条件序列">
          <el-input
            v-model="newCase.InitTestSequences"
            placeholder="请输入初始条件序列"
          ></el-input>
        </el-form-item>
        <el-form-item label="操作步骤序列">
          <el-input
            v-model="newCase.ActionTestSequences"
            placeholder="请输入操作步骤序列"
          ></el-input>
        </el-form-item>
        <el-form-item label="预期结果序列">
          <el-input
            v-model="newCase.ExpectedTestSequences"
            placeholder="请输入预期结果序列"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAddTestCase">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 图标配置弹窗 -->
    <el-dialog v-model="iconConfigDialogVisible" title="图标配置" width="60%">
      <el-alert
        v-if="iconConfigTip"
        :title="iconConfigTip"
        type="error"
        :closable="false"
        style="margin-bottom: 12px"
      >
      </el-alert>

      <!-- 模式切换 + 操作按钮 -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <el-radio-group v-model="iconMode" size="default">
          <el-radio-button value="dots">描点模式</el-radio-button>
          <el-radio-button value="control">操作模式 (ADB)</el-radio-button>
        </el-radio-group>

        <div>
          <el-button size="small" @click="loadIconConfigShot">
            {{ iconConfigLoading ? '加载中...' : '🔄 刷新画面' }}
          </el-button>
        </div>
      </div>

      <!-- 操作模式提示 -->
      <el-alert
        v-if="iconMode === 'control'"
        title="操作模式：单击=Tap，按下拖动=Swipe"
        type="info"
        :closable="false"
        show-icon
        style="margin-bottom: 12px; font-size: 13px;"
      />

      <!-- 画面容器（wrap 统一控制精确像素尺寸，内部 img/canvas/事件层 全部 100% 填满 wrap） -->
      <div style="display: flex; justify-content: center;">
        <div
          ref="iconWrap"
          style="position: relative; line-height: 0;"
        >
          <!-- 画面：直接用 <img> 指向 /adb/video（已确认返回的就是 img 元素）
               好处：1. 没有 iframe 跨域问题 2. 能读到 natural/client 尺寸 3. 没有内部 padding/滚动条占位 -->
          <img
            ref="iconVideoPlayer"
            :src="iconVideoSrc"
            crossorigin="anonymous"
            style="display: block; width: 100%; height: 100%; object-fit: contain; background: #000; user-select: none; -webkit-user-drag: none;"
            alt="adb-video"
          />

          <!-- 事件层：100% 填满 wrap，永远和画面等大 → wrap 外的空白（右侧/下方）根本没事件层，不可能点到 -->
          <div
            ref="iconEventLayer"
            style="position: absolute; inset: 0; z-index: 2; width: 100%; height: 100%;"
            :style="{ cursor: iconMode === 'dots' ? 'crosshair' : 'pointer' }"
            @mousedown="onScreenMouseDown"
            @mouseup="onScreenMouseUp"
            @mousemove="onScreenMouseMove"
            @mouseleave="onScreenMouseUp"
          ></div>

          <!-- 画布：100% 填满 wrap -->
          <canvas
            ref="iconOverlayCanvas"
            style="position: absolute; inset: 0; z-index: 3; pointer-events: none; width: 100%; height: 100%;"
          ></canvas>
        </div>
      </div>

      <!-- ADB 操作日志 / 操作序列录制（操作模式下） -->
      <div v-if="iconMode === 'control'" style="margin-top: 10px;">
        <el-collapse>
          <el-collapse-item title="ADB 操作记录（可勾选以录制操作序列）" name="1" :disabled="!adbOpLogs.length">
            <!-- 顶部工具栏 -->
            <div v-if="adbOpLogs.length" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 8px;">
              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                <el-button size="small" type="primary" plain :disabled="!adbOpLogs.length" @click="clearAdbLogs">
                  🗑 清空
                </el-button>
                <el-button size="small" plain :disabled="!adbOpLogs.length" @click="toggleSelectAllAdbLogs">
                  {{ isAllAdbLogsSelected ? '取消全选' : '全选' }}
                </el-button>
                <el-tag size="small" type="info">
                  共 {{ adbOpLogs.length }} 条，已选 {{ adbOpSelectedIds.length }} 条
                </el-tag>
              </div>
            </div>
            <!-- 操作记录表格 -->
            <el-table
              v-if="adbOpLogs.length"
              :data="adbOpLogs"
              size="small"
              max-height="320"
              border
              stripe
              style="width: 100%;"
              @selection-change="onAdbSelectionChange"
              ref="adbLogsTableRef"
            >
              <el-table-column type="selection" width="48" align="center" />
              <el-table-column type="index" label="序号" width="60" align="center" />
              <el-table-column label="时间" width="88" align="center">
                <template #default="{ row }">
                  <span style="font-size: 12px; color: #909399;">{{ row.time }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作类型" width="90" align="center">
                <template #default="{ row }">
                  <el-tag size="small" :type="row.success ? 'success' : 'danger'" style="margin-right: 4px;">
                    {{ row.type }}
                  </el-tag>
                  <el-icon v-if="!row.success" :size="14" color="#F56C6C" title="执行失败">
                    <WarningFilled />
                  </el-icon>
                </template>
              </el-table-column>
              <el-table-column label="操作详情">
                <template #default="{ row }">
                  <div style="font-size: 13px; line-height: 1.6;">
                    <template v-if="row.type === 'TAP'">
                      <strong>点击坐标：</strong>
                      <code style="background:#f4f4f5; padding: 0 6px; border-radius: 3px;">({{ row.x }}, {{ row.y }})</code>
                    </template>
                    <template v-else-if="row.type === 'SWIPE'">
                      <strong>滑动：</strong>
                      <code style="background:#f4f4f5; padding: 0 6px; border-radius: 3px;">
                        ({{ row.x1 }}, {{ row.y1 }}) → ({{ row.x2 }}, {{ row.y2 }})
                      </code>
                      <span style="margin-left: 8px; color: #909399;">时长 {{ row.duration }}ms</span>
                    </template>
                    <template v-else-if="row.type === 'KEY'">
                      <strong>按键：</strong>
                      <code style="background:#f4f4f5; padding: 0 6px; border-radius: 3px;">{{ row.keyCode }}</code>
                      <span style="margin-left: 8px; color: #909399;">({{ row.keyName }})</span>
                    </template>
                    <template v-else>
                      {{ row.msg }}
                    </template>
                    <div style="color: #909399; font-size: 12px; margin-top: 2px;">
                      ADB 命令：<code style="background:#fffbe6; padding: 0 4px;">{{ row.cmd }}</code>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="72" align="center">
                <template #default="{ $index }">
                  <el-button size="small" type="danger" plain link @click="deleteAdbLogAt($index)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div v-else style="color: #909399; font-size: 13px; padding: 12px 0; text-align: center;">
              暂无 ADB 操作记录，在上方画面点击或滑动即可生成
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>

      <!-- 已标点列表（仅描点模式） -->
      <el-table v-if="iconMode === 'dots'" :data="iconDots" style="margin-top: 12px" max-height="220">
        <el-table-column label="序号" width="60" type="index" />
        <el-table-column label="名称" min-width="140">
          <template #default="{ row }">
            <el-input v-model="row.name" size="small" placeholder="请输入图标名称" />
          </template>
        </el-table-column>
        <el-table-column label="X" width="70" prop="x" />
        <el-table-column label="Y" width="70" prop="y" />
        <el-table-column width="60">
          <template #default="{ $index }">
            <el-button link type="danger" @click="delDot($index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <el-button @click="iconConfigDialogVisible = false">关 闭</el-button>
        <el-button v-if="iconMode === 'dots'" type="primary" @click="submitIconDots">保存坐标</el-button>
      </template>
    </el-dialog>

    <!-- ===================================================================== -->
    <!-- 🎬 案例 ADB 操作序列录制向导（方案 A：独立 Dialog，与图标配置解耦）     -->
    <!-- ===================================================================== -->
    <el-dialog v-model="recDialogVisible" title="ADB录制" width="90%" top="4vh">
      <el-steps :active="recStep" finish-status="success" align-center style="margin-bottom:18px;">
        <el-step title="① 初始条件" :description="(() => {
          const done = (recInitialParsed || []).filter(s => s.seq).length;
          const skipped = (recInitialParsed || []).filter(s => s.skipped && !s.seq).length;
          const total = (recInitialParsed || []).length || 1;
          const finished = done + skipped;
          const tag = skipped > 0 ? `（含跳过${skipped}）` : '';
          return finished >= total && total > 0
            ? `✅ 已完成 ${done}/${total}${tag}`
            : `录制初始条件（${done}/${total}${tag}）`;
        })()" />
        <el-step title="② 操作步骤" :description="(() => {
          const done = (recActionParsed || []).filter(s => s.seq).length;
          const skipped = (recActionParsed || []).filter(s => s.skipped && !s.seq).length;
          const total = (recActionParsed || []).length || 1;
          const finished = done + skipped;
          const tag = skipped > 0 ? `（含跳过${skipped}）` : '';
          return finished >= total && total > 0
            ? `✅ 已完成 ${done}/${total}${tag}`
            : `录制操作步骤（${done}/${total}${tag}）`;
        })()" />
        <el-step title="③ 预期结果（人工判断）" :description="(recRebooting ? '🔄 车机重启中…' : '判断结果是否符合')" />
      </el-steps>

      <!-- 案例信息（顶部提示条） -->
      <el-alert v-if="recCase" type="info" :closable="false" show-icon style="margin-bottom:14px;">
        <template #title> 
          当前案例：
          <b style="margin:0 8px;">[{{ recCase.id }}] {{ recCase.TestCaseID || recCase.TestKey || '(未命名)' }}</b>
          <span style="font-size:12px; margin-left:10px; color:#606266;">
            初始条件：{{ (recInitialParsed||[]).filter(s=>s.seq).length }}/{{ (recInitialParsed||[]).length || 0 }} 子步骤
            <span v-if="(recInitialParsed||[]).filter(s=>s.skipped && !s.seq).length > 0" style="color:#909399;">（跳过{{ (recInitialParsed||[]).filter(s=>s.skipped && !s.seq).length }}）</span>
            &nbsp;|&nbsp;
            操作步骤：{{ (recActionParsed||[]).filter(s=>s.seq).length }}/{{ (recActionParsed||[]).length || 0 }} 子步骤
            <span v-if="(recActionParsed||[]).filter(s=>s.skipped && !s.seq).length > 0" style="color:#909399;">（跳过{{ (recActionParsed||[]).filter(s=>s.skipped && !s.seq).length }}）</span>
          </span>
        </template>
      </el-alert>

      <!-- ====== 阶段1：初始条件 ====== -->
      <el-card v-if="recStep === 1" shadow="never" style="margin-bottom:12px;">
        <template #header>
          <div style="display:flex;justify-content:space-between;align-items:center; flex-wrap:wrap; gap:8px;">
            <b style="color:#409EFF;">
              📝 阶段 1 / 3：录制【初始条件】
              <span style="font-weight:normal; font-size:13px; margin-left:6px;">
                · 子步骤 {{ recCurrentInitialStep }} / {{ (recInitialParsed||[]).length || 1 }}
              </span>
            </b>
            <el-tag type="success" effect="plain">初始条件 文本</el-tag>
          </div>
        </template>

        <!-- 子步骤导航（可点击跳转） -->
        <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
          <el-tooltip
            v-for="(sub, idx) in (recInitialParsed || [])"
            :key="'init-step-' + idx"
            :content="sub.text"
            placement="top"
            :show-after="300"
          >
            <el-tag
              style="cursor:pointer; padding:4px 10px; font-size:13px;"
              :effect="(recCurrentInitialStep === sub.idx) ? 'dark' : 'plain'"
              :type="sub.seq ? 'success' : (sub.skipped ? 'info' : (recCurrentInitialStep === sub.idx ? 'primary' : 'info'))"
              @click="recJumpInitialStep(sub.idx)"
            >
              {{ sub.seq ? '✓ ' : (sub.skipped ? '⏭ ' : '') }}步骤{{ sub.idx }}
              <span v-if="sub.seq" style="margin-left:4px; font-size:11px; opacity:0.85;">
                ({{ sub.seq.total_steps }}步)
              </span>
              <span v-else-if="sub.skipped" style="margin-left:4px; font-size:11px; opacity:0.85;">
                (已跳过)
              </span>
            </el-tag>
          </el-tooltip>
        </div>

        <!-- 当前子步骤文本（高亮显示） -->
        <div style="background:#f5f7fa;padding:12px 16px;border-radius:6px;white-space:pre-wrap;font-size:13px;line-height:1.7;color:#303133;">
          <b style="color:#409EFF; margin-right:6px;">
            ▶ 子步骤{{ recCurrentInitialStep }}：
          </b>
          {{ (recInitialParsed || [])[recCurrentInitialStep - 1]?.text || '(无文本)' }}
        </div>

        <!-- 整段初始条件（折叠显示） -->
        <el-collapse style="margin-top:10px;">
          <el-collapse-item title="查看完整初始条件文本" name="full-init">
            <div style="white-space:pre-wrap; font-size:12px; line-height:1.7; color:#606266;">
              {{ recCase?.Initial_Condition || '(未填写初始条件)' }}
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <!-- ====== 阶段2：操作步骤 ====== -->
      <el-card v-if="recStep === 2" shadow="never" style="margin-bottom:12px;">
        <template #header>
          <div style="display:flex;justify-content:space-between;align-items:center; flex-wrap:wrap; gap:8px;">
            <b style="color:#E6A23C;">
              📝 阶段 2 / 3：录制【操作步骤】
              <span style="font-weight:normal; font-size:13px; margin-left:6px;">
                · 子步骤 {{ recCurrentActionStep }} / {{ (recActionParsed||[]).length || 1 }}
              </span>
            </b>
            <el-tag type="warning" effect="plain">操作步骤 文本</el-tag>
          </div>
        </template>

        <!-- 子步骤导航（可点击跳转） -->
        <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
          <el-tooltip
            v-for="(sub, idx) in (recActionParsed || [])"
            :key="'act-step-' + idx"
            :content="sub.text"
            placement="top"
            :show-after="300"
          >
            <el-tag
              style="cursor:pointer; padding:4px 10px; font-size:13px;"
              :effect="(recCurrentActionStep === sub.idx) ? 'dark' : 'plain'"
              :type="sub.seq ? 'success' : (sub.skipped ? 'info' : (recCurrentActionStep === sub.idx ? 'warning' : 'info'))"
              @click="recJumpActionStep(sub.idx)"
            >
              {{ sub.seq ? '✓ ' : (sub.skipped ? '⏭ ' : '') }}步骤{{ sub.idx }}
              <span v-if="sub.seq" style="margin-left:4px; font-size:11px; opacity:0.85;">
                ({{ sub.seq.total_steps }}步)
              </span>
              <span v-else-if="sub.skipped" style="margin-left:4px; font-size:11px; opacity:0.85;">
                (已跳过)
              </span>
            </el-tag>
          </el-tooltip>
        </div>

        <!-- 当前子步骤文本（高亮显示） -->
        <div style="background:#fdf6ec;padding:12px 16px;border-radius:6px;white-space:pre-wrap;font-size:13px;line-height:1.7;color:#303133;">
          <b style="color:#E6A23C; margin-right:6px;">
            ▶ 子步骤{{ recCurrentActionStep }}：
          </b>
          {{ (recActionParsed || [])[recCurrentActionStep - 1]?.text || '(无文本)' }}
        </div>

        <!-- 整段操作步骤（折叠显示） -->
        <el-collapse style="margin-top:10px;">
          <el-collapse-item title="查看完整操作步骤文本" name="full-action">
            <div style="white-space:pre-wrap; font-size:12px; line-height:1.7; color:#606266;">
              {{ recCase?.Action || '(未填写操作步骤)' }}
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <!-- ====== 阶段3：预期结果（二选一） ====== -->
      <el-card v-if="recStep === 3" shadow="never" style="margin-bottom:12px;">
        <template #header>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <b style="color:#67C23A;">🔍 阶段 3 / 3：请人工核对【预期结果】</b>
            <el-tag type="success" effect="plain">预期结果 文本</el-tag>
          </div>
        </template>
        <div style="background:#f0f9eb;padding:12px 16px;border-radius:6px;white-space:pre-wrap;font-size:13px;line-height:1.7;color:#303133;">
          {{ recCase?.Expected_Result || '(未填写预期结果)' }}
        </div>
        <el-alert v-if="recRebooting" type="warning" :closable="false" show-icon style="margin-top:14px;">
          <template #title>
            🔄 车机重启中… 剩余 {{ recRebootCountdown }}s
            <span v-if="recRebootResult" style="margin-left:10px; font-size:12px;">（{{ recRebootResult }}）</span>
          </template>
          <el-progress :percentage="Math.max(0, Math.min(100, 100 - recRebootCountdown*100/90))" :stroke-width="10" />
        </el-alert>
      </el-card>

      <!-- ====== 画面区域（阶段1/阶段2可操作；阶段3只读显示用于核对预期结果） ====== -->
      <div style="margin-bottom:12px;">
        <div style="display:flex; justify-content:center; background:#111; padding:10px; border-radius:6px;">
          <div ref="recWrap" style="position:relative; line-height:0;">
            <img ref="recImg" :src="recVideoSrc" crossorigin
                 style="width:100%; height:100%; object-fit:contain; background:#000;"
                 @load="recOnImgLoaded" />
            <div v-if="recStep !== 3" ref="recEvLayer" style="position:absolute; inset:0; z-index:2; width:100%; height:100%;"
                 @mousedown="recOnMouseDown" @mouseup="recOnMouseUp" @mousemove="recOnMouseMove" @mouseleave="recOnMouseUp"></div>
            <canvas ref="recCanvas" style="position:absolute; inset:0; z-index:3; pointer-events:none; width:100%; height:100%;"></canvas>
          </div>
        </div>
        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:10px; justify-content:center;">
          <template v-if="recStep !== 3">
            <el-tag type="info" effect="plain">💡 点击画面 = TAP；按住拖拽 = SWIPE</el-tag>
            <el-button size="small" @click="recSendKey('KEYCODE_HOME', 'HOME')">🏠 HOME</el-button>
            <el-button size="small" @click="recSendKey('KEYCODE_BACK', 'BACK')">⬅ BACK</el-button>
            <el-button size="small" @click="recSendKey('KEYCODE_ENTER', 'ENTER')">⤴ ENTER</el-button>
            <el-button size="small" @click="recSendKey('KEYCODE_VOLUME_UP', 'VOL+')">🔊 VOL+</el-button>
            <el-button size="small" @click="recSendKey('KEYCODE_VOLUME_DOWN', 'VOL-')">🔉 VOL-</el-button>
          </template>
          <template v-else>
            <el-tag type="success" effect="plain">💡 仅用于观察画面，核对预期结果是否正确</el-tag>
          </template>
          <el-button size="small" :loading="recIsSending" @click="recReloadVideo">🔄 刷新画面</el-button>
        </div>
      </div>

      <!-- ====== 操作日志表（阶段1/阶段2显示，阶段3不显示） ====== -->
      <el-card v-if="recStep !== 3" shadow="never" style="margin-bottom:12px;">
        <template #header>
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
              <b>📋 ADB 操作日志</b>
              <el-tag size="small" type="primary">共 {{ recLogs.length }} 条</el-tag>
              <el-tag v-if="recLogs.length" size="small" type="success" effect="plain">
                ✅ 成功 {{ recLogs.filter(l=>l.success).length }}
              </el-tag>
              <el-tag v-if="recLogs.some(l=>!l.success)" size="small" type="danger" effect="plain">
                ⚠️ 失败 {{ recLogs.filter(l=>!l.success).length }}
              </el-tag>
            </div>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <el-button size="small" type="danger" plain @click="recClearLogs" :disabled="!recLogs.length">🗑 清空日志</el-button>
              <el-button size="small" @click="recToggleSelectAll" :disabled="!recLogs.length">
                {{ recLogsAllSelected ? '☑ 取消全选' : '☑ 全选' }}
              </el-button>
              <el-tag size="small" type="warning" v-if="recLogsSelected.length">选中 {{ recLogsSelected.length }} 条（保存时按时间升序，默认全量）</el-tag>
            </div>
          </div>
        </template>

        <el-table ref="recLogsTableRef" :data="recLogs" size="small" border stripe max-height="240"
                  @selection-change="recOnSelectionChange" row-key="id">
          <el-table-column type="selection" width="42" align="center" reserve-selection />
          <el-table-column type="index" label="#" width="48" align="center" />
          <el-table-column prop="tsStr" label="时间" width="82" align="center" />
          <el-table-column label="类型" width="72" align="center">
            <template #default="scope">
              <el-tag size="small" :type="scope.row.success ? 'success' : 'danger'" effect="dark">
                {{ scope.row.success ? '' : '⚠️ ' }}{{ scope.row.type }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作详情" min-width="280">
            <template #default="scope">
              <div style="line-height:1.5;">
                <b v-if="scope.row.type==='TAP'">{{ scope.row.x }}, {{ scope.row.y }}</b>
                <b v-else-if="scope.row.type==='SWIPE'">{{ scope.row.x1 }},{{ scope.row.y1 }} → {{ scope.row.x2 }},{{ scope.row.y2 }}
                  <span style="font-weight:normal;color:#909399; margin-left:6px;">
                    [{{ scope.row.duration }}ms]
                  </span>
                </b>
                <b v-else-if="scope.row.type==='KEY'">{{ scope.row.keyName }}
                  <span style="font-weight:normal;color:#909399; margin-left:6px;">(keycode: {{ scope.row.keyCode }})</span>
                </b>
                <div style="font-size:11px; color:#909399; margin-top:4px; font-family:Consolas,Monospace; word-break:break-all;">
                  $ adb {{ scope.row.cmd }}
                </div>
                <div v-if="!scope.row.success && scope.row.msg" style="color:#F56C6C; font-size:11px; margin-top:2px;">
                  ❌ {{ scope.row.msg }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" align="center" fixed="right">
            <template #default="scope">
              <el-button type="danger" link size="small" @click="recDeleteLogAt(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- ====== 阶段底部按钮区 ====== -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:14px; padding-top:12px; border-top:1px dashed #ebeef5;">

        <!-- 阶段1：初始条件 - 支持子步骤切换 -->
        <div v-if="recStep === 1" style="width:100%; display:flex; justify-content:space-between;">
          <div style="display:flex; gap:10px;">
            <el-button @click="recDialogVisible = false">取消录制</el-button>
            <el-button
              type="info"
              plain
              :disabled="recCurrentInitialStep <= 1"
              @click="recPrevInitialStep"
            >
              ← 上一子步骤
            </el-button>
          </div>
          <div style="display:flex; gap:10px;">
            <el-button type="warning" plain :disabled="!recLogs.length" @click="recClearLogs">🗑 清空本步日志</el-button>
            <el-button
              type="info"
              plain
              :disabled="recIsSending || recSubmitting"
              :loading="recSubmitting"
              @click="recSkipInitial"
            >
              <template v-if="recCurrentInitialStep < (recInitialParsed||[]).length">
                ⏭ 跳过子步骤{{ recCurrentInitialStep }} → 下一步
              </template>
              <template v-else>
                ⏭ 跳过并完成初始条件 → 进入操作步骤
              </template>
            </el-button>
            <el-button
              type="primary"
              :disabled="!recLogs.length || recIsSending || recSubmitting"
              :loading="recSubmitting"
              @click="recSaveInitial"
            >
              <template v-if="recSubmitting">
                上传中…
              </template>
              <template v-else-if="recCurrentInitialStep < (recInitialParsed||[]).length">
                ✅ 保存子步骤{{ recCurrentInitialStep }} → 下一步
              </template>
              <template v-else>
                ✅ 完成初始条件（{{ (recInitialParsed||[]).length }}/{{ (recInitialParsed||[]).length }}）→ 进入操作步骤
              </template>
            </el-button>
          </div>
        </div>

        <!-- 阶段2：操作步骤 - 支持子步骤切换 -->
        <div v-else-if="recStep === 2" style="width:100%; display:flex; justify-content:space-between;">
          <div style="display:flex; gap:10px;">
            <el-button @click="recDialogVisible = false">取消录制</el-button>
            <template v-if="recCurrentActionStep > 1">
              <el-button
                type="info"
                plain
                @click="recPrevActionStep"
              >
                ← 上一子步骤
              </el-button>
            </template>
            <template v-else>
              <el-button type="info" plain @click="recBackTo(1)">← 返回初始条件</el-button>
            </template>
          </div>
          <div style="display:flex; gap:10px;">
            <el-button type="warning" plain :disabled="!recLogs.length" @click="recClearLogs">🗑 清空本步日志</el-button>
            <el-button
              type="info"
              plain
              :disabled="recIsSending || recSubmitting"
              :loading="recSubmitting"
              @click="recSkipAction"
            >
              <template v-if="recCurrentActionStep < (recActionParsed||[]).length">
                ⏭ 跳过子步骤{{ recCurrentActionStep }} → 下一步
              </template>
              <template v-else>
                ⏭ 跳过并完成操作步骤 → 进入预期结果
              </template>
            </el-button>
            <el-button
              type="primary"
              :disabled="!recLogs.length || recIsSending || recSubmitting"
              :loading="recSubmitting"
              @click="recSaveAction"
            >
              <template v-if="recSubmitting">
                上传中…
              </template>
              <template v-else-if="recCurrentActionStep < (recActionParsed||[]).length">
                ✅ 保存子步骤{{ recCurrentActionStep }} → 下一步
              </template>
              <template v-else>
                ✅ 完成操作步骤（{{ (recActionParsed||[]).length }}/{{ (recActionParsed||[]).length }}）→ 进入预期结果
              </template>
            </el-button>
          </div>
        </div>

        <!-- 阶段3：预期结果二选一 -->
        <div v-else-if="recStep === 3" style="width:100%; display:flex; justify-content:space-between;">
          <div>
            <el-button @click="recDialogVisible = false">取消</el-button>
            <el-button type="info" plain :disabled="recRebooting || recSubmitting" @click="recBackTo(2)">← 重录操作步骤</el-button>
          </div>
          <div style="display:flex; gap:14px;">
            <el-button type="danger" size="large" :disabled="recRebooting || recSubmitting" :loading="recSubmitting" @click="recExpectedWrong">
              🔴 预期结果错误，重新操作（ADB Reboot）
            </el-button>
            <el-button type="success" size="large" :disabled="recRebooting || recSubmitting" :loading="recSubmitting" @click="recExpectedCorrect">
              🟢 预期结果正确，保存录制（上传后台）
            </el-button>
          </div>
        </div>

      </div>
    </el-dialog>

    <!-- 知识图谱弹窗组件 -->
    <el-dialog v-model="generateKnowledgeGraphDialogVisible" title="知识图谱" width="50%">
      <el-form label-width="150px">
        <el-form-item label="测试项目地址">
          <el-input v-model="baseurl" placeholder="请输入测试项目地址"></el-input>
        </el-form-item>
        <el-form-item label="测试设备序列号">
          <el-input
            v-model="serial"
            placeholder="请输入测试设备序列号"
            :default-value="''"
          ></el-input>
        </el-form-item>
        <el-form-item label="测试应用包名">
          <el-input
            v-model="packageName"
            placeholder="请输入测试应用包名"
            :default-value="'com.desaysv.setting'"
          ></el-input>
        </el-form-item>
        <el-form-item label="主导航栏id">
          <el-input
            v-model="resourceid"
            placeholder="请输入主导航栏id"
            :default-value="'com.desaysv.setting:id/layout_navigation'"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="generateKnowledgeGraphDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="sendGenerateKnowledgeGraphRequest"
            >发送请求</el-button
          >
        </span>
      </template>
    </el-dialog>

    <!-- 知识图谱形成日志弹窗组件 -->
    <el-dialog
      v-model="generateKnowledgeGraphLogDiagVisible"
      title="知识图谱日志"
      width="50%"
    >
      <el-tabs v-model="logActiveTab" type="card" label-width="150px">
        <el-tab-pane label="日志" name="logs">
          <pre style="text-align: left">{{ generateKnowledgeGraphLog.logs }}</pre>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="generateKnowledgeGraphLogDiagVisible = false"
            >取消</el-button
          >
        </span>
      </template>
    </el-dialog>

    <!-- 查看测试日志的弹窗组件 -->
    <el-dialog v-model="logDialogVisible" title="测试日志详情" width="70%">
      <el-tabs v-model="logActiveTab" type="card">
        <el-tab-pane v-if="logDetails.logs" label="日志" name="logs">
          <!-- 字面 
 转真实换行 + 长行自动折行（工具结果文本经 str() 转义，
 是字面量） -->
          <pre
            style="text-align: left; white-space: pre-wrap; word-break: break-all"
            >{{ formatLogText(logDetails.logs) }}</pre
          >
        </el-tab-pane>
        <el-tab-pane v-if="logDetails.code_files" label="Python代码" name="python">
          <el-collapse v-model="activeCodeFile">
            <el-collapse-item
              v-for="(codeFile, index) in logDetails.code_files"
              :key="index"
              :title="codeFile.filename"
            >
              <pre>{{ codeFile.content }}</pre>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
        <el-tab-pane
          v-if="logDetails.ignition_logs"
          label="python执行日志"
          name="ignition_logs"
        >
          <pre style="text-align: left">{{ logDetails.ignition_logs }}</pre>
        </el-tab-pane>
        <el-tab-pane v-if="logDetails.images" label="测试图片" name="images">
          <!-- 测试图片：列表只带 filename（无 base64），展开下拉时才懒加载单张图 -->
          <el-collapse v-model="activeImageFile" @change="handleImageExpand">
            <el-collapse-item
              v-for="(image, index) in logDetails.images"
              :key="index"
              :title="image.filename"
              :name="image.filename"
            >
              <div v-if="image.loading" style="padding:8px 0;">加载中...</div>
              <el-alert v-else-if="image.error" :title="image.error" type="error" :closable="false" />
              <el-image
                v-else-if="image.url"
                :src="image.url"
                :preview-src-list="[image.url]"
                fit="contain"
                style="width: 100%; margin-bottom: 10px"
              />
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
        <el-tab-pane v-if="logDetails.json_files" label="图片检出位置" name="json">
          <el-collapse v-model="activeCodeFile">
            <el-collapse-item
              v-for="(file, index) in logDetails.json_files"
              :key="index"
              :title="file.filename"
            >
              <pre>{{ file.content }}</pre>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <el-dialog v-model="selectRowsdialogVisible" title="选择测试用例" width="320px">
      <!-- 工作表选择 -->
      <div style="margin-bottom: 12px">选择工作表</div>
      <el-select
        v-model="selectedSheet"
        placeholder="请选择工作表"
        style="width: 100%; margin-bottom: 12px"
        @change="handleSheetChange"
      >
        <el-option
          v-for="sheet in casesTable"
          :key="sheet.sheetName"
          :label="`${sheet.sheetName} (${sheet.length} 条)`"
          :value="sheet.sheetName"
        />
      </el-select>
      <!-- 起始 -->
      <div style="margin-bottom: 12px">起始 ID</div>
      <el-select-v2
        v-model="startId"
        :options="caseIdOptions"
        filterable
        clearable
        style="width: 100%"
      />
      <!-- 结束 -->
      <div style="margin: 12px 0">结束 ID</div>
      <el-select-v2
        v-model="endId"
        :options="caseIdOptions"
        filterable
        clearable
        style="width: 100%"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="selectRowsdialogVisible = false">取消</el-button>
          <el-button type="primary" @click="selectRowsHandle">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="ActualResultDialogVisible" title="实车结果（AI 判定依据）" width="70%">
      <el-tabs
        v-model="ActualResultActiveTab"
        type="card"
        style="display: flex; justify-content: center; align-items: center; height: 100%"
      >
        <img
          :src="'data:image/png;base64,' + ActualResultDetails.images"
          style="width: 800px; height: 800px; margin-bottom: 10px"
        />
      </el-tabs>
      <!-- 裁剪取部位日志：语义匹配命中的识别项与相似度（供 video-processor 开发排查） -->
      <div v-if="ActualResultDetails.matchedClasses.length" style="margin-top: 10px">
        <div style="font-weight: bold; margin-bottom: 6px">裁剪取部位日志（语义匹配命中的识别项）：</div>
        <el-table :data="ActualResultDetails.matchedClasses.map((c, i) => ({ class: c, similarity: ActualResultDetails.similarities[i] }))" size="small" border>
          <el-table-column prop="class" label="命中识别项 (class)" />
          <el-table-column label="语义相似度">
            <template #default="scope">{{ (scope.row.similarity ?? 0).toFixed(4) }}</template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 上传测试记录弹窗 -->
    <el-dialog v-model="uploadRecordDialogVisible" title="上传测试记录" width="600px">
      <el-form
        :model="uploadForm"
        label-width="120px"
        ref="uploadFormRef"
        :rules="uploadRules"
      >
        <el-alert
          type="info"
          :closable="false"
          style="margin-bottom: 20px"
          show-icon
        >
          <template #title>
            <div style="display: flex; gap: 20px">
              <span>总用例数: {{ uploadForm.totalCases }}</span>
              <span style="color: #67c23a">通过数: {{ uploadForm.passedCases }}</span>
              <span style="color: #f56c6c">失败数: {{ uploadForm.failedCases }}</span>
            </div>
          </template>
        </el-alert>

        <el-form-item label="名称" prop="name">
          <el-input v-model="uploadForm.name" placeholder="请输入测试名称" disabled />
        </el-form-item>

        <el-form-item label="测试类型" prop="type">
          <el-input v-model="uploadForm.type" placeholder="例如：稳定测试" />
        </el-form-item>

        <el-form-item label="测试结果" prop="result">
          <el-select v-model="uploadForm.result" style="width: 100%">
            <el-option label="通过" value="通过" />
            <el-option label="失败" value="失败" />
          </el-select>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker
                v-model="uploadForm.startTime"
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker
                v-model="uploadForm.endTime"
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="项目ID" prop="projectId">
          <el-input v-model="uploadForm.projectId" disabled />
        </el-form-item>

        <el-form-item label="用户UID" prop="uid">
          <el-input v-model="uploadForm.uid" disabled />
        </el-form-item>

        <el-collapse>
          <el-collapse-item title="更多信息 (非必填)">
            <el-form-item label="英文名称" prop="nickname">
              <el-input v-model="uploadForm.nickname" />
            </el-form-item>
            <el-form-item label="持续时间(天)" prop="duration">
              <el-input-number
                v-model="uploadForm.duration"
                :precision="6"
                :step="0.0001"
                style="width: 100%"
              />
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="QNX版本" prop="qnxVersion">
                  <el-input v-model="uploadForm.qnxVersion" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="SOC版本" prop="socVersion">
                  <el-input v-model="uploadForm.socVersion" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="MCU版本" prop="mcuVersion">
                  <el-input v-model="uploadForm.mcuVersion" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="模块名称" prop="moduleName">
                  <el-input v-model="uploadForm.moduleName" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="缺陷数量" prop="bugCount">
              <el-input-number v-model="uploadForm.bugCount" :min="0" />
            </el-form-item>
            <el-form-item label="主机名" prop="hostname">
              <el-input v-model="uploadForm.hostname" />
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="uploadRecordDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="submitUpload"
            :loading="isUploading"
          >
            发送
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="mobileAgentConfirmVisible"
      title="请审批 Mobile-Agent 候选点击"
      width="76%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="true"
      :before-close="closeMobileAgentConfirmation"
      append-to-body
    >
      <div v-if="mobileAgentConfirmation" class="mobile-agent-confirmation">
        <el-alert
          type="warning"
          :closable="false"
          show-icon
          :title="mobileAgentConfirmation.question"
        />
        <div class="mobile-agent-confirm-meta">
          <span class="mobile-agent-current-purpose">
            <strong>模型当前目的：</strong>{{ mobileAgentConfirmation.current_purpose || "模型未说明当前目的" }}
          </span>
          <span><strong>完整测试任务：</strong>{{ mobileAgentConfirmation.goal }}</span>
          <span v-if="!['question', 'interaction'].includes(mobileAgentConfirmation.source)"><strong>点击坐标：</strong>{{ mobileAgentConfirmation.coordinate }}</span>
        </div>
        <el-alert
          v-if="mobileAgentConfirmation.source === 'interaction'"
          :title="mobileAgentConfirmation.question || 'Mobile-Agent 需要用户提供下一步操作'"
          type="warning"
          :closable="false"
          show-icon
          class="mb-3"
        />
        <div v-if="mobileAgentConfirmation.source === 'interaction'" class="mobile-agent-interaction-image">
          <div class="mobile-agent-image-title">当前页面截图（点击可放大）</div>
          <el-image
            :src="mobileAgentConfirmation.screenshot_before_url"
            :preview-src-list="[mobileAgentConfirmation.screenshot_before_url]"
            fit="contain"
            class="mobile-agent-confirm-image mobile-agent-interaction-screenshot"
          />
        </div>
        <el-row v-if="mobileAgentConfirmation.source !== 'interaction'" :gutter="16" class="mobile-agent-confirm-images">
          <el-col :span="12">
            <div class="mobile-agent-image-title">当前截图</div>
            <el-image
              :src="mobileAgentConfirmation.screenshot_before_url"
              :preview-src-list="[mobileAgentConfirmation.screenshot_before_url]"
              fit="contain"
              class="mobile-agent-confirm-image"
            />
          </el-col>
          <el-col :span="12">
            <div class="mobile-agent-image-title">
              {{ mobileAgentConfirmation.source === "history" ? "历史位置（尚未点击）" : "模型候选位置（尚未点击）" }}
            </div>
            <div class="mobile-agent-correction-canvas">
              <img
                :src="mobileAgentCorrectionMode ? mobileAgentConfirmation.screenshot_before_url : mobileAgentConfirmation.screenshot_after_url"
                class="mobile-agent-confirm-image mobile-agent-clickable-image"
                @click="selectMobileAgentCoordinate"
              />
              <span
                v-if="mobileAgentCorrectionMode && mobileAgentCorrectedCoordinate"
                class="mobile-agent-correction-marker"
                :style="mobileAgentCorrectionMarkerStyle"
              />
            </div>
          </el-col>
        </el-row>
        <el-form label-position="top">
          <el-form-item
            v-if="mobileAgentConfirmation.source === 'question'"
            label="请选择一个准备执行的操作；也可以全部不选"
          >
            <el-radio-group v-model="mobileAgentSelectedCandidate" class="mobile-agent-candidate-list">
              <el-radio
                v-for="(candidate, index) in mobileAgentConfirmation.candidates || []"
                :key="index"
                :value="index"
                border
              >
                候选 {{ index + 1 }}：{{ candidate.label }}
                （{{ candidate.action === 'swipe' ? `滑动 ${candidate.coordinate} → ${candidate.coordinate2}` : `点击 ${candidate.coordinate}` }}）
              </el-radio>
              <el-radio :value="-1" border>全部不选，拒绝这些候选</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-else-if="mobileAgentConfirmation.source !== 'interaction'" label="红框位置是否正确，是否允许执行点击？">
            <el-radio-group v-model="mobileAgentConfirmSuccess">
              <el-radio-button :value="true">位置正确，执行点击</el-radio-button>
              <el-radio-button :value="false">位置错误，不要点击</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="!['question', 'interaction'].includes(mobileAgentConfirmation.source)">
            <el-button
              :type="mobileAgentCorrectionMode ? 'warning' : 'default'"
              @click="mobileAgentCorrectionMode = !mobileAgentCorrectionMode"
            >
              {{ mobileAgentCorrectionMode ? "请直接点击右侧图片选择正确位置" : "纠错并重新定义位置" }}
            </el-button>
            <span v-if="mobileAgentCorrectedCoordinate" class="mobile-agent-corrected-coordinate">
              新坐标：{{ mobileAgentCorrectedCoordinate }}
            </span>
          </el-form-item>
          <el-form-item v-if="!['question', 'interaction'].includes(mobileAgentConfirmation.source) && mobileAgentConfirmSuccess">
            <span>步骤是否完成由 Mobile-Agent 根据执行结果自动判断；用户只需确认或纠正点击位置。</span>
          </el-form-item>
          <el-form-item :label="mobileAgentConfirmation.source === 'interaction' ? '请描述下一步具体操作' : mobileAgentConfirmation.source === 'question' ? '补充说明（全部不选时必填）' : '拒绝时请说明正确图标的外观或位置'">
            <el-input
              v-model="mobileAgentConfirmDescription"
              type="textarea"
              :rows="3"
              placeholder="例如：正确按钮在底部导航栏，是地图图标右侧的彩色四宫格"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button
          type="danger"
          plain
          :loading="mobileAgentConfirmSubmitting"
          @click="closeMobileAgentConfirmation"
        >
          关闭并终止本次测试
        </el-button>
        <el-button
          type="primary"
          :loading="mobileAgentConfirmSubmitting"
          @click="submitMobileAgentConfirmation"
        >
          提交审批
        </el-button>
      </template>
    </el-dialog>
    <!-- 底部栏 -->
  </div>
</template>

<script>
import {
  ref,
  reactive,
  computed,
  onMounted,
  onUnmounted,
  nextTick,
  getCurrentInstance,
  watch,
} from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Buffer } from "buffer";
import reportTpl from "./report-template.html?raw";
import langOptionsJson from "./langOptions.json";
import { saveCases, saveCasesTable, loadCases, loadCasesTable } from "../utils/db.js";
import { forEach } from "lodash";
import { Loading } from "@element-plus/icons-vue";

window.Buffer = Buffer;
export default {
  components: {},
  setup() {
    const router = useRouter();
    // 本次登录的项目 *重要*
    const model_name = ref("");

    const currentUserInfo = ref(null);
    const currentProject = ref(null);

    // 核心状态变量
    const isAutoPolling = ref(true);
    const currentTask = ref(null);
    const isProcessingTask = ref(false);
    const isDebugRunning = ref(false);
    const currentExecutingId = ref("");
    const pollingIntervals = {};
    let pollingInterval = null;

    // Mobile-Agent 点击前人工审批
    const mobileAgentConfirmVisible = ref(false);
    const mobileAgentConfirmation = ref(null);
    const mobileAgentConfirmSuccess = ref(true);
    const mobileAgentConfirmDescription = ref("");
    const mobileAgentCorrectionMode = ref(false);
    const mobileAgentCorrectedCoordinate = ref(null);
    const mobileAgentStepCompleted = ref(false);
    const mobileAgentSelectedCandidate = ref(null);
    const mobileAgentConfirmSubmitting = ref(false);
    const displayedMobileAgentConfirmations = new Set();
    const displayedMobileAgentEvents = new Set();
    const displayedMobileAgentOutputs = new Set();
    // Mobile-Agent 事件必须按测试会话写回启动它的用例行，不能使用当前选中行。
    // 否则并行或前后相邻的测试会把不同 test_id 的日志拼在一起。
    const mobileAgentSessionCaseIds = new Map();
    const mobileAgentLastEventTimes = new Map();
    let mobileAgentConfirmPolling = null;
    let mobileAgentConfirmationFetching = false;
    let mobileAgentPollEmptyCount = 0;
    const MOBILE_AGENT_POLL_BASE_MS = 3000;
    const MOBILE_AGENT_POLL_MAX_MS = 15000;
    const MOBILE_AGENT_POLL_INTERVAL_MS = MOBILE_AGENT_POLL_BASE_MS; // kept for reference

    const activeMobileAgentTestIds = () => {
      const ids = new Set();
      const currentId = currentTestId.value?.trim();
      const confirmingId = mobileAgentConfirmation.value?.test_id?.trim();
      if (currentId) ids.add(currentId);
      if (confirmingId) ids.add(confirmingId);
      // currentTestId 有时未同步（SSE 时序/刷新后丢失），用 sessionCaseIds 的 key（真实
      // test_id，L5463 设置）兜底，确保事件流与审批轮询始终能拉到活跃会话。
      for (const key of mobileAgentSessionCaseIds.keys()) {
        const k = String(key || "").trim();
        if (k) ids.add(k);
      }
      return Array.from(ids);
    };

    const cleanupMobileAgentSession = (testId) => {
      const normalizedId = testId?.trim();
      if (!normalizedId) return;
      mobileAgentSessionCaseIds.delete(normalizedId);
      mobileAgentLastEventTimes.delete(normalizedId);
      if (currentTestId.value === normalizedId) currentTestId.value = "";
    };

    const appendMobileAgentExecutionLog = (message, testId = "", imageId = "") => {
      const caseId = testId
        ? (mobileAgentSessionCaseIds.get(testId) || currentExecutingId.value || selectedCase.value)
        : (selectedCase.value || currentExecutingId.value);
      if (!caseId || !message) return;
      if (!executionLogs.value[caseId]) executionLogs.value[caseId] = [];
      executionLogs.value[caseId].push({
        log_id: executionLogs.value[caseId].length + 1,
        time: new Date().toLocaleString("zh-CN", {
          hour12: false,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).replace(/\//g, "-"),
        message,
        imageId,
        testId,
        imageUrl: "",
        imageLoading: false,
        imageError: "",
      });
    };

    const handleStepScreenshotExpand = async (row, names) => {
      const expanded = Array.isArray(names) ? names.includes("image") : names === "image";
      if (!expanded) {
        if (row.imageUrl) URL.revokeObjectURL(row.imageUrl);
        row.imageUrl = "";
        return;
      }
      if (!row.imageId || row.imageUrl || row.imageLoading) return;
      row.imageLoading = true;
      row.imageError = "";
      try {
        const response = await fetch(
          `/dev-api/mobile-agent/events/${encodeURIComponent(row.imageId)}/image?test_id=${encodeURIComponent(row.testId || "")}`,
          { cache: "force-cache" }
        );
        if (!response.ok) throw new Error(`截图加载失败（${response.status}）`);
        row.imageUrl = URL.createObjectURL(await response.blob());
      } catch (error) {
        row.imageError = error.message || "截图加载失败";
      } finally {
        row.imageLoading = false;
      }
    };

    const fetchMobileAgentConfirmations = async () => {
      if (mobileAgentConfirmVisible.value || mobileAgentConfirmationFetching) return;
      mobileAgentConfirmationFetching = true;
      try {
        const testIds = activeMobileAgentTestIds();
      // 刷新页面后内存中的 test_id 映射会丢失。此时只恢复后端唯一的 pending
      // confirmation；若存在多个会话则不跨 session 猜测，仍等待明确 test_id。
      if (!testIds.length) {
        try {
          const response = await fetch(
            "/dev-api/mobile-agent/confirmations/pending",
            { cache: "no-store" }
          );
          if (!response.ok) return;
          const payload = await response.json();
          const allPending = payload?.data || [];
          const sessionIds = [...new Set(allPending.map((item) => item.test_id).filter(Boolean))];
          if (sessionIds.length !== 1) return;
          const restoredTestId = sessionIds[0];
          currentTestId.value = restoredTestId;
          testIds.push(restoredTestId);
        } catch (error) {
          console.debug("恢复 Mobile-Agent 确认会话失败", error);
          return;
        }
      }
      try {
        const responses = await Promise.all(testIds.map(async (testId) => {
          const response = await fetch(
            `/dev-api/mobile-agent/confirmations/pending?test_id=${encodeURIComponent(testId)}`,
            { cache: "no-store" }
          );
          if (!response.ok) return null;
          const payload = await response.json();
          return payload?.data?.[0] || null;
        }));
        const pending = responses.filter(Boolean).sort(
          (a, b) => Number(a.created_at || 0) - Number(b.created_at || 0)
        )[0];
        if (!pending) {
          // 无 pending：累加空结果计数，用于退避
          mobileAgentPollEmptyCount++;
          return;
        }
        // 有 pending：重置退避计数
        mobileAgentPollEmptyCount = 0;
        // 请求发出后弹窗可能已经打开；旧轮询响应不得覆盖用户正在编辑的表单。
        if (mobileAgentConfirmVisible.value) return;
        const testId = pending.test_id;
        if (pending.test_id !== testId) return;
        if (!displayedMobileAgentConfirmations.has(pending.confirmation_id)) {
          displayedMobileAgentConfirmations.add(pending.confirmation_id);
          const sourceText = pending.source === "history"
            ? `命中历史坐标 ${pending.coordinate}`
            : pending.source === "interaction"
            ? "模型请求用户指导"
            : `模型候选坐标 ${pending.coordinate}`;
          const output = pending.agent_output || "模型已生成点击动作";
          const outputKey = `${testId}:${output}`;
          if (!displayedMobileAgentOutputs.has(outputKey)) {
            displayedMobileAgentOutputs.add(outputKey);
            appendMobileAgentExecutionLog(`[Mobile-Agent 第${pending.step_id || "?"}步]\n${output}`, testId);
          }
          appendMobileAgentExecutionLog(`[Mobile-Agent 第${pending.step_id || "?"}步] ${sourceText}，等待用户审批`, testId);
        }
        const isNewConfirmation =
          mobileAgentConfirmation.value?.confirmation_id !== pending.confirmation_id;
        mobileAgentConfirmation.value = pending;
        // 同一审批的轮询刷新必须保留用户已选择的 radio 和补充说明。
        if (isNewConfirmation) {
          mobileAgentConfirmSuccess.value = pending.source !== "interaction";
          mobileAgentConfirmDescription.value = "";
          mobileAgentCorrectionMode.value = false;
          mobileAgentCorrectedCoordinate.value = null;
          mobileAgentStepCompleted.value = false;
          mobileAgentSelectedCandidate.value = pending.source === "question" ? null : 0;
        }
        mobileAgentConfirmVisible.value = true;
      } catch (error) {
        console.debug("轮询 Mobile-Agent 确认任务失败", error);
      }
      } finally {
        mobileAgentConfirmationFetching = false;
      }
    };

    const fetchMobileAgentEvents = async () => {
      const testIds = activeMobileAgentTestIds();
      if (!testIds.length) return;
      try {
        for (const testId of testIds) {
          const since = mobileAgentLastEventTimes.get(testId) || (Date.now() / 1000 - 5);
          const response = await fetch(
            `/dev-api/mobile-agent/events?since=${encodeURIComponent(since)}&limit=100&test_id=${encodeURIComponent(testId)}`,
            { cache: "no-store" }
          );
          if (!response.ok) continue;
          const payload = await response.json();
          for (const event of payload?.data || []) {
          if (event.test_id !== testId) continue;
          mobileAgentLastEventTimes.set(
            testId,
            Math.max(
              mobileAgentLastEventTimes.get(testId) || 0,
              Number(event.created_at || 0)
            )
          );
          if (displayedMobileAgentEvents.has(event.event_id)) continue;
          displayedMobileAgentEvents.add(event.event_id);
          const output = event.agent_output || "模型已生成动作";
          const outputKey = `${testId}:${output}`;
          const status = event.status || "candidate";
          if (status === "candidate") {
            if (displayedMobileAgentOutputs.has(outputKey)) continue;
            displayedMobileAgentOutputs.add(outputKey);
          }
          const statusText = status === "executed"
            ? "ADB 已执行"
            : status === "blocked"
            ? "执行器已拦截"
            : status === "completed"
            ? "阶段完成"
            : "模型候选";
          const eventPrefix = status === "completed"
            ? `[安卓执行阶段][${statusText}]`
            : `[Mobile-Agent 第${event.step_id || "?"}步][${statusText}]`;
          appendMobileAgentExecutionLog(
            `${eventPrefix}${event.exploration_mode === "exploration" ? "[探索模式]" : ""}\n${output}`,
            testId,
            event.image_id || ""
          );
          }
        }
      } catch (error) {
        console.debug("轮询 Mobile-Agent 输出失败", error);
      }
    };

    const selectMobileAgentCoordinate = (event) => {
      if (!mobileAgentCorrectionMode.value) return;
      const image = event.currentTarget;
      const rect = image.getBoundingClientRect();
      if (!rect.width || !rect.height || !image.naturalWidth || !image.naturalHeight) return;
      const x = Math.round((event.clientX - rect.left) * image.naturalWidth / rect.width);
      const y = Math.round((event.clientY - rect.top) * image.naturalHeight / rect.height);
      mobileAgentCorrectedCoordinate.value = [x, y];
      mobileAgentConfirmSuccess.value = true;
    };

    const mobileAgentCorrectionMarkerStyle = computed(() => {
      const coordinate = mobileAgentCorrectedCoordinate.value;
      const confirmation = mobileAgentConfirmation.value;
      if (!coordinate || !confirmation) return {};
      return {
        left: `${coordinate[0] / confirmation.image_width * 100}%`,
        top: `${coordinate[1] / confirmation.image_height * 100}%`,
      };
    });

    const submitMobileAgentConfirmation = async () => {
      const confirmation = mobileAgentConfirmation.value;
      if (!confirmation || mobileAgentConfirmSubmitting.value) return;
      const confirmationTestId = confirmation.test_id?.trim();
      if (!confirmationTestId) return;
      if (mobileAgentCorrectionMode.value && !mobileAgentCorrectedCoordinate.value) {
        ElMessage.warning("请在右侧图片上点击正确位置");
        return;
      }
      const isQuestion = confirmation.source === "question";
      const isInteraction = confirmation.source === "interaction";
      if (isInteraction && !mobileAgentConfirmDescription.value.trim()) {
        ElMessage.warning("请描述 Mobile-Agent 下一步应执行的具体操作");
        return;
      }
      if (isQuestion && mobileAgentSelectedCandidate.value === null) {
        ElMessage.warning("请选择一个候选操作，或选择全部不选");
        return;
      }
      if (isQuestion && mobileAgentSelectedCandidate.value === -1 && !mobileAgentConfirmDescription.value.trim()) {
        ElMessage.warning("全部不选时请说明模型下一步应该怎么做");
        return;
      }
      if (!isInteraction && !mobileAgentConfirmSuccess.value && !mobileAgentConfirmDescription.value.trim()) {
        ElMessage.warning("拒绝时请补充正确图标的外观或位置");
        return;
      }
      mobileAgentConfirmSubmitting.value = true;
      try {
        const response = await fetch(
          `/dev-api/mobile-agent/confirmations/${encodeURIComponent(confirmation.confirmation_id)}/respond`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              test_id: confirmationTestId,
              success: isInteraction ? false : isQuestion ? mobileAgentSelectedCandidate.value >= 0 : mobileAgentConfirmSuccess.value,
              description: mobileAgentConfirmDescription.value.trim(),
              coordinate: mobileAgentCorrectedCoordinate.value,
              step_completed: false,
              selected_index: isQuestion && mobileAgentSelectedCandidate.value >= 0
                ? mobileAgentSelectedCandidate.value
                : null,
            }),
          }
        );
        if (!response.ok) {
          const message = await response.text();
          throw new Error(message || `HTTP ${response.status}`);
        }
        ElMessage.success(
          (isQuestion ? mobileAgentSelectedCandidate.value >= 0 : mobileAgentConfirmSuccess.value)
            ? "已批准，正在执行点击"
            : "已拒绝该位置，Mobile-Agent 将重新定位"
        );
        const actionText = isInteraction
          ? `用户提供下一步指导：${mobileAgentConfirmDescription.value.trim()}`
          : isQuestion
          ? mobileAgentSelectedCandidate.value >= 0
            ? `用户选择候选 ${mobileAgentSelectedCandidate.value + 1}，正在执行点击`
            : `用户拒绝全部候选，反馈：${mobileAgentConfirmDescription.value.trim()}`
          : mobileAgentCorrectedCoordinate.value
          ? `用户纠错并批准，新坐标 ${mobileAgentCorrectedCoordinate.value}，正在执行点击`
          : mobileAgentConfirmSuccess.value
            ? `用户批准坐标 ${confirmation.coordinate}，正在执行点击`
            : `用户拒绝坐标 ${confirmation.coordinate}，反馈：${mobileAgentConfirmDescription.value.trim()}。Mobile-Agent 将重新定位，完成纠正前禁止结束任务`;
        appendMobileAgentExecutionLog(
          `[Mobile-Agent 第${confirmation.step_id || "?"}步] ${actionText}`,
          confirmationTestId
        );
        mobileAgentConfirmVisible.value = false;
        mobileAgentConfirmation.value = null;
        // 提交接口成功后立即释放按钮；下一条审批由后台轮询获取，不阻塞当前交互。
        mobileAgentConfirmSubmitting.value = false;
        void fetchMobileAgentConfirmations();
      } catch (error) {
        ElMessage.error(`提交点击审批失败：${error.message}`);
      } finally {
        mobileAgentConfirmSubmitting.value = false;
      }
    };

    const closeMobileAgentConfirmation = async (done) => {
      const confirmation = mobileAgentConfirmation.value;
      const testId = confirmation?.test_id?.trim();
      if (!confirmation || !testId || mobileAgentConfirmSubmitting.value) {
        if (typeof done === "function") done();
        return;
      }
      try {
        await ElMessageBox.confirm(
          "关闭后将视为拒绝继续提供确认，并立即终止当前测试和 Mobile-Agent 推理。是否继续？",
          "终止当前测试",
          {
            confirmButtonText: "拒绝确认并终止",
            cancelButtonText: "继续审批",
            type: "warning",
          }
        );
      } catch (_) {
        return;
      }

      mobileAgentConfirmSubmitting.value = true;
      try {
        const response = await fetch(
          `/dev-api/mobile-agent/confirmations/${encodeURIComponent(confirmation.confirmation_id)}/dismiss`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              test_id: testId,
              description: "用户关闭确认弹窗，拒绝继续提供确认并终止当前测试。",
            }),
          }
        );
        if (!response.ok) {
          const message = await response.text();
          throw new Error(message || `HTTP ${response.status}`);
        }
        appendMobileAgentExecutionLog(
          `[Mobile-Agent 第${confirmation.step_id || "?"}步] 用户关闭确认弹窗，已拒绝继续确认并终止当前测试`,
          testId
        );
        mobileAgentConfirmVisible.value = false;
        mobileAgentConfirmation.value = null;
        isDebugRunning.value = false;
        currentExecutingId.value = "";
        stopPolling();
        cleanupMobileAgentSession(testId);
        if (typeof done === "function") done();
        ElMessage.info("已拒绝确认，当前测试和 Mobile-Agent 已终止");
      } catch (error) {
        ElMessage.error(`终止当前测试失败：${error.message}`);
      } finally {
        mobileAgentConfirmSubmitting.value = false;
      }
    };

    onMounted(() => {
      fetchMobileAgentEvents();
      fetchMobileAgentConfirmations();
      const pollLoop = () => {
        // 活跃判断改用 activeMobileAgentTestIds()（含 sessionCaseIds 兜底），
        // 避免 currentTestId 未同步（SSE 时序/刷新后丢失）时误判"无活跃测试"而停拉事件流。
        const activeIds = activeMobileAgentTestIds();
        if (!isDebugRunning.value && !mobileAgentConfirmVisible.value && !activeIds.length) {
          // 无活跃测试：清空退避计数，低频兜底轮询（15s）
          mobileAgentPollEmptyCount = 0;
          mobileAgentConfirmPolling = setTimeout(pollLoop, MOBILE_AGENT_POLL_MAX_MS);
          return;
        }
        fetchMobileAgentEvents();
        fetchMobileAgentConfirmations();
        // 动态间隔：空结果越多间隔越长（3s → 6s → 12s → 15s 封顶）
        const nextDelay = Math.min(
          MOBILE_AGENT_POLL_BASE_MS * Math.pow(2, mobileAgentPollEmptyCount),
          MOBILE_AGENT_POLL_MAX_MS
        );
        mobileAgentConfirmPolling = setTimeout(pollLoop, nextDelay);
      };
      mobileAgentConfirmPolling = setTimeout(pollLoop, MOBILE_AGENT_POLL_BASE_MS);
    });

    onUnmounted(() => {
      if (mobileAgentConfirmPolling) clearTimeout(mobileAgentConfirmPolling);
    });

    const default_url = ref("http://172.23.96.54:8000");
    const url = ref(default_url.value);
    // 走 /task-api 代理转发到 pats 服务(默认8000，/task-stream 路由在其 servers_manager)。
    // 不硬编码 127.0.0.1——正式环境下 127.0.0.1 指向用户本机，任务轮询必挂
    // pats 是每用户本机运行的平台：正式环境直连 127.0.0.1（指向用户自己的 pats）。
    // 本地开发机没跑 pats，走 /task-api 代理转发到台架机 172.23.98.12:8000。
    const taskBaseUrl = import.meta.env.DEV ? "/task-api" : "http://127.0.0.1:8000";

    const stopPolling = () => {
      Object.keys(pollingIntervals).forEach((test_id) => {
        clearInterval(pollingIntervals[test_id]);
        delete pollingIntervals[test_id]; // 清除引用
      });
    };

    // 自动化任务处理
    const fetchTasks = async () => {
      // 只有在开启自动轮询、没有正在执行调试、且当前没有正在处理的任务时才轮询
      if (!isAutoPolling.value || isDebugRunning.value || isProcessingTask.value) return;
      
      try {
        const response = await fetch(`${taskBaseUrl}/task-stream/tasks`);
        if (!response.ok) return;
        const data = await response.json();
        if (data.state && data.data.tasks && data.data.tasks.length > 0) {
          const task = data.data.tasks.find(t => t.status === "pending");
          // 如果获取到了新任务（ID不同），则加载
          if (task && task.test_task_id !== currentTask.value?.test_task_id) {
            await handleNewTask(task);
          }
        }
      } catch (e) {
        console.error("轮询任务失败:", e);
      }
    };

    const handleNewTask = async (task) => {
      isProcessingTask.value = true; // 标记正在处理任务
      currentTask.value = task;
      showToast(`获取到新自动化任务: ${task.name}`, "info");

      try {
        const fileUrl = `${taskBaseUrl}/${task.test_case_file}`;
        const res = await fetch(fileUrl);
        if (!res.ok) throw new Error("无法获取用例文件");
        const arrayBuffer = await res.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        const newCases = [];
        const newCasesTable = [];

        // 自动化任务专用解析逻辑，匹配甲方提供的表头 (xlsx 格式，第一行为表头)
        const parseRow = (row, index) => {
          return {
            id: `${String(index + 1).padStart(3, "0")}`,
            TestCaseID: (row["Test Case ID测试caseID"] ?? "").toString().trim(),
            SyRDIDFSRD: (row["RD ID/(FSR/TSR）需求ID"] ?? "").toString().trim(),
            Auto_testID: (row["ALM编号"] ?? "").toString().trim(),
            TSR: "",
            CasePriority: (row["Case_Priority优先级"] ?? "").toString().trim(),
            DesignMethod: (row["Design Method 设计方法"] ?? "").toString().trim(),
            TestMethod: (row["Test Method 测试方法"] ?? "").toString().trim(),
            TestStrategy: (row["Test Goal测试目的"] ?? "").toString().trim(),
            TestKey: (row["Function Module功能模块"] ?? "").toString().trim(),
            Initial_Condition: (row["Pre-condition前提条件"] ?? "").toString().trim(),
            Action: (row["Test Steps测试步骤"] ?? "").toString().trim(),
            Expected_Result: (row["Expected Result期望结果"] ?? "").toString().trim(),
            InitTestSequences: (row["Init Test Sequences测试序列前置条件"] ?? "").toString().trim(),
            ActionTestSequences: (row["Action Test Sequences动作测试序列"] ?? "").toString().trim(),
            ExpectedTestSequences: (row["Expected Test Sequences预期测试序列结果"] ?? "").toString().trim(),
            Selected: (row["Auto_Test Selected是否选择自动化测试"] ?? "").toString().trim(),
            Result: "",
            ActualResult: "",
            PRNo: "",
            TestLogs: "",
            Numberoftests: "",
            TestDate: "",
            Remark: "",
          };
        };

        // 遍历所有工作表，假设所有工作表的第一行都是表头
        let start = 0;
        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          // 使用 range: 0 (默认)，因为自动化导出的 xlsx 第一行就是表头
          const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
          if (json.length > 0) {
            newCasesTable.push({
              sheetName: sheetName,
              start: start,
              end: start + json.length - 1,
              length: json.length,
            });
            json.forEach((row, index) => {
              newCases.push(parseRow(row, start + index));
            });
            start += json.length;
          }
        });

        if (newCasesTable.length > 1) {
          newCasesTable.unshift({
            sheetName: "全选",
            start: 0,
            end: newCases.length - 1,
            length: newCases.length,
          });
        }

        // 更新状态
        cases.value = newCases;
        casesTable.value = newCasesTable;

        if (newCases.length > 0) {
          // 自动全选所有加载的用例
          selectedRowIds.value = new Set(newCases.map((c) => c.id));
          syncSelectedRowsAll();

          await nextTick();
          showToast("自动化任务用例加载完成，即将自动开始测试...", "success");

          // 延迟一小会儿确保 UI 更新
          setTimeout(async () => {
            if (isProcessingTask.value) {
              await startDebugging();
            }
          }, 1000);
        }
      } catch (e) {
        isProcessingTask.value = false; // 加载失败则重置状态
        console.error("加载自动化任务用例失败:", e);
        ElMessage.error("加载自动化任务用例失败: " + e.message);
      }
    };

    const reportCaseResult = async (row, durationMs) => {
      if (!currentTask.value) return;

      const payload = {
        test_task_id: currentTask.value.test_task_id,
        sub_task_id: currentTask.value.sub_task_id || (currentTask.value.test_task_id + "01"),
        case_id: row.TestCaseID || row.id,
        case_name: row.TestKey || row.TestCaseID || "自动化用例",
        case_result: (row.Result === "Pass" || row.Result === "通过") ? "成功" : "失败",
        actual_result: row.ActualResult || row.Result || "执行完成",
        case_duration: parseFloat((durationMs / 1000).toFixed(2)),
        case_error_message: (row.Result === "Pass" || row.Result === "通过") ? null : "测试执行未达预期",
        case_steps: row.ActionTestSequences || "",
        state: "正常",
        exception: null
      };

      try {
        const response = await fetch(`${taskBaseUrl}/task-stream/tasks/case-result`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (data.state) {
          console.log(`用例 ${payload.case_id} 结果上报成功`);
        }
      } catch (e) {
        console.error("上报用例结果失败:", e);
      }
    };

    const reportTaskComplete = async () => {
      if (!currentTask.value) return;

      const list = cases.value.filter(
        (c) => c.Result !== undefined && c.Result !== ""
      );
      const total = list.length;
      const pass = list.filter((c) => /pass|通过/i.test(c.Result)).length;
      const fail = total - pass;
      
      let durationSec = 0;
      if (startTime.value && endTime.value) {
        durationSec = parseFloat(((endTime.value - startTime.value) / 1000).toFixed(2));
      }

      const payload = {
        test_task_id: currentTask.value.test_task_id,
        sub_task_id: currentTask.value.sub_task_id || (currentTask.value.test_task_id + "01"),
        result: fail > 0 ? "fail" : "pass",
        duration: durationSec,
        total_cases: total,
        passed_cases: pass,
        failed_cases: fail
      };

      try {
        const response = await fetch(`${taskBaseUrl}/task-stream/tasks/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (data.state) {
          showToast(`任务汇总上报成功: ${payload.result}`, "success");
        }
      } catch (e) {
        console.error("任务汇总上报失败:", e);
      }
    };

    const userDisplayName = computed(() => {
      const raw = currentUserInfo.value;
      if (raw?.nickName) return raw.nickName;
      if (raw?.userName) return raw.userName;
      return localStorage.getItem("currentUser") ?? "";
    });

    // 上传测试记录相关逻辑
    const uploadRecordDialogVisible = ref(false);
    const uploadFormRef = ref(null);
    const isUploading = ref(false);

    const uploadForm = reactive({
      uid: "",
      name: "",
      nickname: "",
      type: "稳定测试",
      result: "通过",
      startTime: "",
      endTime: "",
      duration: 0,
      projectId: "",
      bugCount: 0,
      qnxVersion: "",
      socVersion: "",
      mcuVersion: "",
      moduleName: "",
      totalCases: 0,
      passedCases: 0,
      failedCases: 0,
      hostname: "",
    });

    const uploadRules = {
      name: [{ required: true, message: "请输入测试名称", trigger: "blur" }],
      type: [{ required: true, message: "请输入测试类型", trigger: "blur" }],
      result: [{ required: true, message: "请选择测试结果", trigger: "change" }],
      startTime: [{ required: true, message: "请选择开始时间", trigger: "change" }],
      endTime: [{ required: true, message: "请选择结束时间", trigger: "change" }],
      projectId: [{ required: true, message: "项目ID不能为空", trigger: "blur" }],
      uid: [{ required: true, message: "用户UID不能为空", trigger: "blur" }],
    };

    const openUploadRecordDialog = () => {
      // 1. 统计数据
      const list = cases.value.filter(
        (c) => c.Result !== undefined && c.Result !== ""
      );
      const total = list.length;
      const pass = list.filter((c) => /pass/i.test(c.Result)).length;
      const fail = total - pass;

      // 2. 填充表单
      uploadForm.totalCases = total;
      uploadForm.passedCases = pass;
      uploadForm.failedCases = fail;

      // 3. 自动判断结果
      uploadForm.result = fail > 0 ? "失败" : "通过";

      // 4. 用户/项目信息
      const userInfo = currentUserInfo.value;
      uploadForm.uid =
        userInfo?.userName || localStorage.getItem("currentUser") || "";
      uploadForm.projectId = localStorage.getItem("currentProjectId") ?? "";
      uploadForm.name =
        currentProject.value?.label ||
        currentProject.value?.projectName ||
        "测试应用";

      uploadForm.type = uploadForm.type || "稳定测试";

      // 5. 时间处理
      const formatTime = (ts) => {
        if (!ts) return "";
        const d = new Date(ts);
        const pad = (n) => String(n).padStart(2, "0");
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
          d.getDate()
        )} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
      };

      const now = Date.now();
      uploadForm.startTime =
        formatTime(startTime.value) || formatTime(now);
      uploadForm.endTime = formatTime(endTime.value) || formatTime(now);

      // 6. 持续时间 (天)
      if (startTime.value && endTime.value) {
        const diffMs = endTime.value - startTime.value;
        uploadForm.duration = parseFloat(
          (diffMs / (1000 * 60 * 60 * 24)).toFixed(6)
        );
      } else {
        uploadForm.duration = 0;
      }

      uploadRecordDialogVisible.value = true;
    };

    const submitUpload = async () => {
      if (!uploadFormRef.value) return;
      await uploadFormRef.value.validate(async (valid) => {
        if (valid) {
          isUploading.value = true;
          try {
            const response = await fetch("/dev-api/icdqm/test_record", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(uploadForm),
            });

            if (response.ok) {
              ElMessage.success("上传成功");
              uploadRecordDialogVisible.value = false;
            } else {
              ElMessage.error("上传失败");
            }
          } catch (error) {
            ElMessage.error("网络异常: " + error.message);
          } finally {
            isUploading.value = false;
          }
        }
      });
    };

    const projectDisplayName = computed(() => {
      const name = localStorage.getItem("currentProjectName");
      if (name) return name;
      const raw = currentProject.value;
      return raw?.label ?? raw?.projectName ?? raw?.name ?? "";
    });

    const projectScopeKey = ref("default");
    const getProjectLocalStorageKey = (suffix) => {
      const scope = projectScopeKey.value || "default";
      return `PROJ__${scope}__${suffix}`;
    };

    const loadAuthContext = () => {
      try {
        currentUserInfo.value = JSON.parse(localStorage.getItem("currentUserInfo") ?? "null");
      } catch {
        currentUserInfo.value = null;
      }

      try {
        currentProject.value = JSON.parse(localStorage.getItem("currentProject") ?? "null");
      } catch {
        currentProject.value = null;
      }

      const projectId = localStorage.getItem("currentProjectId") ?? "";
      const projectName = localStorage.getItem("currentProjectName") ?? "";
      model_name.value = projectName || projectId;

      projectScopeKey.value = encodeURIComponent((projectName || projectId || "default").trim());
    };

    const handleLogout = async () => {
      try {
        await ElMessageBox.confirm("确认退出登录？", "提示", {
          type: "warning",
          confirmButtonText: "退出",
          cancelButtonText: "取消",
        });

        try {
          ElMessageBox.close();
        } catch {
          // ignore
        }

        try {
          document.body.classList.remove("el-popup-parent--hidden");
          document.body.style.removeProperty("overflow");
          document.querySelectorAll(".el-overlay").forEach((el) => el.remove());
        } catch {
          // ignore
        }

        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("currentUserInfo");
        localStorage.removeItem("currentProjectId");
        localStorage.removeItem("currentProjectName");
        localStorage.removeItem("currentProject");

        ElMessage.success("已退出登录");
        window.setTimeout(() => {
          router.replace("/");
        }, 0);
      } catch {
        return;
      }
    };
    const selectedCase = ref("");
    const selectedSheet = ref("");
    const infoType = ref("all");

    const showTestKey = ref(true); // 控制“测试功能点”列的显示
    const showTestidColumn = false;
    const currentLang = ref("中文");
    const langOptions = ref(langOptionsJson);
    const tableKey = ref(0);
    const handleInfoTypeChange = (value) => {
      showTestKey.value = value !== "critical";
    };
    const { proxy } = getCurrentInstance();
    const videoPlayer = ref(null);
    const instrumentVideoPlayer = ref(null);
    const mobileVideoUrl = ref("");
    const instrumentVideoUrl = ref("");
    const selectedDbcName = ref("");
    const dbcDisplayName = (name) => {
      const value = String(name || "");
      return value.length > 14 ? `${value.slice(0, 11)}...` : value;
    };

    const activeName = ref("first");
    const activeDevice = ref("five");
    
    // 测试用例数据
    const cases = ref([]);

    const casesTable = ref([]);

    // const casesTable = ref(JSON.parse(localStorage.getItem('casesTable')) || [])

    // watch(casesTable, (newCasesTable) => {
    //     localStorage.setItem('casesTable', JSON.stringify(newCasesTable))
    // }, { deep: true })

    // watch(cases, (newCases) => {
    //     localStorage.setItem('cases', JSON.stringify(newCases))
    // }, { deep: true })

    const contextMenu = reactive({
      visible: false,
      x: 0,
      y: 0,
      row: null,
    });

    const onRowRightClick = (row, column, event) => {
      event.preventDefault();
      contextMenu.x = event.clientX;
      contextMenu.y = event.clientY;
      contextMenu.row = row;
      contextMenu.visible = true;
    };

    const runSingleRow = async (row) => {
      contextMenu.visible = false;
      if (!row) return;

      selectedRowIds.value = new Set([row.id]);
      syncSelectedRowsAll();
      await nextTick(() => {
        changePage.value = true;
        proxy.$refs.caseTable.clearSelection();
        proxy.$refs.caseTable.toggleRowSelection(row, true);
        changePage.value = false;
      });
      await scrollToCase(row.id);

      await startDebugging();
      showToast(`用例 ${row.id} 开始执行`, "info");
    };

    const suspendAutoSave = ref(false);
    const pendingCasesSave = ref(false);
    const pendingCasesTableSave = ref(false);
    let casesSaveTimer = null;
    let casesTableSaveTimer = null;

    const scheduleCasesSave = (delayMs = 800) => {
      if (suspendAutoSave.value) {
        pendingCasesSave.value = true;
        return;
      }
      if (casesSaveTimer) window.clearTimeout(casesSaveTimer);
      casesSaveTimer = window.setTimeout(async () => {
        casesSaveTimer = null;
        await saveCases(cases.value, projectScopeKey.value);
      }, delayMs);
    };

    const scheduleCasesTableSave = (delayMs = 800) => {
      if (suspendAutoSave.value) {
        pendingCasesTableSave.value = true;
        return;
      }
      if (casesTableSaveTimer) window.clearTimeout(casesTableSaveTimer);
      casesTableSaveTimer = window.setTimeout(async () => {
        casesTableSaveTimer = null;
        await saveCasesTable(casesTable.value, projectScopeKey.value);
      }, delayMs);
    };

    const flushAutoSave = async () => {
      if (casesSaveTimer) {
        window.clearTimeout(casesSaveTimer);
        casesSaveTimer = null;
      }
      if (casesTableSaveTimer) {
        window.clearTimeout(casesTableSaveTimer);
        casesTableSaveTimer = null;
      }
      if (pendingCasesSave.value) {
        pendingCasesSave.value = false;
        await saveCases(cases.value, projectScopeKey.value);
      }
      if (pendingCasesTableSave.value) {
        pendingCasesTableSave.value = false;
        await saveCasesTable(casesTable.value, projectScopeKey.value);
      }
    };

    watch(cases, () => scheduleCasesSave(), { deep: true });
    watch(casesTable, () => scheduleCasesTableSave(), { deep: true });

    watch(currentLang, (val) => {
      showToast(`已切换到 ${val}`, "info");
    });

    watch(url, (newVal) => {
      localStorage.setItem(getProjectLocalStorageKey("TEST_URL"), newVal);
    });

    const reslutCases = ref([]);

    // 日志数据
    const logs = ref([]);
    const logs_total = ref(0);

    // 测试执行日志数据
    const executionLogs = ref({});

    const filteredExecutionLogs = computed(() => {
      const filterlogs = executionLogs.value[selectedCase.value] || [];
      return filterlogs;
    });

    const executionLogsTable = ref(null);

    watch(
      filteredExecutionLogs,
      async () => {
        await nextTick();
        const tableRef = executionLogsTable.value;
        if (tableRef) {
          const bodyWrapper = tableRef.$el.querySelector(".el-scrollbar__wrap");
          if (bodyWrapper) {
            bodyWrapper.scrollTo({
              top: bodyWrapper.scrollHeight,
              behavior: "smooth",
            });
          }
        }
      },
      { deep: true }
    );

    const iconConfigDialogVisible = ref(false);
    const iconConfigLoading = ref(false);
    const iconDots = ref([]);
    const iconRealImg = ref(null);
    const iconWrap = ref(null);
    const iconVideoPlayer = ref(null);
    const iconEventLayer = ref(null);
    const iconOverlayCanvas = ref(null);
    const iconVideoSrc = ref("");     // <img> 的 src，替代 iframe
    const iconConfigTip = ref("");
    const iconMode = ref("dots"); // 'dots' 描点模式 | 'control' 操作模式
    const adbOpLogs = ref([]); // ADB 操作日志（结构化，每条含唯一 id）
    const adbLogsTableRef = ref(null);
    const adbOpSelectedIds = ref([]);   // 勾选的日志 id 列表
    const isAllAdbLogsSelected = ref(false);
    const adbSequenceName = ref("");    // 操作序列名称（如"打开设置"）
    let _adbLogSeq = 0;                 // 自增 id，保证每条唯一
    const isAdbSending = ref(false);
    // 手势识别临时变量
    const _gesture = {
      pressing: false,
      startX: 0,
      startY: 0,
      startTime: 0,
      lastX: 0,
      lastY: 0,
    };

    // =========================================================================
    //  🎬 案例 ADB 操作序列录制向导（独立 Dialog，方案 A，图标配置弹窗保留独立纯调试）
    // =========================================================================
    const recDialogVisible = ref(false);   // 向导 Dialog 是否可见
    const recStep = ref(1);                 // 当前阶段：1=初始条件  2=操作步骤  3=预期结果
    const recCase = ref(null);              // 当前正在录制的案例（cases[i] 的引用）
    const recStartAt = ref(0);              // 录制开始时间戳（ms，用于计算总耗时）
    // 阶段1：初始条件（按 Initial_Condition 文本拆分为多个子步骤，逐步骤录制）
    const recInitialParsed = ref([]);       // [{idx,text,seq:null|{...}}]  初始条件细分步骤数组
    const recCurrentInitialStep = ref(1);   // 当前在阶段1 中录第几个 Step（从 1 开始）
    const recInitialSeq = ref(null);        // === 兼容保留：旧单序列（改为组装所有子步骤合并）===
    // 阶段2：操作步骤（按 Action 文本拆分为多个 Step，每条 Step 一个独立 ADB 序列）
    const recActionParsed = ref([]);        // [{idx,text,seq:null|{...}}]   （细分后的数组）
    const recCurrentActionStep = ref(1);    // 当前在阶段2 中录第几个 Step（从 1 开始）
    const recActionSeq = ref(null);         // === 兼容保留：旧单序列（改为组装所有子步骤合并）===

    // --- 录制向导内部：画面 + 操作 + 日志（独立一份状态，不污染图标配置弹窗） ---
    const recWrap = ref(null);              // 画面容器
    const recImg = ref(null);               // 画面 <img>
    const recCanvas = ref(null);            // 画布（滑动轨迹，因为录制里没有描点，所以只画轨迹）
    const recEvLayer = ref(null);           // 事件层
    const recVideoSrc = ref("");            // 画面 src
    const recLogs = ref([]);                // 录制向导专用 ADB 日志（独立一份！）
    const recLogsTableRef = ref(null);
    const recLogsSelected = ref([]);        // 勾选的日志 id 列表（用于全选显示，保存时按时间升序不用选）
    const recLogsAllSelected = ref(false);
    const recGesture = { pressing:false, x1:0, y1:0, x2:0, y2:0, t:0, lx:0, ly:0 };
    const recIsSending = ref(false);
    const recSubmitting = ref(false);
    let _recLogSeq = 0;

    // Reboot 状态 & 倒计时
    const recRebooting = ref(false);
    const recRebootCountdown = ref(0);
    let _recRebootTimer = null;
    const recRebootResult = ref("");        // reboot 阶段展示的文本

    // 工具：把 Action 整段文本拆成多个 Step
    const parseActionText = (raw) => {
      const text = (raw || "").toString().trim();
      if (!text) return [{ idx:1, text:"操作步骤（整段）", seq:null, skipped:false }];
      const lines = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
      const out = [];
      let pending = null;
      for (const line of lines) {
        const m = line.match(/^\s*(\d+)\s*[、.．)\]\s]\s*(.+)$/);
        if (m) {
          if (pending) { out.push(pending); pending = null; }
          out.push({ idx: parseInt(m[1]), text: m[2].trim(), seq: null, skipped:false });
        } else {
          if (out.length) out[out.length-1].text = out[out.length-1].text + "\n" + line;
          else if (pending) pending.text = pending.text + "\n" + line;
          else pending = { idx: 1, text: line, seq: null, skipped:false };
        }
      }
      if (pending) out.push(pending);
      if (!out.length) return [{ idx:1, text, seq:null, skipped:false }];
      out.sort((a,b) => a.idx - b.idx);
      return out.map((it, i) => ({ idx: i+1, text: it.text, seq: null, skipped:false }));
    };

    // 工具：把 Initial_Condition 整段文本拆成多个 Step（逻辑与 parseActionText 一致）
    const parseInitialText = (raw) => {
      const text = (raw || "").toString().trim();
      if (!text) return [{ idx:1, text:"初始条件（整段）", seq:null, skipped:false }];
      const lines = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
      const out = [];
      let pending = null;
      for (const line of lines) {
        const m = line.match(/^\s*(\d+)\s*[、.．)\]\s]\s*(.+)$/);
        if (m) {
          if (pending) { out.push(pending); pending = null; }
          out.push({ idx: parseInt(m[1]), text: m[2].trim(), seq: null, skipped:false });
        } else {
          if (out.length) out[out.length-1].text = out[out.length-1].text + "\n" + line;
          else if (pending) pending.text = pending.text + "\n" + line;
          else pending = { idx: 1, text: line, seq: null, skipped:false };
        }
      }
      if (pending) out.push(pending);
      if (!out.length) return [{ idx:1, text, seq:null, skipped:false }];
      out.sort((a,b) => a.idx - b.idx);
      return out.map((it, i) => ({ idx: i+1, text: it.text, seq: null, skipped:false }));
    };


    const iconConfig = () => {
      iconConfigDialogVisible.value = true;
      iconDots.value = [];
      adbOpLogs.value = [];
      iconMode.value = "dots";
      nextTick(loadIconConfigShot);
    };

    watch(iconConfigDialogVisible, (v) => {
      if (!v) iconConfigTip.value = ""; // 关闭弹框即清空提示
    });

    const loadIconConfigShot = async () => {
      iconConfigLoading.value = true;
      try {
        const wrap = iconWrap.value;
        const img = iconVideoPlayer.value;
        const cvs = iconOverlayCanvas.value;
        if (!wrap || !img || !cvs) {
          iconConfigLoading.value = false;
          return;
        }
        // 1. 真实设备分辨率（例：2560×1440）
        const { w, h } = await getDeviceSize();
        // 2. 先给 wrap 一个合理尺寸（按设备比例缩放到高 480，宽屏宽90%），确保 <img> 能正确渲染出 clientWidth/Height
        const maxW = Math.min(window.innerWidth * 0.9, 1400);
        const maxH = 480;
        const s = Math.min(maxW / w, maxH / h, 1);
        const dispW = Math.round(w * s);
        const dispH = Math.round(h * s);
        wrap.style.width = dispW + "px";
        wrap.style.height = dispH + "px";
        // 3. canvas 逻辑像素 = 设备分辨率（这样 x/y 就是真实设备坐标）
        cvs.width = w;
        cvs.height = h;
        cvs.style.width = dispW + "px";
        cvs.style.height = dispH + "px";
        // 4. <img> 加载：等它 onload 之后，naturalWidth/naturalHeight 就出来了，就能精准重绘
        iconVideoSrc.value = `${url.value}/adb/video?t=${Date.now()}`;
        // 500ms 后重绘一次（有些 MJPEG 流不会触发 onload）
        setTimeout(() => {
          redrawDots();
          iconConfigLoading.value = false;
        }, 500);
      } catch (e) {
        ElMessage.error("加载画面失败：" + e.message);
        iconConfigLoading.value = false;
      }
    };

    // 【核心函数】根据 <img> 的 natural（真实分辨率）和 client（实际显示）尺寸，
    // 推算出实际画面在 CSS 像素里的真实可视矩形（含上下/左右留白补偿）
    // 返回值：{ x, y, w, h } 以「事件层左上角」为原点的 CSS 像素矩形
    const _getImgVisibleRect = () => {
      const img = iconVideoPlayer.value;
      if (!img) return null;
      const natW = img.naturalWidth || img.width || 0;
      const natH = img.naturalHeight || img.height || 0;
      const cssW = img.clientWidth;
      const cssH = img.clientHeight;
      if (!natW || !natH || !cssW || !cssH) return null;
      const natRatio = natW / natH;
      const cssRatio = cssW / cssH;
      let visW, visH;
      if (cssRatio > natRatio) {
        // CSS 更扁 → 左右有留白 → 以高度为基准
        visH = cssH;
        visW = cssH * natRatio;
      } else {
        // CSS 更高 → 上下有留白 → 以宽度为基准
        visW = cssW;
        visH = cssW / natRatio;
      }
      return {
        x: (cssW - visW) / 2,   // 相对 img 左上角的 X 偏移（事件层和 img 同尺寸，所以也是事件层内偏移）
        y: (cssH - visH) / 2,   // 相对 img 左上角的 Y 偏移
        w: visW,
        h: visH,
      };
    };

    // 坐标换算：按【实际画面可视矩形】换算，100% 精准
    // 1. 先算点击在 CSS 像素中相对【可视矩形左上角】的位置
    // 2. 再按可视矩形大小比例 → 映射到真实设备分辨率（cvs.width/height）
    const getScreenAndCoords = (e) => {
      const cvs = iconOverlayCanvas.value;
      const evLayer = iconEventLayer.value;
      if (!cvs || !evLayer) return null;
      const layerRect = evLayer.getBoundingClientRect();
      if (layerRect.height < 10 || layerRect.width < 10) return null;

      const relX = e.clientX - layerRect.left;
      const relY = e.clientY - layerRect.top;

      // 实际画面可视矩形（img 在 CSS 像素里真正占的区域，排除左右留白）
      const vis = _getImgVisibleRect();
      let x, y;
      if (!vis) {
        // img 还没加载出来，退回到按整个事件层比例估算（兜底）
        x = Math.round((relX / layerRect.width) * cvs.width);
        y = Math.round((relY / layerRect.height) * cvs.height);
      } else {
        // 点击在可视矩形外面 → 直接忽略（不会产生红点和 ADB 点击）
        if (relX < vis.x || relY < vis.y || relX > vis.x + vis.w || relY > vis.y + vis.h) return null;
        const localX = relX - vis.x;
        const localY = relY - vis.y;
        x = Math.round((localX / vis.w) * cvs.width);
        y = Math.round((localY / vis.h) * cvs.height);
      }
      x = Math.max(0, Math.min(cvs.width, x));
      y = Math.max(0, Math.min(cvs.height, y));
      return { W: cvs.width, H: cvs.height, relX, relY, x, y };
    };

    // 在画布上画临时滑动轨迹线
    const _drawGestureLine = (x1, y1, x2, y2, clearFirst = true) => {
      const cvs = iconOverlayCanvas.value;
      if (!cvs) return;
      const ctx = cvs.getContext("2d");
      if (clearFirst) {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        redrawDots(); // 保留原有的红点
      }
      ctx.strokeStyle = "#409EFF";
      ctx.lineWidth = Math.max(2, 6 / (cvs.clientWidth / cvs.width));
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      // 起点圆点
      ctx.setLineDash([]);
      ctx.fillStyle = "#409EFF";
      ctx.beginPath();
      ctx.arc(x1, y1, Math.max(3, 8 / (cvs.clientWidth / cvs.width)), 0, Math.PI * 2);
      ctx.fill();
    };

    // 记录一条 ADB 操作日志（结构化：含坐标、命令、唯一 id 方便勾选/删除/上传）
    // payload 示例：
    //  TAP:   { x, y, cmd }
    //  SWIPE: { x1, y1, x2, y2, duration, cmd }
    //  KEY:   { keyCode, keyName, cmd }
    const addAdbLog = (type, payload = {}, success = true, msg = "") => {
      const t = new Date();
      const time = `${t.getHours().toString().padStart(2, "0")}:${t
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${t.getSeconds().toString().padStart(2, "0")}`;
      _adbLogSeq += 1;
      const entry = {
        id: `adb_${Date.now()}_${_adbLogSeq}`,
        time,
        ts: t.getTime(),
        type, // "TAP" | "SWIPE" | "KEY"
        success,
        msg: msg || buildAdbLogMsg(type, payload),
        cmd: payload.cmd || "",
        // TAP
        x: payload.x ?? null,
        y: payload.y ?? null,
        // SWIPE
        x1: payload.x1 ?? null,
        y1: payload.y1 ?? null,
        x2: payload.x2 ?? null,
        y2: payload.y2 ?? null,
        duration: payload.duration ?? null,
        // KEY
        keyCode: payload.keyCode ?? null,
        keyName: payload.keyName ?? null,
      };
      adbOpLogs.value.unshift(entry);
      if (adbOpLogs.value.length > 200) adbOpLogs.value.length = 200;
    };
    const buildAdbLogMsg = (type, p) => {
      if (type === "TAP") return `(${p.x}, ${p.y})`;
      if (type === "SWIPE") return `(${p.x1},${p.y1}) → (${p.x2},${p.y2}) [${p.duration}ms]`;
      if (type === "KEY") return `${p.keyCode} (${p.keyName || ""})`;
      return "";
    };

    // ============================================================
    //  ADB 操作列表功能：清空 / 单条删除 / 全选 / 数据导出
    // ============================================================
    const clearAdbLogs = () => {
      ElMessageBox.confirm("确认清空所有 ADB 操作记录？此操作不可撤销", "提示", {
        type: "warning",
        confirmButtonText: "清空",
        cancelButtonText: "取消",
      })
        .then(() => {
          adbOpLogs.value = [];
          adbOpSelectedIds.value = [];
          isAllAdbLogsSelected.value = false;
          if (adbLogsTableRef.value) adbLogsTableRef.value.clearSelection();
          ElMessage.success("已清空 ADB 操作记录");
        })
        .catch(() => {});
    };
    const deleteAdbLogAt = (index) => {
      const row = adbOpLogs.value[index];
      if (!row) return;
      // 同时从已选列表移除
      adbOpSelectedIds.value = adbOpSelectedIds.value.filter((id) => id !== row.id);
      adbOpLogs.value.splice(index, 1);
      isAllAdbLogsSelected.value = adbOpSelectedIds.value.length === adbOpLogs.value.length && adbOpLogs.value.length > 0;
    };
    const onAdbSelectionChange = (rows) => {
      adbOpSelectedIds.value = rows.map((r) => r.id);
      isAllAdbLogsSelected.value = rows.length === adbOpLogs.value.length && rows.length > 0;
    };
    const toggleSelectAllAdbLogs = () => {
      if (!adbLogsTableRef.value) return;
      if (isAllAdbLogsSelected.value) {
        adbLogsTableRef.value.clearSelection();
      } else {
        adbOpLogs.value.forEach((row) => adbLogsTableRef.value.toggleRowSelection(row, true));
      }
    };
    // 把勾选的记录按时间升序组装成接口可传输的数据结构
    // 等后端接口出来后，直接拿这个 payload 发请求即可
    const exportSelectedAdbSequence = () => {
      if (!adbOpSelectedIds.value.length) {
        ElMessage.warning("请先勾选至少一条操作记录");
        return;
      }
      const name = (adbSequenceName.value || "").trim();
      // 按操作时间升序（注意日志是 unshift 新操作在前，所以升序就是回放顺序）
      const selectedRows = adbOpLogs.value
        .filter((r) => adbOpSelectedIds.value.includes(r.id))
        .sort((a, b) => a.ts - b.ts);

      const steps = selectedRows.map((r, i) => ({
        step: i + 1,
        id: r.id,
        type: r.type,
        time: r.time,
        ts: r.ts,
        // TAP
        x: r.x,
        y: r.y,
        // SWIPE
        x1: r.x1,
        y1: r.y1,
        x2: r.x2,
        y2: r.y2,
        duration: r.duration,
        // KEY
        keyCode: r.keyCode,
        keyName: r.keyName,
        // 原始 adb 命令
        cmd: r.cmd,
        success: r.success,
      }));

      const payload = {
        name: name || "未命名操作序列",
        created_at: new Date().toISOString(),
        total_steps: steps.length,
        steps,
      };
      // 等接口出来，直接 fetch(url, { method:'POST', body: JSON.stringify(payload) })
      console.group("🎬 【操作序列】已组装完毕（接口可用时直接发送此 payload）");
      console.log("操作序列名称:", payload.name);
      console.log("操作步数:", payload.total_steps);
      console.log("完整 payload:", JSON.stringify(payload, null, 2));
      console.groupEnd();

      ElMessageBox.alert(
        `操作序列已导出到浏览器控制台！\n` +
          `序列名称：${payload.name}\n` +
          `总步数：${payload.total_steps}\n\n` +
          `请按 F12 → Console 查看完整 JSON，\n` +
          `后端接口出来后直接以 POST body 形式提交即可。`,
        "✅ 操作序列导出成功",
        {
          confirmButtonText: "好的",
          customClass: "adb-sequence-export-tip",
        }
      );
    };

    // 发送 ADB Tap 命令
    const sendAdbTap = async (x, y) => {
      if (isAdbSending.value) return;
      isAdbSending.value = true;
      const cmd = `shell input tap ${x} ${y}`;
      const payload = { x, y, cmd };
      addAdbLog("TAP", payload, true);
      try {
        const res = await fetch(
          `${url.value}/adb/runCmd?cmd=${encodeURIComponent(cmd)}`
        );
        const ok = res.ok;
        if (!ok) addAdbLog("TAP", { ...payload, error: `HTTP ${res.status}` }, false, `(${x}, ${y}) 失败`);
      } catch (e) {
        addAdbLog("TAP", { ...payload, error: e.message }, false, `(${x}, ${y}) 网络错误: ${e.message}`);
      } finally {
        isAdbSending.value = false;
      }
    };

    // 发送 ADB Swipe 命令
    const sendAdbSwipe = async (x1, y1, x2, y2, durationMs = 300) => {
      if (isAdbSending.value) return;
      isAdbSending.value = true;
      const cmd = `shell input swipe ${x1} ${y1} ${x2} ${y2} ${durationMs}`;
      const payload = { x1, y1, x2, y2, duration: durationMs, cmd };
      addAdbLog("SWIPE", payload, true);
      try {
        const res = await fetch(
          `${url.value}/adb/runCmd?cmd=${encodeURIComponent(cmd)}`
        );
        if (!res.ok) addAdbLog("SWIPE", { ...payload, error: `HTTP ${res.status}` }, false, "滑动失败");
      } catch (e) {
        addAdbLog("SWIPE", { ...payload, error: e.message }, false, `网络错误: ${e.message}`);
      } finally {
        isAdbSending.value = false;
      }
    };

    // 发送物理按键
    const sendAdbKey = async (key, name = "") => {
      if (isAdbSending.value) return;
      isAdbSending.value = true;
      const cmd = `shell input keyevent ${key}`;
      const keyName = name || keyCodeName(key);
      const payload = { keyCode: key, keyName, cmd };
      addAdbLog("KEY", payload, true);
      try {
        const res = await fetch(
          `${url.value}/adb/runCmd?cmd=${encodeURIComponent(cmd)}`
        );
        if (!res.ok) addAdbLog("KEY", { ...payload, error: `HTTP ${res.status}` }, false, `${key} 失败`);
      } catch (e) {
        addAdbLog("KEY", { ...payload, error: e.message }, false, `${key} 错误: ${e.message}`);
      } finally {
        isAdbSending.value = false;
      }
    };
    const keyCodeName = (code) => {
      const table = { "3": "HOME", "4": "BACK", "19": "DPAD_UP", "20": "DPAD_DOWN", "21": "DPAD_LEFT", "22": "DPAD_RIGHT", "23": "DPAD_CENTER", "66": "ENTER", "67": "BACKSPACE" };
      return table[String(code)] || "";
    };

    // ===== 手势事件处理（统一入口：鼠标按下/移动/抬起）=====
    const onScreenMouseDown = (e) => {
      const info = getScreenAndCoords(e);
      if (!info) return;
      _gesture.pressing = true;
      _gesture.startX = info.x;
      _gesture.startY = info.y;
      _gesture.lastX = info.x;
      _gesture.lastY = info.y;
      _gesture.startTime = Date.now();
    };

    const onScreenMouseMove = (e) => {
      if (!_gesture.pressing) return;
      const info = getScreenAndCoords(e);
      if (!info) return;
      _gesture.lastX = info.x;
      _gesture.lastY = info.y;
      const dx = Math.abs(info.x - _gesture.startX);
      const dy = Math.abs(info.y - _gesture.startY);
      // 移动超过 10 像素才开始画轨迹（区分 tap 和 swipe）
      if (dx > 10 || dy > 10) {
        _drawGestureLine(_gesture.startX, _gesture.startY, info.x, info.y, true);
      }
    };

    const onScreenMouseUp = () => {
      if (!_gesture.pressing) return;
      const { startX, startY, lastX, lastY, startTime } = _gesture;
      _gesture.pressing = false;

      const dx = Math.abs(lastX - startX);
      const dy = Math.abs(lastY - startY);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const duration = Date.now() - startTime;
      const isSwipe = dist > 12; // 超过 12 像素或长按 400ms 都算 swipe/长按

      if (iconMode.value === "dots") {
        // ========== 描点模式：tap = 添加标点 ==========
        if (!isSwipe) {
          iconDots.value.push({ name: "", x: startX, y: startY });
          redrawDots();
        }
      } else if (iconMode.value === "control") {
        // ========== 操作模式：发送 ADB ==========
        if (!isSwipe) {
          // TAP
          sendAdbTap(startX, startY);
        } else {
          // SWIPE
          let dur = Math.max(200, Math.min(1500, duration));
          if (dur < 250 && dist > 80) dur = 300; // 快速滑动但距离长，补够时间
          sendAdbSwipe(startX, startY, lastX, lastY, dur);
        }
      }

      // 抬起后重绘画布，清除临时轨迹线
      setTimeout(() => redrawDots(), 150);
    };

    const redrawDots = () => {
      const cvs = iconOverlayCanvas.value;
      if (!cvs) return;
      const ctx = cvs.getContext("2d");
      ctx.clearRect(0, 0, cvs.width, cvs.height);

      // 缩放比 & 可调大小
      const scale = cvs.clientWidth / cvs.width;
      const r = Math.max(8, 10 / scale); // 原来 6 → 10
      const fontSize = Math.max(14, 16 / scale); // 原来 12 → 16

      iconDots.value.forEach((d, idx) => {
        // 红点
        ctx.fillStyle = "#f56c6c";
        ctx.beginPath();
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
        ctx.fill();

        // 白字序号
        ctx.fillStyle = "#fff";
        ctx.font = `${fontSize}px sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText(idx + 1, d.x, d.y + r / 2);
      });
    };

    const submitIconDots = async () => {
      if (!iconDots.value.length) {
        ElMessage.warning("请先添加坐标");
        return;
      }

      const payload = {
        icons: iconDots.value.map((d) => ({
          icon_name: d.name || `图标${d.x}_${d.y}`, // 防止空名
          x: d.x,
          y: d.y,
        })),
        url: url.value,
        is_system_control: true,
      };

      try {
        const res = await fetch("/dev-api/addicons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (res.ok && data.code === 200) {
          ElMessage.success(data.result?.description || "坐标已保存");
          iconConfigDialogVisible.value = false;
        } else {
          ElMessage.error(data.description || "保存失败");
        }
      } catch (e) {
        ElMessage.error("网络错误");
      }
    };

    const delDot = (index) => {
      iconDots.value.splice(index, 1);
      redrawDots(); // 立即重画画布
    };

    /* ====== 关闭弹窗时清预览（可选）====== */
    watch(iconConfigDialogVisible, (v) => {
      if (!v) document.querySelector("#iconPreview")?.remove();
    });

    // 新增的弹窗相关数据
    const dialogVisible = ref(false);
    const newCase = reactive({
      TestKey: "",
      Initial_Condition: "",
      Action: "",
      Expected_Result: "",
      InitTestSequences: "",
      ActionTestSequences: "",
      ExpectedTestSequences: "",
    });

    // 查看日志的弹窗相关数据
    const logDialogVisible = ref(false);
    const ActualResultDialogVisible = ref(false);
    const logActiveTab = ref("logs");
    const ActualResultActiveTab = ref("logs");
    const activeCodeFile = ref([]);
    const activeImageFile = ref([]);
    const currentTestIdForImage = ref("");
    // 测试图片懒加载：展开下拉时按 filename 调 /test_logs/{test_id}/image 取单张图
    const handleImageExpand = async (names) => {
      const current = Array.isArray(names) ? names : [names];
      const currentTestId = currentTestIdForImage.value;
      if (!currentTestId || !logDetails.images) return;
      for (const image of logDetails.images) {
        const expanded = current.includes(image.filename);
        if (expanded && !image.url && !image.loading) {
          image.loading = true;
          image.error = "";
          try {
            const resp = await fetch(
              `/dev-api/test_logs/${encodeURIComponent(currentTestId)}/image?file=${encodeURIComponent(image.filename)}`,
              { cache: "no-store" }
            );
            if (!resp.ok) throw new Error(`图片加载失败（${resp.status}）`);
            image.url = URL.createObjectURL(await resp.blob());
          } catch (err) {
            image.error = err.message || "图片加载失败";
          } finally {
            image.loading = false;
          }
        } else if (!expanded && image.url) {
          // 折叠时释放对象 URL
          URL.revokeObjectURL(image.url);
          image.url = "";
        }
      }
    };
    const logDetails = reactive({
      logs: "",
      ignition_logs: "",
      code_files: [],
      images: [],
    });
    const ActualResultDetails = reactive({
      images: "",
      // 裁剪取部位日志：远端语义匹配命中的识别项与相似度，供 video-processor 开发排查
      matchedClasses: [],
      similarities: [],
    });

    // 搜索功能
    const searchQuery = ref("");
    const filteredCases = computed(() => {
      return cases.value;
    });

    const filteredLogCases = computed(() => {
      return logs.value;
    });

    // 组件卸载时清理
    onUnmounted(() => {
      stopStream();
    });
    // 分页设置
    const currentPage = ref(1);
    const changePage = ref(false);
    const pageSize = ref(20);
    const pageSizeOptions = [10, 20, 50, 100];

    const handleSizeChange = (newSize) => {
      pageSize.value = newSize;
      currentPage.value = 1; // 切换大小时重置到第一页
      showToast(`每页显示 ${newSize} 条`, "info");
      // 重新设置选中状态
      nextTick(() => {
        changePage.value = true;
        proxy.$refs.caseTable?.clearSelection();
        paginatedCases.value.forEach((row) => {
          const isSelected = selectedRowIds.value.has(row.id);
          proxy.$refs.caseTable?.toggleRowSelection(row, isSelected);
        });
        changePage.value = false;
      });
    };

    const currentPage1 = ref(1);
    const pageSize1 = ref(10);

    const currentPage2 = ref(1);
    const pageSize2 = ref(8);

    // 计算当前页显示的数据
    const paginatedCases = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      return filteredCases.value.slice(start, end);
    });

    const logCases = computed(() => {
      return filteredLogCases.value;
    });

    // 日志设置
    const logSettings = reactive({
      addTips: true,
      threeColumns: false,
      timestamp: true,
    });

    const logLevel = ref("全部");
    const activeStep = ref(1);

    // 显示消息提示
    const showToast = (message, type = "success") => {
      ElMessage({
        type: type,
        message: `${message}`,
        offset: 60,
      });
    };

    const mobileCanvas = ref(null);
    const mobilePoint = ref(null);

    const clickPos = reactive({
      show: false,
      x: 0,
      y: 0,
      device: "mobile",
    });

    const getDeviceSize = async () => {
      const res = await fetch(url.value + "/adb/runCmd?cmd=shell%20wm%20size");
      const txt = await res.text(); // 只读一次
      console.log("raw:", txt, "parsed:", txt.match(/(\d+)x(\d+)/));
      const m = txt.match(/(\d+)x(\d+)/);
      return m ? { w: +m[1], h: +m[2] } : { w: 2560, h: 1440 };
    };

    const resizeCanvas = (canvas, realW, realH, fitRatio = null) => {
      if (!canvas) return; // 防空
      const box = canvas.parentElement?.getBoundingClientRect();
      if (!box) return;

      canvas.width = realW;
      canvas.height = realH;

      if (fitRatio) {
        // 指定 fitRatio（设备真实比例）：等比缩放到盒子内，保持正确画面比例，不拉伸
        const ratio = realW / realH; // fitRatio.realW / fitRatio.realH
        const boxW = box.width;
        const boxH = box.height;
        const s1 = boxW / realW;
        const s2 = boxH / realH;
        const s = Math.min(s1, s2);
        canvas.style.width = Math.round(realW * s) + "px";
        canvas.style.height = Math.round(realH * s) + "px";
        // 使 canvas 在外层盒子中水平居中（垂直默认 top，保持与 iframe img 一致）
        canvas.style.left = "50%";
        canvas.style.transform = "translateX(-50%)";
      } else {
        // 旧逻辑：撑满外层盒子（主页面横屏拉伸场景继续用这个）
        canvas.style.width = box.width + "px";
        canvas.style.height = box.height + "px";
      }
    };

    const onVideoClick = (e, device) => {
      if (device === "instrument") return; // 仪表直接忽略点击

      const canvas = mobileCanvas.value;
      const rect = canvas.getBoundingClientRect();

      /* 1. 高度比例（已知正确） */
      const y = Math.round((e.offsetY / rect.height) * canvas.height);

      /* 2. 用同一比例反推宽度（代替横向拉伸） */
      const x = Math.round((e.offsetX / rect.height) * canvas.height); // ← 关键

      console.log("逻辑坐标:", x, y); // 最右 ≈ canvas.height 比例值

      /* 3. 画点、存值照旧 … */
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#f56c6c";
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();

      const target = mobilePoint;
      target.value = { left: e.offsetX, top: e.offsetY, x, y };
      ElMessage.success(`已记录 (${x}, ${y})`);
    };

    const connectInstrumentStream = () => {
      instrumentVideoPlayer.value.src = instrumentVideoUrl.value.trim() || `${url.value}/camera/video?name=UGREEN`;
    };

    const connectMobileStream = async () => {
      const { w, h } = await getDeviceSize();
      resizeCanvas(mobileCanvas.value, w, h);
      videoPlayer.value.src = mobileVideoUrl.value.trim() || `${url.value}/adb/video`;
    };

    // 自动保存用例
    const autoSave = (row) => {
      showToast(`用例 ${row.id} 已自动保存`, "info");
    };

    // 处理用例状态标签类型
    const statusType = (status) => {
      switch (status) {
        case "通过":
          return "success";
        case "待测试":
          return "warning";
        case "未通过":
          return "danger";
        default:
          return "info";
      }
    };

    // 用于添加测试用例的方法现在需要打开弹窗
    const addTestCase = () => {
      dialogVisible.value = true;
    };

    // 新增的确认添加测试用例的方法
    const confirmAddTestCase = () => {
      const newId = `${String(cases.value.length + 1).padStart(3, "0")}`;
      cases.value.push({
        id: newId,
        TestKey: newCase.TestKey,
        Initial_Condition: newCase.Initial_Condition,
        Action: newCase.Action,
        Expected_Result: newCase.Expected_Result,
        InitTestSequences: newCase.InitTestSequences,
        ActionTestSequences: newCase.ActionTestSequences,
        ExpectedTestSequences: newCase.ExpectedTestSequences,
      });
      showToast("测试用例已添加", "success");
      dialogVisible.value = false;
      // 清空输入框
      Object.assign(newCase, {
        TestKey: "",
        Initial_Condition: "",
        Action: "",
        Expected_Result: "",
        InitTestSequences: "",
        ActionTestSequences: "",
        ExpectedTestSequences: "",
      });
    };

    // 删除测试用例
    const deleteTestCase = () => {
      if (selectedRowsAll.value.length === 0) {
        showToast("请先选择要删除的测试用例", "warning");
        return;
      }

      selectedRowsAll.value.forEach((row) => {
        const index = cases.value.findIndex((c) => c.id === row.id);
        console.log(index);

        if (index !== -1) {
          cases.value.splice(index, 1);
        }
        cases.value.forEach((row) => {
          if (row.id > index) {
            row.id = String(Number(row.id) - 1).padStart(3, "0");
          }
        });
        for (let i = casesTable.value.length - 1; i >= 0; i--) {
          const sheet = casesTable.value[i];
          if (sheet.name === "全选") {
            sheet.end -= 1;
            sheet.length -= 1;
          }
          if (sheet.start <= index && sheet.end >= index) {
            sheet.end -= 1;
            sheet.length -= 1;
          } else if (sheet.start > index) {
            sheet.start -= 1;
            sheet.end -= 1;
          }
          // 长度为0时删除
          if (sheet.length === 0) {
            casesTable.value.splice(i, 1);
          }
        }
      });

      selectedRowsAll.value = [];
      selectedRowIds.value = new Set();

      showToast("测试用例已删除", "success");
    };

    const clearTestCase = async () => {
      if (cases.value.length === 0) {
        showToast("当前已无测试用例", "info");
        return;
      }

      try {
        // 二次确认
        await ElMessageBox.confirm(
          "此操作将永久清空所有测试用例，是否继续？",
          "危险操作",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );
      } catch {
        return;
      }

      cases.value = [];
      casesTable.value = [];
      currentTask.value = null;
      isProcessingTask.value = false;
      isDebugRunning.value = false; // 确保停止调试状态，以便触发轮询
      stopPolling(); // 停止可能的轮询过程

      await saveCases([], projectScopeKey.value);
      await saveCasesTable([], projectScopeKey.value);

      currentPage.value = 1;
      selectedRowIds.value = new Set();
      selectedRowsAll.value = [];
      proxy.$refs.caseTable?.clearSelection();

      showToast("全部测试用例已清空", "success");
      
      // 立即触发一次任务轮询
      fetchTasks();
    };

    // 清除所有测试结果
    const clearTestResults = async () => {
      // 检查是否有测试结果
      const hasResults = cases.value.some(
        (c) => c.Result !== undefined && c.Result !== ""
      );
      if (!hasResults) {
        showToast("当前没有测试结果需要清除", "info");
        return;
      }

      try {
        // 二次确认
        await ElMessageBox.confirm(
          "此操作将清除所有测试用例的测试结果（包括测试结果、实际结果），是否继续？",
          "确认清除",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );
      } catch {
        return; // 用户取消
      }

      // 清除所有测试结果字段
      cases.value.forEach((c) => {
        c.Result = undefined;
        c.ActualResult = "";
      });

      // 清空执行日志
      executionLogs.value = {};
      debugRows.value = [];
      selectedCase.value = "";

      // 清除选中状态
      selectedRowIds.value = new Set();
      selectedRowsAll.value = [];
      proxy.$refs.caseTable?.clearSelection();

      // 保存到本地存储
      await saveCases(cases.value, projectScopeKey.value);

      showToast("所有测试结果已清除", "success");
    };

    // 清除日志
    const clearLogs = () => {
      logs.value = [];
      showToast("日志已清除", "info");
    };

    // 选中的行
    const selectedRowsAll = ref([]);
    const selectedRowIds = ref(new Set());

    const syncSelectedRowsAll = () => {
      selectedRowsAll.value = Array.from(selectedRowIds.value)
        .map((id) => cases.value.find((c) => c.id === id))
        .filter(Boolean);
    };
    const debugRows = ref([]);
    const printInfo = () => {
      console.log(selectedCase.value);
    };

    const selectRowsdialogVisible = ref(false);
    const startId = ref("");
    const endId = ref("");

    const selectRows = () => {
      selectRowsdialogVisible.value = true;
    };

    const handleSheetChange = (sheetName) => {
      if (sheetName === "全选") {
        startId.value = cases.value[0]?.id || "";
        endId.value = cases.value[cases.value.length - 1]?.id || "";
        return;
      }
      const sheet = casesTable.value.find((s) => s.sheetName === sheetName);
      if (sheet) {
        startId.value = cases.value[sheet.start].id;
        endId.value = cases.value[sheet.end].id;
      }
    };

    const clearAllSelection = () => {
      selectedRowIds.value = new Set();
      selectedRowsAll.value = [];
      proxy.$refs.caseTable.clearSelection();
      showToast("已取消所有选中用例", "info");
    };

    const caseIdOptions = computed(() =>
      cases.value.map((item) => ({ value: item.id, label: item.id }))
    );

    const selectRowsHandle = () => {
      const start = cases.value.findIndex((caseItem) => caseItem.id === startId.value);
      const end = cases.value.findIndex((caseItem) => caseItem.id === endId.value);
      console.log(start, end);
      if (start === -1 || end === -1) {
        showToast("请选择有效的测试用例", "warning");
        return;
      }
      if (start > end) {
        showToast("起始测试用例不能大于终止测试用例", "warning");
        return;
      }

      const nextSet = new Set(selectedRowIds.value);
      for (let i = start; i <= end; i++) {
        const row = cases.value[i];
        if (row?.id) nextSet.add(row.id);
      }
      selectedRowIds.value = nextSet;
      syncSelectedRowsAll();

      selectRowsdialogVisible.value = false;
      const targetPage = Math.floor(start / pageSize.value) + 1;
      handlePageChange(targetPage);
    };

    // 处理选中改变事件
    const handleSelectionChange = (selection) => {
      if (changePage.value) return;
      if (isConverting.value || isDebugRunning.value) {
        return;
      }
      const selectedIdsOnPage = new Set(selection.map((r) => r.id));
      const nextSet = new Set(selectedRowIds.value);

      paginatedCases.value.forEach((row) => {
        if (!row?.id) return;
        if (selectedIdsOnPage.has(row.id)) nextSet.add(row.id);
        else nextSet.delete(row.id);
      });

      selectedRowIds.value = nextSet;
      syncSelectedRowsAll();
    };

    const handlePageChange = async (newPage) => {
      currentPage.value = newPage;
      changePage.value = true;
      showToast(`切换到第 ${newPage} 页`, "info");

      // 等待表格渲染完成
      await nextTick();

      proxy.$refs.caseTable?.clearSelection();

      // 恢复当前页的选中状态（但不触发滚动）
      paginatedCases.value.forEach((row) => {
        const isSelected = selectedRowIds.value.has(row.id);
        proxy.$refs.caseTable?.toggleRowSelection(row, isSelected);
      });

      changePage.value = false;
    };

    const handlePageChange1 = (newPage) => {
      fetchTestList(newPage);
      showToast(`切换到第 ${newPage} 页`, "info");
    };

    const handlePageChange2 = (newPage) => {
      currentPage2.value = newPage;
      showToast(`切换到第 ${newPage} 页`, "info");
    };
    // 导入xlsm文件
    const fileInput = ref(null);
    const dbcFileInput = ref(null);
    const importXlsmFile = () => {
      fileInput.value.click();
    };

    const fetchActualResultForExcel = async (test_id, command) => {
      try {
        const response = await fetch("/dev-api/api/crop_by_semantics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ test_id, command }),
        });
        const data = await response.json();
        return data.status === "ok" ? data.base64 : "";
      } catch (error) {
        console.error(`Testid ${test_id} 截图失败`, error);
        return "";
      }
    };

    const exportName = ref("");
    const exportTestReport = async (withImages = true) => {
      // ===== 截图缩略图获取 =====
      // 对 Testid 非空的用例，并发拉取其日志目录下全部截图（含 clip 多帧、processed 标注图），
      // Canvas 压缩为宽 360px 的 PNG（仪表图实测约 7KB/张），以 base64 内嵌进 HTML 报告。
      const getThumbnailsForCase = async (testId, maxImages = 6) => {
        if (!testId) return [];
        try {
          const resp = await fetch(
            `/dev-api/test_logs/${encodeURIComponent(testId)}`
          );
          const data = await resp.json();
          if (data.code !== "200") return [];
          // 只取截图原图：过滤 processed_ 前缀的标注图（带识别框，非原始画面）
          const images = (data.result?.logs?.images || [])
            .map((img) => img.filename)
            .filter((name) => !name.startsWith("processed_"));
          if (!images.length) return [];
          // 排序：clip0 → clip05 → clip1 时间序；无 clip 标记的图排前面
          const clipOrder = (name) => {
            const m = name.match(/_clip(\d+)/);
            if (!m) return -1;
            const tag = m[1];
            return tag.startsWith("0") && tag !== "0"
              ? Number(tag) / 10
              : Number(tag);
          };
          const sorted = [...images].sort((a, b) => clipOrder(a) - clipOrder(b));
          // 单条用例最多带 maxImages 张，防多帧用例把报告撑爆
          const batch = sorted.slice(0, maxImages);
          const results = await Promise.all(
            batch.map(async (filename) => {
              try {
                const r = await fetch(
                  `/dev-api/test_logs/${encodeURIComponent(testId)}/image?file=${encodeURIComponent(filename)}`
                );
                if (!r.ok) return null;
                const blob = await r.blob();
                // 只生成缩略图（宽 360px PNG）：
                // 不再内嵌原尺寸图——5800 条全带图时原图占 3/4 体积，会导致报告上百 MB；
                // 需要原图的人走测试日志详情页下载原图。缩略图 360px 悬浮放大已可辨文字。
                const thumbB64 = await new Promise((resolve) => {
                  const img = new Image();
                  const url = URL.createObjectURL(blob);
                  img.onload = () => {
                    URL.revokeObjectURL(url);
                    const makeThumb = (src, w) => {
                      const c = document.createElement("canvas");
                      c.width = w;
                      c.height = Math.max(
                        1,
                        Math.round((src.height / src.width) * w)
                      );
                      const ctx = c.getContext("2d");
                      ctx.imageSmoothingEnabled = true;
                      ctx.imageSmoothingQuality = "high";
                      ctx.drawImage(src, 0, 0, c.width, c.height);
                      return c;
                    };
                    // 逐级 2 倍缩小到接近目标宽度，最后一步精确缩到 targetW（近似 LANCZOS，
                    // 避免一次 drawImage 大比例缩小时的画质损失）
                    let current = img;
                    const targetW = 360;
                    while (current.width > targetW * 2) {
                      current = makeThumb(current, Math.round(current.width / 2));
                    }
                    resolve(makeThumb(current, targetW).toDataURL("image/png"));
                  };
                  img.onerror = () => {
                    URL.revokeObjectURL(url);
                    resolve(null);
                  };
                  img.src = url;
                });
                return thumbB64 ? { filename, b64: thumbB64 } : null;
              } catch {
                return null;
              }
            })
          );
          return results.filter((item) => item);
        } catch (e) {
          console.warn(`获取 ${testId} 截图失败:`, e);
          return [];
        }
      };

      // 并发限制 4：所有用例的截图分批拉取，避免瞬间打满后端
      const fetchAllThumbnails = async (caseList) => {
        const targets = caseList.filter((c) => c.Testid);
        if (targets.length) {
          showToast(`正在获取 ${targets.length} 条用例的截图...`, "info");
        }
        const thumbMap = new Map(); // id -> [{filename, b64}]
        for (let i = 0; i < targets.length; i += 4) {
          const group = targets.slice(i, i + 4);
          const groupResults = await Promise.all(
            group.map((c) => getThumbnailsForCase(c.Testid))
          );
          group.forEach((c, j) => {
            if (groupResults[j]?.length) thumbMap.set(c.id, groupResults[j]);
          });
        }
        return thumbMap;
      };

      // 不含截图模式：跳过全部图片拉取（体积小、生成快）；含截图模式才拉缩略图
      const thumbMap = withImages
        ? await fetchAllThumbnails(cases.value)
        : new Map();

      showToast("正在生成测试报告，请稍等...", "info");

      const list = cases.value;
      const total = list.length;
      const tested = list.filter((c) => c.Result !== undefined && c.Result !== "");
      const pass = tested.filter((c) => /pass/i.test(c.Result)).length;
      const fail = tested.length - pass;
      const untested = total - tested.length;

      const clip = (val) =>
        `<td class="td-clip" title="${(val ?? "").replace(/"/g, "&quot;")}">${
          val ?? ""
        }</td>`;

      const rowsHtml = list
        .map(
          (c) => `
        <tr>
            <td>${c.id}</td>
            <td>${c.TestCaseID ?? ""}</td>
            <td>${c.SyRDIDFSRD ?? ""}</td>
            <td>${c.Auto_testID ?? ""}</td>
            <td>${c.TSR ?? ""}</td>
            <td>${c.CasePriority ?? ""}</td>
            <td>${c.TestMethod ?? ""}</td>
            <td>${c.TestStrategy ?? ""}</td>
            <td>${c.DesignMethod ?? ""}</td>
            <td>${c.TestKey ?? ""}</td>
            ${clip(c.Initial_Condition)}
            ${clip(c.Action)}
            ${clip(c.Expected_Result)}
            ${clip(c.InitTestSequences)}
            ${clip(c.ActionTestSequences)}
            <td>${c.ExpectedTestSequences}</td>
            <td style="background:${
              c.Result === undefined || c.Result === ""
                ? "#f2f3f5"
                : /pass/i.test(c.Result)
                  ? "#d4f8d4"
                  : "#ffe1e1"
            };font-weight:600;color:${
              c.Result === undefined || c.Result === "" ? "#909399" : "#303133"
            }">
                ${c.Result ?? "未测试"}
            </td>
            <td>${(() => {
              const thumbs = thumbMap.get(c.id) || [];
              if (!withImages) {
                return '<span class="empty-img">未导出截图</span>';
              }
              if (!thumbs.length) {
                return '<span class="empty-img">暂无图片</span>';
              }
              // 截图原图缩略图竖排罗列（clip0/clip05/clip1 时间序），hover 放大查看
              return thumbs
                .map(
                  (t) =>
                    `<img class="report-thumb" src="${t.b64}" alt="${t.filename}" title="${t.filename}" />`
                )
                .join("");
            })()}</td>
            <td>${c.Selected ?? ""}</td>
            <td>${c.PRNo ?? ""}</td>
            <td>${c.TestLogs ?? ""}</td>
            <td>${c.Numberoftests ?? ""}</td>
            <td>${c.TestDate ?? ""}</td>
            <td>${c.Remark ?? ""}</td>
        </tr>`
        )
        .join("");

      const html = reportTpl
        .replaceAll("{{TITLE}}", "自动化测试报告")
        .replaceAll("{{TOTAL}}", total)
        .replaceAll("{{PASS}}", pass)
        .replaceAll("{{FAIL}}", fail)
        .replaceAll("{{UNTESTED}}", untested)
        .replace("{{ROWS}}", rowsHtml);

      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const timeStamp = new Date()
        .toLocaleString("zh-CN", { hour12: false })
        .replace(/[/: ]/g, "");
      exportName.value = `TestReport_${withImages ? "withImg" : "noImg"}_${timeStamp}.html`;
      saveAs(blob, `${exportName.value}`);
    };

    // 知识图谱相关数据
    const generateKnowledgeGraphDialogVisible = ref(false);
    const generateKnowledgeGraphLogDiagVisible = ref(false);
    //const generateKnowledgeGraphLog = ref('sadfasdf')
    const generateKnowledgeGraphLog = reactive({
      logs: "",
    });
    const baseurl = "http://172.23.96.54:8000/";
    const serial = "";
    const packageName = "com.desaysv.setting";
    const resourceid = "com.desaysv.setting:id/layout_navigation";

    const IsSendingKnowledgeGraphRequest = ref(false);

    const generateKnowledgeGraph = async () => {
      if (!IsSendingKnowledgeGraphRequest.value) {
        generateKnowledgeGraphDialogVisible.value = true;
      } else {
        generateKnowledgeGraphLogDiagVisible.value = true;
        fetchgenerateKnowledgeGraphLog();
      }
    };

    const fetchgenerateKnowledgeGraphLog = async () => {
      const interval = 5 * 1000; // 5 秒

      const poll = async () => {
        try {
          const response = await fetch(`/dev-api/adb/autotest`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              package: packageName,
              baseurl: baseurl,
              serial: serial,
              resource_id: resourceid,
            }),
          });

          if (response.ok) {
            const clonedResponse = response.clone();
            let data = "";
            try {
              data = await response.json();
            } catch (jsonError) {
              //  console.error('JSON 解析失败:', jsonError);
              data = await clonedResponse.text();
            }

            //console.log(data);
            generateKnowledgeGraphLog.logs = data; // 更新响应式变量的值
          } else {
            clearInterval(pollInterval);
            IsSendingKnowledgeGraphRequest.value = false;
            showToast("接口调用失败", "error");
          }
        } catch (error) {
          clearInterval(pollInterval);
          IsSendingKnowledgeGraphRequest.value = false;
          console.error("接口调用失败:", error);
          showToast("接口调用失败", "error");
        }
      };

      await poll();

      const pollInterval = setInterval(poll, interval); // 每隔 5 秒执行一次 poll

      // 监听弹窗的可见性，如果弹窗关闭则停止轮询
      const stopPollingWhenDialogClosed = watch(
        generateKnowledgeGraphLogDiagVisible,
        (newVal) => {
          if (!newVal) {
            clearInterval(pollInterval);
          }
        }
      );
    };

    const sendGenerateKnowledgeGraphRequest = async () => {
      // 调用接口 dev-api/adb/autotest
      IsSendingKnowledgeGraphRequest.value = true;
      generateKnowledgeGraphDialogVisible.value = false;

      const maxPollingTime = 45 * 60 * 1000;
      const interval = 30 * 1000;

      const poll = async () => {
        try {
          const response = await fetch(`/dev-api/adb/autotest`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              package: packageName,
              baseurl: baseurl,
              serial: serial,
              resource_id: resourceid,
            }),
          });

          if (response.ok) {
            const clonedResponse = response.clone();
            let data = "";
            try {
              data = await response.json();
            } catch (jsonError) {
              //  console.error('JSON 解析失败:', jsonError);
              data = await clonedResponse.text();
            }

            //console.log(data);
            if (typeof data === "string" && data.includes("[Done]")) {
              clearInterval(pollInterval1);
              IsSendingKnowledgeGraphRequest.value = false;
              showToast("知识图谱生成成功", "success");
            } else if (typeof data === "string" && data.includes("[Error]")) {
              clearInterval(pollInterval1);
              IsSendingKnowledgeGraphRequest.value = false;
              showToast("知识图谱生成失败,请检测日志", "error");
            } else {
              showToast("知识图谱生成中,请稍后...", "info");
            }
          } else {
            clearInterval(pollInterval1);
            IsSendingKnowledgeGraphRequest.value = false;
            showToast("接口调用失败", "error");
          }
        } catch (error) {
          clearInterval(pollInterval1);
          IsSendingKnowledgeGraphRequest.value = false;
          console.error("接口调用失败:", error);
          showToast("接口调用失败", "error");
        }
      };

      const pollInterval1 = setInterval(poll, interval);

      await poll();

      // 确保在最大轮询时间后停止轮询
      setTimeout(() => {
        clearInterval(pollInterval1);
        if (IsSendingKnowledgeGraphRequest.value) {
          IsSendingKnowledgeGraphRequest.value = false;
          showToast("知识图谱生成超时", "warning");
        }
      }, maxPollingTime);
    };

    const selectDbcFile = () => {
      dbcFileInput.value.click();
      showToast("请选择DBC文件", "info");
    };

    // ===== UE PDF 导入（知识图谱） =====
    const uePdfFileInput = ref(null);
    const uePdfLoading = ref(false);
    const ueKgDialogVisible = ref(false);
    const ueKgJsonContent = ref("");
    const ueKgSaveLoading = ref(false);
    const selectUePdfFile = async () => {
      // 先查是否有已保存的知识图谱——有则直接开 modal（展示现有 JSON 可编辑），无则选文件
      try {
        const resp = await fetch("/dev-api/api/get_ue_knowledge_graph");
        const data = await resp.json();
        if (data.success && data.has_graph && data.kg_json) {
          ueKgJsonContent.value = data.kg_json;
          ueKgDialogVisible.value = true;
          return; // 已有图谱，直接开 modal（不选文件）
        }
      } catch (e) {
        // 查询失败则回退到选文件
      }
      // 没有已保存图谱 → 选文件上传
      uePdfFileInput.value.click();
      showToast("请选择UE交互PDF文件", "info");
    };
    const handleUePdfUpload = async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        showToast(`文件 ${file.name} 不是.pdf格式`, "error");
        event.target.value = "";
        return;
      }
      uePdfLoading.value = true;
      showToast(`正在导入: ${file.name}（LLM生成知识图谱约需30-60秒）`, "info");
      try {
        // 直接传 PDF 文件到 /api/import_ue_pdf（multipart）
        const formData = new FormData();
        formData.append("file", file);
        const impResp = await fetch("/dev-api/api/import_ue_pdf", {
          method: "POST",
          body: formData,
        });
        const impData = await impResp.json();
        if (impData.success) {
          // 弹窗展示生成的 JSON（可编辑）
          ueKgJsonContent.value = impData.kg_json || JSON.stringify({}, null, 2);
          ueKgDialogVisible.value = true;
          showToast(impData.result || "知识图谱生成成功", "success", 8000);
        } else {
          showToast(`导入失败: ${impData.error}`, "error", 8000);
        }
      } catch (e) {
        showToast(`导入UE文件出错: ${e.message}`, "error");
      } finally {
        uePdfLoading.value = false;
        event.target.value = "";
      }
    };
    // 重新上传（关闭弹窗，重新选文件）
    const ueReupload = () => {
      ueKgDialogVisible.value = false;
      setTimeout(() => selectUePdfFile(), 200);
    };
    // 保存到当前会话（校验 JSON 格式 → 调后端保存）
    const ueSaveToSession = async () => {
      // 前端先校验 JSON 格式
      try {
        JSON.parse(ueKgJsonContent.value);
      } catch (e) {
        showToast(`JSON 格式错误: ${e.message}`, "error");
        return;
      }
      ueKgSaveLoading.value = true;
      try {
        const resp = await fetch("/dev-api/api/save_ue_knowledge_graph", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ json_content: ueKgJsonContent.value }),
        });
        const data = await resp.json();
        if (data.success) {
          showToast(data.message || "知识图谱已保存到当前会话", "success");
          ueKgDialogVisible.value = false;
        } else {
          showToast(`保存失败: ${data.error}`, "error");
        }
      } catch (e) {
        showToast(`保存出错: ${e.message}`, "error");
      } finally {
        ueKgSaveLoading.value = false;
      }
    };

    const handleFileUpload = (event) => {
      cases.value = [];
      casesTable.value = [];
      const file = event.target.files[0];
      if (file && file.type === "application/vnd.ms-excel.sheet.macroEnabled.12") {
        showToast(`正在导入文件: ${file.name}`, "info");
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const wb = XLSX.read(data, { type: "array" });

          if (wb.SheetNames.includes("ModuleName")) {
            const ws = wb.Sheets["ModuleName"];
            const json = XLSX.utils.sheet_to_json(ws, { range: 7, defval: "" });

            json.forEach((row) => {
              const newId = `${String(cases.value.length + 1).padStart(3, "0")}`;
              cases.value.push({
                id: newId,

                TestCaseID: (row["Test Case ID\r\n测试caseID"] ?? "").toString().trim(),
                SyRDIDFSRD: (row["RD ID/(FSR/TSR）\r\n需求ID"] ?? "").toString().trim(),
                Auto_testID: "",
                TSR: "",
                CasePriority: (row["Case_Priority\r\n优先级"] ?? "").toString().trim(),
                DesignMethod: (row["Design Method \r\n设计方法"] ?? "").toString().trim(),
                TestMethod: (row["Test Method \r\n测试方法"] ?? "").toString().trim(),
                TestStrategy: "", // 用“测试目的”当功能点
                Initial_Condition: (row["Pre-condition\r\n前提条件"] ?? "")
                  .toString()
                  .trim(),
                Action: (row["Test Steps\r\n测试步骤"] ?? "").toString().trim(),
                Expected_Result: (row["Expected Result\r\n期望结果"] ?? "")
                  .toString()
                  .trim(),

                /* 这三列新模板也是空的，先留空 */
                InitTestSequences: "",
                ActionTestSequences: "",
                ExpectedTestSequences: "",

                Selected: (row["Selected\r\n是否选择"] ?? "").toString().trim(),
                Result: (row["Test  Result \r\n测试结果"] ?? "").toString().trim(),
                ActualResult: (row["Actual Result\r\n实际结果"] ?? "").toString().trim(),
                PRNo: (row["PR No.\r\nBug编号"] ?? "").toString().trim(),
                TestLogs: (row["Test Log\r\n测试日志"] ?? "").toString().trim(),
                Numberoftests: (row["Executions\r\n执行次数"] ?? "").toString().trim(),
                TestDate: (row["Test Date\r\n测试日期"] ?? "").toString().trim(),
                Remark: (row["Remark\r\n测试备注"] ?? "").toString().trim(),
              });
            });

            casesTable.value = [
              {
                sheetName: "ModuleName",
                start: 0,
                end: cases.value.length - 1,
                length: cases.value.length,
              },
            ];
            showToast(`多工作表(ModuleName)导入完成: ${file.name}`, "success");
            return;
          }

          const worksheet = wb.Sheets[wb.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(worksheet);
          console.log(json);

          json.forEach((row) => {
            const newId = `${String(cases.value.length + 1).padStart(3, "0")}`;
            cases.value.push({
              id: newId,
              TestCaseID: row["Test Case ID"] ?? "",
              SyRDIDFSRD: row["SyRD ID/SRD"] ?? row["SyRD ID/FSR"] ?? "",
              Auto_testID: row["Auto_test ID"] ?? "",
              TSR: row["TSR"] ?? "",
              CasePriority: row["Case\nPriority"] ?? row["Case Priority"] ?? "",
              DesignMethod: row["Design Method "] ?? row["DesignMethod"] ?? "",
              TestMethod: row["Test Method"] ?? "",
              TestStrategy: row["Test\nStrategy "] ?? row["Test Strategy"] ?? "",
              TestKey: row["Test Key\n功能点"] ?? row["Test Key"] ?? "",
              Initial_Condition: row["初始条件序列"] ?? "",
              Action: row["操作步骤序列"] ?? "",
              Expected_Result:
                row["Expected Result\n期望结果"] ?? row["Expected Result"] ?? "",
              Selected: row["Selected"] ?? "",
              Result: row["Test  Result"] ?? row["Test Result"],
              ActualResult: row["Actual Result"],
              PRNo: row["PR No."] ?? "",
              TestLogs: row["Test Log"] ?? row["Test Logs"] ?? "",
              Numberoftests: row["Number of tests"] ?? "",
              TestDate: row["Test Date"] ?? "",
              Remark: row["Remark"] ?? "",
              InitTestSequences:
                row["Init Test Sequences\n测试序列前置条件"] ??
                row["Init Test Sequences"] ??
                "",
              ActionTestSequences:
                row["Action Test Sequences\n动作测试序列"] ??
                row["Action Test Sequences"] ??
                "",
              ExpectedTestSequences:
                row["Expected Test Sequences\n预期测试序列结果"] ??
                row["Expected Test Sequences"] ??
                "",
            });
          });
          showToast(`文件导入完成: ${file.name}`, "success");
        };
        reader.readAsArrayBuffer(file);
      } else if (
        file &&
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        showToast(`正在导入文件: ${file.name},请等待！`, "info");
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });

          // 获取工作表数量
          const sheetCount = workbook.SheetNames.length;

          let start = 0;

          // 遍历所有工作表
          for (let i = 1; i < sheetCount - 1; i++) {
            const sheetName = workbook.SheetNames[i];
            const worksheet = workbook.Sheets[sheetName];

            // 识别用例 sheet 及其表头行位置：
            // 旧模板表头在第7行（range:6），新模板（捷途3.0）表头在第8行（range:7），
            // 且新模板开头有非用例 sheet（Cover/功能模块/变更记录等），需按表头内容跳过
            let headerRange = 6;
            {
              const headerOld = XLSX.utils.sheet_to_json(worksheet, { range: 6, header: 1, defval: "" });
              const headerNew = XLSX.utils.sheet_to_json(worksheet, { range: 7, header: 1, defval: "" });
              const rowIsCaseHeader = (arr) =>
                Array.isArray(arr) &&
                arr.some((cell) => String(cell).includes("Test Case ID"));
              if (rowIsCaseHeader(headerNew[0])) {
                headerRange = 7;
              } else if (!rowIsCaseHeader(headerOld[0])) {
                // 两行都不是用例表头 → 非用例 sheet（封面/变更记录等），跳过
                continue;
              }
            }

            const json = XLSX.utils.sheet_to_json(worksheet, { range: headerRange });
            const length = json.length;
            casesTable.value.push({
              sheetName: sheetName,
              start: start,
              end: start + length - 1,
              length: length,
            });
            start = start + length;
            json.forEach((row) => {
              const newId = `${String(cases.value.length + 1).padStart(3, "0")}`;
              cases.value.push({
                id: newId,
                TestCaseID:
                  row["Test Case ID"] ??
                  row["Test Case ID\r\n测试caseID"] ??
                  "",
                SyRDIDFSRD:
                  row["SyRD ID/FSR"] ??
                  row["RD ID/(FSR/TSR）\r\n需求ID"] ??
                  "",
                Auto_testID: row["Auto_test ID"] ?? "",
                TSR: row["TSR"] ?? "",
                CasePriority:
                  row["Case\r\nPriority"] ??
                  row["Case_Priority\r\n优先级"] ??
                  "",
                DesignMethod:
                  row["Design Method "] ??
                  row["Design Method \r\n设计方法"] ??
                  "",
                TestMethod:
                  row["Test Method"] ??
                  row["Test Method\r\n测试方法"] ??
                  "",
                TestStrategy:
                  row["Test\r\nStrategy "] ??
                  row["Test Goal\r\n测试目的"] ??
                  "",
                TestKey: row["Test Key\r\n功能点"] ?? row["Test Key"] ?? "",
                Initial_Condition:
                  row["Pre-condition\r\n前提条件"] ??
                  row["Initial_Condition"] ??
                  "",
                Action:
                  row["Action\r\n操作步骤"] ??
                  row["Test Steps\r\n测试步骤"] ??
                  "",
                Expected_Result:
                  row["Expected Result\r\n期望结果"] ??
                  row["Expected Result"] ??
                  "",
                InitTestSequences:
                  row["Init Test Sequences\r\n测试序列前置条件"] ??
                  row["Init Test Sequences"] ??
                  "",
                ActionTestSequences:
                  row["Action Test Sequences\r\n动作测试序列"] ??
                  row["Action Test Sequences"] ??
                  "",
                ExpectedTestSequences:
                  row["Expected Test Sequences\r\n预期测试序列结果"] ??
                  row["Expected Test Sequences"] ??
                  "",
                Selected: row["Selected"] ?? row["Selected\r\n是否选择"] ?? "",
                Result:
                  row["Test Result"] ??
                  row["Test  Result \r\n测试结果"] ??
                  "",
                ActualResult:
                  row["Actual Result"] ??
                  row["Actual Result\r\n实际结果"] ??
                  "",
                PRNo: row["PR No."] ?? row["PR No.\r\nBug编号"] ?? "",
                TestLogs: row["Test Logs"] ?? row["Test Log\r\n测试日志"] ?? "",
                TestDate: row["Test Date"] ?? row["Test Date\r\n测试日期"] ?? "",
                Remark: row["Remark"] ?? row["Remark\r\n测试备注"] ?? "",
              });
            });
          }
          casesTable.value.unshift({
            sheetName: "全选",
            start: 0,
            end: cases.value.length - 1,
            length: cases.value.length,
          });
          showToast(`文件导入完成: ${file.name}`, "success");
        };
        reader.readAsArrayBuffer(file);
      } else {
        showToast("请选择有效的 xlsm 文件", "error");
      }
    };

    const startTime = ref();
    const endTime = ref();

    const scrollToCase = async (caseId) => {
      const caseIndex = cases.value.findIndex((c) => c.id === caseId);
      if (caseIndex === -1) return;

      const targetPage = Math.floor(caseIndex / pageSize.value) + 1;
      const rowInPage = caseIndex % pageSize.value;

      // 翻页
      if (targetPage !== currentPage.value) {
        currentPage.value = targetPage;
        changePage.value = true;

        await nextTick();
        await new Promise((resolve) => setTimeout(resolve, 150));

        changePage.value = false;
      }

      await nextTick();
      const table = proxy.$refs.caseTable;
      if (table) {
        changePage.value = true;
        table.clearSelection();
        paginatedCases.value.forEach((row) => {
          const isSelected = selectedRowIds.value.has(row.id);
          console.log(`[restore] ${row.id}: ${isSelected}`);
          table.toggleRowSelection(row, isSelected);
        });
        changePage.value = false;
      }
      if (!table) return;
      const rowData = paginatedCases.value[rowInPage];
      if (rowData) {
        table.setCurrentRow(rowData);
      }

      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));

      const bodyWrapper = table.$el.querySelector(
        ".el-table__body-wrapper .el-scrollbar__wrap"
      );
      if (!bodyWrapper) {
        console.log("[scrollToCase] 未找到滚动容器");
        return;
      }

      const rows = table.$el.querySelectorAll(".el-table__body tbody tr");
      if (!rows || rows.length === 0) {
        console.log("[scrollToCase] 未找到行元素");
        return;
      }
      const targetRow = rows[rowInPage];
      if (!targetRow) {
        console.log(`[scrollToCase] 未找到第 ${rowInPage} 行`);
        return;
      }

      const wrapperRect = bodyWrapper.getBoundingClientRect();
      const rowRect = targetRow.getBoundingClientRect();

      const currentRelativeTop = rowRect.top - wrapperRect.top;

      const tableHeader = table.$el.querySelector(".el-table__header-wrapper");
      const headerHeight = tableHeader ? tableHeader.getBoundingClientRect().height : 0;
      const offset = 10; 

      const scrollOffset = currentRelativeTop - headerHeight - offset;

      const currentScrollTop = bodyWrapper.scrollTop;
      const targetScrollTop = currentScrollTop + scrollOffset;

      console.log(
        `[scrollToCase] 当前滚动: ${currentScrollTop}, 需要偏移: ${scrollOffset}, 目标: ${targetScrollTop}`
      );
      console.log(
        `[scrollToCase] 行当前位置: ${currentRelativeTop}, 表头高: ${headerHeight}`
      );

      bodyWrapper.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: "smooth",
      });
    };

    // 模拟模式开关
    const isMockMode = ref(false); 

    const runMockTestCase = (id, row) => {
      return new Promise((resolve) => {
        const mockTime = 2000;

        if (!executionLogs.value[id]) {
          executionLogs.value[id] = [];
        }
        executionLogs.value[id].push({
          log_id: 1,
          time: new Date().toLocaleString("zh-CN", { hour12: false }).replace(/\//g, "-"),
          message: `[模拟模式] 开始执行用例 ${id}`,
        });

        const steps = row.ActionTestSequences
          ? row.ActionTestSequences.split("\n").filter(Boolean)
          : ["模拟步骤1", "模拟步骤2"];
        let stepIndex = 0;

        const stepInterval = setInterval(() => {
          if (stepIndex < steps.length) {
            executionLogs.value[id].push({
              log_id: executionLogs.value[id].length + 1,
              time: new Date()
                .toLocaleString("zh-CN", { hour12: false })
                .replace(/\//g, "-"),
              message: `[模拟步骤${stepIndex + 1}] ${steps[stepIndex]}`,
            });
            stepIndex++;
          }
        }, 500);

        setTimeout(() => {
          clearInterval(stepInterval);

          const isPass = Math.random() > 0.2;
          const result = isPass ? "Pass" : "Fail";

          const index = cases.value.findIndex((c) => c.id === id);
          if (index !== -1) {
            cases.value[index].Result = result;
            cases.value[index].Testid = `mock_${id}_${Date.now()}`;
          }

          executionLogs.value[id].push({
            log_id: executionLogs.value[id].length + 1,
            time: new Date()
              .toLocaleString("zh-CN", { hour12: false })
              .replace(/\//g, "-"),
            message: `[模拟模式] 执行完成，结果：${result}`,
          });

          resolve({ result });
        }, mockTime);
      });
    };

    const isCarryOverInit = (val) => {
      const strVal = val ?? "";
      const result = strVal.includes("接上一case") || strVal.trim() === "";
      console.log('isCarryOverInit 被调用，输入值:', val, 'strVal:', JSON.stringify(strVal), '结果:', result);
      return result;
    };

    const startDebugging = async () => {
      if (selectedRowsAll.value.length === 0) {
        showToast("请先选择要调试的测试用例", "warning");
        return;
      }

      if (isMockMode.value) {
        showToast(
          `[模拟模式] 开始执行 ${selectedRowsAll.value.length} 条用例，不调用真实接口`,
          "info"
        );
      }
      activeName.value = "third";
      isDebugRunning.value = true;
      debugRows.value = [];
      startTime.value = parseInt(Date.now());

      let index = 0;
      while (index < selectedRowsAll.value.length && isDebugRunning.value) {
        const row = selectedRowsAll.value[index];
        const caseStartTime = Date.now(); // 记录单条用例开始时间
        currentExecutingId.value = row.id;
        await scrollToCase(row.id);

        try {
          if (!debugRows.value.some((dr) => dr.id === row.id)) {
            debugRows.value.push(row);
          }
          selectedCase.value = row.id;
          const initSeq = isCarryOverInit(row.InitTestSequences) ? "" : (row.InitTestSequences ?? "");
          const actSeq = (row.ActionTestSequences ?? "").toString().trim();
          const expSeq = (row.ExpectedTestSequences ?? "").toString().trim();
          if (!actSeq && !expSeq) {
            showToast(`用例${row.id}缺少操作步骤和预期结果，无法执行`, "error");
            index++;
            continue;
          }
          const query = `前提条件: ${initSeq} 操作步骤: ${actSeq} 预期结果:${expSeq}`;
          const baseurl = url.value;
          if (isMockMode.value) {
            await runMockTestCase(row.id, row);
          } else {
            await runTestCase(query, baseurl, row.id, row);
          }
          
          // 自动化任务：每执行完一条上报一次结果
          if (currentTask.value) {
            const durationMs = Date.now() - caseStartTime;
            await reportCaseResult(row, durationMs);
          }
        } catch (error) {
          showToast(`测试用例${row.id}调试失败`, "error");
        } finally {
          currentExecutingId.value = "";
          await nextTick();
        }

        index++;
      }

      isDebugRunning.value = false;
      endTime.value = parseInt(Date.now());
      currentExecutingId.value = "";
      showToast("调试已完成", "info");

      // 检查自动化任务是否全部执行完毕
      if (currentTask.value) {
        const allFinished = cases.value.every(
          (c) => c.Result !== undefined && c.Result !== ""
        );
        if (allFinished) {
          await reportTaskComplete();
          isProcessingTask.value = false;
          showToast("自动化任务所有用例执行完毕，恢复任务轮询", "success");
        }
      }
    };

    // 运行测试用例
    const runTestCase = (query, baseurl, id, row) => {
      return new Promise((resolve, reject) => {
        try {
          startPollingForDebugResults(query, baseurl, id, resolve, reject, row);
        } catch (error) {
          reject(error);
        }
      });
    };

    const prompt1 = ref("");
    const caseConversionDialogVisible = ref(false);

    const promptCaseConversion = () => {
      caseConversionDialogVisible.value = true;
    };

    // const rowClassName = ({ row }) => {
    //   if (row._executing || row.id === currentExecutingId.value) {
    //     return "executing-row";
    //   }
    //   return "";
    // };

    const rowClassName = ({ row }) => {
      // 只根据 currentExecutingId 判断，不依赖其他状态
      if (row.id === currentExecutingId.value) {
        return "executing-row";
      }
      return "";
    };

    const currentTestId = ref("");
    const stopDebugging = async () => {
      isDebugRunning.value = false;
      currentExecutingId.value = "";
      currentPage.value = 1;
      tableKey.value++;
      debugRows.value = [];
      selectedCase.value = "";
      stopPolling();
      executionLogs.value = {};

      selectedRowIds.value = new Set();
      syncSelectedRowsAll();

      await nextTick();
      const table = proxy.$refs.caseTable;
      if (table) {
        changePage.value = true;
        table.clearSelection();
        changePage.value = false;
      }

      if (currentTestId.value) {
        const stoppingTestId = currentTestId.value;
        try {
          await fetch(`/dev-api/cancelsession`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ test_id: stoppingTestId }),
          });
          showToast("已发送停止指令", "info");
        } catch (e) {
          console.error("cancelSession 失败", e);
        } finally {
          cleanupMobileAgentSession(stoppingTestId);
        }
      }
    };

    const abortCurrentTest = () => {
      isDebugRunning.value = false;
      if (currentTestId.value) {
        const abortingTestId = currentTestId.value;
        fetch("/dev-api/cancelsession", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ test_id: abortingTestId }),
        }).catch(() => {});
        cleanupMobileAgentSession(abortingTestId);
      }
      stopPolling();
    };

    const userLogs = ref([]);
    const getRowStyle = ({ row }) => row.rowStyle || {};
    const changeColor = (caseId, finalColor, succ, fail, index) => {
      const logs = userLogs.value.filter((u) => u.caseId === caseId);
      if (index < logs.length) {
        logs[index].type = succ >= fail ? "success" : "error";
        logs[index].rowStyle = {
          backgroundColor: finalColor,
          fontWeight: "bold",
          color: "black",
        };
        index++;
        const randomInterval = Math.random() * (0.8 - 0.3) + 0.3;
        setTimeout(() => {
          changeColor(caseId, finalColor, succ, fail, index);
        }, randomInterval * 1000);
      }
    };

    const iconDialogVisible = ref(false);
    const iconInfo = ref({});
    const saveIconLoading = ref(false);
    const tap_iconInfo = ref("");
    // 接口返回的 base64
    const showIcon = async () => {
      showToast("正在获取图标...", "info");
      try {
        const params = new URLSearchParams({
          base_url: url.value,
          page_key: tap_iconInfo.value,
        });
        const res = await fetch(`/dev-api/api/getcurrenticon?${params}`, {
          method: "GET",
        }).then((r) => r.json());
        if (String(res.code) === "200") {
          iconInfo.value.img_base64 = res.result.img_base64;
          iconInfo.value.page_hash = res.result.page_hash;
          const rawLines = (res.result.icon_names || "").split("\n");
          iconInfo.value.iconList = rawLines.map((line, idx) => {
            const [coord, name = ""] = line.split(": ");
            return {
              index: idx + 1,
              coord: coord.trim(),
              name: name.trim(),
            };
          });
          console.log(iconInfo.value);

          iconDialogVisible.value = true;
        } else {
          ElMessage.error(res.msg || "获取图标失败");
        }
      } catch (e) {
        ElMessage.error("网络异常：" + e.message);
      }
    };

    const saveIconNames = async () => {
      saveIconLoading.value = true;
      try {
        const iconNamesStr = iconInfo.value.iconList
          .map((it) => `${it.coord}: ${it.name}`)
          .join("\n");

        const res = await fetch("/dev-api/api/setcurrenticon", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page_key: iconInfo.value.page_hash,
            icon_names: iconNamesStr,
          }),
        }).then((r) => r.json());

        if (String(res.code) === "200") {
          ElMessage.success(res.msg || "图标名称已保存");
          iconDialogVisible.value = false;
        } else {
          ElMessage.error(res.msg || "保存失败");
        }
      } catch (e) {
        ElMessage.error("网络异常：" + e.message);
      } finally {
        saveIconLoading.value = false;
      }
    };

    const startPollingForDebugResults = async (
      query,
      baseurl,
      id,
      resolve,
      reject,
      row
    ) => {
      showToast("发送调试请求成功，日志将在下方测试执行日志展示！", "success");
      userLogs.value = [];
      const initSteps = isCarryOverInit(row.InitTestSequences)
        ? []
        : (row.InitTestSequences ?? "").split("\n").filter(Boolean);
      const steps = initSteps.concat((row.ActionTestSequences ?? "").split("\n").filter(Boolean));
      const logList = steps.map((text, idx) => ({
        step_id: idx + 1,
        msg: `${text}`,
        type: "waiting",
        caseId: row.id,
        rowStyle: { backgroundColor: "#ffffff" },
      }));
      userLogs.value = logList;

      executionLogs.value[id] = [];
      executionLogs.value[id].push({
        log_id: 1,
        time: new Date()
          .toLocaleString("zh-CN", {
            hour12: false,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
          .replace(/\//g, "-"),
        message: `开始调试，请等待！`,
      });

      let testIdFound = false;
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/dev-api/chat", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Accept", "text/event-stream");
      let lastProcessedLength = 0;
      let pendingStreamText = "";
      let thinkFlag = false;

      xhr.onreadystatechange = () => {
        // LOADING(3) 和 DONE(4) 都要处理。最后一个 SSE 分片经常只在 DONE 时到达，
        // 若只处理 readyState=3，会出现后端已返回但前端缺少最后一条“工具结果”。
        if ((xhr.readyState === 3 || xhr.readyState === 4) && isDebugRunning.value) {
          const newResponseText = xhr.responseText.slice(lastProcessedLength);
          lastProcessedLength = xhr.responseText.length;
          pendingStreamText += newResponseText;
          const lines = pendingStreamText.split(/\r?\n/);
          if (xhr.readyState === 3) {
            // 保留尚未收到换行符的半行，等待下一个网络分片后再解析。
            pendingStreamText = lines.pop() ?? "";
          } else {
            // DONE 时把最终不带换行符的残留行也一并处理。
            pendingStreamText = "";
          }
          lines.forEach(async (line) => {
            if (line.trim() === "") return;
            if (line === "") return;
            const succ = (line.match(/执行成功/g) || []).length;
            const fail = (line.match(/执行失败/g) || []).length;
            if (succ + fail > 0) {
              const finalColor = succ >= fail ? "rgb(31 181 51)" : "#eb1919";
              await changeColor(row.id, finalColor, succ, fail, 0);
            }
            const procedureStartIndex = line.indexOf("<procedure>");
            const procedureEndIndex = line.indexOf(
              "<procedure>",
              procedureStartIndex + 1
            );

            if (procedureStartIndex !== -1 && procedureEndIndex !== -1) {
              const contentBetweenProcedures = line.substring(
                procedureStartIndex + "<procedure>".length,
                procedureEndIndex
              );
              const procedureText =
                contentBetweenProcedures.match(/_([^_]+)_/)?.[1] ?? "";
              const hasTapIcon = /<tap_icon>/.test(contentBetweenProcedures);

              console.log(hasTapIcon);
              if (hasTapIcon) {
                const tapIconStartIndex = contentBetweenProcedures.indexOf("<tap_icon>");
                const tapIconEndIndex = contentBetweenProcedures.indexOf(
                  "<tap_icon>",
                  tapIconStartIndex + 1
                );
                const contentBetweenTapIcon = contentBetweenProcedures.substring(
                  tapIconStartIndex + "<tap_icon>".length,
                  tapIconEndIndex
                );
                const tapIconText = contentBetweenTapIcon.match(/_([^_]+)_/)?.[1] ?? "";
                tap_iconInfo.value = tapIconText;
                console.log(tap_iconInfo.value);

                const firstWaitingIdx = userLogs.value.findIndex(
                  (log) => log.caseId === row.id && log.type === "waiting"
                );

                if (firstWaitingIdx !== -1) {
                  const firstLog = userLogs.value[firstWaitingIdx];
                  firstLog.type = "success";
                  firstLog.rowStyle = {
                    backgroundColor: "rgb(31 181 51)",
                    fontWeight: "bold",
                    color: "black",
                  };
                  if (!firstLog.subSteps) firstLog.subSteps = [];
                  firstLog.subSteps.push({
                    text: "点击成功",
                    hasTapIcon: true,
                  });
                }
              }
              if (line.includes("成功")) {
                console.log("添加procedure");

                const targetIdx = userLogs.value.findIndex(
                  (log) =>
                    log.caseId === row.id && contentBetweenProcedures.includes(log.msg)
                );
                console.log(targetIdx);

                if (targetIdx !== -1) {
                  const toGreen = [];
                  for (let i = 0; i <= targetIdx; i++) {
                    const log = userLogs.value[i];
                    if (log.caseId === row.id && log.type === "waiting") {
                      toGreen.push(i);
                    }
                  }
                  let delay = 0;
                  toGreen.forEach((idx) => {
                    delay += (Math.random() * 0.5 + 0.3) * 1000;
                    setTimeout(() => {
                      const log = userLogs.value[idx];
                      log.type = "success";
                      log.rowStyle = {
                        backgroundColor: "rgb(31 181 51)",
                        fontWeight: "bold",
                        color: "black",
                      };
                    }, delay);
                  });

                  const targetLog = userLogs.value[targetIdx];

                  if (!targetLog.subSteps) targetLog.subSteps = [];

                  targetLog.subSteps.push({
                    text: procedureText,
                    hasTapIcon: false,
                  });
                }
              }
            }

            const iconStart = line.indexOf("<iconnotfound>");
            const iconEnd = line.indexOf("<iconnotfound>", iconStart + 1);
            if (iconStart !== -1 && iconEnd !== -1) {
              const rawTip = line.slice(iconStart + "<iconnotfound>".length, iconEnd);
              const missingIcon = rawTip.match(/图标\s*['"](.+?)['"]/)?.[1] ?? "未知图标";

              abortCurrentTest();
              iconConfigTip.value = `图标 “${missingIcon}” 没有历史记录且未提供坐标，请添加图标！`;
              iconConfig();
              ElMessage.error(`检测到缺失图标：${missingIcon}`);
              return;
            }

            const match = line.match(/data: \[.*?\]\{"test_id": "(.*?)"\}/);

            if (!testIdFound) {
              if (match) {
                const test_id = match[1];
                currentTestId.value = test_id;
                mobileAgentSessionCaseIds.set(test_id, id);
                if (!mobileAgentLastEventTimes.has(test_id)) {
                  mobileAgentLastEventTimes.set(test_id, Date.now() / 1000 - 5);
                }
                testIdFound = true;
                const pollForResult = async () => {
                  const maxPollingTime = 600000; // 600s
                  const interval = 5000; // 5s
                  let elapsedTime = 0;

                  const intervalId = setInterval(async () => {
                    const index = cases.value.findIndex((c) => c.id === id);
                    try {
                      const response = await fetch(`/dev-api/result/${test_id}`);
                      const data = await response.json();
                      if (data.result !== null) {
                        if (index !== -1) { 
                          cases.value[index].Result = data.result;
                          cases.value[index].Testid = test_id;
                        }
                        fetchTestList(1); // 刷新测试用例列表
                        clearInterval(intervalId); // 停止轮询
                        cleanupMobileAgentSession(test_id);
                        // 测试完成：清除确认弹窗和残留状态，停止全局轮询
                        mobileAgentConfirmation.value = null;
                        mobileAgentConfirmVisible.value = false;
                        resolve(data); // 完成请求，调用 resolve
                      }
                    } catch (error) {
                      if (index !== -1) {
                        cases.value[index].Result = "获取测试结果失败";
                        cases.value[index].Testid = test_id;
                      }
                      console.error("Error fetching result:", error);
                      reject(error); // 失败请求，调用 reject
                    }

                    elapsedTime += interval;
                    if (elapsedTime >= maxPollingTime) {
                      if (index !== -1) {
                        cases.value[index].Result = "超时未获取测试结果";
                        cases.value[index].Testid = test_id;
                      }
                      fetchTestList(1); // 刷新测试用例列表
                      clearInterval(intervalId); // 停止轮询
                      cleanupMobileAgentSession(test_id);
                      // 超时：同样清除确认弹窗和残留状态
                      mobileAgentConfirmation.value = null;
                      mobileAgentConfirmVisible.value = false;
                      reject(new Error("超时未获取测试结果"));
                    }
                  }, interval);

                  pollingIntervals[test_id] = intervalId;
                };

                pollForResult(); // 启动轮询
                return;
              }
            }

            if (testIdFound && match) return;
            if (line.includes("<think>")) {
              thinkFlag = true;
              return;
            }
            if (line.includes("</think>")) {
              thinkFlag = false;
              return;
            }
            if (thinkFlag) return;
            try {
              executionLogs.value[id].push({
                log_id: executionLogs.value[id].length + 1,
                time: new Date()
                  .toLocaleString("zh-CN", {
                    hour12: false,
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
                  .replace(/\//g, "-"),
                message: `${line}`,
              });
            } catch (parseError) {
              console.error("Error parsing chunk:", parseError);
            }
          });
        } else if (!isDebugRunning.value) {
          return;
        }
      };

      xhr.onload = () => {
        showToast(`测试用例${id}已停止1`, "info");
        resolve(null);
      };

      xhr.onerror = (error) => {
        console.error("Error in stream:", error);
        showToast(`测试用例${id}已停止2`, "error");
        reject(error);
      };

      var value = langOptions.value.find((item) => item.label === currentLang.value)
        .value;
      xhr.send(
        JSON.stringify({
          query: query,
          baseurl: baseurl,
          lang: value,
          model_name: model_name.value,
          detect_before_timeout: testConfig.preWaitSec + "",
          exploration_mode: testConfig.explorationMode || "approval",
          is_reset: testConfig.isReset ? "true" : "false",
          reset_delay_sec: testConfig.resetDelaySec + "",
          is_clip: testConfig.isClip ? "true" : "false",
        })
      );
    };

    const isConverting = ref(false);
    const isConversionPaused = ref(false);
    const isConversionCanceled = ref(false);
    const conversionActiveXhr = ref(null);
    const conversionProgress = ref(0); // 当前进度百分比
    const conversionCurrent = ref(0); // 当前处理数量
    const conversionTotal = ref(0); // 总数量
    const conversionCurrentId = ref(""); // 当前正在转化的用例ID
    const conversionDialogVisible = ref(false); // 进度弹窗显示状态

    const conversionStatusText = computed(() => {
      if (isConversionPaused.value) return "已暂停";
      return conversionCurrentId.value || "准备中...";
    });

    const toggleConversionPause = () => {
      isConversionPaused.value = !isConversionPaused.value;
      if (isConversionPaused.value) {
        conversionDialogVisible.value = false;
      } else {
        conversionDialogVisible.value = true;
      }
      showToast(isConversionPaused.value ? "已暂停转换" : "继续转换", "info");
    };

    const cancelConversion = async () => {
      if (!isConverting.value) return;
      try {
        await ElMessageBox.confirm("确认取消当前转换？", "提示", {
          type: "warning",
          confirmButtonText: "取消转换",
          cancelButtonText: "返回",
        });
      } catch {
        return;
      }

      isConversionCanceled.value = true;
      isConversionPaused.value = false;
      conversionDialogVisible.value = false;

      const xhr = conversionActiveXhr.value;
      if (xhr && xhr.readyState !== 4) {
        try {
          xhr.abort();
        } catch {
          // ignore
        }
      }

      isConverting.value = false;
      conversionCurrentId.value = "";
      suspendAutoSave.value = false;
      await flushAutoSave();
      showToast("已取消转换", "info");
    };

    const waitIfConversionPaused = async () => {
      while (isConversionPaused.value) {
        await new Promise((r) => setTimeout(r, 200));
      }
    };

    const isCanceledError = (err) => {
      const msg = getErrorMessage(err);
      return isConversionCanceled.value || msg === "CONVERSION_CANCELED";
    };

    const getErrorMessage = (err) => {
      if (!err) return "未知错误";
      if (typeof err === "string") return err;
      if (typeof err.message === "string" && err.message) return err.message;
      try {
        return JSON.stringify(err);
      } catch {
        return String(err);
      }
    };
    const caseConversion = async () => {
      caseConversionDialogVisible.value = false;

      if (isConverting.value) {
        if (isConversionPaused.value) {
          isConversionPaused.value = false;
          conversionDialogVisible.value = true;
          showToast("继续转换", "info");
        } else {
          conversionDialogVisible.value = true;
          showToast("转换进行中", "info");
        }
        return;
      }

      if (selectedRowsAll.value.length === 0) {
        showToast("请先选择要转换的测试用例", "warning");
        return;
      }

      // 初始化进度
      isConverting.value = true;
      isConversionPaused.value = false;
      isConversionCanceled.value = false;
      suspendAutoSave.value = true;
      conversionTotal.value = selectedRowsAll.value.length;
      conversionCurrent.value = 0;
      conversionProgress.value = 0;
      conversionDialogVisible.value = true;

      showToast("开始转换测试用例", "info");

      const failedIds = [];

      for (let i = 0; i < selectedRowsAll.value.length; i++) {
        await waitIfConversionPaused();
        if (isConversionCanceled.value) break;
        const row = selectedRowsAll.value[i];

        conversionCurrentId.value = row.id;
        conversionCurrent.value = i + 1;
        conversionProgress.value = Math.round(((i + 1) / conversionTotal.value) * 100);

        try {
          await new Promise((resolve, reject) => {
            runCaseConversion(row, resolve, reject);
          });
        } catch (error) {
          if (isCanceledError(error)) break;
          const msg = getErrorMessage(error);
          console.error(`用例 ${row.id} 转换失败:`, error);
          showToast(`用例 ${row.id} 转换失败：${msg}`, "error");
          failedIds.push(row.id);
        }

        if ((i + 1) % 10 === 0) {
          await flushAutoSave();
        }

        if ((i + 1) % 5 === 0) {
          await new Promise((r) => setTimeout(r, 0));
        }
      }

      suspendAutoSave.value = false;
      await flushAutoSave();

      setTimeout(() => {
        conversionDialogVisible.value = false;
        isConverting.value = false;
        isConversionPaused.value = false;
        conversionProgress.value = 0;

        if (isConversionCanceled.value) {
          isConversionCanceled.value = false;
          return;
        }

        if (failedIds.length > 0) {
          showToast(`部分用例转换失败: ${failedIds.join(", ")}`, "error");
        } else {
          showToast(`所有用例转换完成`, "success");
        }

        nextTick(() => {
          const table = proxy.$refs.caseTable;
          if (!table) return;
          changePage.value = true;
          table.clearSelection();
          paginatedCases.value.forEach((row) => {
            table.toggleRowSelection(row, selectedRowIds.value.has(row.id));
          });
          changePage.value = false;
        });
      }, 500);
    };

    const convertRow = (row) => {
      contextMenu.visible = false;
      if (!row) return;

      if (isConverting.value) {
        if (isConversionPaused.value) {
          isConversionPaused.value = false;
          conversionDialogVisible.value = true;
          showToast("继续转换", "info");
        } else {
          conversionDialogVisible.value = true;
          showToast("转换进行中", "info");
        }
        return;
      }

      conversionTotal.value = 1;
      conversionCurrent.value = 0;
      conversionProgress.value = 0;
      conversionDialogVisible.value = true;
      isConverting.value = true;
      isConversionPaused.value = false;
      isConversionCanceled.value = false;
      suspendAutoSave.value = true;
      conversionCurrentId.value = row.id;

      runCaseConversion(
        row,
        () => {
          conversionProgress.value = 100;
          conversionCurrent.value = 1;
          setTimeout(() => {
            conversionDialogVisible.value = false;
            isConverting.value = false;
            suspendAutoSave.value = false;
            flushAutoSave();
            showToast(`用例 ${row.id} 转换成功`, "success");
          }, 300);
        },
        (err) => {
          if (isCanceledError(err)) return;
          conversionDialogVisible.value = false;
          isConverting.value = false;
          suspendAutoSave.value = false;
          flushAutoSave();
          const msg = getErrorMessage(err);
          showToast(`用例 ${row.id} 转换失败：${msg}`, "error");
        }
      );

      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        if (progress >= 90) clearInterval(interval);
        conversionProgress.value = progress;
      }, 200);
    };

    // 运行测试用例
    const runCaseConversion = (row, resolve, reject) => {
      startCaseConversion(row, resolve, reject);
    };

    const startCaseConversion = async (row, resolve, reject) => {
      try {
        console.log('开始转换用例，row 数据:', row);
        console.log('Initial_Condition:', row.Initial_Condition, '类型:', typeof row.Initial_Condition);
        console.log('Action:', row.Action, '类型:', typeof row.Action);
        console.log('Expected_Result:', row.Expected_Result, '类型:', typeof row.Expected_Result);
        
        // 只需要判断源字段是否为空或"接上一case"，不需要判断目标字段（目标字段是用来保存结果的）
        const skipA = isCarryOverInit(row.Initial_Condition);
        const skipB = isCarryOverInit(row.Action);
        const skipE = isCarryOverInit(row.Expected_Result);
        
        console.log('判断结果 - skipA:', skipA, 'skipB:', skipB, 'skipE:', skipE);

        await waitIfConversionPaused();
        if (isConversionCanceled.value) throw new Error("CONVERSION_CANCELED");
        if (!skipA) {
          console.log('准备调用 Task A - 转化初始条件');
          await callApi(row.id, row.Initial_Condition, "A", false, "A", row.Expected_Result || "");
        } else {
          console.log('跳过 Task A - 初始条件');
        }

        await waitIfConversionPaused();
        if (isConversionCanceled.value) throw new Error("CONVERSION_CANCELED");
        if (!skipB) {
          console.log('准备调用 Task B - 转化动作');
          await callApi(row.id, row.Action, "B", false, "B", row.Expected_Result || "");
        } else {
          console.log('跳过 Task B - 动作');
        }

        await waitIfConversionPaused();
        if (isConversionCanceled.value) throw new Error("CONVERSION_CANCELED");
        if (!skipE) {
          const erText = (row.Expected_Result || "").toString();
          const hasReceive = erText.includes("接收");
          const hasSend = erText.includes("外发");
          const hasSerial = erText.includes("串口");
          const shouldCallExpected = hasReceive || hasSend || hasSerial;
          if (shouldCallExpected) {
            console.log('准备调用 Task A - 转化预期结果（含"接收"/"外发"/"串口"任一关键字）');
            await callApi(row.id, row.Expected_Result, "A", false, "E", row.Expected_Result || "");
          } else {
            console.log(`不调用接口，直接复制预期结果文本到 ExpectedTestSequences（接收:${hasReceive}, 外发:${hasSend}, 串口:${hasSerial}）`);
            const index = cases.value.findIndex((c) => c.id === row.id);
            if (index !== -1) {
              cases.value[index].ExpectedTestSequences = erText;
              if (conversionTotal.value <= 1) {
                showToast(`用例 ${row.id} 预期结果已直接复制`, "success");
              }
            }
          }
        } else {
          console.log('跳过 Task A - 预期结果');
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    };

    const callApi = (id, input, task, stream, step, predict) => {
      return new Promise((resolve, reject) => {
        // 安全检查：如果 input 为空，直接跳过，不发送请求
        const safeInput = input ?? "";
        if (safeInput.trim() === "") {
          console.log(`用例 ${id} 步骤 ${step} 的 input 为空，跳过 API 调用`);
          resolve();
          return;
        }

        const xhr = new XMLHttpRequest();
        conversionActiveXhr.value = xhr;
        xhr.open("POST", "/dev-api/v1/chat/completions", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Accept", "text/event-stream");

        xhr.onreadystatechange = function () {
          if (xhr.readyState !== 4) return;

          if (conversionActiveXhr.value === xhr) {
            conversionActiveXhr.value = null;
          }

          if (xhr.status === 200) {
            try {
              const response = JSON.parse(xhr.responseText);
              const content = response.choices?.[0]?.message?.content;
              if (typeof content !== "string") throw new Error("返回格式异常");

              const index = cases.value.findIndex((c) => c.id === id);
              if (index !== -1) {
                if (step === "A") {
                  cases.value[index].InitTestSequences = content;
                } else if (step === "B") {
                  cases.value[index].ActionTestSequences = content;
                } else if (step === "E") {
                  cases.value[index].ExpectedTestSequences = content;
                }
                if (conversionTotal.value <= 1 && (step === "B" || step === "E")) {
                  showToast(`用例 ${id} 转换成功`, "success");
                }
              }
              resolve();
            } catch (e) {
              reject(e);
            }
          } else {
            let errorMsg = `用例 ${id} 请求失败：HTTP ${xhr.status}`;
            try {
              const errorResponse = JSON.parse(xhr.responseText);
              console.error("服务器返回的错误详情:", errorResponse);
              if (errorResponse.message) {
                errorMsg += ` - ${errorResponse.message}`;
              } else if (errorResponse.detail) {
                errorMsg += ` - ${errorResponse.detail}`;
              } else if (typeof errorResponse === 'object') {
                errorMsg += ` - ${JSON.stringify(errorResponse)}`;
              }
            } catch (e) {
              console.error("原始错误响应:", xhr.responseText);
              if (xhr.responseText) {
                errorMsg += ` - ${xhr.responseText}`;
              }
            }
            reject(new Error(errorMsg));
          }
        };
        xhr.onabort = function () {
          if (conversionActiveXhr.value === xhr) {
            conversionActiveXhr.value = null;
          }
          reject(new Error("CONVERSION_CANCELED"));
        };
        xhr.onerror = function () {
          if (conversionActiveXhr.value === xhr) {
            conversionActiveXhr.value = null;
          }
          reject(new Error(`用例 ${id} 网络错误，请检查服务是否可用`));
        };
        
        // 安全处理所有参数，确保不会发送 undefined 或 null
        const dbc = dbcFiles.value.map((file) => file.name);
        const prompt = prompt1.value ?? "";
        const safePredict = predict ?? "";
        const safeTask = task ?? "A";
        const safeStream = stream ?? false;
        
        const requestData = { 
          input: safeInput, 
          task: safeTask, 
          stream: safeStream, 
          dbc: dbc, 
          prompt: prompt, 
          predict: safePredict 
        };
        console.log(`发送请求 (用例${id}, 步骤${step}):`, requestData);
        xhr.send(JSON.stringify(requestData));
      });
    };

    const fetchTestList = (page) => {
      fetch(`/dev-api/test_list?page=${page}&page_size=10`)
        .then((response) => response.json())
        .then((data) => {
          if (data.code === "200") {
            const testCases = data.result.items.map((item) => ({
              id: item.test_id,
              time: item.create_time,
              message: item.query,
            }));
            logs.value = testCases;
            logs_total.value = data.result.total;
            currentPage1.value = data.result.page;
            pageSize1.value = data.result.page_size; 
            showToast("测试用例列表加载成功", "success");
          } else {
            showToast("测试用例列表加载失败", "error");
          }
        })
        .catch((error) => {
          console.error("Error fetching test list:", error);
          showToast("测试用例列表加载失败", "error");
        });
    };

    // 日志文本展示：把 repr 转义产生的字面 \n（含多层 \\n）还原为真实换行
    const formatLogText = (text) => {
      if (!text) return "";
      return text
        .replace(/\\\\n/g, "\n") // 双层转义 \\n → 换行
        .replace(/\\n/g, "\n"); // 单层转义 \n → 换行
    };

    const fetchTestLogs = (test_id) => {
      fetch(`/dev-api/test_logs/${test_id}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.code === "200") {
            currentTestIdForImage.value = test_id;
            logDetails.logs = data.result.logs.chat_log;
            logDetails.code_files = data.result.logs.code_files;
            // images 只带 filename/path/size（无 base64），懒加载时补 url/loading/error
            logDetails.images = (data.result.logs.images || []).map((img) => ({
              ...img,
              url: "",
              loading: false,
              error: "",
            }));
            logDetails.ignition_logs = data.result.logs.ignition_log;
            logDetails.json_files = data.result.logs.json_files;
            //console.log(logDetails.code_files);
            logDialogVisible.value = true;
            showToast(`测试日志加载成功`, "success");
          } else {
            showToast("测试日志加载失败", "error");
          }
        })
        .catch((error) => {
          console.error("Error fetching test logs:", error);
          showToast("测试日志加载失败", "error");
        });
    };

    const dbcFiles = ref([]);
    const dbcUploadLoading = ref(false);

    const fetchActualResult = (test_id, command) => {
      //test_id = "test_20250802_134624"
      fetch(`/dev-api/api/crop_by_semantics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ test_id, command }),
      })
        .then((response) => response.json())
        .then((data) => {
          //console.log(data);
          if (data.status === "ok") {
            ActualResultDetails.images = data.base64;
            // 保存裁剪取部位日志（命中的识别项与语义相似度），弹窗中展示给 video-processor 开发
            ActualResultDetails.matchedClasses = data.matched_classes || [];
            ActualResultDetails.similarities = data.similarities || [];
            //console.log(ActualResultDetails.images);
            ActualResultDialogVisible.value = true;
            showToast(`实际结果加载成功`, "success");
          } else {
            showToast("暂无实际结果图片", "error");
          }
        })
        .catch((error) => {
          console.error("Error fetching test result:", error);
          showToast("实际结果加载失败", "error");
        });
    };

    const handleDbcFileUpload = async (event) => {
      const files = Array.from(event.target.files || []);
      if (!files.length) return;
      const invalid = files.find((file) => !file.name.toLowerCase().endsWith(".dbc"));
      if (invalid) {
        showToast(`文件 ${invalid.name} 不是.dbc格式`, "error");
        event.target.value = "";
        return;
      }

      dbcUploadLoading.value = true;

      try {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));

        const response = await fetch("/dev-api/upload/batch", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        const uploaded = data.result?.files?.filter((item) => item.success) || [];
        if (uploaded.length) {
          const fileMap = new Map(dbcFiles.value.map((item) => [item.name, item]));
          uploaded.forEach((item) => fileMap.set(item.filename, {
            name: item.filename,
            path: item.save_path || "",
            size: item.file_size || 0,
          }));
          dbcFiles.value = Array.from(fileMap.values());
          try {
            localStorage.setItem(
              getProjectLocalStorageKey("DBC_FILE_META"),
              JSON.stringify(dbcFiles.value)
            );
          } catch {
            // ignore
          }
          const failed = data.result?.files?.filter((item) => !item.success) || [];
          showToast(
            failed.length ? `DBC上传成功${uploaded.length}个，失败${failed.length}个` : `成功读取${uploaded.length}个DBC文件`,
            failed.length ? "warning" : "success"
          );
        } else {
          throw new Error(data.description || "上传失败");
        }
      } catch (error) {
        console.error("DBC上传失败:", error);
        showToast(`DBC文件上传失败: ${error.message}`, "error");
        event.target.value = "";
      } finally {
        dbcUploadLoading.value = false;
      }
    };

    const removeDbcFile = (name) => {
      dbcFiles.value = dbcFiles.value.filter((file) => file.name !== name);
      localStorage.setItem(
        getProjectLocalStorageKey("DBC_FILE_META"),
        JSON.stringify(dbcFiles.value)
      );
    };

    const testConfigVisible = ref(false);
    const adbDeviceList = ref([]);
    const adbDeviceLoading = ref(false);

    const testConfig = reactive({
      waitStrategy: "fixed_and_poll",
      preWaitSec: 0,
      isReset: false,
      resetDelaySec: 0,
      isClip: false,
      continueOnFail: false,
      defaultAllIn: false,
      recordMachineId: "",
      explorationMode: "approval",
    });

    const RECORD_API_BASE = "/record-api";
    const RECORD_API_PREFIX = "/api/record";

    const _normalizeBaseUrl = (base) => {
      if (!base) return "";
      return base.replace(/\/$/, "");
    };

    const getRecordApiBase = () => _normalizeBaseUrl(RECORD_API_BASE);

    const fetchAdbDeviceList = async () => {
      adbDeviceLoading.value = true;
      try {
        const base = _normalizeBaseUrl(url.value || "");
        const resp = await fetch(`${base}/adb/runCmd?cmd=devices`, {
          signal: AbortSignal.timeout(10000),
        });
        const json = await resp.json();
        const list = [];
        if (json?.state && typeof json?.desc === "string") {
          const lines = json.desc.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
          lines.forEach(line => {
            if (/^List\s+of\s+devices/i.test(line)) return;
            const parts = line.split(/\s+/);
            if (parts.length >= 2) {
              list.push({ id: parts[0], state: parts[1] });
            }
          });
        }
        adbDeviceList.value = list;
        if (list.length && !testConfig.recordMachineId) {
          const online = list.find(d => /device/i.test(d.state)) || list[0];
          testConfig.recordMachineId = online.id;
        }
      } catch (e) {
        console.error("获取 ADB 设备列表失败:", e);
        ElMessage.error("获取 ADB 设备列表失败：" + e.message);
      } finally {
        adbDeviceLoading.value = false;
      }
    };

    const buildCaseContent = (c) => {
      const parts = [];
      const init = c?.InitTestSequences || c?.Initial_Condition || "";
      const act = c?.ActionTestSequences || c?.Action || "";
      const exp = c?.ExpectedTestSequences || c?.Expected_Result || "";
      if (init) parts.push(`前提条件: ${init}`);
      if (act) parts.push(`操作步骤: ${act}`);
      if (exp) parts.push(`预期结果: ${exp}`);
      return parts.join("\n");
    };

    const recordSaveStep = async (payload) => {
      const base = getRecordApiBase();
      if (!payload?.machine_id) throw new Error("请先在【测试配置】中选择/设置 ADB 设备 ID");
      const url0 = `${base}${RECORD_API_PREFIX}/save-step`;
      console.log("[record] 调用 save-step, URL:", url0, "payload:", payload);
      const resp = await fetch(url0, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok || (data && data.code && data.code !== 200)) {
        const msg = data?.message || `HTTP ${resp.status}`;
        throw new Error(msg);
      }
      return data;
    };

    const recordComplete = async (payload) => {
      const base = getRecordApiBase();
      if (!payload?.machine_id) throw new Error("请先在【测试配置】中选择/设置 ADB 设备 ID");
      const url0 = `${base}${RECORD_API_PREFIX}/complete`;
      console.log("[record] 调用 complete, URL:", url0, "payload:", payload);
      const resp = await fetch(url0, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok || (data && data.code && data.code !== 200)) {
        const msg = data?.message || `HTTP ${resp.status}`;
        throw new Error(msg);
      }
      return data;
    };

    const loadTestConfig = () => {
      try {
        const str = localStorage.getItem(getProjectLocalStorageKey("TEST_CONFIG"));
        if (str) {
          const parsed = JSON.parse(str);
          Object.assign(testConfig, parsed);
          if (typeof parsed?.isClip === "undefined" && typeof parsed?.timeoutSec === "number") {
            testConfig.isClip = parsed.timeoutSec > 0;
          }
          if ("timeoutSec" in testConfig) {
            try {
              delete testConfig.timeoutSec;
            } catch {
              // ignore
            }
          }
          if (typeof testConfig.recordMachineId !== "string") {
            testConfig.recordMachineId = "";
          }
        }
      } catch {}
    };

    const openTestConfigDialog = () => {
      testConfigVisible.value = true;
    };

    const saveTestConfig = () => {
      localStorage.setItem(getProjectLocalStorageKey("TEST_CONFIG"), JSON.stringify(testConfig));
      testConfigVisible.value = false;
      showToast("测试配置已保存", "success");
    };

    // 模拟组件加载
    onMounted(async () => {
      loadAuthContext();

      url.value =
        localStorage.getItem(getProjectLocalStorageKey("TEST_URL")) ??
        default_url.value;

      loadTestConfig();

      try {
        const meta = localStorage.getItem(getProjectLocalStorageKey("DBC_FILE_META"));
        if (meta) {
          const saved = JSON.parse(meta);
          // 兼容旧版保存的单文件对象。
          dbcFiles.value = Array.isArray(saved) ? saved : saved?.name ? [saved] : [];
        }
      } catch {
        // ignore
      }

      cases.value = await loadCases(projectScopeKey.value).then((list) => {
        if (list.length) {
          list.forEach((c) => {
            if (c.Result === "PASS") c.Result = "Pass";
            else if (c.Result === "FAIL") c.Result = "Fail";
          });
          return list;
        }

        return [
              {
                id: "001",
                TestCaseID: "",
                SyRDIDFSRD: "",
                Auto_testID: "",
                TSR: "",
                CasePriority: "",
                TestMethod: "",
                TestStrategy: "",
                DesignMethod: "",
                TestKey: "",
                Initial_Condition: "",
                Action: "",
                Expected_Result: "",
                InitTestSequences:
                  "1.Switch-2-ON-KL30\n2.Switch-1-ON-KL15\n3.Switch-3-ON-ACC\n4.Pwr-1-SupplyPower-13.5\n5.CAN-Msg-ONEBOX_1_G-1\n6.CAN-1-Sig-ONEBOX_1_G-VehicleSpeedVSOSig-0\n7.CAN-1-Sig-ONEBOX_1_G-VehicleSpeedVSOSigValidData-0\n8.CAN-Sig-FLZCU_9-FLZCU_9_PowerMode-2",
                ActionTestSequences: "1.CAN-1-Sig-ONEBOX_1_G-VehicleSpeedVSOSig-0x140",
                ExpectedTestSequences: "1.Vision-Pattern-车速21",
                ActualResult: "",
                Selected: "",
                PRNo: "",
                TestLogs: "",
                Numberoftests: "",
                TestDate: "",
                Remark: "",
                Result: undefined,
              },
              {
                id: "002",
                TestCaseID: "",
                SyRDIDFSRD: "",
                Auto_testID: "",
                TSR: "",
                CasePriority: "",
                TestMethod: "",
                TestStrategy: "",
                DesignMethod: "",
                TestKey: "",
                Initial_Condition: "",
                Action: "",
                Expected_Result: "",
                InitTestSequences: "安卓测试 进入设置",
                ActionTestSequences: "进入车辆设置",
                ExpectedTestSequences: "页面正常显示",
                ActualResult: "",
                Selected: "",
                PRNo: "",
                TestLogs: "",
                Numberoftests: "",
                TestDate: "",
                Remark: "",
                Result: undefined,
              },
            ];
      });
      casesTable.value = await loadCasesTable(projectScopeKey.value);
      setTimeout(() => {
        fetchTestList(1);
      }, 500);

      const { w, h } = await getDeviceSize();
      console.log("接口分辨率 w=", w, "h=", h);

      nextTick(() => {
        mobileCanvas.value.width = 2560;
        mobileCanvas.value.height = 1440;
        const box = mobileCanvas.value.parentElement?.getBoundingClientRect();
        if (box) {
          mobileCanvas.value.style.width = box.width + "px";
          mobileCanvas.value.style.height = box.height + "px";
        }
      });

      window.addEventListener("resize", () => {
        if (!mobileCanvas.value) return;
        const box = mobileCanvas.value.parentElement?.getBoundingClientRect();
        if (box) {
          mobileCanvas.value.style.width = box.width + "px";
          mobileCanvas.value.style.height = box.height + "px";
        }
      });

      // 启动自动化任务轮询
      pollingInterval = setInterval(fetchTasks, 5 * 60 * 1000);
      fetchTasks();
    });

    // 组件卸载时停止轮询
    onUnmounted(() => {
      stopPolling();
      if (pollingInterval) clearInterval(pollingInterval);
      if (_recRebootTimer) clearInterval(_recRebootTimer);
    });

    // =====================================================================
    //  🎬 录制向导：全部逻辑（画面加载 / 坐标换算 / ADB命令 / 日志 / 阶段保存 / reboot / 最终上传）
    // =====================================================================

    // 打开向导：案例表格行 → 开始录制
    const openRecordWizard = (row) => {
      if (!row) return;
      recCase.value = row;
      recStep.value = 1;
      // === 阶段1：解析初始条件文本，初始化细分步骤数组 ===
      recInitialParsed.value = parseInitialText(row.Initial_Condition);
      recCurrentInitialStep.value = 1;
      recInitialSeq.value = null;
      // === 阶段2：解析操作步骤文本，初始化细分步骤数组 ===
      recActionParsed.value = parseActionText(row.Action);
      recCurrentActionStep.value = 1;
      recActionSeq.value = null;
      // 清空当前日志
      recLogs.value = [];
      recLogsSelected.value = [];
      recLogsAllSelected.value = false;
      recRebooting.value = false;
      recRebootCountdown.value = 0;
      recRebootResult.value = "";
      recStartAt.value = Date.now();
      recDialogVisible.value = true;
      nextTick(() => recLoadShot());
    };

    // 向导画面加载：复用现有 getDeviceSize 取真实分辨率 → 按比例缩放容器
    let _recDeviceSize = null;
    const recLoadShot = async () => {
      try {
        const u = url.value;
        if (!u) { ElMessage.warning("请先配置上位机 URL"); return; }
        recVideoSrc.value = "";
        recVideoSrc.value = u + "/adb/video?_t=" + Date.now();
        if (!_recDeviceSize) {
          try {
            const r = await fetch(u + "/adb/runCmd?cmd=shell%20wm%20size", { signal: AbortSignal.timeout(4000) });
            const j = await r.json();
            if (j?.state && j?.desc) {
              const m = String(j.desc).match(/Physical\s+size\s*:\s*(\d+)x(\d+)/i);
              if (m) _recDeviceSize = { W: parseInt(m[1]), H: parseInt(m[2]) };
            }
          } catch(e) {}
        }
        nextTick(() => recResizeWrap());
      } catch (e) {
        ElMessage.error("画面加载失败：" + e.message);
      }
    };
    const recResizeWrap = () => {
      const wr = recWrap.value, cv = recCanvas.value, im = recImg.value;
      if (!wr || !cv) return;
      if (!_recDeviceSize) { setTimeout(recResizeWrap, 400); return; }
      const { W, H } = _recDeviceSize;
      const maxH = 480;
      const availW = Math.min(window.innerWidth * 0.85, 1280);
      const r1 = W / H, r2 = H / W;
      let cw, ch;
      if (W >= H) { // 横屏
        ch = maxH; cw = Math.round(ch * r1);
        if (cw > availW) { cw = availW; ch = Math.round(cw * r2); }
      } else { // 竖屏
        cw = Math.min(availW, 420);
        ch = Math.round(cw * r2);
        if (ch > maxH + 200) { ch = maxH + 200; cw = Math.round(ch * r1); }
      }
      wr.style.width = cw + "px";
      wr.style.height = ch + "px";
      // canvas 内部画布大小 = CSS 大小（按设备像素比画，避免模糊）
      const dpr = window.devicePixelRatio || 1;
      cv.width = cw * dpr;
      cv.height = ch * dpr;
      cv.style.width = cw + "px";
      cv.style.height = ch + "px";
      const ctx = cv.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const recOnImgLoaded = () => recResizeWrap();
    const recReloadVideo = () => {
      recVideoSrc.value = "";
      nextTick(() => { recVideoSrc.value = (url.value || "") + "/adb/video?_t=" + Date.now(); });
    };

    // 画面可视矩形（object-fit:contain 内部真正的可视区域）
    const recGetVisRect = () => {
      const im = recImg.value, wr = recWrap.value;
      if (!im || !wr) return null;
      const nw = im.naturalWidth || 1, nh = im.naturalHeight || 1;
      const box = wr.getBoundingClientRect();
      const cw = box.width, ch = box.height;
      const sW = cw / nw, sH = ch / nh;
      const s = Math.min(sW, sH);
      const visW = nw * s, visH = nh * s;
      const x = (cw - visW) / 2, y = (ch - visH) / 2;
      return { x, y, w: visW, h: visH, devW: _recDeviceSize?.W || nw, devH: _recDeviceSize?.H || nh };
    };

    // 坐标换算：屏幕 → 设备真实坐标
    const recGetCoords = (ev) => {
      const wr = recWrap.value; if (!wr) return null;
      const r = recGetVisRect(); if (!r) return null;
      const box = wr.getBoundingClientRect();
      const rx = ev.clientX - box.left, ry = ev.clientY - box.top;
      if (rx < r.x || rx > r.x + r.w || ry < r.y || ry > r.y + r.h) return null;
      const x = Math.round((rx - r.x) / r.w * r.devW);
      const y = Math.round((ry - r.y) / r.h * r.devH);
      return { x, y };
    };

    // 画轨迹：Tap 红点 / Swipe 蓝虚线
    const recDrawDot = (x, y, color="#ff5c5c") => {
      const cv = recCanvas.value; if (!cv) return;
      const ctx = cv.getContext("2d");
      ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI*2); ctx.fillStyle = color; ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI*2); ctx.strokeStyle = "rgba(255,255,255,0.9)"; ctx.lineWidth = 1.5; ctx.stroke();
    };
    const recDrawSwipe = (x1,y1,x2,y2) => {
      const cv = recCanvas.value; if (!cv) return;
      const ctx = cv.getContext("2d");
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.setLineDash([6, 5]); ctx.strokeStyle = "#4ab6ff"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(x1,y1,5,0,Math.PI*2); ctx.fillStyle = "#4ab6ff"; ctx.fill();
    };
    const recClearCanvas = () => {
      const cv = recCanvas.value; if (!cv) return;
      const ctx = cv.getContext("2d");
      ctx.clearRect(0,0,cv.width, cv.height);
    };

    // ADB 发送（封装，带日志记录）
    const KEY_MAP = {
      KEYCODE_HOME: 3, KEYCODE_BACK: 4, KEYCODE_ENTER: 66,
      KEYCODE_VOLUME_UP: 24, KEYCODE_VOLUME_DOWN: 25, KEYCODE_REBOOT: 26
    };
    const recAdb = async (cmd) => {
      try {
        const r = await fetch((url.value||"") + "/adb/runCmd?cmd=" + encodeURIComponent(cmd), { signal: AbortSignal.timeout(8000) });
        const j = await r.json(); return { ok: !!j?.state, desc: j?.desc || "" };
      } catch (e) { return { ok: false, desc: e.message }; }
    };
    const recAddLog = (type, payload, success=true, msg="") => {
      const id = "rec_${Date.now()}_${_recLogSeq++}";
      const now = new Date();
      const tsStr = String(now.getHours()).padStart(2,"0") + ":" + String(now.getMinutes()).padStart(2,"0") + ":" + String(now.getSeconds()).padStart(2,"0");
      recLogs.value.push({
        id, ts: Date.now(), tsStr, type, success, msg,
        ...payload,
      });
      if (recLogs.value.length > 200) recLogs.value.splice(0, recLogs.value.length - 200);
      if (recLogsTableRef.value) recLogsTableRef.value.setCurrentRow(recLogs.value[recLogs.value.length-1]);
    };
    const recSendTap = async (x, y) => {
      if (recIsSending.value) return;
      recIsSending.value = true;
      const { ok, desc } = await recAdb(`shell input tap ${x} ${y}`);
      recAddLog("TAP", { x, y, cmd: `shell input tap ${x} ${y}` }, ok, ok ? "" : desc);
      recIsSending.value = false;
    };
    const recSendSwipe = async (x1,y1,x2,y2,duration=300) => {
      if (recIsSending.value) return;
      recIsSending.value = true;
      const cmd = `shell input swipe ${x1} ${y1} ${x2} ${y2} ${duration}`;
      const { ok, desc } = await recAdb(cmd);
      recAddLog("SWIPE", { x1,y1,x2,y2, duration, cmd }, ok, ok ? "" : desc);
      recIsSending.value = false;
    };
    const recSendKey = async (keyCode, name) => {
      if (recIsSending.value) return;
      if (typeof keyCode === "string") { name = keyCode; keyCode = KEY_MAP[keyCode] || 0; }
      recIsSending.value = true;
      const cmd = `shell input keyevent ${keyCode}`;
      const { ok, desc } = await recAdb(cmd);
      recAddLog("KEY", { keyCode, keyName: name || "KEY", cmd }, ok, ok ? "" : desc);
      recIsSending.value = false;
    };

    // 手势识别：Tap (<12px / <800ms)  vs Swipe
    const recOnMouseDown = (e) => {
      if (e.button !== 0) return;
      const p = recGetCoords(e); if (!p) return;
      const wr = recWrap.value.getBoundingClientRect();
      recGesture.x1 = recGesture.lx = p.x;
      recGesture.y1 = recGesture.ly = p.y;
      recGesture.t = Date.now();
      recGesture.pressing = true;
      recGesture.cx = e.clientX - wr.left;
      recGesture.cy = e.clientY - wr.top;
    };
    const recOnMouseMove = (e) => {
      if (!recGesture.pressing) return;
      const wr = recWrap.value.getBoundingClientRect();
      const cx = e.clientX - wr.left, cy = e.clientY - wr.top;
      recDrawSwipe(recGesture.cx, recGesture.cy, cx, cy);
      recGesture.lcx = cx; recGesture.lcy = cy;
    };
    const recOnMouseUp = (e) => {
      if (!recGesture.pressing) return;
      recGesture.pressing = false;
      const p = recGetCoords(e);
      setTimeout(recClearCanvas, 500);
      if (!p) return;
      const dur = Date.now() - recGesture.t;
      const wr = recWrap.value.getBoundingClientRect();
      const cx = e.clientX - wr.left, cy = e.clientY - wr.top;
      const dxPx = Math.abs(cx - recGesture.cx), dyPx = Math.abs(cy - recGesture.cy);
      if (dxPx < 12 && dyPx < 12) {
        // Tap
        recDrawDot(cx, cy);
        recSendTap(recGesture.x1, recGesture.y1);
      } else {
        // Swipe
        const duration = Math.max(200, Math.min(1500, Math.round(dur)));
        recSendSwipe(recGesture.x1, recGesture.y1, p.x, p.y, duration);
      }
    };

    // 日志操作
    const recClearLogs = async () => {
      try { await ElMessageBox.confirm("确定清空当前阶段的所有 ADB 操作日志？", "确认", { type:"warning" }); }
      catch(e) { return; }
      recLogs.value = []; recLogsSelected.value = []; recLogsAllSelected.value = false;
    };
    const recDeleteLogAt = (i) => {
      const row = recLogs.value[i]; if (!row) return;
      recLogs.value.splice(i, 1);
      recLogsSelected.value = recLogsSelected.value.filter(x => x !== row.id);
      recLogsAllSelected.value = recLogs.value.length > 0 && recLogsSelected.value.length === recLogs.value.length;
    };
    const recOnSelectionChange = (rows) => {
      recLogsSelected.value = rows.map(r => r.id);
      recLogsAllSelected.value = recLogs.value.length > 0 && recLogsSelected.value.length === recLogs.value.length;
    };
    const recToggleSelectAll = () => {
      if (!recLogsTableRef.value) return;
      if (recLogsAllSelected.value) recLogsTableRef.value.clearSelection();
      else recLogs.value.forEach(r => recLogsTableRef.value.toggleRowSelection(r, true));
    };

    // 把当前 recLogs 组装成「单个阶段的序列 payload」
    const recBuildSeqPayload = (name) => {
      const sorted = [...recLogs.value].sort((a,b) => a.ts - b.ts);
      if (!sorted.length) return null;
      return {
        name: name || "",
        created_at: new Date().toISOString(),
        total_steps: sorted.length,
        steps: sorted.map((r, i) => {
          const base = { step: i+1, type: r.type, cmd: r.cmd, success: !!r.success };
          if (r.type === "TAP") { base.x = r.x; base.y = r.y; }
          else if (r.type === "SWIPE") { base.x1 = r.x1; base.y1 = r.y1; base.x2 = r.x2; base.y2 = r.y2; base.duration = r.duration; }
          else if (r.type === "KEY") { base.keyCode = r.keyCode; base.keyName = r.keyName; }
          if (!r.success && r.msg) base.msg = r.msg;
          return base;
        })
      };
    };

    // ========== 阶段1：初始条件 - 子步骤跳转辅助函数 ==========
    // 点击标签跳转到指定子步骤（如果该步骤已有序列，会一并回填到日志显示区）
    const recJumpInitialStep = (idx) => {
      if (idx < 1 || idx > (recInitialParsed.value || []).length) return;
      recCurrentInitialStep.value = idx;
      const sub = recInitialParsed.value[idx - 1];
      // 回填：如果该子步骤已有录制序列，则把它的 steps 转换为 recLogs 供用户查看/修改
      if (sub && sub.seq && Array.isArray(sub.seq.steps)) {
        recLogs.value = sub.seq.steps.map((s, i) => ({
          id: `rec_init_${idx}_${i}`,
          ts: s.ts || Date.now() + i,
          tsStr: s.time || "--:--:--",
          type: s.type,
          cmd: s.cmd || "",
          success: s.success !== false,
          msg: s.msg || "",
          x: s.x ?? null, y: s.y ?? null,
          x1: s.x1 ?? null, y1: s.y1 ?? null,
          x2: s.x2 ?? null, y2: s.y2 ?? null,
          duration: s.duration ?? null,
          keyCode: s.keyCode ?? null, keyName: s.keyName ?? null,
        }));
      } else {
        recLogs.value = [];
      }
      recLogsSelected.value = [];
      recLogsAllSelected.value = false;
      nextTick(() => { recClearCanvas(); recReloadVideo(); });
    };
    const recPrevInitialStep = () => recJumpInitialStep(recCurrentInitialStep.value - 1);

    // ========== 阶段2：操作步骤 - 子步骤跳转辅助函数 ==========
    const recJumpActionStep = (idx) => {
      if (idx < 1 || idx > (recActionParsed.value || []).length) return;
      recCurrentActionStep.value = idx;
      const sub = recActionParsed.value[idx - 1];
      if (sub && sub.seq && Array.isArray(sub.seq.steps)) {
        recLogs.value = sub.seq.steps.map((s, i) => ({
          id: `rec_act_${idx}_${i}`,
          ts: s.ts || Date.now() + i,
          tsStr: s.time || "--:--:--",
          type: s.type,
          cmd: s.cmd || "",
          success: s.success !== false,
          msg: s.msg || "",
          x: s.x ?? null, y: s.y ?? null,
          x1: s.x1 ?? null, y1: s.y1 ?? null,
          x2: s.x2 ?? null, y2: s.y2 ?? null,
          duration: s.duration ?? null,
          keyCode: s.keyCode ?? null, keyName: s.keyName ?? null,
        }));
      } else {
        recLogs.value = [];
      }
      recLogsSelected.value = [];
      recLogsAllSelected.value = false;
      nextTick(() => { recClearCanvas(); recReloadVideo(); });
    };
    const recPrevActionStep = () => recJumpActionStep(recCurrentActionStep.value - 1);

    // 工具：把一组细分步骤合并为一个「合并序列」（用于兼容旧字段 recInitialSeq/recActionSeq）
    const recMergeSubsteps = (substeps) => {
      if (!Array.isArray(substeps) || !substeps.length) return null;
      const mergedSteps = [];
      substeps.forEach(sub => {
        if (sub.seq && Array.isArray(sub.seq.steps)) {
          sub.seq.steps.forEach(s => mergedSteps.push({ ...s }));
        }
      });
      if (!mergedSteps.length) return null;
      // 重排 step 编号 + 按 ts 升序（已有序但以防万一）
      mergedSteps.sort((a, b) => (a.ts || 0) - (b.ts || 0));
      mergedSteps.forEach((s, i) => s.step = i + 1);
      return {
        name: "merged",
        created_at: new Date().toISOString(),
        total_steps: mergedSteps.length,
        steps: mergedSteps,
      };
    };

    // 阶段跳转：清空日志 + 准备下一步的画面
    const recBackTo = (n) => {
      if (recRebooting.value) return;
      if (n === 1) {
        // 回到阶段1：重置初始条件已录制的子步骤
        recInitialParsed.value.forEach(s => { s.seq = null; s.skipped = false; });
        recInitialSeq.value = null;
        recCurrentInitialStep.value = 1;
      }
      if (n <= 2) {
        // 回到阶段2或更早：重置操作步骤已录制的子步骤
        recActionParsed.value.forEach(s => { s.seq = null; s.skipped = false; });
        recActionSeq.value = null;
        recCurrentActionStep.value = 1;
      }
      recStep.value = n;
      recLogs.value = [];
      recLogsSelected.value = [];
      recLogsAllSelected.value = false;
      nextTick(() => { recClearCanvas(); recReloadVideo(); });
    };

    // ========== 阶段1跳过：标记当前子步骤为跳过，如果还有下一个就进下一步，否则进入阶段2 ==========
    const recSkipInitial = async () => {
      if (recSubmitting.value) return;
      const idx = recCurrentInitialStep.value;
      const total = (recInitialParsed.value || []).length;
      if (idx < 1 || idx > total) return;
      const currentSub = recInitialParsed.value[idx - 1];
      // 标记为跳过 + 清空可能存在的录制序列
      currentSub.skipped = true;
      currentSub.seq = null;
      recInitialSeq.value = recMergeSubsteps(recInitialParsed.value);

      recSubmitting.value = true;
      try {
        const c = recCase.value || {};
        const subName = currentSub?.text ? currentSub.text.slice(0, 40) : `初始条件子步骤${idx}`;
        const payload = {
          case_content: buildCaseContent(c),
          machine_id: testConfig.recordMachineId || "",
          section_type: "initial_condition",
          step_index: idx,
          step_description: `[跳过] ${currentSub?.text || subName}`,
          adb_commands: [],
          expected_result: c.Expected_Result || "",
        };
        await recordSaveStep(payload);
        ElMessage.info(`⏭ 初始条件 · 子步骤${idx} 已标记跳过`);
      } catch (e) {
        console.error("上报跳过（初始条件）失败:", e);
        ElMessage.warning(`子步骤${idx} 已标记跳过，但上传录制服务提示：${e.message}`);
      } finally {
        recSubmitting.value = false;
      }

      if (idx < total) {
        recJumpInitialStep(idx + 1);
      } else {
        recStep.value = 2;
        recCurrentActionStep.value = 1;
        recLogs.value = []; recLogsSelected.value = []; recLogsAllSelected.value = false;
        nextTick(() => { recClearCanvas(); recReloadVideo(); });
      }
    };

    // ========== 阶段1保存：保存当前子步骤，如果还有下一个就进下一步，否则进入阶段2 ==========
    const recSaveInitial = async () => {
      if (recSubmitting.value) return;
      const idx = recCurrentInitialStep.value;
      const total = (recInitialParsed.value || []).length;
      if (idx < 1 || idx > total) return;
      const currentSub = recInitialParsed.value[idx - 1];
      const subName = currentSub?.text ? currentSub.text.slice(0, 40) : `初始条件子步骤${idx}`;
      const seq = recBuildSeqPayload(subName);
      if (!seq) { ElMessage.warning("请先录制至少一条操作"); return; }
      // 保存时自动取消跳过标记
      currentSub.skipped = false;
      // 写入到该子步骤
      currentSub.seq = seq;
      // 合并所有已录制子步骤到兼容字段 recInitialSeq
      recInitialSeq.value = recMergeSubsteps(recInitialParsed.value);

      recSubmitting.value = true;
      try {
        // 上报到录制服务
        const c = recCase.value || {};
        const adbCmds = (seq.steps || []).map(s => (s.cmd || "").toString());
        const payload = {
          case_content: buildCaseContent(c),
          machine_id: testConfig.recordMachineId || "",
          section_type: "initial_condition",
          step_index: idx,
          step_description: currentSub?.text || subName,
          adb_commands: adbCmds,
          expected_result: c.Expected_Result || "",
        };
        await recordSaveStep(payload);
        ElMessage.success(`✅ 初始条件 · 子步骤${idx} 已保存并上传（${seq.total_steps} 条ADB）`);
      } catch (e) {
        console.error("上传初始条件子步骤失败:", e);
        ElMessage.error(`子步骤${idx} 保存成功，但上传录制服务失败：${e.message}`);
      } finally {
        recSubmitting.value = false;
      }

      if (idx < total) {
        // 还有下一步：切换到下一个子步骤
        recJumpInitialStep(idx + 1);
      } else {
        // 全部初始条件子步骤录制完毕 → 进入阶段2
        recStep.value = 2;
        recCurrentActionStep.value = 1;
        recLogs.value = []; recLogsSelected.value = []; recLogsAllSelected.value = false;
        nextTick(() => { recClearCanvas(); recReloadVideo(); });
      }
    };

    // ========== 阶段2跳过：标记当前子步骤为跳过，如果还有下一个就进下一步，否则进入阶段3 ==========
    const recSkipAction = async () => {
      if (recSubmitting.value) return;
      const idx = recCurrentActionStep.value;
      const total = (recActionParsed.value || []).length;
      if (idx < 1 || idx > total) return;
      const currentSub = recActionParsed.value[idx - 1];
      // 标记为跳过 + 清空可能存在的录制序列
      currentSub.skipped = true;
      currentSub.seq = null;
      recActionSeq.value = recMergeSubsteps(recActionParsed.value);

      recSubmitting.value = true;
      try {
        const c = recCase.value || {};
        const subName = currentSub?.text ? currentSub.text.slice(0, 40) : `操作子步骤${idx}`;
        const payload = {
          case_content: buildCaseContent(c),
          machine_id: testConfig.recordMachineId || "",
          section_type: "action",
          step_index: idx,
          step_description: `[跳过] ${currentSub?.text || subName}`,
          adb_commands: [],
          expected_result: c.Expected_Result || "",
        };
        await recordSaveStep(payload);
        ElMessage.info(`⏭ 操作步骤 · 子步骤${idx} 已标记跳过`);
      } catch (e) {
        console.error("上报跳过（操作步骤）失败:", e);
        ElMessage.warning(`子步骤${idx} 已标记跳过，但上传录制服务提示：${e.message}`);
      } finally {
        recSubmitting.value = false;
      }

      if (idx < total) {
        recJumpActionStep(idx + 1);
      } else {
        recStep.value = 3;
      }
    };

    // ========== 阶段2保存：保存当前子步骤，如果还有下一个就进下一步，否则进入阶段3 ==========
    const recSaveAction = async () => {
      if (recSubmitting.value) return;
      const idx = recCurrentActionStep.value;
      const total = (recActionParsed.value || []).length;
      if (idx < 1 || idx > total) return;
      const currentSub = recActionParsed.value[idx - 1];
      const subName = currentSub?.text ? currentSub.text.slice(0, 40) : `操作子步骤${idx}`;
      const seq = recBuildSeqPayload(subName);
      if (!seq) { ElMessage.warning("请先录制至少一条操作"); return; }
      // 保存时自动取消跳过标记
      currentSub.skipped = false;
      currentSub.seq = seq;
      recActionSeq.value = recMergeSubsteps(recActionParsed.value);

      recSubmitting.value = true;
      try {
        // 上报到录制服务
        const c = recCase.value || {};
        const adbCmds = (seq.steps || []).map(s => (s.cmd || "").toString());
        const payload = {
          case_content: buildCaseContent(c),
          machine_id: testConfig.recordMachineId || "",
          section_type: "action",
          step_index: idx,
          step_description: currentSub?.text || subName,
          adb_commands: adbCmds,
          expected_result: c.Expected_Result || "",
        };
        await recordSaveStep(payload);
        ElMessage.success(`✅ 操作步骤 · 子步骤${idx} 已保存并上传（${seq.total_steps} 条ADB）`);
      } catch (e) {
        console.error("上传操作子步骤失败:", e);
        ElMessage.error(`子步骤${idx} 保存成功，但上传录制服务失败：${e.message}`);
      } finally {
        recSubmitting.value = false;
      }

      if (idx < total) {
        recJumpActionStep(idx + 1);
      } else {
        // 全部操作步骤子步骤录制完毕 → 进入阶段3（不再显示画面+日志）
        recStep.value = 3;
      }
    };

    // ===== 阶段3：不符合 → 先上报 fail → reboot + 重置录制 =====
    const recExpectedWrong = async () => {
      if (recRebooting.value || recSubmitting.value) return;
      try { await ElMessageBox.confirm("确定要发送 Reboot 重启车机吗？\n将清空本次所有录制，重新开始。", "确认 Reboot", { type:"error" }); }
      catch(e) { return; }

      recSubmitting.value = true;
      try {
        const c = recCase.value || {};
        await recordSaveStep({
          case_content: buildCaseContent(c),
          machine_id: testConfig.recordMachineId || "",
          section_type: "result",
          expected_result: "fail",
        });
        console.log("[record] 不符合，已上报 section_type=result expected_result=fail");
      } catch (e) {
        console.error("不符合上报 save-step 失败：", e);
        ElMessage.warning("上报录制结果 fail 失败：" + e.message);
      } finally {
        recSubmitting.value = false;
      }

      // 提前校验：必须配置 ADB Gateway URL
      if (!url.value) {
        ElMessage.error("请先在页面顶部填写 ADB Gateway 地址（URL），否则无法检测车机重启状态");
        return;
      }

      recRebooting.value = true;
      recRebootCountdown.value = 90;
      recRebootResult.value = "发送 adb reboot...";
      const { ok, desc } = await recAdb("shell reboot");
      if (!ok) {
        recRebootResult.value = "Reboot 发送失败：" + (desc || "未知原因");
        recRebooting.value = false;
        ElMessage.error("ADB Reboot 命令发送失败：" + (desc || "未知原因"));
        return;
      }
      recRebootResult.value = "Reboot 命令已发送，等待车机重启中…将自动检测 ADB 恢复";

      // 独立 tick 计数器，保证每 3 秒 ping 一次，与 countdown 数值解耦
      let tickCounter = 0;
      let pingAttempts = 0;
      let pingLastErr = "";
      const PING_INTERVAL_TICKS = 3;

      const doPing = async () => {
        pingAttempts++;
        const { ok: okPing, desc: descPing } = await recAdb("shell wm size");
        if (okPing && descPing && (
          /Physical\s*size/i.test(descPing) ||
          /Override\s*size/i.test(descPing) ||
          /\d+\s*x\s*\d+/.test(descPing)
        )) {
          return true;
        }
        pingLastErr = okPing
          ? `ADB已通但无法识别分辨率（返回: "${(descPing||"").slice(0,60)}"）`
          : (descPing || "连接超时/失败");
        return false;
      };

      // 重启命令发送后立即先 ping 一次（快速通道：如果只是服务重启，1~2秒就通）
      try {
        const firstOk = await doPing();
        if (firstOk) {
          if (_recRebootTimer) clearInterval(_recRebootTimer); _recRebootTimer = null;
          recRebooting.value = false;
          recRebootResult.value = "";
          ElMessage.success("车机已恢复，即将重置录制向导");
          recResetAll();
          return;
        }
        recRebootResult.value = `等待车机重启中…已检测 ${pingAttempts} 次（上次：${pingLastErr}）`;
      } catch(e) {}

      if (_recRebootTimer) clearInterval(_recRebootTimer);
      _recRebootTimer = setInterval(async () => {
        tickCounter++;
        recRebootCountdown.value -= 1;

        if (recRebootCountdown.value <= 0) {
          clearInterval(_recRebootTimer); _recRebootTimer = null;
          recRebooting.value = false;
          recRebootResult.value = "";
          recResetAll();
          ElMessage.warning(`重启超时（90s），共检测 ${pingAttempts} 次，已重置向导，请手动检查车机状态`);
          return;
        }

        // 每 3 秒 ping 一次
        if (tickCounter % PING_INTERVAL_TICKS === 0) {
          let carOk = false;
          try {
            carOk = await doPing();
          } catch(e) {
            pingLastErr = e.message || "检测异常";
          }
          if (carOk) {
            clearInterval(_recRebootTimer); _recRebootTimer = null;
            recRebooting.value = false;
            recRebootResult.value = "";
            ElMessage.success(`车机已恢复（检测 ${pingAttempts} 次），即将重置录制向导`);
            recResetAll();
            return;
          }
          recRebootResult.value = `等待车机重启中…已检测 ${pingAttempts} 次（上次：${pingLastErr}）`;
        }
      }, 1000);
    };
    const recResetAll = () => {
      recStep.value = 1;
      // 重置阶段1子步骤数组 + 指针
      if (recCase.value) recInitialParsed.value = parseInitialText(recCase.value.Initial_Condition);
      else recInitialParsed.value = [];
      recCurrentInitialStep.value = 1;
      recInitialSeq.value = null;
      // 重置阶段2子步骤数组 + 指针
      if (recCase.value) recActionParsed.value = parseActionText(recCase.value.Action);
      else recActionParsed.value = [];
      recCurrentActionStep.value = 1;
      recActionSeq.value = null;
      recLogs.value = []; recLogsSelected.value = []; recLogsAllSelected.value = false;
      recStartAt.value = Date.now();
      nextTick(() => { recClearCanvas(); recReloadVideo(); });
    };

    // ===== 阶段3：符合 → 组装最终 JSON，Console + ElMessage 打印 =====
    const recExpectedCorrect = async () => {
      if (recSubmitting.value) return;
      // 校验：子步骤要么已录制（s.seq），要么已标记跳过（s.skipped）
      const initFinished = (s) => s.seq || s.skipped;
      const actFinished = (s) => s.seq || s.skipped;
      const initDone = (recInitialParsed.value || []).every(initFinished);
      const actDone = (recActionParsed.value || []).every(actFinished);
      if (!initDone || !actDone) {
        const initTotal = (recInitialParsed.value || []).length;
        const initOk = (recInitialParsed.value || []).filter(s => s.seq).length;
        const initSkip = (recInitialParsed.value || []).filter(s => s.skipped && !s.seq).length;
        const actTotal = (recActionParsed.value || []).length;
        const actOk = (recActionParsed.value || []).filter(s => s.seq).length;
        const actSkip = (recActionParsed.value || []).filter(s => s.skipped && !s.seq).length;
        ElMessage.error(
          `请先完成所有子步骤（录制或跳过）：` +
          `初始条件 录制${initOk}/跳过${initSkip}/${initTotal}，` +
          `操作步骤 录制${actOk}/跳过${actSkip}/${actTotal}`
        );
        return;
      }
      const c = recCase.value || {};

      // 组装：细分步骤的完整结构（新结构，推荐使用）
      const initial_new = {
        total_substeps: (recInitialParsed.value || []).length,
        skipped_substeps: (recInitialParsed.value || []).filter(s => s.skipped && !s.seq).length,
        substeps: (recInitialParsed.value || []).map(s => ({
          idx: s.idx,
          text: s.text,
          sequence: s.seq,
          skipped: !!s.skipped && !s.seq,
        })),
      };
      const action_new = {
        total_substeps: (recActionParsed.value || []).length,
        skipped_substeps: (recActionParsed.value || []).filter(s => s.skipped && !s.seq).length,
        substeps: (recActionParsed.value || []).map(s => ({
          idx: s.idx,
          text: s.text,
          sequence: s.seq,
          skipped: !!s.skipped && !s.seq,
        })),
      };
      // 合并结构（兼容旧字段 recInitialSeq/recActionSeq，保证 _old*TestSequences 正常）
      const mergedInit = recMergeSubsteps(recInitialParsed.value);
      const mergedAct = recMergeSubsteps(recActionParsed.value);

      const finalPayload = {
        case_id: c.id || "",
        test_case_id: c.TestCaseID || c.TestKey || "",
        project_id: c.ProjectID || "",
        uid: userDisplayName.value || "",
        nickname: projectDisplayName.value || "",
        test_key: c.TestKey || "",
        // === 新：细分步骤结构（推荐） ===
        initial: initial_new,
        action_steps: action_new,
        // === 旧：合并序列，兼容已有字段 ===
        initial_sequence: mergedInit,
        action_sequence: mergedAct,
        // 预期结果 + 结果
        expected_result_text: c.Expected_Result || "",
        result: "pass",
        initial_condition_text: c.Initial_Condition || "",
        action_text: c.Action || "",
        // 元信息
        recorded_at: new Date().toISOString(),
        record_duration_ms: Date.now() - (recStartAt.value || 0),
      };
      // 写入 case 字段：仅保存 ADB 录制专属字段，不污染序列转化用的 *TestSequences
      c._adb_recorded = true;
      c._adb_record_payload = JSON.parse(JSON.stringify(finalPayload));

      // 统计：子步骤总数 + ADB 总步数
      const totalInitSub = initial_new.total_substeps;
      const totalActSub = action_new.total_substeps;
      const skippedInitSub = initial_new.skipped_substeps || 0;
      const skippedActSub = action_new.skipped_substeps || 0;
      const totalAdbInit = (mergedInit?.steps || []).length;
      const totalAdbAct = (mergedAct?.steps || []).length;

      // 上报：Console 打印 + 调用录制服务 complete 接口
      console.log("================================================");
      console.log("🎬 【案例 ADB 序列录制完成（细分步骤版） · 待上传后台 Payload】");
      console.log("================================================");
      console.log(JSON.stringify(finalPayload, null, 2));
      console.log("================================================");

      recSubmitting.value = true;
      const submitMsg = ElMessage({
        message: "正在提交最终录制结果，请稍候…",
        type: "info",
        duration: 0,
        showClose: false,
      });
      let completeMsg = "";
      try {
        // 最后一步：section_type="result"，只传 case_content + machine_id + expected_result，其余三字段不传
        const payload = {
          case_content: buildCaseContent(c),
          machine_id: testConfig.recordMachineId || "",
          section_type: "result",
          expected_result: c.Expected_Result || "",
        };
        await recordSaveStep(payload);
        completeMsg = "✅ save-step 上报成功（section_type=result，已写入预期结果）";
      } catch (e) {
        console.error("最后上报 save-step 失败:", e);
        completeMsg = "⚠️ 上报失败：" + e.message;
      } finally {
        recSubmitting.value = false;
        try { submitMsg.close(); } catch {}
      }

      try {
        await ElMessageBox({
          title: completeMsg.startsWith("✅") ? "✅ 录制完成" : "⚠️ 录制完成（上报异常）",
          message: h("div", {}, [
            h("div", { style: "margin-bottom:10px; font-weight:600;" }, `案例 [${c.id||""}] ${c.TestCaseID||c.TestKey||""}`),
            h("div", { style: "margin-bottom:6px;" }, [
              `初始条件：${totalInitSub} 个子步骤 / ${totalAdbInit} 条 ADB`,
              skippedInitSub > 0 ? h("span", { style: "margin-left:8px; color:#909399;" }, `（跳过${skippedInitSub}步）`) : null,
            ]),
            h("div", { style: "margin-bottom:6px;" }, [
              `操作步骤：${totalActSub} 个子步骤 / ${totalAdbAct} 条 ADB`,
              skippedActSub > 0 ? h("span", { style: "margin-left:8px; color:#909399;" }, `（跳过${skippedActSub}步）`) : null,
            ]),
            h("div", { style: "margin-bottom:10px; color:#67C23A;" }, "结果：PASS（符合预期）"),
            (skippedInitSub > 0 || skippedActSub > 0)
              ? h("el-alert", { props: { type:"warning", title:`本次录制含跳过步骤：初始条件${skippedInitSub}步、操作步骤${skippedActSub}步`, "show-icon":true, closable:false }, style: { marginBottom:"10px" } })
              : null,
            h("div", { style: `margin-bottom:10px; font-size:13px; ${completeMsg.startsWith("✅") ? "color:#67C23A;" : "color:#E6A23C; font-weight:600;"}` }, completeMsg),
            h("el-alert", { props: { type:"info", title:"完整 JSON Payload 已在 Console (F12) 打印", "show-icon":true, closable:false }}),
            h("div", { style: "margin-top:10px; font-size:12px; color:#909399;" },
              "Payload 包含 initial / action_steps 两个细分步骤结构（推荐使用），同时保留 initial_sequence / action_sequence 兼容旧字段。跳过步骤的 skipped=true, sequence=null。"),
          ]),
          showCancelButton: false,
          confirmButtonText: "好的，关闭录制向导",
        });
        recDialogVisible.value = false;
      } catch(e) {
        recDialogVisible.value = false;
      }
    };

    return {
      userDisplayName,
      projectDisplayName,
      handleLogout,
      currentLang,
      langOptions,
      contextMenu,
      onRowRightClick,
      convertRow,
      clearTestCase,
      runSingleRow,
      isDebugRunning,
      activeName,
      dbcFiles,
      selectedDbcName,
      mobileVideoUrl,
      instrumentVideoUrl,
      dbcDisplayName,
      infoType,
      url,
      showTestKey,
      showTestidColumn,
      clearAllSelection,
      activeDevice,
      pollingIntervals,
      cases,
      casesTable,
      reslutCases,
      logs,
      logs_total,
      searchQuery,
      filteredCases,
      logCases,
      executionLogs,
      filteredExecutionLogs,
      userLogs,
      executionLogsTable,
      handleStepScreenshotExpand,
      filteredLogCases,
      paginatedCases,
      currentPage,
      changePage,
      pageSize,
      currentPage1,
      pageSize1,
      currentPage2,
      pageSize2,
      logSettings,
      logLevel,
      activeStep,
      dialogVisible,
      newCase,
      generateKnowledgeGraphDialogVisible,
      generateKnowledgeGraphLogDiagVisible,
      caseConversionDialogVisible,
      prompt1,
      promptCaseConversion,
      generateKnowledgeGraphLog,
      sendGenerateKnowledgeGraphRequest,
      baseurl,
      serial,
      packageName,
      resourceid,
      selectedRowsAll,
      debugRows,
      selectedCase,
      selectedSheet,
      printInfo,
      selectDbcFile,
      showToast,
      autoSave,
      statusType,
      addTestCase,
      confirmAddTestCase,
      deleteTestCase,
      runTestCase,
      runCaseConversion,
      clearLogs,
      handleSelectionChange,
      handlePageChange,
      handlePageChange1,
      handlePageChange2,
      handleDbcFileUpload,
      videoPlayer,
      instrumentVideoPlayer,
      dbcFiles,
      removeDbcFile,
      dbcUploadLoading,
      fileInput,
      dbcFileInput,
      uePdfFileInput,
      selectUePdfFile,
      handleUePdfUpload,
      uePdfLoading,
      ueKgDialogVisible,
      ueKgJsonContent,
      ueKgSaveLoading,
      ueReupload,
      ueSaveToSession,
      importXlsmFile,
      exportTestReport,
      exportName,
      generateKnowledgeGraph,
      handleFileUpload,
      startDebugging,
      caseConversion,
      stopPolling,
      fetchTestList,
      fetchTestLogs,
      formatLogText,
      scrollToCase,
      tableKey,
      fetchActualResult,
      logDialogVisible,
      ActualResultDialogVisible,
      stopDebugging,
      logActiveTab,
      ActualResultActiveTab,
      activeCodeFile,
      activeImageFile,
      handleImageExpand,
      currentTestIdForImage,
      logDetails,
      ActualResultDetails,
      handleInfoTypeChange,
      selectRows,
      selectRowsdialogVisible,
      handleSheetChange,
      selectRowsHandle,
      caseIdOptions,
      startId,
      endId,
      startTime,
      endTime,
      getRowStyle,
      changeColor,
      isConverting,
      isConversionPaused,
      conversionStatusText,
      toggleConversionPause,
      cancelConversion,
      conversionProgress,
      conversionCurrent,
      conversionTotal,
      conversionCurrentId,
      conversionDialogVisible,
      iconDialogVisible,
      iconInfo,
      showIcon,
      saveIconLoading,
      saveIconNames,
      tap_iconInfo,
      testConfigVisible,
      testConfig,
      openTestConfigDialog,
      saveTestConfig,
      adbDeviceList,
      adbDeviceLoading,
      fetchAdbDeviceList,
      mobileCanvas,
      clickPos,
      onVideoClick,
      mobilePoint,
      getDeviceSize,
      resizeCanvas,
      currentTestId,
      iconConfigDialogVisible,
      iconConfigLoading,
      iconDots,

      iconRealImg,
      iconWrap,
      iconVideoPlayer,
      iconEventLayer,
      iconOverlayCanvas,
      iconVideoSrc,
      iconMode,
      adbOpLogs,
      adbLogsTableRef,
      adbOpSelectedIds,
      isAllAdbLogsSelected,
      adbSequenceName,
      clearAdbLogs,
      deleteAdbLogAt,
      onAdbSelectionChange,
      toggleSelectAllAdbLogs,
      exportSelectedAdbSequence,
      delDot,
      iconConfig,
      loadIconConfigShot,
      redrawDots,
      submitIconDots,
      iconConfigTip,
      onScreenMouseDown,
      onScreenMouseMove,
      onScreenMouseUp,
      sendAdbTap,
      sendAdbSwipe,
      sendAdbKey,
      abortCurrentTest,
      connectMobileStream,
      connectInstrumentStream,
      pageSizeOptions,
      handleSizeChange,
      clearTestResults,
      currentExecutingId,
      rowClassName,
      isMockMode,
      runMockTestCase,
      uploadRecordDialogVisible,
      openUploadRecordDialog,
      submitUpload,
      uploadForm,
      uploadRules,
      uploadFormRef,
      isUploading,
      isAutoPolling,
      currentTask,
      isProcessingTask,
      fetchTasks,
      reportCaseResult,
      reportTaskComplete,
      mobileAgentConfirmVisible,
      mobileAgentConfirmation,
      mobileAgentConfirmSuccess,
      mobileAgentConfirmDescription,
      mobileAgentConfirmSubmitting,
      mobileAgentCorrectionMode,
      mobileAgentCorrectedCoordinate,
      mobileAgentStepCompleted,
      mobileAgentSelectedCandidate,
      mobileAgentCorrectionMarkerStyle,
      selectMobileAgentCoordinate,
      submitMobileAgentConfirmation,
      closeMobileAgentConfirmation,

      // ============== 🎬 录制向导 ==============
      openRecordWizard,
      recDialogVisible,
      recStep,
      recCase,
      // 阶段1细分步骤
      recInitialParsed,
      recCurrentInitialStep,
      recJumpInitialStep,
      recPrevInitialStep,
      // 阶段2细分步骤
      recActionParsed,
      recCurrentActionStep,
      recJumpActionStep,
      recPrevActionStep,
      // 兼容保留的合并序列
      recInitialSeq,
      recActionSeq,
      recWrap,
      recImg,
      recCanvas,
      recEvLayer,
      recVideoSrc,
      recLogs,
      recLogsTableRef,
      recLogsSelected,
      recLogsAllSelected,
      recRebooting,
      recRebootCountdown,
      recRebootResult,
      recIsSending,
      recSubmitting,
      recOnImgLoaded,
      recReloadVideo,
      recSendKey,
      recOnMouseDown,
      recOnMouseMove,
      recOnMouseUp,
      recClearLogs,
      recDeleteLogAt,
      recOnSelectionChange,
      recToggleSelectAll,
      recBackTo,
      recSkipInitial,
      recSkipAction,
      recSaveInitial,
      recSaveAction,
      recExpectedWrong,
      recExpectedCorrect,
    };
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Segoe UI", "Microsoft YaHei", sans-serif;
}

body {
  background-color: #f5f7fa;
  color: #333;
  padding: 10px;
}

.app-container {
  width: 100vw;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: linear-gradient(to right, #1e4976, #2c6a9e);
  color: white;
  padding: 6px 15px;
  min-height: 55px;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.nav-left {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  min-width: 0;
}

.nav-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.meta-item {
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.92);
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 6px;
  padding: 4px 8px;
  line-height: 1;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.25);
}

.user-meta :deep(.el-divider--vertical) {
  border-left-color: rgba(255, 255, 255, 0.35);
}

.user-meta :deep(.el-button) {
  border-color: rgba(255, 255, 255, 0.35);
}

.user-meta :deep(.el-button--danger.is-plain) {
  color: rgba(255, 255, 255, 0.92);
  background: rgba(245, 108, 108, 0.18);
}

.conversion-paused-float {
  position: fixed;
  right: 16px;
  top: 70px;
  z-index: 2200;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #ebeef5;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.conversion-paused-actions {
  display: flex;
  gap: 8px;
}

.content-layout {
  display: grid;
  gap: 20px;
  /* 顶部工具栏固定悬浮，原 55px 不够时会把第一行（选择测试用例/URL地址）压住并
     被 card 的 overflow:hidden 裁掉上半截；加高避让 */
  margin-top: 80px;
  padding: 20px;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-x: auto;
}

.card {
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

:deep(.el-tabs__content) {
  overflow: auto !important;
}

.editable-table .el-table__row td {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.editable-cell {
  height: 30px;
  display: flex;
  align-items: center;
}

.editable-cell input {
  width: 100%;
  height: 100%;
  padding: 0 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
}

.editable-cell input:focus {
  outline: none;
  border-color: #409eff;
}

.logs-table .el-table__row {
  font-size: 13px;
}

.logs-table .el-table__cell {
  padding: 8px 0;
}

.device-display {
  height: 250px;
  background: #1a1a1a;
  border-radius: 12px;
  padding: 12px;
  color: #e6e6e6;
}

.device-content {
  background: #222;
  border-radius: 8px;
  height: 100%;
  padding: 10px;
  font-family: "Consolas", monospace;
  font-size: 13px;
  overflow: auto;
}

.log-settings {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.settings-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 10px;
  color: #1e4976;
}

.settings-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.debug-log {
  background-color: #f9f9f9;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 12px;
  color: #666;
}

.footer {
  padding: 15px;
  border-top: 1px solid #eee;
  text-align: center;
  color: #666;
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.log-actions {
  display: flex;
  gap: 5px;
}

.footer-controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.pagination-container {
  padding: 10px 15px;
  background: #f8fafc;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: center;
}

.highlight {
  background-color: #f0f7ff;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  background-color: #f8f8f8;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: "Consolas", monospace;
}

.file-name {
  font-size: 14px;
  color: #ffffff;
  padding: 5px 10px;
  background-color: #409eff;
  border-radius: 4px;
  vertical-align: middle;
  display: inline-block;
  max-width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

.file-button-group {
  display: flex;
  align-items: center;
  gap: 5px;
  flex: 0 0 auto;
  min-width: 0;
}

.dbc-file-list {
  display: flex;
  max-width: 260px;
  flex-wrap: nowrap;
  gap: 6px;
  align-items: center;
}

.dbc-summary { width: 150px; flex: 0 0 150px; }
.dbc-count { color: #909399; white-space: nowrap; font-size: 12px; }
.video-url-input { margin-bottom: 8px; }

.control-container {
  display: flex;
  gap: 10px;
}

.half-width {
  width: 50%;
  flex-shrink: 0;
}

.input-wrapper {
  display: flex;
  align-items: center;
}

.centered-inputs {
  display: flex;
  justify-content: center;
  align-items: center;
}

.centered-inputs span {
  margin: 0 8px;
}

.context-menu {
  position: fixed;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  list-style: none;
  padding: 4px 0;
  margin: 0;
  font-size: 14px;
  z-index: 2000;
}

.context-menu li {
  padding: 6px 16px;
  cursor: pointer;
  white-space: nowrap;
}

.context-menu li:hover {
  background-color: #f2f6fc;
  color: #409eff;
}

.user-logs-sub {
  color: #000 !important;
  font-weight: 700 !important;
}

.video-container {
  position: relative;
  width: 100%;
  height: 480px;
}

.video-container iframe {
  width: 100%;
  height: 100%;
  display: block;
}

.overlay-canvas {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto;
  z-index: 10;
}

.pin-dot {
  position: absolute;
  width: 22px;
  height: 22px;
  background: #f56c6c;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 11;
}

.pin-index {
  pointer-events: none;
}

.coord-info {
  margin-top: 8px;
  font-size: 18px;
  font-weight: 700;
  color: #000;
  user-select: text;
}

:deep(.executing-row) {
  background-color: #d4edda !important; 
}

:deep(.executing-row td) {
  background-color: #d4edda !important;
  color: #155724 !important; 
  font-weight: 600;
}

:deep(.executing-row) {
  animation: pulse-green 2s infinite;
}

@keyframes pulse-green {
  0% {
    box-shadow: inset 0 0 0 0 rgba(40, 167, 69, 0.4);
  }
  70% {
    box-shadow: inset 0 0 0 10px rgba(40, 167, 69, 0);
  }
  100% {
    box-shadow: inset 0 0 0 0 rgba(40, 167, 69, 0);
  }
}

:deep(.el-progress-bar__outer) {
  border-radius: 10px;
  background-color: #e4e7ed;
}

:deep(.el-progress-bar__inner) {
  border-radius: 10px;
  transition: width 0.3s ease;
}

:deep(.el-table__row.executing-row) {
  background-color: #d4edda !important;
}

:deep(.el-table__row.executing-row ~ .executing-row) {
  background-color: transparent !important;
}

.mobile-agent-confirmation {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mobile-agent-confirm-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 28px;
  padding: 10px 14px;
  border-radius: 6px;
  background: #f5f7fa;
  color: #303133;
}

.mobile-agent-current-purpose {
  flex-basis: 100%;
  color: #d97706;
  font-size: 15px;
}

.mobile-agent-confirm-images {
  width: 100%;
}

.mobile-agent-interaction-image {
  width: 100%;
  margin: 14px 0;
}

.mobile-agent-interaction-screenshot {
  display: block;
  max-height: 48vh;
  background: #111827;
}

.step-screenshot-collapse {
  margin-top: 8px;
}

.execution-step-screenshot {
  width: min(100%, 900px);
  max-height: 520px;
  background: #111827;
}

.mobile-agent-image-title {
  margin-bottom: 8px;
  text-align: center;
  font-weight: 600;
}

.mobile-agent-confirm-image {
  width: 100%;
  height: min(40vh, 360px);
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  background: #111827;
}

.mobile-agent-correction-canvas {
  position: relative;
  width: 100%;
  text-align: center;
}

.mobile-agent-clickable-image {
  display: block;
  width: 100%;
  height: auto;
  max-height: 40vh;
  object-fit: fill;
  cursor: crosshair;
}

.mobile-agent-correction-marker {
  position: absolute;
  width: 28px;
  height: 28px;
  border: 3px solid #f56c6c;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.9);
}

.mobile-agent-corrected-coordinate {
  margin-left: 14px;
  color: #e6a23c;
  font-weight: 600;
}

.mobile-agent-candidate-list {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 10px;
  width: 100%;
}

.mobile-agent-candidate-list :deep(.el-radio) {
  margin-right: 0;
}

.execution-log-message {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.55;
}
</style>
