webpackJsonp([2],{BRgg:function(t,s,e){"use strict";s.b=function(){var t=n()({},l.b,{uin:0,needNewCode:1,platform:"h5"});return Object(a.a)("https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg",t,l.c)},s.a=function(t){var s=n()({},l.b,{topid:t,needNewCode:1,uin:0,tpl:3,page:"detail",type:"top",platform:"h5"});return Object(a.a)("https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg",s,l.c)};var i=e("woOf"),n=e.n(i),a=e("Gak4"),l=e("T452")},OLj4:function(t,s){},VKUo:function(t,s){},kvay:function(t,s,e){"use strict";var i=e("Dd8w"),n=e.n(i),a=e("qwAB"),l={name:"song-list",props:{songs:{type:Array,default:[]},rank:{type:Boolean,default:!1}},methods:{getDesc:function(t){return t.singer+" "+t.album},selectItem:function(t,s){this.$emit("select",t,s)},getRankCls:function(t){return t<=2?"icon icon"+t:"text"},getRankText:function(t){if(t>2)return t+1}}},r={render:function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"song-list"},[e("ul",t._l(t.songs,function(s,i){return e("li",{key:i,staticClass:"item",on:{click:function(e){t.selectItem(s,i)}}},[e("div",{directives:[{name:"show",rawName:"v-show",value:t.rank,expression:"rank"}],staticClass:"rank"},[e("span",{class:t.getRankCls(i),domProps:{textContent:t._s(t.getRankText(i))}})]),t._v(" "),e("div",{staticClass:"content"},[e("h2",{staticClass:"name"},[t._v(t._s(s.name))]),t._v(" "),e("p",{staticClass:"desc"},[t._v(t._s(t.getDesc(s)))])])])}))])},staticRenderFns:[]};var o=e("VU/8")(l,r,!1,function(t){e("OLj4")},"data-v-059e9adb",null).exports,c=e("fqe1"),g=e("3Q4o"),u=e("NYxO"),f=e("F4+m"),h=Object(g.b)("transform"),d=Object(g.b)("backdrop-filter"),p={name:"music-list",mixins:[f.a],components:{Scroll:a.a,SongList:o,Loadding:c.a},props:{title:{type:String,default:""},songs:{type:Array,default:[]},bgImage:{type:String,default:""},rank:{type:Boolean,default:!1}},data:function(){return{scrollY:0}},computed:{bgStyle:function(){return"background-image:url("+this.bgImage+")"}},mounted:function(){this.imageHeight=this.$refs.bgImage.clientHeight,this.miniTranslateY=40-this.imageHeight,console.log(this.miniTranslateY),this.$refs.list.$el.style.top=this.imageHeight+"px"},created:function(){this.listenScroll=!0,this.probeType=3},methods:n()({scroll:function(t){this.scrollY=t.y},back:function(){this.$router.back()},selectItem:function(t,s){this.selectPlay({list:this.songs,index:s})},randomPlayAll:function(){this.randomPlay({list:this.songs})},handlePlayList:function(){var t=this.playList.length>0?"60px":"";this.$refs.list.$el.style.bottom=t,this.$refs.list.refresh()}},Object(u.b)(["selectPlay","randomPlay"])),watch:{scrollY:function(t){var s=Math.max(this.miniTranslateY,t),e=1,i=0,n=0,a=Math.abs(t/this.imageHeight);t>0?(e=1+a,i=10):n=Math.min(20*a*20),this.$refs.layer.style.transform="translate3d(0,"+s+"px,0)",this.$refs.filter.style[d]="blur("+n+"px)",t<this.miniTranslateY?(i=10,this.$refs.bgImage.style.paddingTop=0,this.$refs.bgImage.style.height="40px",this.$refs.playBtn.style.display="none"):(this.$refs.bgImage.style.paddingTop="70%",this.$refs.bgImage.style.height=0,this.$refs.playBtn.style.display=""),this.$refs.bgImage.style[h]="scale("+e+")",this.$refs.bgImage.style.zIndex=i}}},m={render:function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"music-list"},[e("div",{staticClass:"back",on:{click:t.back}},[e("i",{staticClass:"icon-back"})]),t._v(" "),e("h1",{staticClass:"title",domProps:{innerHTML:t._s(t.title)}}),t._v(" "),e("div",{ref:"bgImage",staticClass:"bg-image",style:t.bgStyle},[e("div",{staticClass:"play-wrapper"},[e("div",{ref:"playBtn",staticClass:"play"},[e("i",{directives:[{name:"show",rawName:"v-show",value:t.songs.length>0,expression:"songs.length>0"}],staticClass:"icon-play"}),t._v(" "),e("span",{staticClass:"text",on:{click:t.randomPlayAll}},[t._v("随机播放全部")])])]),t._v(" "),e("div",{ref:"filter",staticClass:"filter"})]),t._v(" "),e("div",{ref:"layer",staticClass:"bg-layer"}),t._v(" "),e("scroll",{ref:"list",staticClass:"list",attrs:{data:t.songs,listenScorll:t.listenScroll,"probe-type":t.probeType},on:{scroll:t.scroll}},[e("div",{staticClass:"song-list-wrapper"},[e("song-list",{attrs:{songs:t.songs,rank:t.rank},on:{select:t.selectItem}})],1),t._v(" "),e("div",{directives:[{name:"show",rawName:"v-show",value:!t.songs.length,expression:"!songs.length"}],staticClass:"loading-container"},[e("loadding")],1)])],1)},staticRenderFns:[]};var v=e("VU/8")(p,m,!1,function(t){e("VKUo")},"data-v-f29fa8f6",null);s.a=v.exports},lG4v:function(t,s){},s3x3:function(t,s,e){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var i=e("Dd8w"),n=e.n(i),a=e("PvFA"),l=e("BRgg"),r=e("T452"),o=e("NYxO"),c=e("kvay"),g={data:function(){return{songs:[],rank:!0}},created:function(){this._getMusicList()},computed:n()({title:function(){return this.topList.topTitle},bgImage:function(){return this.songs.length?this.songs[0].image:""}},Object(o.c)(["topList"])),methods:{_getMusicList:function(){var t=this;this.topList.id?Object(l.a)(this.topList.id).then(function(s){s.code===r.a&&Object(a.c)(t._normalizeSongs(s.songlist)).then(function(s){t.songs=s})}):this.$router.push({path:"/rank"})},_normalizeSongs:function(t){var s=[];return t.forEach(function(t){var e=t.data;Object(a.b)(e)&&s.push(Object(a.a)(e))}),s}},components:{musicList:c.a}},u={render:function(){var t=this.$createElement,s=this._self._c||t;return s("transition",{attrs:{name:"slide"}},[s("music-list",{attrs:{rank:this.rank,title:this.title,"bg-image":this.bgImage,songs:this.songs}})],1)},staticRenderFns:[]};var f=e("VU/8")(g,u,!1,function(t){e("lG4v")},"data-v-79cb88be",null);s.default=f.exports}});
//# sourceMappingURL=2.d2cbcfe72c713e706160.js.map