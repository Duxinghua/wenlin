<template>
	<!-- 居委会 -->
	<view class="integral">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight" />
		<view class="content">
			<view class="item" @click="goComitee(item)" v-for="(item,index) in list" :key="index" :index="index">
				<image :src="item.logo ? item.logo : '../../static/committee.jpg'" class="avatar"></image>
				<view class="userinfo">
					<text class="t1">{{item.title}}</text>
					<text class="t2">{{item.address}}</text>
				</view>
				<image src="../../static/cardmore.png" class="cardmore" />
			</view>
		</view>
	</view>
</template>

<script>
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	export default {
		data() {
			return {
				config: {
					title: '居委会', //title
					bgcolor: 'white', //背景颜色
					fontcolor:"rgba(51, 51, 51, 1)", //文字颜色，默认白色
					type:1, //type 1，3胶囊 2，4无胶囊模式
					transparent: false, //是否背景透明 默认白色
					linear: false, //是为开启下滑渐变
					share: false //是否将主页按钮显示为分享按钮
					// menuIcon:"../static/icon/back_.png", 当type为3或者4的时候左边的icon文件位置，注意位置与当前页面不一样
					// menuText:"返回", 当type为3或4的时候icon右边的文字
				},
				scrollTop: 0, // 当linear为true的时候需要通过onpagescroll传递参数
				scrollMaxHeight: 200, //滑动的高度限制，超过这个高度即背景全部显示
				page:1,
				page_size:10,
				total_page:0,
				list:[]
			};
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		mounted() {
			this.getmyCommitteeList()
		},
		methods:{
			customConduct(e){
				console.log(e)
			},
			goComitee(obj){
				uni.navigateTo({
					url:'/pages/update/committee?id='+obj.committee_id
				})
			},
			getmyCommitteeList(){
				this.Api.myCommitteeList({}).then((result) => {
					if(result.code == 1){
						this.list = result.data
	
					}
				})
			}
		},
		components: {
			navigationCustom
		}
	};
</script>

<style lang="scss" scoped>
	.integral{
		display: flex;
		flex-direction: column;
		.content{
			display: flex;
			flex-direction: column;
			.item{
				display: flex;
				flex-direction: row;
				align-items: center;
				padding-left:24upx;
				padding-right:24upx;
				box-sizing: border-box;
				width:100%;
				padding-top:32upx;
				padding-bottom: 32upx;
				border-bottom: 1px solid rgba(222,222,222,0.5);
				.avatar{
					width:96upx;
					height:96upx;
					border-radius: 50%;
					margin-right:16upx;
				}
				.userinfo{
					display: flex;
					flex-direction: column;
					text-align: left;
					flex:1;
					.t1{
						font-size:30rpx;
						font-family:PingFang-SC-Bold,PingFang-SC;
						font-weight:bold;
						color:rgba(51,51,51,1);
						line-height:42rpx;
					}
					.t2{
						font-size:24rpx;
						font-family:PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						color:rgba(102,102,102,1);
						line-height:34rpx;
					}
				}
				.cardmore{
					width:40upx;
					height:40upx;
				}
			}
		}
	}
</style>
