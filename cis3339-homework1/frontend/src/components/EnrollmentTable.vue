<script setup>
defineProps({
  enrollments: { type: Array, required: true },
})

const formatDate = (value) => new Date(value).toLocaleDateString()
</script>

<template>
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Student</th>
          <th>Course</th>
          <th>Enrolled on</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="e in enrollments" :key="e._id">
          <td>{{ e.student.name }} ({{ e.student.studentId }})</td>
          <td>{{ e.course.courseId }} – {{ e.course.name }}</td>
          <td>{{ formatDate(e.createdAt) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>