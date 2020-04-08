<template>
    <view class="directory">
        <scroll-view scroll-x class="nav">
            <view class="flex text-center">
                <view class="cu-item flex-sub" :class="{'text-red cur': item.key===tabCur}"
                      v-for="(item,index) in sortTabs" :key="index" @tap="tabSelect" :data-sort="item.key">
                    {{item.value}}
                </view>
            </view>
        </scroll-view>
        <view class="fill"></view>
        <view class="cu-list menu">
            <view class="cu-item arrow" :class="{'chosen-item': item.chaptersId === currentChapterId}"
                  v-for="(item, index) in directoryList" :key="index" hover-class='hover-class-style'
                  hover-stay-time='600' @tap="jumpChapterBtn(item.chaptersId)">
                <view class="content">
                    <text :class="item.chaptersId === currentChapterId ? 'cuIcon-locationfill text-red' : 'cuIcon-location text-grey'"></text>
                    <text class="text-grey">{{item.chapter}}</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: 'Directory',
        data () {
            return {
                directoryList: [],
                currentChapterId: '',
                tabCur: 'positive',
                halfHeight: 400,
                sortTabs: [
                    { key: 'positive', value: '正序' },
                    { key: 'reverse', value: '倒序' }
                ]
            };
        },
        onLoad (option) {
            this.directoryList = JSON.parse(option.directory);
            this.currentChapterId = option.currentChapterId;
            if (this.directoryList && this.directoryList.length && this.currentChapterId) {
                if (uni.getStorageSync('phoneInfo') && uni.getStorageSync('phoneInfo').windowHeight) {
                    this.halfHeight = uni.getStorageSync('phoneInfo').windowHeight / 2;
                } else {
                    this.halfHeight = 400;
                    uni.getSystemInfo({
                        success: function (e) {
                            uni.setStorageSync('phoneInfo', e);
                        }
                    });
                }
                this.scrollCenter();
            }
        },
        methods: {
            jumpChapterBtn (chaptersId) {
                if (this.currentChapterId !== chaptersId) {
                    let pages = getCurrentPages();
                    let prevPage = pages[pages.length - 2];  //上一个页面
                    prevPage.$vm.queryNewChapter(chaptersId, 'insert');
                }
                uni.navigateBack({
                    delta: 1
                });
            },
            tabSelect (e) {
                if (this.tabCur !== e.currentTarget.dataset.sort) {
                    this.tabCur = e.currentTarget.dataset.sort;
                    this.directoryList.reverse();
                    this.scrollCenter();
                }
            },
            scrollCenter () {
                uni.createSelectorQuery().select('.directory').boundingClientRect(data => {
                    uni.createSelectorQuery().select('.chosen-item').boundingClientRect((res) => {
                        uni.pageScrollTo({
                            duration: 0,
                            scrollTop: res.top - data.top - this.halfHeight
                        });
                    }).exec();
                }).exec();
            }
        }
    };
</script>

<style lang="scss" scoped>
    .directory {

        .nav {
            position: fixed;
            background: #f7f6f2;
            z-index: 2;
        }

        .fill {
            height: 94upx;
            width: 100%;
        }

        .cu-item {
            background: unset;
        }
    }

    .hover-class-style {
        opacity: 0.9;
        background: #f7f7f7 !important;
    }
</style>