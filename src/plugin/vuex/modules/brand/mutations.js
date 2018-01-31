import * as types from './mutationsTypes'

const mutations = {
    [types.ALTER] (state, data) {
        state.data = data;
    }
};

export default mutations;