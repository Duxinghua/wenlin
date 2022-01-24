<template>
	<view class="setup">
		<navigation-custom :config="config" :scrollTop="scrollTop" :home="false" flag="setup"  @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight"/>
		<image mode="widthFix" src="https://sq.wenlinapp.com/upload/dynamics/20220123/7a4d82c42ddf21a26f98866d25d7c5fc_thumb.png" class="banner"></image>
		<view class="form-wrap">
			<u-section title="住址信息" font-size="36" line-color="#0F75E7" color="#020433"  :right="false"></u-section>
			<view class="form-item first-item-wrap" v-if="uid.length == 0">
				<view class="label">
					所在小区
				</view>
				<u-input v-model="community_name"   placeholder="选择小区" @click="cshow = true"   :custom-style="communityCs" :type="type" :border="true" />

			</view>
			<view class="form-item tow-item-wrap " @click="rshow = true">
				<view class="label">
					所在楼栋
				</view>
				<u-input v-model="building" @click="rshow = true" :custom-style="buildCs"	:type="type" :border="true" placeholder="单元楼栋" />
				<u-input v-model="building_detail" @click="rshow = true"  :custom-style="buildCs" :type="type" :border="true"  placeholder="门牌号"  />
			</view>
			<view class="second">
				<u-section title="本人身份信息" font-size="36" line-color="#0F75E7" color="#020433"  :right="false"></u-section>
			</view>
			<view class="form-item first-item-wrap">
				<view class="label">
					姓名
				</view>
				<u-input v-model="username"  placeholder="请输入姓名" :custom-style="communityCs2" type="text" :border="true" />
			
			</view>
			<view class="form-item first-item-wrap">
				<view class="label">
					身份证
				</view>
				<u-input v-model="idcard"  placeholder="请输入身份证" :custom-style="communityCs2" type="text" :border="true" />
			</view>
			<view class="form-item first-item-wrap">
				<view class="label">
					联系电话
				</view>
				<u-input v-model="mobile"  placeholder="请输入联系电话" :custom-style="communityCs1" type="text" :border="true" />
				<button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" class="button">
					自动填写
				</button>
			</view>
		</view>
		<view class="submit" @click="addUserInfo">
			{{uid ? '修改' : '下一步'}}
		</view>
		<u-select v-model="cshow"  mode="single-column" :list="clist" @confirm="confirmc"></u-select>
		<u-select v-model="rshow" mode="mutil-column-auto" :list="rlist" @confirm="confirmr"></u-select>
	</view>
</template>

<script>
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	export default {
		components:{
			navigationCustom
		},
		data(){
			return{
				uid:'',
				code:'',
				cshow:false,
				clist:[],
				rshow:false,
				rlist:[],
				type:'select',
				idcard:'',
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
					width:'470rpx'
				},
				communityCs2:{
					width:'500rpx'
				},
				communityCs1:{
					width:'350rpx'
				},
				config: {
					title: '添加身份信息', //title
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
			if(options.id){
				this.community_id = options.id
				this.getCommunityBuilding()
			}
			if(options.uid){
				this.uid = options.uid
				this.config.title = '修改身份信息'
				this.getUserinfo()
			}
			this.getNucleicAcidCommunity()
			var that = this
			uni.login({
				success(res) {
					that.code = res.code
				}
			})
		},///
		methods:{
			getUserinfo(){
				this.Api.getUserinfo({id:this.uid}).then((result) => {
					if(result.code == 1){
						this.building = result.data.building
						this.building_detail =  result.data.building_detail
						this.mobile = result.data.mobile
						this.username = result.data.username
						this.idcard = result.data.idcard
						this.community_id = result.data.community_id || 10
						if(this.community_id){
							var data = {
								community_id:this.community_id
							}
							this.Api.getCommunityBuilding(data).then((result) => {
								if(result.code == 1){
									if(result.data.length == 0){
										return this.$u.toast('暂无小区可登记')
									}
									result.data.map((item) => {
										item.name = new String(item.name).toString()
										item.value = item.name
										item.label = item.name
										if(item.detail){
											item.children = item.detail
											if(item.children){
												item.children.map((sitem) => {
													sitem.name = new String(sitem.name).toString()
													sitem.value = sitem.name
													sitem.label = sitem.name
												})
											}else{
												item.children = []
											}
										}else{
											item.children = []
										}
									})
									
									this.rlist = result.data
								}
							})
						}
					}
				})
			},
			getNucleicAcidCommunity(){
				this.Api.getNucleicAcidCommunity({}).then((result) => {
					if(result.code == 1){
						result.data.map((item) => {
							item.value = item.community_id
							item.label = item.title
							if(item.value == this.community_id){
								this.community_id = item.value
								this.community_name = item.label
							}
						})
						this.clist = result.data
					}
				})
			},
			confirmc(e){
				var obj = e[0]
				this.community_id = obj.value
				this.community_name = obj.label
				this.getCommunityBuilding()
				this.$forceUpdate()
			},
			confirmr(e){
				var obj = Object.assign([],e)
				this.building = obj[0]['value']
				this.building_detail = obj[1]['value']
			},
			getCommunityBuilding(){
				var data = {
					community_id:this.community_id
				}
				this.Api.getCommunityBuilding(data).then((result) => {
					if(result.code == 1){
						if(result.data.length == 0){
							return this.$u.toast('暂无小区可登记')
						}
						result.data.map((item) => {
							item.name = new String(item.name).toString()
							item.value = item.name
							item.label = item.name
							if(item.detail){
								item.children = item.detail
								if(item.children){
									item.children.map((sitem) => {
										sitem.name = new String(sitem.name).toString()
										sitem.value = sitem.name
										sitem.label = sitem.name
									})
								}else{
									item.children = []
								}
							}else{
								item.children = []
							}
						})
						
						this.building = ''
						this.building_detail = ''
						this.rlist = result.data
					}
				})
			},
			getPhoneNumber(e){
				var {encryptedData,iv} = e.detail
				var data = {
					code:this.code,
					iv:iv,
					encrypted_data:encryptedData
				}
				this.Api.setUserPhoneBySecret(data).then((result) => {
					if(result.code == 1){
						this.mobile = result.data
					}
				})
			},
			addUserInfo(){
				var data = {}
				if(new String(this.community_id).toString().length == 0){
					this.$u.toast('请选择小区')
					return
				}else{
					data.community_id = this.community_id
				}
				if(this.building.length == 0){
					return this.$u.toast('请选择楼栋信息')
				}else{
					data.building = this.building
				}
				if(this.building_detail.length == 0){
					return this.$u.toast('请选择楼栋信息')
				}else{
					data.building_detail = this.building_detail
				}
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
					return this.$u.toast('请输入身份证')
				}else{
					if(this.$u.test.idCard(this.idcard)){
						data.idcard = this.idcard
					}else{
						return this.$u.toast('请输入正确的身份证')
					}
				}
				if(new String(this.uid).toString().length == 0){
					this.Api.addUserInfo(data).then((res) => {
						if(res.code == 1){
							this.$u.toast('设置成功')
							setTimeout(() => {
								uni.redirectTo({
									url:'dk'
								})
							},1000)
			
						}else{
							return this.$u.toast(res.msg)
						}
					})
				}else{
					data.id = this.uid
					this.Api.editUserinfo(data).then((res) => {
						if(res.code == 1){
							this.$u.toast('修改成功')
							setTimeout(() => {
								uni.redirectTo({
									url:'dk'
								})
							},1000)
									
						}else{
							return this.$u.toast(res.msg)
						}
					})
				}
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	page{
		background: white;
	}
	.setup{
		width: 100%;
		height:100vh;
		display: flex;
		flex-direction: column;
		/deep/ .u-select__header__btn{
			font-size: 34rpx;
			font-weight: bold;
		}
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
			width: 710rpx;
			padding-left: 20rpx;
			box-sizing: border-box;
			margin:0 auto;
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
		.fixs	/deep/ .u-input__input{
				height:61rpx;
				// color:blue;
				// font-size: 36rpx;
				// font-weight: bold;
		}
		.first-item-wrap{
			margin-top: 20rpx;
		}
		.tow-item-wrap{
			margin-top: 20rpx;
			padding-bottom:45rpx;
			padding-left:20rpx;
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
	}
</style>
