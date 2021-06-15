<template>

  <section class="error-404">
    <div class="d-flex flex-column justify-content-center align-items-center h-100">
      <h1>Página no encontrada</h1>
      <p>Parece que siguió un enlace roto o ingresó una URL que no existe en este sitio.</p>
      <router-link to="/" class="d-flex flex-column align-items-center mt-3">Volver a nuestro sitio web</router-link>  
    </div>
  </section>
</template>

<script>

  export default  {
    name: 'error-404',
    props: [],
    mounted () {

    },
    data () {
      return {

      }
    },
    methods: {

    },
    computed: {

    }
}


</script>

<style scoped lang="scss">
  .error-404 {

  }
</style>
