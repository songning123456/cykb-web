<template>
    <view class="reading full-screen" :style="{background: skin.pageBgColor}" @click="clickCenter">
        <scroll-view scroll-y="true" @scroll="scrollOn"
                     :scroll-top="scrollTop" class="scroll-content">
            <view class="padding flex flex-direction text-bold letter-space">
                <button :style="[{color: skin.fontColor}]" class="cu-btn line-black margin-tb-sm lg shadow"
                        @tap.stop="readMore('previous')">上一章
                </button>
            </view>
            <view class="read-content"
                  :style="[{background:skin.pageBgColor,'font-size':skin.fontSize+'px','line-height':skin.lineHeight+'px','color':skin.fontColor}]">
                <rich-text :nodes="nodes"></rich-text>
            </view>
            <view class="load-again" v-if="JSON.stringify(this.chapterInfo) === '{}'" @tap="loadChapterInfoBtn">
                <view class="cuIcon-refresh"></view>
                <view class="load-text">重新加载</view>
            </view>
            <view class="padding flex flex-direction text-bold letter-space">
                <button :style="[{color: skin.fontColor}]" class="cu-btn line-black margin-tb-sm lg shadow"
                        @tap.stop="readMore('next')">下一章
                </button>
            </view>
        </scroll-view>

        <!-- 遮罩层左侧部分 -->
        <view class="mask-left" :style="{left:isShowMask? '5%':'-15%'}">
            <view class="flex flex-direction text-bold">
                <button :style="[{color: skin.fontColor}]" class="cu-btn line-black lg"
                        :class="skin.fontColor !== '#7e8894' ? 'left-btn-border' : 'left-btn-border-2'"
                        @tap="readMore('previous')">上一章
                </button>
            </view>
        </view>
        <!-- 遮罩层右侧部分 -->
        <view class="mask-right" :style="{right:isShowMask? '5%':'-15%'}">
            <view class="flex flex-direction text-bold">
                <button :style="[{color: skin.fontColor}]" class="cu-btn line-black lg"
                        :class="skin.fontColor !== '#7e8894' ? 'right-btn-border' : 'right-btn-border-2'"
                        @tap="readMore('next')">下一章
                </button>
            </view>
        </view>
        <!-- 遮罩层上部分 -->
        <view class="mask-top" :style="{top:isShowMask?0:-100+'rpx','background':skin.maskBgColor}">
            <view class="mask-title" :style="'color:' + skin.fontColor">{{chapterInfo.chapter || '未知'}}
            </view>
        </view>
        <!-- 遮罩层下部分 -->
        <view class="mask-bottom" :style="{bottom:isShowMask?0:-300+'rpx','background':skin.maskBgColor}">
            <view class="v1">
                <view class="slider-warp" :style="[{color: skin.fontColor}]">
                    字体：
                    <slider class="slider" block-size="20" activeColor="#FFCC33" :step="2" backgroundColor="#000000"
                            block-color="#8A6DE9" :value="skin.fontSize" @change="sliderChange($event,'fontSize')"
                            min="18" max="30"></slider>
                </view>
                <view class="slider-warp" :style="[{color: skin.fontColor}]">
                    间距：
                    <slider class="slider" block-size="20" activeColor="#FFCC33" :step="2" backgroundColor="#000000"
                            block-color="#8A6DE9" :value="skin.lineHeight" @change="sliderChange($event,'padding')"
                            min="26" max="50"></slider>
                </view>
            </view>
            <view class="v2">
                <view v-for="(item, index) in colorArr" :key="index" class="v2-circle"
                      :style="'background-color:' + item.pageBgColor" @click="changeBackground(index)">
                    <text class="cuIcon-check text-red" v-show="skin.currentSkinIndex===index"></text>
                </view>
            </view>
            <view class="v3 v-page">
                <view class="v3-item">
                    <button class="cu-btn block line-black" :style="'color:' + skin.fontColor" @tap="directoryBtn">
                        <text class="cuIcon-sort"></text>
                        目录
                    </button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import UniIcon from '../../components/UniIcon';
    import UniTag from '../../components/UniTag';
    import request from '../../util/request';

    export default {
        name: 'SimpleRead',
        components: { UniTag, UniIcon },
        data () {
            return {
                isShowMask: false,
                skin: {
                    pageBgColor: '#f0f0f0',//页面背景颜色
                    maskBgColor: '#fff', // 遮罩层背景颜色
                    fontSize: 18,//字体大小
                    lineHeight: 28,//字体间距
                    fontColor: '#000',//字体颜色
                    currentSkinIndex: 0
                },
                colorArr: [
                    {
                        pageBgColor: '#f0f0f0',//背景色
                        maskBgColor: '#fff',//遮罩层色
                        fontColor: '#000'//字体颜色
                    },
                    {
                        pageBgColor: '#d8c9aa',//背景色
                        maskBgColor: '#f3e4c3',//遮罩层色
                        fontColor: '#3c2506',//字体颜色
                        color: '#e0d1aa',//选择圆圈颜色
                    },
                    {
                        pageBgColor: '#daba94',//背景色
                        maskBgColor: '#f8dcb4',//遮罩层色
                        fontColor: '#3c2506'//字体颜色
                    },
                    {
                        pageBgColor: '#cfb793',//背景色
                        maskBgColor: '#f8dcb4',//遮罩层色
                        fontColor: '#674923'//字体颜色
                    },
                    {
                        pageBgColor: '#aac9aa',//背景色
                        maskBgColor: '#cdeccd',//遮罩层色
                        fontColor: '#2c1e1e'//字体颜色
                    },
                    {
                        pageBgColor: '#333b3d',//背景色
                        maskBgColor: '#313439',//遮罩层色
                        fontColor: '#7e8894'//字体颜色
                    }
                ],
                novels: null,
                //正文
                chapterInfo: {},
                storageInfo: {},
                directory: [],
                nodes: '',
                errorNode: '<div class="node-title">未知</div><div class="node-content">加载出错了!!!</div>',
                scrollTop: 0
            };
        },
        onLoad (options) {
            this.novels = JSON.parse(options.novels);
            uni.setNavigationBarTitle({ title: this.novels.title });
            if (uni.getStorageSync('skin')) {
                this.skin = uni.getStorageSync('skin');
            }
            this.setSkin();
            this.topBtn();
            this.loadChapterInfoBtn();
        },
        methods: {
            loadChapterInfoBtn () {
                uni.showLoading({ title: 'loading...', mask: true });
                let params;
                let url;
                if (uni.getStorageSync(this.novels.novelsId + ':scrollInfo')) {
                    this.storageInfo = uni.getStorageSync(this.novels.novelsId + ':scrollInfo');
                    params = { novelsId: this.novels.novelsId, chaptersId: this.storageInfo.chaptersId };
                    url = '/chapters/readMore';
                } else {
                    params = { novelsId: this.novels.novelsId };
                    url = '/chapters/firstChapter';
                }
                request.get(url, params).then(data => {
                    if (data.status === 200 && data.data.length) {
                        this.chapterInfo = data.data[0];
                        this.directory = data.listExt;
                        this.modifyNode('first');
                    } else {
                        this.nodes = this.errorNode;
                    }
                }).catch(() => {
                    this.nodes = this.errorNode;
                }).finally(() => {
                    uni.hideLoading();
                });
            },
            topBtn () {
                // 如果 已经登陆， 则在已经加入书架的前提下更新阅读时间
                if (this.$store.state.userInfo) {
                    let params = {
                        condition: {
                            uniqueId: this.$store.state.userInfo.uniqueId,
                            novelsId: this.novels.novelsId
                        }
                    };
                    request.post('/relation/topBookcase', params).catch(() => {});
                }
            },
            queryNewChapter (chaptersId) {
                let params = { novelsId: '', chaptersId: chaptersId };
                uni.showLoading({ title: 'loading...', mask: true });
                this.nodes = '';
                request.get('/chapters/readMore', params).then(data => {
                    if (data.status === 200 && data.data.length) {
                        this.chapterInfo = data.data[0];
                        this.modifyNode();
                    }
                }).finally(() => {
                    uni.hideLoading();
                });
            },
            readMore (type) {
                let index = this.convertChapterIndex(this.chapterInfo.chaptersId);
                if (type === 'previous') {
                    if (index > 0) {
                        this.queryNewChapter(this.directory[--index].chaptersId);
                    } else {
                        uni.showToast({ title: '已到顶了!', duration: 1000, icon: 'none' });
                    }
                } else {
                    if (index < this.directory.length - 1) {
                        this.queryNewChapter(this.directory[++index].chaptersId);
                    } else {
                        uni.showToast({ title: '已到底了!', duration: 1000, icon: 'none' });
                    }
                }
            },
            convertChapterIndex (chaptersId) {
                let result = 0;
                for (let i = 0, len = this.directory.length; i < len; i++) {
                    if (this.directory[i].chaptersId === chaptersId) {
                        result = i;
                        break;
                    }
                }
                return result;
            },
            modifyNode (type) {
                this.nodes = `<div class="node-title">${this.chapterInfo.chapter}</div><div class="node-content">${this.chapterInfo.content}</div>`;
                this.scrollTop = Math.random();
                this.$nextTick(() => {
                    if (type === 'first' && this.storageInfo && this.storageInfo.scrollTop) {
                        this.scrollTop = this.storageInfo.scrollTop;
                    } else {
                        this.scrollTop = 0;
                    }
                });
            },
            //点击中间
            clickCenter () {
                this.isShowMask = !this.isShowMask;
            },
            scrollOn (e) {
                this.setScrollInfo(e.detail.scrollTop);
            },
            setScrollInfo (scrollTop) {
                try {
                    let storage = {
                        chapter: this.chapterInfo.chapter,
                        chaptersId: this.chapterInfo.chaptersId,
                        novelsId: this.novels.novelsId,
                        scrollTop: scrollTop
                    };
                    uni.setStorageSync(this.novels.novelsId + ':scrollInfo', storage);
                } catch (e) {
                    // error
                }
            },
            directoryBtn () {
                uni.navigateTo({
                    url: '/pages/reading/Directory?directory=' + JSON.stringify(this.directory) + '&currentChapterId=' + this.chapterInfo.chaptersId
                });
            },
            //滑块设置字体间距或大小
            sliderChange (e, type) {
                if (type === 'fontSize') {
                    this.skin.fontSize = e.detail.value;
                } else {
                    this.skin.lineHeight = e.detail.value;
                }
                uni.setStorage({
                    key: 'skin',
                    data: this.skin
                });
            },
            setSkin () {
                let titleFontColor = '#000000';
                if (this.skin.pageBgColor === '#333b3d') {
                    titleFontColor = '#ffffff';
                }
                uni.setNavigationBarColor({
                    // 字体颜色 仅支持 #ffffff 和 #000000
                    frontColor: titleFontColor,
                    backgroundColor: this.skin.pageBgColor,
                });
                uni.setBackgroundColor({
                    backgroundColor: this.skin.pageBgColor
                });
            },
            //修改背景颜色
            changeBackground (index) {
                this.skin.currentSkinIndex = index;
                this.skin.pageBgColor = this.colorArr[index].pageBgColor;//背景颜色
                this.skin.fontColor = this.colorArr[index].fontColor;//字体颜色
                this.skin.maskBgColor = this.colorArr[index].maskBgColor;//遮罩背景色
                this.setSkin();
                uni.setStorage({
                    key: 'skin',
                    data: this.skin
                });
            },
        }
    };
</script>

<style scoped lang="scss">
    .reading {

        .scroll-content {
            height: 100%;
            padding: 0 16rpx;

            .read-content {
                min-height: 1100rpx;
            }
        }

        .load-again {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);

            .cuIcon-refresh {
                text-align: center;
                font-size: 100rpx;
            }

            .load-text {
                font-size: 30rpx;
            }
        }

        .mask-left {
            position: fixed;
            height: auto;
            transition: all 0.2s;
            top: 35%;
            width: auto;
            z-index: 1000;

            .left-btn-border, .left-btn-border-2 {
                line-height: 45rpx;
                width: 40rpx;
                height: 300rpx;
            }

            .left-btn-border:before, .left-btn-border-2:before {
                right: 100%;
                content: " ";
                position: absolute;
                border: 6px solid transparent;
            }

            .left-btn-border:before {
                border-right-color: black;
            }

            .left-btn-border-2:before {
                border-right-color: white;
            }
        }

        .mask-right {
            position: fixed;
            height: auto;
            transition: all 0.2s;
            top: 35%;
            width: auto;
            z-index: 1000;

            .right-btn-border, .right-btn-border-2 {
                line-height: 45rpx;
                width: 40rpx;
                height: 300rpx;
            }

            .right-btn-border:before, .right-btn-border-2:before {
                left: 100%;
                content: " ";
                position: absolute;
                border: 6px solid transparent;
            }

            .right-btn-border:before {
                border-left-color: black;
            }

            .right-btn-border-2:before {
                border-left-color: white;
            }
        }

        .mask-top {
            position: fixed;
            height: 40rpx;
            transition: all 0.2s;
            width: 100%;
            z-index: 1000;
            margin: auto;
            border-radius: 0 0 4px 4px;

            .mask-title {
                letter-spacing: 2px;
                line-height: 20px;
                text-align: center;
            }
        }

        .mask-bottom {
            position: fixed;
            height: 270rpx;
            transition: all 0.2s;
            width: 100%;
            z-index: 1000;
            margin: auto;
            border-radius: 10px 10px 0 0;
            padding: 10px;
            box-sizing: border-box;

            .v1 {
                width: 100%;
                display: flex;
                align-items: center;

                .slider-warp {
                    display: flex;
                    flex: 1;
                    align-items: center;

                    .slider {
                        flex: 1;
                    }
                }
            }

            .v2 {
                display: flex;
                width: 100%;
                justify-content: space-around;
                margin-top: 10px;

                .v2-circle {
                    width: 26px;
                    height: 26px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }

            .v3 {
                margin-top: 10px;

                .v3-item {
                    height: 42px;
                    padding: 0 30rpx;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    .cu-btn {
                        width: 300rpx;
                    }
                }
            }
        }

        /deep/ .node-title {
            font-weight: bold;
            margin-bottom: 100rpx;
        }

        /deep/ .node-content {
            margin-bottom: 100rpx;
            margin-bottom: 100rpx;
        }

        .letter-space {
            letter-spacing: 40rpx;
        }
    }

</style>
