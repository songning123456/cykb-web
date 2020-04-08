<template>
    <view class="classify">
        <view class="cu-list grid col-3">
            <view class="cu-item" v-for="(item,index) in result" :key="index" @tap="searchBtn(item.sourceName)">
                <view class="cu-avatar lg radius" :class='"classify-" + convertName(item.sourceName)'></view>
                <view class="classify-margin text-black text-df">{{item.sourceName}}</view>
                <view class="text-gray text-sm">{{convertTotal(item.total)}}</view>
            </view>
        </view>
    </view>
</template>

<script>
    import request from '../../util/request';
    import common from '../../util/common';

    export default {
        name: 'Classify',
        data() {
            return {
                result: [],
                categoryResult: {},
                firstEnter: true
            };
        },
        onLoad() {
            this.queryClassifyCount();
        },
        onTabItemTap() {
            if (!this.firstEnter) {
                this.queryClassifyCount();
            }
        },
        methods: {
            convertTotal(arg0) {
                let result = arg0;
                (result || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
                result = '共' + result + '部';
                return result;
            },
            convertName(sourceName) {
                let result = '';
                if (sourceName === '笔趣阁') {
                    result = 'biquge';
                } else if (sourceName === '147小说') {
                    result = '147xiaoshuo';
                } else if (sourceName === '天天书吧') {
                    result = 'tiantianshuba';
                } else if (sourceName === '飞库小说') {
                    result = 'feikuxiaoshuo';
                } else if (sourceName === '趣书吧') {
                    result = 'qushuba';
                }
                return result;
            },
            queryClassifyCount() {
                request.get('/novels/classifyCount', {}).then(data => {
                    if (data.status === 200 && data.total > 0) {
                        this.result = data.data;
                        this.categoryResult = data.dataExt;
                    }
                }).finally(() => {
                    if (this.firstEnter) {
                        this.firstEnter = false;
                    }
                });
            },
            searchBtn(sourceName) {
                uni.navigateTo({
                    url: '/pages/result/SearchResult?params=' + JSON.stringify({
                        type: 'classify',
                        sourceName: sourceName,
                        categoryInfo: this.categoryResult[sourceName]
                    })
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .classify {
        background: unset;

        .cu-list {
            background: unset;

            .cu-avatar {
                margin: auto;
                width: 78upx;
            }

            .classify-margin {
                margin: 3px 0;
            }
        }
    }

</style>
