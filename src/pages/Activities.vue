<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import type { Activity, ActivityType } from '$src/types/Activity'
import Modal from '$src/components/Modal.vue'
import { useData } from '$src/composables/useData'
import {
  getUserFullName,
  formatDistance,
  formatDuration,
  formatDate,
  formatDateTime,
} from '$src/utils/formatters'

const {
  activities,
  isLoading,
  loadActivities,
  totalActivities,
  loadStats,
  deleteActivity,
} = useData()

const searchQuery = ref('')
const selectedActivityType = ref<ActivityType | ''>('')
const selectedDateFrom = ref('')
const selectedDateTo = ref('')
const minDistance = ref<number | ''>('')
const maxDistance = ref<number | ''>('')
const isDeleteConfirmOpen = ref(false)
const activityToDelete = ref<Activity | null>(null)
const selectedActivity = ref<Activity | null>(null)
const isDetailsOpen = ref(false)

onMounted(async () => {
  await Promise.all([loadActivities(), loadStats()])
})

const filteredActivities = computed(() => {
  let filtered = [...activities.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((activity) => {
      const matchesName = getUserFullName(activity.user).toLowerCase().includes(query)
      const matchesTitle = activity.title?.toLowerCase().includes(query) ?? false
      const matchesNote = activity.note?.toLowerCase().includes(query) ?? false
      const matchesId = activity.id.toString().includes(query)
      return matchesName || matchesTitle || matchesNote || matchesId
    })
  }

  if (selectedActivityType.value) {
    filtered = filtered.filter(activity => activity.activity_type === selectedActivityType.value)
  }

  if (selectedDateFrom.value) {
    filtered = filtered.filter(activity => activity.created_at >= selectedDateFrom.value)
  }

  if (selectedDateTo.value) {
    filtered = filtered.filter(activity => activity.created_at <= selectedDateTo.value)
  }

  if (minDistance.value !== '') {
    filtered = filtered.filter(activity => activity.distance >= Number(minDistance.value) * 1000)
  }

  if (maxDistance.value !== '') {
    filtered = filtered.filter(activity => activity.distance <= Number(maxDistance.value) * 1000)
  }

  return filtered
})

const handleDeleteClick = (activity: Activity) => {
  activityToDelete.value = activity
  isDeleteConfirmOpen.value = true
}

const handleDeleteConfirm = async () => {
  if (activityToDelete.value) {
    await deleteActivity(activityToDelete.value.id.toString())
    isDeleteConfirmOpen.value = false
    activityToDelete.value = null
  }
}

const handleDeleteCancel = () => {
  isDeleteConfirmOpen.value = false
  activityToDelete.value = null
}

const getActivityTypeLabel = (type: ActivityType) => {
  const labels: Record<string, string> = {
    run: 'Bieg',
    bicycle: 'Rower',
    walk: 'Spacer',
    swim: 'Pływanie',
    other: 'Inne',
  }
  return labels[type] || type
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedActivityType.value = ''
  selectedDateFrom.value = ''
  selectedDateTo.value = ''
  minDistance.value = ''
  maxDistance.value = ''
}

const openDetails = (activity: Activity) => {
  selectedActivity.value = activity
  isDetailsOpen.value = true
}

const closeDetails = () => {
  isDetailsOpen.value = false
  selectedActivity.value = null
}
</script>

<template>
  <div class="p-8 min-h-[calc(100vh-80px)] animated-gradient">
    <div class="fixed top-40 right-20 w-64 h-64 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 float" />

    <div
      class="fixed bottom-40 left-20 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 float"
      style="animation-delay: -3s;"
    />

    <div class="relative z-10">
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-5xl font-extrabold mb-3 text-white drop-shadow-lg">
            Lista aktywności
          </h1>

          <p class="text-xl text-white/80">
            Zarządzanie aktywnościami użytkowników
          </p>
        </div>

        <div class="glass px-6 py-4 rounded-2xl">
          <p class="text-white/60 text-sm">
            Łącznie aktywności
          </p>

          <p class="text-4xl font-bold text-white">
            {{ totalActivities }}
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


      <div class="glass p-6 rounded-3xl mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label class="block text-sm font-bold uppercase tracking-wider text-white/80 mb-2">
              Wyszukaj
            </label>

            <input
              v-model="searchQuery"
              type="text"
              placeholder="Szukaj po użytkowniku, opisie..."
              class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-200"
            >
          </div>

          <div>
            <label class="block text-sm font-bold uppercase tracking-wider text-white/80 mb-2">
              Typ aktywności
            </label>

            <select
              v-model="selectedActivityType"
              class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-200"
            >
              <option
                value=""
                class="bg-gray-800"
              >
                Wszystkie
              </option>

              <option
                value="run"
                class="bg-gray-800"
              >
                Bieg
              </option>

              <option
                value="bicycle"
                class="bg-gray-800"
              >
                Rower
              </option>

              <option
                value="walk"
                class="bg-gray-800"
              >
                Spacer
              </option>

              <option
                value="swim"
                class="bg-gray-800"
              >
                Pływanie
              </option>

              <option
                value="other"
                class="bg-gray-800"
              >
                Inne
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-bold uppercase tracking-wider text-white/80 mb-2">
              Data od
            </label>

            <input
              v-model="selectedDateFrom"
              type="date"
              class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-200"
            >
          </div>

          <div>
            <label class="block text-sm font-bold uppercase tracking-wider text-white/80 mb-2">
              Data do
            </label>

            <input
              v-model="selectedDateTo"
              type="date"
              class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-200"
            >
          </div>

          <div>
            <label class="block text-sm font-bold uppercase tracking-wider text-white/80 mb-2">
              Długość trasy od (km)
            </label>

            <input
              v-model.number="minDistance"
              type="number"
              min="0"
              step="0.01"
              placeholder="Min"
              class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-200"
            >
          </div>

          <div>
            <label class="block text-sm font-bold uppercase tracking-wider text-white/80 mb-2">
              Długość trasy do (km)
            </label>

            <input
              v-model.number="maxDistance"
              type="number"
              min="0"
              step="0.01"
              placeholder="Max"
              class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-200"
            >
          </div>
        </div>

        <button
          type="button"
          class="px-6 py-3 rounded-xl transition-all duration-200 font-semibold hover-lift bg-white/20 text-white hover:bg-white/30 border border-white/20"
          @click="clearFilters"
        >
          Wyczyść filtry
        </button>
      </div>


      <div class="glass rounded-3xl overflow-hidden">
        <div
          v-if="filteredActivities.length === 0 && !isLoading"
          class="text-center py-16"
        >
          <span class="text-6xl mb-4 block">
            🏃
          </span>

          <p class="text-white/80 text-lg">
            Brak aktywności spełniających kryteria
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
                  Użytkownik
                </th>

                <th class="text-left p-5 font-bold uppercase text-xs tracking-wider text-white">
                  Typ
                </th>

                <th class="text-left p-5 font-bold uppercase text-xs tracking-wider text-white">
                  Dystans
                </th>

                <th class="text-left p-5 font-bold uppercase text-xs tracking-wider text-white">
                  Czas
                </th>

                <th class="text-left p-5 font-bold uppercase text-xs tracking-wider text-white">
                  Data
                </th>

                <th class="text-left p-5 font-bold uppercase text-xs tracking-wider text-white">
                  Opis
                </th>

                <th class="text-left p-5 font-bold uppercase text-xs tracking-wider text-white last:rounded-r-xl">
                  Akcje
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="activity in filteredActivities"
                :key="activity.id"
                class="transition-colors duration-200 hover:bg-white/10 border-b border-white/10"
              >
                <td class="p-4 font-medium text-white">
                  {{ getUserFullName(activity.user) }}
                </td>

                <td class="p-4">
                  <span
                    class="px-3 py-1 rounded-full text-xs font-semibold"
                    :class="{
                      'bg-indigo-100 text-indigo-700': activity.activity_type === 'run',
                      'bg-purple-500 text-white': activity.activity_type === 'bicycle',
                      'bg-orange-100 text-orange-700': activity.activity_type === 'walk',
                      'bg-gray-100 text-gray-700': activity.activity_type === 'other'
                    }"
                  >
                    {{ getActivityTypeLabel(activity.activity_type) }}
                  </span>
                </td>

                <td class="p-4 font-bold text-white">
                  {{ formatDistance(activity.distance) }}
                </td>

                <td class="p-4 text-white/80">
                  {{ formatDuration(activity.time) }}
                </td>

                <td class="p-4 text-white/80">
                  {{ formatDate(activity.created_at) }}
                </td>

                <td class="p-4 text-white/80">
                  {{ activity.note || activity.title || '-' }}
                </td>

                <td class="p-4">
                  <div class="flex gap-2">
                    <button
                      type="button"
                      class="px-4 py-2 rounded-xl transition-all duration-200 text-sm font-semibold hover-lift bg-white/20 text-white hover:bg-white/30 border border-white/20"
                      @click="openDetails(activity)"
                    >
                      Szczegóły
                    </button>

                    <button
                      type="button"
                      class="px-4 py-2 rounded-xl transition-all duration-200 text-sm font-semibold hover-lift gradient-secondary text-white shadow-glow"
                      @click="handleDeleteClick(activity)"
                    >
                      Usuń
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div
      v-if="isDeleteConfirmOpen"
      class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-200"
      @click.self="handleDeleteCancel"
    >
      <div class="glass p-8 rounded-3xl max-w-md w-full mx-4 transform transition-all duration-200">
        <div class="mb-6">
          <h3 class="text-2xl font-bold mb-2 text-white">
            Potwierdź usunięcie
          </h3>

          <p class="text-base text-white/80">
            Czy na pewno chcesz usunąć tę aktywność? Ta operacja jest nieodwracalna.
          </p>
        </div>

        <div class="flex gap-3">
          <button
            type="button"
            class="flex-1 px-6 py-3 rounded-xl transition-all duration-200 font-semibold hover-lift bg-white/20 text-white hover:bg-white/30 border border-white/20"
            @click="handleDeleteCancel"
          >
            Anuluj
          </button>

          <button
            type="button"
            class="flex-1 px-6 py-3 rounded-xl transition-all duration-200 font-semibold hover-lift gradient-secondary text-white shadow-glow"
            @click="handleDeleteConfirm"
          >
            Usuń
          </button>
        </div>
      </div>
    </div>

    <Modal
      :is-open="isDetailsOpen"
      title="Szczegóły aktywności"
      @close="closeDetails"
    >
      <div
        v-if="selectedActivity"
        class="space-y-6"
      >
        <div class="flex items-center gap-4 pb-6 border-b border-gray-200">
          <div class="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-white text-3xl font-bold shadow-glow">
            🏃
          </div>

          <div>
            <p class="text-2xl font-bold text-gray-800">
              {{ selectedActivity.title || 'Aktywność' }}
            </p>

            <div class="flex items-center gap-2 mt-1">
              <span
                class="px-3 py-1 rounded-full text-xs font-semibold"
                :class="{
                  'bg-indigo-100 text-indigo-700': selectedActivity.activity_type === 'run',
                  'bg-purple-500 text-white': selectedActivity.activity_type === 'bicycle',
                  'bg-orange-100 text-orange-700': selectedActivity.activity_type === 'walk',
                  'bg-blue-100 text-blue-700': selectedActivity.activity_type === 'swim',
                  'bg-gray-100 text-gray-700': selectedActivity.activity_type === 'other'
                }"
              >
                {{ getActivityTypeLabel(selectedActivity.activity_type) }}
              </span>

              <span class="text-gray-500">
                • {{ getUserFullName(selectedActivity.user) }}
              </span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 rounded-xl bg-orange-50">
            <label class="block text-xs font-bold text-orange-400 uppercase tracking-wide mb-1">
              ID
            </label>

            <p class="text-lg font-semibold text-gray-800">
              {{ selectedActivity.id }}
            </p>
          </div>

          <div class="p-4 rounded-xl bg-orange-50">
            <label class="block text-xs font-bold text-orange-400 uppercase tracking-wide mb-1">
              Dystans
            </label>

            <p class="text-lg font-semibold text-gray-800">
              {{ formatDistance(selectedActivity.distance) }}
            </p>
          </div>

          <div class="p-4 rounded-xl bg-orange-50">
            <label class="block text-xs font-bold text-orange-400 uppercase tracking-wide mb-1">
              Czas
            </label>

            <p class="text-lg font-semibold text-gray-800">
              {{ formatDuration(selectedActivity.time) }}
            </p>
          </div>

          <div class="p-4 rounded-xl bg-orange-50">
            <label class="block text-xs font-bold text-orange-400 uppercase tracking-wide mb-1">
              Tempo
            </label>

            <p class="text-lg font-semibold text-gray-800">
              {{ selectedActivity.pace }} /km
            </p>
          </div>

          <div class="p-4 rounded-xl bg-orange-50">
            <label class="block text-xs font-bold text-orange-400 uppercase tracking-wide mb-1">
              Prędkość
            </label>

            <p class="text-lg font-semibold text-gray-800">
              {{ selectedActivity.speed }} km/h
            </p>
          </div>

          <div class="p-4 rounded-xl bg-orange-50">
            <label class="block text-xs font-bold text-orange-400 uppercase tracking-wide mb-1">
              Notatka
            </label>

            <p class="text-lg font-semibold text-gray-800">
              {{ selectedActivity.note || '-' }}
            </p>
          </div>

          <div class="p-4 rounded-xl bg-orange-50">
            <label class="block text-xs font-bold text-orange-400 uppercase tracking-wide mb-1">
              Data utworzenia
            </label>

            <p class="text-lg font-semibold text-gray-800">
              {{ formatDateTime(selectedActivity.created_at) }}
            </p>
          </div>

          <div class="p-4 rounded-xl bg-orange-50">
            <label class="block text-xs font-bold text-orange-400 uppercase tracking-wide mb-1">
              Ostatnia aktualizacja
            </label>

            <p class="text-lg font-semibold text-gray-800">
              {{ formatDateTime(selectedActivity.updated_at) }}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>
