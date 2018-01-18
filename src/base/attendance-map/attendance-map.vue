<template>
	<el-amap 
		ref="map" 
		vid="amapDemo" 
		v-if="center.length"
		:center="center" 
		:zoom="12" 
		class="amap-demo">
		<el-amap-polygon 
			v-if="drawPolygons.path.length"
			:editable="drawPolygons.editable" 
			:strokeColor="drawPolygons.strokeColor"
			:fillColor="drawPolygons.fillColor"
			:fillOpacity="drawPolygons.fillOpacity"
			:path="drawPolygons.path">
		</el-amap-polygon>
		<el-amap-marker v-if="drawMarkers.pos.length" :position="drawMarkers.pos" :icon="drawMarkers.icon" :zIndex="drawMarkers.zIndex"></el-amap-marker>
	</el-amap>
</template>

<script>
	import { Static } from 'api/config'
	export default {
		data() {
			return {
				center: [],
				drawMarkers: {
					pos: [],
					icon: `${Static}img/mapIcon/draw.png`,
					zIndex: 9999,
				},
				drawPolygons: {
					strokeColor: '#008cee',
					fillColor: 'white',
					fillOpacity: 0.7,
					path: []
				}
			}
		},
		methods: {
			setMap(row) {
				this.center = [row.lnt, row.lat]
				this.drawMarkers.pos = [row.lnt, row.lat]
				this.drawPolygons.path = row.construction.coordinate || []
			}
		}
	}
</script>

<style>
</style>