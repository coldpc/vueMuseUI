<template>
    <div class="main-container">
        <sk-data-set v-model="queryDs" :auto-create="!hasStoreId" :auto-query="hasStoreId" :query-service="store.getStoreByStoreId"
                     :parse-data="queryLoad" :parse-query-para="storeInfoParams"></sk-data-set>
        <sk-data-set v-model="vendorCountriesDs" :query-service="store.getAllContryList" auto-query></sk-data-set>
        <sk-data-set v-model="cityDs" :bind="queryDs" bind-field="countryId"
                     :query-service="baseData.getCityListByCountryId"></sk-data-set>
        <sk-data-set v-model="currencyDs" :query-service="baseData.getCurrencyList" auto-query></sk-data-set>
        <sk-data-set v-model="storeServiceDs" @load="loadStoreService" :query-service="store.storeService"
                     :auto-query="true"></sk-data-set>
        <sk-data-set v-model="weekDayTimeDs"></sk-data-set>


        <sk-fold :title="$t('addStore')">

            <sk-form :bind="queryDs">
                <sk-row gutter>
                    <sk-col :size="3">
                        <sk-select
                                :readonly="!!hasStoreId"
                                value=""
                                hint-text=""
                                :label="$t('countryArea')"
                                :bind="queryDs"
                                name="countryId"
                                :option-bind="vendorCountriesDs"
                                display-field="countryName"
                                value-field="countryId"
                                required
                        ></sk-select>
                    </sk-col>

                    <sk-col :size="3">
                        <sk-select
                                :readonly="!!hasStoreId"
                                value=""
                                hint-text=""
                                :label="$t('city')"
                                :bind="queryDs"
                                name="cityId"
                                :option-bind="cityDs"
                                display-field="cityName"
                                value-field="cityId"
                                required
                        ></sk-select>
                    </sk-col>

                    <sk-col :size="3">
                        <sk-select
                                :readonly="!!hasStoreId"
                                value=""
                                hint-text=""
                                :label="$t('currency')"
                                :bind="queryDs"
                                name="unit"
                                :option-bind="currencyDs"
                                display-field="exchangeUnit"
                                value-field="exchangeUnit"
                                :nullTitle="$t('pleaseSelect')"
                                required
                        ></sk-select>
                    </sk-col>
                </sk-row>

                <sk-row>
                    <sk-col :size="3">
                        <sk-text-input value="" :hint-text="$t('storeName')" :label="$t('storeName')" :bind="queryDs"
                                       name="storeName" required></sk-text-input>
                    </sk-col>

                    <sk-col :size="3">
                        <sk-text-input value="" :hint-text="$t('address')" :label="$t('address')" :bind="queryDs"
                                       name="address" required></sk-text-input>
                    </sk-col>

                    <sk-col :size="3">
                        <sk-text-input value="" :hint-text="$t('contact')" :label="$t('contact')" :bind="queryDs"
                                       name="contact"></sk-text-input>
                    </sk-col>
                </sk-row>

                <sk-row>
                    <sk-col :size="3">
                        <sk-text-input value="" :hint-text="$t('email')" :label="$t('email')" :bind="queryDs"
                                       name="email" required></sk-text-input>
                    </sk-col>

                    <sk-col :size="3">
                        <sk-text-input value="" :hint-text="$t('email2')" :label="$t('email2')" :bind="queryDs"
                                       name="emailTwo"></sk-text-input>
                    </sk-col>

                    <sk-col :size="3">
                        <sk-text-input value="" :hint-text="$t('email3')" :label="$t('email3')" :bind="queryDs"
                                       name="emailThree"></sk-text-input>
                    </sk-col>
                </sk-row>

                <sk-row>
                    <sk-col :size="3">
                        <sk-text-input value="" :hint-text="$t('telPhone')" :label="$t('telPhone')" :bind="queryDs"
                                       name="tel"></sk-text-input>
                    </sk-col>

                    <sk-col :size="3">
                        <sk-tag :label="$t('tag')" help-text="" name="tag"></sk-tag>
                    </sk-col>

                    <sk-col :size="3">
                        <sk-text-input value=""  :label="$t('remark')" :bind="queryDs" name="remark"></sk-text-input>
                    </sk-col>
                </sk-row>

                <sk-row>
                    <sk-col :size="3">
                        <sk-row>
                          <h3 class="sub-title">{{$t('busTime')}}</h3>
                          <sk-button id="choice-time-all" :label="$t('applyDaily')" primary @click="clickTimeAll" ></sk-button>
                        </sk-row>

                        <sk-col :size="12">
                          <div class="col-sm-5">

                            <sk-time-picker name="openingTimeFrom" :bind="queryDs" required></sk-time-picker>
                          </div>
                          <div class="col-sm-2">
                            ～
                          </div>
                          <div class="col-sm-5">
                            <sk-time-picker name="openingTimeTo" bindMinTime="openingTime" :bind="queryDs" required></sk-time-picker>
                          </div>
                        </sk-col>

                    </sk-col>


                </sk-row>

                <sk-row>
                    <sk-col :size="3">
                        <h5 class="sub-title">{{$t('selBusDays')}}</h5>
                        <sk-checkbox v-model="json.isMon" name="isMon" label="Mon."  class="left"></sk-checkbox>
                        <sk-col :size="12">
                          <sk-col class="col-sm-12 control-label"><span>{{$t('busTime')}}</span></sk-col>
                          <div class="col-sm-5">
                            <sk-time-picker name="MonFromTime" :bind="weekDayTimeDs"></sk-time-picker>
                          </div>
                          <div class="col-sm-2">
                            ～
                          </div>
                          <div class="col-sm-5">
                            <sk-time-picker name="MonToTime" bindMinTime="openingTime" :bind="weekDayTimeDs"></sk-time-picker>
                          </div>
                        </sk-col>
                  </sk-col>


                  <sk-col :size="3">
                    <h5 class="sub-title">{{$t('selBusDays')}}</h5>
                    <sk-checkbox v-model="json.isTue" name="isTue" label="Tue."  class="left"></sk-checkbox>
                    <sk-col :size="12">
                      <sk-col class="col-sm-12 control-label"><span>{{$t('busTime')}}</span></sk-col>
                      <div class="col-sm-5">
                        <sk-time-picker name="TueFromTime" :bind="weekDayTimeDs"></sk-time-picker>
                      </div>
                      <div class="col-sm-2">
                        ～
                      </div>
                      <div class="col-sm-5">
                        <sk-time-picker name="TueToTime" bindMinTime="openingTime" :bind="weekDayTimeDs"></sk-time-picker>
                      </div>
                    </sk-col>
                  </sk-col>

                  <sk-col :size="3">
                    <h5 class="sub-title">{{$t('selBusDays')}}</h5>
                    <sk-checkbox v-model="json.isWed" name="isWed" label="Wed."  class="left"></sk-checkbox>
                    <sk-col :size="12">
                      <sk-col class="col-sm-12 control-label"><span>{{$t('busTime')}}</span></sk-col>
                      <div class="col-sm-5">
                        <sk-time-picker name="WedFromTime" :bind="weekDayTimeDs"></sk-time-picker>
                      </div>
                      <div class="col-sm-2">
                        ～
                      </div>
                      <div class="col-sm-5">
                        <sk-time-picker name="WedToTime" bindMinTime="openingTime" :bind="weekDayTimeDs"></sk-time-picker>
                      </div>
                    </sk-col>
                  </sk-col>

                </sk-row>
                <sk-row>
                  <sk-col :size="3">
                    <h5 class="sub-title">{{$t('selBusDays')}}</h5>
                    <sk-checkbox v-model="json.isThu" name="isThu" label="Thu."  class="left"></sk-checkbox>
                    <sk-col :size="12">
                      <sk-col class="col-sm-12 control-label"><span>{{$t('busTime')}}</span></sk-col>
                      <div class="col-sm-5">
                        <sk-time-picker name="ThuFromTime" :bind="weekDayTimeDs"></sk-time-picker>
                      </div>
                      <div class="col-sm-2">
                        ～
                      </div>
                      <div class="col-sm-5">
                        <sk-time-picker name="ThuToTime" bindMinTime="openingTime" :bind="weekDayTimeDs"></sk-time-picker>
                      </div>
                    </sk-col>
                  </sk-col>

                  <sk-col :size="3">
                    <h5 class="sub-title">{{$t('selBusDays')}}</h5>
                    <sk-checkbox v-model="json.isFri" name="isFri" label="Fri."  class="left"></sk-checkbox>
                    <sk-col :size="12">
                      <sk-col class="col-sm-12 control-label"><span>{{$t('busTime')}}</span></sk-col>
                      <div class="col-sm-5">
                        <sk-time-picker name="FriFromTime" :bind="weekDayTimeDs"></sk-time-picker>
                      </div>
                      <div class="col-sm-2">
                        ～
                      </div>
                      <div class="col-sm-5">
                        <sk-time-picker name="FriToTime" bindMinTime="openingTime" :bind="weekDayTimeDs"></sk-time-picker>
                      </div>
                    </sk-col>
                  </sk-col>

                  <sk-col :size="3">
                    <h5 class="sub-title">{{$t('selBusDays')}}</h5>
                    <sk-checkbox v-model="json.isSat" name="isSat" label="Sat."  class="left"></sk-checkbox>
                    <sk-col :size="12">
                      <sk-col class="col-sm-12 control-label"><span>{{$t('busTime')}}</span></sk-col>
                      <div class="col-sm-5">
                        <sk-time-picker name="SatFromTime" :bind="weekDayTimeDs"></sk-time-picker>
                      </div>
                      <div class="col-sm-2">
                        ～
                      </div>
                      <div class="col-sm-5">
                        <sk-time-picker name="SatToTime" bindMinTime="openingTime" :bind="weekDayTimeDs"></sk-time-picker>
                      </div>
                    </sk-col>
                  </sk-col>
                </sk-row>
              <sk-row>
                  <sk-col :size="1">
                    <h5 class="sub-title">{{$t('selBusDays')}}</h5>
                    <sk-checkbox v-model="json.isSun" name="isSun" label="Sun."  class="left"></sk-checkbox>
                    <sk-col :size="3">
                      <sk-col class="col-sm-12 control-label"><span>{{$t('busTime')}}</span></sk-col>
                      <div class="col-sm-5">
                        <sk-time-picker name="SunFromTime" :bind="weekDayTimeDs"></sk-time-picker>
                      </div>
                      <div class="col-sm-2">
                        ～
                      </div>
                      <div class="col-sm-5">
                        <sk-time-picker name="SunToTime" bindMinTime="openingTime" :bind="weekDayTimeDs"></sk-time-picker>
                      </div>

                    </sk-col>
                  </sk-col>
                </sk-row>

                <sk-row>
                    <sk-col :size="1">
                        <sk-attach
                                :label="$t('coverPicture')"
                                name="headAssignId"
                                @upload-failed="uploadFailed"
                                @assign-id-updated="uploadSuccess"
                                ref="head" attachType="IMG" source="USER" :max-files="1" :row-num="5"
                                :file-size-limit="2"
                                required
                        ></sk-attach>
                    </sk-col>
                </sk-row>

                <sk-row>
                    <sk-col :size="1">
                        <sk-attach
                                :label="$t('detailedPictures')"
                                name="bodyAssignId"
                                @upload-failed="uploadFailed"
                                @assign-id-updated="uploadSuccess"
                                ref="body" attachType="IMG" source="USER" :max-files="1" :row-num="5"
                                :file-size-limit="2"
                                required
                        ></sk-attach>
                    </sk-col>
                </sk-row>

                <sk-row>
                    <sk-col :size="1">
                        <sk-row>
                            <sk-attach
                                    @upload-failed="uploadFailed"
                                    @assign-id-updated="uploadSuccess"
                                    @no-file-change="uploadSuccess"
                                    attach-type="VIDEO"
                                    source="USER"
                                    ref="videoPicAttach"
                                    :height="200"
                                    :width="350"
                                    :max-files="1"
                                    :row-num="2"
                                    :label="$t('video')"
                                    :remark="$t('itemVideoRemark', {size: '50'})"
                                    name="bodyVideoAssignId"
                                    accept="video/mp4"
                                    :file-size-limit="50"></sk-attach>
                        </sk-row>
                    </sk-col>
                </sk-row>

                <sk-row>
                    <sk-col :size="1">
                        <h5 class="sub-title">{{$t('deliverySet')}}</h5>
                        <sk-checkbox :label="$t('hotelDelivery')" checkValue="Home" unCheckValue="Express"
                                     v-model="deliveryFlag" nativeValue="Home"></sk-checkbox>
                    </sk-col>
                </sk-row>

                <div v-show="deliveryFlag">
                    <sk-row>
                        <sk-col :size="1">
                            <p>{{$t('tickDelivery')}}</p>
                            <sk-checkbox v-model="json2.isMon" name="isMon2" label="Mon." class="left"></sk-checkbox>
                            <sk-checkbox v-model="json2.isTue" name="isTue2" label="Tue." class="left"></sk-checkbox>
                            <sk-checkbox v-model="json2.isWed" name="isWed2" label="Wed." class="left"></sk-checkbox>
                            <sk-checkbox v-model="json2.isThu" name="isThu2" label="Thu." class="left"></sk-checkbox>
                            <sk-checkbox v-model="json2.isFri" name="isFri2" label="Fri." class="left"></sk-checkbox>
                            <sk-checkbox v-model="json2.isSat" name="isSat2" label="Sat." class="left"></sk-checkbox>
                            <sk-checkbox v-model="json2.isSun" name="isSun2" label="Sun." class="left"></sk-checkbox>
                        </sk-col>
                    </sk-row>

                    <sk-row>
                        <sk-col :size="4">
                            <sk-col class="col-sm-12 control-label"><span>{{$t('deliveryTime')}}</span></sk-col>
                            <div class="col-sm-5">
                                <sk-time-picker name="openingTimeDelivery" :bind="queryDs"
                                                :required="deliveryFlag"></sk-time-picker>
                            </div>
                            <div class="col-sm-2">
                                ～
                            </div>
                            <div class="col-sm-5">
                                <sk-time-picker name="endTimeDelivery" bind-min-time="openingTimeDelivery"
                                                :bind="queryDs" :required="deliveryFlag"></sk-time-picker>
                            </div>
                        </sk-col>

                        <sk-col :size="4">
                            <sk-text-input value="" :hint-text="$t('deliveryFees')" :label="$t('deliveryFees')"
                                           type="number" :bind="queryDs" name="freight"
                                           :required="deliveryFlag"></sk-text-input>
                        </sk-col>
                        <sk-col :size="2">
                            <sk-text-input value="" :hint-text="$t('inputInformation')" :label="$t('notes')"
                                           :bind="queryDs" name="deliverRemark"></sk-text-input>
                        </sk-col>
                    </sk-row>
                </div>

            </sk-form>
        </sk-fold>

        <!-- 门店服务 -->
        <sk-fold :title="this.$t('storeServiceConfig')" style="margin-bottom: 25px;">
            <sk-row>
                <sk-col :size="4" v-for="storeService in storeService" :key="index">
                    <div class="service-wrapper">
                        <sk-checkbox v-model="storeService.isChecked" class="left"
                                     :name="storeService.storeServeConfigId" :label="storeService.cnName"></sk-checkbox>
                    </div>
                </sk-col>
            </sk-row>
            <sk-row style="margin-top: 10px">
                <sk-col>
                    <p v-html="this.$t('needMoreStoreService')"></p>
                </sk-col>
            </sk-row>
        </sk-fold>

        <!--  门店管理总商品数 -->
        <sk-fold :title="$t('productInformation')" style="margin-bottom: 25px;" v-show="showSelect">
            <sk-row>
                <sk-col :size="3" style=""></sk-col>
            </sk-row>
            <sk-row>
                <sk-col>{{$t('productsQuantity')}}：{{itemNum}}</sk-col>
            </sk-row>
        </sk-fold>

        <sk-fixed-bottom>
            <sk-button :label="$t('submit')" primary @click="saveAdImg"></sk-button>
            <sk-button :label="$t('relatedProducts')" primary @click="goSelect" v-show="showSelect"></sk-button>
            <sk-button :label="$t('cancel')" @click="closeTab"></sk-button>
        </sk-fixed-bottom>

    </div>
</template>

<script>
    import baseData from "@/lib/dataModules/baseData"
    import store from "@/lib/dataModules/store"
    import { mapActions } from "vuex";

    export default {
        data() {
            window.test = this;
            return {
                json: {//开店星期
                    isMon:false,
                    isTue:false,
                    isWed:false,
                    isThu:false,
                    isFri:false,
                    isSat:false,
                    isSun:false,
                },
                json2: {//送货星期
                    isMon: false,
                    isTue: false,
                    isWed: false,
                    isThu: false,
                    isFri: false,
                    isSat: false,
                    isSun: false
                },
                storeService: [],
                baseData: baseData,
                store: store,
                queryDs: null,
                weekDayTimeDs: null,
                vendorCountriesDs: null,
                cityDs: null,
                currencyDs: null,
                storeServiceDs: null,
                readonly: false,
                uploadHeadPicFlag: false,
                uploadBodyPicFlag: false,
                data: {
                    assignId: "",
                    addSrc: "",
                    headImgId: "",
                    tags: [],
                    articleTitle: "",
                    ad: ""
                },
                showSelect: false,
                uploadSuccessNum: 0,
                deliveryFlag: false,
                itemNum:0
            }
        },

        props: {
            hasStoreId: {
                type: Boolean,
                default: false
            }
        },
        created() {
            //获取关联商品数
            store.getItems.execute({
                data: {"storeId": this.$route.query.id},
                success: function (data) {
                    this.itemNum = data.totalCount
                }.bind(this),
                failed: function (msg) {
                    this.$store.commit("message", msg);
                }.bind(this)
            })


        },
        mounted() {
            if (!this.$route.query.id) {
                this.queryDs.add({"openFlag": "NOT_OPEND"});
                this.json = {
                    isMon: true,
                    isTue: true,
                    isWed: true,
                    isThu: true,
                    isFri: true
                }
            }
        },
        methods: {
            ...mapActions({
                closeTab: 'router/remove',
            }),
            goSelect() {
                this.$router.push({name: "page.store.selectProduct", query: {id: this.$route.query.id}});
            },
            storeInfoParams() {
                return {storeId: this.$route.query.id}
            },

            //数据加载完成
            queryLoad(data) {
                if (data.auditStatus == "APPROVE") {
                    this.showSelect = true
                }
                //显示开店日期
                let week = data.storeBusinessTimeList,
                    weekDayStrs = {};
                for (let i in week){
                    let json = this.json;
                    switch (week[i].weekDay){
                        case 1: {json.isSun= true;weekDayStrs.SunFromTime=this.ctrlUTCTime(new Date(week[i].fromTime));weekDayStrs.SunToTime=this.ctrlUTCTime(new Date(week[i].toTime)); break;}
                        case 2: {json.isMon= true;weekDayStrs.MonFromTime=this.ctrlUTCTime(new Date(week[i].fromTime));weekDayStrs.MonToTime=this.ctrlUTCTime(new Date(week[i].toTime)); break;}
                        case 3: {json.isTue= true;weekDayStrs.TueFromTime=this.ctrlUTCTime(new Date(week[i].fromTime));weekDayStrs.TueToTime=this.ctrlUTCTime(new Date(week[i].toTime)); break;}
                        case 4: {json.isWed= true;weekDayStrs.WedFromTime=this.ctrlUTCTime(new Date(week[i].fromTime));weekDayStrs.WedToTime=this.ctrlUTCTime(new Date(week[i].toTime)); break;}
                        case 5: {json.isThu= true;weekDayStrs.ThuFromTime=this.ctrlUTCTime(new Date(week[i].fromTime));weekDayStrs.ThuToTime=this.ctrlUTCTime(new Date(week[i].toTime)); break;}
                        case 6: {json.isFri= true;weekDayStrs.FriFromTime=this.ctrlUTCTime(new Date(week[i].fromTime));weekDayStrs.FriToTime=this.ctrlUTCTime(new Date(week[i].toTime)); break;}
                        case 7: {json.isSat= true;weekDayStrs.SatFromTime=this.ctrlUTCTime(new Date(week[i].fromTime));weekDayStrs.SatToTime=this.ctrlUTCTime(new Date(week[i].toTime)); break;}
                    }

                }
              this.weekDayTimeDs.setData(weekDayStrs);


              //送货星期
                let week2 = data.storeDeliveryTimeList;
                for (let i in week2) {
                    let json2 = this.json2;
                    switch (week2[i].weekDay) {
                        case 1: {
                            json2.isSun = true;
                            break;
                        }
                        case 2: {
                            json2.isMon = true;
                            break;
                        }
                        case 3: {
                            json2.isTue = true;
                            break;
                        }
                        case 4: {
                            json2.isWed = true;
                            break;
                        }
                        case 5: {
                            json2.isThu = true;
                            break;
                        }
                        case 6: {
                            json2.isFri = true;
                            break;
                        }
                        case 7: {
                            json2.isSat = true;
                            break;
                        }
                    }
                }
                // 门店服务
                let storeServiceList = data.storeServeConfigDtos,
                    storeService = this.storeService;

                if (!!storeServiceList) {
                  storeServiceList.forEach((item1) => {
                      storeService.forEach((item2) => {
                          if (item1.storeServeConfigId === item2.storeServeConfigId) {
                              item2.isChecked = true;
                          }
                      })
                  });
                }

              //处理标签
                if (data.tag && data.tag.length > 0) {
                    data.tag = data.tag.split(",")
                } else {
                    data.tag = []
                }

                //显示送货信息
                if (data.deliveryFlag == "SUPPORT_HOME") {
                    this.deliveryFlag = true;
                }

                //显示送货时间
                if (data.storeDeliveryTimeList) {
                    let dateFrom = new Date(data.storeDeliveryTimeList[0].fromTime),
                        dateTo = new Date(data.storeDeliveryTimeList[0].toTime);

                    data.openingTimeDelivery = this.ctrlUTCTime(dateFrom);
                    data.endTimeDelivery = this.ctrlUTCTime(dateTo);
                }

                return data;
            },

            // 门店服务
            loadStoreService(data) {
                const items = data[0].data.items;
                if (!this.$route.query.id) {
                    items.forEach((item) => {
                        item.isChecked = false;
                    })
                }
                this.storeService = items;
            },

            ctrlUTCTime(date) {
                let h, m;
                h = (date.getUTCHours() + 8) % 24;
                h = h > 9 ? h : "0" + h;
                m = date.getUTCMinutes();
                m = m > 9 ? m : "0" + m;
                return (h + ":" + m);
            },


            uploadSuccess() {
                this.uploadSuccessNum++;
                if (this.uploadSuccessNum == 3) {
                    this.saveAdImg();
                }
            },
            uploadAll() {
                this.uploadSuccessNum = 0;

                //头图上传
                let temp = this.$refs.head;
                temp.save();

                //详情上传
                temp = this.$refs.body;
                temp.save();

                //视频上传
                temp = this.$refs.videoPicAttach;
                temp.save();
            },
            uploadFailed() {
                //头图上传
                this.uploadSuccessNum = 0;
                this.$store.commit("hideLoading");
            },
            clickTimeAll () {
                const data =  this.queryDs.getCurrentData(),
                    weekDayStrFrom = ['SunFromTime','MonFromTime','TueFromTime','WedFromTime','ThuFromTime','FriFromTime','SatFromTime'],
                    weekDatStrTo = ['SunToTime','MonToTime', 'TueToTime','WedToTime','ThuToTime','FriToTime','SatToTime'];

                weekDayStrFrom.forEach((str) => {
                  data[str] = data.openingTimeFrom
                });

                weekDatStrTo.forEach((str) => {
                  data[str] = data.openingTimeTo
                });

                this.json = {
                  isSun: true,
                  isMon: true,
                  isTue: true,
                  isWed: true,
                  isThu: true,
                  isFri: true,
                  isSat: true
                };
                this.weekDayTimeDs.add(data);
            },
            //提交表单
            submit() {
                let data = this.queryDs.getCurrentData(),
                  weekDayTimes = this.weekDayTimeDs.currentData,
                  //  收集时间数据放进CurrentData里
                  obj =  Object.assign(data,weekDayTimes);
                //拷贝做验证
                data = this.$base.deepCopy(obj);

                // 删除多余字段
                const deleteData = ['city', 'country', 'headAttachList', 'bodyAttachList', 'json', 'storeBusinessTimeList',
                    'storeDeliveryTimeList', 'exchangeUnit', 'storeServeConfigDtos'];
                deleteData.forEach((i) => {
                    delete data[i]
                });

                if (!this.verify(data)) return;

                // 服务
                let storeServeConfigIds = [];
                this.storeService.forEach((item) => {
                    if (item.isChecked) {
                        storeServeConfigIds.push(item.storeServeConfigId);
                    }
                });
                storeServeConfigIds = storeServeConfigIds.join(',');
                data.storeServeConfigIds = storeServeConfigIds;

                store.saveOrUpdateStore.execute({
                    data: data,
                    success: function () {
                        this.$store.commit("hideLoading");
                        this.$store.commit("message", this.$t('succeedSave'));
                        this.$store.dispatch("router/remove");
                    }.bind(this),
                    failed: function (msg) {
                        this.$store.commit("hideLoading");
                        this.$store.commit("message", msg);
                    }.bind(this)
                })
            },

            //具体验证表单
            verify(data) {
                //开店星期
                let weekArr = this.postWeek(data);
                if(weekArr.length==0){
                    this.$store.commit("message", this.$t('pleaseSelBusDays'));
                    this.$store.commit("hideLoading");
                    return false;
                }
                data.businessWeekDayJson = JSON.stringify(weekArr);

                if (!data.openFlag) {
                    this.$store.commit("message", this.$t('selOperateStatus'));
                    this.$store.commit("hideLoading");
                    return false;
                }

                //酒店送货
                if (this.deliveryFlag) {
                    data.deliveryFlag = "SUPPORT_HOME";
                    let weekArr2 = this.postWeek2();
                    if (weekArr2.length == 0) {
                        this.$store.commit("message", this.$t('selSendDays'));
                        this.$store.commit("hideLoading");
                        return false;
                    }
                    data.deliverWeekDayJson = JSON.stringify(weekArr2);
                } else {
                    data.deliveryFlag = "OPPOSE_HOME";
                }

                //验证全通过才执行
                if (data.tag && data.tag.length > 0) {
                    data.tag = data.tag.join(",")
                } else {
                    data.tag = ""
                }
                return true;
            },
            //整理开店星期

            postWeek(data){
                let arr=[];
                if(this.json.isMon) arr.push({weekday:"2",fromTimeStr:data.MonFromTime,toTimeStr:data.MonToTime});
                if(this.json.isTue) arr.push({weekday:"3",fromTimeStr:data.TueFromTime,toTimeStr:data.TueToTime});
                if(this.json.isWed) arr.push({weekday:"4",fromTimeStr:data.WedFromTime,toTimeStr:data.WedToTime});
                if(this.json.isThu) arr.push({weekday:"5",fromTimeStr:data.ThuFromTime,toTimeStr:data.ThuToTime});
                if(this.json.isFri) arr.push({weekday:"6",fromTimeStr:data.FriFromTime,toTimeStr:data.FriToTime});
                if(this.json.isSat) arr.push({weekday:"7",fromTimeStr:data.SatFromTime,toTimeStr:data.SatToTime});
                if(this.json.isSun) arr.push({weekday:"1",fromTimeStr:data.SunFromTime,toTimeStr:data.SunToTime});
                return arr;
            },
            //整理送货星期
            postWeek2() {
                let arr = [];
                if (this.json2.isMon) arr.push(2);
                if (this.json2.isTue) arr.push(3);
                if (this.json2.isWed) arr.push(4);
                if (this.json2.isThu) arr.push(5);
                if (this.json2.isFri) arr.push(6);
                if (this.json2.isSat) arr.push(7);
                if (this.json2.isSun) arr.push(1);
                return arr;
            },

            saveAdImg() {
                this.queryDs.sendVerify();
                let checkResult = this.queryDs.getCurrentRecord().getVerifyResult();

                if (!checkResult.ifPassVerify) {
                    this.$store.commit("message", this.$t('enterFull'));
                    return;
                } else if (this.uploadSuccessNum != 3) {
                    this.$store.commit("loading", this.$t('inTheSave'));
                    this.uploadAll();
                } else {
                    this.submit();
                }
            },

            //删除所有关联，暂时停用
            delRelate() {
                let msg = this.$t('removeAll');
                this.$store.commit("confirm", {
                    message: msg,
                    ok: function () {
                        store.deleteRelatedProducts.execute({
                            data: {"storeId": this.$route.query.id},
                            success: function (data) {
                                this.$store.commit("message")
                            },
                            failed: function (msg) {
                                this.$store.commit("message", msg)
                            }
                        })
                    }
                });
            },

            goList() {
                this.$router.push({name: "page.store.list"});
            }
        },

    }
</script>

<style lang="scss" scoped>
    .col-sm-2 {
        width: 16.66666667%;
        float: left;
        text-align: center;
    }

    .col-sm-5 {
        width: 41.66666667%;
        float: left;
    }

    .control-label {
        height: 24px;
        line-height: 24px;
        font-size: 13px;
        color: rgba(0, 0, 0, 0.54);
    }

    .left {
        float: left;
    }

    h5 {
        margin-bottom: 10px;
    }
  #time-all{
    border-radius:5px;
    border:1px solid #eeeeee;
    background: #000;
    color:#fff;
    text-align: center;
  }
  #choice-time-all{
    margin-top:10px;
    margin-right:35%;
  }
</style>
