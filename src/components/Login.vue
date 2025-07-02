<template>
  <div class="login-container">
    <form @submit.prevent="login" class="login-form">
      <h2>Iniciar sesión</h2>
      <input v-model="email" type="email" placeholder="Correo electrónico" required />
      <input v-model="password" type="password" placeholder="Contraseña" required />
      <button type="submit" :disabled="loading">Entrar</button>
      <button type="button" class="google-btn" @click="loginWithGoogle" :disabled="loading">
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style="height:18px;vertical-align:middle;margin-right:8px;"> Iniciar sesión con Google
      </button>
      <div v-if="error" class="login-error">{{ error }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../main.js'

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function login() {
  loading.value = true
  error.value = ''
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })
  if (loginError) {
    error.value = 'Usuario o contraseña incorrectos.'
  }
  loading.value = false
}

async function loginWithGoogle() {
  loading.value = true
  error.value = ''
  const { error: loginError } = await supabase.auth.signInWithOAuth({ provider: 'google' })
  if (loginError) error.value = 'Error al iniciar sesión con Google.'
  loading.value = false
}

</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}
.login-form {
  background: #fff;
  padding: 32px 24px;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 270px;
}
.login-form h2 {
  font-size: 1.3rem;
  margin-bottom: 10px;
  text-align: center;
  font-family: 'Work Sans', sans-serif;
}
.login-form input {
  padding: 8px 10px;
  border: 1px solid #d3d3d3;
  border-radius: 6px;
  font-size: 1rem;
  font-family: 'Work Sans', sans-serif;
}
.login-form button {
  background: #43c464;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 0;
  font-size: 1rem;
  font-family: 'Work Sans', sans-serif;
  cursor: pointer;
  transition: background 0.15s;
}
.login-form button:disabled {
  background: #b6e2c8;
  cursor: not-allowed;
}
.google-btn {
  background: #fff;
  color: #222;
  border: 1px solid #d3d3d3;
  border-radius: 6px;
  padding: 7px 0;
  font-size: 1rem;
  font-family: 'Work Sans', sans-serif;
  cursor: pointer;
  transition: background 0.15s, border 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.google-btn:hover {
  background: #f2f2f2;
  border: 1px solid #bbb;
}
.login-error {
  color: #e11d48;
  font-size: 0.92rem;
  text-align: center;
  margin-top: 6px;
}
</style>


