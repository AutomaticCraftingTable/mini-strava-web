<script setup lang="ts">
import { useNotifications } from '$src/composables/useNotifications'

const { notifications, removeNotification } = useNotifications()

const getNotificationStyle = (type: string) => {
  const styles: Record<string, {
    bg: string
    text: string
    border: string
  }> = {
    error: {
      bg: '#fee',
      text: '#c33',
      border: '#c33',
    },
    success: {
      bg: '#efe',
      text: '#3c3',
      border: '#3c3',
    },
    info: {
      bg: '#eef',
      text: '#33c',
      border: '#33c',
    },
    warning: {
      bg: '#ffe',
      text: '#cc3',
      border: '#cc3',
    },
  }
  return styles[type] ?? styles.error
}
</script>

<template>
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <transition-group tag="div">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="p-4 rounded-lg shadow-lg min-w-[300px] max-w-[400px] flex items-start justify-between gap-4"
        :style="{
          backgroundColor: getNotificationStyle(notification.type).bg,
          color: getNotificationStyle(notification.type).text,
          border: `1px solid ${getNotificationStyle(notification.type).border}`,
        }"
      >
        <p class="flex-1">
          {{ notification.message }}
        </p>

        <button
          type="button"
          class="flex-shrink-0 text-lg font-bold hover:opacity-70 transition-opacity"
          :style="{ color: getNotificationStyle(notification.type).text }"
          @click="removeNotification(notification.id)"
        >
          ×
        </button>
      </div>
    </transition-group>
  </div>
</template>
