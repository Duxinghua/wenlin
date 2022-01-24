<template>
	<view class="first">
		<image src="https://sq.wenlinapp.com/upload/dynamics/20220123/46500eff549d3f976ab4b894c65af09c.png" class="firstbg"></image>
	</view>
</template>

<script>
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	export default {
		components:{
			navigationCustom
		},
		data(){
			return{
				config: {
					title: '启动页', //title
					bgcolor: 'white', //背景颜色
					fontcolor:"rgba(51, 51, 51, 1)", //文字颜色，默认白色
					type:3, //type 1，3胶囊 2，4无胶囊模式
					transparent: false, //是否背景透明 默认白色
					linear: false, //是为开启下滑渐变
					share: false //是否将主页按钮显示为分享按钮
					// menuIcon:"../static/icon/back_.png", 当type为3或者4的时候左边的icon文件位置，注意位置与当前页面不一样
					// menuText:"返回", 当type为3或4的时候icon右边的文字
				},
				community_id:'',
				community_name:''
			}
		},
		onLoad(options) {
			console.log(options)
			uni.login({
				success: (res) => {
					let { errMsg,code} = res
					if(errMsg == 'login:ok'){
						this.code = res.code
						this.first()
					}
				},
			})
			if (options.scene) {
				this.srouce = 1;
				var scene = decodeURIComponent(options.scene);
				var arr = scene.split('&');
				console.log(arr,'arr')
				if (arr[0]) {
					if (arr[0].split('=')[1]) {
						this.community_id = arr[0].split('=')[1];
					}
				}
				if (arr[1]) {
					if (arr[1].split('=')[1]) {
						this.community_name = arr[1].split('=')[1];
					}
				}			
			}
		},
		methods:{
			first(){
				this.Api.wechatAuth({code:this.code}).then((result)=>{
					if(result.code == 1){
						uni.setStorageSync('token', result.data.token);
						uni.setStorageSync('user', result.data.user);
						uni.setStorageSync('maxJoin', result.data.max_join);
						uni.setStorageSync('mobile', result.data.user.mobile);
						uni.setStorageSync('all_community', result.data.all_community);
						// if(result.data.all_community.length){
						// 	this.community_id = result.data.all_community[0].community_id
						// }
						this.Api.myUsersList({}).then((res) => {
							if(res.code == 1){
								if(res.data.length){
									uni.reLaunch({
										url:'dk'
									})
								}else{
									uni.reLaunch({
										url:'setup?id='+this.community_id
									})
								}
							}
						})
					}
					
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.first{
		width: 100%;
		height:1624rpx;
		position: relative;
		.firstbg{
			position: absolute;
			left:0;
			top:0;
			width: 100%;
			height:1624rpx;
		}
	}
</style>
