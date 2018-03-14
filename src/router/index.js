import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/recommend/recommend'
import Rank from 'components/rank/rank'
import Search from 'components/search/search'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect:'recommend'
    },
    {
      path:'/recommend',
      component:Recommend
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
