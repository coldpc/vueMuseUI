import actions from './actions'
import mutations from './mutations'

export default {
    namespaced: true,

    state: {
        data: null
    },

    getters: {
        info(state){
            return state.data;
        }
    },

    actions,
    mutations
}