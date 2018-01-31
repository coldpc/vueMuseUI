<template>
    <sk-location>
        <template slot="location" scope="props">
            <transition name="fade">
                <div v-if="ifShow" class="sk-loading-co transition" :style="{left: props.left, top: props.top}">
                    <div class="sk-loading-content">
                        <mu-circular-progress v-bind:size="size" :strokeWidth="3" color="#eee"/>
                        <div class="sk-info">{{ info }}</div>
                    </div>
                </div>
            </transition>
        </template>
    </sk-location>
</template>

<script type="text/javascript">
    export default {
        name: 'sk-loading',

        props: {
            ifShow: {
                default: true,
                type: Boolean
            },

            size: {
                type: Number,
                default: 50
            },

            info: {
                type: String
            }
        },

        watch: {},

        methods: {}
    }
</script>

<style lang="scss" scoped>
    .sk-loading-co{
        position: fixed;
        top: 0px;
        left: 0px;
        bottom: 0px;
        right: 0px;
        z-index: 1000;
        background-color: rgba(0,0,0,0.4);
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-active {
        opacity: 0;
    }

    .sk-loading-co{
        .sk-loading-content{
            transform: translate(-50%, -50%);
            position: absolute;
            top: 50%;
            left: 50%;
            text-align: center;
            padding: 10px 30px;
            border-radius: 8px;
            background-color: transparent;
        }

        .mu-circular-progress{
            vertical-align: middle;
            display: inline-block;
        }

        .sk-info{
            color: #eee;
            margin-top: 10px;
            vertical-align: middle;
        }

        .mu-circular-progress{
            transform: scale(0.8,0.8);
        }
    }
</style>
