<template>
	<view>
		<view class="cu-custom" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar fixed" :style="style" :class="[bgImage!=''?'none-bg text-white bg-img':'',bgColor]">
				<view class="action" >

				</view>
				<view class="contentf" :style="[{top:StatusBar + 'px'}]">
				<!-- 	<slot name="content"></slot> -->
					<view class="menu">
						<text  class="select-menu" @tap="BackPage">{{communityMenu}}</text>
						<view v-if="allCommunity.length > 1"  :class="['down-up',isShow ? 'down-down' : '']"></view>
						<scroll-view @scroll="bindscrollf" scroll-y="true"   class="down-menu" v-if="isShow" @tap="BackPages">
							<view hover-class="down-li-hover" :class="[activeIndex == item.community_id ? 'down-li-hover' : '' ]" @tap="scallCommunity(item)" v-for="(item,index) in allCommunity" :key="index">{{item.title+' ('+item.total+')'}}</view>
							
							<!-- <text class="xt" :style="{top:scrollTopText+'px'}"></text> -->
						</scroll-view>
					</view>
				</view>
				<slot name="right"></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				shows:false,
				scrollTopText: 0,
				activeIndex:''
			};
		},
		name: 'cu-custom',
		computed: {
			style() {
				var StatusBar= this.StatusBar;
				var CustomBar= this.CustomBar;
				var bgImage = this.bgImage;
				var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
				if (this.bgImage) {
					style = `${style}background-image:url(${bgImage});`;
				}
				return style
			}
		},
		props: {
			bgColor: {
				type: String,
				default: ''
			},
			isBack: {
				type: [Boolean, String],
				default: false
			},
			bgImage: {
				type: String,
				default: ''
			},
			isShow: {
				type: [Boolean, String],
				default: false
			},
			communityMenu:{
				type:String
			},
			allCommunity:{
				type:Array
			}
		},
		mounted() {
			this.activeIndex = uni.getStorageSync('community_id')
		},
		methods: {
			scallCommunity(e){
				this.$emit('scallCommunity',e)
			},
			bindscrollf(e) {
				console.log(e)
				this.scrollTopText = e.detail.scrollTop
			},
			BackPage() {
				// uni.navigateBack({
				// 	delta: 1
				// });
				this.$emit('shows',true)
			},
			BackPages() {
				this.$emit('hides',true)
			},
			test() {
				this.$emit('change', {
					show: false
				})
			},
			abcd(){
				this.shows = true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.menu{
		position: relative;
		width:100%;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		.select-menu{
			font-size: 36upx;
			font-weight: bold;
			color:#333;
			// width:calc(100% - 40upx);
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.down-up{
			width:0;
			height:0;
			border-right:14rpx solid transparent;
			border-left:14rpx solid transparent;
			border-top:16rpx solid #404B69;
			margin-left:10rpx;
			transform:rotate(0deg);
			transition: transform 500ms;
		}
		.down-down{
			transform:rotate(180deg);
			transition: transform 500ms;
		}
		.down-menu{
			position: absolute;
			top:50upx;
			width:310upx;
			min-height:120upx;
			background:rgba(255,255,255,1);
			box-shadow:0px 8upx 16upx 0upx rgba(0,0,0,0.1);
			border-radius:16upx;
			overflow-y: scroll;
			overflow-x: hidden;
			display: -webkit-box;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			padding:10upx 30upx;
			box-sizing: border-box;
			// padding-top:15upx;
			// padding-bottom: 20upx;
			box-sizing: border-box;
				.xt{
					position: absolute;
					top:0;
					right:0;
					width:6upx;
					height:35upx;
					background:#999999;
				}
			view{
				color:#666666;
				line-height: 60upx;
				font-size: 28upx;
				display: inline-block;
				width:100%;
				text-align: left;
				font-weight: 600;
				height:60upx;
				position: relative;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.down-li-hover{
				color:#FF9C00!important;
			}
			.down-li-hover::after{
				position: absolute;
				content:'';
				top:50%;
				transform: translateY(-50%);
				right:0;
				width:6upx;
				height:35upx;
				// background:#999999;
			}
		}
		
	}

</style>
