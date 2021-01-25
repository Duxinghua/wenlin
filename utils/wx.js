import Api from '../api/api.js'
const GetUrlParame = (parameName) => {
  var parames = window.location.search
  if (parames.indexOf(parameName) > -1) {
    var parameValue = ''
    parameValue = parames.substring(parames.indexOf(parameName), parames.length)
    if (parameValue.indexOf('&') > -1) {
      parameValue = parameValue.substring(0, parameValue.indexOf('&'))
      parameValue = parameValue.replace(parameName + '=', '')
      return parameValue
    }
    return ''
  }
}

const wxAuthorize = () => {
	let appid = 'wx9d482b3ac6246078';
    let link = window.location.href;
    let code = GetUrlParame(link);  // 地址解析
	console.log(code,'code')
       // 已经授权登录过的就不用再授权了
    if (uni.getStorageSync('token')) {
		return
	}else{
		// 如果拿到code，调用授权接口，没有拿到就跳转微信授权链接获取
		if (code) {
			// 调用后台接口，授权
			console.log(code)
			Api.wechatAuth({appid:appid,code:code}).then((result) => {
				console.log(result)
				// if(result.code == 1){
				// 	console.log(result)
				// 	uni.setStorageSync('token', result.data.token)
				// }
			})
			return
		} else {
			uni.setStorageSync('set',true)
			if(uni.getStorageSync('set')){
				let uri = encodeURIComponent(link);
				let authURL = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${uri}&response_type=code&scope=snsapi_userinfo&state=state#wechat_redirect`;
				window.location.href = authURL;
				uni.setStorageSync('set',false)
			}
		}
	}
}
module.exports = {
	wxAuthorize
}