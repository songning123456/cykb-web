<template>
    <view class="inset-login login-image full-size">
        <view class="login-position">
            <input type="number" placeholder="请输入手机号" v-model='form.code' @confirm='loginBtn'
                   confirm-type="go"/>
            <button class="cu-btn block bg-red lg" @tap="loginBtn" :loading="loading">手机登录</button>
        </view>
    </view>
</template>

<script>

    import regular from '../util/regular';
    import request from '../util/request';

    export default {
        name: 'InsetLogin',
        data() {
            return {
                form: {
                    code: ''
                },
                loading: false
            };
        },
        methods: {
            loginBtn() {
                if (!regular.phone.test(this.form.code)) {
                    uni.showToast({
                        title: '手机号码错误',
                        image: '/static/image/error.png',
                        duration: 2000
                    });
                    return;
                }
                let params = {
                    condition: this.form
                };
                this.loading = true;
                request.post('/users/web/getUsersInfo', params).then(data => {
                    if (data.status === 200) {
                        this.$store.commit('SET_USERINFO', data.data[0]);
                    } else {
                        uni.showToast({
                            title: '获取信息失败',
                            duration: 1000,
                            image: '/static/image/error.png'
                        });
                    }
                }).catch(() => {
                    uni.showToast({
                        title: '获取信息失败',
                        duration: 1000,
                        image: '/static/image/error.png'
                    });
                }).finally(() => {
                    this.loading = false;
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .inset-login {
        width: 100%;
        height: 100%;

        .login-position {
            position: absolute;
            width: 65%;
            top: 50%;
            left: 50%;
            z-index: 10;
            transform: translate(-50%, -50%);

            uni-input {
                height: 2.2em;
                margin-bottom: .8em;

                .uni-input-wrapper {

                    .uni-input-placeholder {
                        box-sizing: border-box;
                    }
                }
            }


            input {
                padding-left: 6px;
                box-sizing: border-box;
                background-color: #f7f6f2;
            }
        }
    }

</style>
