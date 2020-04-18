<template>
    <view class="novels-cache full-size">
        <view class="cu-list full-size menu-avatar" v-if="cacheList.length">
            <scroll-view scroll-y="true" style="height: 100%;">
                <view class="cu-item" v-for="(item,index) in cacheList" :key="index">
                    <custom-image :url="item.coverUrl" class="image-size cu-avatar radius xl"></custom-image>
                    <view class="content">
                        <view class="desc">
                            <view class="text-black text-df">{{item.title || '未知书名'}}</view>
                            <view class="text-grey text-sm text-cut">{{item.chapter || '未知章节'}}</view>
                        </view>
                        <view>
                            <view class="cu-tag bg-red light sm round">{{item.author || '未知作者'}}</view>
                            <view class="cu-tag bg-green light sm round">{{item.category || '未知类别'}}
                            </view>
                            <view class="cu-tag bg-yellow light sm round">{{item.sourceName || '未知来源'}}</view>
                        </view>
                    </view>
                    <view class="action delete-icon">
                        <radio class="round" :class="{'checked': deleteList.includes(item.novelsId)}" :checked="deleteList.includes(item.novelsId)"
                               :value="item.novelsId" @tap.stop="addDelBtn(item.novelsId)"></radio>
                    </view>
                </view>
            </scroll-view>
        </view>
        <custom-empty v-else></custom-empty>
    </view>
</template>

<script>
    import CustomEmpty from '../../components/CustomEmpty';
    export default {
        name: 'NovelsCache',
        components: { CustomEmpty },
        data() {
            return {
                cacheList: [],
                deleteList: [],
            };
        },
        onLoad() {
            let allStorage = uni.getStorageInfoSync();
            for (let item of allStorage.keys) {
                if (item.includes('scrollInfo')) {
                    let cache = uni.getStorageSync(item);
                    this.cacheList.push(cache);
                }
            }
        },
        onNavigationBarButtonTap() {
            if (this.deleteList.length) {
                uni.showModal({
                    title: '提示',
                    content: '确定清空缓存?',
                    success: res => {
                        if (res.confirm) {
                           for (let novelsId of this.deleteList) {
                               uni.removeStorageSync(novelsId + ':scrollInfo');
                           }
                           this.cacheList = this.cacheList.filter(item => !this.deleteList.includes(item.novelsId));
                           this.deleteList = [];
                        } else if (res.cancel) {
                            this.deleteList = [];
                        }
                    }});
            }
        },
        methods: {
            addDelBtn(novelsId) {
                if (this.deleteList.includes(novelsId)) {
                    let index = this.deleteList.indexOf(novelsId);
                    this.deleteList.splice(index, 1);
                } else {
                    this.deleteList.push(novelsId);
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    .novels-cache {
        .cu-list {
            overflow-y: auto;

            .cu-item {
                justify-content: unset;
                padding-right: unset;
                background: unset;
                position: relative;
                display: flex;
                height: 140rpx;
                -webkit-box-align: center;
                -webkit-align-items: center;
                align-items: center;

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
                    width: calc(100% - 140rpx - 64rpx);
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
        }
    }
</style>