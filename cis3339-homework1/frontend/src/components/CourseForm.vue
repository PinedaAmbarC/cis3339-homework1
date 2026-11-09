<script setup>
import { reactive, ref } from 'vue'
import FormField from './FormField.vue'
import { useCoursesStore } from '@/stores/courses'

const store = useCoursesStore()
const form = reactive({ courseId: '', name: '' })
const errors = ref({})

function validate() {
  const e = {}
  if (!form.courseId.trim()) e.courseId = 'Course ID is required'
  if (!form.name.trim()) e.name = 'Course name is required'
  errors.value = e
  return Object.keys(e).length === 0
}

async function submit() {
  if (!validate()) return
  const ok = await store.addCourse({ ...form })
  if (ok) {
    Object.assign(form, { courseId: '', name: '' })
    errors.value = {}
  }
}
</script>

<template>
  <form class="card form-grid" novalidate @submit.prevent="submit">
    <h2>Add a course</h2>
    <FormField id="course-id" v-model="form.courseId" label="Course ID" :error="errors.courseId" />
    <FormField id="course-name" v-model="form.name" label="Course name" :error="errors.name" />
    <button type="submit" :disabled="store.loading">Add course</button>
  </form>
</template>