<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import Skeleton from 'primevue/skeleton'
import NavLinks, { type NavLink } from '@/components/NavLinks.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import { usePersonalInfo } from '@/composables/usePersonalInfo'
import { useI18n } from 'vue-i18n'

const { data, isPending, isError } = usePersonalInfo()
const { t } = useI18n()

const isDark = ref<boolean>(false)
const isMobileMenuOpen = ref<boolean>(false)

const navLinks = computed<NavLink[]>(() => [
  { label: t('nav.home'), to: '/' },
  { label: t('nav.projects'), href: '/#projects' },
  { label: t('nav.resume'), to: '/resume' },
  { label: t('nav.contact'), href: '/#contact' }
])

// Initialize theme
onMounted(() => {
  const stored = localStorage.getItem('theme')
  if (stored) {
    isDark.value = stored === 'dark'
  } else {
    // Default to system preference
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  updateTheme()
})

// Watch for changes
watch(isDark, () => {
  updateTheme()
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
})

function updateTheme() {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

const toggleTheme = () => {
  isDark.value = !isDark.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <header class="border-b border-surface-300 dark:border-surface-700 bg-surface-100 dark:bg-surface-900 text-surface-900 dark:text-surface-50 relative z-50">
    <nav class="max-w-7xl mx-auto px-6 py-4" aria-label="Main navigation">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="pi pi-briefcase text-primary-500 text-2xl mr-3" aria-hidden="true"></i>
          <Skeleton v-if="isPending" width="10rem" height="1.75rem" />
          <span v-else-if="isError" class="text-xl font-bold text-red-500" aria-label="Error loading name">
            Error
          </span>
          <span v-else class="text-xl font-bold">{{ data?.name }}</span>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-8">
          <NavLinks :links="navLinks" orientation="horizontal" />

          <div class="flex items-center gap-2 ml-4">
            <LanguageSwitcher />
            <Button
              :icon="isDark ? 'pi pi-moon' : 'pi pi-sun'"
              severity="secondary"
              size="small"
              text
              @click="toggleTheme"
              :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            />
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <div class="flex md:hidden items-center gap-2">
          <Button
            :icon="isDark ? 'pi pi-moon' : 'pi pi-sun'"
            severity="secondary"
            size="small"
            text
            @click="toggleTheme"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          />
          <Button
            icon="pi pi-bars"
            severity="secondary"
            size="small"
            text
            @click="isMobileMenuOpen = true"
            aria-label="Open menu"
          />
        </div>
      </div>
    </nav>

    <!-- Mobile Drawer Menu -->
    <Drawer
      v-model:visible="isMobileMenuOpen"
      position="right"
      class="w-full sm:w-80"
      :pt="{
        root: { class: 'md:hidden' },
        header: { class: 'pb-4' },
        content: { class: 'py-0' }
      }"
    >
      <template #header>
        <div class="flex items-center gap-2">
          <i class="pi pi-briefcase text-primary-500 text-2xl mr-3" aria-hidden="true"></i>
          <Skeleton v-if="isPending" width="10rem" height="1.75rem" />
          <span v-else-if="isError" class="text-xl font-bold text-red-500" aria-label="Error loading name">
            Menu
          </span>
          <span v-else class="text-xl font-bold">{{ data?.name || 'Menu' }}</span>
        </div>
      </template>

      <nav class="flex flex-col gap-1" aria-label="Mobile navigation">
        <NavLinks :links="navLinks" orientation="vertical" :on-link-click="closeMobileMenu" />

        <div class="px-4 py-3 mt-4 border-t border-surface-300 dark:border-surface-700">
          <LanguageSwitcher />
        </div>
      </nav>
    </Drawer>
  </header>
</template>

<style scoped>
a {
  text-decoration: none;
}
</style>
