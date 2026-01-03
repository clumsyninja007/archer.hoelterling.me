<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import EditDialog from './EditDialog.vue'
import type { ContentType } from '@/types/editing'

interface Props {
  contentType: ContentType
  currentValue: {
    en: string
    de: string
  }
  label: string
  mutationFn: (payload: { en: string; de: string }) => Promise<void>
}

defineProps<Props>()

const { isAdmin } = useAuth()
const isDialogVisible = ref(false)

const openDialog = () => {
  isDialogVisible.value = true
}

const closeDialog = () => {
  isDialogVisible.value = false
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    openDialog()
  }
}
</script>

<template>
  <div
    v-if="isAdmin"
    class="relative group cursor-pointer"
    role="button"
    tabindex="0"
    :aria-label="`Edit ${label}`"
    @click="openDialog"
    @keydown="handleKeydown"
  >
    <!-- Hover border and edit icon -->
    <div
      class="absolute inset-0 border-2 border-transparent group-hover:border-cyan-500 dark:group-hover:border-cyan-400 rounded-lg pointer-events-none transition-colors"
    />
    <div
      class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-cyan-500 dark:bg-cyan-400 text-white rounded-full p-2 pointer-events-none"
    >
      <i class="pi pi-pencil text-sm"></i>
    </div>

    <!-- Content slot -->
    <slot />

    <!-- Edit Dialog -->
    <EditDialog
      v-model:visible="isDialogVisible"
      :label="label"
      :content-type="contentType"
      :current-value="currentValue"
      :mutation-fn="mutationFn"
      @close="closeDialog"
    />
  </div>

  <!-- Non-admin view - just show content without wrapper -->
  <div v-else>
    <slot />
  </div>
</template>