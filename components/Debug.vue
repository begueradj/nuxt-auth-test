<template>
  <div style="margin-top: 50px;">
    <div 
      class="clear-btn" 
      @click="clear"><button>CLEAR LOG</button></div>
    <div class="debug">
     
      <div 
        v-for="(msg,index) in status" 
        :key="index" 
        style="margin-bottom: 10px;" 
        v-html="msg"/>
    </div>
  </div>
</template>

<script>
import { EventBus } from '~/event-bus'
import { format } from 'date-fns'
export default {
  data() {
    return {
      status: []
    }
  },
  mounted() {
    EventBus.$on('debug', msg => {
      const now = format(new Date(), 'hh:mm:ss:SS')
      this.status.unshift(`${now}: ${msg}`)
    })
  },
  methods: {
    clear() {
      this.status = []
    }
  }
}
</script>

<style scoped>
.debug {
  border: 1px solid #aaa;
  height: 200px;
  position: fixed;
  bottom: 10px;
  width: 100%;
  background: #ccc;
  padding: 15px 15px;
  font-size: 12px;
  overflow-y: scroll;
}

.clear-btn {
  position: fixed;
  right: 10px;
  bottom: 220px;
}
</style>
