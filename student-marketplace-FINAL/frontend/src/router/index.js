import { createRouter, createWebHistory } from 'vue-router'
import Homepage from '../views/Homepage.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import BrowseListings from '../views/BrowseListings.vue'
import ListingDetail from '../views/ListingDetail.vue'
import CreateListing from '../views/CreateListing.vue'
import EditListing from '../views/EditListing.vue'
import MyListings from '../views/MyListings.vue'
import Profile from '../views/Profile.vue'
import Messages from '../views/Messages.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Homepage
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/browse',
      name: 'Browse',
      component: BrowseListings
    },
    {
      path: '/listing/:id',
      name: 'ListingDetail',
      component: ListingDetail
    },
    {
      path: '/create-listing',
      name: 'CreateListing',
      component: CreateListing
    },
    {
      path: '/listing/:id/edit',
      name: 'EditListing',
      component: EditListing
    },
    {
      path: '/my-listings',
      name: 'MyListings',
      component: MyListings
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/messages',
      name: 'Messages',
      component: Messages
    }
  ]
})

export default router
