<template>
  <section class="profile d-flex">
    <div class="aside d-none d-lg-block">
      <h4 class="aside-title ml-2 pt-5">Pefil</h4>
      <div class="d-flex flex-column align-items-center">
        <ul class="nav flex-column align-items-start w-100 mt-4">
          <router-link class="nav-link d-flex justify-content-start text-light w-100 bg-hover p-0" :to="{name:'PersonalInformation',params:{id:'informacion-personal'}}" :class="[getRoute =='PersonalInformation' ? 'active' : '']">
            <li class="nav-item w-100 p-2">
              Información personal
            </li> 
          </router-link>
          <router-link class="nav-link d-flex justify-content-start text-light w-100 bg-hover p-0" :to="{name:'OrderProfile',params:{id:'pedidos'}}" :class="[getRoute =='OrderProfile' ? 'active' : '']">
            <li class="nav-item w-100 p-2">
              Pedidos
            </li> 
          </router-link>
          <router-link class="nav-link d-flex justify-content-start text-light w-100 bg-hover p-0" :to="{name:'AppointmentProfile',params:{id:'AppointmentProfile'}}" :class="[getRoute =='AppointmentProfile' ? 'active' : '']">
            <li class="nav-item w-100 p-2">
              Citas
            </li> 
          </router-link>
        </ul>
      </div>      
    </div>
    <div class="content">
      <div>
        <b-button v-b-toggle.sidebar-backdrop class="btn-arrow d-block d-lg-none mx-3 my-3"><font-awesome-icon :icon="['fas', 'long-arrow-alt-right']"/></b-button>
        <b-sidebar
          id="sidebar-backdrop"
          title="Perfil"
          backdrop-variant="dark"
          body-class="sidebar"
          backdrop
          shadow
          class="d-block d-lg-none"
          v-model="visible"
        >
        <div class="px-3 py-2">
           <div class="d-flex flex-column align-items-center">
            <ul class="nav flex-column align-items-start w-100 mt-4">
              <router-link class="nav-link d-flex justify-content-start w-100  p-0" :to="{name:'OrderProfile',params:{id:'pedidos'}}" :class="[getRoute =='OrderProfile' ? 'active' : '']">
                <li @click="hideSidebar"  class="nav-item w-100 p-2">
                  Pedidos
                </li> 
              </router-link>
              <router-link class="nav-link d-flex justify-content-start w-100  p-0" :to="{name:'AppointmentProfile',params:{id:'AppointmentProfile'}}" :class="[getRoute =='AppointmentProfile' ? 'active' : '']">
                <li @click="hideSidebar"  class="nav-item w-100 p-2">
                  Citas
                </li> 
              </router-link>
            </ul>
          </div>      
        </div>
      </b-sidebar>
    </div>
    <router-view></router-view>
    </div> 
  </section>
</template>

<script >

  export default  {
    name: 'profile',
    props: [],
    mounted () {
      
    },
    data () {
      return {
        visible: false
      }
    },
    methods: {
      hideSidebar(){
        this.visible = false;
      }
    },
    computed: {
      getRoute(){
        return this.$route.name;
      }
    }
}
</script>

<style scoped lang="scss">
@import "@/scss/app.scss";

.profile {   
  min-height: 90vh;

    .btn-arrow{
      background-color: $primary;

      &:hover{
        background-color: lighten($primary, 3);
      }
    }

    .aside{
      width: 15rem;
      background-color: $primary;
      opacity: .95;

      &-title{
        color: $cyan;
      }

      .active{
        color: $primary !important;
        background-color: $cyan;
      }

      .bg-hover :hover{
        background-color: $cyan;
        color: $primary;
      }
    }

    .content{
      width: 100%;
      background-color: #ebedef;
    }
  }
</style>
