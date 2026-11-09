<script setup>
import { onMounted, ref, watch } from 'vue'
import StatusBanner from '@/components/StatusBanner.vue'
import EnrollmentForm from '@/components/EnrollmentForm.vue'
import EnrollmentTable from '@/components/EnrollmentTable.vue'
import StudentTable from '@/components/StudentTable.vue'
import { useStudentsStore } from '@/stores/students'
import { useCoursesStore } from '@/stores/courses'
import { useEnrollmentsStore } from '@/stores/enrollments'

const studentsStore = useStudentsStore()
const coursesStore = useCoursesStore()
const store = useEnrollmentsStore()

const rosterCourseId = ref('')

onMounted(() => {
  store.clearRoster()
  studentsStore.fetchStudents('')
  coursesStore.fetchCourses()
  store.fetchEnrollments()
})

watch(rosterCourseId, (id) => {
  if (id) store.fetchRoster(id)
  else store.clearRoster()
})
</script>

<template>
  <h1>Enrollments</h1>

  <EnrollmentForm />

  <StatusBanner :loading="store.loading" :error="store.error" :success="store.success" />
  <StatusBanner :error="studentsStore.error || coursesStore.error" />

  <section class="card">
    <h2>All enrollments</h2>
    <EnrollmentTable v-if="store.enrollments.length" :enrollments="store.enrollments" />
    <p v-else-if="!store.loading && !store.error" class="empty">No enrollments yet. Enroll a student above.</p>
  </section>

  <section class="card">
    <h2>Students in a course</h2>
    <div class="field">
      <label for="roster-course">Course</label>
      <select id="roster-course" v-model="rosterCourseId">
        <option value="">Select a course</option>
        <option v-for="c in coursesStore.courses" :key="c._id" :value="c._id">
          {{ c.courseId }} – {{ c.name }}
        </option>
      </select>
    </div>

    <template v-if="store.roster">
      <StudentTable v-if="store.roster.students.length" :students="store.roster.students" />
      <p v-else class="empty">No students are enrolled in {{ store.roster.course.courseId }} yet.</p>
    </template>
  </section>
</template>