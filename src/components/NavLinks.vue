<script setup lang="ts">
export interface NavLink {
  label: string
  to?: string
  href?: string
}

interface NavLinksProps {
  links: NavLink[]
  orientation?: 'horizontal' | 'vertical'
  onLinkClick?: () => void
}

const props = withDefaults(defineProps<NavLinksProps>(), {
  orientation: 'horizontal'
})
</script>

<template>
  <template v-for="link in props.links" :key="link.label">
    <router-link
      v-if="link.to"
      :to="link.to"
      :class="[
        'transition-colors',
        props.orientation === 'horizontal'
          ? 'hover:text-primary-500 dark:hover:text-primary-400'
          : 'block px-4 py-3 rounded hover:bg-surface-200 dark:hover:bg-surface-800'
      ]"
      @click="props.onLinkClick?.()"
    >
      {{ link.label }}
    </router-link>
    <a
      v-else
      :href="link.href"
      :class="[
        'transition-colors',
        props.orientation === 'horizontal'
          ? 'hover:text-primary-500 dark:hover:text-primary-400'
          : 'block px-4 py-3 rounded hover:bg-surface-200 dark:hover:bg-surface-800'
      ]"
      @click="props.onLinkClick?.()"
    >
      {{ link.label }}
    </a>
  </template>
</template>

<style scoped>
a {
  text-decoration: none;
}
</style>