<template >
  <section class="the-login">
    <b-breadcrumb>
      <b-breadcrumb-item to="/">
        <b-icon icon="house-fill" scale="1.25" shift-v="1.25" aria-hidden="true"></b-icon>
        Home
      </b-breadcrumb-item>
      <b-breadcrumb-item active>Login</b-breadcrumb-item>
    </b-breadcrumb>
    <div class="d-flex justify-content-center align-items center mb-3">
      <div class="d-flex flex-column align-items-center justify-content-center w-100">
        <h1 class="text-center mb-3">Inicie sesión:</h1>
        <div class="form">
          <div class="form-group">
            <label for="exampleInputEmail1">Email</label>
            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="userData.email" placeholder="Introduce email">
          </div>
          <div class="form-group">
            <label for="exampleInputPassword1">Contraseña</label>
            <input type="password" class="form-control" id="exampleInputPassword1" v-model="userData.password" placeholder="Contraseña">
          </div>
          <a @click="resetPassword">¿Has olvidado la contraseña?</a>
          <button type="submit" class="btn btn-principal btn-size" @click="login('email')">Iniciar sesión</button>
        </div>
        <span class="my-3">o</span>
        <div class="social-network d-flex justify-content-around">
          <b-button @click="login('google')" class="btn-google w-100 "><font-awesome-icon class="mr-2" :icon="['fab', 'google']"/> Google</b-button>
        </div>
        <div class="terms">
          <hr>
          <p class="text-center">Al iniciar sesión, acepta nuestros <span data-toggle="modal" data-target="#termsModal">Términos y condiciones</span> y la <span data-toggle="modal" data-target="#privacyModal">Politica de privacidad</span></p>
          <hr>
          <p class="ml-4">&copy; Copyrigth FisioterapiaRJ</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Swal from 'sweetalert2'
import { auth } from '../db.js'

  export default  {
    name: 'TheLogin',
    props: [],
    mounted () {
      if(this.user != null)
        this.$router.push('/')
    },
    data () {
      return {
        userData: {
          email: "",
          password: ""
        }
      }
    },
    methods: {
      resetData(){
        this.userData.email = this.userData.password = "";
      },
      async login(correo){
        try{
          await this.$store.dispatch('user/login', {
            email: this.userData.email,
            password: this.userData.password,
            red: correo
          });
          this.showNotification("Logueado correctamente","success")
          this.resetData();
          this.$router.push('/');
        }catch(error){
          if(error.code == "auth/invalid-email")
            this.showNotification("La dirección de correo electrónico está mal escrita","error");
          else if(error.code == "auth/wrong-password")
            this.showNotification("La contraseña no es válida.", "error");
          else if(error.code  == "auth/user-not-found")
            this.showNotification("No hay registro de usuario correspondiente a este identificador.","error");
          else if(error.code == 'auth/account-exists-with-different-credential')
            this.showNotification("Ya existe una cuenta con la misma dirección de correo electrónico.","error");
        }
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
      async resetPassword(){
        const { value: email } = await Swal.fire({
          title: 'Recupere su contraseña',
          input: 'email',
          showCancelButton: true,
          confirmButtonText: 'Enviar',
          cancelButtonText: 'Cancelar',
          cancelButtonColor: '#d33',
          inputLabel: 'Email',
          inputPlaceholder: 'Introduzca su email'
        })
        try{
          await auth.sendPasswordResetEmail(email);
          console.log('realizado');
          if (email) {
            Swal.fire('Mensaje enviado',`${email}`,'success')
          }
        }catch(e){
          if(e.code == 'auth/user-not-found'){
            Swal.fire('Error',`No hay ningún registro de usuario que corresponda a este identificador`,'error')
          }
        }
      }
    },
    computed: {

    }
}


</script>

<style scoped lang="scss">
@import '../scss/app.scss';
  .the-login {

    .form{
      width: 90%;

      @media (min-width: 960px) {
          width: 30%;
      }
        
      .btn-size{
      width: 100%;
      }
    }

    .social-network{
      width: 90%;

      @media (min-width: 960px) {
          width: 30%;
      }

      span{
          display: flex;
          justify-content: center;
          align-items: center;
          i{
              cursor: pointer;
              font-size: 2.5rem;
          }
      }
    }

    .btn-google{
      font-size: 1.3rem;
      display: flex;
      justify-content: center;
      align-items: center;
      color: $cyan;
      background-color: white;
      border: 2px solid $cyan;

      &:hover{
        background-color: darken(white, 3);
      }
    }

    .terms{
      width: 90%;

      @media (min-width: 960px) {
        width: 30%;
      }

      span{
          color: $color-blue;
          cursor: pointer;
      }
    }
    
    a{
      cursor: pointer;
    }
  }
</style>
