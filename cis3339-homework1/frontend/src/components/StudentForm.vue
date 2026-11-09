<script setup>
import { reactive, ref } from 'vue'
import FormField from './FormField.vue'
import { useStudentsStore } from '@/stores/students'

const store = useStudentsStore()
const form = reactive({ name: '', studentId: '', phone: '', zip: '' })
const errors = ref({})

function validate() {
  const e = {}
  if (!form.name.trim()) e.name = 'Name is required'
  if (!form.studentId.trim()) e.studentId = 'Student ID is required'
  if (!form.phone.trim()) e.phone = 'Phone is required'
  if (!/^\d{5}(-\d{4})?$/.test(form.zip.trim())) e.zip = 'ZIP must be 5 digits (or ZIP+4)'
  errors.value = e
  return Object.keys(e).length === 0
}

async function submit() {
  if (!validate()) return
  const ok = await store.addStudent({ ...form })
  if (ok) {
    Object.assign(form, { name: '', studentId: '', phone: '', zip: '' })
    errors.value = {}
  }
}
</script>

<template>
  <form class="card form-grid" novalidate @submit.prevent="submit">
    <h2>Add a student</h2>
    <FormField id="student-name" v-model="form.name" label="Name" :error="errors.name" />
    <FormField id="student-id" v-model="form.studentId" label="Student ID" :error="errors.studentId" />
    <FormField id="student-phone" v-model="form.phone" label="Phone" type="tel" :error="errors.phone" />
    <FormField id="student-zip" v-model="form.zip" label="ZIP code" inputmode="numeric" :error="errors.zip" />
    <button type="submit" :disabled="store.loading">Add student</button>
  </form>
</template>