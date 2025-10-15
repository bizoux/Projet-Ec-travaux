<template>
  <center><div>
    <h3>Child B</h3>
    <p>Valeur : {{ counter.count }}</p>
    <!-- <button @click="counter.increment" class="btn btn-primary">+1</button> -->
  </div>
  </center>
</template>

<script>
import { useCounterStore } from '../stores/counter'

export default {
  name: 'ChildB',
  computed: {
    counter() {
      return useCounterStore()
    }
  }
}
</script>
