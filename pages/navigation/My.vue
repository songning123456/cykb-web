<template>
    <view class="my full-size">
        <view class="cu-list menu">
            <view class="cu-item arrow" v-for="(item, index) in displayInfo" :key="index" @tap="tapBtn(item.icon)">
                <view class="content">
                    <text class="text-black" :class="'cuIcon-' + item.icon"></text>
                    <text class="text-black">{{item.title}}</text>
                </view>
            </view>
        </view>
        <view class="cu-modal" :class="{'show': shareModal}">
            <view class="cu-dialog">
                <view class="cu-bar bg-white justify-end">
                    <view class="content">提示</view>
                </view>
                <view class="padding-xl">
                    (温馨提示：链接复制成功，请分享给您的好友)发送给好友的复制内容是:<br> {{clipboard}}
                </view>
                <view class="cu-bar bg-white">
                    <view class="action margin-0 flex-sub text-blue solid-left" @tap="hideShareModal">取消</view>
                    <view class="action margin-0 flex-sub  text-red solid-left" @tap="hideShareModal(false)">复制链接</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import h5Copy from '.././../util/CustomCopy';

    export default {
        name: 'My',
        data () {
            return {
                displayInfo: [
                    {
                        icon: 'share',
                        title: '分享给朋友'
                    },
                    {
                        icon: 'comment',
                        title: '意见反馈'
                    },
                    {
                        icon: 'settings',
                        title: '设置'
                    }
                ],
                shareModal: false,
                clipboard: 'novels.simple-blog.xyz'
            };
        },
        methods: {
            tapBtn (type) {
                switch (type) {
                    case 'share':
                        this.shareModal = true;
                        break;
                    case 'comment':
                        uni.navigateTo({
                            url: '/pages/comment/Comment'
                        });
                        break;
                    case 'settings':
                        uni.navigateTo({
                            url: '/pages/settings/Settings'
                        });
                        break;
                }
            },
            hideShareModal (type) {
                this.shareModal = false;
                if (!type) {
                    h5Copy(this.clipboard);
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    .my {
        .cu-modal {
            transform: scale(1);
        }
    }
</style>
