<template>
    <view>
        <view class="fixedView icon" @touchstart.stop="touchIcon" @touchmove.stop="moveIcon" @tap.stop="tapIcon"
              :style="{left:iconPosition.left+'px',top:iconPosition.top+'px',width:iconSize.width+'upx',height:iconSize.height+'upx'}">
            <image :src="icon_path" :style="{width:iconSize.width+'upx',height:iconSize.height+'upx'}"
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
                that.$set(that, 'icon_path', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAACZUlEQVRIS8WXv2/TQBTHv+/yAwmJBYiAxGIBJsayILrESO1AHSEkKvGjjDDDP4D4B2AFJBZSQKISQnUZGglnKRsdmUAMKA6gCnbi9B6y04DtnO2zQUmGRHLu+/28d/fu3Zkwow8V4e5cWjzm/RrUfW1lX7Vfe7X5Na+PNvjLkrlQJlxnYEUFIaA9ZKwe33A6OkFkgnuWuSIQABc0DTsSWDVsp502PhXsLpkvQbisA5wYw1hrbDjLSdpEcM8yPxJwshB0T8TAJ8N2TiUszeRj1zK/ATjyL9CQ9nvDdo7GvSYy7lvmpmo9JeOeTiCCcFcB6dRtZzH8PAL2C4mAp3Ehgx4b9ttbOuCedf4RgW9OeuBGuOAi4KRs1UDeGT2nmk5ABESy/gN2W81zYNrSNNmGFKP9LGSbgTkdHYjnG+vdd0G4Y0HPMu8TcDvbgLfApWuCdg8MmWsC5c+g3WcAzWdpGXhg2M6dCNi1TM4SAuhwma6WPD4xhNwfGAhRQ4kcGvJzaDSZhu0EyQZffu8deF4/A/x6cEheqfwsnSXwQyllUGyCRJcJy95BaVd/iBcALqb5VCuVut/bA3D/QnOOBb1PE/iRuq1mC0xPAByWLJtjsP/rw411Zy1r5kjymfqb7rY2GPCr+G8Fx8GjoKNjVIlEwJpTHfFRg7OrJDLV/vCsKYpbFgVHiss31d9OoxCKgNXbKUcDKQpWNpCguhMOCNXK5c04sWXuTbfykPgfYEbKIZEnawI+BBsIOJ1Vy/FsIy0zLJ7JRWAcwEyuPmP4TC57ocynf70Nr/vUL/Sqip3qK0zWlsn7/28qKSAuOeuEFwAAAABJRU5ErkJggg==');
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
                uni.pageScrollTo({
                    scrollTop: 0,
                    duration: 300
                });
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
