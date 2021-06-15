<template>
  <section class="card-product">
    <router-link :to="{name:'product',params:{slug:product.slug}}">
      <div class="d-flex justify-content-center w-100">
        <img :src="product.url" :alt="product.name">
      </div>
      <div class="px-3">
        <div class="d-flex align-items-end justify-content-end">
          <div class="rating my-2">
            <b-form-rating no-border v-model="rating" variant="warning" readonly></b-form-rating>
          </div>
        </div>
        <p class="title">{{product.name}}</p>
        <div class="d-flex justify-content-between size-details">
          <p :style="{color:colorStock(product.stock)}">{{product.stock}} en stock</p>
          <p>{{product.price}} €</p>
        </div>
      </div>
    </router-link>
    <div class="px-2 pb-2 mt-2">
      <b-button class="w-100 btn-principal" @click="addCart" :disabled= "disabled">Añadir al carrito</b-button>  
    </div>  
  </section>
</template>

<script>
  import { mapState } from 'vuex';
  import { db , fb } from '../db';   
  import Swal from 'sweetalert2'

  export default  {
    name: 'card-product',
    props: ['product'],
    mounted () {

    },
    data () {
      return {
        rating: this.product.rating,
        isActive:true
      }
    },
    methods: {
      addCart(){
        if(this.user){
          db.collection('cart').where("idProduct","==",this.product.id).where("user","==", this.user.email).get()
            .then(querySnapshot=>{
              if(querySnapshot.empty){
                db.collection('cart').add({
                  url : this.product.url,
                  name : this.product.name,
                  price : this.product.price,
                  amount : 1,
                  total :this.product.price,
                  user : this.user.email,
                  idProduct : this.product.id
                });
                Swal.fire({
                  toast: true,
                  position: 'top-end',
                  showConfirmButton: false,
                  timer: 1500,
                  timerProgressBar: true,
                  icon: 'success',
                  title: 'Producto añadido correctamente',
                  didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })
              }else{
                querySnapshot.forEach(element=>{
                  if(element.data().amount + 1 <= this.product.stock){
                    db.collection('cart').doc(element.id).update({
                      amount : fb.firestore.FieldValue.increment(1),
                      total : fb.firestore.FieldValue.increment(Math.round(this.product.price * 100) / 100)
                    })
                    Swal.fire({
                      toast: true,
                      position: 'top-end',
                      showConfirmButton: false,
                      timer: 1500,
                      timerProgressBar: true,
                      icon: 'success',
                      title: 'Producto añadido correctamente',
                      didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    })
                  }else{
                    Swal.fire({
                      toast: true,
                      position: 'top-end',
                      showConfirmButton: false,
                      timer: 1500,
                      timerProgressBar: true,
                      icon: 'error',
                      title: 'No hay mas stock para este producto',
                      didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    })
                  } 
                })
              } 
            })
        }else{
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            icon: 'error',
            title: 'Debe loguearse antes de añadir al carrito',
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
        }
      },
      colorStock(stock){
        if(stock > 0)
          return "green";
        return "red";
      }
    },
    computed: {
      ...mapState('user',['user']),
      disabled(){
        if(this.product.stock == 0)
          return true;
        return false;
      }
    }
  }
</script>

<style scoped lang="scss">

  .card-product {
    background-color: white;
    margin: auto;
    border-radius: 10px 10px;
    transition: all .5s ease;

    .green{
      color: #09c209;
    }

    .red{
      color: red;
    }

    &:hover{
      border-radius: 10px 10px;
      transform: scale(1.05);
      box-shadow: 1px 1px 6px grey;
    }

    img{
      width: 100%;
      width: 12rem;
      height: 12rem;
      object-fit: cover;
      border-radius: 10px 10px 0 0;
    }

    .title{
      font-size: 1rem; 
      line-height: 1.3rem;
      height: 3rem;

      @media (min-width: 960px){
        height: 5rem;
      }

      @media (min-width: 1400px){
        height: 4rem;
      }
    }

    .size-details{
      font-size: 1rem;
      width: 80%;
      margin: 0 auto;
    }

    .rating{
      width: 9rem;
    }

    a{
      color: black;

      &:hover{
        text-decoration: none;
      }
    }
  }
</style>