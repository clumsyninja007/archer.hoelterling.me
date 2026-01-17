<script setup lang="ts">
export interface WorkExperienceProps {
  id: number;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  skills: string[];
}

const props = defineProps<WorkExperienceProps>();

const formatDate = (value?: string) => {
  if (!value) {
    return 'Present';
  }

  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    year: 'numeric'
  });
}
</script>

<template>
  <div class="mt-2 p-3">
    <h4 class="font-semibold">{{props.title}}</h4>
    <div class="flex justify-between mt-1">
      <div>
        <h5 class="font-light mr-4">{{props.company}}</h5>
        <h6 class="font-light text-sm">{{props.location}}</h6>
      </div>
      <h5 class="font-semibold">{{formatDate(props.startDate)}} - {{formatDate(props.endDate)}}</h5>
    </div>
    <ul class="mt-1 ml-5.5 list-disc">
      <li v-for="skill in props.skills" :key="skill">
        {{skill}}
      </li>
    </ul>
  </div>
</template>

<style scoped>

</style>
