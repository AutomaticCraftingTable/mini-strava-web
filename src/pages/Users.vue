<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { User } from '$src/types/User'
import Modal from '$src/components/Modal.vue'
import { useData } from '$src/composables/useData'
import {
  getUserFullName,
  formatDate,
  formatDateTime,
} from '$src/utils/formatters'

const { users, isLoading, loadUsers } = useData()

const selectedUser = ref<User | null>(null)
const isDetailsOpen = ref(false)

onMounted(async () => {
  await loadUsers()
})

const openDetails = (user: User) => {
  selectedUser.value = user
  isDetailsOpen.value = true
}

const closeDetails = () => {
  isDetailsOpen.value = false
  selectedUser.value = null
}
</script>

<template>
  <div class="p-8 min-h-[calc(100vh-80px)] animated-gradient">
    <!-- Decorative elements -->
    <div
      class="fixed top-40 right-10 w-48 h-48 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 float"
      style="animation-delay: -2s;"
    />

    <div class="fixed bottom-20 left-40 w-56 h-56 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 float" />

    <div class="relative z-10">
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-5xl font-extrabold mb-3 text-white drop-shadow-lg">
            Lista użytkowników
          </h1>

          <p class="text-xl text-white/80">
            Zarządzanie użytkownikami systemu
          </p>
        </div>

        <div class="glass px-6 py-4 rounded-2xl">
          <p class="text-white/60 text-sm">
            Łącznie użytkowników
          </p>

          <p class="text-4xl font-bold text-white">
            {{ users.length }}
          </p>
        </div>
      </div>

      <div
        v-if="isLoading"
        class="mb-6 p-12 text-center glass rounded-3xl"
      >
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white/30 border-t-white" />

        <p class="mt-6 text-white/80 text-lg">
          Ładowanie danych...
        </p>
      </div>

      <div class="glass rounded-3xl overflow-hidden">
        <div
          v-if="users.length === 0 && !isLoading"
          class="text-center py-16"
        >
          <span class="text-6xl mb-4 block">
            👥
          </span>

          <p class="text-xl text-white/80">
            Brak użytkowników
          </p>
        </div>

        <div
          v-else
          class="overflow-x-auto"
        >
          <table class="w-full">
            <thead>
              <tr class="gradient-primary">
                <th class="text-left p-5 font-bold uppercase text-xs tracking-wider text-white">
                  Email
                </th>

                <th class="text-left p-5 font-bold uppercase text-xs tracking-wider text-white">
                  Imię i nazwisko
                </th>

                <th class="text-left p-5 font-bold uppercase text-xs tracking-wider text-white">
                  Data utworzenia
                </th>

                <th class="text-left p-5 font-bold uppercase text-xs tracking-wider text-white">
                  Akcje
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="user in users"
                :key="user.id"
                class="transition-all duration-300 hover:bg-white/10 border-b border-white/10 group"
              >
                <td class="p-5 font-medium text-white">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
                      {{ user.email.charAt(0).toUpperCase() }}
                    </div>

                    {{ user.email }}
                  </div>
                </td>

                <td class="p-5 text-white/90">
                  {{ getUserFullName(user) }}
                </td>

                <td class="p-5 text-white/70">
                  {{ formatDate(user.created_at) }}
                </td>

                <td class="p-5">
                  <button
                    type="button"
                    class="px-5 py-2.5 rounded-xl transition-all duration-300 text-sm font-semibold btn-modern gradient-secondary text-white opacity-80 group-hover:opacity-100"
                    @click="openDetails(user)"
                  >
                    <span class="flex items-center gap-2">
                      <span>👁️</span>

                      Szczegóły
                    </span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <Modal
      :is-open="isDetailsOpen"
      title="Szczegóły użytkownika"
      @close="closeDetails"
    >
      <div
        v-if="selectedUser"
        class="space-y-6"
      >
        <!-- User header -->
        <div class="flex items-center gap-4 pb-6 border-b border-gray-200">
          <div class="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-white text-2xl font-bold shadow-glow">
            {{ selectedUser.email.charAt(0).toUpperCase() }}
          </div>

          <div>
            <p class="text-2xl font-bold text-gray-800">
              {{ getUserFullName(selectedUser) }}
            </p>

            <p class="text-gray-500">
              {{ selectedUser.email }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 rounded-xl bg-orange-50">
            <label class="block text-xs font-bold text-orange-400 uppercase tracking-wide mb-1">
              ID
            </label>

            <p class="text-lg font-semibold text-gray-800">
              {{ selectedUser.id }}
            </p>
          </div>

          <div class="p-4 rounded-xl bg-orange-50">
            <label class="block text-xs font-bold text-orange-400 uppercase tracking-wide mb-1">
              Płeć
            </label>

            <p class="text-lg font-semibold text-gray-800 capitalize">
              {{ selectedUser.gender || '-' }}
            </p>
          </div>

          <div class="p-4 rounded-xl bg-orange-50">
            <label class="block text-xs font-bold text-orange-400 uppercase tracking-wide mb-1">
              Data urodzenia
            </label>

            <p class="text-lg font-semibold text-gray-800">
              {{ selectedUser.birthdate ? formatDate(selectedUser.birthdate) : '-' }}
            </p>
          </div>

          <div class="p-4 rounded-xl bg-orange-50">
            <label class="block text-xs font-bold text-orange-400 uppercase tracking-wide mb-1">
              Wzrost
            </label>

            <p class="text-lg font-semibold text-gray-800">
              {{ selectedUser.height ? `${selectedUser.height} cm` : '-' }}
            </p>
          </div>

          <div class="p-4 rounded-xl bg-orange-50">
            <label class="block text-xs font-bold text-orange-400 uppercase tracking-wide mb-1">
              Waga
            </label>

            <p class="text-lg font-semibold text-gray-800">
              {{ selectedUser.weight ? `${selectedUser.weight} kg` : '-' }}
            </p>
          </div>

          <div class="p-4 rounded-xl bg-orange-50">
            <label class="block text-xs font-bold text-orange-400 uppercase tracking-wide mb-1">
              Data utworzenia
            </label>

            <p class="text-lg font-semibold text-gray-800">
              {{ formatDateTime(selectedUser.created_at) }}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>
