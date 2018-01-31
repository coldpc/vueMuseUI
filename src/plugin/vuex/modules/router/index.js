import actions from './actions'
import mutations from './mutations'
import initData from './getInitData'

export default {
    namespaced: true,

    state: {
        id: 1,
        data: [Object.assign({}, initData)]
    },

    getters: {
        routerOptions(state) {
            return state.data;
        }
    },

    actions,
    mutations
}