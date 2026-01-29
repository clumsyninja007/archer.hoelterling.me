<script setup lang="ts">
import { ref, computed } from 'vue'
import WorkExperience, {
  type WorkExperienceProps
} from "@/components/WorkExperience/WorkExperience.vue";
import WorkExperienceSkeleton from "@/components/WorkExperience/WorkExperienceSkeleton.vue";
import WorkExperienceDialog from '@/components/Admin/WorkExperienceDialog.vue'
import { useQuery } from "@tanstack/vue-query";
import { useDeleteWorkExperience } from '@/composables/mutations/useDeleteWorkExperience'
import { useWorkExperiencesBilingual } from '@/composables/useWorkExperiencesBilingual'
import { useAuth } from '@/composables/useAuth'
import { useLanguage } from '@/composables/useLanguage'
import { useToast } from 'primevue/usetoast'
import apiClient from "@/api/http.ts";
import { PERSON_ID } from "@/constants.ts";
import Button from 'primevue/button'

const { isAdmin } = useAuth()
const { language } = useLanguage()
const toast = useToast()
const { mutateAsync: deleteExperience } = useDeleteWorkExperience()

const { data, isLoading } = useQuery<WorkExperienceProps[]>({
  queryKey: ['personal', 'experience', language],
  queryFn: async () => {
    // Language is sent via Accept-Language header in the axios interceptor
    const response = await apiClient.get(`person/${PERSON_ID}/experience`);
    return response.data;
  }
})

// Fetch bilingual data for all work experiences (used for editing)
const { data: bilingualData } = useWorkExperiencesBilingual()

const isDialogVisible = ref(false)
const editingExperienceId = ref<number | null>(null)

// Compute initial data for dialog
const dialogInitialData = computed(() => {
  if (!editingExperienceId.value || !bilingualData.value) {
    return undefined
  }

  // Find the experience in both EN and DE arrays
  const enExperience = bilingualData.value.en.find(exp => exp.id === editingExperienceId.value)
  const deExperience = bilingualData.value.de.find(exp => exp.id === editingExperienceId.value)

  if (!enExperience || !deExperience) {
    return undefined
  }

  return {
    en: {
      title: enExperience.title,
      company: enExperience.company,
      location: enExperience.location,
      startDate: new Date(enExperience.startDate),
      endDate: enExperience.endDate ? new Date(enExperience.endDate) : null,
      skills: enExperience.skills
    },
    de: {
      title: deExperience.title,
      company: deExperience.company,
      location: deExperience.location,
      startDate: new Date(deExperience.startDate),
      endDate: deExperience.endDate ? new Date(deExperience.endDate) : null,
      skills: deExperience.skills
    }
  }
})

const openCreateDialog = () => {
  editingExperienceId.value = null
  isDialogVisible.value = true
}

const openEditDialog = (experience: WorkExperienceProps) => {
  editingExperienceId.value = experience.id
  isDialogVisible.value = true
}

const handleDelete = async (experienceId: number, title: string) => {
  if (!confirm(`Are you sure you want to delete "${title}"?`)) {
    return
  }

  try {
    await deleteExperience(experienceId)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Work experience deleted successfully',
      life: 3000
    })
  } catch (error: unknown) {
    console.error('Failed to delete:', error)
    toast.add({
      severity: 'error',
      summary: 'Delete Failed',
      detail: 'Failed to delete work experience',
      life: 5000
    })
  }
}
</script>

<template>
  <div class="flex justify-between items-center mb-4">
    <h3 class="font-bold">{{ $t('sections.workExperience') }}</h3>
    <Button
      v-if="isAdmin"
      label="Add New"
      icon="pi pi-plus"
      @click="openCreateDialog"
      size="small"
    />
  </div>

  <WorkExperienceSkeleton v-if="isLoading" />
  <template v-else-if="!!data">
    <div
      v-for="experience in data"
      :key="experience.id"
      class="relative rounded-lg transition-all"
      :class="{
        'group': isAdmin,
        'hover:ring-1 hover:ring-gray-600 dark:hover:ring-gray-300': isAdmin
      }"
    >
      <WorkExperience
        :id="experience.id"
        :title="experience.title"
        :company="experience.company"
        :location="experience.location"
        :startDate="experience.startDate"
        :endDate="experience.endDate"
        :skills="experience.skills"
      />

      <!-- Admin action buttons -->
      <div
        v-if="isAdmin"
        class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2"
      >
        <Button
          icon="pi pi-pencil"
          @click="openEditDialog(experience)"
          size="small"
          severity="info"
          rounded
          aria-label="Edit"
        />
        <Button
          icon="pi pi-trash"
          @click="handleDelete(experience.id, experience.title)"
          size="small"
          severity="danger"
          rounded
          aria-label="Delete"
        />
      </div>
    </div>
  </template>
  <p v-else>{{ $t('messages.noExperience') }}</p>

  <!-- Work Experience Dialog -->
  <WorkExperienceDialog
    v-model:visible="isDialogVisible"
    :experience-id="editingExperienceId ?? undefined"
    :initial-data="dialogInitialData"
    @close="isDialogVisible = false"
  />
</template>

<style scoped>

</style>
