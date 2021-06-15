<template>
  <section class="edit-product container d-flex justify-content-center align-items-center">
    <b-row class="flex-column w-100 my-3">
      <b-col offset-lg="2" lg="8" class="form p-5">
        <h2 class="text-center">Editar producto</h2>
        <div class="line my-3"></div>
        <form @submit.prevent="updateProduct" @reset.prevent="reset">
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
                    <b-col b-col cols="2" class="d-flex align-items-center">
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
              ></b-form-file>
            </div>
          </div> 
          <div class="form-group row">
            <label for="image" class="col-sm-2 col-form-label"></label>
            <div class="col-sm-10">
              <div class="mt-2">
                <img :src="img1" class="image" id="img" alt="Imagen" />
              </div>
            </div>
          </div> 
          <div class="form-group row mt-2">
            <label for="carousel" class="col-sm-2 col-form-label">Carousel:</label>
            <div class="col-sm-10">
              <div v-for="(image,index) in previewCarousel" :key="image" class="mt-2">
                <img  :src="image" class="image mr-2 mt-2" id="img" alt="Imagen"/>
                <span class="btn btn-delete-carousel ml-2" @click="deleteImages(image, index)"><font-awesome-icon icon="trash-alt" class="lead btn-delete-carousel-icon"/></span> 
              </div>
            </div>
          </div> 
          <div class="form-group row mt-2">
            <label for="carousel" class="col-sm-2 col-form-label">Añadir:</label>
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
              ></b-form-file>
            </div>
          </div> 
          <div class="form-group row mt-2">
            <label for="carousel" class="col-sm-2 col-form-label"></label>
            <div class="col-sm-10">
              <div id="divCarousel" class="mt-3">
                <img v-for="image in newImagesCarousel" :key="image" :src="image" class="image mr-2 mt-2" id="img" alt="Imagen"/>
              </div>
            </div>
          </div>    
          <div class="d-flex justify-content-between mt-4">
            <b-button class="bg-danger text-light" type="reset" >Resetear</b-button>
            <b-button class="bg-primary text-light" type="submit">Actualizar</b-button>
          </div>
        </form>
      </b-col>  
    </b-row>
  </section>
</template>

<script > 
import { db, fb, storage } from '../db'
import Swal from 'sweetalert2'
import moment from 'moment'

  export default  {
    name: 'edit-product',
    props: [],
    mounted () {
      let id = this.$route.params.slug;
      let arrayId = id.split('-');
      this.idProduct = arrayId[arrayId.length - 1];
      db.collection('products').doc(this.idProduct).get()
      .then(doc => {
        this.form.name = doc.data().name;
        this.form.description = doc.data().description;
        this.selected = doc.data().category;
        this.form.price = doc.data().price;
        this.form.stock = doc.data().stock;
        this.product = doc.data();
        this.previewCarousel = doc.data().carousel;
        this.features = doc.data().features;
        this.img1 = doc.data().url;
     })
    .catch(error => console.log(error))
    },
    data () {
      return {
        product:null,
        categories:null,
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
        selected:null,
        carousel:[],
        previewCarousel:[],
        newImagesCarousel:[],
        imageCarousel:[],
        idProduct:null,
        deleteImagesCarousel:[]
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
        this.newImagesCarousel = [];    
        this.imageCarousel = event.target.files;
        for(let i=0;i<this.imageCarousel.length;i++){
          var reader = new FileReader();
          reader.onload = (e) => {
            this.img2 = e.target.result;
            this.newImagesCarousel.push(this.img2);
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
                db.collection('products').doc(this.idProduct).update({
                  carousel: fb.firestore.FieldValue.arrayUnion(urlImage)
                }) 
                else
                  db.collection('products').doc(this.idProduct).update({
                    url:urlImage
                  })  
            });
          }); 
    },

    deleteImages(url, index){
      this.deleteImagesCarousel.push(url);
      this.previewCarousel.splice(index,1);
    },
    updateProduct(){
      db.collection('products').doc(this.idProduct).update({
        name: this.form.name,
        description: this.form.description,
        category: this.selected,
        features: this.features,
        stock: parseInt(this.form.stock),
        price: parseFloat(this.form.price),
        slug:this.createSlug(this.form.name),
      }) 
      if(this.file1 !=null){
        this.upload('image',this.file1);
      }
      this.deleteImagesCarousel.forEach((image)=>{
        db.collection('products').doc(this.idProduct).update({
          carousel: fb.firestore.FieldValue.arrayRemove(image)
        }) 
      })
      if(this.imageCarousel.length !=0){
        this.imageCarousel.forEach(image=>{
          this.upload('carousel',image);
        })
      }
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Producto editado correctamente',
        showConfirmButton: false,
        timer: 1500
      })
      setTimeout(() => {
        this.$router.push('/admin/products')
      },1500);
    },
    reset(){
      this.$bind('products',db.collection('products').doc(this.$route.query.id)); 
      this.form.name = this.product.name;
      this.form.description = this.product.description;
      this.selected = this.product.category;
      this.form.price = this.product.price;
      this.form.stock = this.product.stock;
      this.deleteImagesCarousel = [];
      this.previewCarousel = this.product.carousel;
      this.features = this.product.features;
      this.img1 = this.product.url;
      this.newImagesCarousel = [] 
    },
    createSlug(text){
      text = text + "-" + this.idProduct;
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

  .edit-product {
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

    .btn-delete-carousel{
      background-color: #dc3545;
      transition: all .5s;

      &:hover{
        border: 1px solid #dc3545;
        background-color: white;

        .btn-delete-carousel-icon{
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
