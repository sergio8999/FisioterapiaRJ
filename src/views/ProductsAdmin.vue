<template>
  <section class="products-admin container">
    <h1 class="text-center mt-3">Productos</h1>   
    <b-row cols="1" cols-md="2" cols-lg="4" class="mt-3">
      <b-col col offset="1" offset-lg="0" class="m-0 mb-4" v-for="product in products" :key="product.id">
        <b-card
          :title="product.name"
          :img-src="product.url"
          img-alt="Image"
          img-top
          tag="article"
          class="mb-2 card-image"
        >
          <div class="d-flex justify-content-between">
            <router-link tag="b-button" class="bg-primary" :to="{name:'EditProduct',params:{slug:product.slug}}">Editar</router-link>
            <b-button variant="danger" @click="deleteProduct(product.id)">Borrar</b-button>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </section>
</template>

<script>
import { db } from '../db.js'
import Swal from 'sweetalert2'

  export default  {
    name: 'products-admin',
    props: [],
    mounted () {

    },
    data () {
      return {
        products : null
      }
    },
    methods: {
      deleteProduct(id){
        Swal.fire({
          title: 'Esta seguro?',
          text: "No podras revertir este cambio!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '##17a2b8',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, borrar!',
          cancelButtonText: 'Cancelar'
        })
        .then((result) => {
          if (result.isConfirmed) {
           db.collection('products').doc(id).delete();
            Swal.fire(
              'Borrado!',
              'El producto fue borrado',
              'success'
            )
          }
        })
      }
    },
    computed: {

    },
    firestore: {
      products : db.collection('products')
    }
}
</script>

<style scoped lang="scss">
  .products-admin {
      .card-image{
        img{
          height: 14rem;
          object-fit: cover;
        }

        .card-title{
          height: 4rem!important;
          font-size: 1.1rem!important;
        }     
       
        .card-body{
          padding: 0.5rem;
        }
      } 

    button{
      width: 7rem;

      @media (min-width: 960px) {
        width: 5rem;
      }
    }
  }
</style>
