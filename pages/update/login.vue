<template>
	<view class="login">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight" />
		<view class="content">
			<u-form :model="form" ref="uForm" label-width="120" >
				<u-form-item label="手机号" border-bottom="true"><u-input v-model="form.mobile"  placeholder="请输入手机号" /></u-form-item>
				<u-form-item label="密码" border-bottom="true"><u-input v-model="form.password" placeholder="请输入密码" /></u-form-item>	
			</u-form>
			<u-button @click="submit">登录</u-button>
		</view>

	</view>
</template>

<script>
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	export default{
		components:{
			navigationCustom
		},
		data(){
			return {
				form:{
					mobile:'',
					password:''
				},
				config: {
					title: '登录', //title
					bgcolor: 'white', //背景颜色
					fontcolor:"rgba(51, 51, 51, 1)", //文字颜色，默认白色
					type:4, //type 1，3胶囊 2，4无胶囊模式
					transparent: false, //是否背景透明 默认白色
					linear: false, //是为开启下滑渐变
					share: false //是否将主页按钮显示为分享按钮
					// menuIcon:"../static/icon/back_.png", 当type为3或者4的时候左边的icon文件位置，注意位置与当前页面不一样
					// menuText:"返回", 当type为3或4的时候icon右边的文字
				},
				scrollTop: 0, // 当linear为true的时候需要通过onpagescroll传递参数
				scrollMaxHeight: 200, //滑动的高度限制，超过这个高度即背景全部显示
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		methods:{
			submit(){
				if(!this.form.mobile){
					return this.$u.toast('请输入手机号')
				}
				if(!this.form.password){
					return this.$u.toast('请输入密码')
				}
				this.Api.loginByMobile(this.form).then((result)=>{
					
					if(result.code == 1){
						uni.setStorageSync('test',true)
						uni.redirectTo({
							url:'/pages/index/index'
						})
					}
				})
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.login{
		display: flex;
		flex-direction: column;
		.content{
			padding:350rpx 40rpx;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
		}
	}
</style>
