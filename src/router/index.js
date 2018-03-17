import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/recommend/recommend'
import Rank from 'components/rank/rank'
import Search from 'components/search/search'
import Disc from 'components/disc/disc'

Vue.use(Router)

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
      component:Rank
    }
  ]
})
