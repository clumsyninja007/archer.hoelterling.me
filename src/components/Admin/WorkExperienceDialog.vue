<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useAuth } from '@/composables/useAuth'
import { useCreateWorkExperience } from '@/composables/mutations/useCreateWorkExperience'
import { useUpdateWorkExperience } from '@/composables/mutations/useUpdateWorkExperience'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import DatePicker from 'primevue/datepicker'

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

const newSkillEn = ref('')
const newSkillDe = ref('')
const editingSkillIndex = ref<{ lang: 'en' | 'de'; index: number } | null>(null)
const editingSkillValue = ref('')

const addSkill = (lang: 'en' | 'de') => {
  const skill = lang === 'en' ? newSkillEn.value : newSkillDe.value
  if (!skill.trim()) return

  const skills = lang === 'en' ? formData.en.skills : formData.de.skills
  skills.push(skill.trim())

  if (lang === 'en') {
    newSkillEn.value = ''
  } else {
    newSkillDe.value = ''
  }
}

const removeSkill = (index: number, lang: 'en' | 'de') => {
  const skills = lang === 'en' ? formData.en.skills : formData.de.skills
  skills.splice(index, 1)
}

const moveSkillUp = (index: number, lang: 'en' | 'de') => {
  if (index === 0) return
  const skills = lang === 'en' ? formData.en.skills : formData.de.skills
  const temp = skills[index]!
  skills[index] = skills[index - 1]!
  skills[index - 1] = temp
}

const moveSkillDown = (index: number, lang: 'en' | 'de') => {
  const skills = lang === 'en' ? formData.en.skills : formData.de.skills
  if (index === skills.length - 1) return
  const temp = skills[index]!
  skills[index] = skills[index + 1]!
  skills[index + 1] = temp
}

const startEditingSkill = (index: number, lang: 'en' | 'de') => {
  const skills = lang === 'en' ? formData.en.skills : formData.de.skills
  editingSkillIndex.value = { lang, index }
  editingSkillValue.value = skills[index]!
}

const saveEditingSkill = () => {
  if (!editingSkillIndex.value || !editingSkillValue.value.trim()) {
    cancelEditingSkill()
    return
  }

  const { lang, index } = editingSkillIndex.value
  const skills = lang === 'en' ? formData.en.skills : formData.de.skills
  skills[index] = editingSkillValue.value.trim()
  cancelEditingSkill()
}

const cancelEditingSkill = () => {
  editingSkillIndex.value = null
  editingSkillValue.value = ''
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
            <div class="flex flex-col gap-2">
              <div
                v-for="(skill, index) in formData.en.skills"
                :key="index"
                class="flex items-center gap-2 p-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
              >
                <Textarea
                  v-if="editingSkillIndex?.lang === 'en' && editingSkillIndex?.index === index"
                  v-model="editingSkillValue"
                  class="flex-1"
                  rows="3"
                  autoResize
                  @keyup.enter.exact="saveEditingSkill"
                  @keyup.escape="cancelEditingSkill"
                  @blur="saveEditingSkill"
                  autofocus
                />
                <span
                  v-else
                  class="flex-1 text-sm cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                  @click="startEditingSkill(index, 'en')"
                  title="Click to edit"
                >{{ skill }}</span>
                <div class="flex gap-1">
                  <Button
                    icon="pi pi-arrow-up"
                    @click="moveSkillUp(index, 'en')"
                    size="small"
                    text
                    rounded
                    :disabled="index === 0"
                    aria-label="Move up"
                  />
                  <Button
                    icon="pi pi-arrow-down"
                    @click="moveSkillDown(index, 'en')"
                    size="small"
                    text
                    rounded
                    :disabled="index === formData.en.skills.length - 1"
                    aria-label="Move down"
                  />
                  <Button
                    icon="pi pi-times"
                    @click="removeSkill(index, 'en')"
                    size="small"
                    severity="danger"
                    text
                    rounded
                    aria-label="Remove"
                  />
                </div>
              </div>
              <div class="flex gap-2">
                <Textarea
                  v-model="newSkillEn"
                  placeholder="Add skill"
                  class="flex-1"
                  rows="3"
                  autoResize
                  @keyup.enter.exact="addSkill('en')"
                />
                <Button
                  icon="pi pi-plus"
                  @click="addSkill('en')"
                  size="small"
                  aria-label="Add skill"
                />
              </div>
            </div>
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
            <div class="flex flex-col gap-2">
              <div
                v-for="(skill, index) in formData.de.skills"
                :key="index"
                class="flex items-center gap-2 p-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
              >
                <Textarea
                  v-if="editingSkillIndex?.lang === 'de' && editingSkillIndex?.index === index"
                  v-model="editingSkillValue"
                  class="flex-1"
                  rows="3"
                  autoResize
                  @keyup.enter.exact="saveEditingSkill"
                  @keyup.escape="cancelEditingSkill"
                  @blur="saveEditingSkill"
                  autofocus
                />
                <span
                  v-else
                  class="flex-1 text-sm cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                  @click="startEditingSkill(index, 'de')"
                  title="Zum Bearbeiten klicken"
                >{{ skill }}</span>
                <div class="flex gap-1">
                  <Button
                    icon="pi pi-arrow-up"
                    @click="moveSkillUp(index, 'de')"
                    size="small"
                    text
                    rounded
                    :disabled="index === 0"
                    aria-label="Nach oben"
                  />
                  <Button
                    icon="pi pi-arrow-down"
                    @click="moveSkillDown(index, 'de')"
                    size="small"
                    text
                    rounded
                    :disabled="index === formData.de.skills.length - 1"
                    aria-label="Nach unten"
                  />
                  <Button
                    icon="pi pi-times"
                    @click="removeSkill(index, 'de')"
                    size="small"
                    severity="danger"
                    text
                    rounded
                    aria-label="Entfernen"
                  />
                </div>
              </div>
              <div class="flex gap-2">
                <Textarea
                  v-model="newSkillDe"
                  placeholder="Fähigkeit hinzufügen"
                  class="flex-1"
                  rows="3"
                  autoResize
                  @keyup.enter.exact="addSkill('de')"
                />
                <Button
                  icon="pi pi-plus"
                  @click="addSkill('de')"
                  size="small"
                  aria-label="Hinzufügen"
                />
              </div>
            </div>
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
