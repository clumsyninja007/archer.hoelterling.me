<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import ProjectCard from './ProjectCard.vue'
import ProjectDialog from '@/components/Admin/ProjectDialog.vue'
import { useProjects } from '@/composables/useProjects'
import { useProjectsBilingual } from '@/composables/useProjectsBilingual'
import { useDeleteProject } from '@/composables/mutations/useDeleteProject'
import { useAuth } from '@/composables/useAuth'
import Button from 'primevue/button'
import ConfirmPopup from 'primevue/confirmpopup'
import { useConfirm } from 'primevue/useconfirm'
import type { Project } from '@/composables/useProjects'

const { data: projects, isLoading } = useProjects()
const { data: bilingualProjects } = useProjectsBilingual()
const { mutateAsync: deleteProject } = useDeleteProject()
const { isAdmin } = useAuth()
const toast = useToast()
const confirm = useConfirm()

const isDialogVisible = ref(false)
const editingProject = ref<{ id: number; en: Project; de: Project } | null>(null)

const getZoomClass = (index: number): string => {
  const row = Math.floor(index / 2)
  const col = index % 2
  const isEvenRow = row % 2 === 0

  if (isEvenRow) {
    return col === 0 ? 'zoom-in-75' : 'zoom-in-50'
  } else {
    return col === 0 ? 'zoom-in-50' : 'zoom-in-75'
  }
}

const hasProjects = computed(() => projects.value && projects.value.length > 0)

const openCreateDialog = () => {
  editingProject.value = null
  isDialogVisible.value = true
}

const openEditDialog = (projectId: number) => {
  const enProject = bilingualProjects.value?.en.find(p => p.id === projectId)
  const deProject = bilingualProjects.value?.de.find(p => p.id === projectId)

  if (enProject && deProject) {
    editingProject.value = {
      id: projectId,
      en: enProject,
      de: deProject
    }
    isDialogVisible.value = true
  }
}

const handleDelete = (event: Event, projectId: number, projectTitle: string) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: `Delete "${projectTitle}"?`,
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Delete',
    rejectLabel: 'Cancel',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await deleteProject(projectId)
        toast.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Project deleted successfully',
          life: 3000
        })
      } catch (error) {
        console.error('Failed to delete project:', error)
        toast.add({
          severity: 'error',
          summary: 'Delete Failed',
          detail: 'Failed to delete project',
          life: 5000
        })
      }
    }
  })
}

const closeDialog = () => {
  isDialogVisible.value = false
  editingProject.value = null
}
</script>

<template>
  <section id="projects" class="max-w-7xl mx-auto px-6 py-16">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-3xl font-bold">{{ $t('sections.projects') }}</h2>
      <Button
        v-if="isAdmin"
        icon="pi pi-plus"
        label="Add Project"
        @click="openCreateDialog"
        severity="success"
        size="small"
        aria-label="Add new project"
      />
    </div>

    <!-- Loading skeleton -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="i in 4" :key="i" class="h-[500px] animate-pulse bg-surface-200 dark:bg-surface-700 rounded-lg"></div>
    </div>

    <!-- Projects grid -->
    <div v-else-if="hasProjects" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="(project, index) in projects"
        :key="project.id"
        class="relative group"
        v-animateonscroll.once="{
          enterClass: `animate-enter fade-in-10 ${getZoomClass(index)} animate-duration-1000`
        }"
      >
        <!-- Admin action buttons -->
        <div
          v-if="isAdmin"
          class="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Button
            icon="pi pi-pencil"
            @click="openEditDialog(project.id)"
            severity="info"
            size="small"
            rounded
            aria-label="Edit project"
          />
          <Button
            icon="pi pi-trash"
            @click="(e) => handleDelete(e, project.id, project.title)"
            severity="danger"
            size="small"
            rounded
            aria-label="Delete project"
          />
        </div>

        <ProjectCard
          :title="project.title"
          :description="project.description"
          :long-description="project.longDescription"
          :technologies="project.technologies"
          :image="project.imageUrl || '/projects/placeholder.png'"
          :live-url="project.liveUrl"
          :demo-url="project.demoUrl"
          :github-url="project.githubUrl"
        />
      </div>
    </div>

    <!-- No projects message -->
    <p v-else class="text-center text-surface-600 dark:text-surface-300">
      {{ $t('messages.noProjects') }}
    </p>

    <!-- Project Dialog -->
    <ProjectDialog
      v-model:visible="isDialogVisible"
      :project-id="editingProject?.id"
      :initial-data="editingProject ? {
        en: {
          title: editingProject.en.title,
          description: editingProject.en.description,
          longDescription: editingProject.en.longDescription,
          technologies: editingProject.en.technologies,
          imageUrl: editingProject.en.imageUrl,
          liveUrl: editingProject.en.liveUrl,
          demoUrl: editingProject.en.demoUrl,
          githubUrl: editingProject.en.githubUrl,
          displayOrder: editingProject.en.displayOrder
        },
        de: {
          title: editingProject.de.title,
          description: editingProject.de.description,
          longDescription: editingProject.de.longDescription,
          technologies: editingProject.de.technologies,
          imageUrl: editingProject.de.imageUrl,
          liveUrl: editingProject.de.liveUrl,
          demoUrl: editingProject.de.demoUrl,
          githubUrl: editingProject.de.githubUrl,
          displayOrder: editingProject.de.displayOrder
        }
      } : undefined"
      @close="closeDialog"
    />

    <!-- Confirm Popup -->
    <ConfirmPopup />
  </section>
</template>

<style scoped>
</style>
