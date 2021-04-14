const checkPhone = function(code) {
	if (!(/^1[123456789]\d{9}$/.test(code))) {
		return false
	} else {
		return true
	}
}

const dateFormat = function(fmt, date) {
	let ret;
	let opt = {
		"Y+": date.getFullYear().toString(), // 年
		"m+": (date.getMonth() + 1).toString(), // 月
		"d+": date.getDate().toString(), // 日
		"H+": date.getHours().toString(), // 时
		"M+": date.getMinutes().toString(), // 分
		"S+": date.getSeconds().toString() // 秒
		// 有其他格式化字符需求可以继续添加，必须转化成字符串
	};
	for (let k in opt) {
		ret = new RegExp("(" + k + ")").exec(fmt);
		if (ret) {
			fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
		};
	};
	return fmt;
}

const resultValue = function(index) {
	var tagList = [{
			id: 1,
			tag: '求助'
		}, {
			id: 2,
			tag: '新鲜事'
		},
		{
			id: 3,
			tag: '闲置'
		},
		{
			id: 4,
			tag: '鹊桥'
		},
		{
			id: 5,
			tag: '活动'
		},
		{
			id: 6,
			tag: '达人秀'
		},
		{
			id: 7,
			tag: '便民'
		},
		//
		{
			id: 8,
			tag: '动态'
		},
		{
			id:13,
			tag:'邻居'
		},
		{
			id:14,
			tag:'房产'
		},
		{
			id:15,
			tag:'招聘'
		},
		{
			id:16,
			tag:'议事厅'
		},
		{
			id:17,
			tag:'邻里团'
		},
		{
			id:18,
			tag:'曝光台'
		}
	]
	var value = ''
	tagList.map((item) => {
		if(item.id == index){
			value = item.tag
			if(item.id == 5){
				value = '新鲜事'
			}
		}
	})
	return value
}
const navList = [
		{
			id: 3,
			tag: '闲置'
		},
		{
			id:17,
			tag:'邻里团'
		},
		{
			id: 6,
			tag: '达人'
		},
		{
			id: 2,
			tag: '新鲜事'
		},
		{
					id: 1,
					tag: '求助'
		},		
		{
			id:18,
			tag:'曝光台'
		},
		{
			id:16,
			tag:'议事厅'
		},
		{
			id:14,
			tag:'房产'
		},
		{
			id:15,
			tag:'招聘'
		}
]
//
const listValue = function(index) {
	var tagList = [{
			id: 1,
			tag: '求助'
		}, {
			id: 2,
			tag: '新鲜事'
		},
		{
			id: 3,
			tag: '闲置'
		},
		{
			id: 4,
			tag: '鹊桥'
		},
		{
			id: 5,
			tag: '活动'
		},
		{
			id: 6,
			tag: '达人'
		},
		{
			id: 7,
			tag: '便民'
		},
		{
			id: 8,
			tag: '居委会动态'
		},
		{
			id:13,
			tag:'新的用户（邻居）'
		},
		{
			id:14,
			tag:'安居'
		},
		{
			id:15,
			tag:'乐业'
		},
		{
			id:16,
			tag:'议事厅'
		},
		{
			id:17,
			tag:'拼团'
		},
		{
			id:18,
			tag:'曝光台'
		}
	]
	var value = ''
	tagList.map((item) => {
		if(item.id == index){
			value = item.tag
		}
	})
	return value
}

const joinStatus = function(index) {
	if(index == 1){
		return '立即报名'
	}else if(index == 2){
		return '已报名'
	}else if(index ==3){
		return '报名人数已满'
	}else if(index == 4){
		return '报名未开始'
	}else if(index == 5 ){
		return '报名已结束'
	}
}

const askStatus = function(index) {
	if(index == 1){
		return '立即答题'
	}else if(index == 2){
		return '已答题'
	}else if(index ==3){
		return '答题人数已满'
	}else if(index == 4){
		return '答题未开始'
	}else if(index == 5 ){
		return '答题已结束'
	}
}

const publishType = function(index){
	//110 => "街道", 111 => "居委会",113 => "业委会"，114=>"物业"
	var obj = {
		110:'街道',
		111:'居委会',
		113:'业委会',
		114:'物业'
	}
	return obj[index]
}

const sellValue = function(index){
	var buyList = [
		{name:'出售',value:1,check:true},
		{name:'赠送',value:2,check:false},
		{name:'出租',value:3,check:false},
		{name:'置换',value:4,check:false},
		{name:'求购',value:5,check:false}
	]
	var result = ''
	buyList.map((item) => {
		if(item.value == index) {
			result = item.name
		}
	})
	return result
}

const wxRequest =  function (obj, cb, page, type) {
        var isOne = true
        var cachFn = function () {
            wx.request({
                  url: obj.url,
                  data: obj.data || {},
                  method: obj.method || 'GET',
                  success: function (res) {
                    cb.call(page, res)
                    if (!page.data.isNet) {
                        page.setData({
                            isNet: true
                        })
                    }
                  },
                  // fail执行时当断网处理
                  fail: function () {
                      // 防止fail 有时会执行两次，影响渲染
                      if (!isOne) {
                          return
                      }
                    page.setData({
                        isNet: false,
                        isRequested: false
                    })
                    // 记录本次请求，加载时，执行page实例的reloadFn即可
                      page.reloadFn = wxRequest(obj, cb, page, 1)
                      isOne = false
                  }
            })
        }
    
        if (type) {
            page.isRequested = true
        }
    
        return type ? cachFn : cachFn()
    }
					
module.exports = {
	checkPhone,
	dateFormat,
	resultValue,
	sellValue,
	joinStatus,
	askStatus,
	listValue,
	navList,
	publishType
}
