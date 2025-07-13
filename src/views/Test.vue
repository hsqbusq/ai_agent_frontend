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
                        <img src="../assets/02.svg" alt="" style="width: 14px;height: 14px" /> 删除用例
                    </el-button>
                </div>
            </div>
        </div>

        <input type="file" ref="fileInput" accept=".xlsm,.xlsx" @change="handleFileUpload" style="display: none;" />


        <!-- 主内容区 -->
        <div class="content-layout">
            <div class="main-content">
                <!-- 测试用例表格 -->
                <div class="card">
                    <el-table :data="paginatedCases" class="editable-table" height="450" highlight-current-row
                        @selection-change="handleSelectionChange" style="width: 100%" row-key="id">
                        <el-table-column type="selection" :selectable="selectable" width="55"></el-table-column>
                        <el-table-column prop="id" label="Case ID" width="80" align="center"></el-table-column>
                        <el-table-column prop="TestKey" label="测试功能点" min-width="120"></el-table-column>
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
                        <!-- <div class="nav-buttons" style="display: flex;align-items: center;margin: 10px 0">
                            <label for="">日志输出：</label>
                            <el-button type="primary" size="small" @click="showToast('滚动显示')" style="padding: 15px">
                                <img src="../assets/07.svg" alt="" style="width: 14px;height: 14px"> 滚动显示
                            </el-button>
                            <el-button type="primary" size="small" @click="showToast('列表显示')" style="padding: 15px">
                                <img src="../assets/08.svg" alt="" style="width: 14px;height: 14px"> 列表显示
                            </el-button>
                            <el-button type="primary" size="small" @click="showToast('暂停')" style="padding: 15px">
                                <img src="../assets/09.svg" alt="" style="width: 14px;height: 14px"> 暂停
                            </el-button>
                            <el-button type="primary" size="small" @click="showToast('清除')" style="padding: 15px">
                                <img src="../assets/10.svg" alt="" style="width: 14px;height: 14px"> 清除
                            </el-button>
                        </div> -->
                        <el-tabs v-model="activeName" type="card">
                            <el-tab-pane label="Yolo11日志" name="first">
                                <el-table :data="logCases" class="logs-table" height="210" style="width: 100%">
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
                                <el-table :data="executionLogs" class="logs-table" height="210" style="width: 100%">
                                    <el-table-column prop="id" label="序号" width="80" align="center"></el-table-column>
                                    <el-table-column prop="time" label="时间" min-width="160" sortable></el-table-column>
                                    <el-table-column prop="message" label="消息" min-width="260"></el-table-column>
                                </el-table>
                                <!-- <div style="display: flex;align-items: center">
                                    <div>
                                        每页{{ pageSize2 }}条，共{{ executionLogs.length }}条
                                    </div>
                                    <div class="pagination-container">
                                        <el-pagination background layout="prev, pager, next"
                                            :total="executionLogs.length" :page-size="pageSize2"
                                            :current-page="currentPage2" @current-change="handlePageChange2">
                                        </el-pagination>
                                    </div>
                                </div> -->
                            </el-tab-pane>
                            <!-- <el-tab-pane label="其他日志" name="fourth">其他日志</el-tab-pane> -->
                        </el-tabs>


                    </div>
                    <div class="card" style="flex: 5;padding: 10px;">
                        <el-tabs v-model="activeDevice" type="card" @tab-click="handleClick">
                            <el-tab-pane label="手机设备" name="five">
                                <div class="video-container">
                                    <video ref="videoPlayer" width="720" height="480" autoplay muted controls
                                        playsinline></video>
                                    <div class="stream-controls">
                                        <el-button type="primary" @click="toggleStream" :loading="isConnecting"
                                            :disabled="isDisconnecting">
                                            {{ isStreaming ? '停止视频流' : '启动视频流' }}
                                        </el-button>
                                        <span class="status-indicator" :class="streamStatusClass"></span>
                                        <span class="status-text">{{ streamStatusText }}</span>
                                    </div>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
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
                <el-tab-pane label="日志" name="logs">
                    <pre style="text-align: left;">{{ logDetails.logs }}</pre>
                </el-tab-pane>
                <el-tab-pane label="Python代码" name="python">
                    <el-collapse v-model="activeCodeFile">
                        <el-collapse-item v-for="(codeFile, index) in logDetails.code_files" :key="index"
                            :title="codeFile.filename">
                            <pre>{{ codeFile.content }}</pre>
                        </el-collapse-item>
                    </el-collapse>
                </el-tab-pane>
                <el-tab-pane label="测试图片" name="images"> <!-- 新增图片展示栏 -->
                    <div v-for="(image, index) in logDetails.images" :key="index">
                        <p><strong>{{ image.filename }}</strong></p>
                        <img :src="'data:image/png;base64,' + image.base64_data" alt="Test Image"
                            style="width: 100%; margin-bottom: 10px;" />
                    </div>
                </el-tab-pane>

            </el-tabs>
        </el-dialog>
        <!-- 底部栏 -->
    </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import DeviceView from './DeviceView.vue'
import * as XLSX from 'xlsx'
export default {
    components: {
        DeviceView
    },
    setup() {
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
        const logActiveTab = ref('logs')
        const activeCodeFile = ref([])
        const logDetails = reactive({
            logs: '',
            code_files: [],
            images: []
        })

        // 搜索功能
        const searchQuery = ref('')
        const filteredCases = computed(() => {
            return cases.value
        })

        const filteredLogCases = computed(() => {
            return logs.value
        })

        const videoPlayer = ref(null)
        const isStreaming = ref(false)
        const isConnecting = ref(false)
        const isDisconnecting = ref(false)
        const streamStatus = ref('disconnected') // disconnected, connecting, connected, error
        const msePlayer = ref(null)
        const ws = ref(null)

        const deviceUdid = 'a2f30770' // 设备UDID

        // 计算属性
        const streamStatusText = computed(() => {
            return {
                disconnected: '未连接',
                connecting: '连接中...',
                connected: '已连接',
                error: '连接错误'
            }[streamStatus.value]
        })

        const streamStatusClass = computed(() => {
            return {
                disconnected: 'status-disconnected',
                connecting: 'status-connecting',
                connected: 'status-connected',
                error: 'status-error'
            }[streamStatus.value]
        })

        // 构建WebSocket URL
        const buildWebSocketUrl = () => {
            return `ws://localhost:8000/?action=proxy-adb&remote=tcp%3A8886&udid=${deviceUdid}`
        }

        // 初始化MediaSource
        const initMediaSource = () => {
            return new Promise((resolve, reject) => {
                if (mediaSource.value) {
                    URL.revokeObjectURL(videoPlayer.value.src)
                }

                mediaSource.value = new MediaSource()
                const objectUrl = URL.createObjectURL(mediaSource.value)
                videoPlayer.value.src = objectUrl

                mediaSource.value.addEventListener('sourceopen', () => {
                    console.log('MediaSource ready')
                    resolve()
                }, { once: true })

                mediaSource.value.addEventListener('sourceerror', () => {
                    reject(new Error('MediaSource error'))
                }, { once: true })
            })
        }

        // 初始化SourceBuffer
        const initSourceBuffer = () => {
            return new Promise((resolve, reject) => {
                if (!mediaSource.value || mediaSource.value.readyState !== 'open') {
                    return reject(new Error('MediaSource not ready'))
                }

                // 检查浏览器支持的MIME类型
                const mimeType = 'video/mp4; codecs="avc1.42E01E"'
                if (!MediaSource.isTypeSupported(mimeType)) {
                    return reject(new Error(`Unsupported MIME type: ${mimeType}`))
                }

                sourceBuffer.value = mediaSource.value.addSourceBuffer(mimeType)
                sourceBuffer.value.mode = 'sequence'

                sourceBuffer.value.addEventListener('updateend', () => {
                    if (!sourceBuffer.value.updating && mediaSource.value.readyState === 'open') {
                        // 清理旧的视频数据（保留最近10秒）
                        if (videoPlayer.value.currentTime > 10) {
                            try {
                                sourceBuffer.value.remove(0, videoPlayer.value.currentTime - 10)
                            } catch (e) {
                                console.warn('Error removing old segments:', e)
                            }
                        }
                    }
                })

                sourceBuffer.value.addEventListener('error', () => {
                    reject(new Error('SourceBuffer error'))
                })

                resolve()
            })
        }

        // 连接WebSocket
        const connectWebSocket = () => {
            return new Promise((resolve, reject) => {
                const wsUrl = buildWebSocketUrl()

                ws.value = new WebSocket(wsUrl)
                ws.value.binaryType = 'arraybuffer'

                ws.value.onopen = () => {
                    console.log('WebSocket connected')
                    streamStatus.value = 'connected'
                    resolve()
                }

                ws.value.onmessage = (event) => {

                    if (sourceBuffer.value && !sourceBuffer.value.updating) {
                        try {
                            sourceBuffer.value.appendBuffer(event.data)
                        } catch (e) {
                            console.error('Error appending buffer:', e)
                            stopStream()
                        }
                    }
                }

                ws.value.onerror = (error) => {
                    console.error('WebSocket error:', error)
                    streamStatus.value = 'error'
                    reject(error)
                }

                ws.value.onclose = () => {
                    console.log('WebSocket closed')
                    if (streamStatus.value !== 'error') {
                        streamStatus.value = 'disconnected'
                    }
                }
            })
        }

        // 启动视频流
        const startStream = async () => {
            try {
                isConnecting.value = true
                streamStatus.value = 'connecting'

                // 初始化流程
                await initMediaSource()
                await initSourceBuffer()

                // 添加SourceBuffer监听
                sourceBuffer.value.addEventListener('error', (e) => {
                    console.error('SourceBuffer error:', e)
                    stopStream()
                })

                // 连接WebSocket
                const wsUrl = buildWebSocketUrl()
                ws.value = new WebSocket(wsUrl)
                ws.value.binaryType = 'arraybuffer'

                // 添加接收数据统计
                let bytesReceived = 0
                const startTime = Date.now()

                ws.value.onmessage = (event) => {
                    bytesReceived += event.data.byteLength

                    // 实时显示接收速率
                    const elapsed = (Date.now() - startTime) / 1000
                    const rate = (bytesReceived / (1024 * elapsed)).toFixed(2)
                    console.log(`Receiving: ${rate} KB/s`)

                    try {
                        if (sourceBuffer.value && !sourceBuffer.value.updating) {
                            sourceBuffer.value.appendBuffer(event.data)
                        }
                    } catch (e) {
                        console.error('Append error:', e)
                        stopStream()
                    }
                }

                await new Promise((resolve, reject) => {
                    ws.value.onopen = resolve
                    ws.value.onerror = reject
                    setTimeout(() => reject(new Error('Connection timeout')), 5000)
                })

                isStreaming.value = true
                streamStatus.value = 'connected'
                ElMessage.success('视频流已启动')

            } catch (error) {
                console.error('Stream startup failed:', {
                    error,
                    mediaSourceState: mediaSource.value?.readyState,
                    sourceBufferState: sourceBuffer.value?.updating
                })
                stopStream()
                throw error
            } finally {
                isConnecting.value = false
            }
        }

        // 停止视频流
        const stopStream = () => {
            isDisconnecting.value = true

            // 关闭WebSocket
            if (ws.value) {
                ws.value.close()
                ws.value = null
            }

            // 清理SourceBuffer
            if (sourceBuffer.value) {
                try {
                    if (!sourceBuffer.value.updating) {
                        sourceBuffer.value.abort()
                    }
                } catch (e) {
                    console.warn('Error aborting source buffer:', e)
                }
                sourceBuffer.value = null
            }

            // 清理MediaSource
            if (mediaSource.value) {
                if (mediaSource.value.readyState === 'open') {
                    mediaSource.value.endOfStream()
                }
                URL.revokeObjectURL(videoPlayer.value.src)
                mediaSource.value = null
            }

            // 重置视频元素
            if (videoPlayer.value) {
                videoPlayer.value.src = ''
            }

            isStreaming.value = false
            isDisconnecting.value = false
            streamStatus.value = 'disconnected'
        }

        // 切换视频流状态
        const toggleStream = () => {
            if (isStreaming.value) {
                stopStream()
            } else {
                startStream()
            }
        }

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
                message: `${message} 功能已触发`,
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
        const runTestCase = (query) => {
            startPollingForDebugResults(query);
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
        const importXlsmFile = () => {
            fileInput.value.click()
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
                showToast(`正在导入文件: ${file.name}`, 'info')
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

                        json.forEach((row) => {
                            const newId = `${String(cases.value.length + 1).padStart(3, '0')}`
                            cases.value.push({
                                id: newId,
                                TestKey: row['Test Key\r\n功能点'],
                                Initial_Condition: row['Pre-condition\r\n前提条件'],
                                Action: row['Action\r\n操作步骤'],
                                Expected_Result: row['Expected Result\r\n期望结果'],
                                InitTestSequences: row['Init Test Sequences\r\n测试序列前置条件'],
                                ActionTestSequences: row['Action Test Sequences\r\n动作测试序列'],
                                ExpectedTestSequences: row['Expected Test Sequences\r\n预期测试序列结果'],

                            })
                        })
                    }
                    // const firstSheetName = workbook.SheetNames[1]
                    // const worksheet = workbook.Sheets[firstSheetName]
                    // const json = XLSX.utils.sheet_to_json(worksheet, { range: 6 })
                    // console.log(json);
                    // json.forEach((row) => {
                    //     const newId = `${String(cases.value.length + 1).padStart(3, '0')}`
                    //     cases.value.push({
                    //         id: newId,
                    //         TestKey: row['Test Key\r\n功能点'],
                    //         Initial_Condition: row['Pre-condition\r\n前提条件'],
                    //         Action: row['Action\r\n操作步骤'],
                    //         Expected_Result: row['Expected Result\r\n期望结果'],
                    //         InitTestSequences: row['Init Test Sequences\r\n测试序列前置条件'],
                    //         ActionTestSequences: row['Action Test Sequences\r\n动作测试序列'],
                    //         ExpectedTestSequences: row['Expected Test Sequences\r\n预期测试序列结果'],
                    //     })
                    // })
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
                const query = `前提条件: ${row.InitTestSequences} 操作步骤: ${row.ActionTestSequences} 预期结果: ${row.ExpectedTestSequences}`
                runTestCase(query);
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
        const startPollingForDebugResults = (query) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'http://49.235.121.69:19000/chat', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Accept', 'text/event-stream');

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 3) { // xhr.readyState === 3 表示响应正在被接收
                    const responseText = xhr.responseText;
                    console.log("Received response text:", responseText); // 调试信息：打印接收到的响应文本

                    const lines = responseText.split('\n');
                    lines.forEach(line => {
                        if (line.trim() === '') return; // 跳过空行
                        console.log("Processing line:", line); // 调试信息：打印正在处理的行
                        if (line === '') return;
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
                }
            };

            xhr.onload = () => {
                console.log("Stream ended"); // 调试信息：打印流结束信息
            };

            xhr.onerror = (error) => {
                console.error("Error in stream:", error); // 调试信息：打印错误信息
            };

            xhr.send(JSON.stringify({ query }));
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
            xhr.open('POST', 'http://49.235.121.69:19000/v1/chat/completions', true);
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
            fetch('http://49.235.121.69:19000/test_list')
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
            fetch(`http://49.235.121.69:19000/test_logs/${test_id}`)
                .then(response => response.json())
                .then(data => {
                    if (data.code === "200") {
                        // 直接赋值接口返回的日志内容
                        logDetails.logs = data.result.logs.chat_log;
                        logDetails.code_files = data.result.logs.code_files;
                        logDetails.images = data.result.logs.images;
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
            fileInput,
            importXlsmFile,
            handleFileUpload,
            startDebugging,
            caseConversion,
            stopPolling,
            fetchTestList,
            fetchTestLogs,
            logDialogVisible,
            videoPlayer,
            isStreaming,
            isConnecting,
            isDisconnecting,
            streamStatus,
            streamStatusText,
            streamStatusClass,
            toggleStream,
            logActiveTab,
            activeCodeFile,
            logDetails,
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
    max-width: 1800px;
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
</style>