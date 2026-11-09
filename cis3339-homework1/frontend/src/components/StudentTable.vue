<script setup>
defineProps({
  students: { type: Array, required: true },
  deletable: { type: Boolean, default: false },
})
defineEmits(['delete'])
</script>

<template>
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Student ID</th>
          <th>Phone</th>
          <th>ZIP</th>
          <th v-if="deletable"><span class="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in students" :key="student._id">
          <td>{{ student.name }}</td>
          <td>{{ student.studentId }}</td>
          <td>{{ student.phone }}</td>
          <td>{{ student.zip }}</td>
          <td v-if="deletable">
            <button type="button" class="danger" @click="$emit('delete', student)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>