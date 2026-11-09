import { ref } from 'vue'
import { defineStore } from 'pinia'
import { http } from '@/api/http'
import { useStatus } from '@/composables/useStatus'

export const useEnrollmentsStore = defineStore('enrollments', () => {
  const enrollments = ref([])
  const roster = ref(null) // { course, students } for the selected course
  const { loading, error, success, run } = useStatus()

  async function loadEnrollments() {
    const data = await http.get('/enrollments')
    // Drop any record whose student or course no longer exists
    enrollments.value = data.filter((e) => e.student && e.course)
  }

  const fetchEnrollments = () => run(loadEnrollments)

  const fetchRoster = (courseId) =>
    run(async () => {
      roster.value = await http.get(`/courses/${courseId}/students`)
    })

  const clearRoster = () => {
    roster.value = null
  }

  const enroll = (studentId, courseId) =>
    run(async () => {
      await http.post('/enrollments', { student: studentId, course: courseId })
      await loadEnrollments()
      if (roster.value) {
        roster.value = await http.get(`/courses/${roster.value.course._id}/students`)
      }
    }, 'Student enrolled')

  return { enrollments, roster, loading, error, success, fetchEnrollments, fetchRoster, clearRoster, enroll }
})