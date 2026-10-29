<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">登录</h2>

      <el-form :model="loginForm" @submit.prevent="handleLogin" label-width="0">
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

        <el-form-item>
          <el-autocomplete
            v-model="projectKeyword"
            placeholder="请输入关键字搜索并选择项目"
            size="large"
            style="width: 100%"
            :fetch-suggestions="fetchProjectSuggestions"
            :loading="projectLoading"
            :disabled="!!selectedProject"
            clearable
            @select="handleProjectSelect"
          />
        </el-form-item>

        <div v-if="selectedProject" class="project-picked">
          <el-tag type="success" effect="light">已选项目：{{ selectedProjectLabel }}</el-tag>
          <el-button link type="primary" @click="clearSelectedProject">重新选择</el-button>
        </div>

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
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();
const projectList = ref([]);
const projectKeyword = ref("");
const selectedProject = ref("");
const selectedProjectLabel = ref("");
const projectLoading = ref(false);

const clearSelectedProject = () => {
  selectedProject.value = "";
  selectedProjectLabel.value = "";
  projectKeyword.value = "";
  projectList.value = [];
};

watch(projectKeyword, (val) => {
  if (val !== selectedProjectLabel.value) {
    selectedProject.value = "";
    selectedProjectLabel.value = "";
  }
});

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

// 获取项目列表（按关键字模糊匹配）
const fetchProjects = async (keyword) => {
  const q = (keyword ?? "").trim();
  if (!q) {
    projectList.value = [];
    return true;
  }

  projectLoading.value = true;
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
            value: [q],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("获取项目列表失败");
    }

    const data = await response.json();
    if (data.result && Array.isArray(data.result)) {
      projectList.value = data.result;
      return true;
    }
    return false;
  } catch (error) {
    console.error("获取项目错误:", error);
    ElMessage.error("获取项目列表失败，请稍后重试");
    return false;
  } finally {
    projectLoading.value = false;
  }
};

let projectSearchTimer = null;
const fetchProjectSuggestions = (queryString, cb) => {
  if (projectSearchTimer) window.clearTimeout(projectSearchTimer);
  projectSearchTimer = window.setTimeout(async () => {
    await fetchProjects(queryString);
    cb(
      projectList.value.map((p) => ({
        value: p.label,
        label: p.label,
        projectValue: p.value,
        raw: p,
      }))
    );
  }, 300);
};

const handleProjectSelect = (item) => {
  selectedProject.value = item.projectValue;
  selectedProjectLabel.value = item.label;
  projectKeyword.value = item.label;
};

const handleLogin = async () => {
  if (!loginForm.username.trim() || !loginForm.password.trim()) {
    ElMessage.warning("请输入用户名和密码");
    return;
  }

  if (!selectedProject.value) {
    const keyword = projectKeyword.value.trim();
    if (!keyword) {
      ElMessage.warning("请选择项目");
      return;
    }

    await fetchProjects(keyword);
    const exact = projectList.value.find((p) => p.label === keyword);
    if (exact) {
      selectedProject.value = exact.value;
      selectedProjectLabel.value = exact.label;
    } else {
      ElMessage.warning("请从下拉建议中选择项目");
      return;
    }
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

    const project = projectList.value.find((p) => p.value === selectedProject.value);

    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("currentProjectId", selectedProject.value);
    localStorage.setItem("currentProjectName", selectedProjectLabel.value || project?.label || "");
    localStorage.setItem("currentProject", JSON.stringify(project ?? null));

    ElMessage.success(`欢迎进入项目：${project?.label ?? ""}`);
    router.push("/test");
  } catch (error) {
    ElMessage.error("登录失败，请稍后重试");
  } finally {
    loading.value = false;
  }
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

.project-picked {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 10px 0 6px;
}

</style>
