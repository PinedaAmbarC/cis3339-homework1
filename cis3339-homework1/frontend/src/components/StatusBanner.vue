<script setup>
defineProps({
  loading: Boolean,
  error: { type: String, default: '' },
  success: { type: String, default: '' },
})
</script>

<template>
  <p v-if="loading" class="banner info" role="status">Loading…</p>
  <p v-else-if="error" class="banner error" role="alert">{{ error }}</p>
  <p v-else-if="success" class="banner success" role="status">{{ success }}</p>
</template>