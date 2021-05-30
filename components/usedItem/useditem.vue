<template>
	<!-- 闲置 -->
	<view :class="['usedItem',autoRight ? 'useditemfix' : '']" @click="goDetail">
		<view  class="usedimg" >
			<u-image :src="autoImage" :height="autoHeight" mode="aspectFill"  v-if="pitem.images.length"></u-image>
		</view>
<!-- 		<image class="usedimg" :src="autoImage" mode="aspectFill" v-if="pitem.images.length"></image> -->
		<view class="imgnodata" v-if="pitem.images.length == 0">
			<image class="nodatai" :src="imgUrl + 'sellnodata.png'" />
			<text class="nodataix">暂无图片</text>
		</view>
		<text class="usedtitle">{{pitem.content}}</text>
		<view class="usedprice">
			<view class="info">
				<text class="infotype">{{pitem.sell_type | sellType}}</text>
<!-- 				<text>￥{{pitem.sell_type == 2 ? 0 : pitem.sell_price}}</text> -->
				<text  v-if="pitem.sell_type != 4">￥{{ pitem.sell_type == 2 ? 0 : pitem.sell_price == -1 ? '面议' : pitem.sell_price }}</text>
				<text  v-if="pitem.sell_type == 4">{{ pitem.exchange_goods ? "物品："+ pitem.exchange_goods : "积分："+pitem.exchange_score }}</text>
			</view>
			<view class="infotime">{{pitem.create_time | formatTimeMd}}</view>
		</view>
		<view class="usedavtar" v-if="avatar">
	<!-- 		<image :src="pitem.user.avatar" class="userimg"></image> -->
			<view class="userimg" >
				<u-image :src="pitem.user.avatar" :height="avatarHeight" mode="aspectFill"></u-image>
			</view>
			<text class="usertext">{{pitem.user.user_nickname}}·{{ucommunityid == pitem.user.community_id ? pitem.user.building+'#' : pitem.user.community_name}}</text>
			<text class="userjuli">{{pitem.juli}}</text>
		</view>
	</view>
</template>

<script>
	export default{
		data () {
			return {
				imgUrl:this.Config.minUrl,
				ucommunityid:uni.getStorageSync('community_id')
			}
		},
		props:{
			usedIndex: {
				type: Number
			},
			pitem:{
				type: Object
			},
			avatar: {
				type: Boolean,
				default: true
			}
		},
		computed:{
			autoRight(){
				if((this.usedIndex+1) % 2 == 0){
					return true
				}else{
					return false
				}
			},
			autoImage(){
				return this.pitem.images.length ? this.pitem.images[0] :  this.imgUrl + 'sellnodata.png'
			},
			autoHeight(){
				return 344
			},
			avatarHeight(){
				return 48
			}
		},
		methods:{
			goDetail(){
				if(!uni.getStorageSync('token')){
					this.$emit('toLogin')
					return
				}else{
					if(!uni.getStorageSync('community_id')){
						this.$emit('toLogin')
						return
					}
				}
				if(this.pitem.opening == 1){
					uni.navigateTo({
						url:'/pages/index/detail?id='+this.pitem.object_id+'&type='+this.pitem.type
					})
				}else{
					if(this.pitem.community_id == uni.getStorageSync('community_id')){
						uni.navigateTo({
							url:'/pages/index/detail?id='+this.pitem.object_id+'&type='+this.pitem.type
						})
					}else{
						uni.showToast({
							icon:'none',
							title:'本条闲置信息仅限本小区用户可见',
							duration:2000
						})
						return
					}

				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.usedItem {
	display: flex;
	flex-direction: column;
	width: 344upx;
	margin-top: 28upx;
	margin-bottom: 28upx;
	margin-right: 14upx;
	margin-left: 28upx;
	float: left;
	.usedimg {
		width: 344upx;
		height: 344upx;
		margin-bottom: 24upx;
		border-radius: 16upx;
		overflow: hidden;
	}
	.imgnodata{
		width: 344upx;
		height: 344upx;
		margin-bottom: 24upx;
		border-radius: 16upx;
		background:#FAFAFA;
		position: relative;
		overflow: hidden;
		z-index: 10;
		.nodatai{
			width:calc(344upx * 0.75);
			height:calc(344upx * 0.75);
			position:absolute ;
			left:50%;
			top:100%;
			transform: translate(-50%, -100%);
			z-index: 11;
		}
		.nodataix{
			font-size: 28upx;
			color:#666666;
			position:absolute ;
			left:50%;
			top:65%;
			transform: translate(-50%, -65%);
			z-index: 12;
		}
	}
	.usedimgFix{
		background:#FAFAFA;
	}
	.usedtitle {
		font-size: 28upx;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		text-align: left;
		line-height: 40upx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		// display: -webkit-box;
		// -webkit-line-clamp: 1;
		// -webkit-box-orient: vertical;
		margin-bottom: 20upx;
	}
	.usedprice {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 12upx;
		.info {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			min-width: 144upx;
			height: 40upx;
			font-size: 28upx;
			font-weight: bold;
			color: rgba(255, 156, 0, 1);
			background: rgba(255, 156, 0, 0.1);
			line-height: 40upx;
			.infotype {
				padding-right: 10upx;
				margin-right: 10upx;
				position: relative;
			}
			.infotype::after {
				content: '';
				top: 50%;
				transform: translateY(-50%);
				position: absolute;
				right: -5upx;
				width: 4upx;
				height: 70%;
				background-color: rgba(255, 156, 0, 1);
			}
		}
		.infotime {
			font-size: 24upx;
			font-family: PingFang-SC-Medium, PingFang-SC;
			font-weight: 500;
			color: rgba(153, 153, 153, 1);
			line-height: 40upx;
			margin-left: auto;
		}
	}
	.usedavtar {
		display: flex;
		flex-direction: row;
		align-items: center;
		.userimg {
			width: 48upx;
			height: 48upx;
			margin-right: 8upx;
			border-radius: 50%;
			overflow: hidden;
		}
		.usertext {
			font-size: 24upx;
			font-family: PingFang-SC-Medium, PingFang-SC;
			font-weight: 500;
			color: rgba(153, 153, 153, 1);
			line-height: 34upx;
			width: calc(100% - 180upx);
			overflow: hidden;
			display: inline-block;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.userjuli {
			font-size: 24upx;
			font-family: PingFang-SC-Medium, PingFang-SC;
			font-weight: 500;
			color: rgba(153, 153, 153, 1);
			line-height: 34upx;
			margin-left: auto;
		}
	}
}
.useditemfix{
	margin-right:0px;
	margin-left:0px;
}
</style>
