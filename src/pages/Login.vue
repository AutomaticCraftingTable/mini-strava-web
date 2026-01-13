<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from '$src/composables/useAuth'

const { login } = useAuth()
const router = useRouter()

const handleLogin = () => {
  login()
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">
        Zaloguj się
      </h2>
      
      <button
        type="button"
        class="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded transition-colors font-semibold"
        @click="handleLogin"
      >
        Zaloguj
      </button>
    </div>
  </div>
</template>
