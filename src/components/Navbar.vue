<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import Button from 'primevue/button'
import { usePersonalInfo } from '@/composables/usePersonalInfo'

const { data } = usePersonalInfo()

const isDark = ref<boolean>(false)
const isMobileMenuOpen = ref<boolean>(false)

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

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <header class="border-b border-surface-300 dark:border-surface-700 bg-surface-100 dark:bg-surface-900 text-surface-900 dark:text-surface-50">
    <nav class="max-w-7xl mx-auto px-6 py-4" aria-label="Main navigation">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="pi pi-briefcase text-blue-500 text-2xl" aria-hidden="true"></i>
          <span class="text-xl font-bold">{{ data?.name || 'John Doe' }}</span>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-8">
          <router-link to="/" class="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Home</router-link>
          <a href="/#projects" class="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Projects</a>
          <router-link to="/resume" class="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Resume</router-link>
          <a href="/#contact" class="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Contact</a>

          <div class="flex items-center gap-2 ml-4">
            <Button label="EN" severity="info" size="small" text aria-label="Switch to English" />
            <Button label="DE" severity="secondary" size="small" text aria-label="Switch to German" />
            <Button
              :icon="isDark ? 'pi pi-moon' : 'pi pi-sun'"
              severity="secondary"
              size="small"
              text
              @click="toggleTheme"
              :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            />
            <Button icon="pi pi-code" severity="secondary" size="small" text aria-label="View source code" />
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
            :icon="isMobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'"
            severity="secondary"
            size="small"
            text
            @click="toggleMobileMenu"
            :aria-label="isMobileMenuOpen ? 'Close menu' : 'Open menu'"
            :aria-expanded="isMobileMenuOpen"
            aria-controls="mobile-menu"
          />
        </div>
      </div>

    </nav>

    <!-- Mobile Menu Overlay -->
    <Transition name="mobile-menu">
      <div
        v-show="isMobileMenuOpen"
        id="mobile-menu"
        class="md:hidden fixed inset-x-0 top-[73px] bg-surface-100 dark:bg-surface-900 border-b border-surface-300 dark:border-surface-700 shadow-lg z-50"
      >
        <div class="max-w-7xl mx-auto px-6 py-6 space-y-4">
          <router-link
            to="/"
            class="block py-2 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            @click="closeMobileMenu"
          >
            Home
          </router-link>
          <a
            href="/#projects"
            class="block py-2 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            @click="closeMobileMenu"
          >
            Projects
          </a>
          <router-link
            to="/resume"
            class="block py-2 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            @click="closeMobileMenu"
          >
            Resume
          </router-link>
          <a
            href="/#contact"
            class="block py-2 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            @click="closeMobileMenu"
          >
            Contact
          </a>

          <div class="flex items-center gap-2 pt-4 border-t border-surface-300 dark:border-surface-700">
            <Button label="EN" severity="info" size="small" text aria-label="Switch to English" />
            <Button label="DE" severity="secondary" size="small" text aria-label="Switch to German" />
            <Button icon="pi pi-code" severity="secondary" size="small" text aria-label="View source code" />
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
a {
  text-decoration: none;
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

.mobile-menu-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.mobile-menu-enter-to {
  transform: translateY(0);
  opacity: 1;
}

.mobile-menu-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.mobile-menu-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>