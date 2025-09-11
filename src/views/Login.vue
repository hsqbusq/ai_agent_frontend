<template>
    <div class="login-container">
        <div class="login-card">
            <h2 class="login-title">登录</h2>
            <el-form :model="loginForm" @submit.prevent="handleLogin" label-width="0">
                <el-form-item>
                    <el-input v-model="loginForm.username" placeholder="用户名" size="large" clearable />
                </el-form-item>
                <el-form-item>
                    <el-input v-model="loginForm.password" type="password" placeholder="密码" size="large" clearable
                        show-password />
                </el-form-item>
                <el-button type="primary" size="large" native-type="submit" class="login-btn" :loading="loading">
                    登录
                </el-button>
            </el-form>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter();
const loginForm = reactive({
    username: '',
    password: ''
});

const loading = ref(false);

const handleLogin = () => {
    if (!loginForm.username.trim() || !loginForm.password.trim()) {
        ElMessage.warning('请输入用户名和密码');
        return;
    }
    loading.value = true;
    setTimeout(() => {
        loading.value = false;
        if (loginForm.username === 'admin' && loginForm.password === '123456') {
            ElMessage.success('登录成功');
            localStorage.setItem('isAuthenticated', 'true');
            router.push('/test');
        } else {
            ElMessage.error('用户名或密码错误');
        }
    }, 800);
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
</style>