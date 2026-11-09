import { ref } from 'vue'
import { defineStore } from 'pinia'
import { http } from '@/api/http'
import { useStatus } from '@/composables/useStatus'

export const useStudentsStore = defineStore('students', () => {
  const students = ref([])
  const searchTerm = ref('')
  const { loading, error, success, run } = useStatus()

  const fetchStudents = (term = searchTerm.value) =>
    run(async () => {
      searchTerm.value = term
      students.value = await http.get(`/students?search=${encodeURIComponent(term)}`)
    })

  const addStudent = (student) =>
    run(async () => {
      await http.post('/students', student)
      students.value = await http.get(`/students?search=${encodeURIComponent(searchTerm.value)}`)
    }, `Added ${student.name}`)

  async function deleteStudent(student) {
    let message = ''
    const ok = await run(async () => {
      const result = await http.delete(`/students/${student._id}`)
      students.value = students.value.filter((s) => s._id !== student._id)
      message = `Deleted ${student.name} (${result.enrollmentsRemoved} enrollment(s) removed)`
    })
    if (ok) success.value = message
    return ok
  }

  return { students, searchTerm, loading, error, success, fetchStudents, addStudent, deleteStudent }
})