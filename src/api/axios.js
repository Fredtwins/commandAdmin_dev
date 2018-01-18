/* 封装的axios 
 * @ 劳兆城 
 * @ 2017-08-30*/
import axios from 'axios'
import { httpUrl, ERR_TIMEOUT } from 'api/config'
import { removeUserIng } from 'common/js/util'

const timeOut = '登录超时，请重新登录。'

//页面接口通用接口 get 
export function ajaxGet(url = '', data = {}, option = {}) {
	url = `${httpUrl}${url}`
	return axios.get(url, {
		params: data,
		...option
	}).then(res => {
		if(res.code === ERR_TIMEOUT) {
			removeUserIng()
			alert(timeOut)
			window.location.href = '/buildSite'
			return
		}
		return Promise.resolve(res.data)
	}).catch(res => {
		return Promise.resolve(res.data)
	})
}

//页面接口通用接口 Post 
export function ajaxPost(url = '', data = {}, option = {}) {
	url = `${httpUrl}${url}`
	return axios.post(url, data, option).then(res => {
		if(res.data.code === ERR_TIMEOUT) {
			removeUserIng()
			alert(timeOut)
			window.location.href = location.pathname
			return
		}
		return Promise.resolve(res.data)
	}).catch(res => {
		return Promise.resolve(res.data)
	})
}

//页面接口通用接口 All 
export function ajaxAll(arr, option = {}) {
	let ajaxArr = []

	arr.map(item => {
		if(item.method === 'get') {
			ajaxArr.push(axios.get(`${httpUrl}${item.url}`, {
				params: item.data,
				...option
			}))
		}else {
			ajaxArr.push(axios.post(`${httpUrl}${item.url}`, item.data, option))
		}
	})
	
	return axios.all(ajaxArr).then((...res) => {
		let timeout = false
		let data = []
		for (let item of res[0]) {
			if (item.data.code === ERR_TIMEOUT) {
				removeUserIng()
				alert(timeOut)
				window.location.href = location.pathname
				timeout = true
			}
			data.push(item)
		}
		
		return Promise.resolve(data)
	}).catch((...res) => {
		return Promise.resolve(res)
	})
}