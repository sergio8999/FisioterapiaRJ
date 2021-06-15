<template>
  <div id="app">
    <TheHeader />
    <router-view />
    <TheFooter />
  </div>
</template>

<script>
/* import { mapState } from 'vuex'; */
import { mapState } from 'vuex';
import TheHeader from './components/TheHeader.vue'
import TheFooter from './components/TheFooter.vue'

export default ({
  name: 'App',
  components:{
    TheHeader,
    TheFooter
  },
  data(){
    return{
      cart:null
    }
  },
  setup() {
      
  },
  mounted(){
    
  
  },
  methods:{
    prueba(){
    
    }
  },
  computed:{
    ...mapState('user',['user'])
  },
  firestore:
  { 
    
  },
})
</script>


<style lang="scss">
  @import "@/scss/app.scss";
  #app {
    min-height: 100vh;
    display: grid;
    grid-template-rows: max-content 1fr max-content; 
  }
</style>
