<template>
    <view class="home-page">
        <view class="cu-list full-size">
            <scroll-view :scroll-top="scrollTop" scroll-y="true" @scroll='scrollOn' @scrolltolower="scrollToBottom" style="height: 100%;">
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
                                    <view class="cu-tag bg-green light sm round">{{item.category || '未知类别'}}
                                    </view>
                                    <view class="cu-tag bg-yellow light sm round">{{item.sourceName || '未知来源'}}</view>
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
        name: 'HomePage',
        data () {
            return {
                pageSize: 100,
                pageResult: [],
                result: [],
                scrollTop: 0,
                oldScrollTop: 0,
                scrollBottomStatus: false
            };
        },
        onLoad () {
            setTimeout(() => {
                uni.startPullDownRefresh();
            }, 100);
        },
        onPullDownRefresh () {
            this.queryHomePage('first');
        },
        onNavigationBarButtonTap (e) {
            if (e.type === 'reload') {
                location.reload();
            } else {
                uni.navigateTo({ url: '/pages/navigation/Search' });
            }
        },
        methods: {
            queryHomePage (type) {
                let params = Object.create(null);
                params.pageRecordNum = this.pageSize;
                if (type === 'first') {
                    params.recordStartNo = 0;
                } else {
                    if (this.pageResult.length > 0) {
                        params.condition = Object.create(null);
                        params.condition.createTime = this.pageResult[this.pageResult.length - 1].createTime;
                    } else {
                        return;
                    }
                }
                request.post('/novels/homePage', params).then(data => {
                    if (data.status === 200) {
                        this.pageResult = data.data;
                        if (type === 'first') {
                            this.result = data.data;
                        } else {
                            this.result = this.result.concat(data.data);
                        }
                    }
                }).finally(() => {
                    if (type === 'first') {
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
            scrollToBottom (e) {
                if (this.scrollBottomStatus) {
                    return;
                } else {
                    this.scrollBottomStatus = true;
                }
                this.queryHomePage('more');
            },
            backTop () {
                this.scrollTop = this.oldScrollTop;
                this.$nextTick(() => {
                    this.scrollTop = 0;
                });
            },
        }
    };
</script>

<style lang="scss" scoped>
    .home-page {
        height: 100%;

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
