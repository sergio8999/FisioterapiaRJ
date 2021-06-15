<template>
  <section class="add-product container d-flex justify-content-center align-items-center">
    <b-row class="flex-column w-100">
      <b-col offset-lg="2" lg="8" class="form p-5">
        <h2 class="text-center">Nuevo producto</h2>
        <div class="line my-3"></div>
        <form @submit.prevent="addProduct" @reset="reset">
          <div class="form-group row">
            <label for="name" class="col-sm-2 col-form-label">Nombre:</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" v-model="form.name" placeholder="Nombre" id="name" required>
            </div>
          </div>
          <div class="form-group row">
            <label for="description" class="col-sm-2 col-form-label">Descripción:</label>
            <div class="col-sm-10">
              <textarea class="form-control resize" aria-label="With textarea" v-model="form.description" placeholder="Descripcion" name="description" required></textarea>
            </div>
          </div> 
          <div class="form-group row">
            <label for="category" class="col-sm-2 col-form-label">Categoria:</label>
            <div class="col-sm-10">
              <b-form-select v-model="selected" class="mb-3">
                  <b-form-select-option v-for="category in categories" :key="category.id" :value="category.name">{{category.name}}</b-form-select-option>
              </b-form-select>
            </div>
          </div> 
          <div class="form-row">
            <div class="form-group col-md-6">
                <label for="price">Precio:</label>
                <input type="number" class="form-control" min="0" v-model="form.price" placeholder="Precio" id="price" step="any" required>
            </div>
            <div class="form-group col-md-6">
                  <label for="stock">Stock:</label>
                  <input type="number" class="form-control" min="0" v-model="form.stock" placeholder="Stock" id="stock" required>
            </div>
          </div>
          <div class="form-group row">
              <label for="feature" class="col-sm-2 col-form-label">Caracteristicas:</label>
            <div class="col-sm-9">
                <input type="text" v-model="form.feature" class="form-control" placeholder="Escribe caracteristica" id="feature" >
            </div>
            <div class="col-sm-1 d-flex justify-content-end">
                <b-button class="btn-principal" @click="addFeature">+</b-button>
            </div>
          </div>
          <div class="form-group row">
            <div class=" offset-sm-2 col-sm-9">
                <ol>
                  <li v-for="(feature,index) in features" :key="feature" class="mt-1">
                    <b-row>
                      <b-col cols="10" class="word-break">
                        {{feature}}
                      </b-col>
                      <b-col cols="2" class="d-flex align-items-center">
                        <b-button variant="outline-danger" @click="deleteFeature(index)"><font-awesome-icon icon="trash-alt" class="lead"/></b-button>
                      </b-col>
                    </b-row>
                  </li>
                </ol>
            </div>
          </div>
          <div class="form-group row">
            <label for="image" class="col-sm-2 col-form-label">Imagen:</label>
            <div class="col-sm-10">
              <b-form-file
                v-model="file1"
                :state="Boolean(file1)"
                placeholder="Elija un archivo o suéltelo aquí ..."
                browse-text="Elegir"
                drop-placeholder="Drop file here..."
                @change="previewImage"
                accept="image/*"
                required
              ></b-form-file>
            </div>
          </div> 
          <div class="form-group row">
            <label for="image" class="col-sm-2 col-form-label"></label>
            <div class="col-sm-10">
              <div class="mt-2">
                <img :src="img1" class="image" id="img" alt="Imagen" :class="[file1==null ? 'display' :'']"/>
              </div>
            </div>
          </div> 
          <div class="form-group row mt-2">
            <label for="carousel" class="col-sm-2 col-form-label">Carousel:</label>
            <div class="col-sm-10">
              <b-form-file
                v-model="carousel"
                :state="Boolean(carousel.length !=0)"
                placeholder="Elija un archivo o suéltelo aquí ..."
                browse-text="Elegir"
                drop-placeholder="Drop file here..."
                @change="previewImages"
                accept="image/*"
                multiple
                required
              ></b-form-file>
            </div>
          </div> 
          <div class="form-group row mt-2">
            <label for="carousel" class="col-sm-2 col-form-label"></label>
            <div class="col-sm-10">
              <div id="divCarousel" class="mt-3">
                <img v-for="image in previewCarousel" :key="image" :src="image" class="image mr-2 mt-2" id="img" alt="Imagen"/>
              </div>
            </div>
          </div>   
          <div class="d-flex justify-content-between mt-4">
            <b-button class="bg-danger text-light" type="reset" >Resetear</b-button>
            <b-button class="btn-principal text-light" type="submit">Enviar</b-button>
          </div>
        </form>
      </b-col>  
    </b-row>
  </section>
</template>

<script>
import { db, storage , fb } from '../db'  
import Swal from 'sweetalert2'
import moment from 'moment'

  export default  {
    name: 'add-product',
    props: [],
    mounted () {

    },
    data () {
      return {
        form: {
          name:'',
          description:'',
          price:'',
          stock:'',
          feature:""
        },
        features:[],
        file1: null,
        img1:null,
        img2:null,
        imageData:null,
        selected:"Electroterapia",
        categories:null,
        carousel:[],
        previewCarousel:[],
        imageCarousel:null,
        id:''
      }
    },
    methods: {
      addFeature(){
        if(this.form.feature !=""){
          this.features.push(this.form.feature);
          this.form.feature = "";
        }
      },

      deleteFeature(index){
        this.features.splice(index,1);
      },

      previewImages: function(event){   
        this.previewCarousel = [];    
        this.imageCarousel = event.target.files;
        for(let i=0;i<this.imageCarousel.length;i++){
          var reader = new FileReader();
          reader.onload = (e) => {
            this.img2 = e.target.result;
            this.previewCarousel.push(this.img2);
          }
          reader.readAsDataURL(this.imageCarousel[i]);
        }
      },
      previewImage: function(event){       
        this.imageData = event.target.files[0];
        var reader = new FileReader();
        reader.onload = (e) => {
           this.img1 = e.target.result;
        }
        reader.readAsDataURL(this.imageData);
      },
      upload(params,image){
        let name = image.name + moment().valueOf();
        const storageRef=storage.ref(this.selected+'/'+ name).put(image);   
        storageRef.on(`state_changed`,()=>{
          },
          error=>{console.log(error.message)},
          ()=>{
            storageRef.snapshot.ref.getDownloadURL().then((urlImage)=>{
              if(params =='carousel')
                db.collection('products').doc(this.id).update({
                  carousel: fb.firestore.FieldValue.arrayUnion(urlImage)
                }) 
              else
                db.collection('products').doc(this.id).update({
                  url:urlImage
                })  
              });
            }      
          ); 
      },
      async addProduct(){
        db.collection('products').add({
          name: this.form.name,
          description: this.form.description,
          carousel: [],
          category: this.selected,
          stock: parseInt(this.form.stock),
          features: this.features,
          price: parseFloat(this.form.price),
          rating:0,
          url:""
        }) 
        await db.collection("products").where("url", "==", "")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
          this.id = doc.id;
          console.log(this.id);
          db.collection('products').doc(doc.id).update({
            slug:this.createSlug(this.form.name),
          })
          });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
        this.upload('image',this.imageData);
        this.imageCarousel.forEach(image=>{
          this.upload('carousel',image);
        })
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Producto guardado correctamente',
          showConfirmButton: false,
          timer: 1500
        })
        setTimeout(()=>{
          this.reset();
        },1500)
      },
      reset(){
        this.form.name = "";
        this.form.description = "";
        this.form.price = "";
        this.form.stock = "";
        this.form.feature = "";
        this.features = [];
        this.file1 = null;
        this.img1 = null;
        this.img2 =null;
        this.imageData =null;
        this.selected = "Electroterapia";
        this.carousel = [];
        this.previewCarousel = [];
        this.imageCarousel = null;
        this.id = "";
      },
      createSlug(text){
        text = text + "-" + this.id;
        return text.replace(/\s+/g, '-');
      }
    },
    computed: {

    },
    firestore:{
      categories : db.collection('categories')
    }
}
</script>

<style scoped lang="scss">

  .add-product {
    min-height: 92vh;
    .line{
        border:1px solid #ebedef;
    }

    .form{
        border-radius:10px;
        background-color: white;
    }

    .image{
        width: 11rem;
        height: 9rem;
        object-fit: cover;
    }

    .display{
      display: none;
    }

    .resize{
      resize: none;
    }

    .word-break{
      word-break: break-all
    }
  }
</style>
