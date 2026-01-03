<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useAuth } from '@/composables/useAuth'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import type { ContentType, EditFormData, FieldConfig } from '@/types/editing'

interface Props {
  visible: boolean
  label: string
  contentType: ContentType
  currentValue: {
    en: string
    de: string
  }
  mutationFn: (payload: { en: string; de: string }) => Promise<void>
  fieldConfig?: FieldConfig[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:visible': [value: boolean]
  close: []
}>()

const toast = useToast()
const { refreshToken } = useAuth()

const isLoading = ref(false)
const formData = reactive<EditFormData>({
  en: '',
  de: ''
})

// Initialize form data when dialog opens
watch(
  () => props.visible,
  (newValue) => {
    if (newValue) {
      formData.en = structuredClone(props.currentValue.en)
      formData.de = structuredClone(props.currentValue.de)
    }
  },
  { immediate: true }
)

const closeDialog = () => {
  emit('update:visible', false)
  emit('close')
}

const handleSave = async () => {
  try {
    isLoading.value = true

    // Proactively refresh token before save
    await refreshToken()

    // Call the mutation function with bilingual payload
    await props.mutationFn({
      en: formData.en,
      de: formData.de
    })

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `${props.label} updated successfully`,
      life: 3000
    })

    closeDialog()
  } catch (error: unknown) {
    console.error('Failed to save:', error)

    const errorMessage = error && typeof error === 'object' && 'response' in error
      ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
      : undefined

    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage || `Failed to update ${props.label.toLowerCase()}`,
      life: 5000
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    :header="`Edit ${label}`"
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="flex flex-col gap-6">
      <!-- Bilingual Form Layout -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- English Column -->
        <div class="flex flex-col gap-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            English
          </h3>

          <!-- Dynamic field rendering will go here -->
          <div v-if="contentType === 'text'" class="flex flex-col gap-2">
            <!-- TextField component will be used here -->
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ label }}
            </label>
            <input
              v-model="formData.en"
              type="text"
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div v-else-if="contentType === 'textarea'" class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ label }}
            </label>
            <textarea
              v-model="formData.en"
              rows="4"
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <!-- Placeholder for array and object types -->
          <div v-else class="text-sm text-gray-500 dark:text-gray-400">
            Field type "{{ contentType }}" not yet implemented
          </div>
        </div>

        <!-- German Column -->
        <div class="flex flex-col gap-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Deutsch
          </h3>

          <!-- Dynamic field rendering will go here -->
          <div v-if="contentType === 'text'" class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ label }}
            </label>
            <input
              v-model="formData.de"
              type="text"
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div v-else-if="contentType === 'textarea'" class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ label }}
            </label>
            <textarea
              v-model="formData.de"
              rows="4"
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <!-- Placeholder for array and object types -->
          <div v-else class="text-sm text-gray-500 dark:text-gray-400">
            Field type "{{ contentType }}" not yet implemented
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button
          label="Cancel"
          severity="secondary"
          @click="closeDialog"
          :disabled="isLoading"
        />
        <Button
          label="Save"
          @click="handleSave"
          :loading="isLoading"
        />
      </div>
    </template>
  </Dialog>
</template>