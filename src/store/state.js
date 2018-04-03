import {playMode} from 'common/js/config'
import {loadSearch,loadPlay,loadFavorite} from 'common/js/cache'
const state = {
    playing:false,
    fullScreen:false,
    playList:[],
    sequenceList:[],
    mode:0,
    modeChange:false,
    currentIndex: -1,
    disc:{},
    topList:{},
    searchHistory:loadSearch(),
    playHistory:loadPlay(),
    favoriteHistory:loadFavorite()
}
export default state