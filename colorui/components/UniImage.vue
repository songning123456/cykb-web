<template>
    <image @load="imageLoad" @error="imageErr" :src="imageSrc" :mode="mode" :lazy-load="true"></image>
</template>

<script>
    export default {
        name: 'UniImage',
        props: {
            mode: {
                type: String,
                default: 'scaleToFill'
            },
            defaultImage: {
                type: String,
                default: '../static/image/avatar.jpg'
            },
            url: {
                type: String,
                default: ''
            }
        },
        data () {
            return {
                imageSrc: ''
            }
        },
        watch: {
            url: {
                handler(newVal, oldVal) {
                    this.imageSrc = newVal
                },
                immediate: true
            }
        },
        methods: {
            imageLoad () {},
            imageErr () {
                this.url && (this.imageSrc = this.defaultImage)
                this.$forceUpdate()
            }
        }
    }
</script>

<style scoped>
    image {
        width: 100%;
        height: 100%;
        background-color: white;
    }

</style>