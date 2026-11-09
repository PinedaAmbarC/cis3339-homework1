<script setup>
defineProps({
  courses: { type: Array, required: true },
})
defineEmits(['delete'])
</script>

<template>
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Course ID</th>
          <th>Name</th>
          <th><span class="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="course in courses" :key="course._id">
          <td>{{ course.courseId }}</td>
          <td>{{ course.name }}</td>
          <td>
            <button type="button" class="danger" @click="$emit('delete', course)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>