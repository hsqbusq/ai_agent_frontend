<template>
    <div class="app-container">
        <!-- 顶部导航栏 -->
        <div class="header">
            <div class="header-left">
                <div class="nav-buttons">
                    <el-button type="primary" size="small" @click="showToast('开始调试')" style="padding: 15px">
                        <img src="../assets/01.svg" alt="" style="width: 14px;height: 14px"> 开始调试
                    </el-button>
                    <el-button type="primary" size="small" @click="showToast('导入用例')" style="padding: 15px">
                        <img src="../assets/02.svg" alt="" style="width: 14px;height: 14px"> 导入用例
                    </el-button>
                    <el-button type="primary" size="small" @click="showToast('导出用例')" style="padding: 15px">
                        <img src="../assets/03.svg" alt="" style="width: 14px;height: 14px"> 导出测试用例
                    </el-button>
                    <el-button type="primary" size="small" @click="showToast('导出测试报告')" style="padding: 15px">
                        <img src="../assets/04.svg" alt="" style="width: 14px;height: 14px"> 导出测试报告
                    </el-button>
                    <el-button type="primary" size="small" @click="showToast('Python代码生成')" style="padding: 15px">
                        <img src="../assets/05.svg" alt="" style="width: 14px;height: 14px"> Python代码生成
                    </el-button>
                    <el-button type="primary" size="small" @click="showToast('序列化用例转化')" style="padding: 15px">
                        <img src="../assets/06.svg" alt="" style="width: 14px;height: 14px"> 序列化用例转化
                    </el-button>
                </div>
            </div>
        </div>


        <!-- 主内容区 -->
        <div class="content-layout">
            <div class="main-content">
                <!-- 测试用例表格 -->
                <div class="card">
                    <el-table :data="paginatedCases" class="editable-table" height="450" highlight-current-row
                        @row-click="handleRowClick" style="width: 100%">
                        <el-table-column type="selection" :selectable="selectable" width="55" />
                        <el-table-column prop="id" label="Case ID" width="80" align="center" />
                        <el-table-column prop="module" label="功能点" min-width="120" />
                        <el-table-column prop="steps" label="操作步骤" min-width="200" />
                        <el-table-column prop="expected" label="期望结果" min-width="180" />
                        <el-table-column prop="condition" label="测试序列前置条件" min-width="180" />
                        <el-table-column prop="action" label="动作测试序列" min-width="140" />
                        <el-table-column prop="status" label="预测测试序列结果" width="150" align="center">
                            <!-- <template #default="{ row }">
                <el-tag size="small" :type="statusType(row.status)">
                  {{ row.status }}
                </el-tag>
              </template> -->
                        </el-table-column>
                    </el-table>
                    <div class="pagination-container">
                        <el-pagination background layout="prev, pager, next" :total="logs.length" :page-size="pageSize"
                            :current-page="currentPage" @current-change="handlePageChange">
                        </el-pagination>
                    </div>
                </div>

                <!-- 日志输出 -->
                <div style="display: flex">
                    <div class="card" style="flex: 5;padding: 10px">
                        <div class="nav-buttons" style="display: flex;align-items: center;margin: 10px 0">
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
                        </div>
                        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                            <el-tab-pane label="Yolo11日志" name="first">
                                <el-table :data="logCases" class="logs-table" height="210" style="width: 100%">
                                    <el-table-column prop="id" label="序号" width="80" align="center" />
                                    <el-table-column prop="time" label="时间" min-width="160" sortable />
                                    <el-table-column prop="message" label="消息" min-width="260" />
                                    <el-table-column label="操作" min-width="260">
                                        <!-- <template #default="{ row }">
                      <el-button type="primary" size="small" @click="showToast(row.id)" style="padding: 15px">
                        <img src="../assets/11.svg" alt="" style="width: 14px;height: 14px"> 查看
                      </el-button>
                    </template> -->
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
                            <el-tab-pane label="模型日志" name="second">模型日志</el-tab-pane>
                            <el-tab-pane label="测试执行日志" name="third">测试执行日志</el-tab-pane>
                            <el-tab-pane label="其他日志" name="fourth">其他日志</el-tab-pane>
                        </el-tabs>


                    </div>
                    <div class="card" style="flex: 5;padding: 10px">
                        <el-tabs v-model="activeDevice" type="card" @tab-click="handleClick">
                            <el-tab-pane label="手机设备" name="five">
                                <v-app>
                                    <DeviceView :room-name="'default-room'" :current-user="{
                                        id: 'default-user',
                                        name: 'Default User',
                                    }" />
                                </v-app>

                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
            </div>

        </div>

        <!-- 底部栏 -->
    </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import DeviceView from './DeviceView.vue'
export default {
    components: {
        DeviceView
    },
    setup() {
        const activeName = ref('first')
        const activeDevice = ref('five')
        // 测试用例数据
        const cases = ref([
            { action: '动作测试序列', condition: '测试序列前置条件', id: 'TC001', module: '用户登录', steps: '输入用户名和密码，点击登录', expected: '成功登录系统', status: '待测试' },
            { action: '动作测试序列', condition: '测试序列前置条件', id: 'TC002', module: '订单创建', steps: '选择商品，填写收货信息，提交订单', expected: '订单创建成功', status: '通过' },
            { action: '动作测试序列', condition: '测试序列前置条件', id: 'TC003', module: '支付流程', steps: '选择支付方式，完成支付', expected: '支付成功，状态更新', status: '未通过' },
            { action: '动作测试序列', condition: '测试序列前置条件', id: 'TC004', module: '个人信息更新', steps: '修改个人资料并保存', expected: '信息更新成功', status: '待测试' },
            { action: '动作测试序列', condition: '测试序列前置条件', id: 'TC005', module: '商品搜索', steps: '输入关键词进行搜索', expected: '返回相关商品列表', status: '通过' },
            { action: '动作测试序列', condition: '测试序列前置条件', id: 'TC006', module: '购物车管理', steps: '添加商品到购物车，修改数量', expected: '购物车内容正确更新', status: '待测试' },
            { action: '动作测试序列', condition: '测试序列前置条件', id: 'TC007', module: '评论功能', steps: '提交商品评论', expected: '评论显示在商品详情页', status: '通过' },
            { action: '动作测试序列', condition: '测试序列前置条件', id: 'TC008', module: '库存管理', steps: '修改商品库存数量', expected: '库存数量正确更新', status: '未通过' },
            { action: '动作测试序列', condition: '测试序列前置条件', id: 'TC009', module: '数据导出', steps: '选择日期范围导出数据', expected: '导出正确的Excel文件', status: '待测试' },
            { action: '动作测试序列', condition: '测试序列前置条件', id: 'TC010', module: '权限管理', steps: '修改用户权限并保存', expected: '用户权限成功更新', status: '通过' },
            { action: '动作测试序列', condition: '测试序列前置条件', id: 'TC011', module: '用户注册', steps: '填写注册信息并提交', expected: '注册成功并发送验证邮件', status: '待测试' },
            { action: '动作测试序列', condition: '测试序列前置条件', id: 'TC012', module: '找回密码', steps: '输入邮箱申请重置密码', expected: '成功发送重置密码邮件', status: '通过' },
        ])

        // 日志数据
        const logs = ref([
            { id: 1, time: '2024-11-12 04:50', message: '调试开始: 用户登录模块测试', hasOperation: '有' },
            { id: 2, time: '2024-10-23 04:55', message: '支付流程测试完成，结果: 通过', hasOperation: '有' },
            { id: 3, time: '2024-10-06 16:43', message: '发现错误: 购物车数量更新异常', hasOperation: '有' },
            { id: 4, time: '2025-11-28 20:21', message: '新增测试用例 TC010 - 权限管理', hasOperation: '有' },
            { id: 5, time: '2025-12-09 19:50', message: '系统性能优化完成', hasOperation: '无' },
            { id: 5, time: '2025-12-09 19:50', message: '系统性能优化完成', hasOperation: '无' },
            { id: 5, time: '2025-12-09 19:50', message: '系统性能优化完成', hasOperation: '无' },
            { id: 5, time: '2025-12-09 19:50', message: '系统性能优化完成', hasOperation: '无' },
            { id: 5, time: '2025-12-09 19:50', message: '系统性能优化完成', hasOperation: '无' },
            { id: 5, time: '2025-12-09 19:50', message: '系统性能优化完成', hasOperation: '无' },
            { id: 5, time: '2025-12-09 19:50', message: '系统性能优化完成', hasOperation: '无' },

        ])

        // 搜索功能
        const searchQuery = ref('')
        const filteredCases = computed(() => {
            return cases.value
        })

        const filteredLogCases = computed(() => {
            return logs.value
        })


        // 分页设置
        const currentPage = ref(1)
        const pageSize = ref(8)

        const currentPage1 = ref(1)
        const pageSize1 = ref(8)

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

        // 添加新测试用例
        const addTestCase = () => {
            const newId = `TC${String(cases.value.length + 1).padStart(3, '0')}`
            cases.value.unshift({
                id: newId,
                module: '新功能模块',
                steps: '请描述操作步骤...',
                expected: '预期结果...',
                status: '待测试'
            })
            showToast('测试用例已添加', 'success')
        }

        // 编辑测试用例
        const editTestCase = (row) => {
            logs.value.unshift({
                id: logs.value.length + 1,
                time: new Date().toISOString().slice(0, 19).replace('T', ' '),
                message: `编辑测试用例: ${row.module} (${row.id})`,
                hasOperation: '有'
            })
            showToast(`正在编辑用例: ${row.id}`)
        }

        // 删除测试用例
        const deleteTestCase = (row) => {
            const index = cases.value.findIndex(c => c.id === row.id)
            if (index !== -1) {
                cases.value.splice(index, 1)
                showToast('测试用例已删除', 'success')
            }
        }

        // 运行测试用例
        const runTestCase = (row) => {
            logs.value.unshift({
                id: logs.value.length + 1,
                time: new Date().toISOString().slice(0, 19).replace('T', ' '),
                message: `开始执行测试用例: ${row.module} (${row.id})`,
                hasOperation: '有'
            })
            showToast(`正在运行用例: ${row.id}`)
        }

        // 清除日志
        const clearLogs = () => {
            logs.value = []
            showToast('日志已清除', 'info')
        }

        // 表格行点击处理
        const handleRowClick = (row, column, event) => {
            // 清除之前的高亮
            const tableRows = event.currentTarget.parentElement.querySelectorAll('.el-table__row')
            tableRows.forEach(el => {
                el.classList.remove('highlight')
            })

            // 高亮当前行
            event.currentTarget.classList.add('highlight')

            // 添加到日志
            logs.value.unshift({
                id: logs.value.length + 1,
                time: new Date().toISOString().slice(0, 19).replace('T', ' '),
                message: `选中测试用例: ${row.id} - ${row.module}`,
                hasOperation: '无'
            })
        }

        // 分页变化处理
        const handlePageChange = (newPage) => {
            currentPage.value = newPage
            showToast(`切换到第 ${newPage} 页`, 'info')
        }

        const handlePageChange1 = (newPage) => {
            currentPage1.value = newPage
            showToast(`切换到第 ${newPage} 页`, 'info')
        }


        // 模拟组件加载
        onMounted(() => {
            setTimeout(() => {
                logs.value.unshift({
                    id: logs.value.length + 1,
                    time: new Date().toISOString().slice(0, 19).replace('T', ' '),
                    message: '系统初始化完成，准备测试',
                    hasOperation: '有'
                })
            }, 500)
        })

        return {
            activeName,
            activeDevice,
            cases,
            logs,
            searchQuery,
            filteredCases,
            logCases,
            filteredLogCases,
            paginatedCases,
            currentPage,
            pageSize,
            currentPage1,
            pageSize1,
            logSettings,
            logLevel,
            activeStep,

            showToast,
            autoSave,
            statusType,
            addTestCase,
            editTestCase,
            deleteTestCase,
            runTestCase,
            clearLogs,
            handleRowClick,
            handlePageChange,
            handlePageChange1
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
</style>