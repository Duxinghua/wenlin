import Config from './config.js'

function wxRequest(data, url, method) {
	let token = uni.getStorageSync("token")
	var flag = url.indexOf('api/community/user_comment/setComments') > -1 ||
		url.indexOf('api/community/user_comment/delComments') > -1 ||
		url.indexOf('api/community/community_dynamics/pushDynamics') > -1 ||
		url.indexOf('api/community/community_dynamics/helpDynamicsByCommunityId') > -1 ||
		url.indexOf('api/community/community_dynamics/thanksHelp') > -1 ||
		url.indexOf('api/community/Likes/setCommonLikes') > -1 ||
		url.indexOf('api/community/user_comment/getMultistageComments') > -1 ||
		url.indexOf('api/community/Likes/unsetCommonLikes') > -1 ||
		url.indexOf('api/community/favorites/setDynamicsFavorites') > -1 ||
		url.indexOf('api/community/favorites/unsetDynamicsFavorites') > -1 ||
		url.indexOf('api/community/user/setKown') > -1 ||
		url.indexOf('api/community/user/unSetKown') > -1 ||
		url.indexOf('api/community/community_dynamics/wikiCorrection') > -1 ||
		url.indexOf('api/community/user_comment/getMultistageComments') > -1 ||
		url.indexOf('api/community/community_dynamics/getDynamicsPushLog') > -1 ||
		url.indexOf('api/community/Activity/getJoinUser') > -1 ||
		url.indexOf('api/community/ucenter/myScore') > -1 ||
		url.indexOf('api/community/ucenter/myUnread') > -1
	if (!flag) {
		uni.showLoading({
			title: '加载中',
			mask: true
		});
	}
	
	if(url.indexOf('api/wxapp/public/communityLoginByCode') > -1){
		if(uni.getStorageSync('test')){
			data.version = Config.version
		}
	}
	return new Promise((resolve, reject) => {
		uni.request({
			url: url,
			data: data,
			method: method,
			header: {
				'Content-Type': method === 'POST' ? 'application/x-www-form-urlencoded' : 'application/json',
				'XX-Wxapp-AppId': Config.appid,
				'XX-Device-Type': Config.type,
				'XX-Token': token,

			},
			success: res => {
				if (!flag) {
					uni.hideLoading();
				}
				uni.stopPullDownRefresh();
				uni.hideNavigationBarLoading();
				if (res.data.code == 1) {
					resolve(res.data)
				} else if(res.data.code == -1){
					uni.redirectTo({
						url:'/pages/update/limit'
					})
					resolve(res.data)
				}else{
					resolve(res.data)
					// if (res.data.code == 401) {
					// 	uni.showModal({
					// 		title: '提示',
					// 		content: '您还未登录哦,请先登录~',
					// 		cancelText: '随便看看',
					// 		confirmText: '立即登录',
					// 		success(res) {
					// 			if (res.confirm) {
					// 				wepy.reLaunch({
					// 					url: '/page_login/pages/login-tel'
					// 				})
					// 			} else if (res.cancel) {

					// 			}
					// 		}
					// 	})
					// } else {
					// 	uni.showToast({
					// 		title: res.data.msg,
					// 		icon: "none",
					// 		mask: true
					// 	});
					// }
					if(url.indexOf('api/wxapp/public/communityLoginByCode') == -1){
						uni.showToast({
							title: res.data.msg,
							icon: "none",
							duration: 3000,
							mask: true
						});
					}

				}
			},
			fail: (err) => {
				console.log(err, 'err')
				uni.hideLoading();
				uni.stopPullDownRefresh();
				uni.hideNavigationBarLoading();
				// uni.navigateTo({
				// 	url: '/pages/index/network'
				// });
				reject({
					code: -1,
					msg: err
				})
			},
			complete: (res) => {

			}
		})
	})
}

function wxUploadFile(filePath, url) {
	let token = uni.getStorageSync("token")
	uni.showLoading({
		title: '正在上传',
		mask: true
	});
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: url,
			filePath: filePath,
			header: {
				"Content-Type": "multipart/form-data",
				'XX-Wxapp-AppId': Config.appid,
				'XX-Device-Type': Config.type,
				'XX-Token': token
			},
			name: 'file',
			success: res => {
				console.log(res)
				uni.hideLoading()
				if(res.data){
					var obj = JSON.parse(res.data)
					if(obj.code == 1){
						resolve(obj)
					}else if(obj.code == 0){
						uni.showToast({
							title: obj.msg,
							icon: "none",
							duration: 3000,
							mask: true
						});
						resolve(obj)
					}
				}else{
					uni.showToast({
						title: '您上传的图片超过最大尺寸，请调整后再试',
						icon: "none",
						duration: 3000,
						mask: true
					});
				}
			},
			fail: (err) => {
				reject({
					code: -1,
					msg: err
				})
			},
		})
	})
}

module.exports = {
	wxRequest,
	wxUploadFile
}
