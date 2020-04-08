<template>
    <view class="login full-screen login-image">
        <button class="cu-btn block bg-red margin-tb-sm lg" open-type="getUserInfo" @getuserinfo="loginWx"
                withCredentials="true">
            一键登录
        </button>
    </view>
</template>

<script>
    import request from '../../util/request';

    export default {
        name: 'Login',
        data () {
            return {
                operateType: ''
            };
        },
        onLoad (option) {
            if (option.navigatePage === 'back') {
                this.operateType = 'back';
            }
        },
        methods: {
            endOperation () {
                if (this.operateType === 'back') {
                    uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
                        delta: 1
                    });
                }
            },
            loginWx () {
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
                                        uni.setStorage({
                                            key: 'userInfo',
                                            data: data.data[0]
                                        });
                                        this.$store.commit('SET_USERINFO', data.data[0]);
                                        this.endOperation();
                                    } else {
                                        console.error('获取用户信息失败1');
                                        uni.showToast({
                                            title: '获取用户信息失败',
                                            duration: 1000,
                                            icon: 'none'
                                        });
                                    }
                                }).catch(e => {
                                    uni.hideLoading();
                                    console.error('获取用户信息失败2');
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
    .login {
        .cu-btn {
            width: 400upx;
            position: absolute;
            top: 85%;
            left: 50%;
            z-index: 10;
            transform: translate(-50%, -50%);
        }
    }

</style>