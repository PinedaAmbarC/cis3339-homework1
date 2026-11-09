<script setup>
import { onMounted } from 'vue'
import StatusBanner from '@/components/StatusBanner.vue'
import CourseForm from '@/components/CourseForm.vue'
import CourseTable from '@/components/CourseTable.vue'
import { useCoursesStore } from '@/stores/courses'

const store = useCoursesStore()

onMounted(() => store.fetchCourses())

function confirmDelete(course) {
  const ok = window.confirm(`Delete ${course.courseId}? Its enrollments will be removed too.`)
  if (ok) store.deleteCourse(course)
}
</script>

<template>
  <h1>Courses</h1>

  <CourseForm />

  <section class="card">
    <h2>All courses</h2>

    <StatusBanner :loading="store.loading" :error="store.error" :success="store.success" />

    <CourseTable v-if="store.courses.length" :courses="store.courses" @delete="confirmDelete" />
    <p v-else-if="!store.loading && !store.error" class="empty">No courses yet. Add one above.</p>
  </section>
</template>