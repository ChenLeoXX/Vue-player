<template>
    <div class="tab">
    <router-link tag="div" class="tab-item" to="/recommend">
      <span class="tab-link">推荐</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/rank">
      <span class="tab-link">排行
      </span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/search">
      <span class="tab-link">搜索</span>
    </router-link>
  </div>
</template>
<script>
export default {
  name:"tab"
}
</script>

<style lang="stylus" scoped>
 @import "~common/stylus/variable"

.tab
    display: flex
    height: 44px
    line-height: 44px
    font-size: $font-size-medium
    background:rgba(104, 204, 155, 0.87)
    .tab-item
      flex: 1
      text-align: center
      .tab-link
        padding-bottom: 5px
        color: #fff
      &.router-link-active
        .tab-link
          border-bottom: 3px solid #fff;
          font-weight: bold;
</style>
