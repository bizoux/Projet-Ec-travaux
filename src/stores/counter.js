import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  // équivalent de data()
  state: () => ({
    count: 5,
    message: 'Hello Pinia'
  }),
  
  // équivalent de computed
  getters: {
    doubleCount: (state) => state.count * 2
  },
  
  // équivalent de methods
  actions: {
    increment() {
      this.count++
    },
    setMessage(newMessage) {
      this.message = newMessage
    }
  }
})
