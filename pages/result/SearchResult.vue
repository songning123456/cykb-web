<template>
    <view class="search-result">
        <scroll-view v-if="loadType === 'classify'" scroll-x class="nav search-classify" scroll-with-animation
                     :scroll-left="scrollLeft"  @scroll='scrollOn'>
            <view class="cu-item" :class="{'text-red cur': item.category === tabCur}"
                  v-for="(item,index) in categoryInfo"
                  :key="index" @tap="tabSelect" :data-id="item.category">
                {{item.category + ' (共' + item.categoryTotal + '本)'}}
            </view>
        </scroll-view>
        <view class="cu-list full-size" :style="loadType === 'classify' ? 'height: calc(100% - 90rpx);':'height:100%'">
            <scroll-view :scroll-top="scrollTop" scroll-y="true" @scrolltolower="scrollToBottom" style="height: 100%;">
                <view class="cu-card article no-card" v-for="(item, index) in result" :key="index"
                      @tap="bookDetailBtn(item)">
                    <view class="cu-item shadow">
                        <view class="content">
                            <custom-image class="image-size" :url="item.coverUrl || 'http://'"></custom-image>
                            <view class="desc">
                                <view class="title text-cut text-shadow">{{item.title || '未知书名'}}</view>
                                <view class="text-content">{{deleteAmpNbsp(item.introduction)}}</view>
                                <view>
                                    <view class="cu-tag bg-red light sm round">{{item.author || '未知作者'}}</view>
                                    <view class="cu-tag bg-green light sm round">{{item.category || '未知类别'}}</view>
                                    <view class="cu-tag bg-yellow light sm round">{{item.sourceName  || '未知来源'}}</view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </scroll-view>
        </view>
        <back-top @backTop="backTop" v-if="oldScrollTop > 10000"></back-top>
    </view>
</template>

<script>
    import request from '../../util/request';

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
                categoryInfo: [],
                scrollTop: 0,
                oldScrollTop: 0,
                scrollBottomStatus: false
            };
        },
        onLoad () {
            let response = this.$store.getters.GET_NAVIGATEPARAMS.params;
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
            // 解决h5端,uni.startPullDownRefresh()只能执行一次问题
            setTimeout(() => {
                uni.startPullDownRefresh();
            }, 100);
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
                setTimeout(() => {
                    uni.startPullDownRefresh();
                }, 100);
            },
            deleteAmpNbsp(val) {
                // 解决 飞库小说转义问题
                if (val) {
                    let delItem = '&nbsp;';
                    let result = val.replace(new RegExp(delItem, 'g'), '');
                    return result;
                } else {
                    return '暂无简介...';
                }
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
                    }
                    if (this.scrollBottomStatus) {
                        this.scrollBottomStatus = false;
                    }
                });
            },
            bookDetailBtn (novels) {
                this.$store.commit('SET_NAVIGATEPARAMS', {novels: novels});
                uni.navigateTo({ url: '/pages/bookdetail/BookDetail'});
            },
            scrollOn(e) {
                this.oldScrollTop = e.detail.scrollTop;
            },
            scrollToBottom () {
                if (this.scrollBottomStatus) {
                    return;
                } else {
                    this.scrollBottomStatus = true;
                }
                if (this.loadType === 'classify') {
                    this.queryConstantResult('more', '/novels/classifyResult');
                } else if (this.loadType === 'searchResult') {
                    this.queryConstantResult('more', '/novels/searchResult');
                }
            },
            backTop () {
                this.scrollTop = this.oldScrollTop;
                this.$nextTick(() => {
                    this.scrollTop = 0;
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .search-result {
        height: 100%;

        .search-classify {
            background-color: white;
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
