<script setup>
import { ref } from 'vue'
import { useStudentsStore } from '@/stores/students'
import { useCoursesStore } from '@/stores/courses'
import { useEnrollmentsStore } from '@/stores/enrollments'

const studentsStore = useStudentsStore()
const coursesStore = useCoursesStore()
const enrollmentsStore = useEnrollmentsStore()

const studentId = ref('')
const courseId = ref('')
const formError = ref('')

async function submit() {
  if (!studentId.value || !courseId.value) {
    formError.value = 'Choose both a student and a course'
    return
  }
  formError.value = ''
  const ok = await enrollmentsStore.enroll(studentId.value, courseId.value)
  if (ok) {
    studentId.value = ''
    courseId.value = ''
  }
}
</script>

<template>
  <form class="card form-grid" novalidate @submit.prevent="submit">
    <h2>Enroll a student</h2>

    <div class="field">
      <label for="enroll-student">Student</label>
      <select id="enroll-student" v-model="studentId">
        <option value="" disabled>Select a student</option>
        <option v-for="s in studentsStore.students" :key="s._id" :value="s._id">
          {{ s.name }} ({{ s.studentId }})
        </option>
      </select>
    </div>

    <div class="field">
      <label for="enroll-course">Course</label>
      <select id="enroll-course" v-model="courseId">
        <option value="" disabled>Select a course</option>
        <option v-for="c in coursesStore.courses" :key="c._id" :value="c._id">
          {{ c.courseId }} – {{ c.name }}
        </option>
      </select>
    </div>

    <small v-if="formError" class="field-error">{{ formError }}</small>
    <button type="submit" :disabled="enrollmentsStore.loading">Enroll</button>
  </form>
</template>