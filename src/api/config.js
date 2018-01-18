/* 接口和路径的配置项 
 * @ 劳兆城 
 * @ 2017-08-30*/

import { getUserIng } from 'common/js/util'

//接口地址
//export const httpUrl = 'http://10.168.80.182:8080/ConstructionPatrolStrust/';
export const httpUrl = 'http://121.201.43.239:9000/ConstructionPatrol/';

//地图20462地址
export const mapHttpUrl20462 = 'http://202.105.25.138:20462/';

//地图20463地址
export const mapHttpUrl20463 = 'http://202.105.25.138:20463/';

//数据一张图 图层信息地址
export const mapLayerHttpUrl = 'http://121.201.43.239:8090/';

//后台数据返回成功标识
export const ERR_OK = '0000';

//登录超时
export const ERR_TIMEOUT = '0004';

//js访问 static 文件夹路径
export const Static = 'static/';

//访问后台传的token值
export function options() {
	return {
		headers: {
			token: getUserIng().token
		}
	}
}