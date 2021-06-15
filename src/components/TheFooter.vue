<template>

  <section class="the-footer">
    <b-row class="content">
      <b-col cols="12" md="6" lg="3" order="1" order-lg="0">
        <ul class="p-0 text-center text-md-left">
          <li>Ayuda</li>
          <li>Aviso legal</li>
          <li>Política de privacidad</li>
          <li>Política de cookies</li>
          <li>Como comprar</li>
          <router-link to="/about" tag="li" class="pointer">Sobre nosotros</router-link>
        </ul>
      </b-col>
      <b-col cols="12" md="12" lg="6" order="0" order-lg="1">
         <!-- Redes sociales -->
      <div class="d-flex justify-content-center align-items-start w-100 my-3 my-lg-0">
        <ul class="d-flex p-0">
          <li class="icon"><font-awesome-icon class="mr-md-5 mr-lg-3" :icon="['fab', 'facebook-f']"/></li>
          <li class="icon"><font-awesome-icon class="mr-md-5 mr-lg-3" :icon="['fab', 'instagram']"/></li>
          <li class="icon"><font-awesome-icon class="mr-md-5 mr-lg-3" :icon="['fab', 'twitter']"/></li>
        </ul>
        <div>
          <b-button class="btn-principal">Newsletter</b-button>
        </div>
      </div>
      </b-col>
      <b-col cols="12" md="6" lg="3" order="2">
        <ul class="p-0 text-center text-md-left">
          <li>Contacto:</li>
          <li>Telf: 6225478</li>
          <li> Lunes a viernes:</li>
          <li>10:00 a 14:00 | 17:00 a 21:00</li>
        </ul>
      </b-col>
    </b-row>
  </section>
</template>

<script>

  export default  {
    name: 'the-footer',
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
@import "@/scss/app.scss";

  .the-footer {
    background-color: $primary;
    color: $white;
    font-size: 1rem;
    
      .content{
        margin: auto;
        margin-top: 2rem;
        width: 100%;

      @media(min-width: 768px){
        width: 80%;
      }

        svg{
          color: $cyan;
        }

        .icon{
          margin-right: 1rem;
          font-size: 2rem;
        }

        .newsletter{
          background-color: $cyan;
          color: $primary;
          padding: .5rem;
          border-radius: 0.4rem;
          width: 20rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        li{
          list-style: none;
        }

        .pointer{
          cursor: pointer;
        }
    }
  }
</style>