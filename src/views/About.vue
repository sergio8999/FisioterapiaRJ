<template>
  <div class="about pb-5">
    <b-breadcrumb>
      <b-breadcrumb-item to="/">
        <b-icon icon="house-fill" scale="1.25" shift-v="1.25" aria-hidden="true"></b-icon>
        Home
      </b-breadcrumb-item>
      <b-breadcrumb-item active>Sobre nosotros</b-breadcrumb-item>
    </b-breadcrumb>
    <div class="container">
      <h1 class="my-3 text-center">Sobre nosotros</h1>
      <b-row class="w-100 m-0">
        <b-col cols="12" md="6">
          <h3 class="mt-3 mb-1">Nuestra Filosofía</h3>
          <p>Nuestra filosofía como centro clínico se encuadra en 3 tipos de enfoques: la prevención, el tratamiento y el entrenamiento para la salud.</p>
          <h5 class="mt-3 mb-1">La Prevención</h5>
          <p>Nuestros Fisioterapeutas trabajan en la prevención de futuros problemas mediante el razonamiento clínico, la educación, el entrenamiento y las terapias manuales como estrategias para conseguirlo.</p>
          <h5 class="mt-3 mb-1">El Tratamiento</h5>
          <p>Combinamos la parte pasiva y activa para tener un resultado óptimo. Utilizamos la terapia manual además de técnicas instrumentales como fibrólisis, punción seca, vendajes, neurodinámica entre otros.</p>
          <h5 class="mt-3 mb-1">El Entrenamiento para la Salud</h5>
          <p>Con el entrenamiento compuesto por ejercicios personalizados para cada paciente, conseguimos que los beneficios de los tratamientos se mantengan brindando la mejor calidad.</p>
        </b-col>
        <b-col cols="12" md="6" class="map mt-3 mt-lg-0">
          <l-map
            :zoom="zoom"
            :center="center"
            :options="mapOptions"
            style="height: 80%"
          >
            <l-tile-layer
                :url="url"
                :attribution="attribution"
            />
            <l-marker :lat-lng="withTooltip">
              <l-tooltip :options="{ permanent: true, interactive: true }">
                <div>
                  Fisioterapia RJ
                </div>
              </l-tooltip>
            </l-marker>
          </l-map>
          <b-row>
            <b-col>
              Dirección: Pasaje de teba, 3
            </b-col>
          </b-row>
          <b-row class="mt-2">
            <b-col>
              <ul>
                <li>Contacto:</li>
                <li>Telf: 6225478</li>
                <li> Lunes a viernes:</li>
                <li>10:00 a 14:00 | 17:00 a 21:00</li>
              </ul>
            </b-col>
          </b-row>
        </b-col>
      </b-row> 
    </div>
  </div>
</template>

<script lang="js">
 import { latLng } from "leaflet"; 

export default {
  computed: {
    
  },
  data(){
    return{
      zoom: 15,
      center: latLng(37.198493343208106, -3.6000748726970953),
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      withTooltip: latLng(37.198493343208106, -3.6000748726970953),
      mapOptions: {
        zoomSnap: 0.5
      }, 
    }
  },
  methods: {
    
  }
}

</script>
<style scoped lang="scss">

  .about{

    .map{
      width: 50%;
      height: 30rem;
    }

    a{
      color: #35435b;
    }

    li{
      list-style: none;
    }
  }
</style>