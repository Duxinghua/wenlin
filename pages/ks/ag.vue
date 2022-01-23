<template>
	<view class="setup">
		<navigation-custom :config="config" :scrollTop="scrollTop"  :home="false" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight"/>
		<view class="form-wrap form-wrap-fix form-bg">
			<u-section title="共同居住人信息" font-size="36" line-color="#0F75E7" color="#020433"  :right="false"></u-section>
			<view class="upload" v-if="false">
					<u-upload :custom-btn="true" maxCount="1" :header="headerObj" :action="action" :file-list="fileList" @on-success="uploadImg" @on-remove="removeImg">
						<view slot="addBtn" class="addBtn">
							<image src="https://sq.wenlinapp.com/upload/dynamics/20220123/23b67ff6e045558b6efa32daec73a2c8_thumb.png"></image>
						</view>
						
					</u-upload>
			</view>
			<view class="form-item first-item-wrap ">
				<view class="label">
					姓名
				</view>
				<u-input v-model="username" placeholder="请输入姓名" type="text"  :custom-style="communityCs"   :border="true" />

			</view>
			<view class="form-item first-item-wrap ">
				<view class="label">
					联系方式
				</view>
				<u-input v-model="mobile"  type="number" placeholder="请输入联系方式"  :custom-style="communityCs"  :border="true" />
			
			</view>
			<view class="form-item first-item-wrap">
				<view class="label">
					关系
				</view>
				<u-input v-model="relationship"  placeholder="请输入关系" :custom-style="communityCs" type="text" :border="true" />
			
			</view>
			<view class="form-item first-item-wrap">
				<view class="label">
					身份证
				</view>
				<u-input v-model="idcard" type="idcard"  placeholder="请输入身份证" :custom-style="communityCs" :border="true" />
			</view>
		</view>
		<view class="submit" @click="otherUserInfo">
			{{id? '修改' : '确定'}}
		</view>
	</view>
</template>

<script>
	import {baseURL,appid} from '../../utils/config.js'
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	export default {
		components:{
			navigationCustom
		},
		data(){
			return{
				headerObj:{
					'XX-Device-Type':'wxapp',
					'XX-Token':'',
					'XX-Wxapp-AppId':''
				},
				id:'',
				fileList:[],
				uploadList:'',
				action:baseURL+'/api/community/upload/one',
				idcard:'',
				relationship:'',
				mobile:'',
				username:'',
				community_name:'',
				community_id:'',
				building:'',
				building_detail:'',
				buildCs:{
					width:'190rpx'
				},
				communityCs:{
					width:'434rpx'
				},
				communityCs1:{
					width:'270rpx'
				},
				communityCs2:{
					width:'260rpx'
				},
				config: {
					title: '添加代打卡共同居住人', //title
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
				scrollMaxHeight: 200 ,//滑动的高度限制，超过这个高度即背景全部显示
			}
		},
		onLoad(options) {
			this.headerObj['XX-Token'] = uni.getStorageSync('token')
			this.headerObj['XX-Wxapp-AppId'] = appid
			if(options.id){
				this.config.title = '修改代打卡共同居住人'
				this.id = options.id
				this.Api.getUserinfo({id:this.id}).then((result) => {
					if(result.code == 1){
						this.mobile = result.data.mobile
						this.username = result.data.username
						this.idcard = result.data.idcard
						this.relationship = result.data.relationship
					}
				})
			}
		},
		methods:{
			uploadImg(e){
				if(e.code == 1){
					this.uploadList = e.data.http_url
				}
			},
			removeImg(e){
				this.uploadList = ''
			},
			otherUserInfo(){
				var data = {}
				if(this.username.length == 0){
					return this.$u.toast('请输入姓名')
				}else{
					data.username = this.username
				}
				if(this.mobile.length == 0){
					return this.$u.toast('请输入手机号')
				}else{
					if(this.$u.test.mobile(this.mobile)){
						data.mobile = this.mobile
					}else{
						return this.$u.toast('请输入正确的手机号')
					}
				}
				if(this.idcard.length == 0){
					return this.$u.toast('请输入身份证号')
				}else{
					if(this.$u.test.idCard(this.idcard)){
						data.idcard = this.idcard
					}else{
						return this.$u.toast('请输入正确的身份证号')
					}
				}
				if(this.relationship.length == 0){
					return this.$u.toast('请输入关系')
				}else{
					data.relationship = this.relationship
				}
				if(this.uploadList.length){
					data.avatar = this.uploadList
				}
				if(new String(this.id).toString().length == 0){
					this.Api.otherUserInfo(data).then((result) => {
						if(result.code == 1){
							this.$u.toast('添加成功')
							setTimeout(() =>{
								uni.navigateBack({
									delta:1
								})
							},1000)
						}else{
							return this.$u.toast(result.msg)
						}
					})
				}else{
					data.id = this.id
					this.Api.editUserinfo(data).then((result) => {
						if(result.code == 1){
							this.$u.toast('修改成功')
							setTimeout(() =>{
								uni.navigateBack({
									delta:1
								})
							},1000)
						}else{
							return this.$u.toast(result.msg)
						}
					})
				}
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	page{
		background: #F7F9FF;
	}
	.setup{
		width: 100%;
		height:100vh;
		display: flex;
		flex-direction: column;
		background: #F7F9FF;
		.banner{
			width: 100%;
			margin-bottom: 36rpx;
		}
		.form-wrap{
			width:100%;
			display: flex;
			flex-direction: column;
			padding: 0 20rpx;
			box-sizing: border-box;
		}
		.form-item{
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-around;
			padding:0 42rpx;
			box-sizing: border-box;
			.label{
				font-size: 32rpx;
				font-weight: 500;
				margin-right: 17rpx;
				color: #020433;
				width:123rpx;
				white-space: nowrap;
				text-align: left;
			}
			/deep/ .u-input{
				border: 1rpx solid #404B69;
			}
			/deep/ .u-input__input{
				height:61rpx;
			}
			.button{
				width: 148rpx;
				height: 71rpx;
				background: #0F75E7;
				border-radius: 10rpx;
				font-size: 28rpx;
				line-height: 71rpx;
				text-align: center;
				font-weight: 400;
				color: #FFFFFF;
			}
		}
		.first-item-wrap{
			margin-top: 30rpx;
		}
		.form-wrap-fix{
			position: relative;
			padding-top:20rpx;
			box-sizing: border-box;
		}
		.upload{
			position: absolute;
			top:74rpx;
			right:66rpx;
			width: 165rpx;
			height: 165rpx;
			.addBtn{
				position: absolute;
				left:0;
				top:0;
				width: 165rpx;
				height: 165rpx;
				border-radius: 10rpx;
				overflow: hidden;
				image{
					width: 165rpx;
					height: 165rpx;
				}
			}
			/deep/ .u-upload{
				position: absolute;
				left:0;
				top:0;
				width: 100%;
				height:100%;
			}
			/deep/ .u-list-item{
				width: 160rpx!important;
				height: 160rpx!important;
			}
		}
		.widthfix{
			width: calc(100% - 180rpx);
		}
		.tow-item-wrap{
			margin-top: 20rpx;
			padding-bottom:45rpx;
			box-sizing: border-box;
			justify-content: space-between;
			border-bottom: 10rpx solid #F7F9FF;
		}
		.second{
			padding-top:42rpx;
			box-sizing: border-box;
		}
		.submit{
			width: 670rpx;
			height: 99rpx;
			background: #0F75E7;
			border-radius: 10rpx;
			margin:auto auto 50rpx auto;
			font-size: 38rpx;
			line-height: 99rpx;
			text-align: center;
			font-weight: bold;
			color: #FFFFFF
		}
		.form-bg{
			background: white;
			padding-bottom: 40rpx;
			box-sizing: border-box;
		}
	}
</style>
