import { likeSearchRule, gtSearchRule, ltSearchRule, betweenSearchRule } from 'common/js/config'
import { getLocalStorage, removeLocalStorage } from 'common/js/dom'

//用户信息本地存储 变量
const userLocalName = 'info'

//当前工地信息本地存储 变量
const taskLocalName = 'taskIng'

//获取当前用户本地存储信息
export function getUserIng() {
	return getLocalStorage(userLocalName)
}

//设置当前用户本地存储信息
export function setUserIng(obj) {
	return getLocalStorage(userLocalName, obj)
}

//删除当前用户本地存储信息
export function removeUserIng() {
	return removeLocalStorage(userLocalName)
}

//获取当前工地信息本地存储信息
export function getTaksIng() {
	return getLocalStorage(taskLocalName)
}

//设置当前工地信息本地存储信息
export function setTaksIng(obj) {
	return getLocalStorage(taskLocalName, obj)
}

//模糊查询
export function likeSearch(obj) {
	let search = {}
	for(let key in obj) {
		search[key] = `${obj[key]}${likeSearchRule}`
	}
	return search
}

//模糊查询
export function likeStrSearch(str) {
	return `${str}${likeSearchRule}`
}

//大于查询
export function gtStrSearch(str) {
	return `${str}${gtSearchRule}`
}

//小于查询
export function ltStrSearch(str) {
	return `${str}${ltSearchRule}`
}

//区间查询
export function betweenStrSearch(small, big) {
	return `${small}${betweenSearchRule}${big}`
}

//深拷贝一个Object
export function cloneObj(obj) {
	if(typeof obj !== 'object') {
		return obj;
	}
	var s = {};
	if(obj.constructor === Array) {
		s = [];
	}
	for(var i in obj) {
		s[i] = cloneObj(obj[i]);
	}
	return s;
}

//判断一个对象是否为空对象
export function isNullObject(obj) {
	return JSON.stringify(obj) === '{}' ? true : false
}

//过滤时间格式
export function timeFilter(time, format) {
	var o = {
		'M+': time.getMonth() + 1, //month 
		'd+': time.getDate(), //day 
		'H+': time.getHours(), //hour 
		'm+': time.getMinutes(), //minute 
		's+': time.getSeconds(), //second 
		'q+': Math.floor((time.getMonth() + 3) / 3), //quarter 
		'S': time.getMilliseconds() //millisecond 
	}

	if(/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length));
	}

	for(var k in o) {
		if(new RegExp('(' + k + ')').test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
		}
	}
	return format;
}

export function fiterConstruct(arr) {
	let result = {
		'施工员': [],
		'质监员': [],
		'安全员': [],
		'技术负责人': [],
		'项目经理': []
	}

	arr.map(item => {
		if(!result[item.job]) {
			return
		}
		result[item.job].push(item)
	})

	return result
}

export function fiterSupervisor(arr) {
	let result = {
		'监理员': [],
		'总监理': []
	}

	arr.map(item => {
		if(!result[item.job]) {
			return
		}
		result[item.job].push(item)
	})

	return result
}

export function fiterJob(str) {
	let jobKey = ''
	switch(str) {
		case '施工员':
			jobKey = 'constructor_realname'
			break;
		case '质监员':
			jobKey = 'qualitysupervisor'
			break;
		case '安全员':
			jobKey = 'safor'
			break;
		case '技术负责人':
			jobKey = 'technologyleader'
			break;
		case '项目经理':
			jobKey = 'pm'
			break;
		case '监理员':
			jobKey = 'supervisor_realname'
			break;
		case '总监理':
			jobKey = 'chiefsupervisor'
			break;
	}

	return jobKey
}

export function filterCoordinate(arr) {
	let filterArr = []
	arr.map(item => {
		filterArr.push([item.lng, item.lat])
	})

	return filterArr
}

export function split_array(arr, len) {
	var a_len = arr.length;
	var result = [];
	for(var i = 0; i < a_len; i += len) {
		result.push(arr.slice(i, i + len));
	}
	return result;
}