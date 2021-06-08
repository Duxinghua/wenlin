<template>
	<!-- 居委会 -->
	<view class="personalcard">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight" />
		<view class="pcontent">
			<view class="somelist">
				<view class="someitem" v-for="(item, index) in dynamics" :key="index" @click="postDetail(item)">
					<text class="sometype">[{{item.type | listValue}}]</text>
					<text class="sometitle">{{ item.title }}</text>
					<text class="sometime">{{ item.create_time | formatTimeMd }}</text>
				</view>
				
			</view>
			<Nodata v-if="nodatashow"></Nodata>
		</view>
	</view>
</template>

<script>
import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
import Nodata from '../../components/nodata/nodata.vue'
export default {
	data() {
		return {
			config: {
				title: '居委会动态列表', //title
				bgcolor: 'white', //背景颜色
				fontcolor: 'rgba(51, 51, 51, 1)', //文字颜色，默认白色
				type: 1, //type 1，3胶囊 2，4无胶囊模式
				transparent: false, //是否背景透明 默认白色
				linear: false, //是为开启下滑渐变
				share: false //是否将主页按钮显示为分享按钮
				// menuIcon:"../static/icon/back_.png", 当type为3或者4的时候左边的icon文件位置，注意位置与当前页面不一样
				// menuText:"返回", 当type为3或4的时候icon右边的文字
			},
			scrollTop: 0, // 当linear为true的时候需要通过onpagescroll传递参数
			scrollMaxHeight: 200, //滑动的高度限制，超过这个高度即背景全部显示
			indicatorDots: true,
			autoplay: true,
			interval: 2000,
			duration: 500,
			dynamics: [],
			page: 1,
			page_size: 10,
			total_pages: 0,
			type:0,
			nodatashow:false
		};
	},
	onLoad(options) {
		if(options.type){
			this.type = options.type
		}
		if(options.title){
			this.config.title = options.title+'列表'
		}
		this.getList();
	},
	mounted() {
		
	},
	methods: {
		// postDetail(pitem){
		// 	var type = pitem.type
		// 	var publish_type = pitem.publish_type //2为居委会 3小区
		// 	if(type == 5 && publish_type == 2){
		// 		uni.navigateTo({
		// 			url:'/pages/index/cdetail?dynamics_id='+pitem.id+'&type='+pitem.type+'&id='+pitem.object_id
		// 		})
		// 	}else{
		// 		if( type == 7 || type == 8){
		// 			uni.navigateTo({
		// 				url:'/pages/index/detail?dynamics_id='+pitem.id+'&type='+pitem.type+'&id='+pitem.object_id
		// 			})
					
		// 		}else{
		// 			uni.navigateTo({
		// 				url:'/pages/index/detail?id='+pitem.id+'&type='+pitem.type
		// 			})
		// 		}
		// 	}
		// },
		postDetail(pitem){
			console.log(pitem)
			var type = pitem.type
			var publish_type = pitem.publish_type //2为居委会 3小区
			if(type == 5){
				uni.navigateTo({
					url:'/pages/index/cdetail?dynamics_id='+pitem.id+'&type='+pitem.type+'&id='+pitem.object_id
				})
			}else{
				if( type == 7 || type == 8){
					uni.navigateTo({
						url:'/pages/index/detail?dynamics_id='+pitem.wiki_id+'&type='+pitem.type+'&id='+pitem.object_id
					})
					
				}else{
					uni.navigateTo({
						url:'/pages/index/detail?id='+pitem.wiki_id+'&type='+pitem.type
					})
				}
			}
		},
		getList(ismore) {
			var data = {
				page: this.page,
				page_size: this.page_size,
				committee_id: uni.getStorageSync('committee_id')
			};
			if(this.type != 0){
				data.type = this.type
			}
			this.Api.committeeDynamics(data).then(result => {
				if (ismore) {
					var res = result.data.list;
					this.total_pages = result.data.total_pages;

					this.dynamics = this.dynamics.concat(res);
				} else {
					var res = result.data.list;
					this.total_pages = result.data.total_pages;
					this.dynamics = res;
				}
				if(this.dynamics.length){
					this.nodatashow = false
				}else{
					this.nodatashow = true
				}
			});
		}
	},
	onReachBottom() {
		console.log(1, 'ss', this.total_pages, this.page);
		if (this.page < this.total_pages) {
			this.page++;
			this.getList(true);
		}
	},
	components: {
		navigationCustom,
		Nodata
	}
};
</script>

<style lang="scss" scoped>
page {
	background: white !important;
}
.personalcard {
	display: flex;
	flex-direction: column;
	background: whtie !important;
	min-height: 100vh;
	padding-bottom: 320upx;
	.pcontent {
		padding: 24upx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		/deep/ .nodata{
			margin-top:400rpx;
		}
		.somelist {
			display: flex;
			flex-direction: column;
			.someitem {
				display: flex;
				flex-direction: row;
				align-items: center;
				font-size: 28upx;
				font-family: PingFang-SC-Bold, PingFang-SC;
				font-weight: bold;
				line-height: 40upx;
				padding-top: 32upx;
				padding-bottom: 32upx;
				border-bottom: 1px solid rgba(222, 222, 222, 0.5);
				.sometype {
					margin-right: 5upx;
					max-width: 350rpx;
					white-space: nowrap;
					color: rgba(255, 156, 0, 1);
				}
				.sometitle {
					font-weight: 500;
					color: rgba(51, 51, 51, 1);
					width: 450upx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.sometime {
					margin-left: auto;
					font-size: 26upx;
					font-family: PingFang-SC-Medium, PingFang-SC;
					font-weight: 500;
					color: rgba(153, 153, 153, 1);
					line-height: 36upx;
				}
			}
		}
	}
}
</style>
