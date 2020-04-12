<template>
    <view class="book-case" :class="{'full-size': !userInfo}">
        <view v-if="userInfo" class="cu-list full-size menu-avatar">
            <view class="cu-item"
                  v-for="(item,index) in result" :key="index"
                  :class="[(modalName==='move-box-'+ index && sortType === '最近阅读') ? 'move-cur' : '', (modalName==='move-box-'+ index && sortType === '更新时间') ? 'move-no-top-cur':'']"
                  @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" @tap="startReading(item)"
                  :data-target="'move-box-' + index">
                <custom-image :url="item.coverUrl" class="image-size cu-avatar radius xl"></custom-image>
                <view class="content">
                    <view class="text-black text-df">{{item.title || '暂无'}}</view>
                    <view class="text-grey text-sm">{{item.author || '暂无'}}</view>
                    <view class="text-gray text-xs text-cut">
                        <text class="margin-right-xs">{{convertDate(item.updateTime)}} ·</text>
                        <text>{{item.chapter || '暂无'}}</text>
                    </view>
                </view>
                <view class="move" :class="{'move-no-top':sortType === '更新时间'}">
                    <view class="bg-grey" v-if="sortType === '最近阅读'" @tap.stop="topBtn(item.novelsId)">置顶</view>
                    <view class="bg-red" @tap.stop="deleteBtn(item.novelsId, index)">删除</view>
                </view>
            </view>
            <view class="cu-item">
                <view class="cu-avatar radius lg add-image"></view>
                <view class="content">
                    <view class="text-black text-bold" @tap="navChange">收藏小说</view>
                </view>
            </view>
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
                modalName: '',
                listTouchStart: 0,
                listTouchDirection: null,
                // 假数据
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
            uni.navigateTo({url: '/pages/navigation/Search'});
        },
        methods: {
            // ListTouch触摸开始
            touchStart (e) {
                this.listTouchStart = e.touches[0].pageX;
            },
            // ListTouch计算方向
            touchMove (e) {
                this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left';
            },
            // ListTouch计算滚动
            touchEnd (e) {
                if (this.listTouchDirection === 'left') {
                    this.modalName = e.currentTarget.dataset.target;
                } else {
                    this.modalName = null;
                }
                this.listTouchDirection = null;
            },
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
        .cu-list {
            overflow-y: auto;

            .cu-item {
                justify-content: unset;
                padding-right: unset;
                background: unset;

                .image-size {
                    width: 105rpx;
                }

                .cu-avatar {
                    float: left;
                    left: 15rpx;
                }

                .content {
                    float: left;
                    left: 135rpx;
                    width: calc(100% - 140rpx - 20rpx);
                }

                .move-no-top {
                    width: 140rpx;
                }
            }

            .move-no-top-cur {
                transform: translateX(-140rpx);
            }
        }
    }
</style>
