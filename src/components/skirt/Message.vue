<template>
    <div>
        <mu-dialog dialogClass="test-dialog" v-bind:open="ifShow" v-bind:title="title" v-on:close="remove">
            <span>{{message}}</span>
            <div slot="actions">
                <mu-flat-button background-color="#fff" color="#999" hover-color="#fff" label-class="label-default-btn" v-if="ifConfirm" @click="action" :label="$t('cancel')"/>
                <mu-flat-button background-color="#fff" hover-color="#fff" primary @click="action(1)" :label="$t('ok')"/>
            </div>
        </mu-dialog>
        <template>
            <div v-html="style"></div>
        </template>
    </div>
</template>

<script type="text/javascript">
    import { mapGetters } from 'vuex';

    export default {
        name: 'sk-message',

        data(){
            return {
                dialog: false,
                showCancel: false,
                style: ""

            }
        },

        props: {
            title: {
                default: "提示",
                type: String
            },

            message: {
                default: "",
                type: String
            },

            ifShow: {
                default: true,
                type: Boolean
            },

            size: {
                type: Number,
                default: 50
            },

            ok: {
                type: Function,
                default: null
            },

            cancel: {
                type: Function
            },

            close: {
                type: Function,
                default: null
            },

            ifConfirm: {
                type: Boolean,
                default: false
            }
        },

        created(){
            this.setView();
        },

        methods: {
            action (type) {
                if (type == 1){
                    if (typeof this.ok == "function"){
                        this.ok();
                    }
                }else{
                    if (typeof this.cancel == "function"){
                        this.cancel();
                    }
                }
                this.$store.commit("hideMessage");
            },

            remove(){

            },

            setView(){
                let routeView = this.routeView;
                this.style = '<style> body .mu-overlay, body .mu-dialog-wrapper{' +
                        "left:" + routeView.left + "px;" +
                        "top:" + routeView.top + "px;" +
                        "}</style>";
            }
        },

        watch: {
            routeView(){
                this.setView();
            }
        },

        computed: {
            ...mapGetters({
                "routeView": "routeView"
            })
        }
    }
</script>

<style lang="scss">
    body .mu-overlay, body .mu-dialog-wrapper{
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        -moz-osx-font-smoothing: grayscale;
        -webkit-transition-duration: 0.3s;
        transition-duration: 0.3s;
        -webkit-transition-property: all;
        transition-property: all;
    }
</style>
