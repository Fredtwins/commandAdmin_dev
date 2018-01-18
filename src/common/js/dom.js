/* dom 操作 方法
 * @ 劳兆城 
 * @ 2017-08-02*/

import Vue from 'vue';
import storage from 'good-storage'

//获取 和 设置本地存储
export function getLocalStorage(name, val) {
	if(val) {
		return storage.set(name, val);
	}
	return storage.get(name);
}

//删除本地存储
export function removeLocalStorage(name) {
	return storage.remove(name);
}

//成功 notice
export function successNotice(str) {
	Vue.prototype.$Notice.success({
		title: str
	});
}

//失败 notice
export function errorNotice(str = '', isTitle = false) {
	if (!isTitle) {
		Vue.prototype.$Notice.error({
			title: `数据加载出错。。。`,
			desc: `${str}尝试重新刷新或联系管理员。`
		});
	}else {
		Vue.prototype.$Notice.error({
			title: str
		});
	}
	
}

//成功 msg 
export function successMessage(str) {
	Vue.prototype.$Message.success(str);
}

//失败 msg
export function errorMessage(str) {
	Vue.prototype.$Message.error(str);
}

let elementStyle = document.createElement('div').style

let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  return false
})()

//行内样式兼容写法
export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }

  if (vendor === 'standard') {
    return style
  }

  return `-${vendor}-${style}`
//vendor + style.charAt(0).toUpperCase() + style.substr(1)
}

//阻止冒泡事件兼容写法
export function CancelBubble(event) { 
	if(event.stopPropagation) {
		event.stopPropagation();
	} else {
		event.cancelBubble = true;
	}
}