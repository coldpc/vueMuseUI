<template>
    <div>
        <!--<div class="top-bar" :title="title">-->
            <!--<div class="left">-->
                <!--<img src="../../assets/topbar.png" />-->
            <!--</div>-->

            <!--<div class="right">-->
                <!--<mu-flat-button  @click="changeLang" :label="$t('language')" backgroundColor="transparent" color="#fff"/>-->
            <!--</div>-->
        <!--</div>-->

        <div class="main-container">
            <div class="logo-con">
                <img class="logo" img src="../../assets/logo_zh.png" alt="" v-show="logoShow">
                <img class="logo" img src="../../assets/logo_en.png" alt="" v-show="!logoShow">
                <p>{{ $t("indexTitle") }}</p>
            </div>
            <form class="user-form" @keydown.enter="login">
                <mu-text-field @focus="clearError" :errorText="error.loginName" v-model="d.loginName" name="loginName" :label="$t('name')" fullWidth/><br/>
                <mu-text-field @focus="clearError" :errorText="error.password" v-model="d.password" name="password" :label="$t('password')"  type="password" fullWidth/><br/>
                <p class="submit-error-info">{{resultInfo}}</p>
                <mu-raised-button primary :label="$t('login')" @click="login" fullWidth/>
            </form>
        </div>
    </div>
</template>

<script>
import account from "@/lib/dataModules/account"

export default {
    data() {
        return {
            d: {
                loginName: "",
                password: ""
            },

            resultInfo: "",

            title: "",
            logoShow: "",

            error: {
                loginName: "",
                password: ""
            }
        }
    },

    beforeCreate(){
       this.$store.commit("logOut");
    },

    methods: {
      changeLang(){
        this.$store.commit("locale");
      },

      clearError(e){
          if (this.resultInfo){
             this.resultInfo = "";
          }

        this.$set(this.error, e.target.name, "");
      },

      login(){
        var _this = this,
            hasError = false;

        if (!_this.d.loginName){
            _this.$set(this.error, "loginName", this.$t('userNameNull'));
            hasError = true;
        }

        //检验password
        if (!_this.d.password){
            _this.$set(this.error, "password", this.$t('passwordNull'));
            hasError = true;
        }

        if (hasError){
            return;
        }
  
        _this.$store.commit("login");
        this.$router.replace({
          name: "home"
        });
//        return;
//
//        account.login.execute({
//            mask: {},
//            data: {
//                loginName: this.d.loginName,
//                password: this.d.password
//            },
//            success: function (data) {
//                _this.$router.replace({
//                    name: "page.account.selectBrand"
//                });
//            },
//            failed: msg => {
//                _this.resultInfo = msg;
//            }
//        });
      }
    }
}
</script>

<style lang="scss" scoped>
    .top-bar{
       background-color: #333;
       padding: 20px;
       height: 80px;
       width: 100%;
       position: relative;
    }
    .top-bar img{
        vertical-align: middle;
        height: 40px;
    }
    .top-bar .img-prompt{
        vertical-align: -6px;
        padding-left: 10px;
        border-left: 1px solid #fff;
        margin-left: 10px;
        color: #ddd;
        white-space: nowrap;
    }
    .right{
        position: absolute;
        right: 20px;
        top: 20px;
    }
    .top-bar .mu-item-title{
        color: #fff;
    }

    .user-form{
        text-align: center;
        padding: 30px;
        width: 400px;
        margin: auto;
        max-width: 90%;
        background-color: rgba(255, 255, 255, 0.9);
    }

    .user-form .mu-text-field{
        width: 100%;
    }

    .user-form{
        .mu-raised-button{
            margin-top: 20px;
        }
    }

    .main-container{
        .logo-con{
            text-align: center;
            padding-top: 60px;
            color: #fff;
            margin-bottom: 30px;
        }
        .logo{
            height: 100px;
        }

        .mu-raised-button-wrapper{
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
            -moz-osx-font-smoothing: grayscale;
            -webkit-transition-duration: 0.3s;
            transition-duration: 0.3s;
            -webkit-transition-property: all;
            transition-property: all;
        }
        .mu-raised-button.hover .mu-raised-button-wrapper{
            background-color: #fafafa;
        }

        .submit-error-info{
            text-align: right;
            color: #e00;
        }
    }
</style>

<style lang="scss">
    body, html{
        width: 100%;
        height: 100%;
        background-image: url("../../assets/bg.jpg");
        background-repeat: no-repeat;
        margin: 0;
        padding: 0;
        list-style: none;
        font-size: 14px;
        background-attachment: fixed !important;
        background-position: center center;
        background-size: cover;
    }
</style>
