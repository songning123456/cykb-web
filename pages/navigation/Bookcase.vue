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
                    <view class="action delete-icon" v-if="isToDelete">
                        <radio class="round" :class="{'checked': deleteList.includes(item.novelsId)}" :checked="deleteList.includes(item.novelsId)"
                               :value="item.novelsId" @tap.stop="changeDelBtn(item.novelsId)"></radio>
                    </view>
                </view>
                <view class="cu-item" v-if="!isToDelete">
                    <view class="cu-avatar radius lg add-image"></view>
                    <view class="content">
                        <view class="text-black text-bold" @tap="navChange">收藏小说</view>
                    </view>
                </view>
            </scroll-view>
            <view class="delete-bottom text-lg" :style="{bottom:isToDelete ? 0 : '-110upx'}">
                <view class="left" @tap.stop="DelSetBtn('all')">{{deleteList.length !== result.length ? '全选' : '取消全选'}}</view>
                <view class="right text-red" @tap.stop="DelSetBtn('delete')">删除{{deleteList.length ? '(' + deleteList.length + ')' : ''}}</view>
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
                result: [],
                toDeleteInfo: {},
                deleteList: [],
                isToDelete: false
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
            // 判断左侧删除按钮是否存在
            let hdDoc = document.getElementsByClassName('uni-page-head-hd') && document.getElementsByClassName('uni-page-head-hd')[0];
            if (this.userInfo) {
                hdDoc.style.opacity = '1';
                hdDoc.style.pointEvents = 'auto';
                setTimeout(() => {
                    uni.startPullDownRefresh();
                }, 100)
            } else {
                hdDoc.style.opacity = '0';
                hdDoc.style.pointEvents = 'none';
            }
        },
        watch: {
            userInfo: {
                handler(newVal, oldVal) {
                    // 主要用于 一开始未登录，后来登录；重新加载数据
                    if (newVal && !oldVal) {
                        // 当用户存在时，左侧删除按钮一定存在
                        let hdDoc = document.getElementsByClassName('uni-page-head-hd') && document.getElementsByClassName('uni-page-head-hd')[0];
                        hdDoc.style.opacity = '1';
                        hdDoc.style.pointEvents = 'auto';
                        setTimeout(() => {
                            uni.startPullDownRefresh();
                        }, 100)
                    }
                },
                immediate: true
            },
            sortType (newVal, oldVal) {
                this.queryBookcase();
            },
            isToDelete: {
                handler(newVal, oldVal) {
                    let ftDoc = document.getElementsByClassName('uni-page-head-ft') && document.getElementsByClassName('uni-page-head-ft')[0];
                    let barDoc = document.getElementsByClassName('uni-tabbar') && document.getElementsByClassName('uni-tabbar')[0];
                    if (newVal) {
                        ftDoc.style.opacity = '0';
                        ftDoc.style.pointEvents = 'none';
                        barDoc.style.opacity = '0';
                        barDoc.style.pointEvents = 'none';
                    } else {
                        ftDoc.style.opacity = '1';
                        ftDoc.style.pointEvents = 'auto';
                        barDoc.style.opacity = '1';
                        barDoc.style.pointEvents = 'auto';
                    }
                },
                immediate: true
            }
        },
        onPullDownRefresh () {
            if (this.userInfo && !this.isToDelete) {
                this.queryBookcase();
            } else {
                uni.stopPullDownRefresh();//得到数据后停止下拉刷新
            }
        },
        onNavigationBarButtonTap(e) {
            if (e.type === 'delete' && this.result.length) {
                if (this.isToDelete) {
                    this.isToDelete = false;
                    this.deleteList = [];
                } else {
                    this.isToDelete = true;
                }
            }else {
                if (!this.isToDelete) {
                    uni.navigateTo({url: '/pages/navigation/Search'});
                }
            }
        },
        methods: {
            startReading (item) {
                if (!this.isToDelete) {
                    this.$store.commit('SET_NAVIGATEPARAMS', {novels: item});
                    uni.navigateTo({ url: '/pages/reading/SimpleRead' });
                }
            },
            navChange () {
                if (!this.isToDelete) {
                    uni.switchTab({
                        url: '/pages/navigation/Classify',
                    });
                }
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
            changeDelBtn(novelsId) {
               if (this.deleteList.includes(novelsId)) {
                   let index = this.deleteList.indexOf(novelsId);
                   this.deleteList.splice(index, 1);
               } else {
                   this.deleteList.push(novelsId);
               }
            },
            DelSetBtn(type) {
                if (type === 'all') {
                    if (this.deleteList.length !== this.result.length) {
                        this.result.forEach(item => {
                            if (!this.deleteList.includes(item.novelsId)) {
                                this.deleteList.push(item.novelsId);
                            }
                        })
                    } else {
                        this.deleteList = [];
                    }
                } else {
                    if (!this.deleteList.length) {
                        return;
                    }
                    uni.showModal({
                        title: '提示',
                        content: '确定从书架中移除选中小说?',
                        success: (res) => {
                            if (res.confirm) {
                                let params = {
                                    condition: {
                                        uniqueId: this.userInfo.uniqueId,
                                        novelsIdList: this.deleteList
                                    }
                                };
                                uni.showLoading({ title: 'loading...', mask: true });
                                let tempList = this.deleteList;
                                request.post('/relation/deleteBookcase', params).then(data => {
                                    if (data.status === 200) {
                                        this.result = this.result.filter(item => !tempList.includes(item.novelsId));
                                    }
                                }).finally(() => {
                                    uni.hideLoading();
                                });
                            }
                        },
                        complete: () => {
                            this.isToDelete = false;
                            this.deleteList = [];
                        }
                    });
                }
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

                .delete-icon {
                    position: absolute;
                    right: 2%;

                    /deep/ uni-radio::before, uni-checkbox::before {
                        color: #f7f6f2 !important;
                    }

                    /deep/ uni-radio .uni-radio-input {
                        background-color: unset;
                    }

                    /deep/ uni-radio:not([disabled]) .uni-radio-input:hover {
                         border-color: #d1d1d1;
                    }
                }
            }
            .delete-bottom {
                position: fixed;
                height: 100upx;
                transition: all 0.2s;
                width: 100%;
                z-index: 1000;
                background-color: rgb(247, 246, 242);

                .left, .right {
                    height: 100%;
                    float: left;
                    text-align: center;
                    line-height: 100upx;
                    letter-spacing: 1upx;
                    border-top: 1upx solid rgba(0, 0, 0, 0.33);
                }

                .left {
                    width: 50%;
                    border-right: 1upx solid rgba(0, 0, 0, 0.33);
                }

                .right {
                    width: calc(50% - 1upx);
                }
            }
        }
    }
</style>
