<template >
  <section class="home mb-3">
    <section  class="hero">
      <b-carousel
        id="carousel-fade"
        style="text-shadow: 0px 0px 2px #000"
        fade
        indicators
      >
        <router-link to="/category/Electroterapia" >
          <b-carousel-slide>
            <template #img>
              <img
                class="d-none d-lg-block img-fluid w-100"
                src="https://firebasestorage.googleapis.com/v0/b/tienda-proyecto-183e3.appspot.com/o/hero1-pc-400.svg?alt=media&token=57f36adc-77ca-4f26-830e-29b273901a8f"
                alt="image slot"
              >
              <img
                class="d-none d-md-block d-lg-none img-fluid w-100"
                src="https://firebasestorage.googleapis.com/v0/b/tienda-proyecto-183e3.appspot.com/o/hero1-ipad.svg?alt=media&token=f743620f-4ee1-4706-9750-2adf60ab2c63"
                alt="image slot"
              >
              <img
                class="d-lg-none img-fluid w-100"
                src="https://firebasestorage.googleapis.com/v0/b/tienda-proyecto-183e3.appspot.com/o/hero1-movil.svg?alt=media&token=93e538be-9bca-48fd-982e-8c37c1487c53"
                alt="image slot"
              >
            </template>
          </b-carousel-slide>
        </router-link >
        <router-link to="/citas" >
          <b-carousel-slide>
            <template #img>
              <img
                class="d-none d-lg-block img-fluid w-100"
                src="https://firebasestorage.googleapis.com/v0/b/tienda-proyecto-183e3.appspot.com/o/hero2-pc.svg?alt=media&token=7fbda0f1-9763-40fa-bd2c-11954b3acb2e"
                alt="image slot"
              >
              <img
                class="d-none d-md-block d-lg-none img-fluid w-100"
                src="https://firebasestorage.googleapis.com/v0/b/tienda-proyecto-183e3.appspot.com/o/hero2-ipad.svg?alt=media&token=0fb8948d-b4c0-4d73-9dd7-07f511593a89"
                alt="image slot"
              >
              <img
                class="d-lg-none img-fluid w-100"
                src="https://firebasestorage.googleapis.com/v0/b/tienda-proyecto-183e3.appspot.com/o/hero2-movil.svg?alt=media&token=627e645c-00ef-41ef-9ca7-20f9241671bf"
                alt="image slot"
              >
            </template>
          </b-carousel-slide>
        </router-link >
      </b-carousel>
    </section>
    <div class="container product-recommended mt-3 mt-lg-5">
      <h2 class="text-center text-lg-left my-3">Productos recomendados</h2>
      <b-row cols="1" cols-md="2" cols-lg="4" class="mt-3">
        <b-col col offset="1" offset-lg="0" class="m-0 mb-4" v-for="product in productsRecommended" :key="product.id">
          <router-link :to="{name:'product',params:{slug:product.slug}}">
            <b-card
              :img-src="product.url"
              img-alt="Image"
              tag="article"
              style="max-width: 16rem;"
              class="mb-2"
            >
              <b-card-text>
              {{product.name}}
              </b-card-text>
            </b-card>
          </router-link>
        </b-col>
       </b-row>
    </div>
    <div v-if="categories !=null">
      <b-container>
        <h1 class="text-center text-lg-left ml-3 mb-4">Categorias:</h1>
        <b-row align-h="center">
          <b-col md="5" lg="3" v-for="category in categories" :key="category.id" class="p-4 category m-3 bg-white">
            <router-link :to="{name:'category',params:{id:category.name}}" class="d-flex flex-column align-items-center">
              <img :src="category.url" :alt="category.name">
              <h5 class="text-center mt-3">{{category.name}}</h5>
            </router-link>
          </b-col>
        </b-row> 
      </b-container> 
    </div>
  </section>
</template>

<script>
import { db } from '../db'

  export default  {
    name: 'home',
    props: [],
    components:{

    },
    mounted () {
      
    },
    data () {
      return {
        categories: null,
        productsRecommended: null
      }
    },
    methods: {

    },
    computed: {
      
    },
    firestore:{
      categories : db.collection('categories'),
      productsRecommended: db.collection('products').orderBy('rating','desc').limit(4)
    }
}
</script>

<style scoped lang="scss">
@import "@/scss/app.scss";

  .home {
    .card{
      height: 18rem;
      margin: 0 auto;
      border: 2px solid $cyan;
      transition: all 0.5s ease;

      &:hover{
        transform: scale(1.05);
      }

      @media (min-width:1400px){
          height: 18rem;
      }

      &-img{
        margin: 0 auto;
      }
    
      &-body{
        font-size: 1rem;
        padding-top: 0;
      }
      &-text{
        color: $cyan;
        text-align: center;
      }
    }

    h1{
      letter-spacing: .2rem;
      font-size: 3rem;
      font-variant: small-caps;
    }

    h2{
      font-size: 2.3rem;
      font-variant: small-caps;
    }

    .hero, .carousel-item{
      height: 45vh;

      @media (min-width:960px){
        height: 18rem;
      }

      @media (min-width:1400px){
          height: 25rem;
      }

      img{
        width: 100%;
      }
    }

    img{
      width:80%;
    }

    .product-recommended{
      &:hover a{
        text-decoration: none;
      }
    }

    .category{
      border: 1px solid #d2cfcf42;
      border-radius: 50px;

      &:hover{
      border-radius: 50px;
      box-shadow: 0 0 5px grey;
      cursor: pointer;
      }

      &:hover a{
        text-decoration: none;
      }

      h5{
        color: black;
      }
    }
  }
</style>
