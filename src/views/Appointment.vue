<template>
  <section class="appointment">
    <b-breadcrumb>
      <b-breadcrumb-item to="/">
        <b-icon icon="house-fill" scale="1.25" shift-v="1.25" aria-hidden="true"></b-icon>
        Home
      </b-breadcrumb-item>
      <b-breadcrumb-item active>Citas</b-breadcrumb-item>
    </b-breadcrumb>
    <div class="container">
      <h1 class="text-center">Citas</h1>
      <div class="my-3 d-flex justify-content-center div-img">
        <img src="https://firebasestorage.googleapis.com/v0/b/tienda-proyecto-183e3.appspot.com/o/hall.jpg?alt=media&token=e3c52a0a-4f28-4357-a656-9ea6d3736041" alt="hall">
      </div>
      <div>
        <p class="mt-3">Bienvenidos a nuestra clínica Fisioterapia RJ. Diseñaremos e implementaremos un plan de tratamiento personalizado para cada paciente con el fin de aliviar su dolor y de restaurar su movilidad física.</p>
        <p class="mt-3">Seleccione el dia y la hora que mejor se adapte a usted. Estamos abiertos en nuestra clínica de Lunes a Viernes de 08:00 a 14:00 y de 17:00 a 21:00. Consulte <span class="about-span" @click="sendAbout">nuestra dirección</span>.</p>
      </div>
      <b-row class="my-5">
        <b-col cols="12" lg="6">
          <Calendar 
            v-model="value" 
            inline
            :min-date="new Date()"
            :disabledDays="[0,6]"
            :disabledDates="invalidDates"
            dateFormat="dd.mm.yy" 
            @date-select="disabledHour"
          />
        </b-col>
        <b-col cols="12" md="6" lg="3" class="mt-2">
          <div>
            <label for="time" class="col-sm-2 col-form-label px-0">Hora:</label>
            <b-form-select id="time" v-model="selected" :options="options"></b-form-select>
          </div>
        </b-col>
        <b-col cols="12" md="6" lg="2">
          <br>
          <b-button class="btn-principal mt-2 mt-lg-3 w-100" @click="setAppointment">Pedir cita</b-button>
        </b-col>
        <b-col cols="12">
          <p class="small">*Solo podrá cancelar la cita con 24h de antelación</p>
        </b-col>
      </b-row>
    </div>
  </section>
</template>

<script>
import moment from 'moment'
import { db } from '../db';
import { mapState } from 'vuex';
import Swal from 'sweetalert2'

  export default  {
    name: 'appointments',
    props: [],
    async mounted () {
      this.changeToSpanish();
      await this.$bind('apointments',db.collection('apointments'));
      this.disabledDays();
    },
    data () {
      return {
        value: null,
        selected:"10:00",
        options: [
          { value: '10:00', text: '10:00', 'disabled':false },
          { value: '11:00', text: '11:00', 'disabled':false },
          { value: '12:00', text: '12:00', 'disabled':false },
          { value: '13:00', text: '13:00', 'disabled':false },
          { value: '17:00', text: '17:00', 'disabled':false },
          { value: '18:00', text: '18:00', 'disabled':false },
          { value: '19:00', text: '19:00', 'disabled':false },
          { value: '20:00', text: '20:00', 'disabled':false },
        ],
        invalidDates:[] ,
        appointments:null               
      }
    },
    methods: {
      changeToSpanish() {
        this.$primevue.config.locale.accept = 'Aceptar';
        this.$primevue.config.locale.reject = 'Rechazar';
        this.$primevue.config.locale.firstDayOfWeek=1;
        this.$primevue.config.locale.dayNames= ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        this.$primevue.config.locale.dayNamesShort= ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sáb"];
        this.$primevue.config.locale.dayNamesMin= ["Do","Lu","Ma","Mi","Ju","Vi","Sa"];
        this.$primevue.config.locale.monthNames= ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
        this.$primevue.config.locale.monthNamesShort= ["Ene", "Feb", "Mar", "Abr", "May", "Jun","Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
      },
      disabledHour(){
        this.selected = '10:00';
        this.options.forEach((option)=>{
          option.disabled = false;
        });          
        this.options.forEach((option)=>{
          if(moment().format('YYYY-MM-DD') == moment(this.value).format('YYYY-MM-DD') && moment().format('hh:mm') >= option.value)
            option.disabled = true;
        })
        let day = moment(this.value,'YYYY-MM-DD').format('YYYY-MM-DD');
        this.appointments.forEach((appointment)=>{
          if(appointment.day == day){
            for(let i=0;i<this.options.length;i++){
              if(appointment.hour == this.options[i].value){
                this.options[i].disabled = true; 
                }
            } 
            let selected = false;
            this.options.forEach((option)=>{
              if(!selected && !option.disabled){
                  this.selected = option.value;
                  selected = true;
              }
            })
          }
        })
        this.disabledDays();
      },
      disabledDays(){
        let total = 1;  
        for(let i=0;i<this.appointments.length;i++){
          if(i < this.appointments.length-1){
            if(this.appointments[i].day == this.appointments[i+1].day)
              total++;
            else
              total = 1;
            }
          if(total == 8){
            this.invalidDates.push(moment(this.appointments[i].day,'YYYY-MM-DD').toDate()) 
            total = 1;
          } 
        } 
      },
      async setAppointment(){
        if(this.user == null)
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Debe estar logueado',
            showConfirmButton: false,
            timer: 1500
          })
        else if(this.value == null)
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Seleccione dia',
            showConfirmButton: false,
            timer: 1500
          })
          else if(!this.checkAppointment())
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'Cita ocupada, seleccione otro dia/hora',
              showConfirmButton: false,
              timer: 1500
          })
          else{
            await db.collection('appointments').add({
                date: moment(this.value, 'YYYY-MM-DD HH:mm').add(this.selected,'hours').format('DD-MM-YYYY HH:mm'), 
              day:  moment(this.value,'YYYY-MM-DD').format('YYYY-MM-DD'),
              hour: this.selected,
              user: this.user.email
            })
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Cita pedida correctamente',
              showConfirmButton: false,
              timer: 1500
            })
            await this.$bind('apointments',db.collection('apointments'));
            this.disabledHour();
          }
      },
      checkAppointment(){
        let status=true;
        this.appointments.forEach((appointment)=>{
          if(appointment.day == moment(this.value,'YYYY-MM-DD').format('YYYY-MM-DD') && appointment.hour == this.selected)
            status = false;
        })
        return status;
      },
      sendAbout(){
        this.$router.push('/about');
      }
    },
    computed: {
      ...mapState('user',['user']),
    },
    firestore:{
        appointments: db.collection('appointments').orderBy('day')
    }
}
</script>

<style scoped lang="scss">
@import "@/scss/app.scss";

  .appointment {
    .div-img{
      width: 100%;
      height: 23rem;

      img{
        width: 100%;
        object-fit: cover;
      }
    }

    .about-span{
      color: $cyan;
      cursor: pointer;
    }
  }
</style>
