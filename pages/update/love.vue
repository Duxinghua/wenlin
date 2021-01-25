<template>
	<!-- 热心 -->
	<view class="integral">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight" />
		<view class="content">
			<view class="header">
				<view class="numwrap">
					<text>{{love}}</text>
					<image src="../../static/loveicon.png" class="jfico"></image>
				</view>
				
			</view>
			<view class="listwrap">
				<view class="listitem" v-for="(item,index) in list" :key="index" :index="index">
					<view class="listinfo">
						<text class="t1">{{item.memo}}</text>
						<text class="t2">{{item.create_time | formatTime}}</text>
					</view>
					<view class="jfinfo">
						{{item.type == 1 ? '+' : '-'}}{{item.love}}
					</view>
				</view>
				<Nodata v-if="listResult" />
			</view>
		</view>
	</view>
</template>

<script>
	import Nodata from '@/components/nodata/nodata.vue'
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	export default {
		data() {
			return {
				config: {
					title: '热心', //title
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
				pages_size:10,
				total_page:0,
				list:[
					{
					create_time: 1593958202,
					memo: "XX小区创建人",
					object_id: 52,
					object_type: 20,
					score: 1,
					type: 1,
					user_id: 2005,
					}
				],
				love:0,
				listResult:false
			};
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		mounted(){
			this.love = this.$mp.query.love 
			this.getmyLoveLog()
		},
		onReachBottom() {
			if(this.page < this.total_page){
				this.page ++ 
				this.getmyLoveLog(true)
			}
		},
		methods:{
			customConduct(e){
				console.log(e)
			},
			getmyLoveLog(ismore){
				this.Api.myLoveLog({}).then((result) => {
					if(result.code == 1){
						if(ismore){
							this.list = this.list.concat(result.data.list)
						}else{
							this.list = result.data.list
							
						}
						this.total_page = result.data.total_page
						if(this.list.length == 0){
							this.listResult = true
						}else{
							this.listResult = false
						}
					}
				})
			}
		},
		components: {
			navigationCustom,
			Nodata
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
			.header{
				height:172upx;
				display: flex;
				justify-content: center;
				align-items: center;
				border-bottom: 8upx solid #DEDEDE;
				.numwrap{
					display: flex;
					flex-direction: row;
					align-items: center;
					width:fit-content;
					text{
						font-size:56upx;
						font-family:PingFang-SC-Bold,PingFang-SC;
						font-weight:bold;
						color:rgba(51,51,51,1);
						line-height:80upx;
						margin-right:8upx;
					}
					.jfico{
						width:62upx;
						height:62upx;
					}
				}
			}
			.listwrap{
				display: flex;
				flex-direction: column;
				// padding-left:24upx;
				// padding-right:24upx;
				/deep/ .nodata{
					margin-top:400upx;
				}
				.listitem{
					height:124upx;
					padding-left:24upx;
					padding-right:24upx;
					border-bottom: 1px solid #DEDEDE;
					display: flex;
					flex-direction: row;
					.listinfo{
						display: flex;
						flex-direction: column;
						align-items: flex-start;
						justify-content: center;
						width:70%;
						.t1{
							font-size:28upx;
							font-family:PingFang-SC-Medium,PingFang-SC;
							font-weight:500;
							color:rgba(51,51,51,1);
							line-height:40upx;
						}
						.t2{
							font-size:24upx;
							font-family:PingFang-SC-Medium,PingFang-SC;
							font-weight:500;
							color:rgba(153,153,153,1);
							line-height:34upx;
						}
					}
					.jfinfo{
						margin-left:auto;
						font-size:28rpx;
						font-family:PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						color:rgba(255,156,0,1);
						line-height: 124upx;
					
					}
				}
			}
		}
	}
</style>
