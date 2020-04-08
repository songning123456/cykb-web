<template>
    <view class="my full-size">
        <view class="cu-card case no-card">
            <view class="cu-item shadow">
                <view class="image text-center">
                    <view class="cu-avatar round xl" :style='avatarClazz' :class="{'no-login-avatar': !UserInfo}">
                        <view v-if='UserInfo' class="cu-tag badge" :class="sexClazz"></view>
                        <button v-else class="cu-btn round line-gray sm" open-type="getUserInfo"
                                @getuserinfo="wxBtn" withCredentials="true">
                            点击登陆
                        </button>
                    </view>
                    <view class="margin-top-xs text-gray">{{UserInfo.nickName ? UserInfo.nickName : '未知'}}</view>
                </view>
            </view>
        </view>
        <view class="cu-list menu">
            <button open-type="share" class="cu-item arrow">
                <view class="content">
                    <text class="text-black cuIcon-share"></text>
                    <text class="text-black">分享给朋友</text>
                </view>
            </button>
            <view class="cu-item arrow" v-for="(item, index) in displayInfo" :key="index" @tap="tapBtn(item.icon)">
                <view class="content">
                    <text class="text-black" :class="'cuIcon-' + item.icon"></text>
                    <text class="text-black">{{item.title}}</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import request from '../../util/request';

    export default {
        name: 'My',
        data() {
            return {
                displayInfo: [
                    {
                        icon: 'comment',
                        title: '意见反馈'
                    },
                    {
                        icon: 'settings',
                        title: '设置'
                    }
                ]
            };
        },
        onShareAppMessage: function (res) {
            return {
                title: '畅游看吧',
                path: '/pages/navigation/HomePage',
                imageUrl: '/static/image/share.png'
            };
        },
        computed: {
            UserInfo() {
                return this.$store.state.userInfo;
            },
            sexClazz() {
                let clazz = '';
                if (this.$store.state.userInfo) {
                    if (this.$store.state.userInfo.gender === 1) {
                        clazz = 'cuIcon-male bg-blue';
                    } else if (this.$store.state.userInfo.gender === 2) {
                        clazz = 'cuIcon-female bg-pink';
                    }
                }
                return clazz;
            },
            avatarClazz() {
                let clazz = '';
                if (this.$store.state.userInfo && this.$store.state.userInfo.avatar) {
                    clazz = `background-image:url(${this.$store.state.userInfo.avatar})`;
                }
                return clazz;
            }
        },
        methods: {
            tapBtn(type) {
                switch (type) {
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
            wxBtn() {
                uni.login({
                    success: response2 => {
                        // 获取用户信息
                        uni.getUserInfo({
                            provider: 'weixin',
                            success: response3 => {
                                uni.showLoading({
                                    title: '登陆中',
                                    mask: true
                                });
                                let params = {
                                    condition: {
                                        code: response2.code,
                                        avatar: response3.userInfo.avatarUrl,
                                        nickName: response3.userInfo.nickName,
                                        gender: response3.userInfo.gender
                                    }
                                };
                                request.post('/users/weixin/getUsersInfo', params).then(data => {
                                    uni.hideLoading();
                                    if (data.status === 200) {
                                        let result = JSON.stringify(data.data[0]);
                                        uni.setStorage({
                                            key: 'userInfo',
                                            data: result
                                        });
                                        this.$store.commit('SET_USERINFO', data.data[0]);
                                        this.$emit('userInfo', data.data[0]);
                                    } else {
                                        uni.showToast({
                                            title: '获取用户信息失败',
                                            duration: 1000,
                                            icon: 'none'
                                        });
                                    }
                                }).catch(e => {
                                    uni.hideLoading();
                                    uni.showToast({
                                        title: '获取用户信息失败',
                                        duration: 1000,
                                        icon: 'none'
                                    });
                                });
                            },
                            fail: reject3 => {
                                // doNothing...
                            }
                        });
                    },
                    fail: response2 => {
                        debugger;
                        uni.showToast({
                            title: '登录失败',
                            duration: 1000,
                            icon: 'none'
                        });
                    }
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .my {

        .cu-list {
            button {
                text-align: unset;
            }

            button::after {
                border-bottom: 1upx solid #ddd;
                border-top: unset;
                text-decoration: unset;
                line-height: unset;
                border-radius: unset;
                overflow: unset;
                color: unset;
            }
        }
    }
</style>
