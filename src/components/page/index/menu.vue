<template>
    <div class="sub-menu-con" data-1322222a>
        <sk-data-set :data-source="menuConfig" :query-service="false" auto-query
                     @load="onLoadMenuData"></sk-data-set>
        <div class="account-info-con">
            <div class="profile-element" style="text-align: center;">
                <img v-if="globalData && globalData.logo" alt="image" class="img-circle" width="60px" height="60px"
                     :src="globalData.logo">
                <img v-else alt="image" class="img-circle" width="60px" height="60px"
                     src="../../../assets/default.png">
                <div class="info">{{brandName}}</div>
            </div>
        </div>
        
        <div class="sub-menu-list menu-part" data-level="1">
            <mu-list-item :open="false" v-if="menuGroup.show !== false" toggleNested
                          v-for="(menuGroup, index) in menuGroupList" :key="index">
                <div class="group-menu">
                    <div class="group-con">
                        <span class="m-i">
                            <mu-icon :value="menuGroup.icon" :size="20"/>
                        </span>
                        <span class="group-title">{{$t(menuGroup.title)}}</span>
                    </div>
                </div>
                <mu-list-item v-for="menu in menuGroup.menuList" slot="nested" :key="index"
                              @click="goto(menu.link, $t(menu.title))">
                    <div class="child-menu">
                        <span class="second-title">{{$t(menu.title)}}</span>
                    </div>
                </mu-list-item>
            </mu-list-item>
        </div>
    </div>
</template>

<script type="text/javascript">
  import baseData from '@/lib/dataModules/baseData'
  import menu from '@/plugin/lang/menu'
  import { mapGetters, mapActions } from 'vuex'
  
  const menuConfig = [
    {
      'children': [{
        'obj': {
          'createTime': 1481854178000,
          'deleteFlag': 0,
          'description': '订单列表',
          'icon': '',
          'id': 3,
          'menuType': 'MENU',
          'parentId': 2,
          'sort': 1,
          'sysCode': 'vendor',
          'updateTime': 1506667033000,
          'url': 'page/order/orderList'
        }
      }],
      'obj': {
        'createTime': 1481854100000,
        'deleteFlag': 0,
        'description': '订单管理',
        'icon': 'list',
        'id': 2,
        'menuType': 'MENU',
        'parentId': 1,
        'sort': 1,
        'sysCode': 'vendor',
        'updateTime': 1506786273000,
        'url': '#orderManager'
      }
    }, {
      'children': [{
        'obj': {
          'createTime': 1481874320000,
          'deleteFlag': 0,
          'description': '商品上新',
          'icon': '',
          'id': 10,
          'menuType': 'MENU',
          'parentId': 9,
          'sort': 1,
          'sysCode': 'vendor',
          'updateTime': 1500503039000,
          'url': 'page/item/maintain'
        }
      }, {
        'obj': {
          'createTime': 1481874368000,
          'deleteFlag': 0,
          'description': '商品列表',
          'icon': '',
          'id': 11,
          'menuType': 'MENU',
          'parentId': 9,
          'sort': 1,
          'sysCode': 'vendor',
          'updateTime': 1500503056000,
          'url': 'page/item/list'
        }
      }],
      'obj': {
        'createTime': 1481873889000,
        'deleteFlag': 0,
        'description': '商品管理',
        'icon': 'filter_vintage',
        'id': 9,
        'menuType': 'MENU',
        'parentId': 1,
        'sort': 3,
        'sysCode': 'vendor',
        'updateTime': 1506786323000,
        'url': '#itemManager'
      }
    }, {
      'children': [{
        'obj': {
          'createTime': 1481874680000,
          'deleteFlag': 0,
          'description': '活动上新',
          'icon': '',
          'id': 13,
          'menuType': 'MENU',
          'parentId': 12,
          'sort': 1,
          'sysCode': 'vendor',
          'updateTime': 1500503070000,
          'url': 'page/activity/maintain'
        }
      }, {
        'obj': {
          'createTime': 1481875105000,
          'deleteFlag': 0,
          'description': '活动列表',
          'icon': '',
          'id': 14,
          'menuType': 'MENU',
          'parentId': 12,
          'sort': 2,
          'sysCode': 'vendor',
          'updateTime': 1500503079000,
          'url': 'page/activity/list'
        }
      }],
      'obj': {
        'createTime': 1481874586000,
        'deleteFlag': 0,
        'description': '活动管理',
        'icon': 'event_available',
        'id': 12,
        'menuType': 'MENU',
        'parentId': 1,
        'sort': 4,
        'sysCode': 'vendor',
        'updateTime': 1506786332000,
        'url': '#eventManager'
      }
    }, {
      'children': [{
        'obj': {
          'createTime': 1481875326000,
          'deleteFlag': 0,
          'description': '门店列表',
          'icon': '',
          'id': 16,
          'menuType': 'MENU',
          'parentId': 15,
          'sort': 1,
          'sysCode': 'vendor',
          'updateTime': 1500503122000,
          'url': 'page/store/list'
        }
      }, {
        'obj': {
          'createTime': 1493804587000,
          'deleteFlag': 0,
          'description': '创建门店',
          'icon': '',
          'id': 19,
          'menuType': 'MENU',
          'parentId': 15,
          'sort': 2,
          'sysCode': 'vendor',
          'updateTime': 1500503134000,
          'url': 'page/store/editStore'
        }
      }],
      'obj': {
        'createTime': 1481875152000,
        'deleteFlag': 0,
        'description': '门店管理',
        'icon': 'store_mall_directory',
        'id': 15,
        'menuType': 'MENU',
        'parentId': 1,
        'sort': 5,
        'sysCode': 'vendor',
        'updateTime': 1506786340000,
        'url': '#storeManager'
      }
    }, {
      'children': [{
        'obj': {
          'createTime': 1493804760000,
          'deleteFlag': 0,
          'description': '基本信息',
          'icon': '',
          'id': 21,
          'menuType': 'MENU',
          'parentId': 20,
          'sort': 1,
          'sysCode': 'vendor',
          'updateTime': 1500503173000,
          'url': 'page/brandGlobal/detail'
        }
      }],
      'obj': {
        'createTime': 1493804734000,
        'deleteFlag': 0,
        'description': '品牌管理',
        'icon': 'settings',
        'id': 20,
        'menuType': 'MENU',
        'parentId': 1,
        'sort': 6,
        'sysCode': 'vendor',
        'updateTime': 1506786347000,
        'url': '#brandManager'
      }
    }]
  
  export default {
    data () {
      return {
        menuGroupList: [],
        menuConfig: menuConfig,
        baseData
      }
    },
    
    watch: {
      hasLogin () {
        this.initMenu()
      }
    },
    
    computed: {
      ...mapGetters({
        'locale': 'locale',
        'globalData': 'brand/info'
      }),
      brandName () {
        if (!this.globalData) {
          return ''
        }
        return this.locale == this.$store.state.lang.english ? this.globalData.brandName : this.globalData.brandCname
      }
    },
    
    props: {
      hasLogin: {type: Boolean}
    },
    
    methods: {
      ...mapActions({
        push: 'router/push'
      }),
      
      getMenuConfig () {
      
      },
      
      onLoadMenuData (records) {
        if (records.length == 0) {
          this.$store.commit('logOut')
          this.$store.commit('hideMessage')
          this.$router.replace({name: 'page.account.login'})
          this.$store.commit('hideMessage')
          return
        }
        
        let result = [], data, group, groupList, menu, menuList, a, b, url
        for (let i = 0, l = records.length; i < l; i++) {
          data = records[i].getData()
          group = {
            title: data.obj.url,
            icon: data.obj.icon
          }
          
          //获取菜单列表
          menuList = data.children
          groupList = group.menuList = []
          for (a = 0, b = menuList.length; a < b; a++) {
            menu = menuList[a].obj
            url = menu.url.replace(/\//g, '.')
            groupList.push({
              title: url,
              link: url
            })
          }
          result.push(group)
        }
        
        // 拼接首页链接
        this.addHomeMenu(result)
        this.setMenu(result)
      },
      
      addHomeMenu: function (menuGroupList) {
        var menuGroup = {
          title: 'home',
          link: 'home',
          icon: 'home',
          menuList: [{
            title: 'alterPassword',
            link: 'page.account.alterPassword'
          }]
        }
        menuGroupList.unshift(menuGroup)
      },
      
      getCode (description) {
        for (var key in menu) {
          if (menu[key]['zh_CN'] == description) {
            return key
          }
        }
      },
      
      menuMap () {
      
      },
      
      setMenu (data) {
        this.menuGroupList = data
      },
      
      goto (link, title) {
        if (this.$route.name != link) {
          this.$store.commit('loading', {
            type: 'sys'
          })
        }
        
        setTimeout(function () {
          
          // 加载tab页面时候调用的
          // this.push({name: link, title: title})
          this.$router.push({
            name: link
          });
          
          link = null
        }.bind(this), 10)
      }
    }
    
  }
</script>

<style>
    .sub-menu-con[data-1322222a] .mu-item {
        padding: 10px;
    }
    
    .sub-menu-con[data-1322222a] .mu-list {
        padding: 0px;
    }
</style>
<style scoped>
    .account-info-con {
        padding: 30px 10px;
    }
    
    .child-menu {
        padding-left: 10px;
    }
    
    .group-title {
        color: #eee;
        margin-left: 4px;
        font-size: 12px;
    }
    
    .m-i {
        vertical-align: middle;
        display: inline-block;
        color: #eee;;
    }
    
    .second-title {
        font-size: 12px;
        color: #ccc;
        margin-left: 20px;
        vertical-align: middle;
    }
    
    .img-circle {
        border-radius: 100%;
        margin-top: 16px;
    }
    
    .sub-menu-con {
        width: 220px;
    }
    
    .group-con {
        margin-top: -4px;
    }
    
    .info {
        color: rgb(238, 238, 238);
        margin-top: 10px;
        font-size: 16px;
    }
</style>
