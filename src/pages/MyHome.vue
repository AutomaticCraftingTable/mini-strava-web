<script setup lang="ts">
import { onMounted } from 'vue'
import { useAdmin } from '$src/composables/useAdmin'
import { formatDistance } from '$src/utils/formatters'

const {
  adminStats,
  isLoading,
  loadAdminStats,
} = useAdmin()

onMounted(async () => {
  await loadAdminStats()
})
</script>

<template>
  <div class="p-8 min-h-[calc(100vh-80px)] animated-gradient">
    <!-- Decorative elements -->
    <div class="fixed top-40 right-20 w-64 h-64 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 float" />

    <div
      class="fixed bottom-40 left-20 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 float"
      style="animation-delay: -3s;"
    />

    <div class="relative z-10">
      <div class="mb-10">
        <h1 class="text-5xl font-extrabold mb-3 text-white drop-shadow-lg">
          Panel Administratora
        </h1>

        <p class="text-xl text-white/80">
          Przegląd statystyk systemu MiniStrava
        </p>
      </div>

      <div
        v-if="isLoading"
        class="mb-4 p-12 text-center glass rounded-3xl"
      >
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white/30 border-t-white" />

        <p class="mt-6 text-white/80 text-lg">
          Ładowanie danych...
        </p>
      </div>

      <div
        v-if="adminStats"
        class="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <!-- Users Card -->
        <div class="glass p-8 rounded-3xl hover-lift cursor-pointer group">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-base font-bold uppercase tracking-wider text-white/80">
              Użytkownicy
            </h3>

            <div class="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
              <span class="text-3xl">
                👥
              </span>
            </div>
          </div>

          <p class="text-6xl font-black text-white mb-2">
            {{ adminStats.users_number }}
          </p>

          <p class="text-sm text-white/60">
            Zarejestrowanych użytkowników
          </p>

          <div class="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <div class="h-full gradient-primary rounded-full w-3/4 shimmer" />
          </div>
        </div>

        <!-- Activities Card -->
        <div class="glass p-8 rounded-3xl hover-lift cursor-pointer group">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-base font-bold uppercase tracking-wider text-white/80">
              Aktywności
            </h3>

            <div
              class="w-14 h-14 rounded-2xl gradient-secondary flex items-center justify-center group-hover:scale-110 transition-transform"
              style="box-shadow: 0 0 40px rgba(255, 149, 0, 0.4);"
            >
              <span class="text-3xl">
                🏃
              </span>
            </div>
          </div>

          <p class="text-6xl font-black text-white mb-2">
            {{ adminStats.activities_number }}
          </p>

          <p class="text-sm text-white/60">
            Wszystkich aktywności
          </p>

          <div class="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <div class="h-full gradient-secondary rounded-full w-1/2 shimmer" />
          </div>
        </div>

        <!-- Distance Card -->
        <div class="glass p-8 rounded-3xl hover-lift cursor-pointer group">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-base font-bold uppercase tracking-wider text-white/80">
              Łączny Dystans
            </h3>

            <div class="w-14 h-14 rounded-2xl gradient-accent flex items-center justify-center shadow-glow-accent group-hover:scale-110 transition-transform">
              <span class="text-3xl">
                📏
              </span>
            </div>
          </div>

          <p class="text-6xl font-black text-white mb-2">
            {{ formatDistance(adminStats.distance_summary) }}
          </p>

          <p class="text-sm text-white/60">
            Łączny przebyty dystans
          </p>

          <div class="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <div class="h-full gradient-accent rounded-full w-2/3 shimmer" />
          </div>
        </div>
      </div>

      <div
        v-else-if="!isLoading"
        class="text-center py-16 glass rounded-3xl"
      >
        <span class="text-6xl mb-4 block">
          📊
        </span>

        <p class="text-white/80 text-lg">
          Brak danych statystycznych
        </p>
      </div>
    </div>
  </div>
</template>
