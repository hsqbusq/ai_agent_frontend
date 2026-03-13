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
              @click="exportTestReport"
              style="padding: 15px"
            >
              <img src="../assets/04.svg" alt="" style="width: 14px; height: 14px" />
              导出测试报告
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
              <el-tooltip v-if="dbcFileName" :content="dbcFileName.name" placement="top">
                <span class="file-name">已选择：{{ dbcFileName.name }}</span>
              </el-tooltip>
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
      @change="handleDbcFileUpload"
      style="display: none"
    />

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
              <span style="margin-right: 8px">URL地址：</span>
              <el-input
                v-model="url"
                placeholder="请输入URL地址"
                style="flex: 1"
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

              <!-- 测试结果 - 不可编辑 -->
              <el-table-column prop="Result" label="测试结果" min-width="180">
                <template #default="scope">
                  <span>{{ scope.row.Result }}</span>
                  <br />
                  <el-button
                    v-if="scope.row.Result !== undefined"
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

              <!-- 实际结果 - 不可编辑 -->
              <el-table-column prop="ActualResult" label="实际结果" min-width="180">
                <template #default="scope">
                  <br />
                  <el-button
                    v-if="scope.row.Result !== undefined"
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
                    ></el-table-column>
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
                  <!-- 标点画布 -->
                  <canvas
                    ref="mobileCanvas"
                    class="overlay-canvas"
                    @click="onVideoClick($event, 'mobile')"
                  ></canvas>

                  <!-- 红点提示 -->
                  <div
                    v-if="mobilePoint"
                    class="pin-dot"
                    :style="{
                      left: mobilePoint.left + 'px',
                      top: mobilePoint.top + 'px',
                    }"
                  >
                    <el-tooltip
                      :content="`(${mobilePoint.x}, ${mobilePoint.y})`"
                      placement="top"
                    >
                      <span class="pin-index">1</span>
                    </el-tooltip>
                  </div>

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
      width="440px"
      :close-on-click-modal="true"
    >
      <el-form label-width="150px" style="padding: 0 8px">
        <el-card shadow="never" style="margin-bottom: 16px">
          <template #header>
            <div style="font-weight: 600">图像匹配相关设置</div>
          </template>
          <!-- <el-form-item label="图像等待策略">
                        <el-select v-model="testConfig.waitStrategy" style="width:100%">
                            <el-option label="固定时间+持续判断" value="fixed_and_poll" />
                            <el-option label="仅固定时间" value="fixed_only" />
                            <el-option label="仅持续判断" value="poll_only" />
                        </el-select>
                    </el-form-item> -->
          <el-form-item label="前置等待时间">
            <el-input-number
              v-model="testConfig.preWaitSec"
              :min="0"
              :max="999"
              :step="1"
              :precision="0"
              style="width: 100%"
            />
            <div style="font-size: 12px; color: #999">单位：秒</div>
          </el-form-item>
          <el-form-item label="检测超时时间">
            <el-input-number
              v-model="testConfig.timeoutSec"
              :min="1"
              :max="999"
              :step="1"
              :precision="0"
              style="width: 100%"
            />
            <div style="font-size: 12px; color: #999">单位：秒</div>
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
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
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
            正在转化：{{ conversionCurrentId || "准备中..." }}
          </div>
          <div style="font-size: 13px">
            进度：{{ conversionCurrent }} / {{ conversionTotal }} 条
          </div>
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
    <el-dialog v-model="iconConfigDialogVisible" title="图标配置" width="55%">
      <el-alert
        v-if="iconConfigTip"
        :title="iconConfigTip"
        type="error"
        :closable="false"
        style="margin-bottom: 12px"
      >
      </el-alert>
      <!-- 图片+画布容器 -->
      <div style="position: relative; text-align: center; line-height: 0">
        <!-- 1. 真实截图，保证能看见 -->
        <img
          ref="iconRealImg"
          style="max-width: 100%; height: auto; border: 1px solid #ccc; cursor: crosshair"
          @click="onImgClick"
          alt="截图"
        />
        <!-- 2. 透明画布，只画点和序号 -->
        <canvas
          ref="iconOverlayCanvas"
          style="
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
          "
        >
        </canvas>
      </div>

      <!-- 已标点列表 -->
      <el-table :data="iconDots" style="margin-top: 12px" max-height="220">
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
        <el-button type="primary" @click="submitIconDots">保存坐标</el-button>
      </template>
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
          <pre style="text-align: left">{{ logDetails.logs }}</pre>
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
          <!-- 新增图片展示栏 -->
          <!-- <div v-for="(image, index) in logDetails.images" :key="index">
                        <p><strong>{{ image.filename }}</strong></p>
                        <img :src="'data:image/png;base64,' + image.base64_data" alt="Test Image"
                            style="width: 100%; margin-bottom: 10px;" />
                    </div> -->
          <el-collapse v-model="activeCodeFile">
            <el-collapse-item
              v-for="(image, index) in logDetails.images"
              :key="index"
              :title="image.filename"
            >
              <img
                :src="'data:image/png;base64,' + image.base64_data"
                alt="Test Image"
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

    <el-dialog v-model="ActualResultDialogVisible" title="真实结果" width="70%">
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
    const selectedCase = ref("");
    const selectedSheet = ref("");
    const infoType = ref("all");
    const default_url = ref("http://172.23.96.54:8000");

    const url = ref(localStorage.getItem("TEST_URL") ?? default_url);
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

      selectedRowsAll.value = [row];
      await nextTick(() => {
        proxy.$refs.caseTable.clearSelection();
        proxy.$refs.caseTable.toggleRowSelection(row, true);
      });
      await scrollToCase(row.id);

      await startDebugging();
      showToast(`用例 ${row.id} 开始执行`, "info");
    };

    watch(cases, async () => await saveCases(cases.value), { deep: true });
    watch(casesTable, async () => await saveCasesTable(casesTable.value), { deep: true });

    watch(currentLang, (val) => {
      showToast(`已切换到 ${val}`, "info");
    });

    watch(url, (newVal) => {
      localStorage.setItem("TEST_URL", newVal);
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
    const iconOverlayCanvas = ref(null);
    const iconConfigTip = ref("");

    const iconConfig = () => {
      iconConfigDialogVisible.value = true;
      iconDots.value = [];
      nextTick(loadIconConfigShot);
    };

    watch(iconConfigDialogVisible, (v) => {
      if (!v) iconConfigTip.value = ""; // 关闭弹框即清空提示
    });

    const loadIconConfigShot = async () => {
      iconConfigLoading.value = true;
      try {
        const res = await fetch(url.value + "/adb/getScreenshot");
        if (!res.ok) throw new Error("接口异常 " + res.status);
        const blob = await res.blob();
        const blob_url = URL.createObjectURL(blob);

        iconRealImg.value.src = blob_url;
        iconRealImg.value.onload = () => {
          const img = iconRealImg.value;
          const cvs = iconOverlayCanvas.value;
          // 画布像素 = 原始分辨率
          cvs.width = img.naturalWidth;
          cvs.height = img.naturalHeight;
          // CSS 大小 = img 视觉大小
          const rect = img.getBoundingClientRect();
          cvs.style.width = rect.width + "px";
          cvs.style.height = rect.height + "px";

          redrawDots(); // 重画已有标点
          iconConfigLoading.value = false;
        };
      } catch (e) {
        ElMessage.error("加载截图失败：" + e.message);
        iconConfigLoading.value = false;
      }
    };

    const onImgClick = (e) => {
      const img = iconRealImg.value;
      const rect = img.getBoundingClientRect();
      // 点击 → 原始像素
      const x = Math.round((e.offsetX / rect.width) * img.naturalWidth);
      const y = Math.round((e.offsetY / rect.height) * img.naturalHeight);
      iconDots.value.push({ name: "", x, y });
      redrawDots();
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
    const logDetails = reactive({
      logs: "",
      ignition_logs: "",
      code_files: [],
      images: [],
    });
    const ActualResultDetails = reactive({
      images: "",
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
        paginatedCases.value.forEach((row) => {
          const isSelected = selectedRowsAll.value.some((r) => r.id === row.id);
          proxy.$refs.caseTable?.toggleRowSelection(row, isSelected);
        });
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

    const resizeCanvas = (canvas, realW, realH) => {
      if (!canvas) return; // 防空
      const box = canvas.parentElement?.getBoundingClientRect();
      if (!box) return;

      canvas.width = realW;
      canvas.height = realH;
      canvas.style.width = box.width + "px";
      canvas.style.height = box.height + "px";
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
      instrumentVideoPlayer.value.src = `${url.value}/camera/video?name=UGREEN`;
    };

    const connectMobileStream = async () => {
      const { w, h } = await getDeviceSize();
      resizeCanvas(mobileCanvas.value, w, h);
      videoPlayer.value.src = `${url.value}/adb/video`;
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

      await saveCases([]);
      await saveCasesTable([]);

      currentPage.value = 1;
      selectedRowsAll.value = [];
      proxy.$refs.caseTable?.clearSelection();

      showToast("全部测试用例已清空", "success");
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
      selectedRowsAll.value = [];
      proxy.$refs.caseTable?.clearSelection();

      // 保存到本地存储
      await saveCases(cases.value);

      showToast("所有测试结果已清除", "success");
    };

    // 清除日志
    const clearLogs = () => {
      logs.value = [];
      showToast("日志已清除", "info");
    };

    // 选中的行
    const selectedRowsAll = ref([]);
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
      selectedRowsAll.value = [];
      proxy.$refs.caseTable.clearSelection();
      showToast("已取消所有选中用例", "info");
    };

    const caseIdOptions = computed(() =>
      cases.value.map((item) => ({ value: item.id, label: item.id }))
    );

    const selectRowsHandle = () => {
      const newSelectedRowsAll1 = [];
      console.log(cases.value);

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

      for (let i = start; i <= end; i++) {
        newSelectedRowsAll1.push(cases.value[i]);
      }

      changePage.value = true;
      paginatedCases.value.forEach((row) => {
        selectedRowsAll.value = [];
        const isSelected = selectedRowsAll.value.some((r) => r.id === row.id);
        proxy.$refs.caseTable.toggleRowSelection(row, isSelected);
      });
      changePage.value = false;
      console.log(selectedRowsAll.value);
      newSelectedRowsAll1.forEach((row) => {
        selectedRowsAll.value.push(row);
      });
      selectRowsdialogVisible.value = false;
      const targetPage = Math.floor(start / pageSize.value) + 1;
      handlePageChange(targetPage);
    };

    // 处理选中改变事件
    const handleSelectionChange = (selection) => {
      console.log(isConverting.value);
      console.log(selectedRowsAll.value);
      if (isConverting.value || isDebugRunning.value) {
        return;
      }

      selection.forEach((row) => {
        if (!selectedRowsAll.value.some((r) => r.id === row.id)) {
          selectedRowsAll.value.push(row);
        }
      });
      if (isDebugRunning.value) {
        paginatedCases.value.forEach((row) => {
          const isSelected = selectedRowsAll.value.some((r) => r.id === row.id);
          proxy.$refs.caseTable.toggleRowSelection(row, isSelected);
        });
        return;
      }

      // 移除不再选中的行
      if (selection.length == 0) {
        if (changePage.value) {
          changePage.value = false;
        } else {
          let newSelectedRowsAll = [];
          selectedRowsAll.value.forEach((row) => {
            if (!paginatedCases.value.some((r) => r.id === row.id)) {
              newSelectedRowsAll.push(row);
            }
          });
          selectedRowsAll.value = newSelectedRowsAll;
        }
      } else {
        if (!changePage.value) {
          let newSelectedRowsAll = [];
          selectedRowsAll.value.forEach((row) => {
            if (
              paginatedCases.value.some((r) => r.id === row.id) &&
              selection.some((r) => r.id === row.id)
            ) {
              newSelectedRowsAll.push(row);
            } else if (!paginatedCases.value.some((r) => r.id === row.id)) {
              newSelectedRowsAll.push(row);
            }
          });
          selectedRowsAll.value = newSelectedRowsAll;
        }
      }
    };

    const handlePageChange = async (newPage) => {
      currentPage.value = newPage;
      changePage.value = true;
      showToast(`切换到第 ${newPage} 页`, "info");

      // 等待表格渲染完成
      await nextTick();

      // 恢复当前页的选中状态（但不触发滚动）
      paginatedCases.value.forEach((row) => {
        const isSelected = selectedRowsAll.value.some((r) => r.id === row.id);
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
    const exportTestReport = async () => {
      showToast("正在生成测试报告，请稍后...", "info");

      // 直接过滤出已有结果的用例，不再获取实际结果图片
      reslutCases.value = cases.value.filter(
        (c) => c.Result !== undefined && c.Result !== ""
      );
      const list = reslutCases.value;
      const total = list.length;
      const pass = list.filter((c) => /pass/i.test(c.Result)).length;
      const fail = total - pass;

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
              /pass/i.test(c.Result) ? "#d4f8d4" : "#ffe1e1"
            };font-weight:600;">
                ${c.Result ?? ""}
            </td>
            <!-- 直接显示“暂无图片” -->
            <td><span class="empty-img">暂无图片</span></td>
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
        .replace("{{ROWS}}", rowsHtml);

      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const timeStamp = new Date()
        .toLocaleString("zh-CN", { hour12: false })
        .replace(/[/: ]/g, "");
      exportName.value = `TestReport_${timeStamp}.html`;
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

      const pollInterval = setInterval(poll, interval); // 每隔 5 秒执行一次 poll 函数

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
            const json = XLSX.utils.sheet_to_json(worksheet, { range: 6 });
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
                TestCaseID: row["Test Case ID"],
                SyRDIDFSRD: row["SyRD ID/FSR"],
                Auto_testID: row["Auto_test ID"],
                TSR: row["TSR"],
                CasePriority: row["Case\r\nPriority"],
                DesignMethod: row["Design Method "],
                TestMethod: row["Test Method"],
                TestStrategy: row["Test\r\nStrategy "],
                TestKey: row["Test Key\r\n功能点"],
                Initial_Condition: row["Pre-condition\r\n前提条件"],
                Action: row["Action\r\n操作步骤"],
                Expected_Result: row["Expected Result\r\n期望结果"],
                InitTestSequences: row["Init Test Sequences\r\n测试序列前置条件"],
                ActionTestSequences: row["Action Test Sequences\r\n动作测试序列"],
                ExpectedTestSequences: row["Expected Test Sequences\r\n预期测试序列结果"],
                Selected: row["Selected"],
                Result: row["Test Result"],
                ActualResult: row["Actual Result"],
                PRNo: row["PR No."],
                TestLogs: row["Test Logs"],
                TestDate: row["Test Date"],
                Remark: row["Remark"],
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
        paginatedCases.value.forEach((row) => {
          const isSelected = selectedRowsAll.value.some((r) => r.id === row.id);
          console.log(`[restore] ${row.id}: ${isSelected}`);
          table.toggleRowSelection(row, isSelected);
        });
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
        currentExecutingId.value = row.id;
        await scrollToCase(row.id);

        try {
          if (!debugRows.value.some((dr) => dr.id === row.id)) {
            debugRows.value.push(row);
          }
          selectedCase.value = row.id;
          const query = `前提条件: ${row.InitTestSequences} 操作步骤: ${row.ActionTestSequences} 预期结果:${row.ExpectedTestSequences}`;
          const baseurl = url.value;
          if (isMockMode.value) {
            await runMockTestCase(row.id, row);
          } else {
            await runTestCase(query, baseurl, row.id, row);
          }
          // await runTestCase(query, baseurl, row.id, row);
        } catch (error) {
          showToast(`测试用例${row.id}调试失败`, "error");
        } finally {
          if (isDebugRunning.value) {
            const table = proxy.$refs.caseTable;
            const bodyWrapper = table?.$el.querySelector(
              ".el-table__body-wrapper .el-scrollbar__wrap"
            );
            const savedScrollTop = bodyWrapper ? bodyWrapper.scrollTop : 0;
            currentExecutingId.value = "";
            await nextTick();
            if (bodyWrapper && savedScrollTop > 0) {
              bodyWrapper.scrollTop = savedScrollTop;
            }
          }
        }

        index++;
      }

      isDebugRunning.value = false;
      endTime.value = parseInt(Date.now());
      currentExecutingId.value = "";
      showToast("调试已完成", "info");
      
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

    const isDebugRunning = ref(false);
    const currentExecutingId = ref("");

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
      tableKey.value++;
      debugRows.value = [];
      selectedCase.value = "";
      stopPolling();
      executionLogs.value = {};
      if (currentTestId.value) {
        try {
          await fetch(`/dev-api/cancelsession`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ test_id: currentTestId.value }),
          });
          showToast("已发送停止指令", "info");
        } catch (e) {
          console.error("cancelSession 失败", e);
        } finally {
          currentTestId.value = "";
        }
      }
    };

    const abortCurrentTest = () => {
      isDebugRunning.value = false;
      if (currentTestId.value) {
        fetch("/dev-api/cancelsession", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ test_id: currentTestId.value }),
        }).catch(() => {});
        currentTestId.value = "";
      }
      stopPolling();
    };

    const pollingIntervals = {};
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
      const steps = row.InitTestSequences.split("\n")
        .filter(Boolean)
        .concat(row.ActionTestSequences.split("\n").filter(Boolean));
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

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 3 && isDebugRunning.value) {
          const newResponseText = xhr.responseText.slice(lastProcessedLength);

          const lines = newResponseText.split("\n");
          var thinkFlag = false;
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
                testIdFound = true;
                const pollForResult = async () => {
                  const maxPollingTime = 600000; // 300s
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
          // 更新已处理的数据位置
          lastProcessedLength = xhr.responseText.length;
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
          detect_before_timeout: testConfig.preWaitSec + "",
          detect_timeout: testConfig.timeoutSec + "",
        })
      );
    };

    const isConverting = ref(false);
    const conversionProgress = ref(0); // 当前进度百分比
    const conversionCurrent = ref(0); // 当前处理数量
    const conversionTotal = ref(0); // 总数量
    const conversionCurrentId = ref(""); // 当前正在转化的用例ID
    const conversionDialogVisible = ref(false); // 进度弹窗显示状态
    const caseConversion = async () => {
      caseConversionDialogVisible.value = false;
      if (selectedRowsAll.value.length === 0) {
        showToast("请先选择要转换的测试用例", "warning");
        return;
      }

      // 初始化进度
      isConverting.value = true;
      conversionTotal.value = selectedRowsAll.value.length;
      conversionCurrent.value = 0;
      conversionProgress.value = 0;
      conversionDialogVisible.value = true;

      showToast("开始转换测试用例", "info");

      const selectedIds = selectedRowsAll.value.map((row) => row.id);
      const failedIds = [];

      for (let i = 0; i < selectedRowsAll.value.length; i++) {
        const row = selectedRowsAll.value[i];

        conversionCurrentId.value = row.id;
        conversionCurrent.value = i + 1;
        conversionProgress.value = Math.round(((i + 1) / conversionTotal.value) * 100);

        try {
          await new Promise((resolve, reject) => {
            runCaseConversion(row, resolve, reject);
          });
        } catch (error) {
          console.error(`用例 ${row.id} 转换失败:`, error);
          failedIds.push(row.id);
        }
      }

      setTimeout(() => {
        conversionDialogVisible.value = false;
        isConverting.value = false;
        conversionProgress.value = 0;

        if (failedIds.length > 0) {
          showToast(`部分用例转换失败: ${failedIds.join(", ")}`, "error");
        } else {
          showToast(`所有用例转换完成`, "success");
        }

        // 恢复选中状态
        nextTick(() => {
          selectedIds.forEach((id) => {
            const row = cases.value.find((c) => c.id === id);
            if (row) {
              proxy.$refs.caseTable.toggleRowSelection(row, true);
            }
          });
        });
      }, 500);
    };

    const convertRow = (row) => {
      contextMenu.visible = false;
      if (!row) return;

      conversionTotal.value = 1;
      conversionCurrent.value = 0;
      conversionProgress.value = 0;
      conversionDialogVisible.value = true;
      isConverting.value = true;
      conversionCurrentId.value = row.id;

      runCaseConversion(
        row,
        () => {
          conversionProgress.value = 100;
          conversionCurrent.value = 1;
          setTimeout(() => {
            conversionDialogVisible.value = false;
            isConverting.value = false;
            showToast(`用例 ${row.id} 转换成功`, "success");
          }, 300);
        },
        (err) => {
          conversionDialogVisible.value = false;
          isConverting.value = false;
          showToast(`用例 ${row.id} 转换失败`, "error");
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
        await callApi(
          row.id,
          row.Initial_Condition,
          "A",
          false,
          "A",
          row.Expected_Result
        );
        await callApi(row.id, row.Action, "B", false, "B", row.Expected_Result);

        const index = cases.value.findIndex((c) => c.id === row.id);
        cases.value[index].ExpectedTestSequences = row.Expected_Result;
        resolve();
      } catch (error) {
        reject(error);
      }
    };

    const callApi = (id, input, task, stream, step, predict) => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/dev-api/v1/chat/completions", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Accept", "text/event-stream");

        xhr.onreadystatechange = function () {
          if (xhr.readyState !== 4) return;

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
                  showToast(`用例 ${id} 转换成功`, "success");
                }
              }
              resolve();
            } catch (e) {
              reject(e);
            }
          } else {
            reject(new Error(`用例 ${id} 请求失败：HTTP ${xhr.status}`));
          }
        };
        xhr.onerror = function () {
          reject(new Error(`用例 ${id} 网络错误，请检查服务是否可用`));
        };
        const dbc = dbcFileName.value.name;
        const prompt = prompt1.value;
        xhr.send(JSON.stringify({ input, task, stream, dbc, prompt, predict }));
      });
    };

    const stopPolling = () => {
      Object.keys(pollingIntervals).forEach((test_id) => {
        clearInterval(pollingIntervals[test_id]);
        delete pollingIntervals[test_id]; // 清除引用
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

    const fetchTestLogs = (test_id) => {
      fetch(`/dev-api/test_logs/${test_id}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.code === "200") {
            logDetails.logs = data.result.logs.chat_log;
            logDetails.code_files = data.result.logs.code_files;
            logDetails.images = data.result.logs.images;
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

    const dbcFileName = ref("");
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
      const file = event.target.files[0];
      if (!file) return;

      if (!file.name.endsWith(".dbc")) {
        showToast("请选择.dbc格式的文件", "error");
        return;
      }

      dbcUploadLoading.value = true;

      try {
        const formData = new FormData();
        formData.append("file", file); // 接口参数名为 file

        const response = await fetch("/dev-api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (response.ok && data.code === 200) {
          dbcFileName.value = {
            name: file.name,
            path: data.result?.save_path || "",
            size: data.result?.file_size || file.size,
          };
          showToast(`DBC文件上传成功: ${file.name}`, "success");
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

    const testConfigVisible = ref(false);

    const testConfig = reactive({
      waitStrategy: "fixed_and_poll",
      preWaitSec: 0,
      timeoutSec: 0,
      continueOnFail: false,
      defaultAllIn: false,
    });

    const loadTestConfig = () => {
      try {
        const str = localStorage.getItem("TEST_CONFIG");
        if (str) Object.assign(testConfig, JSON.parse(str));
      } catch {}
    };
    loadTestConfig();

    const openTestConfigDialog = () => {
      testConfigVisible.value = true;
    };

    const saveTestConfig = () => {
      localStorage.setItem("TEST_CONFIG", JSON.stringify(testConfig));
      testConfigVisible.value = false;
      showToast("测试配置已保存", "success");
    };

    // 模拟组件加载
    onMounted(async () => {
      cases.value = await loadCases().then((list) =>
        list.length
          ? list
          : [
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
            ]
      );
      casesTable.value = await loadCasesTable();
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
    });

    // 组件卸载时停止轮询
    onUnmounted(() => {
      stopPolling();
    });

    return {
      currentLang,
      langOptions,
      contextMenu,
      onRowRightClick,
      convertRow,
      clearTestCase,
      runSingleRow,
      isDebugRunning,
      activeName,
      dbcFileName,
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
      dbcFileName,
      dbcUploadLoading,
      fileInput,
      dbcFileInput,
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
      scrollToCase,
      tableKey,
      fetchActualResult,
      logDialogVisible,
      ActualResultDialogVisible,
      stopDebugging,
      logActiveTab,
      ActualResultActiveTab,
      activeCodeFile,
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
      iconOverlayCanvas,
      delDot,
      iconConfig,
      loadIconConfigShot,
      onImgClick,
      redrawDots,
      submitIconDots,
      iconConfigTip,
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
  padding: 0 15px;
  height: 55px;
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
}

.nav-right {
  margin-left: auto;
}

.content-layout {
  display: grid;
  gap: 20px;
  margin-top: 55px;
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
}

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
</style>
