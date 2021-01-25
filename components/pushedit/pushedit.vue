<template>
	<!-- 发布处理 -->
	<view class="popup popupfix" v-if="pushShow">
		<view class="mb" @click="pushclose" ></view>
		<view class="pushcatewrap">
			<!-- -->
			<button v-if="isMo" class="pushcateitem" :data-id="item.id" v-for="(item, index) in cateList" :key="index"  plain="true" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber"  >
				<image :src="item.image" />
				<text>{{ item.name }}</text>
			</button>
			<view @click="pushClick(item)"  v-if="!isMo" class="pushcateitem" :data-id="item.id" v-for="(item, index) in cateList" :key="index"   >
				<image :src="item.image" />
				<text>{{ item.name }}</text>
			</view>
			<image src="../../static/pushclose.png" class="pushclose" @click="pushclose" />
		</view>
		
	</view>
</template>

<script>
export default {
	components: {
		
	},
	props: {

	},
	data() {
		return {
			isMo:false,
			pushShow:false,
			cateList: [
				{
					id: 1,
					image: require('../../static/pushc1.png'),
					name: '曝光台'
				},
				{
					id: 2,
					image: require('../../static/pushc2.png'),
					name: '议事厅'
				},
				{
					id: 3,
					image: require('../../static/pushc3.png'),
					name: '房产'
				},
				{
					id: 4,
					image: require('../../static/pushc4.png'),
					name: '招聘'
				},
				{
					id: 5,
					image: require('../../static/pushc5.png'),
					name: '新鲜事'
				},
				{
					id: 6,
					image: require('../../static/pushc6.png'),
					name: '求助'
				},
				{
					id: 7,
					image: require('../../static/pushc7.png'),
					name: '闲置'
				},
				{
					id: 8,
					image: require('../../static/pushc8.png'),
					name: '邻里团'
				}
			]
		};
	},
	methods: {
		// 手机号授权处理
		getPhoneNumber(e) {
			if(e.mp.detail.errMsg == 'getPhoneNumber:ok'){
				var id = e.mp.currentTarget.dataset.id
					var { encryptedData, iv } = e.detail;
					this.Api.setUserPhoneBySecret({ encrypted_data: encryptedData, iv: iv }).then(result => {
						if (result.code == 1) {
							uni.setStorageSync('mobile', result.data);
							if(result.data){
								uni.navigateTo({
									url: '/pages/push/edit?type=' + id,
									success: () => {
										this.pushShow = false
										var o = uni.getStorageSync('menuIndex')
										uni.setStorageSync('o',o)
									}
								});
							}
						}
					})
			}else{
				return
			}
		},
		pushClick(obj) {
			uni.navigateTo({
				url: '/pages/push/edit?type=' + obj.id,
				success: () => {
					this.pushShow = false
					var o = uni.getStorageSync('menuIndex')
					uni.setStorageSync('o',o)
				}
			});
		},
		pushclose(){
			this.pushShow = false
			var o = uni.getStorageSync('menuIndex')
			uni.setStorageSync('o',o)
		},
		pushshow(){
			this.pushShow = true
		}
	}

};
</script>

<style lang="scss" scoped>
		.popup{
			position: fixed;
			left:0;
			top:0;
			width:100%;
			height:100%;
			z-index: 30000;
			.mb{
				position: fixed;
				left:0;
				top:0;
				width:100%;
				height:100%;
				z-index: 3001;
				background: rgba(0,0,0,0.6);
			}
			//发布样式
				.pushcatewrap {
					position: fixed;
					left: 0;
					width: 100%;
					height:572upx;
					bottom: 0;
					z-index: 6000;
					background:white;
					border-radius:24upx 24px 0px 0upx;
					padding-top:64upx;
					box-sizing: border-box;
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					align-content: flex-start;
					.pushclose{
						position: absolute;
						bottom: 68upx;
						left:50%;
						transform: translateX(-50%);
						width:41upx;
						height:41upx;
						// box-shadow:0px 12upx 20upx 0px rgba(0,0,0,0.1);
						border-radius:50%;
						
					}
					.pushcateitem {
						border: none;
						width: 25%;
						display: flex;
						flex-direction: column;
						align-items: center;
						image {
							width: 108upx;
							height: 108upx;
						}
						text {
							margin-top:12upx;
							margin-bottom: 30upx;
							font-size: 29upx;
							font-family: PingFang SC;
							font-weight: bold;
							color: #020433;
							line-height: 35upx;
						}
					}
				}
			}
			.popupfix{
				z-index: 50000;
			}
</style>
