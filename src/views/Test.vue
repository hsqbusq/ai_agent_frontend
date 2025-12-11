<template>
    <div class="app-container">
        <!-- 顶部导航栏 -->
        <div class="header">
            <div class="header-left">
                <div class="nav-buttons">
                    <div class="nav-left">
                        <el-button type="primary" size="small" @click="startDebugging" style="padding: 15px">
                            <img src="../assets/01.svg" alt="" style="width: 14px;height: 14px" /> 开始测试
                        </el-button>
                        <el-button type="primary" size="small" @click="stopDebugging" style="padding: 15px">
                            <img src="../assets/07.svg" alt="" style="width: 14px;height: 14px" /> 停止测试
                        </el-button>
                        <!-- <el-button type="primary" size="small" @click="addTestCase" style="padding: 15px">
                            <img src="../assets/02.svg" alt="" style="width: 14px;height: 14px" /> 增加用例
                        </el-button> -->
                        <el-button type="primary" size="small" @click="importXlsmFile" style="padding: 15px">
                            <img src="../assets/02.svg" alt="" style="width: 14px;height: 14px" /> 导入用例
                        </el-button>
                        <!-- <el-button type="primary" size="small" @click="showToast('导出用例')" style="padding: 15px">
                        <img src="../assets/03.svg" alt="" style="width: 14px;height: 14px" /> 导出测试用例
                    </el-button> -->
                        <el-button type="primary" size="small" @click="exportTestReport" style="padding: 15px">
                            <img src="../assets/04.svg" alt="" style="width: 14px;height: 14px" /> 导出测试报告
                        </el-button>
                        <el-button type="primary" size="small" @click="generateKnowledgeGraph" style="padding: 15px">
                            <img src="../assets/05.svg" alt="" style="width: 14px;height: 14px" /> 形成知识图谱
                        </el-button>
                        <el-button type="primary" size="small" @click="promptCaseConversion" style="padding: 15px">
                            <img src="../assets/06.svg" alt="" style="width: 14px;height: 14px" /> 序列化用例转化
                        </el-button>
                        <el-button type="primary" size="small" @click="deleteTestCase" style="padding: 15px">
                            <img src="../assets/10.svg" alt="" style="width: 14px;height: 14px" /> 删除用例
                        </el-button>
                        <el-button type="primary" size="small" @click="SynchronizeTestResults" style="padding: 15px">
                            <img src="../assets/05.svg" alt="" style="width: 14px;height: 14px" /> 文档同步设置
                        </el-button>
                        <!-- <el-button type="primary" size="small" @click="selectDbcFile" style="padding: 15px">
                        <img src="../assets/02.svg" alt="" style="width: 14px;height: 14px" /> 读取dbc
                    </el-button>
                    <span v-if="dbcFileName" class="file-name">已选择：{{ dbcFileName.name }}</span> -->
                        <div class="file-button-group">
                            <el-button type="primary" size="small" @click="selectDbcFile" style="padding: 15px">
                                <img src="../assets/02.svg" alt="" style="width: 14px;height: 14px" /> 读取DBC
                            </el-button>
                            <el-tooltip v-if="dbcFileName" :content="dbcFileName.name" placement="top">
                                <span class="file-name">已选择：{{ dbcFileName.name }}</span>
                            </el-tooltip>
                            <!-- <span v-if="dbcFileName" class="file-name">已选择：{{ dbcFileName.name }}</span> -->
                        </div>
                    </div>

                    <div class="nav-right">

                        <el-select v-model="currentLang" placeholder="选择语言" style="width: 120px; margin-left: 12px">
                            <el-option v-for="item in langOptions" :key="item.value" :label="item.label"
                                :value="item.label" />
                        </el-select>
                    </div>

                </div>
            </div>
        </div>

        <input type="file" ref="fileInput" accept=".xlsm,.xlsx" @change="handleFileUpload" style="display: none;" />
        <input type="file" ref="dbcFileInput" accept=".dbc" @change="handleDbcFileUpload" style="display: none;" />

        <!-- 主内容区 -->
        <div class="content-layout">
            <div class="main-content">
                <div class="card">
                    <div class="control-container">
                        <el-button @click="selectRows">选择测试用例</el-button>
                        <el-button @click="clearAllSelection">取消选择</el-button>
                        <el-select v-model="infoType" placeholder="请选择信息类型" @change="handleInfoTypeChange"
                            class="half-width">
                            <el-option label="关键信息" value="critical"></el-option>
                            <el-option label="全部信息" value="all"></el-option>
                        </el-select>
                        <div class="half-width input-wrapper">
                            <span style="margin-right: 8px;">URL地址：</span>
                            <el-input v-model="url" placeholder="请输入URL地址" style="flex: 1;"></el-input>
                        </div>
                    </div>
                    <div>
                        <el-table ref="caseTable" :data="paginatedCases" class="editable-table" height="450"
                            highlight-current-row @selection-change="handleSelectionChange"
                            @row-contextmenu="onRowRightClick" style="width: 100%" row-key="id">
                            <el-table-column type="selection" :selectable="selectable" width="55"></el-table-column>
                            <el-table-column prop="id" label="Case ID" width="80" align="center"></el-table-column>
                            <el-table-column prop="TestCaseID" label="测试用例ID" min-width="120"
                                v-if="showTestKey"></el-table-column>
                            <el-table-column prop="SyRDIDFSRD" label="SyRD/FSRD ID" min-width="120"
                                v-if="showTestKey"></el-table-column>
                            <el-table-column prop="Auto_testID" label="自动测试ID" min-width="120"
                                v-if="showTestKey"></el-table-column>
                            <el-table-column prop="TSR" label="TSR" min-width="120"
                                v-if="showTestKey"></el-table-column>
                            <el-table-column prop="CasePriority" label="用例优先级" min-width="120"
                                v-if="showTestKey"></el-table-column>
                            <el-table-column prop="TestMethod" label="测试方法" min-width="120"
                                v-if="showTestKey"></el-table-column>
                            <el-table-column prop="TestStrategy" label="测试策略" min-width="120"
                                v-if="showTestKey"></el-table-column>
                            <el-table-column prop="DesignMethod" label="设计方法" min-width="120"
                                v-if="showTestKey"></el-table-column>
                            <el-table-column prop="TestKey" label="测试功能点" min-width="120"
                                v-if="showTestKey"></el-table-column>
                            <el-table-column prop="Initial_Condition" label="初始条件" min-width="200"></el-table-column>
                            <el-table-column prop="Action" label="动作" min-width="180"></el-table-column>
                            <el-table-column prop="Expected_Result" label="预期结果" min-width="180"></el-table-column>
                            <el-table-column prop="InitTestSequences" label="初始条件序列" min-width="180">
                                <template #default="scope">
                                    <el-input v-if="scope.row.editing" v-model="scope.row.InitTestSequences"
                                        @blur="scope.row.editing = false" type="textarea" autosize></el-input>
                                    <span @click="scope.row.editing = true" v-else>{{ scope.row.InitTestSequences
                                        }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="ActionTestSequences" label="操作步骤序列" min-width="140">
                                <template #default="scope">
                                    <el-input v-if="scope.row.editing" v-model="scope.row.ActionTestSequences"
                                        @blur="scope.row.editing = false" type="textarea" autosize></el-input>
                                    <span @click="scope.row.editing = true" v-else>{{ scope.row.ActionTestSequences
                                        }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="ExpectedTestSequences" label="预期结果序列" min-width="140">
                                <template #default="scope">
                                    <el-input v-if="scope.row.editing" v-model="scope.row.ExpectedTestSequences"
                                        @blur="scope.row.editing = false" type="textarea" autosize></el-input>
                                    <span @click="scope.row.editing = true" v-else>{{ scope.row.ExpectedTestSequences
                                        }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="Result" label="测试结果" min-width="180">
                                <template #default="scope">
                                    <span>{{ scope.row.Result }}</span>
                                    <br />
                                    <el-button v-if="scope.row.Result !== undefined" type="primary" size="small"
                                        @click="fetchTestLogs(scope.row.Testid)" style="padding: 15px">
                                        <img src="../assets/11.svg" alt="" style="width: 14px;height: 14px" />
                                        查看
                                    </el-button>
                                </template>
                            </el-table-column>
                            <el-table-column prop="ActualResult" label="实际结果" min-width="180">
                                <template #default="scope">
                                    <br />
                                    <!--  -->
                                    <el-button v-if="scope.row.Result !== undefined" type="primary" size="small"
                                        @click="fetchActualResult(scope.row.Testid, scope.row.ExpectedTestSequences)"
                                        style="padding: 15px">
                                        <img src="../assets/11.svg" alt="" style="width: 14px;height: 14px" />
                                        查看
                                    </el-button>
                                </template>
                            </el-table-column>
                            <!-- <el-table-column prop="ActualResult" label="实际结果" min-width="120" v-if="showTestKey">
                        </el-table-column> -->
                            <el-table-column prop="Selected" label="是否选中" min-width="120" v-if="showTestKey">
                            </el-table-column>
                            <!-- <el-table-column prop="TestResult" label="测试结果" min-width="120" v-if="showTestKey">
                        </el-table-column> -->

                            <el-table-column prop="PRNo" label="PR号" min-width="120" v-if="showTestKey">
                            </el-table-column>
                            <el-table-column prop="TestLogs" label="测试日志" min-width="120" v-if="showTestKey">
                            </el-table-column>
                            <el-table-column prop="Numberoftests" label="测试次数" min-width="120" v-if="showTestKey">
                            </el-table-column>
                            <el-table-column prop="TestDate" label="测试日期" min-width="120" v-if="showTestKey">
                            </el-table-column>
                            <el-table-column prop="Remark" label="备注" min-width="120" v-if="showTestKey">
                            </el-table-column>
                            <el-table-column label="Testid" v-if="showTestidColumn"> </el-table-column>
                            <!-- <el-table-column label="查看" min-width="260">
                            <el-button type="primary" size="small" @click="fetchTestLogs(row.id)" style="padding: 15px"
                                v-if="scope.row.Result !== null">
                                <img src="../assets/11.svg" alt="" style="width: 14px;height: 14px" />
                                查看
                            </el-button>
                        </el-table-column> -->
                        </el-table>
                        <ul v-show="contextMenu.visible"
                            :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }" class="context-menu"
                            @mouseleave="contextMenu.visible = false">
                            <li @click="startDebugging">执行已选用例</li>
                            <li @click="runSingleRow(contextMenu.row)">本用例执行</li>
                            <li @click="convertRow(contextMenu.row)">本用例序列化转换</li>
                        </ul>
                    </div>

                    <div class="pagination-container">
                        <el-pagination background layout="prev, pager, next" :total="cases.length" :page-size="pageSize"
                            :current-page="currentPage" @current-change="handlePageChange">
                        </el-pagination>
                    </div>
                </div>

                <!-- 日志输出 -->
                <div style="display: flex">
                    <div class="card" style="flex: 5;padding: 10px">
                        <el-tabs v-model="activeName" type="card">
                            <el-tab-pane label="过往测试记录" name="first">
                                <el-table :data="logCases" class="logs-table" height="440" style="width: 100%">
                                    <el-table-column prop="id" label="序号" width="80" align="center"></el-table-column>
                                    <el-table-column prop="time" label="时间" min-width="160" sortable></el-table-column>
                                    <el-table-column prop="message" label="消息" min-width="260"></el-table-column>
                                    <el-table-column label="操作" min-width="260">
                                        <template #default="{ row }">
                                            <el-button type="primary" size="small" @click="fetchTestLogs(row.id)"
                                                style="padding: 15px">
                                                <img src="../assets/11.svg" alt="" style="width: 14px;height: 14px" />
                                                查看
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <div style="display: flex;align-items: center">
                                    <div>
                                        每页{{ pageSize1 }}条，共{{ logs_total }}条
                                    </div>
                                    <div class="pagination-container">
                                        <el-pagination background layout="prev, pager, next" :total="logs_total"
                                            :page-size="pageSize1" :current-page="currentPage1"
                                            @current-change="handlePageChange1">
                                        </el-pagination>
                                    </div>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="测试执行日志" name="third">
                                <el-select v-model="selectedCase" placeholder="请选择测试用例" style="margin-bottom: 20px;"
                                    @change="printInfo">
                                    <el-option v-for="testCase in debugRows" :key="testCase.id"
                                        :label="`${testCase.id} - ${testCase.ExpectedTestSequences}`"
                                        :value="testCase.id">
                                    </el-option>
                                </el-select>
                                <div v-if="selectedCase">
                                    <div class="table-title">测试用例 {{ selectedCase }}</div>
                                    <el-table :data="filteredExecutionLogs" class="logs-table execution-logs-table"
                                        max-height="440" style="width: 100%" ref="executionLogsTable">
                                        <el-table-column prop="log_id" label="序号" width="80"
                                            align="center"></el-table-column>
                                        <el-table-column prop="time" label="时间" min-width="160"
                                            sortable></el-table-column>
                                        <el-table-column prop="message" label="消息" min-width="260"></el-table-column>
                                    </el-table>
                                </div>
                                <div v-else>

                                    请选择一个测试用例以查看其执行日志。
                                </div>
                            </el-tab-pane>

                            <el-tab-pane label="用户日志" name="fourth">
                                <el-table :data="userLogs" :row-style="getRowStyle"
                                    class="logs-table execution-logs-table" max-height="440" style="width: 100%">
                                    <el-table-column prop="step_id" label="序号" width="80"
                                        align="center"></el-table-column>
                                    <el-table-column prop="msg" label="内容" min-width="160" sortable>
                                    </el-table-column> </el-table>
                            </el-tab-pane>
                        </el-tabs>


                    </div>
                    <div class="card" style="flex: 5;padding: 10px;">
                        <el-tabs v-model="activeDevice" type="card" @tab-click="handleClick">
                            <el-tab-pane label="车机设备" name="five">
                                <div class="video-container">
                                    <iframe ref="videoPlayer" width="100%" height="480" frameborder="0"
                                        allow="autoplay; fullscreen; picture-in-picture" allowfullscreen>
                                    </iframe>
                                    <div class="device-controls">
                                        <el-button type="primary" @click="connectDeviceStream('mobile')"
                                            style="margin-top: 10px;">
                                            连接视频流
                                        </el-button>
                                    </div>
                                </div>
                            </el-tab-pane>

                            <el-tab-pane label="仪表设备" name="six">
                                <div class="video-container">
                                    <iframe ref="instrumentVideoPlayer" width="100%" height="480" frameborder="0"
                                        allow="autoplay; fullscreen; picture-in-picture" allowfullscreen>
                                    </iframe>
                                    <div class="device-controls">
                                        <el-button type="primary" @click="connectDeviceStream('instrument')"
                                            style="margin-top: 10px;">
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

        <el-dialog v-model="caseConversionDialogVisible" title="序列化用例转化" width="50%">
            <el-form label-width="150px" @submit.prevent>
                <el-form-item label="提示词" >
                    <el-input v-model="prompt1" placeholder="请输入序列化用例转化的提示词"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="caseConversionDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="caseConversion">开始转换</el-button>
                </span>
            </template>
        </el-dialog>

        <el-dialog v-model="dialogVisible" title="序列化转换" width="50%">
            <el-form :model="newCase" label-width="120px">
                <el-form-item label="测试功能点">
                    <el-input v-model="newCase.TestKey" placeholder="请输入测试功能点"></el-input>
                </el-form-item>
                <el-form-item label="初始条件">
                    <el-input v-model="newCase.Initial_Condition" placeholder="请输入初始条件"></el-input>
                </el-form-item>
                <el-form-item label="动作">
                    <el-input v-model="newCase.Action" placeholder="请输入动作"></el-input>
                </el-form-item>
                <el-form-item label="预期结果">
                    <el-input v-model="newCase.Expected_Result" placeholder="请输入预期结果"></el-input>
                </el-form-item>
                <el-form-item label="初始条件序列">
                    <el-input v-model="newCase.InitTestSequences" placeholder="请输入初始条件序列"></el-input>
                </el-form-item>
                <el-form-item label="操作步骤序列">
                    <el-input v-model="newCase.ActionTestSequences" placeholder="请输入操作步骤序列"></el-input>
                </el-form-item>
                <el-form-item label="预期结果序列">
                    <el-input v-model="newCase.ExpectedTestSequences" placeholder="请输入预期结果序列"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="confirmAddTestCase">确定</el-button>
                </span>
            </template>
        </el-dialog>

        <el-dialog v-model="SynchronizeTestResultsDialogVisible" title="飞书文档同步设置" width="50%">
            <el-form label-width="150px" @submit.prevent>
                <el-form-item label="项目名称">
                    <el-input v-model="xmmc" placeholder="请输入项目名称"></el-input>
                </el-form-item>
            </el-form>
            <el-form label-width="150px">
                <el-form-item label="飞书文档链接url" @submit.prevent>
                    <el-input v-model="feishuDocUrl" placeholder="请输入飞书文档url"></el-input>
                </el-form-item>
            </el-form>
            <el-form-item label="是否自动同步至飞书">
                <el-switch v-model="autoSyncToFeishu" active-text="是" inactive-text="否"></el-switch>
            </el-form-item>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="SynchronizeTestResultsDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="saveSetting">保存设置</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 知识图谱弹窗组件 -->
        <el-dialog v-model="generateKnowledgeGraphDialogVisible" title="知识图谱" width="50%">
            <el-form label-width="150px">
                <el-form-item label="测试项目地址">
                    <el-input v-model="baseurl" placeholder="请输入测试项目地址"></el-input>
                </el-form-item>
                <el-form-item label="测试设备序列号">
                    <el-input v-model="serial" placeholder="请输入测试设备序列号" :default-value="''"></el-input>
                </el-form-item>
                <el-form-item label="测试应用包名">
                    <el-input v-model="packageName" placeholder="请输入测试应用包名"
                        :default-value="'com.desaysv.setting'"></el-input>
                </el-form-item>
                <el-form-item label="主导航栏id">
                    <el-input v-model="resourceid" placeholder="请输入主导航栏id"
                        :default-value="'com.desaysv.setting:id/layout_navigation'"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="generateKnowledgeGraphDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="sendGenerateKnowledgeGraphRequest">发送请求</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 知识图谱形成日志弹窗组件 -->
        <el-dialog v-model="generateKnowledgeGraphLogDiagVisible" title="知识图谱日志" width="50%">
            <el-tabs v-model="logActiveTab" type="card" label-width="150px">
                <el-tab-pane label="日志" name="logs">
                    <pre style="text-align: left;">{{ generateKnowledgeGraphLog.logs }}</pre>
                </el-tab-pane>
            </el-tabs>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="generateKnowledgeGraphLogDiagVisible = false">取消</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 查看测试日志的弹窗组件 -->
        <el-dialog v-model="logDialogVisible" title="测试日志详情" width="70%">
            <el-tabs v-model="logActiveTab" type="card">
                <el-tab-pane v-if="logDetails.logs" label="日志" name="logs">
                    <pre style="text-align: left;">{{ logDetails.logs }}</pre>
                </el-tab-pane>
                <el-tab-pane v-if="logDetails.code_files" label="Python代码" name="python">
                    <el-collapse v-model="activeCodeFile">
                        <el-collapse-item v-for="(codeFile, index) in logDetails.code_files" :key="index"
                            :title="codeFile.filename">
                            <pre>{{ codeFile.content }}</pre>
                        </el-collapse-item>
                    </el-collapse>
                </el-tab-pane>
                <el-tab-pane v-if="logDetails.ignition_logs" label="python执行日志" name="ignition_logs">
                    <pre style="text-align: left;">{{ logDetails.ignition_logs }}</pre>
                </el-tab-pane>
                <el-tab-pane v-if="logDetails.images" label="测试图片" name="images"> <!-- 新增图片展示栏 -->
                    <!-- <div v-for="(image, index) in logDetails.images" :key="index">
                        <p><strong>{{ image.filename }}</strong></p>
                        <img :src="'data:image/png;base64,' + image.base64_data" alt="Test Image"
                            style="width: 100%; margin-bottom: 10px;" />
                    </div> -->
                    <el-collapse v-model="activeCodeFile">
                        <el-collapse-item v-for="(image, index) in logDetails.images" :key="index"
                            :title="image.filename">
                            <img :src="'data:image/png;base64,' + image.base64_data" alt="Test Image"
                                style="width: 100%; margin-bottom: 10px;" />
                        </el-collapse-item>
                    </el-collapse>
                </el-tab-pane>
                <el-tab-pane v-if="logDetails.json_files" label="图片检出位置" name="json">
                    <el-collapse v-model="activeCodeFile">
                        <el-collapse-item v-for="(file, index) in logDetails.json_files" :key="index"
                            :title="file.filename">
                            <pre>{{ file.content }}</pre>
                        </el-collapse-item>
                    </el-collapse>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>

        <el-dialog v-model="selectRowsdialogVisible" title="选择测试用例" width="320px">
            <!-- 工作表选择 -->
            <div style="margin-bottom:12px">选择工作表</div>
            <el-select v-model="selectedSheet" placeholder="请选择工作表" style="width:100%; margin-bottom: 12px;"
                @change="handleSheetChange">
                <el-option v-for="sheet in casesTable" :key="sheet.sheetName"
                    :label="`${sheet.sheetName} (${sheet.length} 条)`" :value="sheet.sheetName" />
            </el-select>
            <!-- 起始 -->
            <div style="margin-bottom:12px">起始 ID</div>
            <el-select-v2 v-model="startId" :options="caseIdOptions" filterable clearable style="width:100%" />
            <!-- 结束 -->
            <div style="margin:12px 0">结束 ID</div>
            <el-select-v2 v-model="endId" :options="caseIdOptions" filterable clearable style="width:100%" />
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="selectRowsdialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="selectRowsHandle">确定</el-button>
                </span>
            </template>
        </el-dialog>

        <el-dialog v-model="ActualResultDialogVisible" title="真实结果" width="70%">
            <el-tabs v-model="ActualResultActiveTab" type="card"
                style="display: flex; justify-content: center; align-items: center; height: 100%;">
                <img :src="'data:image/png;base64,' + ActualResultDetails.images"
                    style="width: 800px; height: 800px; margin-bottom: 10px;" />
            </el-tabs>
        </el-dialog>
        <!-- 底部栏 -->
    </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick, getCurrentInstance, watch } from 'vue'
import { ElMessage } from 'element-plus'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver';
import { Buffer } from 'buffer';
import reportTpl from './report-template.html?raw'
import langOptionsJson from './langOptions.json'
import { saveCases, saveCasesTable, loadCases, loadCasesTable } from '../utils/db.js'
import { forEach } from 'lodash';

window.Buffer = Buffer;
export default {
    components: {
    },
    setup() {

        const selectedCase = ref('');
        const selectedSheet = ref('')
        const infoType = ref('all');
        const default_url = ref('http://172.23.96.54:8000');

        const url = ref(localStorage.getItem('TEST_URL') ?? default_url);
        const showTestKey = ref(true); // 控制“测试功能点”列的显示
        const showTestidColumn = false;
        const currentLang = ref('中文')
        const langOptions = ref(langOptionsJson)

        const handleInfoTypeChange = (value) => {
            showTestKey.value = value !== 'critical';
        };
        const { proxy } = getCurrentInstance();
        const instrumentStreamUrl = ref('http://172.23.96.54:8000/camera/video?name=UGREEN');
        const videoPlayer = ref(null);
        const instrumentVideoPlayer = ref(null);

        const activeName = ref('first')
        const activeDevice = ref('five')
        // 测试用例数据
        const cases = ref([])

        const casesTable = ref([])

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
            row: null
        })

        const onRowRightClick = (row, column, event) => {
            event.preventDefault()
            contextMenu.x = event.clientX
            contextMenu.y = event.clientY
            contextMenu.row = row
            contextMenu.visible = true
        }

        const convertRow = (row) => {
            contextMenu.visible = false
            if (!row) return
            runCaseConversion(row)          // 沿用已有转换逻辑
            showToast(`用例 ${row.id} 转换中...`, 'info')
        }

        const runSingleRow = async (row) => {
            contextMenu.visible = false
            if (!row) return

            selectedRowsAll.value = [row]
            await nextTick(() => {
                proxy.$refs.caseTable.clearSelection()
                proxy.$refs.caseTable.toggleRowSelection(row, true)
            })

            await startDebugging()
            showToast(`用例 ${row.id} 开始执行`, 'info')
        }

        watch(cases, async () => await saveCases(cases.value), { deep: true })
        watch(casesTable, async () => await saveCasesTable(casesTable.value), { deep: true })

        watch(currentLang, val => {
            showToast(`已切换到 ${val}`, 'info')
        })

        watch(url, newVal => {
            localStorage.setItem('TEST_URL', newVal);
        });

        const reslutCases = ref([])

        // 日志数据
        const logs = ref([])
        const logs_total = ref(0)

        // 测试执行日志数据
        const executionLogs = ref({})

        const filteredExecutionLogs = computed(() => {
            const filterlogs = executionLogs.value[selectedCase.value] || [];
            return filterlogs;
        })

        const executionLogsTable = ref(null)

        watch(filteredExecutionLogs, async () => {
            await nextTick();
            const tableRef = executionLogsTable.value;
            if (tableRef) {
                const bodyWrapper = tableRef.$el.querySelector('.el-scrollbar__wrap');
                if (bodyWrapper) {
                    bodyWrapper.scrollTo({
                        top: bodyWrapper.scrollHeight,
                        behavior: 'smooth'
                    });
                }
            }
        }, { deep: true });

        // 新增的弹窗相关数据
        const dialogVisible = ref(false)
        const newCase = reactive({
            TestKey: '',
            Initial_Condition: '',
            Action: '',
            Expected_Result: '',
            InitTestSequences: '',
            ActionTestSequences: '',
            ExpectedTestSequences: ''
        })

        // 同步数据到飞书文档的弹窗相关数据
        const feishuDocUrl = ref('')
        const xmmc = ref('')
        const SynchronizeTestResultsDialogVisible = ref(false)
        const autoSyncToFeishu = ref(false);
        feishuDocUrl.value = localStorage.getItem('feishuDocUrl', feishuDocUrl.value);
        xmmc.value = localStorage.getItem('xmmc', xmmc.value);
        autoSyncToFeishu.value = localStorage.getItem('autoSyncToFeishu', autoSyncToFeishu.value);
        const SynchronizeTestResults = () => {
            SynchronizeTestResultsDialogVisible.value = true
            xmmc.value = localStorage.getItem('xmmc') || ''
            feishuDocUrl.value = localStorage.getItem('feishuDocUrl') || ''
            autoSyncToFeishu.value = localStorage.getItem('autoSyncToFeishu') === 'true' || false
        }

        const saveSetting = async () => {
            localStorage.setItem('feishuDocUrl', feishuDocUrl.value);
            localStorage.setItem('xmmc', xmmc.value);
            localStorage.setItem('autoSyncToFeishu', autoSyncToFeishu.value.toString());

            showToast('设置已保存', 'success')
            // sendSynchronizeTestResultsRequest()
            SynchronizeTestResultsDialogVisible.value = false
        }


        const sendSynchronizeTestResultsRequest = async () => {
            if (!feishuDocUrl.value) {
                showToast('请先输入飞书文档url', 'warning');
                return;
            }
            if (!xmmc.value) {
                showToast('请先输入项目名称', 'warning');
                return;
            }
            if (!autoSyncToFeishu.value) return;

            const testedSelected = selectedRowsAll.value.filter(c => c.Result !== undefined && c.Result !== '');
            if (testedSelected.length === 0) {
                showToast('本次测试没有产生测试结果，无需同步', 'info');
                return;
            }

            const moduleMap = {};
            for (const sheet of casesTable.value) {
                if (sheet.sheetName === '全选') continue;
                const moduleCases = testedSelected.filter(c => {
                    const idx = cases.value.findIndex(tc => tc.id === c.id);
                    return idx >= sheet.start && idx <= sheet.end;
                });
                if (moduleCases.length === 0) continue;
                const total = moduleCases.length;
                const pass = moduleCases.filter(c => /pass/i.test(c.Result)).length;
                moduleMap[sheet.sheetName] = { total, pass, cases: moduleCases };
            }
            if (Object.keys(moduleMap).length === 0) {
                showToast('已选用例中无已完成数据，无需同步', 'info');
                return;
            }

            await exportTestReport();
            const fileName = 'file:///D:/uidp9463/Downloads/' + exportName.value;

            const { appToken, tableId } = parseFeishuUrl(feishuDocUrl.value);

            const records = Object.entries(moduleMap).map(([moduleName, stat]) => ({
                fields: {
                    项目名称: xmmc.value,
                    测试类型: 'AI全链路测试',
                    测试模块: moduleName,
                    开始测试时间: startTime.value,
                    结束测试时间: endTime.value,
                    测试案例总数: stat.total,
                    通过案例数: stat.pass,
                    未通过案例数: stat.total - stat.pass,
                    测试台架名称: url.value,
                    测试报告路径: fileName
                }
            }));

            try {
                const res = await fetch('/dev-api/api/addtable', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ app_token: appToken, table_id: tableId, records })
                }).then(r => r.json());

                if (res.code === 0) {
                    showToast(`成功写入 ${records.length} 条模块统计数据`, 'success');
                    SynchronizeTestResultsDialogVisible.value = false;
                } else {
                    showToast('写入失败：' + (res.msg || res.error?.message), 'error');
                }
            } catch (e) {
                showToast('网络错误', 'error');
            }
        };

        const parseFeishuUrl = () => {
            if (!feishuDocUrl.value) showToast('文档URL不能为空', 'warning');

            const u = feishuDocUrl.value.replace(/\/$/, '');

            const baseMatch = u.match(/\/base\/([a-zA-Z0-9]+)\?.*table=([a-zA-Z0-9]+)/);
            if (baseMatch) {
                return { appToken: baseMatch[1], tableId: baseMatch[2] };
            }

            const pathMatch = u.match(/\/([a-zA-Z0-9]+)\/table\/([a-zA-Z0-9]+)/);
            if (pathMatch) {
                return { appToken: pathMatch[1], tableId: pathMatch[2] };
            }
            showToast('无法解析飞书文档URL，请检查格式', 'error');
        }

        // 查看日志的弹窗相关数据
        const logDialogVisible = ref(false)
        const ActualResultDialogVisible = ref(false)
        const logActiveTab = ref('logs')
        const ActualResultActiveTab = ref('logs')
        const activeCodeFile = ref([])
        const logDetails = reactive({
            logs: '',
            ignition_logs: '',
            code_files: [],
            images: []
        })
        const ActualResultDetails = reactive({
            images: ""
        })

        // 搜索功能
        const searchQuery = ref('')
        const filteredCases = computed(() => {
            return cases.value
        })

        const filteredLogCases = computed(() => {
            return logs.value
        })


        // 组件卸载时清理
        onUnmounted(() => {
            stopStream()
        })
        // 分页设置
        const currentPage = ref(1)
        const changePage = ref(false)
        const pageSize = ref(20)

        const currentPage1 = ref(1)
        const pageSize1 = ref(10)

        const currentPage2 = ref(1)
        const pageSize2 = ref(8)

        // 计算当前页显示的数据
        const paginatedCases = computed(() => {
            const start = (currentPage.value - 1) * pageSize.value
            const end = start + pageSize.value
            return filteredCases.value.slice(start, end)
        })

        const logCases = computed(() => {
            return filteredLogCases.value
        })



        // 日志设置
        const logSettings = reactive({
            addTips: true,
            threeColumns: false,
            timestamp: true
        })

        const logLevel = ref('全部')
        const activeStep = ref(1)

        // 显示消息提示
        const showToast = (message, type = 'success') => {
            ElMessage({
                type: type,
                message: `${message}`,
                offset: 60
            })
        }
        const connectDeviceStream = (deviceType) => {
            if (deviceType === 'mobile') {
                if (!url.value) {
                    showToast('请先输入URL地址', 'warning');
                    return;
                }
                const mobileUrl = `${url.value}/adb/video`;
                //console.log(mobileUrl)
                if (videoPlayer.value) {
                    videoPlayer.value.src = mobileUrl;
                }
                showToast('手机视频流已连接', 'success');
            } else if (deviceType === 'instrument') {
                if (!url.value) {
                    showToast('请先输入URL地址', 'warning');
                    return;
                }
                const instrumentUrl = `${url.value}/camera/video?name=UGREEN`;
                //console.log(instrumentUrl);
                instrumentStreamUrl.value = instrumentUrl;
                if (instrumentVideoPlayer.value) {
                    instrumentVideoPlayer.value.src = instrumentUrl;
                }
                showToast('仪表视频流已连接', 'success');
            }
        };
        // 自动保存用例
        const autoSave = (row) => {
            showToast(`用例 ${row.id} 已自动保存`, 'info')
        }

        // 处理用例状态标签类型
        const statusType = (status) => {
            switch (status) {
                case '通过': return 'success'
                case '待测试': return 'warning'
                case '未通过': return 'danger'
                default: return 'info'
            }
        }

        // 用于添加测试用例的方法现在需要打开弹窗
        const addTestCase = () => {
            dialogVisible.value = true
        }

        // 新增的确认添加测试用例的方法
        const confirmAddTestCase = () => {
            const newId = `${String(cases.value.length + 1).padStart(3, '0')}`
            cases.value.push({
                id: newId,
                TestKey: newCase.TestKey,
                Initial_Condition: newCase.Initial_Condition,
                Action: newCase.Action,
                Expected_Result: newCase.Expected_Result,
                InitTestSequences: newCase.InitTestSequences,
                ActionTestSequences: newCase.ActionTestSequences,
                ExpectedTestSequences: newCase.ExpectedTestSequences,
            })
            showToast('测试用例已添加', 'success')
            dialogVisible.value = false
            // 清空输入框
            Object.assign(newCase, {
                TestKey: '',
                Initial_Condition: '',
                Action: '',
                Expected_Result: '',
                InitTestSequences: '',
                ActionTestSequences: '',
                ExpectedTestSequences: ''
            })
        }

        // 删除测试用例
        const deleteTestCase = () => {

            if (selectedRowsAll.value.length === 0) {
                showToast('请先选择要删除的测试用例', 'warning')
                return
            }

            selectedRowsAll.value.forEach((row) => {
                const index = cases.value.findIndex(c => c.id === row.id)
                console.log(index);

                if (index !== -1) {
                    cases.value.splice(index, 1)
                }
                cases.value.forEach((row) => {
                    if (row.id > index) {
                        row.id = String(Number(row.id) - 1).padStart(3, '0')
                    }
                })
                for (let i = casesTable.value.length - 1; i >= 0; i--) {
                    const sheet = casesTable.value[i]
                    if (sheet.name === '全选') {
                        sheet.end -= 1
                        sheet.length -= 1
                    }
                    if (sheet.start <= index && sheet.end >= index) {
                        sheet.end -= 1
                        sheet.length -= 1
                    } else if (sheet.start > index) {
                        sheet.start -= 1
                        sheet.end -= 1
                    }
                    // 长度为0时删除
                    if (sheet.length === 0) {
                        casesTable.value.splice(i, 1)
                    }
                }
            })

            selectedRowsAll.value = []

            showToast('测试用例已删除', 'success')
        }



        // 运行测试用例
        const runCaseConversion = (row) => {
            startCaseConversion(row);
        }

        // 清除日志
        const clearLogs = () => {
            logs.value = []
            showToast('日志已清除', 'info')
        }

        // 选中的行
        const selectedRowsAll = ref([]);
        const debugRows = ref([]);
        const printInfo = () => {
            console.log(selectedCase.value)
        }

        const selectRowsdialogVisible = ref(false)
        const startId = ref('')
        const endId = ref('')

        const selectRows = () => {
            selectRowsdialogVisible.value = true
        }

        const handleSheetChange = (sheetName) => {
            if (sheetName === '全选') {
                startId.value = cases.value[0]?.id || '';
                endId.value = cases.value[cases.value.length - 1]?.id || '';
                return;
            }
            const sheet = casesTable.value.find(s => s.sheetName === sheetName)
            if (sheet) {
                startId.value = cases.value[sheet.start].id
                endId.value = cases.value[sheet.end].id
            }
        }

        const clearAllSelection = () => {
            selectedRowsAll.value = []
            proxy.$refs.caseTable.clearSelection()
            showToast('已取消所有选中用例', 'info')
        }

        const caseIdOptions = computed(() =>
            cases.value.map(item => ({ value: item.id, label: item.id }))
        );

        const selectRowsHandle = () => {
            const newSelectedRowsAll1 = [];
            console.log(cases.value);

            const start = cases.value.findIndex(caseItem => caseItem.id === startId.value);
            const end = cases.value.findIndex(caseItem => caseItem.id === endId.value);
            console.log(start, end)
            if (start === -1 || end === -1) {
                showToast('请选择有效的测试用例', 'warning');
                return;
            }
            if (start > end) {
                showToast('起始测试用例不能大于终止测试用例', 'warning');
                return;
            }


            for (let i = start; i <= end; i++) {
                newSelectedRowsAll1.push(cases.value[i]);
            }

            changePage.value = true
            paginatedCases.value.forEach(row => {
                selectedRowsAll.value = []
                const isSelected = selectedRowsAll.value.some(r => r.id === row.id);
                proxy.$refs.caseTable.toggleRowSelection(row, isSelected);
            });
            changePage.value = false
            console.log(selectedRowsAll.value)
            newSelectedRowsAll1.forEach(row => {
                selectedRowsAll.value.push(row);
            })
            selectRowsdialogVisible.value = false;
            const targetPage = Math.floor(start / pageSize.value) + 1;
            handlePageChange(targetPage);
        }

        // 处理选中改变事件
        const handleSelectionChange = (selection) => {

            selection.forEach((row) => {
                if (!selectedRowsAll.value.some(r => r.id === row.id)) {
                    selectedRowsAll.value.push(row);
                }
            });
            if (isDebugRunning.value) {
                paginatedCases.value.forEach(row => {
                    const isSelected = selectedRowsAll.value.some(r => r.id === row.id);
                    proxy.$refs.caseTable.toggleRowSelection(row, isSelected);
                });
                return;
            }

            // 移除不再选中的行
            if (selection.length == 0) {
                if (changePage.value) {
                    changePage.value = false
                } else {
                    let newSelectedRowsAll = [];
                    selectedRowsAll.value.forEach((row) => {
                        if (!paginatedCases.value.some(r => r.id === row.id)) {
                            newSelectedRowsAll.push(row);
                        }
                    });
                    selectedRowsAll.value = newSelectedRowsAll;
                }
            } else {
                if (!changePage.value) {
                    let newSelectedRowsAll = [];
                    selectedRowsAll.value.forEach((row) => {
                        if (paginatedCases.value.some(r => r.id === row.id) && selection.some(r => r.id === row.id)) {
                            newSelectedRowsAll.push(row);
                        } else if (!paginatedCases.value.some(r => r.id === row.id)) {
                            newSelectedRowsAll.push(row);
                        }
                    });
                    selectedRowsAll.value = newSelectedRowsAll;
                }
            }
        };

        // 分页变化处理
        const handlePageChange = (newPage) => {
            currentPage.value = newPage
            changePage.value = true
            showToast(`切换到第 ${newPage} 页`, 'info')
            nextTick(() => {
                paginatedCases.value.forEach(row => {
                    changePage.value = true
                    const isSelected = selectedRowsAll.value.some(r => r.id === row.id);
                    //console.log(isSelected)
                    proxy.$refs.caseTable.toggleRowSelection(row, isSelected);
                });
                changePage.value = false
            });
        }

        const handlePageChange1 = (newPage) => {
            fetchTestList(newPage)
            showToast(`切换到第 ${newPage} 页`, 'info')
        }

        const handlePageChange2 = (newPage) => {
            currentPage2.value = newPage
            showToast(`切换到第 ${newPage} 页`, 'info')
        }
        // 导入xlsm文件
        const fileInput = ref(null)
        const dbcFileInput = ref(null)
        const importXlsmFile = () => {
            fileInput.value.click()
        }

        const fetchActualResultForExcel = async (test_id, command) => {
            try {
                const response = await fetch('/dev-api/api/crop_by_semantics', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ test_id, command })
                });
                const data = await response.json();
                return data.status === 'ok' ? data.base64 : '';
            } catch (error) {
                console.error(`Testid ${test_id} 截图失败`, error);
                return '';
            }
        };


        const exportName = ref('')
        const exportTestReport = async () => {
            showToast('正在生成测试报告，请稍后...', 'info');

            // 直接过滤出已有结果的用例，不再获取实际结果图片
            reslutCases.value = cases.value.filter(c => c.Result !== undefined && c.Result !== '');
            const list = reslutCases.value;
            const total = list.length;
            const pass = list.filter(c => /pass/i.test(c.Result)).length;
            const fail = total - pass;

            const clip = (val) => `<td class="td-clip" title="${(val ?? '')
                .replace(/"/g, '&quot;')}">${val ?? ''}</td>`;

            const rowsHtml = list.map(c => `
        <tr>
            <td>${c.id}</td>
            <td>${c.TestCaseID ?? ''}</td>
            <td>${c.SyRDIDFSRD ?? ''}</td>
            <td>${c.Auto_testID ?? ''}</td>
            <td>${c.TSR ?? ''}</td>
            <td>${c.CasePriority ?? ''}</td>
            <td>${c.TestMethod ?? ''}</td>
            <td>${c.TestStrategy ?? ''}</td>
            <td>${c.DesignMethod ?? ''}</td>
            <td>${c.TestKey ?? ''}</td>
            ${clip(c.Initial_Condition)}
            ${clip(c.Action)}
            ${clip(c.Expected_Result)}
            ${clip(c.InitTestSequences)}
            ${clip(c.ActionTestSequences)}
            <td>${c.ExpectedTestSequences}</td>
            <td style="background:${/pass/i.test(c.Result) ? '#d4f8d4' : '#ffe1e1'};font-weight:600;">
                ${c.Result ?? ''}
            </td>
            <!-- 直接显示“暂无图片” -->
            <td><span class="empty-img">暂无图片</span></td>
            <td>${c.Selected ?? ''}</td>
            <td>${c.PRNo ?? ''}</td>
            <td>${c.TestLogs ?? ''}</td>
            <td>${c.Numberoftests ?? ''}</td>
            <td>${c.TestDate ?? ''}</td>
            <td>${c.Remark ?? ''}</td>
        </tr>`).join('');

            const html = reportTpl
                .replaceAll('{{TITLE}}', '自动化测试报告')
                .replaceAll('{{TOTAL}}', total)
                .replaceAll('{{PASS}}', pass)
                .replaceAll('{{FAIL}}', fail)
                .replace('{{ROWS}}', rowsHtml);

            const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
            const timeStamp = new Date().toLocaleString('zh-CN', { hour12: false })
                .replace(/[/: ]/g, '')
            exportName.value = `TestReport_${timeStamp}.html`
            saveAs(blob, `${exportName.value}`)
        };

        // 知识图谱相关数据
        const generateKnowledgeGraphDialogVisible = ref(false)
        const generateKnowledgeGraphLogDiagVisible = ref(false)
        //const generateKnowledgeGraphLog = ref('sadfasdf')
        const generateKnowledgeGraphLog = reactive({
            logs: ''
        })
        const baseurl = 'http://172.23.96.54:8000/'
        const serial = ''
        const packageName = 'com.desaysv.setting'
        const resourceid = 'com.desaysv.setting:id/layout_navigation'



        const IsSendingKnowledgeGraphRequest = ref(false)

        const generateKnowledgeGraph = async () => {
            if (!IsSendingKnowledgeGraphRequest.value) {
                generateKnowledgeGraphDialogVisible.value = true
            } else {
                generateKnowledgeGraphLogDiagVisible.value = true
                fetchgenerateKnowledgeGraphLog()
            }
        }

        const fetchgenerateKnowledgeGraphLog = async () => {
            const interval = 5 * 1000; // 5 秒

            const poll = async () => {
                try {
                    const response = await fetch(`/dev-api/adb/autotest`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            package: packageName,
                            baseurl: baseurl,
                            serial: serial,
                            resource_id: resourceid
                        })
                    });

                    if (response.ok) {
                        const clonedResponse = response.clone();
                        let data = '';
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
                        showToast('接口调用失败', 'error');
                    }
                } catch (error) {
                    clearInterval(pollInterval);
                    IsSendingKnowledgeGraphRequest.value = false;
                    console.error('接口调用失败:', error);
                    showToast('接口调用失败', 'error');
                }
            };

            await poll();

            const pollInterval = setInterval(poll, interval); // 每隔 5 秒执行一次 poll 函数

            // 监听弹窗的可见性，如果弹窗关闭则停止轮询
            const stopPollingWhenDialogClosed = watch(generateKnowledgeGraphLogDiagVisible, (newVal) => {
                if (!newVal) {
                    clearInterval(pollInterval);
                }
            });
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
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            package: packageName,
                            baseurl: baseurl,
                            serial: serial,
                            resource_id: resourceid
                        })
                    });

                    if (response.ok) {
                        const clonedResponse = response.clone();
                        let data = '';
                        try {
                            data = await response.json();
                        } catch (jsonError) {
                            //  console.error('JSON 解析失败:', jsonError);
                            data = await clonedResponse.text();
                        }

                        //console.log(data);
                        if (typeof data === 'string' && data.includes('[Done]')) {
                            clearInterval(pollInterval1);
                            IsSendingKnowledgeGraphRequest.value = false;
                            showToast('知识图谱生成成功', 'success');
                        } else if (typeof data === 'string' && data.includes('[Error]')) {
                            clearInterval(pollInterval1);
                            IsSendingKnowledgeGraphRequest.value = false;
                            showToast('知识图谱生成失败,请检测日志', 'error');
                        } else {
                            showToast('知识图谱生成中,请稍后...', 'info');
                        }
                    } else {
                        clearInterval(pollInterval1);
                        IsSendingKnowledgeGraphRequest.value = false;
                        showToast('接口调用失败', 'error');
                    }
                } catch (error) {
                    clearInterval(pollInterval1);
                    IsSendingKnowledgeGraphRequest.value = false;
                    console.error('接口调用失败:', error);
                    showToast('接口调用失败', 'error');
                }
            };

            const pollInterval1 = setInterval(poll, interval);

            await poll();

            // 确保在最大轮询时间后停止轮询
            setTimeout(() => {
                clearInterval(pollInterval1);
                if (IsSendingKnowledgeGraphRequest.value) {
                    IsSendingKnowledgeGraphRequest.value = false;
                    showToast('知识图谱生成超时', 'warning');
                }
            }, maxPollingTime);
        };



        const selectDbcFile = () => {
            dbcFileInput.value.click()
            showToast('请选择DBC文件', 'info')
        }

        const handleFileUpload = (event) => {
            cases.value = []
            casesTable.value = []
            const file = event.target.files[0]
            if (file && file.type === 'application/vnd.ms-excel.sheet.macroEnabled.12') {
                showToast(`正在导入文件: ${file.name}`, 'info')
                const reader = new FileReader()
                reader.onload = (e) => {
                    const data = new Uint8Array(e.target.result)
                    const workbook = XLSX.read(data, { type: 'array' })
                    const firstSheetName = workbook.SheetNames[0]
                    const worksheet = workbook.Sheets[firstSheetName]
                    const json = XLSX.utils.sheet_to_json(worksheet)
                    console.log(json);

                    json.forEach((row) => {
                        console.log(row);

                        const newId = `${String(cases.value.length + 1).padStart(3, '0')}`
                        cases.value.push({
                            id: newId,
                            TestCaseID: row['Test Case ID'],
                            SyRDIDFSRD: row['SyRD ID/FSR'],
                            TSR: row['TSR'],
                            CasePriority: row['Case\nPriority'],
                            DesignMethod: row["Design Method "],
                            TestMethod: row["Test Method"],
                            TestStrategy: row["Test\nStrategy "],
                            TestKey: row['Test Key\n功能点'],
                            Initial_Condition: row['初始条件序列'],
                            Action: row['操作步骤序列'],
                            Expected_Result: row['Expected Result\n期望结果'],
                            InitTestSequences: row['Init Test Sequences\n测试序列前置条件'],
                            ActionTestSequences: row['Action Test Sequences\n动作测试序列'],
                            ExpectedTestSequences: row['Expected Test Sequences\n预期测试序列结果'],
                            Selected: row['Selected'],
                            Result: row['Test  Result'],
                            ActualResult: row['Actual Result'],
                            PRNo: row['PR No.'],
                            TestLogs: row['Test Log'],
                            Numberoftests: row['Number of tests'],
                            TestDate: row['Test Date'],
                            Remark: row['Remark'],
                        })
                    })
                    showToast(`文件导入完成: ${file.name}`, 'success')
                }
                reader.readAsArrayBuffer(file)
            } else if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                showToast(`正在导入文件: ${file.name},请等待！`, 'info')
                const reader = new FileReader()
                reader.onload = (e) => {
                    const data = new Uint8Array(e.target.result)
                    const workbook = XLSX.read(data, { type: 'array' })

                    // 获取工作表数量
                    const sheetCount = workbook.SheetNames.length

                    let start = 0;

                    // 遍历所有工作表
                    for (let i = 1; i < sheetCount - 1; i++) {
                        const sheetName = workbook.SheetNames[i]
                        const worksheet = workbook.Sheets[sheetName]
                        const json = XLSX.utils.sheet_to_json(worksheet, { range: 6 })
                        const length = json.length
                        casesTable.value.push({
                            sheetName: sheetName,
                            start: start,
                            end: start + length - 1,
                            length: length
                        })
                        start = start + length;
                        json.forEach((row) => {
                            const newId = `${String(cases.value.length + 1).padStart(3, '0')}`
                            cases.value.push({
                                id: newId,
                                TestCaseID: row['Test Case ID'],
                                SyRDIDFSRD: row['SyRD ID/FSR'],
                                Auto_testID: row['Auto_test ID'],
                                TSR: row['TSR'],
                                CasePriority: row['Case\r\nPriority'],
                                DesignMethod: row["Design Method "],
                                TestMethod: row["Test Method"],
                                TestStrategy: row["Test\r\nStrategy "],
                                TestKey: row['Test Key\r\n功能点'],
                                Initial_Condition: row['Pre-condition\r\n前提条件'],
                                Action: row['Action\r\n操作步骤'],
                                Expected_Result: row['Expected Result\r\n期望结果'],
                                InitTestSequences: row['Init Test Sequences\r\n测试序列前置条件'],
                                ActionTestSequences: row['Action Test Sequences\r\n动作测试序列'],
                                ExpectedTestSequences: row['Expected Test Sequences\r\n预期测试序列结果'],
                                Selected: row['Selected'],
                                Result: row['Test Result'],
                                ActualResult: row['Actual Result'],
                                PRNo: row['PR No.'],
                                TestLogs: row['Test Logs'],
                                TestDate: row['Test Date'],
                                Remark: row['Remark'],
                            })
                        })
                    }
                    casesTable.value.unshift({
                        sheetName: '全选',
                        start: 0,
                        end: cases.value.length - 1,
                        length: cases.value.length
                    })
                    showToast(`文件导入完成: ${file.name}`, 'success')
                }
                reader.readAsArrayBuffer(file)
            } else {
                showToast('请选择有效的 xlsm 文件', 'error')
            }
        }

        const startTime = ref()
        const endTime = ref()

        // 开始测试
        const startDebugging = async () => {
            if (selectedRowsAll.value.length === 0) {
                showToast('请先选择要调试的测试用例', 'warning');
                return;
            }
            activeName.value = 'third';
            isDebugRunning.value = true;
            debugRows.value = [];
            startTime.value = parseInt(Date.now());

            let index = 0;
            while (index < selectedRowsAll.value.length && isDebugRunning.value) {
                const row = selectedRowsAll.value[index];
                try {
                    if (!debugRows.value.some(dr => dr.id === row.id)) {
                        debugRows.value.push(row);
                    }
                    selectedCase.value = row.id;
                    const query = `前提条件: ${row.InitTestSequences} 操作步骤: ${row.ActionTestSequences} 预期结果:${row.ExpectedTestSequences}`;
                    const baseurl = url.value;

                    await runTestCase(query, baseurl, row.id, row);
                } catch (error) {
                    showToast(`测试用例${row.id}调试失败`, 'error');
                }

                index++;
            }

            isDebugRunning.value = false;
            endTime.value = parseInt(Date.now());
            showToast('调试已完成', 'info');
            if (autoSyncToFeishu.value) {
                await sendSynchronizeTestResultsRequest();
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
        }

        const prompt1 = ref("")
        const caseConversionDialogVisible = ref(false)

        const promptCaseConversion = () => {
            caseConversionDialogVisible.value = true
        }

        const caseConversion = () => {
            caseConversionDialogVisible.value = false
            if (selectedRowsAll.value.length === 0) {
                showToast('请先选择要转换的测试用例', 'warning')
                return
            }

            showToast(`开始转换用例`, 'info')
            selectedRowsAll.value.forEach((row) => {
                runCaseConversion(row);
            })
        }

        const isDebugRunning = ref(false)

        const stopDebugging = async () => {
            isDebugRunning.value = false;
            debugRows.value = [];
            selectedCase.value = '';
            stopPolling();
            executionLogs.value = {};
        }

        const pollingIntervals = {};
        const userLogs = ref([]);
        const getRowStyle = ({ row }) => row.rowStyle || {}
        const changeColor = (caseId, finalColor, succ, fail, index) => {
            const logs = userLogs.value.filter(u => u.caseId === caseId);
            if (index < logs.length) {
                logs[index].type = succ >= fail ? 'success' : 'error';
                logs[index].rowStyle = {
                    backgroundColor: finalColor,
                    fontWeight: 'bold',
                    color: 'black'
                };
                index++;
                const randomInterval = Math.random() * (0.8 - 0.3) + 0.3; // 随机间隔 0.3-0.8 秒
                setTimeout(() => {
                    changeColor(caseId, finalColor, succ, fail, index);
                }, randomInterval * 1000);
            }
        };

        const startPollingForDebugResults = (query, baseurl, id, resolve, reject, row) => {
            showToast('发送调试请求成功，日志将在下方测试执行日志展示！', 'success');
            userLogs.value = [];
            const steps = row.InitTestSequences.split('\n').filter(Boolean)
                .concat(row.ActionTestSequences.split('\n').filter(Boolean))
            const logList = steps.map((text, idx) => ({
                step_id: idx + 1,
                msg: `用例${row.id} 步骤${idx + 1}: ${text}`,
                type: 'waiting',
                caseId: row.id,
                rowStyle: { backgroundColor: '#ffffff' }
            }))
            userLogs.value = logList

            executionLogs.value[id] = [];
            executionLogs.value[id].push({
                log_id: 1,
                time: new Date().toLocaleString('zh-CN', {
                    hour12: false,
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                }).replace(/\//g, '-'),
                message: `开始调试，请等待！`,
            });

            let testIdFound = false;
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/dev-api/chat', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Accept', 'text/event-stream');
            let lastProcessedLength = 0;

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 3 && isDebugRunning.value) {
                    const newResponseText = xhr.responseText.slice(lastProcessedLength);

                    const lines = newResponseText.split('\n');
                    var thinkFlag = false;

                    lines.forEach(line => {
                        if (line.trim() === '') return;
                        if (line === '') return;
                        const succ = (line.match(/执行成功/g) || []).length
                        const fail = (line.match(/执行失败/g) || []).length
                        if (succ + fail > 0) {
                            const finalColor = succ >= fail ? 'rgb(31 181 51)' : '#eb1919';
                            changeColor(row.id, finalColor, succ, fail, 0)
                        }
                        const match = line.match(/data: \[.*?\]\{"test_id": "(.*?)"\}/);
                        if (!testIdFound) {
                            if (match) {
                                const test_id = match[1];
                                testIdFound = true;
                                const pollForResult = async () => {
                                    const maxPollingTime = 600000; // 300s
                                    const interval = 5000; // 5s
                                    let elapsedTime = 0;

                                    const intervalId = setInterval(async () => {
                                        const index = cases.value.findIndex(c => c.id === id);
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
                                                cases.value[index].Result = '获取测试结果失败';
                                                cases.value[index].Testid = test_id;
                                            }
                                            console.error("Error fetching result:", error);
                                            reject(error); // 失败请求，调用 reject
                                        }

                                        elapsedTime += interval;
                                        if (elapsedTime >= maxPollingTime) {
                                            if (index !== -1) {
                                                cases.value[index].Result = '超时未获取测试结果';
                                                cases.value[index].Testid = test_id;
                                            }
                                            fetchTestList(1); // 刷新测试用例列表    
                                            clearInterval(intervalId); // 停止轮询
                                            reject(new Error('超时未获取测试结果'));
                                        }
                                    }, interval);

                                    pollingIntervals[test_id] = intervalId;
                                };

                                pollForResult(); // 启动轮询
                                return;
                            }
                        }

                        if (testIdFound && match) return;
                        if (line.includes('<think>')) {
                            thinkFlag = true;
                            return;
                        }
                        if (line.includes('</think>')) {
                            thinkFlag = false;
                            return;
                        }
                        if (thinkFlag) return;
                        try {
                            executionLogs.value[id].push({
                                log_id: executionLogs.value[id].length + 1,
                                time: new Date().toLocaleString('zh-CN', {
                                    hour12: false,
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                }).replace(/\//g, '-'),
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
                showToast(`测试用例${id}已停止1`, 'info');
                resolve(null);
            };

            xhr.onerror = (error) => {
                console.error("Error in stream:", error);
                showToast(`测试用例${id}已停止2`, 'error');
                reject(error);
            };

            var value = langOptions.value.find(item => item.label === currentLang.value).value
            xhr.send(JSON.stringify({ query: query, baseurl: baseurl, lang: value }));
        }


        const startCaseConversion = async (row) => {
            // 第一次调用
            callApi(row.id, row.Initial_Condition, 'A', false, 'A');
            // 第二次调用
            callApi(row.id, row.Action, 'A', false, 'B');

            const index = cases.value.findIndex(c => c.id === row.id);
            cases.value[index].ExpectedTestSequences = row.Expected_Result;
            // // 第三次调用
            // callApi(row.id, row.Expected_Result, 'C', false);
        }

        const callApi = (id, input, task, stream, step) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/dev-api/v1/chat/completions', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Accept', 'text/event-stream');

            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) return;

                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        const content = response.choices?.[0]?.message?.content;
                        if (typeof content !== 'string') throw new Error('返回格式异常');

                        const index = cases.value.findIndex(c => c.id === id);
                        if (index === -1) return;

                        if (step === 'A') {
                            cases.value[index].InitTestSequences = content;
                        } else if (step === 'B') {
                            cases.value[index].ActionTestSequences = content;
                            showToast(`用例 ${id} 转换成功`, 'success');
                        }
                    } catch (e) {
                        console.error(e);
                        showToast(`用例 ${id} 解析失败：${e.message}`, 'error');
                    }
                } else {
                    showToast(`用例 ${id} 请求失败：HTTP ${xhr.status}`, 'error');
                }
            };
            xhr.onerror = function () {
                showToast(`用例 ${id} 网络错误，请检查服务是否可用`, 'error');
            };
            const dbc = dbcFileName.value.name;
            const prompt = prompt1.value;
            xhr.send(JSON.stringify({ input, task, stream, dbc, prompt }));
        }

        // 停止所有轮询
        const stopPolling = () => {
            Object.keys(pollingIntervals).forEach(test_id => {
                clearInterval(pollingIntervals[test_id]);
                delete pollingIntervals[test_id]; // 清除引用
            });
        };

        // 获取测试用例列表
        const fetchTestList = (page) => {
            fetch(`/dev-api/test_list?page=${page}&page_size=10`)
                .then(response => response.json())
                .then(data => {
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
                        showToast('测试用例列表加载成功', 'success');
                    } else {
                        showToast('测试用例列表加载失败', 'error');
                    }
                })
                .catch(error => {
                    console.error('Error fetching test list:', error);
                    showToast('测试用例列表加载失败', 'error');
                });
        }


        // 获取测试日志
        const fetchTestLogs = (test_id) => {
            fetch(`/dev-api/test_logs/${test_id}`)
                .then(response => response.json())
                .then(data => {
                    if (data.code === "200") {
                        // 直接赋值接口返回的日志内容
                        logDetails.logs = data.result.logs.chat_log;
                        logDetails.code_files = data.result.logs.code_files;
                        logDetails.images = data.result.logs.images;
                        logDetails.ignition_logs = data.result.logs.ignition_log;
                        logDetails.json_files = data.result.logs.json_files;
                        //console.log(logDetails.code_files);
                        logDialogVisible.value = true;
                        showToast(`测试日志加载成功`, 'success');
                    } else {
                        showToast('测试日志加载失败', 'error');
                    }
                })
                .catch(error => {
                    console.error('Error fetching test logs:', error);
                    showToast('测试日志加载失败', 'error');
                });
        }

        const dbcFileName = ref('')

        const fetchActualResult = (test_id, command) => {
            //test_id = "test_20250802_134624"
            fetch(`/dev-api/api/crop_by_semantics`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ test_id, command })
            })
                .then(response => response.json())
                .then(data => {
                    //console.log(data);
                    if (data.status === "ok") {
                        ActualResultDetails.images = data.base64;
                        //console.log(ActualResultDetails.images);
                        ActualResultDialogVisible.value = true;
                        showToast(`实际结果加载成功`, 'success');
                    } else {
                        showToast('暂无实际结果图片', 'error');
                    }
                })
                .catch(error => {
                    console.error('Error fetching test result:', error);
                    showToast('实际结果加载失败', 'error');
                });
        }

        const handleDbcFileUpload = (event) => {
            const file = event.target.files[0];
            if (file) {
                dbcFileName.value = file;
                console.log(dbcFileName.value)
            }
            showToast('DBC文件选择成功', 'success')
        }


        // 模拟组件加载
        onMounted(async () => {
            cases.value = await loadCases().then(list =>
                list.length ? list : [
                    {
                        id: '001',
                        TestCaseID: '',
                        SyRDIDFSRD: '',
                        Auto_testID: '',
                        TSR: '',
                        CasePriority: '',
                        TestMethod: '',
                        TestStrategy: '',
                        DesignMethod: '',
                        TestKey: '',
                        Initial_Condition: '',
                        Action: '',
                        Expected_Result: '',
                        InitTestSequences: "1.Switch-2-ON-KL30\n2.Switch-1-ON-KL15\n3.Switch-3-ON-ACC\n4.Pwr-1-SupplyPower-13.5\n5.CAN-Msg-ONEBOX_1_G-1\n6.CAN-1-Sig-ONEBOX_1_G-VehicleSpeedVSOSig-0\n7.CAN-1-Sig-ONEBOX_1_G-VehicleSpeedVSOSigValidData-0\n8.CAN-Sig-FLZCU_9-FLZCU_9_PowerMode-2",
                        ActionTestSequences: '1.CAN-1-Sig-ONEBOX_1_G-VehicleSpeedVSOSig-0x140',
                        ExpectedTestSequences: '1.Vision-Pattern-车速21',
                        ActualResult: '',
                        Selected: '',
                        PRNo: '',
                        TestLogs: '',
                        Numberoftests: '',
                        TestDate: '',
                        Remark: '',
                        Result: undefined,
                    },
                    {
                        id: '002',
                        TestCaseID: '',
                        SyRDIDFSRD: '',
                        Auto_testID: '',
                        TSR: '',
                        CasePriority: '',
                        TestMethod: '',
                        TestStrategy: '',
                        DesignMethod: '',
                        TestKey: '',
                        Initial_Condition: '',
                        Action: '',
                        Expected_Result: '',
                        InitTestSequences: '安卓测试 进入设置',
                        ActionTestSequences: '进入车辆设置',
                        ExpectedTestSequences: '页面正常显示',
                        ActualResult: '',
                        Selected: '',
                        PRNo: '',
                        TestLogs: '',
                        Numberoftests: '',
                        TestDate: '',
                        Remark: '',
                        Result: undefined,
                    }
                ])
            casesTable.value = await loadCasesTable()
            setTimeout(() => {
                fetchTestList(1);
            }, 500)
        })

        // 组件卸载时停止轮询
        onUnmounted(() => {
            stopPolling();
        })

        return {
            currentLang,
            langOptions,
            contextMenu,
            onRowRightClick,
            convertRow,
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
            instrumentStreamUrl,
            instrumentVideoPlayer,
            connectDeviceStream,
            dbcFileName,
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
            feishuDocUrl,
            xmmc,
            autoSyncToFeishu,
            saveSetting,
            SynchronizeTestResults,
            SynchronizeTestResultsDialogVisible,
            sendSynchronizeTestResultsRequest,
            startTime,
            endTime,
            getRowStyle,
            changeColor
        }
    }
}
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
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
    /* 固定定位 */
    top: 0;
    /* 贴在顶部 */
    left: 0;
    width: 100%;
    /* 占满宽度 */
    z-index: 1000;
    /* 确保在最上层 */
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
    /* 关键 */
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
    /* 或者 flex: 1 + text-align: right; 也可以 */
}


.content-layout {
    display: grid;
    gap: 20px;
    margin-top: 55px;
    /* 等于 header 的高度 */
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
    font-family: 'Consolas', monospace;
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
    font-family: 'Consolas', monospace;
}

.file-name {
    font-size: 14px;
    /* 文件名的字体大小 */
    color: #ffffff;
    /* 文件名的颜色，与按钮文字颜色一致 */
    padding: 5px 10px;
    /* 文件名的内边距 */
    background-color: #409EFF;
    /* 文件名的背景颜色，与按钮背景颜色一致 */
    border-radius: 4px;
    /* 文件名的圆角 */
    vertical-align: middle;
    /* 垂直对齐按钮 */
    display: inline-block;
    /* 确保文件名能够与其他元素在同一行显示 */
    max-width: 160px;
    /* 你可以根据实际布局调整 */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
}

.file-button-group {
    display: flex;
    align-items: center;
    /* 垂直对齐按钮和文件名 */
    gap: 5px;
    /* 调整按钮和文件名之间的间距 */
}

.control-container {
    display: flex;
    gap: 10px;
    /* 两个控件之间的间距 */
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
</style>
