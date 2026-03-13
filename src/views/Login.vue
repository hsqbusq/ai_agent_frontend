<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">{{ step === "login" ? "登录" : "选择项目" }}</h2>

      <!-- 第一步：登录表单 -->
      <el-form
        v-if="step === 'login'"
        :model="loginForm"
        @submit.prevent="handleLogin"
        label-width="0"
      >
        <el-form-item>
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            size="large"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            size="large"
            clearable
            show-password
          />
        </el-form-item>
        <el-button
          type="primary"
          size="large"
          native-type="submit"
          class="login-btn"
          :loading="loading"
        >
          登录
        </el-button>
      </el-form>

      <!-- 第二步：选择项目 -->
      <div v-else-if="step === 'selectProject'">
        <el-alert
          title="请选择要进入的项目"
          type="info"
          :closable="false"
          style="margin-bottom: 16px"
        />
        <el-select
          v-model="selectedProject"
          placeholder="请选择项目"
          size="large"
          style="width: 100%; margin-bottom: 16px"
          filterable
        >
          <el-option
            v-for="project in projectList"
            :key="project.id"
            :label="project.label"
            :value="project.id"
          />
        </el-select>
        <div class="project-actions">
          <el-button size="large" @click="step = 'login'">返回</el-button>
          <el-button
            type="primary"
            size="large"
            @click="confirmProject"
            :loading="loading"
            :disabled="!selectedProject"
          >
            确认进入
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();
const step = ref("login"); // 'login' | 'selectProject'
const projectList = ref([]);
const selectedProject = ref("");

const loginForm = reactive({
  username: "",
  password: "",
});

const loading = ref(false);

// 验证用户是否存在（完善后的逻辑）
const verifyUser = async (inputUsername) => {
  // 密码默认值
  const DEFAULT_PASSWORD = "123456";

  // 先验证密码是否为默认值（暂时逻辑）
  if (loginForm.password !== DEFAULT_PASSWORD) return null;

  try {
    const response = await fetch("/dev-api/icdqm/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conjunction: "and",
        conditions: [
          {
            fieldName: "nickName",
            operator: "LIKE",
            value: [inputUsername],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("验证用户失败");
    }

    const data = await response.json();

    // 1. 检查返回结果是否有效
    if (!data.result || !Array.isArray(data.result) || data.result.length === 0)
      return null;

    // 2. 精确匹配用户名：支持两种匹配方式
    // - 完全匹配 nickName（如 "刘玉明(uidp11036)"）
    // - 匹配 nickName 中的 userId 部分（如输入 "uidp11036" 也能匹配）
    const matchedUser = data.result.find((user) => {
      // 情况1：输入的用户名完全等于 nickName
      const exactMatch = user.nickName === inputUsername;

      // 情况2：从 nickName 中提取 userId 进行匹配（如 "刘玉明(uidp11036)" 提取 "uidp11036"）
      const userIdMatch =
        user.nickName?.includes(`(${inputUsername})`) || user.userName === inputUsername;

      return exactMatch || userIdMatch;
    });

    return matchedUser ?? null;
  } catch (error) {
    console.error("验证用户错误:", error);
    return null;
  }
};

// 获取项目列表
const fetchProjects = async () => {
  try {
    const response = await fetch("/dev-api/icdqm/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conjunction: "and",
        conditions: [
          {
            fieldName: "projectName",
            operator: "LIKE",
            value: ["测试"],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("获取项目列表失败");
    }

    const data = await response.json();
    if (data.result && Array.isArray(data.result)) {
      projectList.value = data.result.map((p) => {
        const projectUuid = p.id;
        const id = p.value ?? projectUuid ?? p.projectId ?? p.projectCode ?? p.projectName ?? p.name;
        const label = p.label ?? p.projectName ?? p.name ?? p.projectCode ?? String(id ?? "");
        return {
          ...p,
          projectUuid,
          id,
          label,
        };
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error("获取项目错误:", error);
    ElMessage.error("获取项目列表失败，请稍后重试");
    return false;
  }
};

const handleLogin = async () => {
  if (!loginForm.username.trim() || !loginForm.password.trim()) {
    ElMessage.warning("请输入用户名和密码");
    return;
  }

  loading.value = true;

  try {
    // 验证用户是否存在（包含密码验证）
    const userInfo = await verifyUser(loginForm.username);

    if (!userInfo) {
      ElMessage.error("用户名或密码错误");
      loading.value = false;
      return;
    }

    localStorage.setItem("currentUserInfo", JSON.stringify(userInfo));
    localStorage.setItem("currentUser", userInfo.userName ?? loginForm.username);

    // 获取项目列表
    const success = await fetchProjects();
    if (success && projectList.value.length > 0) {
      step.value = "selectProject";
      ElMessage.success("验证成功，请选择项目");
    } else {
      ElMessage.warning("暂无可用项目，请联系管理员");
    }
  } catch (error) {
    ElMessage.error("登录失败，请稍后重试");
  } finally {
    loading.value = false;
  }
};

const confirmProject = () => {
  if (!selectedProject.value) {
    ElMessage.warning("请选择一个项目");
    return;
  }

  loading.value = true;

  setTimeout(() => {
    const project = projectList.value.find((p) => p.id === selectedProject.value);

    // 保存登录信息和项目信息
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("currentProjectId", selectedProject.value);
    localStorage.setItem("currentProjectName", project ? project.label : "");
    localStorage.setItem("currentProject", JSON.stringify(project ?? null));

    ElMessage.success(`欢迎进入项目：${project ? project.label : ""}`);
    router.push("/test");

    loading.value = false;
  }, 500);
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
}

.login-card {
  width: 520px;
  padding: 48px 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.login-title {
  text-align: center;
  margin-bottom: 24px;
  color: #1e4976;
  font-size: 24px;
  font-weight: 500;
}

.login-btn {
  width: 100%;
  margin-top: 8px;
}

.project-actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.project-actions .el-button {
  flex: 1;
}
</style>
