<template >
  <section class="sign-up">
        <b-breadcrumb>
            <b-breadcrumb-item to="/">
                <b-icon icon="house-fill" scale="1.25" shift-v="1.25" aria-hidden="true"></b-icon>
                Home
            </b-breadcrumb-item>
            <b-breadcrumb-item active>Registrar</b-breadcrumb-item>
        </b-breadcrumb>
        <div class="d-flex justify-content-center align-items center mb-3">
            <div class="d-flex flex-column align-items-center justify-content-center w-100">
                <h1 class="text-center mb-3">Crea una cuenta:</h1>
                <div class="form" >
                    <div class="form-group">
                        <label for="exampleInputName1">Nombre</label>
                        <input type="text" class="form-control" id="exampleInputName1" aria-describedby="nameHelp" v-model="userData.name" placeholder="Introduce nombre">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Email</label>
                        <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="userData.email" placeholder="Introduce email">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">Contraseña</label>
                        <input type="password" class="form-control" id="exampleInputPassword1" v-model="userData.password" placeholder="Contraseña">
                    </div>
                    <button class="btn btn-principal btn-size" @click="register" >Registrar</button>
                </div>
                <span class="my-3">o</span>
                <div class="social-network d-flex justify-content-around">
                    <b-button @click="login('google')" class="btn-google w-100"><font-awesome-icon class="mr-3" :icon="['fab', 'google']"/> Google</b-button>
                </div>
                <div class="terms">
                    <hr>
                    <p class="text-center">Al crear cuenta, acepta nuestros <span data-toggle="modal" data-target="#termsModal">Términos y condiciones</span> y la <span data-toggle="modal" data-target="#privacyModal">Politica de privacidad</span></p>
                    <hr>
                    <p class="ml-4">&copy; Copyrigth FisioterapiaRJ</p>
                </div>
            </div>

        </div>  
    </section>
</template>

<script>
import { mapState } from 'vuex'
import Swal from 'sweetalert2'

  export default  {
    name: 'sign-up',
    props: [],
    mounted () {

    },
    data () {
        return {
            userData: {
                name: "",
                email: "",
                password: ""
            }
        }
    },
    methods: {
        resetData(){
            this.userData.email = this.userData.password = this.userData.name = "";
        },
        async register(){
            if(this.userData.name !="")
                try{
                await this.$store.dispatch('user/register', {
                    email: this.userData.email,
                    password: this.userData.password,
                    name: this.userData.name
                });
                this.showNotification("Cuenta creada correctamente","success");
                await this.$store.dispatch('user/checkEmail');
                this.resetData();
                this.$router.push('/');
                }catch(error){
                    if (error.code == "auth/invalid-email")
                        this.showNotification("La dirección de correo electrónico está mal escrita.","error");
                    else if(error.code == "auth/weak-password")
                        this.showNotification("La contraseña debe tener 6 caracteres o más.","error");
                    else if( error.code == "auth/email-already-in-use")
                        this.showNotification("La dirección de correo electrónico ya está siendo utilizada por otra cuenta","error");
                }
            else
                this.showNotification("Debe introducir nombre","error");
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
        ...mapState('user', ['user'])
    }
}
</script>

<style scoped lang="scss">
@import '../scss/app.scss';
  .sign-up {

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
  }
</style>
