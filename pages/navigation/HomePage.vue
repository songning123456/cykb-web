<template>
    <view class="home-page">
        <view class="cu-list full-size">
            <scroll-view :scroll-top="scrollTop" scroll-y="true" @scroll='scrollOn' @scrolltolower="scrollToBottom" style="height: 100%;">
                <view class="cu-card article no-card" v-for="(item, index) in result" :key="index"
                      @tap="bookDetailBtn(item)">
                    <view class="cu-item shadow">
                        <view class="content">
                            <custom-image class="image-size" :url="item.coverUrl"></custom-image>
                            <view class="desc">
                                <view class="title text-cut text-shadow">{{item.title}}</view>
                                <view class="text-content">{{item.introduction || '暂无简介...'}}</view>
                                <view>
                                    <view class="cu-tag bg-red light sm round">{{item.author || '未知'}}</view>
                                    <view class="cu-tag bg-green light sm round">{{item.category || '未知'}}
                                    </view>
                                    <view class="cu-tag bg-yellow light sm round">{{item.sourceName || '未知'}}</view>
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
                oldScrollTop: 0
            };
        },
        onLoad () {
            debugger;
            setTimeout(() => {
                uni.startPullDownRefresh();
            }, 100);
        },
        onPullDownRefresh () {
            this.queryHomePage('first');
        },
        onNavigationBarButtonTap (e) {
            if (e.fontSrc.includes('reload')) {
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
                });
            },
            bookDetailBtn (novels) {
                uni.navigateTo({ url: '/pages/bookdetail/BookDetail?novels=' + JSON.stringify(novels) });
            },
            scrollOn(e) {
                this.oldScrollTop = e.detail.scrollTop;
            },
            scrollToBottom (e) {
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
                padding-bottom: 10upx;

                .cu-item {
                    padding: unset;
                    background: unset;

                    .content {
                        padding: 0 15upx;

                        .image-size {
                            width: 180upx;
                            margin-top: 18upx;
                            height: 8em;
                            margin-right: 20upx;
                            border-radius: 6upx;
                        }

                        .title {
                            padding: unset;
                            height: 60upx;
                            line-height: 72upx;
                        }
                    }
                }
            }
        }
    }
</style>
