### 1. package.json

**文件路径**: `D:\uid02897\Desktop\project\ai_agent\ai_agent_frontend-master\package.json`

- **name**: `"web-scrcpy"` — 与 vue-desai 同款命名。
- **scripts**: `"dev": "vite"`, `"build": "vite build"`, `"preview": "vite preview"` — 标准 Vite 脚本，与 vue-desai 一致。
- **无 node-sass / node-gyp 依赖**。使用纯 JS 的 `sass ^1.57.1`，Windows 安装无编译风险。Vite 5.x 要求 Node >= 18，建议 Node 18+ 或 20 LTS。

### 2. vite.config.ts — Proxy 配置（关键修改点）

**文件路径**: `D:\uid02897\Desktop\project\ai_agent\ai_agent_frontend-master\vite.config.ts`

```typescript
server: {
    port: 3000,
    proxy: {
      '/dev-api': {
        target: 'http://117.72.163.123:25173',  // ← 必须改为 http://127.0.0.1:8004
        changeOrigin: true,
        rewrite: path => path.replace(/^\/dev-api/, '')
      },
      '/apiB': {
        target: 'http://117.72.163.123:25173',  // ← 同上，需改为 8004
        changeOrigin: true,
        rewrite: path => path.replace(/^\/apiB/, '')
      }
    }
}
```

- `/dev-api` 所有接口（登录、项目列表、test_record、adb/autotest、session、icon、upload、crop_by_semantics、test_logs、test_list、result/\*）统一走 8004 后端。**没有单独的 /record-api 代理规则**——这些路径全部在前缀 `/dev-api` 之后，被同一 proxy 转发。
- 轮询路径如 `/dev-api/result/${test_id}`、`/dev-api/test_list`、`/dev-api/test_logs` 也走同一个 proxy，不额外区分 8004 vs 8005。

### 3. 登录逻辑 + taskBaseUrl（硬编码地址）

**文件路径**: `D:\uid02897\Desktop\project\ai_agent\ai_agent_frontend-master\src\views\Login.vue`

| 行号 | 内容 |
|------|------|
| L101 | `fetch("/dev-api/icdqm/users", { POST ... })` — 用户验证 |
| L159 | `fetch("/dev-api/icdqm/projects", { POST ... })` — 项目列表 |
| L98 | 密码硬编码检查: `if (loginForm.password !== DEFAULT_PASSWORD) return null;`（DEFAULT_PASSWORD = `"123456"`） |

**文件路径**: `D:\uid02897\Desktop\project\ai_agent\ai_agent_frontend-master\src\views\Test.vue`

| 行号 | 变量/内容 | 当前值 | 需要改吗 |
|------|-----------|--------|----------|
| L1622 | `const default_url = ref(...)` | `"http://172.23.96.54:8000"` | **是** → 应改为本地 adb_server 地址（即 `http://127.0.0.1:8891`，因为 8891 跑的是 adb_server_copy） |
| L1623 | `const url = ref(default_url.value)` | 同上 | 同上 |
| L1624 | `const taskBaseUrl` | `"http://127.0.0.1:8000"` | **是** → 指向 SSE client 网关的 8004（若 task-stream 模块在 8004 上暴露了 `/task-stream/tasks` 等端点） |
| L1639/L1773/L1813 | `${taskBaseUrl}/task-stream/tasks`... | 依赖 taskBaseUrl | 同上 |
| L2205 | `url.value + "/adb/getScreenshot"` | 依赖 url | 同 default_url |
| L2424 | `url.value + "/adb/runCmd"` | 依赖 url | 同 default_url |

**结论**: Test.vue 有两处硬编码地址需手动修改：
- `default_url`（L1622）: `http://172.23.96.54:8000` → 本机 adb 服务地址（推测 `http://127.0.0.1:8891`）
- `taskBaseUrl`（L1624）: `http://127.0.0.1:8000` → 推测应改为 `http://127.0.0.1:8004`（SSE client 网关提供 task-stream 端点）

### 4. .env / 环境变量文件

项目中**不存在** `.env`、`.env.development` 或其他环境变量配置文件。所有 API 地址均为硬编码在前端源码中。

### 6. README

**文件路径**: `D:\uid02897\Desktop\project\ai_agent\ai_agent_frontend-master\reame.md`（文件名拼写错误）

内容只有一行 Docker 部署命令：
```
sudo docker run -d -e PROXY_TARGET=http://117.72.163.123:19000 -p 3000:80 vue-desai-ng
```
无本地开发说明。

---

### 总结：能否零配置启动？

**不能直接零配置**，需至少三处修改：

1. **vite.config.ts**：将两处 proxy target `117.72.163.123:25173` 改为 `127.0.0.1:8004`，并确认 8004 的 SSE client 网关确实以 `/dev-api` 前缀路由 icdqm/test_record/adb/ 等接口。
2. **Test.vue L1622**：`default_url` 从 `http://172.23.96.54:8000` 改为本机 adb 服务端口（如 8891）。
3. **Test.vue L1624**：`taskBaseUrl` 从 `http://127.0.0.1:8000` 改为实际运行 task-stream 模块的地址（需确认 8004 是否包含该模块）。
4. **注意**：前端没有 `.env`，无法通过环境变量切换，所有地址必须直接改源码。

确认了两个关键点，对接方案如下：

- **登录没问题**：`/dev-api/icdqm/users` 在 8004 的 sseclient.py:832 有实现（转发到公司 IC_DQM 平台验证）——你的真实账号可直接登录本地前端
- **task-stream 在 mcp-desai 里不存在**（grep 无结果）——那是正式环境独立的任务流服务，本地没有，相关“任务列表”功能会空转，不影响核心的手动用例执行

## 改三处后启动

**① vite.config.ts** — proxy 指向本地 8004（两处 target 都改）：
```ts
target: 'http://127.0.0.1:8004',   // 原来 117.72.163.123:25173，两处都改
```

**② Test.vue L1622 附近** — ADB 服务地址（投屏/截图/adb 命令走这个）：
```ts
const default_url = ref("http://127.0.0.1:8891")   // 原 172.23.96.54:8000，8891 是本地 adb_server_copy
```
（页面上应该也有输入框可以随时改，不一定要改默认值）

**③ Test.vue taskBaseUrl（L1624）**：`http://127.0.0.1:8000` 是任务流服务，本地没有——先不动（或改成 8004 也无妨，轮询会 404 但不报错），“任务列表”功能暂时空着，核心的**用例转换（callApi→8004）和测试执行（/dev-api/chat SSE→8004）不受影响**。

然后：
```powershell
cd D:\uid02897\Desktop\project\ai_agent\ai_agent_frontend-master
npm install
npm run dev     # 端口 3000
```

打开 http://localhost:3000 → 登录页 → 用你的 icdqm 账号（注意 Login.vue L98 有个本地检查：密码必须是 `123456` 才走到后端验证——看下那行逻辑，如果密码写死 123456 就先用 123456 登，用户名用 icdqm 真实用户名）。

登进去后主界面就是手册里说的 Test.vue 全功能：用例表格、A/B/E 转换、SSE 流式执行日志、投屏。此时后端就是你跑通的 8004→8891→台架/检测服务链路——**从浏览器点“运行”就会走和你 run_case.py 完全相同的后端管道**。

先改 ① 起来登录试试，有报错贴过来。
