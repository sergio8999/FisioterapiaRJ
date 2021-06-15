<template>
  <section class="cart container" v-if="this.product=!null">
    <b-row class="my-5">
      <!-- Articulos -->
      <b-col cols="12" lg="8">
        <b-row class="d-none d-md-flex">
          <!-- imagen -->
          <b-col cols="2">Imagen</b-col>
          <!-- Descripcion -->
          <b-col cols="9">
            <b-row>
              <b-col cols="6">Articulo</b-col>
              <b-col cols="2" >Precio</b-col>
              <b-col cols="2">Unidades</b-col>
              <b-col cols="2">Total</b-col>
            </b-row>
          </b-col>
          <!-- Eliminar-->
          <b-col cols="1"></b-col>
        </b-row>
        <b-row class="d-flex align-items-center mt-2" v-for="product in cartUser" :key="product.id">
          <!-- imagen -->
          <b-col cols="2" class="d-none d-md-flex">
            <img :src="product.url" :alt="product.name">
          </b-col>
          <!-- Descripcion -->
          <b-col cols="10" md="9" >
            <b-row class="d-flex align-items-center">
              <b-col cols="12" md="6">{{product.name}}</b-col>
              <b-col cols="2" class="d-none d-md-block" >{{product.price}}€</b-col>
              <b-col cols="6" md="2">
                <b-form-select v-model="product.amount" @change="setAmount(product.id,$event,product.price,product.idProduct)">
                  <b-form-select-option v-for="number in getStock(product.idProduct)" :key="number" :value="number" >{{number}}</b-form-select-option>
                </b-form-select>
              </b-col>
              <b-col cols="6" md="2">{{product.total}}€</b-col>
            </b-row>
          </b-col>
          <!-- Eliminar-->
          <b-col cols="2" md="1" class="d-flex justify-content-center">
            <b-button class="delete" @click="deleteProducts(product.id)"><font-awesome-icon icon="trash-alt" /></b-button>
          </b-col>
        </b-row>
        <b-row class="mt-3 line">
          <b-col cols="12" md="6" class="mt-3">
            <b-button class="btn-second" @click="deleteCart">Vaciar cesta</b-button>
          </b-col>
          <b-col cols="12" md="6" class="d-flex justify-content-end mt-3">
            <router-link tag="b-button" class="btn-second" to="/">Seguir comprando</router-link>
          </b-col>
        </b-row>
      </b-col>
      <!-- Total -->
      <b-col cols="12" lg="4" class="mt-3 mt-lg-0">
        <div class="text-center text-lg-left">Subtotal: {{getSubtotalProducts}}€</div>
        <div class="text-center text-lg-left">Gastos de envío: {{getShipping}}€</div>
        <div class="text-center text-lg-left">Total: {{getTotalProducts}}€</div>
        <div class="small text-center text-lg-right">En pedidos superiores a 60€, envío gratis!</div>
        <div class="mb-3">
          <b-button @click="updateAmountProducts" class="w-100 btn-principal">Comprar</b-button>
        </div>
      </b-col>
    </b-row>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { db, fb } from '../db'

import Swal from 'sweetalert2'

  export default  {
    name: 'cart',
    props: [],
    async mounted () {
      let response = await this.$bind('address',db.collection('addresses').where('user','==',this.user.email));
      this.address = response[0];
    },
    data () {
      return {
        cart:null,
        numbers:[1,2,3,4,5],
        products:null,
        selected: null,
        adress: null
      }
    },
    methods: {
      getStock(id){
        let stock = [];
        this.products.forEach(element => {
          if(element.id == id)
          for(let i=1;i<=element.stock;i++)
                stock.push(i)
        })
        return stock;
      },
      setAmount(id,value,price,idProduct){
        let stock = this.getStock(idProduct);
        if(value > stock)
          return stock;
        let total = parseInt(value) * price;
        db.collection('cart').doc(id).update({
            amount: parseInt(value),
            total:  Math.round(total * 100) / 100 
        }) 
      },
      updateAmountProducts(){
        if(this.user)
          if(this.address!=null){
            if(this.cartUser.length !=0){
              for(let i=0;i<this.cartUser.length;i++)
              for(let j=0;j<this.products.length;j++){
                if(this.cartUser[i].idProduct == this.products[j].id){
                  db.collection('products').doc(this.products[j].id).update({
                    stock: fb.firestore.FieldValue.increment(-this.cartUser[i].amount)
                  })
                }
              }
              this.storeOrder();
              this.deleteCart();
              this.showNotification('Compra realizada correctamente','success');
            }else
              this.showNotification('Debe añadir productos al carrito','error');
          }else{
            this.showNotification('Por favor, añada una dirección de envío en el perfil','error');
          }
        else
          this.showNotification('Debe estar logueado','error');        
      },
      showNotification(title,icon){
        Swal.fire({
            position: 'top',
            toast: true,
            icon: icon,
            title: title,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
      },
      storeOrder(){
        db.collection('orders').add({
          products:this.cartUser,
          user: this.user.email,
          subtotal: this.getSubtotalProducts,
          shipping: this.getShipping,
          total:this.getTotalProducts,
          date: fb.firestore.FieldValue.serverTimestamp()
        })
      },
      deleteCart(){
        this.cart.forEach(product => {
          db.collection("cart").doc(product.id).delete();
        });
      },
      
      deleteProducts(id){
        db.collection('cart').doc(id).delete();
      },      
    },
    computed: {
      ...mapState('user',['user']),

      cartUser(){
        let cartUser = [];
        if(this.user != null){
          cartUser = this.cart.filter((product)=>{
            return product.user == this.user.email
          })
        }
        return cartUser;
      },
        
      getSubtotalProducts(){
        let suma = 0;
        this.cartUser.forEach(element => {
          suma += element.total
        });
        
        return Math.round(suma * 100) / 100;
      },
      getShipping(){
        if(this.getSubtotalProducts < 60 && this.getSubtotalProducts != 0)
          return 4.95;
        else
          return 0;
      },
      getTotalProducts(){
        return Math.round((this.getSubtotalProducts + this.getShipping) * 100) / 100;
      }
    },
    firestore:{
      cart: db.collection('cart'),
      products: db.collection('products')
    }
}
</script>

<style scoped lang="scss">
@import "@/scss/app.scss";

  .cart {
    img{
      width: 100%;
      height: 5.5rem;
      object-fit: cover;
    }

    .delete{
      background-color: red;
      border:1px solid red;
      transition: all 1s;

      &:hover{
        background-color: white;
        color: red;
      }
    }

    .line{
      border-top: 1px solid grey;
      width: 95%;
      margin:auto;

      @media (min-width:960px){
        width: 100%;
      }
    }

    .btn-second{
      color: $cyan;
      background-color: white;
      border: 1px solid $cyan;
      transition: all 0.5s ease;
      width: 100%;

      @media(min-width:960px){
        width: 10rem;
      }

      &:hover{
        background-color: darken(white, 4);
      }
    }
  }
</style>
