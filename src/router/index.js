import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const Recommend = () => import('components/recommend/recommend')
const Disc = () => import('components/disc/disc')
const TopList = () => import('components/top-list/top-list')
const Rank = () => import('components/rank/rank')
const Search = () => import('components/search/search')

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
    }
  ]
})
