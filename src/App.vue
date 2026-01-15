<script setup lang="ts">
import { onMounted, ref } from 'vue'
import MyHeader from '$src/components/MyHeader.vue'
import Notifications from '$src/components/Notifications.vue'
import { useAuth } from '$src/composables/useAuth'

const { isAdminLoggedIn, checkAdminAuthStatus, adminLogin } = useAuth()

const email = ref('')
const password = ref('')
const isLoggingIn = ref(false)

onMounted(() => {
  checkAdminAuthStatus()
})

const handleLogin = async () => {
  if (email.value && password.value) {
    isLoggingIn.value = true
    const success = await adminLogin(email.value, password.value)
    if (success) {
      email.value = ''
      password.value = ''
    }
    isLoggingIn.value = false
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !isLoggingIn.value) {
    handleLogin()
  }
}
</script>

<template>
  <div
    v-if="!isAdminLoggedIn"
    class="min-h-screen flex items-center justify-center p-4 animated-gradient"
  >
    <div class="fixed top-20 left-20 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-40 float" />

    <div
      class="fixed bottom-20 right-20 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-40 float"
      style="animation-delay: -2s;"
    />

    <div
      class="fixed top-1/2 left-1/3 w-72 h-72 bg-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 float"
      style="animation-delay: -4s;"
    />

    <div class="glass p-10 rounded-3xl shadow-modern-xl w-full max-w-md relative z-10">
      <div class="mb-8 text-center">
        <div class="w-20 h-20 mx-auto mb-6 rounded-2xl gradient-primary flex items-center justify-center shadow-glow pulse-glow">
          <span class="text-4xl">
            🏃
          </span>
        </div>

        <h2 class="text-3xl font-bold mb-2 text-white">
          Panel Administratora
        </h2>

        <p class="text-sm text-white opacity-80">
          MiniStrava - zaloguj się aby kontynuować
        </p>
      </div>

      <form
        class="space-y-5"
        @submit.prevent="handleLogin"
      >
        <div>
          <label
            for="email"
            class="block text-sm font-semibold mb-2 text-white opacity-90"
          >
            Email
          </label>

          <input
            id="email"
            v-model="email"
            type="email"
            required
            autocomplete="email"
            class="w-full px-4 py-3.5 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 glass-white"
            style="border: 2px solid rgba(255,255,255,0.3); color: #1a1a2e;"
            placeholder="twoj@email.com"
            @keydown="handleKeyDown"
          >
        </div>

        <div>
          <label
            for="password"
            class="block text-sm font-semibold mb-2 text-white opacity-90"
          >
            Hasło
          </label>

          <input
            id="password"
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            class="w-full px-4 py-3.5 rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 glass-white"
            style="border: 2px solid rgba(255,255,255,0.3); color: #1a1a2e;"
            placeholder="Wprowadź hasło"
            @keydown="handleKeyDown"
          >
        </div>

        <button
          type="submit"
          class="w-full px-4 py-4 rounded-xl transition-all duration-300 font-bold text-lg btn-modern btn-primary mt-6"
          :disabled="isLoggingIn"
          :class="{ 'opacity-60 cursor-not-allowed': isLoggingIn }"
        >
          <span
            v-if="isLoggingIn"
            class="inline-flex items-center gap-2"
          >
            <svg
              class="animate-spin h-5 w-5"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
                fill="none"
              />

              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Logowanie...
          </span>

          <span v-else>
            Zaloguj się
          </span>
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-xs text-white opacity-60">
          © 2026 MiniStrava. Wszelkie prawa zastrzeżone.
        </p>
      </div>
    </div>
  </div>

  <div
    v-else
    class="min-h-screen"
  >
    <MyHeader />

    <router-view />
  </div>

  <Notifications />
</template>
