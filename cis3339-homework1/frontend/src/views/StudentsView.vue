<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import StatusBanner from '@/components/StatusBanner.vue'
import StudentForm from '@/components/StudentForm.vue'
import StudentTable from '@/components/StudentTable.vue'
import { useStudentsStore } from '@/stores/students'

const store = useStudentsStore()
const search = ref('')
let timer

onMounted(() => store.fetchStudents(''))
onBeforeUnmount(() => clearTimeout(timer))

// Wait 300ms after the last keystroke before searching
watch(search, (term) => {
  clearTimeout(timer)
  timer = setTimeout(() => store.fetchStudents(term.trim()), 300)
})

function confirmDelete(student) {
  const ok = window.confirm(`Delete ${student.name}? Their enrollments will be removed too.`)
  if (ok) store.deleteStudent(student)
}
</script>

<template>
  <h1>Students</h1>

  <StudentForm />

  <section class="card">
    <div class="section-head">
      <h2>All students</h2>
      <div class="field search">
        <label for="student-search">Search by name or ID</label>
        <input id="student-search" v-model="search" type="search" placeholder="e.g. John or 1001" />
      </div>
    </div>

    <StatusBanner :loading="store.loading" :error="store.error" :success="store.success" />

    <StudentTable v-if="store.students.length" :students="store.students" deletable @delete="confirmDelete" />
    <p v-else-if="!store.loading && !store.error" class="empty">
      {{ store.searchTerm ? 'No students match your search.' : 'No students yet. Add one above.' }}
    </p>
  </section>
</template>