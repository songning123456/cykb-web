<template>
    <view class="search">
        <view class="cu-card case no-card history-card" v-if="!fastResult.length">
            <view class="cu-bar solid-bottom" v-if="ourSearchResult.length">
                <view class="action">
                    <text class="cuIcon-attention text-red"></text>
                    大家都在搜
                </view>
            </view>
            <scroll-view scroll-x="true" class="our-searches margin-bottom-sm" v-if="ourSearchResult.length">
                <block v-for="(item, index) in ourSearchResult" :key="index">
                    <view class="our-search" @tap="ourSearchDetailBtn(item)">
                        <view class="avatar-img">
                            <custom-image :url="item.coverUrl || 'http://'"></custom-image>
                        </view>
                        <view class="text-cut text-center">{{item.title || '未知书名'}}</view>
                    </view>
                </block>
            </scroll-view>
            <view class="cu-bar solid-bottom">
                <view class="action">
                    <text class="cuIcon-time text-red"></text>
                    搜索历史
                </view>
                <view class="action">
                    <text class="cuIcon-delete" @tap="deleteSearchHistoryBtn"></text>
                </view>
            </view>
            <view class="cu-list menu text-left solid-top">
                <view class="cu-item" v-for="(item, index) in searchHistory" :key="index" @tap="queryHistoryBtn(item)">
                    <view class="content" v-if="item.novels">
                        <text class="text-grey">{{item.novels.title || '未知书名'}}</text>
                        <text class="padding-left-xl text-gray">{{item.novels.author || '未知作者'}}</text>
                    </view>
                    <view class="content" v-else>
                        <text class="text-grey">{{item.authorOrTitle}}</text>
                    </view>
                </view>
            </view>
        </view>
        <view class="cu-list menu text-left solid-top fast-result" v-if="fastResult.length">
            <view class="cu-item" v-for="(item, index) in fastResult" :key="index" @tap="fastSearchBtn(item)">
                <view class="content">
                    <text class="text-grey">{{item.title || '未知书名'}}</text>
                    <text class="padding-left-xl text-gray">{{item.author || '未知作者'}}</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import request from '../../util/request';

    export default {
        name: 'Search',
        data() {
            return {
                searchHistory: [],
                fastResult: [],
                debounceTimeout: null,
                ourSearchResult: []
            };
        },
        created() {
            this.ourSearchQueryBtn();
        },
        onLoad() {
            this.searchHistory = uni.getStorageSync('searchHistory') || [];
        },
        onShow() {
            this.fastResult = [];
        },
        onNavigationBarButtonTap(e) {
            uni.navigateBack({delta: 1});
        },
        onNavigationBarSearchInputChanged(e) {
            if (this.debounceTimeout) {
                clearTimeout(this.debounceTimeout);
                this.debounceTimeout = null;
            }
            this.debounceTimeout = setTimeout(() => {
                this.fastQueryBooks(e.text);
            }, 1000);
        },
        onNavigationBarSearchInputConfirmed(e) {
            if (e.text) {
                let obj = {
                    authorOrTitle: e.text
                };
                this.searchHistory = this.searchHistory.filter(item => item.authorOrTitle !== e.text);
                this.searchHistory.unshift(obj);
                uni.setStorageSync('searchHistory', this.searchHistory);
                this.$store.commit('SET_NAVIGATEPARAMS', {params: { type: 'searchResult', authorOrTitle: e.text }});
                uni.navigateTo({ url: '/pages/result/SearchResult' });
            }
        },
        methods: {
            fastSearchBtn(novels) {
                let obj = {
                    authorOrTitle: novels.title + '    ' + novels.author,
                    novels: novels
                };
                this.searchHistory = this.searchHistory.filter(item => item.authorOrTitle !== (novels.title + '    ' + novels.author));
                this.searchHistory.unshift(obj);
                uni.setStorageSync('searchHistory', this.searchHistory);
                this.$store.commit('SET_NAVIGATEPARAMS', {novels: novels});
                uni.navigateTo({url: '/pages/bookdetail/BookDetail'});
            },
            queryHistoryBtn(history) {
                let src = uni.getStorageSync('searchHistory');
                if (src && src.length > 0) {
                    let result = [];
                    src.forEach(item => {
                        if (JSON.stringify(item) === JSON.stringify(history)) {
                            result.unshift(item);
                        } else {
                            result.push(item);
                        }
                    });
                    this.searchHistory = result;
                    uni.setStorageSync('searchHistory', result);
                }
                if (history.novels) {
                    this.$store.commit('SET_NAVIGATEPARAMS', {novels: history.novels});
                    uni.navigateTo({url: '/pages/bookdetail/BookDetail' });
                } else {
                    this.$store.commit('SET_NAVIGATEPARAMS', {params: {
                            type: 'searchResult',
                            authorOrTitle: history.authorOrTitle
                        }});
                    uni.navigateTo({ url: '/pages/result/SearchResult'});
                }
            },
            fastQueryBooks(authorOrTitle) {
                if (authorOrTitle) {
                    let params = {
                        authorOrTitle: authorOrTitle
                    };
                    request.get('/novels/fastSearch', params).then(data => {
                        if (data.status === 200 && data.data.length > 0) {
                            this.fastResult = data.data;
                        }
                    });
                }
            },
            deleteSearchHistoryBtn() {
                this.searchHistory = [];
                uni.removeStorageSync('searchHistory');
            },
            ourSearchQueryBtn() {
                request.get('/relation/ourSearch', {}).then(data => {
                    if (data.status === 200 && data.total > 0) {
                        this.ourSearchResult = data.data;
                    }
                })
            },
            ourSearchDetailBtn (novels) {
                this.$store.commit('SET_NAVIGATEPARAMS', {novels: novels});
                uni.navigateTo({ url: '/pages/bookdetail/BookDetail'});
            },
        }
    };
</script>

<style lang="scss" scoped>
    .search {
        .tip-card {
            .tip-item {
                background-color: unset;
                border: 1px solid #a6a6a6;

                .tips {
                    left: 48%;
                    right: unset;
                    color: #e54d42;
                    top: 15rpx;
                    background-color: unset;
                }

                .search-item {
                    justify-content: center;
                    text-align: center;
                    padding: 30rpx 0;

                    .setting-source {
                        position: absolute;
                        right: 36rpx;
                    }
                }
            }
        }

        .history-card {

            .our-searches {
                white-space: nowrap; // 滚动必须加的属性
                width: 100%;
                padding: 20rpx;
                margin: 0 auto;

                .our-search {
                    width: 24%;
                    margin-right: 20rpx;
                    display: inline-block;
                    vertical-align: top;

                    .avatar-img {
                        display: inline-block;
                        height: 220rpx;
                        width: 165rpx;
                        border-radius: 6rpx;
                        position: relative;

                        .custom-image {
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
            }

            .solid-top::after {
                border-top: unset;
            }

            .cu-list {
                height: 300px;
                overflow-y: auto;

                .cu-item {
                    background-color: unset;
                    min-height: 70rpx;

                    &:after {
                        border-bottom: unset;
                    }
                }
            }
        }

        .fast-result {
            width: 100%;

            .cu-item {
                background-color: unset;
            }
        }
    }
</style>
