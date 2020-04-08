<template>
    <view class="search-result">
        <scroll-view v-if="loadType === 'classify'" scroll-x class="nav search-classify" scroll-with-animation
                     :scroll-left="scrollLeft">
            <view class="cu-item" :class="{'text-red cur': item.category === tabCur}" v-for="(item,index) in categoryInfo"
                  :key="index" @tap="tabSelect" :data-id="item.category">
                {{item.category + ' (共' + item.categoryTotal + '本)'}}
            </view>
        </scroll-view>
        <view v-if="loadType === 'classify'" class="search-fill"></view>
        <view class="cu-list full-size">
            <view class="cu-card article no-card" v-for="(item, index) in result" :key="index"
                  @tap="bookDetailBtn(item)">
                <view class="cu-item shadow">
                    <view class="content">
                        <custom-image class="image-size" :url="item.coverUrl"></custom-image>
                        <view class="desc">
                            <view class="title text-cut text-shadow">{{item.title}}</view>
                            <view class="text-content">{{convertIntroduction(item.introduction)}}</view>
                            <view>
                                <view class="cu-tag bg-red light sm round">{{item.author}}</view>
                                <view class="cu-tag bg-green light sm round">{{item.category || '未知'}}</view>
                                <view class="cu-tag bg-yellow light sm round">{{item.sourceName}}</view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import request from '../../util/request';
    import common from '../../util/common';

    export default {
        name: 'SearchResult',
        data () {
            return {
                loadParams: null,
                loadType: '',
                pageSize: 100,
                pageResult: [],
                result: [],
                scrollLeft: 0,
                tabCur: '',
                categoryInfo: []
            };
        },
        onLoad (option) {
            let response = JSON.parse(option.params);
            this.loadType = response.type;
            if (response.type === 'classify') {
                this.categoryInfo = response.categoryInfo;
                this.tabCur = response.categoryInfo[0].category;
                this.loadParams = {
                    sourceName: response.sourceName,
                    category: response.categoryInfo[0].category
                };
                uni.setNavigationBarTitle({ title: response.sourceName });
            } else if (response.type === 'searchResult') {
                this.loadParams = {
                    authorOrTitle: response.authorOrTitle
                };
                uni.setNavigationBarTitle({ title: '搜索结果' });
            }
            uni.startPullDownRefresh();
        },
        onReachBottom () {
            if (this.loadType === 'classify') {
                this.queryConstantResult('more', '/novels/classifyResult');
            } else if (this.loadType === 'searchResult') {
                this.queryConstantResult('more', '/novels/searchResult');
            }
        },
        onPullDownRefresh () {
            if (this.loadType === 'classify') {
                this.queryConstantResult('first', '/novels/classifyResult');
            } else if (this.loadType === 'searchResult') {
                this.queryConstantResult('first', '/novels/searchResult');
            }
        },
        methods: {
            tabSelect (e) {
                this.tabCur = e.currentTarget.dataset.id;
                this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
                this.loadParams.category = e.currentTarget.dataset.id;
                uni.showLoading({ title: 'loading...', mask: true });
                this.queryConstantResult('first', '/novels/classifyResult');
            },
            queryConstantResult (firstOrMore, url) {
                let params = {
                    pageRecordNum: this.pageSize,
                    condition: this.loadParams
                };
                if (firstOrMore === 'first') {
                    params.recordStartNo = 0;
                } else {
                    if (this.pageResult.length > 0) {
                        params.condition.createTime = this.pageResult[this.pageResult.length - 1].createTime;
                    } else {
                        return;
                    }
                }
                request.post(url, params).then(data => {
                    if (data.status === 200) {
                        this.pageResult = data.data;
                        if (firstOrMore === 'first') {
                            this.result = data.data;
                        } else {
                            this.result = this.result.concat(data.data);
                        }
                    }
                }).finally(() => {
                    if (firstOrMore === 'first') {
                        uni.stopPullDownRefresh();//得到数据后停止下拉刷新
                        uni.hideLoading();
                    }
                });
            },
            bookDetailBtn (novels) {
                uni.navigateTo({ url: '/pages/bookdetail/BookDetail?novels=' + JSON.stringify(novels) });
            },
            convertIntroduction (introduction) {
                return common.getIntroduction(introduction);
            }
        }
    };
</script>

<style lang="scss" scoped>
    .search-result {

        .search-classify {
            position: fixed;
            z-index: 1;
            top: 0;
            background-color: white;
        }

        .search-fill {
            width: 100%;
            height: 90rpx;
        }

        .cu-list {
            overflow: auto;

            .cu-card {
                padding-bottom: 10rpx;

                .cu-item {
                    padding: unset;
                    background: unset;

                    .content {
                        padding: 0 15rpx;

                        .image-size {
                            width: 180rpx;
                            margin-top: 18rpx;
                            height: 8em;
                            margin-right: 20rpx;
                            border-radius: 6rpx;
                        }

                        .title {
                            padding: unset;
                            height: 60rpx;
                            line-height: 72rpx;
                        }
                    }
                }
            }
        }
    }
</style>
