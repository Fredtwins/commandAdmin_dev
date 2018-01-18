/* 所有地图图层 
 * @ 劳兆城 
 * @ 2017-08-30*/

import { ajaxPost } from './axios'
import { options, Static, mapHttpUrl20462, mapHttpUrl20463, mapLayerHttpUrl } from './config'
import { getTaskList } from 'api/task-management'

//实例一个map
export function createMap(el, layers) {
	return new ol.Map({
		target: el,
		layers: layers,
		view: new ol.View({
			center: [113.0445, 23.0907],
			zoom: 11,
			maxZoom: 19,
			minZoom: 0,
			projection: 'EPSG:4326',
			extent: [109.6820068359375, 20.264282226562504, 116.8670654296875, 25.3729248046875]
		}),
		controls: ol.control.defaults({
			attribution: false,
		})
	})
}

//创建Features
function createFeatures(LNT, LAT, data, img, scale = 0.5) {
	let features = [];
	for(let i = 0; i < data.length; i++) {
		if(+data[i][LNT] && +data[i][LAT]) {
			let feature = new ol.Feature(new ol.geom.Point([data[i][LNT], data[i][LAT]]));
			feature.set('style', new ol.style.Style({
				image: new ol.style.Icon(({
					src: img,
					scale: scale
				}))
			}));
			feature.set('content', data[i]);
			features.push(feature);
		}
	}
	return features;
}

//创建FeaturesLayer
function createFeaturesLayer(name, features) {
	return new ol.layer.Vector({
		style: function(feature) {
			return feature.get('style');
		},
		source: new ol.source.Vector({
			features: features
		}),
		name: name
	});
}

//获取地图 Layer
export function getLayer(layerName) {
	let fn
	
	switch(layerName) {
		//基础图层	
		case 'baseLayer':
			fn = baseLayer()
			break
		case 'heightLayer':
			fn = heightLayer()
			break
		case 'GdPanoramaLayer':
			fn = GdPanoramaLayer()
			break
		case 'FsPanoramaLayer':
			fn = FsPanoramaLayer()
			break
		case 'FsNhLayer':
			fn = FsNhLayer()
			break
		case 'notionLayer':
			fn = notionLayer()
			break
		
		//工地图层
		case 'sitesLayer':
			fn = sitesLayer()
			break
	}
	
	return fn || Promise.resolve({})
}

/* 基础图层 */
//普通地图 Layer
function baseLayer() {
	return new ol.layer.Tile({
		source: new ol.source.TileArcGISRest({
			url: `${mapHttpUrl20462}arcgis/rest/services/data_visualization/basemap_backgroud_normal/MapServer`
		}),
		visible: false
	})
}

//地形图 Layer
function heightLayer() {
	return new ol.layer.Tile({
		source: new ol.source.XYZ({
			url: `${mapHttpUrl20463}static/map_tile/gaocheng_guangdong_google/tiles/{z}/{y}/{x}.png`
		}),
		visible: false
	})
}

//广东卫星图 Layer
function GdPanoramaLayer() {
	return new ol.layer.Tile({
		source: new ol.source.XYZ({
			url: `${mapHttpUrl20463}static/map_tile/satellite_foshan_tiandi/tiles/{z}/{y}/{x}.png`,
			minZoom: 0,
			maxZoom: 18
		}),
		visible: false
	})
}

//佛山卫星图 Layer
function FsPanoramaLayer() {
	return new ol.layer.Tile({
		source: new ol.source.XYZ({
			url: `${mapHttpUrl20463}static/map_tile/satellite_foshan_tiandi/tiles/{z}/{y}/{x}.png`,
			minZoom: 0,
			maxZoom: 18
		}),
		visible: false
	})
}

//佛山南海 Layer
function FsNhLayer() {
	return new ol.layer.Tile({
		source: new ol.source.TileArcGISRest({
			url: `${mapHttpUrl20462}arcgis/rest/services/data_visualization/basemap_foshan_nanhai/MapServer`
		}),
		visible: false
	})
}

//镇街名 Layer
function notionLayer() {
	return new ol.layer.Tile({
		source: new ol.source.TileArcGISRest({
			url: `${mapHttpUrl20462}arcgis/rest/services/data_visualization/notation/MapServer`
		})
	})
}

//工地信息 Layer
function sitesLayer() {
	let url = 'construction/list'
	
	let data = {}
	
	return ajaxPost(url, data, options()).then(res => {
		
		let site = [], siting = [], noSite = []
		
		res.result.result.map(item => {
			switch(item.state) {
				case '已建':
					site.push(item)
					break;
				case '在建':
					siting.push(item)
					break;
				case '规划中':
					noSite.push(item)
					break;
			}
		})
		
		let siteFeatures = createFeatures('lnt', 'lat', site, `${Static}img/mapIcon/site.png`)
		let sitingFeatures = createFeatures('lnt', 'lat', siting, `${Static}img/mapIcon/siting.png`)
		let noSiteFeatures = createFeatures('lnt', 'lat', noSite, `${Static}img/mapIcon/noSite.png`)
		
		let siteLayer = createFeaturesLayer('siteLayer', siteFeatures)
		let sitingLayer = createFeaturesLayer('sitingLayer', sitingFeatures)
		let noSiteLayer = createFeaturesLayer('noSiteLayer', noSiteFeatures)
		
		return Promise.resolve({
			code: res.code,
			layer: {
				siteLayer,
				sitingLayer,
				noSiteLayer
			}
		})
	})
}

//
export function singleSitesFeatures(obj) {
	return createFeatures('lnt', 'lat', [obj], `${Static}img/mapIcon/patrolMission.png`, 0.7)
}

export const singleSitesDrawSource = new ol.source.Vector({
	url: `${Static}geojson/geojson.json`,
	format: new ol.format.GeoJSON(),
	wrapX: false
})

export function drawPointFeature(arr) {
	let data = []
	
	arr.map(item => {
		if (item.construction) {
			data.push(item.construction)			
		}
	})
	
	let features = createFeatures('lnt', 'lat', data, `${Static}img/mapIcon/patrolMission.png`)
	
	return features
}
