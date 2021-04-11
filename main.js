import Vue from 'vue'
import App from './App'
import Api from 'api/api.js'
import Tool from './utils/tool.js'
import Config from './utils/config.js'

import cuCustom from './colorui/components/cu-custom.vue'
import cuDefaultCustom from './colorui/components/cu-default-custom.vue'
import cuTarbar from './colorui/components/custom-tarbar.vue'

//下拉刷新
import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue"
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue"

import uView from "uview-ui";
Vue.use(uView);

//引用页面
import Home from './pages/index/home.vue'

//引用my
import My from './pages/my/index.vue'

//引入发布
import Push from './pages/push/index.vue'

import Bus from './utils/bus.js'

Vue.component('cu-custom',cuCustom)
Vue.component('cu-defaule-custom',cuCustom)
Vue.component('cu-tarbar',cuTarbar)

Vue.component('Home',Home)
Vue.component('My',My)
Vue.component('Push',Push)

Vue.component('mescroll-body', MescrollBody)
Vue.component('mescroll-uni', MescrollUni)


Vue.config.productionTip = false
Vue.prototype.$Bus = Bus
Vue.prototype.Api = Api
Vue.prototype.Tool = Tool

Vue.prototype.Config = Config
//版本控制 
Vue.prototype.version = Config.version
Vue.prototype.$getCount = (cb) => {
	Api.myUnread({community_id: uni.getStorageSync('community_id')}).then((result) => {
		if(result.code == 1){
			cb(result)
		}else{
			cb(result)
		}
	})
}

Vue.prototype.formatTimeMd = function (n) {

		return Tool.dateFormat('mm-dd',new Date(n*1000))
	
}

//发布者publishType
Vue.prototype.publishType = function(type) {
	return Tool.publishType(type)
}


Vue.prototype.$getMyscore = (cb) => {
	Api.ucenterMyScore({}).then((result) => {
		if(result.code == 1){
			cb(result)
		}else{
			cb(result)
		}
	})
}




/*格式化时间戳*/
Vue.filter('formatTime', function(n) {
	return Tool.dateFormat('mm-dd HH:MM',new Date(n*1000));
});

Vue.filter('formatTimeMd', function(n) {
	return Tool.dateFormat('mm-dd',new Date(n*1000));
});
Vue.filter('formatTimeYMD', function(n) {
	return Tool.dateFormat('YY-mm-dd',new Date(n*1000));
});


// 显示类型
Vue.filter('filterType', function(type) {
	return Tool.resultValue(type);
});

Vue.filter('listValue',function(type){
	return Tool.listValue(type)
})

//闲置处理
Vue.filter('sellType', function(type) {
	return Tool.sellValue(type);
});


//活动状态
Vue.filter('joinStatus', function(type) {
	return Tool.joinStatus(type);
});

//答题状态
Vue.filter('askStatus', function(type) {
	return Tool.askStatus(type);
});





App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()

 



