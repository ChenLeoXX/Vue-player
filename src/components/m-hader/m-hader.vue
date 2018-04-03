<template>
  <div class="m-hader">
      <div class="icon"></div>
      <router-link to="/user" tag="div" class="mine">
        <i class="icon-mine"></i>
      </router-link>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  name:"MHeader"
}
</script>
<style lang="stylus"  rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"  
 .m-hader
    position:relative
    height:44px
    text-align:center
    font-size 0
    background: rgba(104, 204, 155, 0.87);
    .icon
      display: inline-block
      vertical-align: top
      margin-top: 6px
      width:135px
      height: 37px
      margin-right: 9px
      bg-image('logo')
      background-size: cover
    .text
      display: inline-block
      vertical-align: top
      line-height: 44px
      font-size: $font-size-large      
    .mine
      position: absolute
      top: 0
      right: 0
      .icon-mine
        display: block
        padding: 12px
        font-size: 20px
        color: #fff
</style>

