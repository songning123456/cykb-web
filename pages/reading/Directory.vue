<template>
    <view class="directory">
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
        data() {
            return {
                directoryList: [],
                currentChapterId: '',
                halfHeight: 400
            };
        },
        mounted() {
            let doc = document.getElementsByClassName('uni-page-head-ft')[0];
            doc.addEventListener('click', this.topBottomBtn);
        },
        destroyed() {
            let doc = document.getElementsByClassName('uni-page-head-ft')[0];
            doc.removeEventListener('click', this.topBottomBtn);
        },
        onLoad(option) {
            this.directoryList = JSON.parse(option.directory);
            this.currentChapterId = option.currentChapterId;
            if (this.directoryList && this.directoryList.length && this.currentChapterId) {
                if (uni.getStorageSync('systemInfo') && uni.getStorageSync('systemInfo').windowHeight) {
                    this.halfHeight = uni.getStorageSync('systemInfo').windowHeight / 2;
                } else {
                    this.halfHeight = 400;
                    uni.getSystemInfo({
                        success: function (e) {
                            uni.setStorageSync('systemInfo', e);
                        }
                    });
                }
                this.scrollCenter();
            }
        },
        methods: {
            jumpChapterBtn(chaptersId) {
                if (this.currentChapterId !== chaptersId) {
                    let pages = getCurrentPages();
                    let prevPage = pages[pages.length - 2];  //上一个页面
                    prevPage.$vm.queryNewChapter(chaptersId, 'insert');
                }
                uni.navigateBack({delta: 1});
            },
            scrollCenter() {
                this.$nextTick(() => {
                    uni.createSelectorQuery().select('.directory').boundingClientRect(data => {
                        uni.createSelectorQuery().select('.chosen-item').boundingClientRect((res) => {
                            uni.pageScrollTo({
                                duration: 0,
                                scrollTop: res.top - data.top - this.halfHeight
                            });
                        }).exec();
                    }).exec();
                });
            },
            topBottomBtn() {
                let doc = document.getElementsByClassName('uni-page-head-ft')[0];
                if (doc.innerHTML.includes('到底部')) {
                    uni.pageScrollTo({scrollTop: 99999999999, duration: 300});
                    setTimeout(() => {
                        doc.innerHTML = doc.innerHTML.replace(/底/, '顶');
                    }, 300);
                } else if (doc.innerHTML.includes('到顶部')) {
                    uni.pageScrollTo({scrollTop: 0, duration: 300});
                    setTimeout(() => {
                        doc.innerHTML = doc.innerHTML.replace(/顶/, '底');
                    }, 300);
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    .directory {

        .cu-item {
            background: unset;
        }
    }

    .hover-class-style {
        opacity: 0.9;
        background: #f7f7f7 !important;
    }
</style>
