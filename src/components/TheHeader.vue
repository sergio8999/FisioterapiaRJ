<template >
  <section class="the-header">
    <div>
      <b-navbar toggleable="lg" type="dark" variant="primary" >
        <router-link to="/" 
          custom
          v-slot="{ href, navigate }">
          <b-navbar-brand :href="href" @click="navigate">
            <img class="logo" src="https://firebasestorage.googleapis.com/v0/b/tienda-proyecto-183e3.appspot.com/o/logo.png?alt=media&token=f0ba2956-a7c4-4df4-abf9-b9b935b2ced8" alt="FisioterapiRJ">  
          </b-navbar-brand> 
        </router-link>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item-dropdown left>
              <template #button-content>
                Productos
              </template>
              <router-link v-for="category in categories" :key="category.id" :to="{name:'category',params:{id:category.name}}"
                custom
                v-slot="{ href, navigate }">
                <b-dropdown-item :href="href" @click="navigate">{{category.name}}</b-dropdown-item>
              </router-link>
            </b-nav-item-dropdown>
            <router-link to="/citas" custom v-slot="{ href, navigate }">
              <b-nav-item :href="href" @click="navigate">Citas</b-nav-item> 
            </router-link>
            <router-link to="/about" custom v-slot="{ href, navigate }">
              <b-nav-item :href="href" @click="navigate">Sobre nosotros</b-nav-item> 
            </router-link>
          </b-navbar-nav>
          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-form>
              <div class="d-flex flex-column flex-lg-row">
                <router-link to="/cart" custom v-slot="{ href, navigate }" v-if="!user">
                  <b-nav-item :href="href" @click="navigate"><font-awesome-icon icon="shopping-cart" /></b-nav-item> 
                </router-link>
                <router-link to="/login" custom v-slot="{ href, navigate }" v-if="!user">
                  <b-nav-item :href="href" @click="navigate">Iniciar sesión</b-nav-item> 
                </router-link>
                <router-link to="/signUp" custom v-slot="{ href, navigate }" v-if="!user">
                  <b-nav-item :href="href" @click="navigate">Registrar</b-nav-item> 
                </router-link>
                <router-link to="/cart" custom v-slot="{ href, navigate }" v-if="user">
                  <b-nav-item :href="href" @click="navigate"><font-awesome-icon icon="shopping-cart" /> {{getAmountProduct}} - {{getTotal}}€</b-nav-item> 
                </router-link>
              </div>
            </b-nav-form>
            <div v-if="user">
              <b-nav-item-dropdown right>
                <template #button-content>
                  <em>{{user.displayName || user.email }}</em>
                </template>
                <router-link to="/perfil/informacion-personal" 
                  custom
                  v-slot="{ href, navigate }">
                  <b-dropdown-item :href="href" @click="navigate">Perfil</b-dropdown-item>
                </router-link>
                <router-link to="/admin" 
                  custom
                  v-slot="{ href, navigate }"
                  v-if="getIsAdmin">
                  <b-dropdown-item :href="href" @click="navigate">Administrador</b-dropdown-item> 
                </router-link>
                <b-dropdown-item href="#" @click="logout">Cerrar sesión</b-dropdown-item>
              </b-nav-item-dropdown>
            </div>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
  </section>
</template>

<script>
  import { mapState } from 'vuex'
  import { db } from '../db'

  export default  {
    name: 'TheHeader',
    props: [],
    mounted () {

    },
    data () {
      return {
        cart: null,
        categories: null
      }
    },
    methods: {
      async logout(){
        try{
          await this.$store.dispatch('user/logout');
          console.log('LoggedOut');
          this.$router.push('/').catch(()=>{});
        }catch(error){
          console.log(error.message);
        }
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
      getAmountProduct(){
        let suma = 0;
        this.cartUser.forEach(element => {
          suma += element.amount
        });
        return suma;
      },
      getTotal(){
        let suma = 0;
        this.cartUser.forEach(element => {
          suma += element.total
        });
        if(suma < 60 && suma != 0)
          suma += 4.95;
        return  parseFloat(suma).toFixed(2);
      },
      getIsAdmin(){
        return this.user.email == 'sergio8999@gmail.com';
      }    
    },
    firestore:{
      cart: db.collection('cart'),
      categories : db.collection('categories')
    }
}
</script>

<style scoped lang="scss">
@import "@/scss/app.scss";

  .the-header {
    .logo{
      width: 2.6rem;
    }
    .navbar{
      font-size: 1rem; 

      @media (min-width: 960px) {
        min-height: 4.2rem;
        font-size: 1.1rem;
      }
    }
    .navbar-nav .dropdown-menu{
        background-color: #35435b!important;
    }
  }
</style>
