<template>
  <div>
    <p>Count: {{ counter.count }}</p>
    <p>Double: {{ counter.doubleCount }}</p>
    <p>Message: {{ counter.message }}</p>
    <button @click="counter.increment">Increment</button><br>
    <button @click="changeMessage">Change Message</button>
  </div>
</template>

<script>
import { useCounterStore } from '@/stores/counter'

export default {
  setup() {
    const counter = useCounterStore()

    function changeMessage() {
      counter.setMessage('Nouveau message !')
    }

    return { counter, changeMessage }
  }
}
</script>
