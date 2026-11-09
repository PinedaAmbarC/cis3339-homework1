import { ref } from 'vue'

// Tracks loading / error / success state for a store.
// run() returns true if the task worked and false if it threw.
export function useStatus() {
  const loading = ref(false)
  const error = ref('')
  const success = ref('')

  async function run(task, successMessage = '') {
    loading.value = true
    error.value = ''
    success.value = ''
    try {
      await task()
      success.value = successMessage
      return true
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  return { loading, error, success, run }
}