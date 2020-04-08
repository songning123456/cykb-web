<script>
    export default {
        onLaunch: function () {
            // 用户信息
            uni.getStorage({
                key: 'userInfo',
                success: data => {
                    this.$store.commit('SET_USERINFO', data.data);
                }
            });
            // 排序方式
            uni.getStorage({
                key: 'sortType',
                success: data => {
                    this.$store.commit('SET_SORTTYPE', data.data);
                }
            });
            // 暗黑模式
            uni.getStorage({
                key: 'isDark',
                success: data => {
                    this.$store.commit('SET_ISDARK', data.data);
                }
            });
            // 缓存系统信息
            uni.getSystemInfo({
                success: function (e) {
                    uni.setStorageSync('systemInfo', e);
                }
            });
        },
        onShow: function () {
            console.log('App Show');
        },
        onHide: function () {
            console.log('App Hide');
        }
    };
</script>

<style>
    @import "colorui/main.css";
    @import "colorui/icon.css";
    @import "style/global.css";
    @import "style/base64.css";
</style>

<style lang="scss">
    .pages-navigation-Search {
        .uni-page-head-hd {
            display: none;
        }
    }
</style>
