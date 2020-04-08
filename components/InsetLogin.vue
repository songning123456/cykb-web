<template>
    <view class="inset-login login-image full-size">
        <button class="cu-btn block bg-red margin-tb-sm lg">手机登录</button>
    </view>
</template>

<script>

    export default {
        name: 'InsetLogin',
        methods: {}
    };
</script>

<style lang="scss" scoped>
    .inset-login {
        width: 100%;
        height: 100%;

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
