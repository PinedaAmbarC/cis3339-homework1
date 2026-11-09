import { ref } from 'vue'
import { defineStore } from 'pinia'
import { http } from '@/api/http'
import { useStatus } from '@/composables/useStatus'

export const useCoursesStore = defineStore('courses', () => {
  const courses = ref([])
  const { loading, error, success, run } = useStatus()

  const fetchCourses = () =>
    run(async () => {
      courses.value = await http.get('/courses')
    })

  const addCourse = (course) =>
    run(async () => {
      await http.post('/courses', course)
      courses.value = await http.get('/courses')
    }, `Added ${course.courseId}`)

  async function deleteCourse(course) {
    let message = ''
    const ok = await run(async () => {
      const result = await http.delete(`/courses/${course._id}`)
      courses.value = courses.value.filter((c) => c._id !== course._id)
      message = `Deleted ${course.courseId} (${result.enrollmentsRemoved} enrollment(s) removed)`
    })
    if (ok) success.value = message
    return ok
  }

  return { courses, loading, error, success, fetchCourses, addCourse, deleteCourse }
})