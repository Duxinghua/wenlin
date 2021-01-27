<template>
	<view class="award">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight" />
		<view class="awardcontent">
			<image :src="imgUrl + 'bg.jpg'" class="bg"></image>
			<view class="statusText">{{ status[statusValue] }}</view>
			<view class="lottery">
				<almost-lottery
					:prize-list="prizeList"
					:ring-count="5"
					:duration="10"
					:canvas-width="canvasData.width"
					:canvas-height="canvasData.height"
					:prize-index="prizeIndex"
					@reset-index="prizeIndex = -1"
					@draw-start="handleDrawStart"
					@draw-end="handleDrawEnd"
					@finish="handleDrawFinish"
					@overHandler="overHandler"
					v-if="prizeList.length"
				/>
				<text class="almost-lottery__tip" v-if="prizeList.length == 0">奖品准备中...</text>
			</view>
			<view class="lotterywrap">
				<view class="titlewrap">
					<image src="../../static/tabimg.png" class="tabico tabic1"></image>
					<view class="titletext">
						抽奖规则
					</view>
					<image src="../../static/tabimg.png" class="tabico"></image>
				</view>
				<view class="cwrap">
				<!-- 	<view class="cwtest">1、每个用户只可参加一次抽奖；</view>
					<view class="cwtest">2、抽中奖品请在活动现场进行兑换，活动结束后概不兑
					   换，敬请谅解。
					</view> --> 
					<u-parse class="cwtest" :html="rule"></u-parse>
				</view>
				<view class="titlewrap">
					<image src="../../static/tabimg.png" class="tabico tabic1"></image>
					<view class="titletext">
						中奖记录
					</view>
					<image src="../../static/tabimg.png" class="tabico"></image>
				</view>
				<view class="userlist">
					<view class="useritem" v-for="(item,index) in userList" :key="index">
						<image :src="item.user.avatar" class="a1"></image>
						<view class="username">
							{{item.user.user_nickname}}
						</view>
						<view class="awardc">
							{{item.prize_info.prize_name}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-popup v-model="show"  mode="center" width="622" height="400" border-radius="10" >
			<view :class="['imgwrap',selectObj.status == 0 ?'imgwrapa':'']">
				<image :src="imgUrl + 'awardbg.png'" class="abg"></image>
				<u-icon name="close" color="#ffffff" size="36" @click="show = false"></u-icon>
				<view class="title" v-if="selectObj.status == 1">恭喜您抽中</view>
				<u-image v-if="selectObj.status == 1" src="https://gx.wenlinapp.com/upload/draw/20210111/b2df370abd8fb094d8b3847285a95121.png" width="134" height="134" border-radius="10"></u-image>
				<view v-if="selectObj.status == 1" class="name">{{selectObj.object.prize_name}}</view>
				<view class="titlerror" v-if="selectObj.status == 0">很遗憾没有抽中 下次再来试试～</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import AlmostLottery from '@/components/almost-lottery/almost-lottery.vue';
import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
export default {
	components: {
		navigationCustom,
		AlmostLottery
	},
	data() {
		return {
			imgUrl:this.Config.minUrl,
			config: {
				title: '活动抽奖', //title
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
			status: ['抽奖还没开始，请耐心等待', '抽奖已开启'],
			statusValue: 0,
			// canvas 宽高
			canvasData: {
				width: 240,
				height: 240
			},
			// 奖品数据
			prizeList: [],
			// 中奖下标
			prizeIndex: -1,
			// 是否正在抽奖中
			prizeing: false,
			// 中奖类目名称
			targetName: '',
			// 奖品是否设有库存
			onStock: false,
			// 是否由前端控制概率，默认不开启
			onFrontend: false,
			// 权重随机数的最大值
			weightTotal: 0,
			// 权重数组
			weightArr: [],
			draw_id:0,
			community_id:0,
			show:false,
			showObj:{},
			selectObj:null,
			rule:'',
			userList:[],
			detail:{
				"has_draw_num": 0,  //当前用户已抽奖次数
				"can_draw": 0 , //1 可抽奖（抽奖次数未用完）   0不可抽奖（抽奖次数已用完）
				 draw_num:0   //抽奖次数
			}
		};
	},
	onLoad(options) {
		
		var that = this
		var auth = new Promise(function(resolve, reject) {
			var token = uni.getStorageSync('token')
			var all_community = uni.getStorageSync('all_community')
			if(!token && !all_community){
				uni.login({
					success: res => {
						let { errMsg, code } = res;
						if (errMsg == 'login:ok') {
							that.Api.wechatAuth({ code: code }).then(result => {
								if (result.code == 1) {
									uni.setStorageSync('token', result.data.token);
									uni.setStorageSync('user', result.data.user);
									uni.setStorageSync('mobile', result.data.user.mobile);
									uni.setStorageSync('all_community', result.data.all_community.length ? result.data.all_community : []);
									resolve();
								}
							});
						}
					}
				});
			}else{
				resolve();
			}
		});
		auth.then(status => {
			var token = uni.getStorageSync('token');
			var all_community = uni.getStorageSync('all_community');

			if(options.scene){
			var scene = decodeURIComponent(options.scene);
			var arr = scene.split("=")
				if(arr[0]){
					that.draw_id = arr[1]
				}
			}
			if(options.award_id){
				that.draw_id = options.award_id || 1
			}
			var data = {
				draw_id:that.draw_id
			}
			if(!token){
				uni.setStorageSync('url','/pages/update/award?award_id='+that.draw_id)
				setTimeout(()=>{
					uni.navigateTo({
						url:'../index/index'
					})
				},100)
				return
			}
			if(!all_community){
				uni.setStorageSync('url','/pages/update/award?award_id='+that.draw_id)
				setTimeout(()=>{
					uni.navigateTo({
						url:'../index/index'
					})
				},100)
				return
			}
			that.community_id = options.community_id || uni.getStorageSync('community_id')
			that.getPrizeList();
			that.getList()
		})
		// 模拟请求奖品数据
		
	},
	onShow() {
		
	},
	methods: {
		async getList(){
			var data = {
				draw_id:this.adraw_id,
				page:1,
				page_size:10000
			}
			var result = await this.Api.drawUser(data)
			if(result.code == 1){
				this.userList = result.data.list
			}
		},
		// 重新生成
		handleInitCanvas() {
			clearCacheFile();

			this.targetName = '';
			this.prizeList = [];
			this.getPrizeList();
		},
		// 获取奖品列表
		async getPrizeList() {
			uni.showLoading({
				title: '奖品准备中...'
			});
			
			let res = await this.Api.drawDetail({draw_id:this.draw_id})
			console.log(res)
			if(res.code == 1){
				this.statusValue = res.data.status
				this.rule = res.data.rule
				this.detail = res.data
				res.data.prize_list.map((item)=>{
					item.prizeImage = item.image
					item.prizeId = item.prize_id
					item.name = item.prize_name
					item.stock = 10000
					item.weight = 0
				})
				this.prizeList = res.data.prize_list
			}
			/*
			return
			let res = await this.requestPrizeList();
			console.log('获取奖品列表', res);

			if (res.ok) {
				let data = res.data;
				if (data.length) {
					// stock 奖品库存
					// weight 中奖概率，数值越大中奖概率越高
					this.prizeList = data;

					// 如果开启了前端控制概率
					// 计算出权重的总和并生成权重数组
					// if (this.onFrontend) {
					// 	this.prizeList.forEach(item => (this.weightTotal += item.weight));
					// 	this.weightArr = this.prizeList.map(item => item.weight);
					// }
				}
			} else {
				uni.hideLoading();
				uni.showToast({
					title: '获取奖品失败'
				});
			}
			*/
		},
		overHandler(){
			this.show = true
			if(this.showObj.status == 1){
				this.getList()
			}
		},
		// 模拟请求奖品列表接口
		requestPrizeList() {
			var that = this
			return new Promise((resolve, reject) => {
				let requestTimer = setTimeout(() => {
					clearTimeout(requestTimer);
					requestTimer = null;

					resolve({
						ok: true,
						data: [
							{ prizeId: 1, name: '0.1元现金', stock: 10, weight: 0, prizeImage: that.Config.minUrl + 'committe.jpg' },
							{
								prizeId: 2,
								name: '10元现金',
								stock: 0,
								weight: 0,
								prizeImage: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/56f085e0-bcfe-11ea-b244-a9f5e5565f30.png'
							},
							{ prizeId: 3, name: '5元话费', stock: 1, weight: 0 },
							{ prizeId: 4, name: '50元现金', stock: 0, weight: 0 },
							{ prizeId: 5, name: '1卷抽纸', stock: 3, weight: 0 },
							{ prizeId: 6, name: '谢谢参与', stock: 100, weight: 0 }
						]
					});
				}, 2000);
			});
		},
		// 本次抽奖开始
		handleDrawStart() {
			if(this.detail.can_draw == 0){
				return this.$u.toast('您的抽奖次数已用完')
			}
			
			if (this.prizeing) return;
			this.prizeing = true;

			this.targetName = '';

			let list = [...this.prizeList];

			// 判断是否由前端控制概率
			// 前端控制概率的情况下，需要拿到最接近随机权重且大于随机权重的值
			// 后端控制概率的情况下，通常会直接返回 prizeId
			if (this.onFrontend) {
				/*
				if (!this.weightTotal) {
					console.warn('###当前已开启前端控制中奖概率，但是奖品数据列表中的 weight 参数似乎配置不正确###');
					return;
				}
				console.warn('###当前处于前端控制中奖概率，安全起见，强烈建议由后端控制###');
				console.log('当前权重总和为 =>', this.weightTotal);

				// 注意这里使用了 Math.ceil，如果某个权重的值为 0，则始终无法中奖
				let weight = Math.ceil(Math.random() * this.weightTotal);
				console.log('本次权重随机数 =>', weight);

				// 生成大于等于随机权重的数组
				let tempMaxArrs = [];
				list.forEach(item => {
					if (item.weight >= weight) {
						tempMaxArrs.push(item.weight);
					}
				});

				// 如果大于随机权重的数组有值，先对这个数组排序然后取值
				// 反之新建一个临时的包含所有权重的已排序数组，然后取值
				if (tempMaxArrs.length) {
					tempMaxArrs.sort((a, b) => a - b);
					this.prizeIndex = this.weightArr.indexOf(tempMaxArrs[0]);
				} else {
					let tempWeightArr = [...this.weightArr];
					tempWeightArr.sort((a, b) => a - b);
					this.prizeIndex = this.weightArr.indexOf(tempWeightArr[tempWeightArr.length - 1]);
				}

				console.log('本次抽中奖品 =>', this.prizeList[this.prizeIndex].name);

				// 如果奖品设有库存
				if (this.onStock) {
					console.log('本次奖品库存 =>', this.prizeList[this.prizeIndex].stock);
				}
				*/
			} else {
				// 模拟请求获取中奖信息
				let stoTimer = setTimeout(() => {
					clearTimeout(stoTimer);
					stoTimer = null;

					console.warn('###当前处于模拟的随机中奖概率，实际场景中，中奖概率应由后端控制###');
					// 这里随机产生的 prizeId 是模拟后端返回的 prizeId
					this.Api.gotoDraw({draw_id:this.draw_id,community_id:this.community_id}).then((result)=>{
						if(result.code == 1){
							console.log(result)
							// let prizeId = Math.floor(Math.random() * list.length + 1);
							let prizeId = result.data.object.prize_id
							for (let i = 0; i < list.length; i++) {
								let item = list[i];
								if (item.prizeId === prizeId) {
									// 中奖下标
									this.prizeIndex = i;
									this.selectObj = result.data
									this.$forceUpdate()
									break;
								}
							}
							this.getPrizeList()
							this.showObj = result.data
					
						}
					})
		

					// console.log('本次抽中奖品 =>', this.prizeList[this.prizeIndex].name);

					// 如果奖品设有库存
					// if (this.onStock) {
					// 	console.log('本次奖品库存 =>', this.prizeList[this.prizeIndex].stock);
					// }
				}, 500);
			}
		},
		// 本次抽奖结束
		handleDrawEnd() {
			this.prizeing = false;

			// 旋转结束后，可以执行拿到结果后的逻辑
			let prizeName = this.prizeList[this.prizeIndex].name;

			if (this.onStock) {
				let prizeStock = this.prizeList[this.prizeIndex].stock;
				this.targetName = prizeName === '谢谢参与' ? prizeName : prizeStock ? `恭喜您，获得 ${prizeName}` : '很抱歉，您来晚了，当前奖品已无库存';
			}

			this.targetName = prizeName === '谢谢参与' ? prizeName : `恭喜您，获得 ${prizeName}`;
		},
		// 抽奖转盘绘制完成
		handleDrawFinish(res) {
			console.log('抽奖转盘绘制完成', res);

			uni.showToast({
				title: res.msg,
				duration: 2000,
				mask: true,
				icon: 'none'
			});
		}
	},
	onUnload() {
		uni.hideLoading();
	}
};
</script>

<style lang="scss" scoped>
$wheelBgUrl: '~static/almost-lottery/almost-lottery__bg';
.award {
	display: flex;
	flex-direction: column;
	.awardcontent {
		width: 100%;
		height: 1488rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		z-index: 300;
		.bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 1488rpx;
			z-index: -1;
		}
		.statusText {
			width: 485rpx;
			height: 64rpx;
			border: 1px solid #ffffff;
			border-radius: 32rpx;
			line-height: 64rpx;
			text-align: center;
			font-size: 33rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #ffffff;
			margin-top: 60rpx;
		}
		.lottery{
			margin-top:80rpx;
			height:600rpx;
		}
		.lotterywrap{
			width: 701rpx;
			height: 607rpx;
			background: #FEFCFA;
			border-radius: 20rpx;
			margin:0 auto;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding:28rpx;
			box-sizing: border-box;
			.titlewrap{
				display: flex;
				flex-direction: row;
				align-items: center;
				height:40rpx;
				.tabico{
					width:84rpx;
					height:30rpx;
				}
				.tabic1{
						transform: rotate(180deg);
				}
				.titletext{
					margin-left:20rpx;
					margin-right:20rpx;
					font-size: 44rpx;
					font-family: PingFang SC;
					font-weight: bold;
					color: #F66436;
				}
			}
			.cwrap{
				font-size: 26rpx;
				font-family: PingFang SC;
				font-weight: 400;
				color: #020433;
				margin-top:20rpx;
				margin-bottom: 30rpx;
				text-align: left;
				width: 100%;
				height: 100rpx;
				overflow-y: auto;
			}
			.userlist{
				width:100%;
				height:300rpx;
				margin-top:auto;
				overflow-y: auto;
				overflow-x: hidden;
				.useritem{
					display: flex;
					flex-direction: row;
					align-items: center;
					margin-bottom: 20rpx;
					.a1{
						width:68rpx;
						height:68rpx;
						border-radius: 50%;
					}
					.username{
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						width:180rpx;
						font-size: 24rpx;
						font-family: PingFang SC;
						font-weight: bold;
						color: #020433;
						margin-left:20rpx;
					}
					.awardc{
						flex:1;
						margin-left:20rpx;
						font-size: 26rpx;
						font-family: PingFang SC;
						font-weight: 400;
						color: #F66537;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
			}
		}
		
	}
	.imgwrap{
		width:100%;
		height:100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		.abg{
			position: absolute;
			left:0;
			top:0;
			width:100%;
			height:100%;
			z-index: -1;
		}
		/deep/ .u-icon{
			position: absolute;
			right:30rpx;
			top:30rpx;
		}
		/deep/ .u-image{
			margin-top:50rpx;
		}
		.title{
			font-size: 36rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #FEFCFA;
			margin-top:57rpx;
		}
		.name{
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: #FEFCFA;
			margin-top:20rpx;
		}
		.titlerror{
			font-size: 36rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #FEFCFA;
			line-height: 48rpx;
			width:260rpx;
		}
	}
	.imgwrapa{
		justify-content: center;
	}
}
</style>
