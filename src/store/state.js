import {playMode} from 'common/js/config'
import {loadSearch} from 'common/js/cache'
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
    searchHistory:loadSearch()
}
export default state