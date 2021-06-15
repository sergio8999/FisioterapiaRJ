<template>
  <section class="appointment-profile container">
    <h1 class="text-center">Historial de citas</h1>
    <p class="small">*Solo se podrán cancelar con 24h de antelación</p>
    <b-row cols="1" cols-md="2" cols-lg="3" class="mt-3">
      <b-col col offset="1" offset-lg="0" class="m-0 mb-4" v-for="(appointment,index) in appointmentsUser" :key="appointment.id">
        <b-card
        border-variant="info"
        :header="'Cita ' + (index+1)"
        header-bg-variant="info"
        header-text-variant="white"
        align="center"
        >
          <b-card-text>
            <div class="d-flex justify-content-lg-between p-2">
              <div class="text-left">
                <p>Dia: {{getDay(appointment.day)}}</p>
                <p>Hora: {{appointment.hour}}</p>
              </div>
              <b-button class="btn-delete" @click="deleteAppointment(appointment.id)" v-if="checkDelete(appointment.day,appointment.hour)"><font-awesome-icon icon="trash-alt" class="lead btn-delete-icon"/></b-button>
            </div>
          </b-card-text>
        </b-card>
      </b-col>
    </b-row>
  </section>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import { db } from '../db'
import Swal from 'sweetalert2'

  export default  {
    name: 'appointment-profile',
    props: [],
    mounted () {

    },
    data () {
      return {
        appointments:null
      }
    },
    methods: {
      getDay(day){
        return moment(day).format('DD-MM-YYYY')
      },
      checkDelete(fecha, hora){
        if(moment().add('1','days') < moment(fecha+ " "+ hora))
          return true;
        return false;
      },
      deleteAppointment(id){
        Swal.fire({
          title: 'Esta seguro que desa cancelar la cita?',
          text: "No podras revertir este cambio!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, borrar!',
          cancelButtonText: 'Cancelar'
        })
        .then((result) => {
          if (result.isConfirmed) {
            db.collection('appointments').doc(id).delete();
            Swal.fire(
              'Borrado!',
              'La cita fue cancelada fue borrado',
              'success'
            )
          }
        })
      }
    },
    computed: {
      ...mapState('user',['user']),
      appointmentsUser(){
        let appointmentsUser = [];
          if(this.user != null){
            appointmentsUser = this.appointments.filter((appointment)=>{
              return appointment.user == this.user.email
            })
          }
        return appointmentsUser;
      }
    },
    firestore:{
      appointments:db.collection('appointments').orderBy('date')
    }
}
</script>

<style scoped lang="scss">
  .appointment-profile {
    .btn-delete{
      background-color: #dc3545;
      height: 3rem;
      transition: all .5s;

      &:hover{
          border: 1px solid #dc3545;
          background-color: white;

          .btn-delete-icon{
              color: #dc3545;
          }
      }
    
      &-icon{
          color: white;
      }

      &-icon{
          color: white;

          &:hover{
              color: #dc3545;
          }
      }
    }
  }
</style>
