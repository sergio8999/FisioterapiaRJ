<template>
  <section class="personal-information container d-flex flex-column justify-content-center">
    <h1>Datos personales</h1>
    <div>
      <h3>Datos de mi cuenta</h3>
      <p>Email: {{user.email}}</p>
      <p>Nombre: {{user.displayName}}</p>
    </div>
    <div class="mt-3">
      <h3>Datos personales y dirección de envío</h3>
    </div>
    <div>
      <b-button @click="show=true" class="btn-principal" v-if="address==null">Añadir dirección</b-button>
      <div v-if="address!=null">
        <p>{{address.direction}} . {{address.cp}} {{address.population}} ({{address.province}}). {{address.country}}</p> 
        <b-button @click="getAdress" class="btn-principal mt-2">Editar dirección</b-button>
      </div>
      <b-modal
        v-model="show"
        title="Direccion de envio"
        hide-footer
      >
        <b-container fluid>
          <form action="" @submit.prevent="saveDirection" @reset.prevent="cancelDirection">
            <b-row class="mb-1">
              <b-col sm="12">
                <label for="direction">Dirección de envio:</label>
                <input type="text" class="form-control" v-model="form.direction" placeholder="Dirección" id="direction" required>
              </b-col>
            </b-row>
            <b-row class="mb-1">
              <b-col sm="12" lg="6">
                <label for="cp">Codigo Postal:</label>
                <input type="text" maxlength="5" class="form-control" v-model="form.cp" placeholder="Código Postal" id="cp" required>
              </b-col>
              <b-col sm="12" lg="6">
                <label for="population">Población:</label>
                <input type="text" class="form-control" v-model="form.population" placeholder="Población" id="population" required>
              </b-col>
            </b-row>
            <b-row class="mb-1">
              <b-col sm="12" lg="6">
                <label for="country">País:</label>
                <input type="text" class="form-control" v-model="form.country" placeholder="Ciudad" id="country" required>
              </b-col>
              <b-col sm="12" lg="6">
                <label for="provnce">Provincia:</label>
                <input type="text" class="form-control" v-model="form.province" placeholder="Provincia" id="province" required>
              </b-col>
            </b-row>
            <div class="d-flex justify-content-between mt-3">
              <b-button class="btn-danger" type="reset">Cancelar</b-button>
              <b-button class="btn-principal" type="submit">Enviar</b-button>
            </div>
          </form>
        </b-container>
      </b-modal>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { db } from '../db'
import Swal from 'sweetalert2'


  export default  {
    name: 'personal-information',
    props: [],
    async mounted () {
      let response = await this.$bind('address',db.collection('addresses').where('user','==',this.user.email));
      this.address = response[0];
    },
    data () {
      return {
        form:{
          direction: "",
          cp: "",
          population: "",
          country: "",
          province: ""
        },
        show:false,
        address: null,
      }
    },
    methods: {
      async saveDirection(){
        if(this.address !=null){
          db.collection('addresses').doc(this.address.id).update({
            direction: this.form.direction,
            cp: this.form.cp,
            population: this.form.population,
            country: this.form.country,
            province: this.form.province
          })
          this.showNotification('Cambio realizado con éxito','success');
        }else{
          db.collection('addresses').add({
            direction: this.form.direction,
            cp: this.form.cp,
            population: this.form.population,
            country: this.form.country,
            province: this.form.province,
            user: this.user.email
          })
          this.showNotification('Dirección agregada con éxito','success');
        }
        this.show = false; 
        let response = await this.$bind('address',db.collection('addresses').where('user','==',this.user.email));
        this.address = response[0];     
      },
      cancelDirection(){
        this.form.direction = "";
        this.form.cp = "";
        this.form.population = "";
        this.form.country = "";
        this.form.province = "";
        this.show = false;
      },
       getAdress(){
        this.form.direction = this.address.direction;
        this.form.cp = this.address.cp;
        this.form.population = this.address.population;
        this.form.country = this.address.country;
        this.form.province = this.address.province;
        this.show = true;
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
      }

    },
    computed: {
      ...mapState('user',['user'])
    }
}


</script>

<style scoped lang="scss">
@import "@/scss/app.scss";

  .personal-information {

  }
</style>
