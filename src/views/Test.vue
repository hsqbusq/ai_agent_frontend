<template>
    <div class="app-container">
        <!-- 顶部导航栏 -->
        <div class="header">
            <div class="header-left">
                <div class="nav-buttons">
                    <el-button type="primary" size="small" @click="startDebugging" style="padding: 15px">
                        <img src="../assets/01.svg" alt="" style="width: 14px;height: 14px" /> 开始调试
                    </el-button>
                    <el-button type="primary" size="small" @click="addTestCase" style="padding: 15px">
                        <img src="../assets/02.svg" alt="" style="width: 14px;height: 14px" /> 增加用例
                    </el-button>
                    <el-button type="primary" size="small" @click="importXlsmFile" style="padding: 15px">
                        <img src="../assets/02.svg" alt="" style="width: 14px;height: 14px" /> 导入用例
                    </el-button>
                    <el-button type="primary" size="small" @click="showToast('导出用例')" style="padding: 15px">
                        <img src="../assets/03.svg" alt="" style="width: 14px;height: 14px" /> 导出测试用例
                    </el-button>
                    <el-button type="primary" size="small" @click="showToast('导出测试报告')" style="padding: 15px">
                        <img src="../assets/04.svg" alt="" style="width: 14px;height: 14px" /> 导出测试报告
                    </el-button>
                    <el-button type="primary" size="small" @click="showToast('Python代码生成')" style="padding: 15px">
                        <img src="../assets/05.svg" alt="" style="width: 14px;height: 14px" /> Python代码生成
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
                <!-- 测试用例表格 -->
                <div class="card">
                    <!-- <el-select v-model="infoType" placeholder="请选择信息类型" @change="handleInfoTypeChange">
                        <el-option label="关键信息" value="critical"></el-option>
                        <el-option label="全部信息" value="all"></el-option>
                    </el-select> -->

                    <div class="control-container">
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

                    <el-table :data="paginatedCases" class="editable-table" height="450" highlight-current-row
                        @selection-change="handleSelectionChange" style="width: 100%" row-key="id">
                        <el-table-column type="selection" :selectable="selectable" width="55"></el-table-column>
                        <el-table-column prop="id" label="Case ID" width="80" align="center"></el-table-column>
                        <el-table-column prop="TestCaseID" label="测试用例ID" min-width="120"
                            v-if="showTestKey"></el-table-column>
                        <el-table-column prop="SyRDIDFSRD" label="SyRD/FSRD ID" min-width="120"
                            v-if="showTestKey"></el-table-column>
                        <el-table-column prop="Auto_testID" label="自动测试ID" min-width="120"
                            v-if="showTestKey"></el-table-column>
                        <el-table-column prop="TSR" label="TSR" min-width="120" v-if="showTestKey"></el-table-column>
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
                                <span @click="scope.row.editing = true" v-else>{{ scope.row.InitTestSequences }}</span>
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
                        <el-table-column prop="ActualResult" label="实际结果" min-width="120" v-if="showTestKey">
                        </el-table-column>
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
                            <el-tab-pane label="Yolo11日志" name="first">
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
                                        每页{{ pageSize1 }}条，共{{ logs.length }}条
                                    </div>
                                    <div class="pagination-container">
                                        <el-pagination background layout="prev, pager, next" :total="logs.length"
                                            :page-size="pageSize1" :current-page="currentPage1"
                                            @current-change="handlePageChange1">
                                        </el-pagination>
                                    </div>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="测试执行日志" name="third">
                                <el-table :data="executionLogs" class="logs-table" height="440" style="width: 100%">
                                    <el-table-column prop="id" label="序号" width="80" align="center"></el-table-column>
                                    <el-table-column prop="time" label="时间" min-width="160" sortable></el-table-column>
                                    <el-table-column prop="message" label="消息" min-width="260"></el-table-column>
                                </el-table>
                            </el-tab-pane>
                        </el-tabs>


                    </div>
                    <div class="card" style="flex: 5;padding: 10px;">
                        <el-tabs v-model="activeDevice" type="card" @tab-click="handleClick">
                            <el-tab-pane label="手机设备" name="five">
                                <div class="video-container">
                                    <iframe ref="videoPlayer" width=100% height="480" :src="getStreamUrl()"
                                        frameborder="0" allow="autoplay; fullscreen; picture-in-picture"
                                        allowfullscreen></iframe>
                                </div>
                            </el-tab-pane>
                        </el-tabs> <!-- 新增设备视图 -->
                    </div>
                </div>
            </div>

        </div>

        <!-- 新增的弹窗组件 -->
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
import { ref, reactive, computed, onMounted, onUnmounted, nextTick, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
import * as XLSX from 'xlsx'
export default {
    components: {
    },
    setup() {
        const infoType = ref('all'); // 默认值为关键信息
        const url = ref('');
        const showTestKey = ref(true); // 控制“测试功能点”列的显示
        const showTestidColumn = false;


        const handleInfoTypeChange = (value) => {
            showTestKey.value = value !== 'critical';
        };
        const { proxy } = getCurrentInstance();

        // 从全局属性中获取 udid
        const udid = ref(proxy.$udid.value);
        
        const getStreamUrl = () => {
            return `http://localhost:8000/#!action=stream&udid=${udid.value}&player=mse&ws=ws%3A%2F%2Flocalhost%3A8000%2F%3Faction%3Dproxy-adb%26remote%3Dtcp%253A8886%26udid%3D${udid.value}`;
        }

        const activeName = ref('first')
        const activeDevice = ref('five')
        // 测试用例数据
        const cases = ref([])

        // 日志数据
        const logs = ref([])

        // 测试执行日志数据
        const executionLogs = ref([])

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
        const pageSize = ref(8)

        const currentPage1 = ref(1)
        const pageSize1 = ref(8)

        const currentPage2 = ref(1)
        const pageSize2 = ref(8)

        // 计算当前页显示的数据
        const paginatedCases = computed(() => {
            const start = (currentPage.value - 1) * pageSize.value
            const end = start + pageSize.value
            return filteredCases.value.slice(start, end)
        })

        const logCases = computed(() => {
            const start = (currentPage1.value - 1) * pageSize1.value
            const end = start + pageSize1.value
            return filteredLogCases.value.slice(start, end)
        })

        const executionLogCases = computed(() => {
            const start = (currentPage2.value - 1) * pageSize2.value
            const end = start + pageSize2.value
            return executionLogs.value.slice(start, end)
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
            if (selectedRows.value.length === 0) {
                showToast('请先选择要删除的测试用例', 'warning')
                return
            }

            selectedRows.value.forEach((row) => {
                const index = cases.value.findIndex(c => c.id === row.id)
                if (index !== -1) {
                    cases.value.splice(index, 1)
                }
            })

            showToast('测试用例已删除', 'success')
        }

        // 运行测试用例
        const runTestCase = (query, baseurl, id) => {
            executionLogCases.value = []
            startPollingForDebugResults(query, baseurl, id);
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
        const selectedRows = ref([]);

        // 处理选中改变事件
        const handleSelectionChange = (selection) => {
            console.log('Selection changed: ', selection);
            selectedRows.value = selection;

            // 移除所有行的高亮
            const tableRows = document.querySelectorAll('.el-table__row');
            tableRows.forEach((el) => {
                el.classList.remove('highlight');
                el.removeAttribute('data-id');
            });

            // 高亮选中的行
            selection.forEach((row) => {
                const currentRow = document.querySelector(`.el-table__row[data-row-key='${row.id}']`);
                if (currentRow) {
                    currentRow.classList.add('highlight');
                    currentRow.setAttribute('data-id', row.id);
                }
            });

        };

        // 分页变化处理
        const handlePageChange = (newPage) => {
            currentPage.value = newPage
            showToast(`切换到第 ${newPage} 页`, 'info')
        }

        const handlePageChange1 = (newPage) => {
            currentPage1.value = newPage
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
        const selectDbcFile = () => {
            dbcFileInput.value.click()
            showToast('请选择DBC文件', 'info')
        }

        const handleFileUpload = (event) => {
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

                    // 遍历所有工作表
                    for (let i = 1; i < sheetCount - 1; i++) {
                        const sheetName = workbook.SheetNames[i]
                        const worksheet = workbook.Sheets[sheetName]
                        const json = XLSX.utils.sheet_to_json(worksheet, { range: 6 })
                        console.log(json)
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

        // 开始调试功能
        const startDebugging = () => {
            if (selectedRows.value.length === 0) {
                showToast('请先选择要调试的测试用例', 'warning')
                return
            }

            selectedRows.value.forEach((row) => {
                const query = `前提条件: ${row.InitTestSequences} 操作步骤: ${row.ActionTestSequences}`
                const baseurl = url.value
                // const qery = `前提条件:4.Pwr-1-SupplyPower-13 预期结果：远光灯开启`
                runTestCase(query, baseurl, row.id);
            })
        }

        // 开始序列号用例转化
        const caseConversion = () => {
            if (selectedRows.value.length === 0) {
                showToast('请先选择要转换的测试用例', 'warning')
                return
            }

            selectedRows.value.forEach((row) => {
                runCaseConversion(row);
            })
        }

        let pollingInterval = null;
        const startPollingForDebugResults = (query, baseurl, id) => {
            let testIdFound = false; // 添加标志变量
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/dev-api/chat', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Accept', 'text/event-stream');
            let lastProcessedLength = 0;
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 3) {
                    // 获取新接收到的部分响应数据
                    const newResponseText = xhr.responseText.slice(lastProcessedLength);
                    console.log("Received new response text:", newResponseText);


                    const lines = newResponseText.split('\n');
                    // console.log(lines)
                    var thinkFlag = false; // 标志是否有思考提示

                    lines.forEach(line => {
                        if (line.trim() === '') return; // 跳过空行
                        if (line === '') return;
                        const match = line.match(/data: \[.*?\]\{"test_id": "(.*?)"\}/);
                        if (!testIdFound) {
                            if (match) {
                                const test_id = match[1];
                                console.log("Found test_id:", test_id); // 调试信息：打印找到的测试用例ID
                                testIdFound = true;
                                const pollForResult = async () => {
                                    const maxPollingTime = 300000; //   300s
                                    const interval = 5000; //   5s
                                    let elapsedTime = 0;

                                    const intervalId = setInterval(async () => {
                                        const index = cases.value.findIndex(c => c.id === id);
                                        try {
                                            const response = await fetch(`/dev-api/result/${test_id}`);
                                            const data = await response.json();
                                            console.log("Received result data:", data); // 调试信息：打印接收到的结果数据
                                            if (data.result !== null) {
                                                // console.log("Result is not null, stopping polling." + data.result);
                                                if (index !== -1) {
                                                    cases.value[index].Result = data.result;
                                                    cases.value[index].Testid = test_id;
                                                }
                                                fetchTestList(); // 刷新测试用例列表
                                                clearInterval(intervalId); // 停止轮询
                                            }
                                        } catch (error) {
                                            cases.value[index].Result = '获取测试结果失败';
                                            cases.value[index].Testid = test_id;
                                            console.error("Error fetching result:", error);
                                        }

                                        elapsedTime += interval;
                                        if (elapsedTime >= maxPollingTime) {
                                            console.log("超时未获取测试结果");
                                            cases.value[index].Result = '超时未获取测试结果';
                                            cases.value[index].Testid = test_id;
                                            fetchTestList(); // 刷新测试用例列表    
                                            clearInterval(intervalId); // 停止轮询
                                        }
                                    }, interval);
                                };

                                pollForResult(); // 启动轮询
                                return; // 找到 test_id 后停止处理当前迭代
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
                        console.log("Received line:", line);
                        try {
                            executionLogs.value.push({
                                id: executionLogs.value.length + 1,
                                time: new Date().toISOString().slice(0, 19).replace('T', ' '),
                                message: `${line}`,
                            });
                        } catch (parseError) {
                            console.error("Error parsing chunk:", parseError);
                        }
                    });
                    // 更新已处理的数据位置
                    lastProcessedLength = xhr.responseText.length;
                }
            };

            xhr.onload = () => {
                console.log("Stream ended"); // 调试信息：打印流结束信息
            };

            xhr.onerror = (error) => {
                console.error("Error in stream:", error); // 调试信息：打印错误信息
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

        // 停止轮询
        const stopPolling = () => {
            if (pollingInterval) clearInterval(pollingInterval);
        }

        // 获取测试用例列表
        const fetchTestList = () => {
            fetch('/dev-api/test_list')
                .then(response => response.json())
                .then(data => {
                    if (data.code === "200") {
                        const testCases = data.result.items.map((item) => ({
                            id: item.test_id,
                            time: item.create_time,
                            message: item.query,
                        }));
                        logs.value = testCases;
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
                        console.log(logDetails.code_files);
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
                    console.log(data);
                    if (data.status === "ok") {
                        ActualResultDetails.images = data.base64;
                        console.log(ActualResultDetails.images);
                        ActualResultDialogVisible.value = true;
                        showToast(`实际结果加载成功`, 'success');
                    } else {
                        showToast('实际结果加载失败1', 'error');
                    }
                })
                .catch(error => {
                    console.error('Error fetching test result:', error);
                    showToast('实际结果加载失败2', 'error');
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
                fetchTestList();
            }, 500)
        })

        // 组件卸载时停止轮询
        onUnmounted(() => {
            stopPolling();
        })

        return {
            activeName,
            getStreamUrl,
            udid,
            infoType,
            url,
            showTestKey,
            showTestidColumn,
            activeDevice,
            cases,
            logs,
            searchQuery,
            filteredCases,
            logCases,
            executionLogs,
            executionLogCases,
            filteredLogCases,
            paginatedCases,
            currentPage,
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
            selectedRows,
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
            dbcFileName,
            fileInput,
            dbcFileInput,
            importXlsmFile,
            handleFileUpload,
            startDebugging,
            caseConversion,
            stopPolling,
            fetchTestList,
            fetchTestLogs,
            fetchActualResult,
            logDialogVisible,
            ActualResultDialogVisible,

            logActiveTab,
            ActualResultActiveTab,
            activeCodeFile,
            logDetails,
            ActualResultDetails,
            handleInfoTypeChange
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
</style>