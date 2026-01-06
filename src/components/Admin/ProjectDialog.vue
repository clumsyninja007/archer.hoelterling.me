<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useAuth } from '@/composables/useAuth'
import { useCreateProject } from '@/composables/mutations/useCreateProject'
import { useUpdateProject } from '@/composables/mutations/useUpdateProject'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import InputNumber from 'primevue/inputnumber'
import BilingualSkillsEditor from './BilingualSkillsEditor.vue'

interface ProjectData {
  title: string
  description: string
  longDescription: string
  technologies: string[]
  imageUrl?: string
  liveUrl?: string
  demoUrl?: string
  githubUrl?: string
  displayOrder: number
}

interface Props {
  visible: boolean
  projectId?: number
  initialData?: {
    en: ProjectData
    de: ProjectData
  }
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:visible': [value: boolean]
  close: []
}>()

const toast = useToast()
const { refreshToken } = useAuth()
const { mutateAsync: createProject } = useCreateProject()
const { mutateAsync: updateProject } = useUpdateProject()

const isLoading = ref(false)
const isEditMode = ref(false)

const formData = reactive<{
  en: ProjectData
  de: ProjectData
}>({
  en: {
    title: '',
    description: '',
    longDescription: '',
    technologies: [],
    imageUrl: '',
    liveUrl: '',
    demoUrl: '',
    githubUrl: '',
    displayOrder: 0
  },
  de: {
    title: '',
    description: '',
    longDescription: '',
    technologies: [],
    imageUrl: '',
    liveUrl: '',
    demoUrl: '',
    githubUrl: '',
    displayOrder: 0
  }
})

// Initialize form data when dialog opens
watch(
  () => props.visible,
  (newValue) => {
    if (newValue) {
      isEditMode.value = !!props.projectId
      if (props.initialData) {
        // Create plain copies to avoid proxy cloning issues
        formData.en = {
          ...props.initialData.en,
          technologies: [...props.initialData.en.technologies]
        }
        formData.de = {
          ...props.initialData.de,
          technologies: [...props.initialData.de.technologies]
        }
      } else {
        // Reset form for create mode
        formData.en = {
          title: '',
          description: '',
          longDescription: '',
          technologies: [],
          imageUrl: '',
          liveUrl: '',
          demoUrl: '',
          githubUrl: '',
          displayOrder: 0
        }
        formData.de = {
          title: '',
          description: '',
          longDescription: '',
          technologies: [],
          imageUrl: '',
          liveUrl: '',
          demoUrl: '',
          githubUrl: '',
          displayOrder: 0
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
    if (!formData.en.title || !formData.en.description || !formData.en.longDescription) {
      toast.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields (Title, Description, Long Description)',
        life: 5000
      })
      return
    }

    // Validate that German doesn't have more technologies than English
    if (formData.de.technologies.length > formData.en.technologies.length) {
      toast.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: `German cannot have more technologies (${formData.de.technologies.length}) than English (${formData.en.technologies.length}). Remove extra German technologies or add more English technologies.`,
        life: 7000
      })
      return
    }

    // Proactively refresh token before save
    await refreshToken()

    const payload = {
      en: {
        title: formData.en.title,
        description: formData.en.description,
        longDescription: formData.en.longDescription,
        technologies: formData.en.technologies,
        imageUrl: formData.en.imageUrl || undefined,
        liveUrl: formData.en.liveUrl || undefined,
        demoUrl: formData.en.demoUrl || undefined,
        githubUrl: formData.en.githubUrl || undefined,
        displayOrder: formData.en.displayOrder
      },
      de: {
        title: formData.de.title,
        description: formData.de.description,
        longDescription: formData.de.longDescription,
        technologies: formData.de.technologies,
        imageUrl: formData.de.imageUrl || undefined,
        liveUrl: formData.de.liveUrl || undefined,
        demoUrl: formData.de.demoUrl || undefined,
        githubUrl: formData.de.githubUrl || undefined,
        displayOrder: formData.de.displayOrder
      }
    }

    if (isEditMode.value && props.projectId) {
      await updateProject({ id: props.projectId, ...payload })
    } else {
      await createProject(payload)
    }

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `Project ${isEditMode.value ? 'updated' : 'created'} successfully`,
      life: 3000
    })

    closeDialog()
  } catch (error: unknown) {
    console.error('Failed to save:', error)

    let errorMessage = `Failed to ${isEditMode.value ? 'update' : 'create'} project`

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
    :header="isEditMode ? 'Edit Project' : 'Add Project'"
    :style="{ width: '70rem' }"
    :breakpoints="{ '1199px': '90vw', '575px': '95vw' }"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="flex flex-col gap-6">
      <!-- Header Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          English
        </h3>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Deutsch
        </h3>
      </div>

      <!-- Title Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div class="flex flex-col gap-2 min-w-0">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Title <span class="text-red-500">*</span>
          </label>
          <InputText v-model="formData.en.title" placeholder="My Awesome Project" />
        </div>
        <div class="flex flex-col gap-2 min-w-0">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Titel <span class="text-red-500">*</span>
          </label>
          <InputText v-model="formData.de.title" placeholder="Mein tolles Projekt" />
        </div>
      </div>

      <!-- Description Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div class="flex flex-col gap-2 min-w-0">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Description <span class="text-red-500">*</span>
          </label>
          <Textarea v-model="formData.en.description" placeholder="Short description" rows="3" autoResize />
        </div>
        <div class="flex flex-col gap-2 min-w-0">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Beschreibung <span class="text-red-500">*</span>
          </label>
          <Textarea v-model="formData.de.description" placeholder="Kurze Beschreibung" rows="3" autoResize />
        </div>
      </div>

      <!-- Long Description Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div class="flex flex-col gap-2 min-w-0">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Long Description <span class="text-red-500">*</span>
          </label>
          <Textarea v-model="formData.en.longDescription" placeholder="Detailed description" rows="5" autoResize />
        </div>
        <div class="flex flex-col gap-2 min-w-0">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Lange Beschreibung <span class="text-red-500">*</span>
          </label>
          <Textarea v-model="formData.de.longDescription" placeholder="Detaillierte Beschreibung" rows="5" autoResize />
        </div>
      </div>

      <!-- Image URL Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div class="flex flex-col gap-2 min-w-0">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Image URL
          </label>
          <InputText v-model="formData.en.imageUrl" placeholder="https://example.com/image.png" />
        </div>
        <div class="flex flex-col gap-2 min-w-0">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Bild-URL
          </label>
          <InputText v-model="formData.de.imageUrl" placeholder="https://example.com/image.png" />
        </div>
      </div>

      <!-- Live Site URL Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div class="flex flex-col gap-2 min-w-0">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Live Site URL
          </label>
          <InputText v-model="formData.en.liveUrl" placeholder="https://example.com" />
        </div>
        <div class="flex flex-col gap-2 min-w-0">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Live-Site-URL
          </label>
          <InputText v-model="formData.de.liveUrl" placeholder="https://example.com" />
        </div>
      </div>

      <!-- Demo URL Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div class="flex flex-col gap-2 min-w-0">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Demo URL
          </label>
          <InputText v-model="formData.en.demoUrl" placeholder="https://demo.example.com" />
        </div>
        <div class="flex flex-col gap-2 min-w-0">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Demo-URL
          </label>
          <InputText v-model="formData.de.demoUrl" placeholder="https://demo.example.com" />
        </div>
      </div>

      <!-- GitHub URL Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div class="flex flex-col gap-2 min-w-0">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            GitHub URL
          </label>
          <InputText v-model="formData.en.githubUrl" placeholder="https://github.com/user/repo" />
        </div>
        <div class="flex flex-col gap-2 min-w-0">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            GitHub-URL
          </label>
          <InputText v-model="formData.de.githubUrl" placeholder="https://github.com/user/repo" />
        </div>
      </div>

      <!-- Display Order Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div class="flex flex-col gap-2 min-w-0">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Display Order
          </label>
          <InputNumber v-model="formData.en.displayOrder" :min="0" />
        </div>
        <div class="flex flex-col gap-2 min-w-0">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Anzeigereihenfolge
          </label>
          <InputNumber v-model="formData.de.displayOrder" :min="0" />
        </div>
      </div>

      <!-- Technologies Section (Bilingual, Paired) -->
      <BilingualSkillsEditor
        v-model:en-skills="formData.en.technologies"
        v-model:de-skills="formData.de.technologies"
        header-en="Technologies"
        header-de="Technologien"
      />
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
:deep(.p-inputnumber) {
  width: 100%;
}
</style>
