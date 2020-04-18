<template>
    <view>
        <view class="fixedView icon" @touchstart.stop="touchIcon" @touchmove.stop="moveIcon" @tap.stop="tapIcon"
              :style="{left:iconPosition.left+'px',top:iconPosition.top+'px',width:iconSize.width+'rpx',height:iconSize.height+'rpx'}">
            <image :src="icon_path" :style="{width:iconSize.width+'rpx',height:iconSize.height+'rpx'}"
                   mode="aspectFill"></image>
        </view>
    </view>
</template>

<script>
    export default {
        name: 'BackTop',
        data() {
            return {
                icon_path: '',
                windowSize: {
                    width: 0,
                    height: 0,
                    margin: {
                        left: 10,
                        right: 10,
                        top: 10,
                        bottom: 10
                    }
                },
                iconSize: {
                    width: 100,
                    height: 100
                },
                iconPosition: {
                    left: 0,
                    top: 0,
                    touchPosition: {
                        x: 0,
                        y: 0
                    }
                }
            };
        },
        props: {
            startPosition: {
                type: Number,
                default: 3
            },
            iconWidth: {
                type: Number,
                default: 100
            },
            iconHeight: {
                type: Number,
                default: 100
            },
            marginLeft: {
                type: Number,
                default: 10
            },
            marginRight: {
                type: Number,
                default: 10
            },
            marginTop: {
                type: Number,
                default: 45
            },
            marginBottom: {
                type: Number,
                default: 10
            },
            iconPath: {
                type: String,
                default: ''
            }
        },
        mounted() {
            this.$set(this.iconSize, 'width', this.iconWidth);
            this.$set(this.iconSize, 'height', this.iconHeight);
            this.$set(this.windowSize.margin, 'left', this.marginLeft);
            this.$set(this.windowSize.margin, 'right', this.marginRight);
            this.$set(this.windowSize.margin, 'top', this.marginTop);
            this.$set(this.windowSize.margin, 'bottom', this.marginBottom);
            this.$set(this.windowSize, 'width', uni.getSystemInfoSync().windowWidth);
            this.$set(this.windowSize, 'height', uni.getSystemInfoSync().windowHeight);
            switch (this.startPosition) {
                case 0:
                    //初始位置左上角
                    this.$set(this.iconPosition, 'left', this.windowSize.margin.left);
                    this.$set(this.iconPosition, 'top', this.windowSize.margin.top);
                    break;
                case 1:
                    //初始位置右上角
                    this.$set(this.iconPosition, 'left', this.windowSize.width - uni.upx2px(this.iconSize.width) - this.windowSize.margin.right);
                    this.$set(this.iconPosition, 'top', this.windowSize.margin.top);
                    break;
                case 2:
                    //初始位置左下角
                    this.$set(this.iconPosition, 'left', this.windowSize.margin.left);
                    this.$set(this.iconPosition, 'top', this.windowSize.height - uni.upx2px(this.iconSize.height) - this.windowSize.margin.bottom);
                    break;
                default:
                    //初始位置右下角
                    this.$set(this.iconPosition, 'left', this.windowSize.width - uni.upx2px(this.iconSize.width) - this.windowSize.margin.right);
                    this.$set(this.iconPosition, 'top', this.windowSize.height - uni.upx2px(this.iconSize.height) - this.windowSize.margin.bottom);
                    break;
            }
            let that = this;
            console.log(this.iconPath);
            if (this.iconPath === '') {
                that.$set(that, 'icon_path', 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTg2NTExNTM0MTM3IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjM4NjUiIHdpZHRoPSIzNSIgaGVpZ2h0PSIzNSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTkyNS43IDMzNy4yYy0yMi42LTUzLjUtNTUtMTAxLjUtOTYuMi0xNDIuNy00MS4yLTQxLjItODkuMi03My42LTE0Mi43LTk2LjJDNjMxLjQgNzQuOSA1NzIuNiA2MyA1MTIgNjNTMzkyLjYgNzQuOSAzMzcuMiA5OC4zYy01My41IDIyLjYtMTAxLjUgNTUtMTQyLjcgOTYuMi00MS4yIDQxLjItNzMuNiA4OS4yLTk2LjIgMTQyLjdDNzQuOSAzOTIuNiA2MyA0NTEuNCA2MyA1MTJzMTEuOSAxMTkuNCAzNS4zIDE3NC44YzIyLjYgNTMuNSA1NSAxMDEuNSA5Ni4yIDE0Mi43IDQxLjIgNDEuMiA4OS4yIDczLjYgMTQyLjcgOTYuMkMzOTIuNiA5NDkuMSA0NTEuNCA5NjEgNTEyIDk2MXMxMTkuNC0xMS45IDE3NC44LTM1LjNjNTMuNS0yMi42IDEwMS41LTU1IDE0Mi43LTk2LjJzNzMuNi04OS4yIDk2LjItMTQyLjdDOTQ5LjEgNjMxLjQgOTYxIDU3Mi42IDk2MSA1MTJzLTExLjktMTE5LjQtMzUuMy0xNzQuOHpNNjcyLjQgNTE0LjljLTQuOSA0LjktMTEuMyA3LjMtMTcuNyA3LjNzLTEyLjgtMi40LTE3LjctNy4zbC0xMDMtMTAzdjMzMS41YzAgMTMuOC0xMS4yIDI1LTI1IDI1cy0yNS0xMS4yLTI1LTI1di0zMjVMMzg2LjkgNTE1Yy05LjggOS43LTI1LjYgOS43LTM1LjQtMC4xLTkuNy05LjgtOS43LTI1LjYgMC4xLTM1LjRsMTQzLjMtMTQyLjJjOS44LTkuNyAyNS42LTkuNyAzNS4zIDAuMWwxNDIuMiAxNDIuMmM5LjggOS43IDkuOCAyNS41IDAgMzUuM3ogbS0wLjktMjA5LjNoLTMxOWMtMTMuOCAwLTI1LTExLjItMjUtMjVzMTEuMi0yNSAyNS0yNWgzMTljMTMuOCAwIDI1IDExLjIgMjUgMjVzLTExLjIgMjUtMjUgMjV6IiBmaWxsPSIjZTU0ZDQyIiBwLWlkPSIzODY2Ij48L3BhdGg+PC9zdmc+');
            } else {
                uni.getImageInfo({
                    src: this.iconPath,
                    success(err) {
                        that.$set(that, 'icon_path', that.iconPath);
                    },
                    fail(err) {
                        that.$set(that, 'icon_path', '');
                        uni.showModal({
                            title: '错误',
                            content: '未知图片：' + that.iconPath,
                            showCancel: false
                        });
                    }
                });
            }
        },
        methods: {
            touchIcon(e) {
                this.$set(this.iconPosition.touchPosition, 'x', e.touches[0].clientX);
                this.$set(this.iconPosition.touchPosition, 'y', e.touches[0].clientY);
            },
            moveIcon(e) {
                this.$set(this.iconPosition, 'left', e.touches[0].clientX - uni.upx2px(this.iconSize.width / 2));
                this.$set(this.iconPosition, 'top', e.touches[0].clientY - uni.upx2px(this.iconSize.height / 2) + uni.getSystemInfoSync().windowTop);
                this.$set(this.iconPosition, 'left', Math.min(this.windowSize.width - uni.upx2px(this.iconSize.width) - this.windowSize.margin.right, this.iconPosition.left));
                this.$set(this.iconPosition, 'left', Math.max(this.windowSize.margin.left, this.iconPosition.left));
                this.$set(this.iconPosition, 'top', Math.min(this.windowSize.height - uni.upx2px(this.iconSize.height) - this.windowSize.margin.bottom, this.iconPosition.top));
                this.$set(this.iconPosition, 'top', Math.max(this.windowSize.margin.top, this.iconPosition.top));
            },
            tapIcon(e) {
                this.$emit('backTop');
            }
        }
    };
</script>

<style scoped lang="scss">
    .fixedView {
        position: fixed;
        z-index: 200;
    }

    .icon {
        border-radius: 50%;
        overflow: hidden;
        border: none;
        box-shadow: 0 2px 5px #C0C0C0 !important;
    }
</style>
