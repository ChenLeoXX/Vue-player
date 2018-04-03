import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)
const Recommend  =()=> import('components/recommend/recommend')
const Search = ()=> import('components/search/search')
const Rank = () => import('components/rank/rank')
const Disc = ()=> import('components/disc/disc')
const topList = ()=>import('components/top-list/top-list')
const User = ()=> import('components/user/user')
export default new Router({
  routes: [
    {
      path: '/',
      redirect:'recommend'
    },
    {
      path:'/recommend',
      component:Recommend,
      children:[
        {
          path: ':id',
          component:Disc
        }
      ]
    },   
    {
      path:'/search',
      component:Search
    },
    {
      path:'/rank',
      component:Rank,
      children:[{
        path:':id',
        component:topList
      }]
    },
    {
      path:'/user',
      component:User
    }
  ]
})
