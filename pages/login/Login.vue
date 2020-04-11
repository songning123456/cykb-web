<template>
    <view class="login full-screen login-image">
        <view class="login-position">
            <input type="number" placeholder="请输入手机号" v-model='form.code' @confirm='loginBtn'
                   confirm-type="go"/>
            <button class="cu-btn block bg-red lg" @tap="loginBtn" :loading="loading">一键登录</button>
        </view>
    </view>
</template>

<script>
    import request from '../../util/request';
    import regular from '../../util/regular';

    export default {
        name: 'Login',
        data () {
            return {
                operateType: '',
                form: {
                    code: ''
                },
                loading: false
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
                    uni.navigateBack({delta: 1});
                }
            },
            loginBtn() {
                if (!regular.phone.test(this.form.code)) {
                    uni.showToast({
                        title: '输入格式错误',
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
                        this.endOperation();
                    } else {
                        uni.showToast({
                            title: '获取信息失败',
                            duration: 1000,
                            image: '/static/image/error.png',
                        });
                    }
                }).catch(() => {
                    uni.showToast({
                        title: '获取信息失败',
                        duration: 1000,
                        image: '/static/image/error.png',
                    });
                }).finally(() => {
                    this.loading = false;
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .login {
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
