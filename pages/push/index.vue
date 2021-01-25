<template>
	<view class="push">
		<!-- 			<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight"/>
 -->
		<view class="popup">
			<view class="mb"></view>
			<view class="pushcatewrap">
				<view class="pushcateitem" v-for="(item, index) in cateList" :key="index" @click="pushClick(item)">
					<image :src="item.image" />
					<text>{{ item.name }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
export default {
	data() {
		return {
			cateList: [
				{
					id: 1,
					image: require('../../static/cate1.png'),
					name: '求助'
				},
				{
					id: 2,
					image: require('../../static/cate2.png'),
					name: '新鲜事'
				},
				{
					id: 3,
					image: require('../../static/cate3.png'),
					name: '闲置'
				},
				{
					id: 4,
					image: require('../../static/cate1.png'),
					name: '鹊桥'
				},
				{
					id: 6,
					image: require('../../static/cate1.png'),
					name: '达人'
				}
			]
		};
	},

	mounted() {
		if (!uni.getStorageSync('community_id')) {
			uni.showToast({
				title: '请设置小区',
				duration: 2000
			});
			return;
		}
	},
	methods: {
		pushClick(obj) {
			uni.navigateTo({
				url: '/pages/push/edit?type=' + obj.id
			});
		}
	},
	components: {
		navigationCustom
	}
};
</script>

<style lang="scss" scoped>
page {
	background: whtie;
}
.push {
	display: flex;
	flex-direction: column;
	background: white;
	min-height: 100vh;
	.content {
		display: flex;
		flex-direction: column;
		padding: 24upx;
		box-sizing: border-box;
		padding-bottom: 190upx;
		.nav-type {
			font-size: 36upx;
			font-family: PingFang-SC-Bold, PingFang-SC;
			font-weight: bold;
			color: rgba(51, 51, 51, 1);
			line-height: 50upx;
			margin-bottom: 20upx;
		}
		.nav {
			padding-bottom: 20upx;
			border-bottom: 1px solid rgba(222, 222, 222, 0.5);
			.nav-item {
				width: fit-content;
				padding-left: 20upx;
				padding-right: 20upx;
				line-height: 42upx !important;
				height: 42upx;
				background: rgba(222, 222, 222, 0.5);
				border-radius: 21upx;
			}
			.nav-active {
				background: rgba(255, 156, 0, 0.1);
				color: #ff9c00;
			}
		}
		.input-title {
			height: 98upx;
			font-size: 36upx;
			font-family: PingFang-SC-Bold, PingFang-SC;
			font-weight: bold;
			color: rgba(153, 153, 153, 1);
			line-height: 98upx;
			border-bottom: 1px solid rgba(222, 222, 222, 0.5);
		}
		.contentwrap {
			min-height: 441upx;
			padding-bottom: 32upx;
			padding-tip: 32upx;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			border-bottom: 1px solid rgba(222, 222, 222, 0.5);
			margin-top: 32upx;
			.servercontent {
				min-height: 200upx;
				font-size: 30upx;
				font-family: PingFang-SC-Medium, PingFang-SC;
				font-weight: 500;
				color: rgba(153, 153, 153, 1);
				line-height: 42upx;
			}
			.imgwrap {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				.imgitem {
					width: 176upx;
					height: 176upx;
					position: relative;
					z-index: 1;
					margin-right: 16upx;
					margin-bottom: 16upx;
					image {
						width: 100%;
						height: 100%;
						position: absolute;
						left: 0;
						top: 0;
						z-index: 2;
					}
					.uploadclose {
						position: absolute;
						left: 126upx;
						top: 0;
						width: 50upx;
						z-index: 3;
						height: 50upx;
					}
				}
				.imgupload {
					width: 176upx;
					height: 176upx;
					display: flex;
					justify-content: center;
					align-items: center;
					background: #dedede;
					border-radius: 12upx;
					.imgjia {
						width: 52upx;
						height: 52upx;
					}
				}
			}
		}
		.radiowrap {
			display: flex;
			width: 100%;
			flex-direction: row;
			justify-content: space-between;
			height: 90upx;
			border-bottom: 2upx solid rgba(222, 222, 222, 0.5);
			.radioitem {
				display: flex;
				flex-direction: row;
				align-items: center;
				.radiot2 {
					font-size: 28upx;
					font-family: PingFang-SC-Medium, PingFang-SC;
					font-weight: 500;
					color: rgba(51, 51, 51, 1);
					line-height: 40upx;
					margin-right: 16upx;
				}
				.label-image {
					width: 60upx;
					height: 60upx;
					margin-right: 48upx;
				}
				.label-image-fix {
					margin-right: -12upx;
				}
			}
		}
		.pricewrap {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			height: 90upx;
			border-bottom: 2upx solid rgba(222, 222, 222, 0.5);
			.label {
				font-size: 28upx;
				font-family: PingFang-SC-Medium, PingFang-SC;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
			}
			.pricetype {
				display: flex;
				flex-direction: row;
				align-items: center;
				text {
					font-size: 30upx;
					font-family: PingFang-SC-Bold, PingFang-SC;
					font-weight: bold;
					color: rgba(255, 156, 0, 1);
				}
				.pricearrow {
					width: 30upx;
					height: 30upx;
					transform: rotate(180deg);
				}
			}
		}
		.contentinfo {
			display: flex;
			flex-direction: column;
			border-bottom: 2upx solid rgba(222, 222, 222, 0.5);
			margin-top: 32upx;
			.label {
				font-size: 30upx;
				font-family: PingFang-SC-Bold, PingFang-SC;
				font-weight: bold;
				color: rgba(51, 51, 51, 1);
				line-height: 42upx;
				margin-bottom: 10upx;
			}
			.inputwrap {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				margin-left: 56upx;
				width: calc(100% - 56upx);
				height: 84upx;
				border-bottom: 2upx solid red;
				border-bottom: 2upx solid rgba(222, 222, 222, 0.5);
				.label-text {
					width: 102upx;
					font-size: 26upx;
					font-family: PingFang-SC-Medium, PingFang-SC;
					font-weight: 500;
					color: rgba(51, 51, 51, 1);
					line-height: 84upx;
				}
				.label-input {
					flex: 1;
					font-size: 26upx;
					font-family: PingFang-SC-Medium, PingFang-SC;
					font-weight: 500;
					color: rgba(153, 153, 153, 0.5);
					line-height: 84upx;
					height: 84upx;
				}
				.label-image {
					width: 60upx;
					height: 60upx;
				}
			}
			.inputwrap::last-child {
				border-bottom: 2upx solid transparent;
			}
		}
	}
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 30;
		.mb {
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 31;
			background: rgba(0, 0, 0, 0.5);
		}
		.pushcatewrap {
			position: fixed;
			left: 0;
			width: 100%;
			bottom: 284upx;
			z-index: 32;
			display: flex;
			flex-direction: row;

			.pushcateitem {
				width: 20%;
				display: flex;
				flex-direction: column;
				align-items: center;
				image {
					width: 80upx;
					height: 80upx;
				}
				text {
					font-size: 26upx;
					font-family: PingFang-SC-Bold, PingFang-SC;
					font-weight: bold;
					color: rgba(255, 255, 255, 1);
					line-height: 36upx;
					height: 36upx;
					margin-top: 16upx;
				}
			}
		}
		.addlike {
			position: fixed;
			padding: 0 24upx;
			box-sizing: border-box;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			z-index: 32;
			left: 0;
			top: 50%;
			width: 100%;
			height: 100upx;
			background: rgba(255, 255, 255, 1);
			box-shadow: 0px 12upx 20upx 0px rgba(0, 0, 0, 0.1);
			.addlikeinput {
				width: 600upx;
				height: 60upx;
				background: rgba(234, 234, 234, 0.3);
				border-radius: 32upx;
				padding-left: 24upx;
			}
			.addlikelength {
				position: absolute;
				right: 150upx;
				top: 50%;
				transform: translateY(-50%);
				font-size: 24upx;
				font-family: PingFang-SC-Medium, PingFang-SC;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
			}
			.addlikebtn {
				font-size: 30upx;
				font-family: PingFang-SC-Medium, PingFang-SC;
				font-weight: 500;
				color: rgba(255, 156, 0, 0.5);
			}
		}
		.priceinput {
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 840upx;
			z-index: 3002;
			background: white;
			border-radius: 16px 16px 0px 0px;
			padding: 16upx 0;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			.inputwrap {
				display: flex;
				flex-direction: row;
				height: 90upx;
				line-height: 90upx;
				margin-left: 24upx;
				margin-right: 24upx;
				box-sizing: border-box;
				border-bottom: 2upx solid rgba(222, 222, 222, 0.6);
				.pricetitle {
					width: 110upx;
					font-size: 30upx;
					font-family: PingFang-SC-Medium, PingFang-SC;
					font-weight: 500;
					color: rgba(51, 51, 51, 1);
					line-height: 90upx;
				}
				.pricevalue {
					font-size: 36upx;
					font-family: PingFang-SC-Bold, PingFang-SC;
					font-weight: bold;
					color: rgba(51, 51, 51, 1);
					line-height: 90upx;
				}
				.pricevalue1 {
					font-size: 30upx;
					font-family: PingFang-SC-Medium, PingFang-SC;
					font-weight: 500;
					color: rgba(51, 51, 51, 1);
				}
				.pricevalue2 {
					font-size: 30upx;
					font-family: PingFang-SC-Medium, PingFang-SC;
					font-weight: 500;
					color: rgba(153, 153, 153, 1);
				}
				.express {
					display: flex;
					flex-direction: row;
					align-items: center;
					margin-left: auto;
					.express-image {
						width: 64upx;
						height: 64upx;
						margin-right: 10upx;
					}
					.express-text {
						font-size: 30upx;
						font-family: PingFang-SC-Medium, PingFang-SC;
						font-weight: 500;
						color: rgba(102, 102, 102, 1);
					}
				}
			}
			.inputwrap:last-child {
				border-bottom: 2upx solid transparent;
			}
			.keywordwrap {
				display: flex;
				flex-direction: column;
				.keywordtop {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					width: 100%;
					.numberwrip {
						display: flex;
						flex-direction: row;
						flex-wrap: wrap;
						height: 212upx;
						width: 558upx;
						border-top: 2upx solid rgba(222, 222, 222, 0.6);
						.number {
							font-size: 40upx;
							font-family: PingFang-SC-Bold, PingFang-SC;
							font-weight: bold;
							color: rgba(51, 51, 51, 1);
							display: flex;
							justify-content: center;
							text-align: center;
							width: 186upx;
							height: 106upx;
							line-height: 106upx;
							border-right: 2upx solid rgba(222, 222, 222, 0.6);
							border-bottom: 2upx solid rgba(222, 222, 222, 0.6);
						}
						.number_txt {
							font-size: 32upx;
						}
						.number_back {
							display: flex;
							justify-content: center;
							align-items: center;
							.keywordclose {
								width: 60upx;
								height: 60upx;
							}
						}
					}
					.close {
						width: calc(100% - 558upx);
						height: 212upx;
						display: flex;
						justify-content: center;
						align-items: center;
						border-bottom: 2upx solid rgba(222, 222, 222, 0.6);
						.keywordclose {
							width: 60upx;
							height: 60upx;
						}
					}
					.close_text {
						font-size: 32upx;
						font-family: PingFang-SC-Bold, PingFang-SC;
						font-weight: bold;
						color: rgba(255, 255, 255, 1);
						background: rgba(255, 156, 0, 1);
					}
				}
			}
		}
	}
	.regedit {
		width: 702upx;
		height: 80upx;
		background: rgba(255, 156, 0, 1);
		font-size: 32upx;
		font-family: PingFang-SC-Bold, PingFang-SC;
		font-weight: bold;
		color: rgba(255, 255, 255, 1);
		line-height: 80upx;
		letter-spacing: 8px;
		box-sizing: border-box;
		text-align: center;
		border-radius: 20upx;
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		bottom: 30upx;
	}
}
</style>
