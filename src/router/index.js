import Vue from 'vue'
import Router from 'vue-router'
// import Recommend from 'components/recommend/recommend'
// import Rank from 'components/rank/rank'
// import Search from 'components/search/search'
// import Disc from 'components/disc/disc'
// import topList from 'components/top-list/top-list'

Vue.use(Router)
const Recommend  =()=> import('components/recommend/recommend')
const Search = ()=> import('components/search/search')
const Rank = () => import('components/rank/rank')
const Disc = ()=> import('components/disc/disc')
const topList = ()=>import('components/top-list/top-list')
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
