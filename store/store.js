import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        userInfo: null,
        sortType: '最近阅读',
        isDark: false,
        navigateParams: null
    },
    mutations: {
        SET_USERINFO: (state, userInfo) => {
            state.userInfo = userInfo;
            uni.setStorageSync('userInfo', userInfo);
        },
        SET_SORTTYPE: (state, sortType) => {
            state.sortType = sortType;
            uni.setStorageSync('sortType', sortType);
        },
        SET_ISDARK: (state, isDark) => {
            state.isDark = isDark;
            uni.setStorageSync('isDark', isDark);
        },
        SET_NAVIGATEPARAMS: (state, navigateParams) => {
            state.navigateParams = navigateParams;
        }
    },
    getters: {
        GET_NAVIGATEPARAMS: (state) => {
            return state.navigateParams;
        }
    },
    actions: {}
});
export default store;
