<template>
    <view class="comment full-screen">
        <form>
            <view class="cu-bar">
                <view class="action">
                    <text class="cuIcon-title text-red"></text>
                    {{display.content}}
                </view>
            </view>
            <view class="cu-form-group global-bg-color">
                    <textarea maxlength="-1" v-model="form.content"
                              placeholder="您遇到了什么问题? 或有什么建议? 欢迎您反馈给我们? 谢谢您宝贵的意见!"></textarea>
            </view>
            <view class="cu-bar">
                <view class="action">
                    <text class="cuIcon-title text-red"></text>
                    {{display.contact}}
                </view>
            </view>
            <view class="cu-form-group global-bg-color">
                <input v-model="form.contact" placeholder="手机号/微信/QQ"/>
            </view>
        </form>
        <view class="bottom-bar cu-bar tabbar text-red text-xl text-shadow">
            <button class="cu-btn round bg-red" @tap="submitBtn" :loading="loading">提交反馈</button>
        </view>
    </view>
</template>

<script>
    import request from '../../util/request';
    import regular from '../../util/regular';

    export default {
        name: 'Comment',
        data () {
            return {
                display: {
                    content: '请描述您的问题',
                    contact: '您的联系方式'
                },
                form: {
                    content: '',
                    contact: ''
                },
                loading: false
            };
        },
        methods: {
            submitBtn () {
                if (!this.form.content) {
                    uni.showToast({
                        title: this.display.content,
                        icon: 'none',
                        duration: 2000
                    });
                    return;
                }
                if (!this.form.contact) {
                    uni.showToast({
                        title: this.display.contact,
                        icon: 'none',
                        duration: 2000
                    });
                    return;
                }
                if (!regular.wx.test(this.form.contact) && !regular.qq.test(this.form.contact) && !regular.phone.test(this.form.contact)) {
                    uni.showToast({
                        title: '请留下正确联系方式',
                        icon: 'none',
                        duration: 2000
                    });
                    return;
                }
                this.loading = true;
                let params = {
                    condition: {
                        content: this.form.content,
                        contact: this.form.contact
                    }
                };
                request.post('/comments/publishComment', params).then(data => {
                    if (data.status === 200) {
                        uni.showToast({
                            title: '意见反馈成功',
                            duration: 2000
                        });
                        this.form = {
                            content: '',
                            contact: ''
                        };
                    }
                }).finally(() => {
                    this.loading = false;
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .comment {
        .cu-form-group {
            margin: 1rpx 30rpx;
            background: unset;
            border: 0.08px solid #cccccc;
        }

        .bottom-bar {
            bottom: 0;
            position: fixed;
            width: 100%;
            border-top: 1px solid grey;
            justify-content: center;

            button {
                width: 300rpx;
            }
        }
    }

</style>