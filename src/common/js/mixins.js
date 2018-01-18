import loading from 'base/loading/loading'
import baseTitle from 'base/base-title/base-title'
import interactModel from 'base/interact-model/interact-model'
import scroll from 'base/scroll/scroll'
import dataForm from 'base/data-form/data-form'
import warnModel from 'base/warn-model/warn-model'
import primaryModel from 'base/primary-model/primary-model'
import { calendarData } from 'common/js/module'

export const loadingMixin = {
	components: {
		'loading': loading
	}
}

export const baseTitleMixin = {
	components: {
		'base-title': baseTitle
	}
}

export const interactModelMixin = {
	components: {
		'interact-model': interactModel
	}
}

export const scrollMixin = {
	components: {
		'scroll': scroll
	}
}

export const dataFormMixin = {
	components: {
		'data-form': dataForm
	}
}

export const warnModelMixin = {
	components: {
		'warn-model': warnModel
	}
}

export const primaryModelMixin = {
	components: {
		'primary-model': primaryModel
	}
}

export const calendarMixin = {
	computed: {
		dateData() {
			let arr = []
			let obj = this.filterList

			for(let i = 0; i < this.one; i++) {
				arr.push({})
			}
			for(let i = 0; i < this.count; i++) {
				let index = i + 1
				if(i + 1 < 10) {
					index = `0${index}`
				}
				let data = this.filterList[`${this.yearIndex}-${this.monthIndex}-${index}`]
				arr.push({
					index: i + 1,
					date: `${this.yearIndex}-${this.monthIndex}-${index}`,
					data: data
				})
			}
			return arr
		},
		monthActive() {
			if(this.yearIndex !== this.getYear()) {
				return false
			}
			if(this.monthIndex !== this.getMonth()) {
				return false
			}
			return true
		}
	},
	created() {
		this.initDate(this.cascaderData)
	},
	data() {
		return {
			data: calendarData,
			dataList: [],
			cascaderData: [this.getYear(), this.getMonth()],
			yearIndex: null,
			monthIndex: null,
			one: null,
			count: null
		}
	},
	methods: {
		initDate(time) {
			this.yearIndex = time[0]
			this.monthIndex = time[1]
			this.one = new Date(time[0], time[1] - 1, 1).getDay()
			this.count = new Date(time[0], time[1], 0).getDate()
		},
		getYear() {
			return new Date().getFullYear()
		},
		getMonth() {
			let month = new Date().getMonth() + 1
			if (month < 10) {
				month = `0${month}`
			}
			return month
		},
		getDate() {
			return new Date().getDate()
		}
	}
}