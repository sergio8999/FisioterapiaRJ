<template>
  <section v-if="product != null" class="product">
    <b-breadcrumb>
      <b-breadcrumb-item to="/">
        <b-icon icon="house-fill" scale="1.25" shift-v="1.25" aria-hidden="true"></b-icon>
        Home
      </b-breadcrumb-item>
      <b-breadcrumb-item @click="back">Categoria</b-breadcrumb-item>
      <b-breadcrumb-item active>{{product.name}}</b-breadcrumb-item>
    </b-breadcrumb>
    <div class="container">
      <b-row class="mt-5">
        <b-col cols="12" lg="5" class="d-flex justify-content-center align-items-center">
          <b-card class="carousel" no-body>
            <b-tabs card end >
              <b-tab v-for="(image,index) in carousel" :key="image.id" :active="index==0">
                <template #title>
                  <b-card-img bottom :src="image" :alt="image" class="carousel-image"></b-card-img>
                </template>
                <b-card-img bottom :src="image" :alt="image"></b-card-img>
              </b-tab>            
            </b-tabs>
          </b-card> 
        </b-col>
        <b-col cols="12" lg="7" class="d-flex flex-column justify-content-start mt-4 mt-lg-0">
          <b-row>
            <b-col cols="12">
              <h3 class="text-center text-lg-left m-0">{{product.name}}</h3>
            </b-col>
          </b-row>
          <b-row class="mt-3 mt-lg-5">
            <b-col cols="12" lg="11">
              <p class="text-justify">{{product.description}}</p>
            </b-col>
          </b-row>
          <div class="rating d-flex justify-content-start mt-lg-3">
            <b-form-rating no-border v-model="product.rating" variant="warning" readonly class="p-0 bg-rating"></b-form-rating>
          </div>
          <b-row class="mt-1 mt-lg-4">    
            <b-col cols="6" md="3">
              <p v-if="product.stock ==0">Producto Agotado</p>
              <b-form-select v-model="selected" v-if="product.stock !=0">
                <b-form-select-option v-for="number in stock" :key="number" :value="number">{{number}}</b-form-select-option>
              </b-form-select>
            </b-col>
            <b-col cols="6" md="2" lg="3" class="d-flex align-items-center justify-content-center">
              <p class="text-right text-price">{{product.price}} €</p>
            </b-col>
            <b-col cols="12" offset-md="2" md="5" offset-lg="1" lg="4" class="mt-3 mt-md-0">
              <b-button class="btn-principal btn-size" @click="addCart" :disabled="product.stock == 0">Añadir al carrito</b-button>
            </b-col>
          </b-row> 
        </b-col>
      </b-row>
      <div class="d-flex">
        <div class="features text-center pointer" @click="selectedFooter='features'" :class="{'activeTab':selectedFooter=='features'}">
          Caracteristicas
        </div>
        <div class="features ml-1 text-center pointer" @click="selectedFooter='opinion'" :class="{ 'activeTab': selectedFooter=='opinion'}">
          Opinión
        </div>
      </div>
      <b-col cols="12" class="p-3 mb-3 features-items" v-if="selectedFooter=='features'">
        <ul>
          <li v-for=" feature in features" :key="feature" class="text-left">{{feature}}</li>
        </ul>
      </b-col>
      <b-col cols="12" class="d-flex flex-column align-items-center p-3 mb-3 features-items" v-if="selectedFooter=='opinion'">
        <b-button @click="changeAcordeon" class="btn-principal w-25">Enviar opinión</b-button>
        <b-card no-body class="my-2 w-100">
          <b-collapse id="my-accordion" accordion="my-accordion" role="tabpanel">
            <b-card-body class="w-100">
              <b-card-text class="text-center mb-3">Valoración</b-card-text>
              <b-card-text>
                <form @submit.prevent="setOpinion" @reset.prevent="reset">
                  <b-row class="m-0">
                    <b-form-textarea
                      id="textarea"
                      v-model="textDescripcion"
                      placeholder="Escriba descripción (opcional)"
                      rows="3"
                      max-rows="6"
                    ></b-form-textarea>
                  </b-row>
                  <b-row class="form-group mt-2">
                    <b-col sm="12" md="4" lg="2">
                      <label for="description" class="col-form-label text-left">Valoración del producto:</label>
                    </b-col>
                    <b-col sm="10" md="8" lg="2">
                      <b-form-rating v-model="rating" variant="warning" class="mb-2"></b-form-rating>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="6" offset-lg="8" lg="2">
                      <b-button class="w-100 bg-danger" type="reset">Cancelar</b-button>
                    </b-col>
                    <b-col cols="6" lg="2">
                      <b-button class="w-100 btn-principal" type="submit">Enviar</b-button>
                    </b-col>
                  </b-row>
                </form>
              </b-card-text> 
            </b-card-body>
          </b-collapse>
        </b-card>
        <b-row cols="1" cols-md="2" cols-lg="3" class="mt-3 w-100">
          <b-col col offset="1" offset-lg="0" v-for="opinion in getOpinion" :key="opinion.id" class="mt-2">
            <div>
              <div>{{opinion.name}}</div>
              <div class="rating-opinion d-flex justify-content-start">
                <b-form-rating b-form-rating no-border v-model="opinion.rating" variant="warning" readonly class="p-0"></b-form-rating>
              </div>
              <div class="small">{{opinion.description}}</div>
            </div>
          </b-col>
        </b-row>
      </b-col>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import { db , fb } from '../db';   
import Swal from 'sweetalert2';

  export default  {
    name: 'product',
    props: [],
    created(){
      
    },
    mounted (){
      let id = this.$route.params.slug;
      let arrayId = id.split('-');
      this.idProduct = arrayId[arrayId.length - 1];
      db.collection('products').doc(this.idProduct).get()
        .then(doc => {
          this.product = doc.data()
          this.carousel = doc.data().carousel;
          this.features = doc.data().features;
          for(let i=1;i<=doc.data().stock;i++){
            this.stock.push(i);
          }
        })
        .catch(error => console.log(error))
    },
    data () {
      return {
        product:null,
        carousel:null,
        features:null,
        selected:1,
        stock:[],
        idProduct: null,
        selectedFooter: "features",
        textDescripcion:"",
        rating: 0,
        ratingTotal:null
      }
    },
    methods: {
      changeAcordeon(){
        this.$root.$emit('bv::toggle::collapse', 'my-accordion')
      },
      back(){
        this.$router.go(-1)
      },
      addCart(){
        if(this.user){
          db.collection('cart').where("idProduct","==",this.idProduct).where("user","==", this.user.email).get()
          .then(querySnapshot=>{
            if(querySnapshot.empty){
              db.collection('cart').add({
                url : this.product.url,
                name : this.product.name,
                price : this.product.price,
                amount : this.selected,
                total :Math.round(this.getTotalProduct() * 100) / 100,
                user : this.user.email,
                idProduct : this.idProduct
              });

              Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Producto añadido correctamente',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer)
                  toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
              })
            }else{
              querySnapshot.forEach(element=>{
                if(element.data().amount + this.selected <= this.product.stock){
                  db.collection('cart').doc(element.id).update({
                    amount : fb.firestore.FieldValue.increment(this.selected),
                    total : fb.firestore.FieldValue.increment(Math.round((this.product.price * this.selected) * 100) / 100)
                  })
                  Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Producto añadido correctamente',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                      toast.addEventListener('mouseenter', Swal.stopTimer)
                      toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                  })
                }else{
                  Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'error',
                    title: 'No hay ' + this.selected + ' en stock',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
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
            icon: 'error',
            title: 'Debe loguearse antes de añadir al carrito',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
        }
      },
      getTotalProduct(){
        return this.selected * this.product.price;
      },
      checkoutProduct(){
        db.collection('cart').where("user","==", this.user.email).get()
          .then(querySnapshot=>{
            if(!querySnapshot.empty)
              querySnapshot.forEach(product=>{
                console.log(this.selected)
                if(product.data().idProduct == this.idProduct)
                  console.log()
              })
          });
      },
      reset(){
        this.textDescripcion = "";
        this.rating = 0;
        this.$root.$emit('bv::toggle::collapse', 'my-accordion')
      },
      setOpinion(){
        if(this.user){
          let name = this.user.displayName.split(" ")
          db.collection('opinion').add({
            description:this.textDescripcion,
            rating: this.rating,
            user: this.user.email,
            name: name[0],
            idProduct: this.idProduct
          })
          Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Añadido comentario',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer)
                  toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
              })
          setTimeout(async()=>{
            this.reset();
            db.collection('products').doc(this.idProduct).update({
              rating: this.getMiddle
            })
            await this.$bind('product',db.collection('products').doc(this.idProduct));
            },1500)
        }else{
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'Debe loguearse',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
        }
      }, 
    },
    computed: {
      ...mapState('user',['user']),
      getOpinion(){
        let rating = this.ratingTotal.filter(element=>{
          return element.idProduct == this.idProduct;
        })
        return  rating;
      },
      getMiddle(){
        let middle = 0;
        this.getOpinion.forEach(element=>{
          middle +=element.rating;
        })
        return Math.round((middle / this.getOpinion.length) * 100) / 100;
      }
    },
    firestore:{
      ratingTotal: db.collection('opinion') 
    }
}
</script>

<style scoped lang="scss">
@import "@/scss/app.scss";

  .product {
    .carousel{
      width : 26rem;

      &-image{
      width: 4rem;
      }
    }

    .bg-rating{
      background-color: $color-background;
      width: 7.8rem;
    }

    .pointer{
      cursor: pointer;
    }

    .card{
      border: none;
    }

    .activeTab{
      background-color: $cyan!important;
    }

    .features{
      padding: .2rem 1rem;
      background-color: $white;
      border-radius: 10px 10px 0 0;
      color: black;
      margin-top: 3rem;
      border: 1px solid darken($cyan,3);
      width: 9rem;

      @media (min-width: 768px){
        margin-top: 5rem;
        width: 9.5rem;
      } 

      &-items{
        background-color: white;
        border: 1px solid darken($cyan,3);
      }
    }

    .text-price{
      font-size: 1.1rem;
    }

    .btn-size{
      width: 100%;
    }

    .rating-opinion{
      width: 7rem;
    }
  }
</style>
