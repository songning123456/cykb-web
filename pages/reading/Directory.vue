<template>
    <view class="directory">
        <view class="cu-list menu">
            <scroll-view :scroll-top="scrollTop" scroll-y="true" style="height: 100%;">
                <view class="cu-item dir-item" :class="{'chosen-item': item.chaptersId === currentChapterId}"
                      v-for="(item, index) in directoryList" :key="index" @tap="jumpChapterBtn(item.chaptersId)">
                    <view class="content text-cut">
                        <text class='text-icon' :class="item.chaptersId === currentChapterId ? 'cuIcon-locationfill text-red' : 'cuIcon-location text-grey'"></text>
                        <text class="text-grey">{{item.chapter}}</text>
                    </view>
                </view>
            </scroll-view>
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
                halfHeight: 400,
                scrollTop: -1
            };
        },
        mounted () {
            let doc = document.getElementsByClassName('uni-page-head-ft')[0];
            doc.addEventListener('click', this.topBottomBtn);
        },
        destroyed () {
            let doc = document.getElementsByClassName('uni-page-head-ft')[0];
            if (doc) {
                doc.removeEventListener('click', this.topBottomBtn);
            }
        },
        onLoad (option) {
            this.directoryList = JSON.parse(decodeURIComponent(option.directory));
            this.currentChapterId = JSON.parse(decodeURIComponent(option.currentChapterId));
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
            jumpChapterBtn (chaptersId) {
                if (this.currentChapterId !== chaptersId) {
                    let pages = getCurrentPages();
                    let prevPage = pages[pages.length - 2];  //上一个页面
                    prevPage.$vm.queryNewChapter(chaptersId, 'insert');
                }
                uni.navigateBack({ delta: 1 });
            },
            scrollCenter () {
                this.$nextTick(() => {
                    uni.createSelectorQuery().select('.directory').boundingClientRect(data => {
                        uni.createSelectorQuery().select('.chosen-item').boundingClientRect((res) => {
                            this.scrollTop = res.top - data.top - this.halfHeight;
                        }).exec();
                    }).exec();
                });
            },
            topBottomBtn () {
                let doc = document.getElementsByClassName('uni-page-head-ft')[0];
                if (doc.innerHTML.includes('到底部')) {
                    this.scrollTop = 99999999999;
                    doc.innerHTML = doc.innerHTML.replace(/底/, '顶');
                } else if (doc.innerHTML.includes('到顶部')) {
                    this.scrollTop = 0;
                    doc.innerHTML = doc.innerHTML.replace(/顶/, '底');
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    .directory {
        height: 100%;

        .cu-list {
            height: 100%;
            overflow: auto;

            .dir-item {
                background: white;
                padding-right: 45px;
                position: relative;
                display: flex;
                padding-left: 10px;
                min-height: 50px;
                -webkit-box-pack: justify;
                justify-content: space-between;
                -webkit-box-align: center;
                align-items: center;

                .content {
                    font-size: 15px;
                    line-height: 1.6em;
                    -webkit-box-flex: 1;
                    -webkit-flex: 1;
                    flex: 1;

                    .text-icon {
                        display: inline-block;
                        margin-right: 5px;
                        width: 1.6em;
                        text-align: center;
                    }
                }
            }

            .dir-item:before {
                position: absolute;
                top: 0;
                right: 15px;
                bottom: 0;
                display: block;
                margin: auto;
                width: 15px;
                height: 15px;
                color: #8799a3;
                content: "\e6a3";
                text-align: center;
                font-size: 17px;
                font-family: cuIcon;
                line-height: 15px;
            }

            .dir-item:after {
                position: absolute;
                top: 0;
                left: 0;
                box-sizing: border-box;
                width: 200%;
                height: 200%;
                border-bottom: 1px solid #ddd;
                border-radius: inherit;
                content: " ";
                -webkit-transform: scale(.5);
                transform: scale(.5);
                -webkit-transform-origin: 0 0;
                transform-origin: 0 0;
                pointer-events: none;
            }
        }
    }
</style>
