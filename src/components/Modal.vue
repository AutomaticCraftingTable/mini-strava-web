<script setup lang="ts">
defineProps<{
  isOpen: boolean
  title: string
}>()

defineEmits<(e: 'close') => void>()
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 transition-opacity duration-200"
    @click.self="$emit('close')"
  >
    <div
      class="p-8 rounded-2xl shadow-modern-xl w-full max-w-2xl mx-4 transform transition-all duration-200 overflow-y-auto max-h-[90vh]"
      style="background-color: var(--strava-white);"
    >
      <div
        class="flex justify-between items-center mb-6 border-b pb-4"
        style="border-color: var(--strava-gray);"
      >
        <h3
          class="text-2xl font-bold"
          style="color: var(--strava-primary);"
        >
          {{ title }}
        </h3>

        <button
          type="button"
          class="p-2 rounded-full hover:bg-gray-100 transition-colors"
          @click="$emit('close')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      
      <div
        class="text-base"
        style="color: var(--strava-black);"
      >
        <slot />
      </div>

      <div class="mt-8 flex justify-end">
        <button
          type="button"
          class="px-6 py-2 rounded-xl transition-all duration-200 font-semibold shadow-modern hover-lift"
          style="background-color: var(--strava-gray); color: var(--strava-black);"
          @click="$emit('close')"
        >
          Zamknij
        </button>
      </div>
    </div>
  </div>
</template>
