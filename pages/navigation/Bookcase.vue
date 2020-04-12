<template>
    <view class="book-case">
        <view v-if="userInfo" class="cu-list full-size menu-avatar">
            <scroll-view scroll-y="true" style="height: 100%;">
                <view class="cu-item" v-for="(item,index) in result" :key="index" @tap="startReading(item)">
                    <custom-image :url="item.coverUrl" class="image-size cu-avatar radius xl"></custom-image>
                    <view class="content">
                        <view class="text-black text-df">{{item.title || '未知书名'}}</view>
                        <view class="text-grey text-sm">{{item.author || '未知作者'}}</view>
                        <view class="text-gray text-xs text-cut">
                            <text class="margin-right-xs">{{convertDate(item.updateTime)}} ·</text>
                            <text>{{item.chapter || '未知章节'}}</text>
                        </view>
                    </view>
                </view>
                <view class="cu-item">
                    <view class="cu-avatar radius lg add-image"></view>
                    <view class="content">
                        <view class="text-black text-bold" @tap="navChange">收藏小说</view>
                    </view>
                </view>
            </scroll-view>
        </view>
        <inset-login v-else></inset-login>
    </view>
</template>

<script>
    import InsetLogin from '../../components/InsetLogin';
    import request from '../../util/request';
    import convertDate from '../../util/convertDate';

    let currentDate = new Date();

    export default {
        name: 'Bookcase',
        components: { InsetLogin },
        data () {
            return {
                result: [],
                toDeleteInfo: {}
            };
        },
        computed: {
            userInfo () {
                return this.$store.state.userInfo;
            },
            sortType () {
                return this.$store.state.sortType;
            }
        },
        onShow() {
            if (this.userInfo) {
                setTimeout(() => {
                    uni.startPullDownRefresh();
                }, 100)
            }
        },
        watch: {
            // 主要用于 一开始未登录，后来登录；重新加载数据
            userInfo (newVal, oldVal) {
                if (newVal && !oldVal) {
                    setTimeout(() => {
                        uni.startPullDownRefresh();
                    }, 100)
                }
            },
            sortType (newVal, oldVal) {
                this.queryBookcase();
            }
        },
        onPullDownRefresh () {
            if (this.userInfo) {
                this.queryBookcase();
            } else {
                uni.stopPullDownRefresh();//得到数据后停止下拉刷新
            }
        },
        onNavigationBarButtonTap(e) {
            if (e.type === 'delete') {
                console.error(e);
            } else {
                uni.navigateTo({url: '/pages/navigation/Search'});
            }
        },
        methods: {
            startReading (item) {
                uni.navigateTo({ url: '/pages/reading/SimpleRead?novels=' + encodeURIComponent(JSON.stringify(item)) });
            },
            navChange () {
                uni.switchTab({
                    url: '/pages/navigation/Classify',
                });
            },
            convertDate (updateTime) {
                return convertDate.convertZh(currentDate, updateTime);
            },
            queryBookcase () {
                if (!(this.userInfo && this.userInfo.uniqueId)) {
                    return;
                }
                let params = {
                    condition: {
                        uniqueId: this.userInfo.uniqueId,
                        sortType: this.sortType
                    }
                };
                request.post('/relation/bookcase', params).then(data => {
                    if (data.status === 200 && data.total > 0) {
                        this.result = data.data;
                    }
                }).finally(() => {
                    uni.stopPullDownRefresh();//得到数据后停止下拉刷新
                });
            },
            topBtn (novelsId) {
                let params = {
                    condition: {
                        uniqueId: this.userInfo.uniqueId,
                        novelsId: novelsId
                    }
                };
                uni.showLoading({ title: 'loading...', mask: true });
                request.post('/relation/topBookcase', params).then(data => {
                    if (data.status === 200) {
                        let temp = [];
                        this.result.forEach(item => {
                            if (item.novelsId === novelsId) {
                                temp.unshift(item);
                            } else {
                                temp.push(item);
                            }
                        });
                        this.result = temp;
                    }
                }).finally(() => {
                    uni.hideLoading();
                });
            },
            deleteBtn (novelsId, index) {
                uni.showModal({
                    title: '提示',
                    content: '确定从书架中移除此本小说?',
                    success: (res) => {
                        if (res.confirm) {
                            let params = {
                                condition: {
                                    uniqueId: this.userInfo.uniqueId,
                                    novelsId: novelsId
                                }
                            };
                            uni.showLoading({ title: 'loading...', mask: true });
                            request.post('/relation/deleteBookcase', params).then(data => {
                                if (data.status === 200) {
                                    this.result.splice(index, 1);
                                }
                            }).finally(() => {
                                uni.hideLoading();
                            });
                        }
                    }
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .book-case {
        height: 100%;
        width: 100%;
        .cu-list {
            overflow-y: auto;

            .cu-item {
                justify-content: unset;
                padding-right: unset;
                background: unset;
                position: relative;
                display: flex;
                height: 140upx;
                -webkit-box-align: center;
                -webkit-align-items: center;
                align-items: center;

                .image-size {
                    width: 105upx;
                }

                .cu-avatar {
                    float: left;
                    left: 15upx;
                }

                .content {
                    float: left;
                    left: 135upx;
                    width: calc(100% - 140upx - 20upx);
                    position: absolute;
                    line-height: 1.6em;
                }
            }
        }
    }
</style>
