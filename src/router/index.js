import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import TheLogin from '../views/TheLogin.vue'
import SignUp from '../views/SignUp.vue'
import Product from '../views/Product.vue'
import Category from '../views/Category.vue' 
import Cart from '../views/Cart.vue' 
import Admin from '../views/Admin.vue'
import HomeAdmin from '../views/HomeAdmin.vue'
import AddProduct from '../views/AddProduct.vue'
import ProductsAdmin from '../views/ProductsAdmin.vue'
import EditProduct from '../views/EditProduct.vue'
import Appointment from '../views/Appointment.vue'
import Profile from '../views/Profile.vue'
import OrderProfile from '../views/OrderProfile.vue'
import AppointmentProfile from '../views/AppointmentProfile.vue'
import PersonalInformation from '../views/PersonalInformation.vue'
import Error404 from '../views/Error404.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',
    name: 'TheLogin',
    component: TheLogin
  },
  {
    path: '/signUp',
    name: 'SignUp',
    component: SignUp
  },
  { 
    path: '/product/:slug',
    name:'product',
    component: Product
  },
  { 
    path: '/category/:id', 
    name:'category', 
    component: Category 
  },
  {
    path: '/cart',
    name: 'cart',
    component: Cart
  },
  {
    path: '/citas',
    name: 'Appointment',
    component: Appointment
  },
  {
    path: '/perfil',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true},
    children:[
      { path: '/perfil/informacion-personal',name:'PersonalInformation', component: PersonalInformation },
      { path: '/perfil/pedidos',name:'OrderProfile', component: OrderProfile },
      { path: '/perfil/citas',name:'AppointmentProfile', component: AppointmentProfile },

    ]
  },
  {
    path: '/admin', 
    name:'Admin', 
    component: Admin,
    meta: { requiresAuthAdmin: true},
    children:[
      { path: '/admin',name:'HomeAdmin', component: HomeAdmin },
      { path: '/admin/nuevo-producto',name:'AddProduct', component: AddProduct },
      { path: '/admin/products',name:'ProductsAdmin', component: ProductsAdmin },
      { path: '/admin/editProduct/:slug',name:'EditProduct', component: EditProduct }
    ]
  },
  { path: '/:NotFound(.*)*', name:'404', component: Error404 },
]

const router = new VueRouter({
  
  routes,
  
})
import { auth } from '../db.js'

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuthAdmin)) {
      if(auth.currentUser == null ) {
          next("/");
      }else if(!auth.currentUser.email == 'sergio8999@gmail.com'){
        next("/");
      } else {
        console.log(auth.currentUser)
          next();
      }
  } else {
      next();
  }
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if(auth.currentUser == null) {
        next("/");
    } else {
        next();
    }
} else {
    next();
}
}) 

export default router
