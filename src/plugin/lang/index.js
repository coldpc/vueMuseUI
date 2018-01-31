import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from './message' //引入翻译模板

Vue.use(VueI18n);

var i18n = new VueI18n({
  locale: "zh_CN",
  messages,
});

export default i18n;