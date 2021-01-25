<template>
	<view class="personal">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight" />
		<view class="content">
			<view class="personalitem">
				<text class="label">
					昵称
				</text>
				<text class="text">
				{{detail.user_nickname}}
				</text>
			</view>
			<view class="personalitem">
				<text class="label">
					楼栋号
				</text>
				<text class="text">
					{{detail.building}}#
				</text>
			</view>
			<view class="personalitem">
				<text class="label">
					单元号
				</text>
				<text class="text">
					{{detail.unit}}#
				</text>
			</view>
			<view class="personalitem">
				<text class="label">
					门牌号
				</text>
				<text class="text">
					{{detail.room}}#
				</text>
			</view>
			<view class="personalitem">
				<text class="label">
					身份
				</text>
				<text class="text">
					{{detail.type_text}}
				</text>
			</view>
			<view class="personalitem">
				<text class="label">
					手机号
				</text>
				<text class="text">
					{{detail.mobile}}
				</text>
			</view>
			<view class="personalitem">
				<text class="label">
					车牌号
				</text>
				<input type="text" class="textinput" v-model="detail.car_num" placeholder-style="color:#000" placeholder="输入车牌号" />	
			</view>
			<view class="personalitem" @click="chooseImage">
				<text class="label">
					上传附件
				</text>
				<text class="textinput">
					身份证明文件
				</text>
				<image src="../../static/upload.png" class="upload"></image>
			</view>
			<view class="imgwrap">
					<view class="imgitem"  v-for="(item,index) in uploadList" :key="index"  v-if="uploadList.length">
						<image src="../../static/imguploaddel.png" class="uploadclose" @click="uploadDel(index)" />
						<image :src="item.http_url"></image>
					</view>
			</view>
			<view class="submitbtn" @click="submitHandler">更新</view>
		</view>
		
	</view>
</template>

<script>
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	export default {
		data() {
			return {
				config: {
					title: '个人资料', //title
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
				detail:{},
				picker: [{
					value:1,
					label:'业主'},
					{
					value:2,
					label:'亲友'
					},
					{
					value:3,
					label:'租客'
					}
				],
				uploadList:[]
			};
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		mounted() {
			this.getDetail()
		},
		methods:{
			customConduct(e){
				console.log(e)
			},
			getDetail(){
				var data = {
					community_id:uni.getStorageSync('community_id')
				}
				this.Api.myinfo(data).then((result) => {
					if(result.code == 1){
						this.detail = result.data
						var imgs = []
						if(result.data.idcard_imgs){
							var s = result.data.idcard_imgs.split(",")
							s.map((item) => {
								var obj = {http_url:item,url:item.replace(/https\:\/\/sq\.wenlinapp.com\/upload\//,'')}
								imgs.push(obj)
							})
							this.uploadList = imgs
						}
						this.picker.map((item) => {
							if(item.value == this.detail.type){
								this.detail.type_text = item.label
							}
						})
					}
				})
			},
			//上传图片处理
			chooseImage(){
				var that = this
				uni.chooseImage({
						count: 9 - this.uploadList.length, // 默认9
						sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
						sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
						success: function(res) {
							// 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
							// goods.localIds = res.localIds
							// _this.asyncUploadImage(goodsindex)
							var s = res.tempFilePaths
							s.map((item)=>{
								that.Api.uploadOne(item).then((result)=>{
									if(result.code == 1){
										console.log(result.data)
										that.uploadList.push(result.data)
									}
								})
							})
						}
					})
			},
			//图片处理
			uploadDel(e){
				this.uploadList.splice(e,1)
			},
			submitHandler(){
				var imgs = []
				this.uploadList.map((item) => {
					imgs.push(item.url)
				})
				var data = {
					car_num:this.detail.car_num,
					idcard_imgs:imgs.join(",")
				}
				this.Api.updateUserInfo(data).then((result) => {
					if(result.code == 1){
						uni.showToast({
							icon:'success',
							title:result.msg,
							duration:2000,
							success: () => {
								this.getDetail()
							}
						})
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
	.personal{
		display: flex;
		flex-direction: column;
		.content{
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			padding-left:24upx;
			padding-right:24upx;
			box-sizing: border-box;
			.personalitem{
				height:104upx;
				display: flex;
				flex-direction: row;
				align-items: center;
				border-bottom: 1px solid #DEDEDE;
				.label{
					width:120upx;
					text-align: right;
					font-size:28upx;
					margin-right:24upx;
					font-family:PingFang-SC-Medium,PingFang-SC;
					font-weight:500;
					color:rgba(51,51,51,1);
				}
				.text{
					font-size:28upx;
					font-family:PingFang-SC-Bold,PingFang-SC;
					font-weight:bold;
					color:#999999;
				}
				.textinput{
					color:rgba(51,51,51,1);
					width:calc(100% - 150upx);
					font-size:28upx;
					font-family:PingFang-SC-Bold,PingFang-SC;
					font-weight:bold;
				}
				.upload{
					margin-left:auto;
					width:60upx;
					height:58upx;
				}
			}
			.imgwrap{
				display: flex;
				flex-direction: row;
				flex-wrap:wrap;
				margin-top:24upx;
				.imgitem{
					width:176upx;
					height:176upx;
					position: relative;
					z-index: 1;
					margin-right:16upx;
					margin-bottom: 16upx;
					image{
						width:100%;
						height:100%;
						position: absolute;
						left:0;
						top:0;
						z-index: 2;
					}
					.uploadclose{
						position: absolute;
						left:136upx;
						top:0;
						width:40upx;
						z-index: 3;
						height:40upx;
					}
				}
				.imgupload{
					width:176upx;
					height:176upx;
					display: flex;
					justify-content: center;
					align-items: center;
					background: #DEDEDE;
					border-radius: 12upx;
					.imgjia{
						width:52upx;
						height:52upx;
					}
				}
			}
			.submitbtn{
				position: fixed;
				left:24upx;
				bottom: 32upx;
				font-size: 36upx;
				line-height: 80upx;
				text-align: center;
				color:white;
				width:702upx;
				height:80upx;
				background:rgba(255,156,0,1);
				box-shadow:0px 8px 16px 0px rgba(225,138,0,0.1);
				border-radius:40px;
			}
		}

	}
</style>
