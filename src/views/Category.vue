<template>
  <section class="category">
    <b-breadcrumb>
      <b-breadcrumb-item to="/">
        <b-icon icon="house-fill" scale="1.25" shift-v="1.25" aria-hidden="true"></b-icon>
        Home
      </b-breadcrumb-item>
      <b-breadcrumb-item active>{{$route.params.id}}</b-breadcrumb-item>
    </b-breadcrumb>
    <div class="container">
      <h1 class="text-center">{{$route.params.id}}</h1>
      <p>{{category[0].description}}</p>
      <div class="w-100 d-flex flex-column flex-md-row justify-content-between mt-3">
        <div class="d-flex flex-column flex-md-row order-1 order-md-0 mt-3 mt-md-0">
          <b-button class="btn-principal" @click="showModal">Filtrar</b-button>
          <div class="mt-2 d-flex">
            <div class="filter ml-2" v-if="priceFilter">
              <p class="text-center">Precio </p>
              <span id="priceFilter" @click="deleteFilter">&times;</span>
            </div>
            <div class="filter ml-2" v-if="ratingFilter">
              <p class="text-center">Valoración</p>
              <span id="ratingFilter" @click="deleteFilter">&times;</span>
            </div>
          </div>
          <b-modal id="modal-1" title="Filtrar por: " hide-footer>
            <div>
              <b-row class="mt-3">
                <b-col sm="5" class="d-flex">
                  <b-form-checkbox id="range-1" v-model="selectedPrice"></b-form-checkbox>
                  <label for="range-1">Precio máx.:</label>
                </b-col>
                <b-col sm="7">
                  <b-form-input v-model="valuePriceFilter" :disabled="!selectedPrice"></b-form-input>
                </b-col>
                <b-col cols="12" offset-lg="5" lg="7" class="mt-2">
                  <b-form-input id="range-1" v-model="valuePriceFilter" type="range" min="0" max="600" :disabled="!selectedPrice"></b-form-input>
                </b-col>
              </b-row>
              <b-row class="mt-3">
                <b-col sm="5" class="d-flex">
                  <b-form-checkbox id="rating" v-model="selectedRating"></b-form-checkbox>
                  <label for="rating">Valoración (min.):</label>
                </b-col>
                <b-col sm="7">
                  <b-form-select id="rating" v-model="valueRatingFilter" :options="optionsRating" :disabled="!selectedRating"></b-form-select>
                </b-col>
              </b-row>
            </div>
            <b-button class="mt-3 btn-principal" block @click="getProductFilter">Filtrar</b-button>
          </b-modal>
        </div>
        <div class="d-flex order-0 order-lg-1 select-order">
          <b-form-select v-model="selected" @change="getOrderProduct" :options="options"></b-form-select>
        </div>
      </div>
      <div v-if="products !=null" class="cards">
        <p v-if="activatedFilter && productsFilters.length == 0">No hay productos</p>
        <b-row cols="1" cols-md="2" cols-lg="4">
          <b-col v-for="product in activatedFilter ? productsFilters : productsFilter" :key="product.id" col offset="1" offset-lg="0" class="m-0 mb-4 border-card">
            <card-product :product="product" />
          </b-col>
        </b-row>
      </div>
      <div v-else class="d-flex justify-content-center mt-5"> 
        <fulfilling-bouncing-circle-spinner
          :animation-duration="4000"
          :size="60"
          color="#17a2b8"
        />
      </div>
    </div>
  </section>
</template>

<script>
 import { db } from '../db'  
 import CardProduct from '../components/CardProduct.vue'
 import { FulfillingBouncingCircleSpinner } from 'epic-spinners'


  export default  {
    name: 'category',
    components:{
      CardProduct,
      FulfillingBouncingCircleSpinner
    },
    props: [],
    async mounted () {
      if(sessionStorage)
        if(sessionStorage.getItem('filter')){
          let filter = JSON.parse(sessionStorage.getItem('filter'));
          this.selectedPrice = filter.selectedPrice;
          this.valuePriceFilter = filter.price;
          this.selectedRating = filter.selectedRating;
          this.valueRatingFilter = filter.rating;
          await this.$bind('products',db.collection('products').orderBy('name','desc'));
          this.getProductFilter();
        }
        await this.$bind('category',db.collection('categories').where('name','==',this.$route.params.id));
    },
    data () {
      return {
        products:null,
        productsFilters:[],
        activatedFilter:false,
        selectedPrice:false,
        valuePriceFilter:600,
        priceFilter:false,    
        selected:'a',
        options: [
          { value: 'a', text: 'Alfabeticamente: descendente' },
          { value: 'b', text: 'Alfabeticamente: ascendente' },
          { value: 'c', text: 'Precio: mas caro' },
          { value: 'd', text: 'Precio: mas barato' },
        ],
        selectedRating:false,
        ratingFilter:false,
        valueRatingFilter: 1 ,
        optionsRating:[
          { value: 1, text: "1" },
          { value: 2, text: "2" },
          { value: 3, text: "3" },
          { value: 4, text: "4" },
          { value: 5, text: "5" },
        ],
        category:null
      }
    },
    methods: {
      getOrderProduct(){
        this.products=null
        setTimeout(async()=>{
          if(this.selected == "a")
            await this.$bind('products',db.collection('products').orderBy('name','desc'));
          else if(this.selected == "b")
            await this.$bind('products',db.collection('products').orderBy('name','asc'));
          else if(this.selected == "c")
            await this.$bind('products',db.collection('products').orderBy('price','desc'));
          else if(this.selected == "d")
            await this.$bind('products',db.collection('products').orderBy('price','asc'));
           this.getProductFilter()
        },600)
      },
      getProductFilter(){
        this.priceFilter = this.selectedPrice;
        this.ratingFilter = this.selectedRating;
        if(!this.selectedPrice && !this.selectedRating){
          this.activatedFilter = false;
          this.productsFilters = [];
        }else{
          let products = this.productsFilter.filter(product=>{
            return (this.selectedPrice ? product.price < this.valuePriceFilter:true) && (this.selectedRating ? product.rating >= this.valueRatingFilter:true)
          }) 
        this.sessionStorageFilter();
        this.activatedFilter = true;
        this.productsFilters = products;
        }
        this.$bvModal.hide('modal-1')
      },
      sessionStorageFilter(){
        sessionStorage.setItem('filter',JSON.stringify({
          selectedPrice : this.selectedPrice,
          price: this.valuePriceFilter,
          selectedRating : this.selectedRating,
          rating : this.valueRatingFilter
        }))
      },
      deleteFilter (e){
        if(e.target.id == "priceFilter"){
          this.valuePriceFilter =600;
          this.selectedPrice = false;
          this.getProductFilter();
        }else if(e.target.id == "ratingFilter"){
          this.valueRatingFilter =1;
          this.selectedRating = false;
          this.getProductFilter();
        }
        this.sessionStorageFilter();
      },
      showModal(){
        if(sessionStorage)
          if(sessionStorage.getItem('filter')){
            let filter = JSON.parse(sessionStorage.getItem('filter'));
            this.valuePriceFilter = filter.price;
            this.valueRatingFilter = filter.rating
          }
        this.$bvModal.show('modal-1')
      },
    },
    computed: {
      productsFilter(){
        let products =  this.products.filter(product=>{
          return product.category == this.$route.params.id;
        })
        return products;
      }
    },
    firestore:{
      products: db.collection('products').orderBy('price','desc')
    }
}
</script>

<style scoped lang="scss">
@import "@/scss/app.scss";

  .category {
    .cards{
      width: 95%;
      margin: 1.25rem auto 0;
    }

    .custom-select{
      border:2px solid $cyan;
      &:focus{
        box-shadow: none!important;
      }
    }

    .filter{
      background-color: white;
      color: $cyan;
      padding: .1rem 0.2rem;
      font-size: .8rem;
      border:$cyan 1px solid;
      border-radius: 5px 5px;
      transition: all 0.5s ease;
      position: relative;
      width: 4.8rem;
      height: 1.5rem;        
      display: flex;
      align-items: center;

      & P{
        display: inline;
      }

      & span{
        position: absolute;
        cursor: pointer;
        font-size: 1.3rem;
        right: 0.05rem;
        bottom: .2rem;
      }

      &:hover{
          background-color: white;
          color: $cyan;
      }
    } 

    .select-order{
      width: 100%;

      @media (min-width: 768px){
        width: 17rem;
      }
    }
  }
</style>

