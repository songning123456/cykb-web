import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        userInfo: null,
        sortType: '最近阅读',
        isDark: false
    },
    mutations: {
        SET_USERINFO: (state, userInfo) => {
            state.userInfo = userInfo;
        },
        SET_SORTTYPE: (state, sortType) => {
            state.sortType = sortType;
        },
        SET_ISDARK: (state, isDark) => {
            state.isDark = isDark;
        }
    },
    actions: {}
});
export default store;
