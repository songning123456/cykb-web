<template>
    <view class="search">
        <view class="cu-card case no-card history-card" v-if="!fastResult.length">
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
                        <text class="text-grey">{{item.novels.title}}</text>
                        <text class="padding-left-xl text-gray">{{item.novels.author}}</text>
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
                    <text class="text-grey">{{item.title}}</text>
                    <text class="padding-left-xl text-gray">{{item.author}}</text>
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
                debounceTimeout: null
            };
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
                this.searchHistory = this.searchHistory.filter(item => item.authorOrTitle !== e.detail.value);
                this.searchHistory.unshift(obj);
                uni.setStorageSync('searchHistory', this.searchHistory);
                uni.navigateTo({
                    url: '/pages/result/SearchResult?params=' + JSON.stringify({
                        type: 'searchResult',
                        authorOrTitle: e.text
                    })
                });
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
                uni.navigateTo({url: '/pages/bookdetail/BookDetail?novels=' + JSON.stringify(novels)});
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
                    uni.navigateTo({url: '/pages/bookdetail/BookDetail?novels=' + JSON.stringify(history.novels)});
                } else {
                    uni.navigateTo({
                        url: '/pages/result/SearchResult?params=' + JSON.stringify({
                            type: 'searchResult',
                            authorOrTitle: history.authorOrTitle
                        })
                    });
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
            }
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
                    top: 15upx;
                    background-color: unset;
                }

                .search-item {
                    justify-content: center;
                    text-align: center;
                    padding: 30upx 0;

                    .setting-source {
                        position: absolute;
                        right: 36upx;
                    }
                }
            }
        }

        .history-card {

            .solid-top::after {
                border-top: unset;
            }

            .cu-list {
                height: 300px;
                overflow-y: auto;

                .cu-item {
                    background-color: unset;
                    min-height: 70upx;

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
