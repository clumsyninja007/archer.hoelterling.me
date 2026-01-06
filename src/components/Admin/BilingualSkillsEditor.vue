<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'

interface Props {
  enSkills: string[]
  deSkills: string[]
  headerEn?: string
  headerDe?: string
}

const props = withDefaults(defineProps<Props>(), {
  headerEn: 'Skills',
  headerDe: 'Fähigkeiten'
})
const emit = defineEmits<{
  'update:enSkills': [value: string[]]
  'update:deSkills': [value: string[]]
}>()

const toast = useToast()

// New skill inputs
const newSkillEn = ref('')
const newSkillDe = ref('')

// Inline editing state
const editingSkillIndex = ref<{ lang: 'en' | 'de'; index: number } | null>(null)
const editingSkillValue = ref('')

// Add a skill pair (both EN and DE at once)
const addSkillPair = () => {
  if (!newSkillEn.value.trim()) {
    toast.add({
      severity: 'warn',
      summary: 'Validation',
      detail: 'English skill is required',
      life: 3000
    })
    return
  }

  const newEnSkills = [...props.enSkills, newSkillEn.value.trim()]
  const newDeSkills = [...props.deSkills, newSkillDe.value.trim() || newSkillEn.value.trim()]

  emit('update:enSkills', newEnSkills)
  emit('update:deSkills', newDeSkills)

  newSkillEn.value = ''
  newSkillDe.value = ''
}

// Remove a skill pair (from both EN and DE)
const removeSkillPair = (index: number) => {
  const newEnSkills = [...props.enSkills]
  const newDeSkills = [...props.deSkills]

  newEnSkills.splice(index, 1)
  newDeSkills.splice(index, 1)

  emit('update:enSkills', newEnSkills)
  emit('update:deSkills', newDeSkills)
}

// Move skill pair up
const moveSkillPairUp = (index: number) => {
  if (index === 0) return

  const newEnSkills = [...props.enSkills]
  const newDeSkills = [...props.deSkills]

  // Swap EN
  const tempEn = newEnSkills[index]!
  newEnSkills[index] = newEnSkills[index - 1]!
  newEnSkills[index - 1] = tempEn

  // Swap DE
  const tempDe = newDeSkills[index]!
  newDeSkills[index] = newDeSkills[index - 1]!
  newDeSkills[index - 1] = tempDe

  emit('update:enSkills', newEnSkills)
  emit('update:deSkills', newDeSkills)
}

// Move skill pair down
const moveSkillPairDown = (index: number) => {
  if (index === props.enSkills.length - 1) return

  const newEnSkills = [...props.enSkills]
  const newDeSkills = [...props.deSkills]

  // Swap EN
  const tempEn = newEnSkills[index]!
  newEnSkills[index] = newEnSkills[index + 1]!
  newEnSkills[index + 1] = tempEn

  // Swap DE
  const tempDe = newDeSkills[index]!
  newDeSkills[index] = newDeSkills[index + 1]!
  newDeSkills[index + 1] = tempDe

  emit('update:enSkills', newEnSkills)
  emit('update:deSkills', newDeSkills)
}

// Start inline editing
const startEditingSkill = (index: number, lang: 'en' | 'de') => {
  const skills = lang === 'en' ? props.enSkills : props.deSkills
  editingSkillIndex.value = { lang, index }
  editingSkillValue.value = skills[index]!
}

// Save inline edit
const saveEditingSkill = () => {
  if (!editingSkillIndex.value || !editingSkillValue.value.trim()) {
    cancelEditingSkill()
    return
  }

  const { lang, index } = editingSkillIndex.value

  if (lang === 'en') {
    const newEnSkills = [...props.enSkills]
    newEnSkills[index] = editingSkillValue.value.trim()
    emit('update:enSkills', newEnSkills)
  } else {
    const newDeSkills = [...props.deSkills]
    newDeSkills[index] = editingSkillValue.value.trim()
    emit('update:deSkills', newDeSkills)
  }

  cancelEditingSkill()
}

// Cancel inline edit
const cancelEditingSkill = () => {
  editingSkillIndex.value = null
  editingSkillValue.value = ''
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <h4 class="text-base font-semibold text-gray-900 dark:text-gray-100">
      {{ headerEn }} / {{ headerDe }}
    </h4>

    <!-- Existing Skills (Paired Display) -->
    <div v-if="enSkills.length > 0" class="flex flex-col gap-2">
      <div
        v-for="(_, index) in enSkills"
        :key="index"
        class="grid grid-cols-2 gap-6 p-3 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
      >
        <!-- English Skill -->
        <div class="flex flex-col gap-1 min-w-0">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">EN</span>
            <div class="flex gap-1">
              <Button
                icon="pi pi-arrow-up"
                @click="moveSkillPairUp(index)"
                size="small"
                text
                rounded
                :disabled="index === 0"
                aria-label="Move up"
              />
              <Button
                icon="pi pi-arrow-down"
                @click="moveSkillPairDown(index)"
                size="small"
                text
                rounded
                :disabled="index === enSkills.length - 1"
                aria-label="Move down"
              />
              <Button
                icon="pi pi-times"
                @click="removeSkillPair(index)"
                size="small"
                severity="danger"
                text
                rounded
                aria-label="Remove"
              />
            </div>
          </div>
          <Textarea
            v-if="editingSkillIndex?.lang === 'en' && editingSkillIndex?.index === index"
            v-model="editingSkillValue"
            class="w-full"
            rows="2"
            autoResize
            @keyup.enter.exact="saveEditingSkill"
            @keyup.escape="cancelEditingSkill"
            @blur="saveEditingSkill"
            autofocus
          />
          <span
            v-else
            class="text-sm cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 whitespace-pre-wrap break-words"
            @click="startEditingSkill(index, 'en')"
            title="Click to edit"
          >{{ enSkills[index] }}</span>
        </div>

        <!-- German Skill -->
        <div class="flex flex-col gap-1 min-w-0">
          <span class="text-xs font-medium text-gray-500 dark:text-gray-400">DE</span>
          <Textarea
            v-if="editingSkillIndex?.lang === 'de' && editingSkillIndex?.index === index"
            v-model="editingSkillValue"
            class="w-full"
            rows="2"
            autoResize
            @keyup.enter.exact="saveEditingSkill"
            @keyup.escape="cancelEditingSkill"
            @blur="saveEditingSkill"
            autofocus
          />
          <span
            v-else
            class="text-sm cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 whitespace-pre-wrap break-words"
            @click="startEditingSkill(index, 'de')"
            title="Zum Bearbeiten klicken"
          >{{ deSkills[index] }}</span>
        </div>
      </div>
    </div>

    <!-- Add New Skill Pair -->
    <div class="p-3 rounded border-2 border-dashed border-gray-300 dark:border-gray-600">
      <div class="grid grid-cols-2 gap-6">
        <!-- English Input -->
        <div class="flex flex-col gap-1 min-w-0">
          <label class="text-xs font-medium text-gray-600 dark:text-gray-400">
            English <span class="text-red-500">*</span>
          </label>
          <Textarea
            v-model="newSkillEn"
            placeholder="Add English skill"
            rows="2"
            autoResize
            @keyup.enter.exact="addSkillPair"
          />
        </div>

        <!-- German Input -->
        <div class="flex flex-col gap-1 min-w-0">
          <label class="text-xs font-medium text-gray-600 dark:text-gray-400">
            Deutsch (optional)
          </label>
          <Textarea
            v-model="newSkillDe"
            placeholder="Deutsche Übersetzung"
            rows="2"
            autoResize
            @keyup.enter.exact="addSkillPair"
          />
        </div>
      </div>

      <!-- Add Button -->
      <div class="mt-3 flex justify-end">
        <Button
          icon="pi pi-plus"
          label="Add Skill"
          @click="addSkillPair"
          size="small"
          aria-label="Add skill pair"
        />
      </div>
    </div>

    <p class="text-xs text-gray-500 dark:text-gray-400">
      Skills are paired by position. If German is left empty, it will default to the English value.
    </p>
  </div>
</template>

<style scoped>
/* Force grid items to align at the top */
:deep(.grid > div) {
  align-self: start;
}

/* Ensure textarea takes full width and aligns at top */
:deep(.p-textarea) {
  width: 100%;
  vertical-align: top;
}
</style>