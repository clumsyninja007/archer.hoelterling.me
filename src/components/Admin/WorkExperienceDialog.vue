<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useAuth } from '@/composables/useAuth'
import { useCreateWorkExperience } from '@/composables/mutations/useCreateWorkExperience'
import { useUpdateWorkExperience } from '@/composables/mutations/useUpdateWorkExperience'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import DatePicker from 'primevue/datepicker'
import Chips from 'primevue/chips'

interface WorkExperienceData {
  title: string
  company: string
  location: string
  startDate: Date | null
  endDate: Date | null
  skills: string[]
}

interface Props {
  visible: boolean
  experienceId?: number
  initialData?: {
    en: WorkExperienceData
    de: WorkExperienceData
  }
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:visible': [value: boolean]
  close: []
}>()

const toast = useToast()
const { refreshToken } = useAuth()
const { mutateAsync: createExperience } = useCreateWorkExperience()
const { mutateAsync: updateExperience } = useUpdateWorkExperience()

const isLoading = ref(false)
const isEditMode = ref(false)

const formData = reactive<{
  en: WorkExperienceData
  de: WorkExperienceData
}>({
  en: {
    title: '',
    company: '',
    location: '',
    startDate: null,
    endDate: null,
    skills: []
  },
  de: {
    title: '',
    company: '',
    location: '',
    startDate: null,
    endDate: null,
    skills: []
  }
})

// Initialize form data when dialog opens
watch(
  () => props.visible,
  (newValue) => {
    if (newValue) {
      isEditMode.value = !!props.experienceId
      if (props.initialData) {
        // Create plain copies to avoid proxy cloning issues
        formData.en = {
          ...props.initialData.en,
          skills: [...props.initialData.en.skills]
        }
        formData.de = {
          ...props.initialData.de,
          skills: [...props.initialData.de.skills]
        }
      } else {
        // Reset form for create mode
        formData.en = {
          title: '',
          company: '',
          location: '',
          startDate: null,
          endDate: null,
          skills: []
        }
        formData.de = {
          title: '',
          company: '',
          location: '',
          startDate: null,
          endDate: null,
          skills: []
        }
      }
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

    // Validate required fields
    if (!formData.en.title || !formData.en.company || !formData.en.location) {
      toast.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields (Title, Company, Location)',
        life: 5000
      })
      return
    }

    // Proactively refresh token before save
    await refreshToken()

    const payload = {
      en: {
        title: formData.en.title,
        company: formData.en.company,
        location: formData.en.location,
        startDate: formData.en.startDate?.toISOString() || new Date().toISOString(),
        endDate: formData.en.endDate?.toISOString() || undefined,
        skills: formData.en.skills
      },
      de: {
        title: formData.de.title,
        company: formData.de.company,
        location: formData.de.location,
        startDate: formData.de.startDate?.toISOString() || new Date().toISOString(),
        endDate: formData.de.endDate?.toISOString() || undefined,
        skills: formData.de.skills
      },
      id: props.experienceId
    }

    if (isEditMode.value) {
      await updateExperience(payload)
    } else {
      await createExperience(payload)
    }

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `Work experience ${isEditMode.value ? 'updated' : 'created'} successfully`,
      life: 3000
    })

    closeDialog()
  } catch (error: unknown) {
    console.error('Failed to save:', error)

    let errorMessage = `Failed to ${isEditMode.value ? 'update' : 'create'} work experience`

    if (error && typeof error === 'object') {
      if ('response' in error) {
        const axiosError = error as { response?: { data?: { message?: string; title?: string }; status?: number } }
        errorMessage = axiosError.response?.data?.message
          || axiosError.response?.data?.title
          || `Server error (${axiosError.response?.status || 'unknown'})`
      }
      else if ('message' in error) {
        errorMessage = (error as { message: string }).message
      }
    }

    toast.add({
      severity: 'error',
      summary: 'Save Failed',
      detail: errorMessage,
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
    :header="isEditMode ? 'Edit Work Experience' : 'Add Work Experience'"
    :style="{ width: '60rem' }"
    :breakpoints="{ '1199px': '85vw', '575px': '95vw' }"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="flex flex-col gap-6">
      <!-- Bilingual Form Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- English Column -->
        <div class="flex flex-col gap-4 min-w-0">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            English
          </h3>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Title <span class="text-red-500">*</span>
            </label>
            <InputText v-model="formData.en.title" placeholder="Senior Software Engineer" />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Company <span class="text-red-500">*</span>
            </label>
            <InputText v-model="formData.en.company" placeholder="Tech Corp" />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Location <span class="text-red-500">*</span>
            </label>
            <InputText v-model="formData.en.location" placeholder="San Francisco, CA" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-2 min-w-0">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Start Date
              </label>
              <DatePicker v-model="formData.en.startDate" dateFormat="mm/yy" view="month" class="w-full" />
            </div>

            <div class="flex flex-col gap-2 min-w-0">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                End Date
              </label>
              <DatePicker v-model="formData.en.endDate" dateFormat="mm/yy" view="month" placeholder="Present" class="w-full" />
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Skills
            </label>
            <Chips v-model="formData.en.skills" placeholder="Add skill and press Enter" />
          </div>
        </div>

        <!-- German Column -->
        <div class="flex flex-col gap-4 min-w-0">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Deutsch
          </h3>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Titel <span class="text-red-500">*</span>
            </label>
            <InputText v-model="formData.de.title" placeholder="Senior Software-Ingenieur" />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Firma <span class="text-red-500">*</span>
            </label>
            <InputText v-model="formData.de.company" placeholder="Tech Corp" />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Standort <span class="text-red-500">*</span>
            </label>
            <InputText v-model="formData.de.location" placeholder="San Francisco, CA" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-2 min-w-0">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Startdatum
              </label>
              <DatePicker v-model="formData.de.startDate" dateFormat="mm/yy" view="month" class="w-full" />
            </div>

            <div class="flex flex-col gap-2 min-w-0">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Enddatum
              </label>
              <DatePicker v-model="formData.de.endDate" dateFormat="mm/yy" view="month" placeholder="Heute" class="w-full" />
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Fähigkeiten
            </label>
            <Chips v-model="formData.de.skills" placeholder="Fähigkeit hinzufügen und Enter drücken" />
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
          :label="isEditMode ? 'Save' : 'Create'"
          @click="handleSave"
          :loading="isLoading"
        />
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
:deep(.p-datepicker-input) {
  width: 100%;
}
</style>
