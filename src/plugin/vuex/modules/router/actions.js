import * as types from './mutationsTypes'

const push = ({ commit }, data) => {
    commit(types.PUSH, data);
};

const reset = ({ commit }) => {
    commit(types.RESET);
};

const remove = ({ commit }, data) => {
    commit(types.REMOVE, data);
};

const focus = ({ commit }, data) => {
    commit(types.FOCUS, data);
};

const reload = ({ commit }, data) => {
    commit(types.RELOAD, data);
};

export default {
    push,
    reset,
    remove,
    focus,
    reload
};
