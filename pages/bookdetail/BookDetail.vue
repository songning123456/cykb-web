<template>
    <view class="book-detail full-screen">
        <view class="book-frame">
            <view class="cu-card case no-card margin-bottom-sm">
                <view class="cu-item shadow">
                    <view class="image text-center">
                        <custom-image class="cu-avatar image-size" :url="novels.coverUrl"></custom-image>
                        <view class="margin-top-xs text-gray text-df">{{novels.title}}</view>
                        <view class="margin-top-xs">
                            <view class="cu-tag bg-red light sm round">{{novels.author}}</view>
                            <view class="cu-tag bg-green light sm round">{{novels.category || '未知'}}
                            </view>
                            <view class="cu-tag bg-yellow light sm round">{{novels.sourceName}}</view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="cu-card article no-card margin-bottom-sm bg-white">
                <view class="title text-center text-bold padding-top-xs">
                    <text>简介</text>
                </view>
                <view class="content padding introduction">
                    {{novels.introduction}}
                </view>
            </view>
            <view class="cu-list menu">
                <view class="cu-item">
                    <view class="content">
                        <text class="text-black">最新章节</text>
                    </view>
                    <view class="action text-cut">
                        {{novels.latestChapter}}
                    </view>
                </view>
                <view class="cu-item" @click="changeShowMore">
                    <view class="content">作者还写过</view>
                    <view class="action text-gray" :class="{'rotate-90': showMore}">
                        <text class="lg text-gray cuIcon-right"></text>
                    </view>
                </view>
                <scroll-view scroll-x="true" scroll-y="true" class="author-books margin-bottom-sm" v-show="showMore">
                    <block v-for="(item, index) in authorBooks" :key="index">
                        <view class="author-book" @tap="SimilarBookBtn(item)">
                            <view class="avatar-img">
                                <custom-image :url="item.coverUrl" class="uni-image"></custom-image>
                            </view>
                            <view class="text-cut text-center">{{item.title}}</view>
                        </view>
                    </block>
                </scroll-view>
            </view>
        </view>
        <view class="bottom-bar bg-white">
            <view class="btn-group cu-bar tabbar">
                <button class="cu-btn text-red line-red shadow" @tap="addBookcase">加入书架</button>
                <button class="cu-btn bg-red shadow-blur" @tap="startReading">开始阅读</button>
            </view>
        </view>
    </view>
</template>

<script>
    import request from '../../util/request';

    export default {
        name: 'BookDetail',
        data () {
            return {
                novels: {
                    coverUrl: '',
                    title: '',
                    author: '',
                    category: ''
                },
                authorBooks: [],
                showMore: true
            };
        },
        onLoad (option) {
            this.novels = JSON.parse(option.novels);
            this.querySameAuthor();
        },
        methods: {
            changeShowMore () {
                this.showMore = !this.showMore;
            },
            querySameAuthor () {
                let params = {
                    condition: {
                        author: this.novels.author
                    }
                };
                request.post('/novels/sameAuthor', params).then(data => {
                    if (data.status === 200 && data.total > 0) {
                        this.authorBooks = data.data.filter(item => item.title !== this.novels.title);
                    }
                });
            },
            SimilarBookBtn (novels) {
                uni.navigateTo({
                    url: '/pages/bookdetail/BookDetail?novels=' + novels
                });
            },
            addBookcase () {
                if (this.$store.state.userInfo) {
                    let params = {
                        condition: {
                            novelsId: this.novels.novelsId,
                            uniqueId: this.$store.state.userInfo.uniqueId
                        }
                    };
                    uni.showLoading({ title: 'loading...', mask: true });
                    request.post('/relation/insertBookcase', params).then(data => {
                        uni.hideLoading();
                        if (data.status === 200) {
                            uni.showToast({ title: '已添加至书架', duration: 1000 });
                        } else if (data.status === 201) {
                            uni.showToast({ title: '书架已存在此书', duration: 1000, icon: 'none' });
                        }
                    }).catch(() => {
                        uni.hideLoading();
                    });
                } else {
                    uni.navigateTo({ url: '/pages/login/Login?navigatePage=back' });
                }
            },
            startReading () {
                uni.navigateTo({ url: '/pages/reading/SimpleRead?novels=' + JSON.stringify(this.novels) });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .book-detail {

        .book-frame {
            width: 100%;
            height: calc(100% - (100upx + env(safe-area-inset-bottom) / 2 + 1px));
            overflow-y: auto;

            .cu-card {
                width: 100%;

                .cu-item {
                    width: 100%;
                    height: 100%;

                    .image {
                        width: 100%;
                        height: 100%;
                        padding: 30upx;
                        box-sizing: border-box;
                        margin: unset;

                        .image-size {
                            width: 165upx;
                            height: 220upx;
                            border-radius: 6upx;
                        }

                        .cu-tag {
                            position: unset;
                        }
                    }
                }
            }

            .author-books {
                white-space: nowrap; // 滚动必须加的属性
                width: 100%;
                padding: 20upx;
                margin: 0 auto;

                .author-book {
                    width: 24%;
                    margin-right: 20upx;
                    display: inline-block;
                    vertical-align: top;

                    .avatar-img {
                        display: inline-block;
                        height: 220upx;
                        width: 165upx;
                        border-radius: 6upx;
                        position: relative;

                        .custom-image {
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
            }
        }

        .bottom-bar {
            bottom: 0;
            position: fixed;
            width: 100%;
            border-top: 1px solid grey;
        }
    }

</style>
