<template>
	<view class="map">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight" />
		<view class="page-map">
			<map style="width: 100%; height: 100%;" :latitude="latitude" :longitude="longitude" :markers="covers"></map>
		</view>
		<view class="addressinfo">
			<text class="t1">{{detail.title}}</text>
			<text class="t2">{{detail.address}}</text>
			<text class="t3">工作时间：{{detail.business_time}}</text>
			<view class="t4">
				<text>联系电话：</text>
				<text>{{detail.contacts}}</text>
			</view>
		</view>
	</view>
</template>

<script>
import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
export default {
	components:{
		navigationCustom
	},
	data() {
		return {
			id: 0, // 使用 marker点击事件 需要填写id
			title: 'map',
			latitude: 0,
			longitude: 0,
			covers: [
				{
					latitude: 0,
					longitude: 0,
					iconPath: '../../static/mappos.png'
				}
			],
			config: {
				title: '居委会', //title
				bgcolor: 'white', //背景颜色
				fontcolor: 'rgba(51, 51, 51, 1)', //文字颜色，默认白色
				type: 1, //type 1，3胶囊 2，4无胶囊模式
				transparent: false, //是否背景透明 默认白色
				linear: true, //是为开启下滑渐变
				share: false //是否将主页按钮显示为分享按钮
				// menuIcon:"../static/icon/back_.png", 当type为3或者4的时候左边的icon文件位置，注意位置与当前页面不一样
				// menuText:"返回", 当type为3或4的时候icon右边的文字
			},
			scrollTop: 0, // 当linear为true的时候需要通过onpagescroll传递参数
			scrollMaxHeight: 200, //滑动的高度限制，超过这个高度即背景全部显示
			detail: {}
		};
	},
	onShareAppMessage: function() {
			return {
				title: this.detail.title,
				imageUrl: this.detail.images && this.detail.images.length ? this.detail.images[0] : 'https://sq.wenlinapp.com/appimg/send54.png'
			};
	},
	onShareTimeline(e) {
		var title = this.detail.title;
		var query = Object.assign({},this.detail)
		// query=JSON.stringify(query);
		return {
			title: title,
			imageUrl: this.detail.images && this.detail.images.length ? this.detail.images[0] : 'https://sq.wenlinapp.com/appimg/send54.png',
			query: query
		};
	},
	mounted() {
		if(this.$mp.query.data){
			// this.data = JSON.parse(this.$mp.query.data)
			this.detail = JSON.parse(this.$mp.query.data)
			this.latitude = parseFloat(this.detail.latitude)
			this.longitude = parseFloat(this.detail.longitude)
			var res = {
				latitude: this.latitude,
				longitude: this.longitude,
				iconPath: '../../static/mappos.png'
			}
			console.log(res)
			this.covers = []
			this.covers.push(res)
			this.$forceUpdate()
		}
		if(this.$mp.query.title){
			this.config.title = this.$mp.query.title
		}
		
	},
	methods: {

	}
	
};
</script>

<style lang="scss" scoped>
	.map{
		display: flex;
		flex-direction: column;
		.page-map{
			margin-top:24upx;
			width:100%;
			height:800upx;
		}
		.addressinfo{
			padding:46upx 24upx 0 24upx;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			.t1{
				height:42upx;
				font-size:30upx;
				font-family:PingFang-SC-Bold,PingFang-SC;
				font-weight:bold;
				color:rgba(51,51,51,1);
				line-height:42upx;
			}
			.t2{
				height:36upx;
				font-size:26upx;
				font-family:PingFang-SC-Bold,PingFang-SC;
				font-weight:bold;
				color:rgba(51,51,51,1);
				line-height:36upx;
				margin-top:8upx;
			}
			.t3{
				height:36upx;
				font-size:26upx;
				font-family:PingFang-SC-Medium,PingFang-SC;
				font-weight:500;
				color:rgba(51,51,51,1);
				line-height:36upx;
				margin-top:24upx;
			}
			.t4{
				height:36upx;
				font-size:26upx;
				font-family:PingFang-SC-Medium,PingFang-SC;
				font-weight:500;
				color:rgba(51,51,51,1);
				line-height:36upx;
				margin-top:8upx;
				text:last-child{
					color:rgba(255, 156, 0, 1)
				}
			}
		}
	}
	
</style>
