<script setup>
defineOptions({ inheritAttrs: false })

defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  error: { type: String, default: '' },
})

const model = defineModel({ type: String, default: '' })
</script>

<template>
  <div class="field">
    <label :for="id">{{ label }}</label>
    <input :id="id" v-model="model" :aria-invalid="!!error" v-bind="$attrs" />
    <small v-if="error" class="field-error">{{ error }}</small>
  </div>
</template>