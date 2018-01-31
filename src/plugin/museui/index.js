import Vue from 'vue'

import 'muse-components/styles/base.less' // 加载基础的样式

import {retina} from 'muse-components/utils'
import icon from 'muse-components/icon' //图标icon
import badge from 'muse-components/badge' //角标

// import * as breadCrumb from 'muse-components/breadCrumb' 目录


// import appBar from 'muse-components/appBar'

import iconButton from 'muse-components/iconButton'
import flatButton from 'muse-components/flatButton'
import raisedButton from 'muse-components/raisedButton'
import floatButton from 'muse-components/floatButton'

// import contentBlock from 'muse-components/contentBlock'

import * as list from 'muse-components/list'
// import subHeader from 'muse-components/subHeader'
// import divider from 'muse-components/divider'
// import refreshControl from 'muse-components/refreshControl'
// import infiniteScroll from 'muse-components/infiniteScroll'
// import avatar from 'muse-components/avatar'
// import * as tabs from 'muse-components/tabs'
import paper from 'muse-components/paper'
// import * as bottomNav from 'muse-components/bottomNav'
// import * as card from 'muse-components/card'
import chip from 'muse-components/chip'
// import overlay from 'muse-components/internal/popup/overlay'
import dialog from 'muse-components/dialog'
import toast from 'muse-components/toast'
// import snackbar from 'muse-components/snackbar'
// import popup from 'muse-components/popup'
import * as menu from 'muse-components/menu'
// import bottomSheet from 'muse-components/bottomSheet'
import popover from 'muse-components/popover' //弹出组件
import iconMenu from 'muse-components/iconMenu'
import dropDownMenu from 'muse-components/dropDownMenu'
import drawer from 'muse-components/drawer'
// import picker from 'muse-components/picker' //picker
import tooltip from 'muse-components/tooltip' //鼠标移动上去的title

import textField from 'muse-components/textField'
import selectField from 'muse-components/selectField'
import checkbox from 'muse-components/checkbox'
import radio from 'muse-components/radio'
import _switch from 'muse-components/switch'
import slider from 'muse-components/slider'
import linearProgress from 'muse-components/linearProgress'
import circularProgress from 'muse-components/circularProgress'
import * as gridList from 'muse-components/gridList'
// import * as table from 'muse-components/table'
import datePicker from 'muse-components/datePicker'
import timePicker from 'muse-components/timePicker'
// import * as stepper from 'muse-components/stepper'
// import autoComplete from 'muse-components/autoComplete'
import pagination from 'muse-components/pagination'
// import * as timeLine from 'muse-components/timeLine'

import * as grid from 'muse-components/grid'

import * as flexbox from 'muse-components/flexbox'
// import config from 'muse-components/config'

const components = {
    icon,
    //backTop,
    badge,
    //...breadCrumb,
    //appBar,
    iconButton,
    flatButton,
    raisedButton,
    floatButton,
    //contentBlock,
    ...list,
    //subHeader,
    //divider,
    //refreshControl,
    //infiniteScroll,
    //avatar,
    //...tabs,
    paper,
    //...bottomNav,
    //...card,
    chip,
    //overlay,
    dialog,
    toast,
    //snackbar,
    //popup,
    ...menu,
    //bottomSheet,
    popover,
    iconMenu,
    dropDownMenu,
    drawer,
    //picker,
    tooltip,
    textField,
    selectField,
    checkbox,
    radio,
    _switch,
    slider,
    //...timeLine,
    linearProgress,
    circularProgress,
    ...gridList,
    //...table,
    datePicker,
    timePicker,
    //...stepper,
    // autoComplete,
    ...grid,
    ...flexbox,
    pagination
};

const install = function (Vue) {
    Object.keys(components).forEach((key) => {
        Vue.component(components[key].name, components[key]);
    });
    retina();
};

// if (typeof window !== 'undefined' && window.Vue) install(window.Vue);


install(Vue);