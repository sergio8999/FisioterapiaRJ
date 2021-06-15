<template>
  <section class="order-profile container pb-4">
    <h1 class="text-center">Historial de pedidos</h1>
    <div class="accordion" role="tablist">
      <b-card no-body class="mb-1" v-for="order in ordersUser" :key="order.id">
        <b-card-header header-tag="header" class="p-1 bg-info" role="tab">
          <div class="d-flex justify-content-between p-3">
            <div class="d-flex flex-column">
              <p>Nº de pedido: {{order.id}} </p>
              <p>Fecha de pedido: {{getDate(order.date)}}</p>
            </div>
            <div>
              <b-button @click="changeCollapse(order.id)"><font-awesome-icon :icon="['fas', 'sort']"/></b-button>
            </div>
          </div>
        </b-card-header>
        <b-collapse :id="order.id" visible accordion="my-accordion" role="tabpanel">
          <b-card-body class="w-100">
            <b-card-text class="text-center">RESUMEN PEDIDO</b-card-text>
            <b-card-text>
              <b-table-simple responsive>
                <b-thead>
                  <b-tr>
                    <b-th>Nombre producto</b-th>
                    <b-th>Precio/Unidad</b-th>
                    <b-th>Cantidad</b-th>
                    <b-th>Total</b-th>
                  </b-tr>
                </b-thead>
                <b-tbody>
                  <b-tr v-for="product in order.products" :key="product.id">
                    <b-td>{{product.name}}</b-td>
                    <b-td>{{product.price}}€</b-td>
                    <b-td>{{product.amount}}</b-td>
                    <b-td>{{product.total}}€</b-td>
                  </b-tr>
                  <b-tr>
                    <b-td colspan="2"></b-td>
                    <b-td>Total: </b-td>
                    <b-td>{{order.total}}€</b-td>
                  </b-tr>
                </b-tbody>
              </b-table-simple>
            </b-card-text> 
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>
  </section>
</template>

<script>
import moment from 'moment' 
import { mapState } from 'vuex'
import { db } from '../db'

  export default  {
    name: 'order-profile',
    props: [],
    mounted () {

    },
    data () {
      return {
        orders: null,
      }
    },
    methods: {
      changeCollapse(id){
        this.$root.$emit('bv::toggle::collapse', id)
      },
      getDate(timeStamp){
        let date = moment(timeStamp.toDate()).format('DD-MM-YYYY');
        return date;
      }
    },
    computed: {
      ...mapState('user',['user']),
      ordersUser(){
        let orderdUser = [];
          if(this.user != null){
            orderdUser = this.orders.filter((order)=>{
              return order.user == this.user.email
            })
          }
        return orderdUser;
      }
    },
    firestore: {
      orders: db.collection('orders')
    }
}


</script>

<style scoped lang="scss">
@import "@/scss/app.scss";
  .order-profile {
    min-height: 92vh;
    width: 100vw;

    button{
      background-color: $primary;

      &:hover{
        background-color: lighten($primary, 3);
      }
    }

    table{
      font-size: .8rem!important;

      @media (min-width: 960px){
        font-size: 1.1rem;
      }

      td,th{
        padding: 0.4rem!important;
      }

      @media (min-width: 960px){
        padding: 0.75rem;
      }
    }
      
    @media (min-width: 960px){
      width: 100%;
    }

    .collapsed > .when-open,
    .not-collapsed > .when-closed {
      display: none;
    } 
  }
</style>
