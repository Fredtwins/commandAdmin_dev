import * as types from './mutation-types';

const mutations = {
	[types.SET_USER](state, obj) {
		state.User = obj;
	},
	[types.SET_ROUTERFROM](state, str) {
		state.RouterFrom = str;
	},
	[types.SET_INSTITUTION](state, arr) {
		state.Institution = arr;
	}
}

export default mutations