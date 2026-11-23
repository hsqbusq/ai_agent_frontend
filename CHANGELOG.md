# ai_agent_frontend 变更记录

> 仓库：https://gitlab.desaysv.com/ic_dqm/ptv1_3/ptv1_3_2/ai_agent/ai_agent_frontend
> 分支：dev/hsq
> 本地开发目录：`D:\uid02897\Desktop\project\ai_agent\ai_agent_frontend-master`
>
> 本文档记录每个版本（commit）的修改内容、问题归因、影响范围，便于回溯与维护。

## 记录模板

每条记录按以下格式填写：

```markdown
## [commit 短哈希] 一句话标题（日期）

- **变更文件**：文件名 + 改动概述
- **修改原因**：（bug 修复 / 新功能 / 性能优化 / 重构）
- **问题归因**：源代码历史遗留 / 本次维护引入 / 第三方依赖 / 环境配置
- **触发条件**：什么场景下会出现问题
- **影响范围**：受影响的页面 / 功能 / 组件
- **验证方式**：如何确认修复有效
- **发布状态**：已推送 gitlab/GitHub / 已发布服务器 / 未发布
```

---

## 压测多轮截图入报告（2026-11-23）

- **变更文件**：`src/utils/report-zip.js`
  - 截图收集：含 `StressResults` 的用例按每遍 testid 各拉一份截图（任务展开为 [用例, testid, 轮次] 列表，并发 4 不变）；非压测用例维持单 Testid 单轮
  - 目录结构：压测用例 `截图/{caseKey}/第N遍/{nn}.{ext}` 每轮独立子目录；单轮用例保持 `截图/{caseKey}/` 旧结构（向后兼容）
  - 图册页：多轮时按"第N遍 · X 张"分区块（round-head 标题样式），头部显示"N 轮 · 共 X 张"
  - 总览页封面：取最新一轮第一张图，计数显示"N 轮 X 张"
  - Excel 超链接文案：多轮显示"打开图册（N 轮 X 张）"
- **修改原因**：新需求——压测报告需呈现每一轮的执行截图（此前只保留最后一遍 Testid 的截图）
- **问题归因**：新功能（压测截图留存）
- **触发条件**：压测后导出报告(含截图)
- **影响范围**：仅含压测数据的导出；普通导出结构不变
- **验证方式**：路径拼接逻辑自检（多轮/单轮/封面三种场景正确）；npm run build 通过。待用户实跑压测导出验证
- **发布状态**：本地提交待推送；未发布服务器

---

## 7880e61 feat: 压测用例功能 + 压测汇总/导出配套修复（2026-11-23）

（历史压缩提交，合并了 88b8df5/d140f81/ec537de/d1f2819/b2319ae/9a556a9 六个提交）

- **变更文件**：
  - `src/views/Test.vue`：
    - 压测功能：多选用例 + 指定遍数（1-50），"遍优先"调度（全部用例完成一遍再下一遍），行级 `StressResults[{round,result,testid}]` 保留每遍明细，实时进度条/中途停止/汇总弹窗
    - 汇总弹窗"各遍结果"徽标：nowrap + margin 间距，整枚换行（注：不能对该列 .cell 设 overflow:visible——会破坏 el-table 列宽测量致末行被裁，曾引入后回退）
    - 压测第一遍结果丢失修复：轮询内 `fetchTestList(1)` 会把刚写回的 Result 覆盖回空值，改为直接取 `runTestCase` resolve 的 `data.result`
    - `xhr.onload` 加 `testIdFound` 守卫：SSE 流结束不抢先 resolve(null)，避免压测拿到空结果
    - `syncSelectedRowsAll` 用 Map 替代逐 id 全表 find：万级用例全选从 N×M 次比较降为一次建 Map + N 次查表
  - `src/views/report-template.html`：Excel 导出列补压测明细（StressResults key）
  - `src/utils/report-zip.js`：Excel 超链接 `.\图册\xxx.html` 写法（. 前缀强制 Excel 识别为当前目录文件路径）
- **修改原因**：新功能（压测）+ bug 修复×4（汇总徽标折行/第一遍结果丢失/SSE 抢 resolve/万级选择卡顿）
- **问题归因**：新功能 + 本次维护引入的配套问题 + 历史遗留（syncSelectedRowsAll 的 O(N×M) 实现）
- **触发条件**：压测执行与汇总展示；全选用例过万
- **验证方式**：徽标渲染用 Playwright + 同版本 Element Plus 复刻弹窗回归（30 行混 Pass/Fail，1440/960 宽度下零裁切、滚动正常、末行完整）；万级选择在用户 14187 条用例实测不卡
- **发布状态**：已推送 gitlab + GitHub（2026-11-23）；未发布服务器

---

## 0e47c35 feat: 导出报告体系改造——ZIP 分层报告（2026-11-23）

（历史压缩提交，合并了 afed619/1d19bde/1620fbb/7e2dcfb/ed44607/447c8f0/f2efb40/b44d9cd 八个提交）

- **变更文件**：
  - `src/utils/report-zip.js`（新建，核心模块）：
    - ZIP 结构：index.html 轻量截图总览（懒加载+点击缩放）+ 图册/{caseKey}.html 每用例独立页 + 截图/{caseKey}/{nn}.{ext} 原图落盘 + 测试报告_全量.xlsx（ExcelJS 25 列）
    - 截图原图落盘 + 相对路径引用替代 Base64 内嵌（旧方案 5000+ 条导出 OOM/页面无响应）
    - 截图扩展名按文件头魔数判定（RIFF→webp/FFD8→jpg/8950→png/GIF8→gif）——后端截图源文件名 .png 实际是 WebP 内容，画图不支持 WebP 报"无效位图"（blob.type 为空不可靠，两次迭代后改魔数判定）
    - 分阶段进度：单例 ElMessage（duration:0 句柄更新）+ 文本去重，拉图/Excel/打包各阶段百分比只弹一次
    - Excel 实际结果列（第 19 格）放超链接 `打开图册（N 张）`；不含截图的 Excel 补压测明细列
    - 独立 js 模块的原因：Vue SFC 解析器无法容忍模板字符串内 HTML 标签流（Invalid end tag），`</script>` 需拆成 `"</scr"+"ipt>"` 拼接
  - `src/views/Test.vue`：exportTestReport(true) 分流到 exportZipReport，进度回调接单例 toast
- **修改原因**：需求——含截图报告改为 demo_report 形式（原图外置+分层浏览），解决旧方案文件大、图片模糊、打开卡
- **问题归因**：新功能；期间三个子问题（OOM、正/反斜杠超链接被 Office 当未知协议弹窗、WebP 扩展名误判）分别归因于实现缺陷与后端返回格式
- **影响范围**：导出报告(含截图) 全链路；不含截图导出仅补列
- **验证方式**：用户实测 5000+ 条含图导出稳定完成；zip 内截图 .webp 可用浏览器打开；xlsx 链接反斜杠写入验证（Python 读 xlsx rels 218 条）；Excel 超链接弹窗经注册表全链路排查确认为用户系统 file:// 协议项缺失（环境问题，非代码缺陷，用户决定不修）
- **发布状态**：已推送 gitlab + GitHub（2026-11-23）；未发布服务器