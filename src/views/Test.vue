<template>
    <div class="app-container">
        <!-- 顶部导航栏 -->
        <div class="header">
            <div class="header-left">
                <div class="nav-buttons">
                    <el-button type="primary" size="small" @click="startDebugging" style="padding: 15px">
                        <img src="../assets/01.svg" alt="" style="width: 14px;height: 14px" /> 开始测试
                    </el-button>
                    <el-button type="primary" size="small" @click="stopDebugging" style="padding: 15px">
                        <img src="../assets/07.svg" alt="" style="width: 14px;height: 14px" /> 停止测试
                    </el-button>
                    <el-button type="primary" size="small" @click="addTestCase" style="padding: 15px">
                        <img src="../assets/02.svg" alt="" style="width: 14px;height: 14px" /> 增加用例
                    </el-button>
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
                    <el-button type="primary" size="small" @click="caseConversion" style="padding: 15px">
                        <img src="../assets/06.svg" alt="" style="width: 14px;height: 14px" /> 序列化用例转化
                    </el-button>
                    <el-button type="primary" size="small" @click="deleteTestCase" style="padding: 15px">
                        <img src="../assets/10.svg" alt="" style="width: 14px;height: 14px" /> 删除用例
                    </el-button>
                    <!-- <el-button type="primary" size="small" @click="selectDbcFile" style="padding: 15px">
                        <img src="../assets/02.svg" alt="" style="width: 14px;height: 14px" /> 读取dbc
                    </el-button>
                    <span v-if="dbcFileName" class="file-name">已选择：{{ dbcFileName.name }}</span> -->
                    <div class="file-button-group">
                        <el-button type="primary" size="small" @click="selectDbcFile" style="padding: 15px">
                            <img src="../assets/02.svg" alt="" style="width: 14px;height: 14px" /> 读取DBC
                        </el-button>
                        <span v-if="dbcFileName" class="file-name">已选择：{{ dbcFileName.name }}</span>
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
                            highlight-current-row @selection-change="handleSelectionChange" style="width: 100%"
                            row-key="id">
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
                                <!-- <el-table :data="executionLogs" class="logs-table" height="440" style="width: 100%">
                                    <el-table-column prop="id" label="序号" width="80" align="center"></el-table-column>
                                    <el-table-column prop="time" label="时间" min-width="160" sortable></el-table-column>
                                    <el-table-column prop="message" label="消息" min-width="260"></el-table-column>
                                </el-table> -->
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

                            <!-- 新增仪表设备标签页 -->
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
                        </el-tabs> <!-- 新增设备视图 -->
                    </div>
                </div>
            </div>

        </div>

        <!-- 新增测试用例弹窗组件 -->
        <el-dialog v-model="dialogVisible" title="新增测试用例" width="50%">
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

window.Buffer = Buffer;
export default {
    components: {
    },
    setup() {

        const selectedCase = ref('');
        const selectedSheet = ref('')
        const infoType = ref('all'); // 默认值为关键信息
        const url = ref('http://172.23.96.54:8000');
        const showTestKey = ref(true); // 控制“测试功能点”列的显示
        const showTestidColumn = false;


        const handleInfoTypeChange = (value) => {
            showTestKey.value = value !== 'critical';
        };
        const { proxy } = getCurrentInstance();

        // 从全局属性中获取 udid
        const udid = ref(proxy.$udid.value);

        const instrumentStreamUrl = ref('http://172.23.96.54:8000/camera/video?name=UGREEN');
        const videoPlayer = ref(null);
        const instrumentVideoPlayer = ref(null);

        const activeName = ref('first')
        const activeDevice = ref('five')
        // 测试用例数据
        const cases = ref(JSON.parse(localStorage.getItem('cases')) || [
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

        const casesTable = ref(JSON.parse(localStorage.getItem('casesTable')) || [])

        watch(casesTable, (newCasesTable) => {
            localStorage.setItem('casesTable', JSON.stringify(newCasesTable))
        }, { deep: true })

        watch(cases, (newCases) => {
            localStorage.setItem('cases', JSON.stringify(newCases))
        }, { deep: true })

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
                // 手机设备连接逻辑
                if (!url.value) {
                    showToast('请先输入URL地址', 'warning');
                    return;
                }
                // 更新手机设备视频流URL
                // 这里可以根据需要修改URL格式
                const mobileUrl = `${url.value}/adb/video`;
                //console.log(mobileUrl)
                // 刷新iframe
                if (videoPlayer.value) {
                    videoPlayer.value.src = mobileUrl;
                }
                showToast('手机视频流已连接', 'success');
            } else if (deviceType === 'instrument') {
                // 仪表设备连接逻辑
                if (!url.value) {
                    showToast('请先输入URL地址', 'warning');
                    return;
                }
                // 更新仪表设备视频流URL
                const instrumentUrl = `${url.value}/camera/video?name=UGREEN`;
                //console.log(instrumentUrl);
                instrumentStreamUrl.value = instrumentUrl;
                // 刷新iframe
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
                if (index !== -1) {
                    cases.value.splice(index, 1)
                }
            })
            selectedRowsAll.value = []

            showToast('测试用例已删除', 'success')
        }

        // 运行测试用例
        const runTestCase = (query, baseurl, id) => {
            return new Promise((resolve, reject) => {
                try {
                    startPollingForDebugResults(query, baseurl, id, resolve, reject);
                } catch (error) {
                    reject(error);
                }
            });
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
            const sheet = casesTable.value.find(s => s.sheetName === sheetName)
            if (sheet) {
                startId.value = cases.value[sheet.start].id
                endId.value = cases.value[sheet.end].id
            }
        }

        // 计算属性，只跑一次
        const caseIdOptions = computed(() =>
            cases.value.map(item => ({ value: item.id, label: item.id }))
        );

        const selectRowsHandle = () => {
            const newSelectedRowsAll1 = [];
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
            changePage.value = true
            paginatedCases.value.forEach(row => {
                const isSelected = selectedRowsAll.value.some(r => r.id === row.id);
                proxy.$refs.caseTable.toggleRowSelection(row, isSelected);
            });
            changePage.value = false
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
            console.log(selectedRowsAll.value)
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
                            reslutCases.value.slice(-1)[0].ActualResult = data.base64;
                        } else {
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching test result:', error);
                    });
            } catch (error) {
                console.error(`Testid${caseItem.Testid}的case真实结果失败`, error);
                showToast(`Testid${caseItem.Testid}的case真实结果失败`, 'error');
            }
        }

        const exportTestReport = async () => {

            // 轮询所有cases的执行结果
            cases.value.forEach((row) => {
                // 判断case.value.Result是否空
                if (row.Result === undefined || row.Result === '') {

                } else {
                    reslutCases.value.push(row);
                    fetchActualResultForExcel(row.Testid, row.ExpectedTestSequences);
                }
            })

            console.log(reslutCases.value)

            // 创建一个HTML字符串
            let htmlContent = '<html><head><title>Test Report</title><style>table { width: 100%; border-collapse: collapse; } table, th, td { border: 1px solid black; padding: 8px; text-align: left; }</style></head><body>';
            htmlContent += '<table>';
            console.log(reslutCases.value)
            reslutCases.value.sort((a, b) => a.id - b.id);

            // 计算统计信息
            const totalCases = reslutCases.value.length;
            const passCases = reslutCases.value.filter(caseItem => caseItem.Result.toLowerCase() === 'pass').length;
            const failCases = totalCases - passCases;

            // 添加统计信息行
            htmlContent += '<tr>';
            htmlContent += `<th>测试案例总数: ${totalCases}</th>`;
            htmlContent += `<th>PASS案例数: ${passCases}</th>`;
            htmlContent += `<th>FAIL案例数: ${failCases}</th>`;
            htmlContent += '</tr>';

            let headerCase = {
                id: '',
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
                InitTestSequences: "",
                ActionTestSequences: '',
                ExpectedTestSequences: '',
                Result: undefined,
                ActualResult: '',
                Selected: '',
                PRNo: '',
                TestLogs: '',
                Numberoftests: '',
                TestDate: '',
                Remark: '',
            };

            // 获取表头
            const headers = Object.keys(headerCase);

            console.log(headers);

            // 添加表头行
            htmlContent += '<tr>';
            headers.forEach(header => {
                htmlContent += `<th>${header}</th>`;
            });
            htmlContent += '</tr>';

            // 处理数据行
            for (let i = 0; i < reslutCases.value.length; i++) {
                const caseItem = reslutCases.value[i];
                htmlContent += '<tr>';
                headers.forEach(header => {
                    if (header === 'ActualResult') {
                        const base64Image = caseItem[header];
                        htmlContent += `<td><a href="data:image/png;base64,${base64Image}" download="result_image.png"><img src="data:image/png;base64,${base64Image}" width="100" height="100"></a></td>`;
                    } else if (header === 'Testid') {

                    } else {
                        const value = caseItem[header] !== undefined ? caseItem[header] : '';
                        htmlContent += `<td>${value}</td>`;
                    }
                });
                htmlContent += '</tr>';
            }

            htmlContent += '</table></body></html>';

            // 创建一个Blob对象
            const blob = new Blob([htmlContent], {
                type: 'text/html'
            });

            // 使用FileSaver.js保存文件
            saveAs(blob, 'test_report.html');
        }


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
                    json.forEach((row) => {
                        const newId = `${String(cases.value.length + 1).padStart(3, '0')}`
                        cases.value.push({
                            id: newId,
                            TestKey: row['TestKey\r\n测试功能点'],
                            Initial_Condition: row['Initial_Condition\r\n初始条件'],
                            Action: row['Action\r\n动作'],
                            Expected_Result: row['Expected_Result\r\n预期结果'],
                            InitTestSequences: row['InitTestSequences\r\n初始条件序列'],
                            ActionTestSequences: row['ActionTestSequences\r\n操作步骤序列'],
                            ExpectedTestSequences: row['ExpectedTestSequences\r\n预期结果序列'],
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
                                Numberoftests: row['Number of tests'],
                                TestDate: row['Test Date'],
                                Remark: row['Remark'],
                            })
                        })
                    }
                    showToast(`文件导入完成: ${file.name}`, 'success')
                }
                reader.readAsArrayBuffer(file)
            } else {
                showToast('请选择有效的 xlsm 文件', 'error')
            }
        }

        const startDebugging = async () => {
            if (selectedRowsAll.value.length === 0) {
                showToast('请先选择要调试的测试用例', 'warning');
                return;
            }
            activeName.value = 'third';
            isDebugRunning.value = true;
            debugRows.value = [];

            let index = 0;
            while (index < selectedRowsAll.value.length && isDebugRunning.value) {
                const row = selectedRowsAll.value[index];
                console.log(`开始调试用例${row.id}`);
                console.log(selectedRowsAll.value);
                console.log(selectedRowsAll.value.length);
                try {
                    if (!debugRows.value.some(dr => dr.id === row.id)) {
                        debugRows.value.push(row);
                    }
                    console.log(debugRows.value);
                    selectedCase.value = row.id;
                    console.log(selectedCase.value);
                    const query = `前提条件: ${row.InitTestSequences} 操作步骤: ${row.ActionTestSequences} 预期结果:${row.ExpectedTestSequences}`;
                    const baseurl = url.value;

                    await runTestCase(query, baseurl, row.id);
                } catch (error) {
                    showToast(`测试用例${row.id}调试失败`, 'error');
                }

                index++;
                console.log(selectedRowsAll.value.length)
                console.log(`结束调试用例${row.id}`);
                console.log(index);
                console.log(isDebugRunning.value);
            }

            isDebugRunning.value = false;
        };

        // 开始序列号用例转化
        const caseConversion = () => {
            if (selectedRowsAll.value.length === 0) {
                showToast('请先选择要转换的测试用例', 'warning')
                return
            }

            selectedRowsAll.value.forEach((row) => {
                runCaseConversion(row);
            })
        }

        const isDebugRunning = ref(false)

        const stopDebugging = () => {
            isDebugRunning.value = false;
            debugRows.value = [];
            selectedCase.value = '';
            stopPolling();
            executionLogs.value = {};
            showToast('调试已停止', 'info');
        }

        const pollingIntervals = {};
        const startPollingForDebugResults = (query, baseurl, id, resolve, reject) => {
            showToast('发送调试请求成功，日志将在下方测试执行日志展示！', 'success');
            executionLogs.value[id] = [];
            executionLogs.value[id].push({
                log_id: 1,
                time: new Date().toISOString().slice(0, 19).replace('T', ' '),
                message: `开始调试，请等待！`,
            });

            let testIdFound = false; // 添加标志变量
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/dev-api/chat', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Accept', 'text/event-stream');
            let lastProcessedLength = 0;

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 3 && isDebugRunning.value) {
                    // 获取新接收到的部分响应数据
                    const newResponseText = xhr.responseText.slice(lastProcessedLength);

                    const lines = newResponseText.split('\n');
                    var thinkFlag = false; // 标志是否有思考提示

                    lines.forEach(line => {
                        if (line.trim() === '') return; // 跳过空行
                        if (line === '') return;
                        const match = line.match(/data: \[.*?\]\{"test_id": "(.*?)"\}/);
                        if (!testIdFound) {
                            if (match) {
                                const test_id = match[1];
                                testIdFound = true;
                                const pollForResult = async () => {
                                    const maxPollingTime = 300000; // 300s
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
                                                    // reslutCases.value.push(cases.value[index]);
                                                    // fetchActualResultForExcel(test_id, cases.value[index].ExpectedTestSequences);
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
                                time: new Date().toISOString().slice(0, 19).replace('T', ' '),
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

            xhr.send(JSON.stringify({ query: query, baseurl: baseurl }));
        }


        const startCaseConversion = (row) => {
            // 第一次调用
            callApi(row.id, row.Initial_Condition, 'A', false);
            // 第二次调用
            callApi(row.id, row.Action, 'B', false);
            // 第三次调用
            callApi(row.id, row.Expected_Result, 'C', false);
        }

        const callApi = (id, input, task, stream) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/dev-api/v1/chat/completions', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Accept', 'text/event-stream');

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 3) {
                    const response = JSON.parse(xhr.responseText);
                    const content = response.choices[0].message.content;
                    if (task === 'A') {
                        const index = cases.value.findIndex(c => c.id === id);
                        cases.value[index].InitTestSequences = content;
                    }
                    if (task === 'B') {
                        const index = cases.value.findIndex(c => c.id === id);
                        cases.value[index].ActionTestSequences = content;
                    }
                    if (task === 'C') {
                        const index = cases.value.findIndex(c => c.id === id);
                        cases.value[index].ExpectedTestSequences = content;

                    }
                }
            };

            xhr.send(JSON.stringify({ input, task, stream }));
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
        const dbcFileName = ref('')
        const handleDbcFileUpload = (event) => {
            const file = event.target.files[0];
            if (file) {
                dbcFileName.value = file;
            }
            showToast('DBC文件选择成功', 'success')
        }


        // 模拟组件加载
        onMounted(() => {
            setTimeout(() => {
                fetchTestList(1);
            }, 500)
        })

        // 组件卸载时停止轮询
        onUnmounted(() => {
            stopPolling();
        })

        return {
            isDebugRunning,
            activeName,
            udid,
            infoType,
            url,
            showTestKey,
            showTestidColumn,
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
            endId
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
    position: fixed;        /* 固定定位 */
    top: 0;                 /* 贴在顶部 */
    left: 0;
    width: 100%;            /* 占满宽度 */
    z-index: 1000;          /* 确保在最上层 */
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
    flex-wrap: wrap;
    gap: 8px;
}


.content-layout {
    display: grid;
    gap: 20px;
    margin-top: 55px; /* 等于 header 的高度 */
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
</style>