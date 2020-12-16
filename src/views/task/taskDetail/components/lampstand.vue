<!--
 * @Author: your name
 * @Date: 2020-11-26 15:31:14
 * @LastEditTime: 2020-11-26 15:36:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-config-system\src\views\task\taskDetail\components\lampstand.vue
-->
<template>
    <div :id="id" class="animation">
        <slot></slot>
    </div>
</template>

<script>
import bodymovin from 'bodymovin/build/player/bodymovin'
export default {
    name: "lampstand",
    components: {},
    props: {
        id: {
            type: String,
            default: 'animation'
        },
    },
    data() {
        return {}
    },
    mounted() {
        this.init()
    },
    methods: {
        init () {
            bodymovin.loadAnimation({
                animationData: require('./data.json'),
                loop:true,
                autoplay:true,
                renderer:'canvas',  //渲染方式，有"html"、"canvas"和"svg"三种
                container:document.getElementById(this.id)
            })
        }
    }
}
</script>

<style scoped lang="scss">
.lampstand {
    width: 100%;
    height: 100%;
}
</style>