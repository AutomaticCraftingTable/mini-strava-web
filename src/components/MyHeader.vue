<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '$src/composables/useAuth'

const { adminLogout } = useAuth()
const router = useRouter()
const route = useRoute()
const isButtonHovered = ref(false)

const handleLogout = () => {
  adminLogout()
  router.push('/')
}

const isActive = (path: string) => route.path === path
</script>

<template>
  <header class="px-6 py-4 flex justify-between items-center glass-dark sticky top-0 z-50">
    <div class="flex items-center gap-8">
      <router-link
        to="/"
        class="flex items-center gap-3 text-2xl font-bold transition-all duration-300 hover:scale-105"
        style="text-decoration: none;"
      >
        <div class="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
          <span class="text-xl">
            🏃
          </span>
        </div>

        <span class="text-gradient font-extrabold">
          MiniStrava
        </span>
      </router-link>

      <nav class="flex gap-2">
        <router-link
          to="/"
          class="px-5 py-2.5 rounded-xl transition-all duration-300 font-medium hover-scale"
          :class="{
            'gradient-primary text-white shadow-glow': isActive('/'),
            'text-white/70 hover:text-white hover:bg-white/10': !isActive('/')
          }"
        >
          <span class="flex items-center gap-2">
            <span>📊</span>

            Dashboard
          </span>
        </router-link>

        <router-link
          to="/users"
          class="px-5 py-2.5 rounded-xl transition-all duration-300 font-medium hover-scale"
          :class="{
            'gradient-secondary text-white': isActive('/users'),
            'text-white/70 hover:text-white hover:bg-white/10': !isActive('/users')
          }"
          :style="isActive('/users') ? 'box-shadow: 0 0 40px rgba(255, 149, 0, 0.4);' : ''"
        >
          <span class="flex items-center gap-2">
            <span>👥</span>

            Użytkownicy
          </span>
        </router-link>

        <router-link
          to="/activities"
          class="px-5 py-2.5 rounded-xl transition-all duration-300 font-medium hover-scale"
          :class="{
            'gradient-accent text-white shadow-glow-accent': isActive('/activities'),
            'text-white/70 hover:text-white hover:bg-white/10': !isActive('/activities')
          }"
        >
          <span class="flex items-center gap-2">
            <span>🏃</span>

            Aktywności
          </span>
        </router-link>
      </nav>
    </div>

    <button
      type="button"
      class="px-5 py-2.5 rounded-xl transition-all duration-300 font-semibold btn-modern"
      :class="{
        'bg-red-500/80 hover:bg-red-500': !isButtonHovered,
        'bg-red-600 shadow-lg': isButtonHovered
      }"
      style="color: white;"
      @mouseenter="isButtonHovered = true"
      @mouseleave="isButtonHovered = false"
      @click="handleLogout"
    >
      <span class="flex items-center gap-2">
        <span>🚪</span>

        Wyloguj
      </span>
    </button>
  </header>
</template>
