<template>
	<view class="setvote">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight"/>
		<view class="content">
			<view class="title">
				选项内容最多50个字，请缩短内容
			</view>
			<view class="inputwrap"  v-for="(item,index) in textareaList" :key="index" :index="index">
				<u-input v-model="item.vote_title" height="146" maxlength="50" placeholder="选项" type="textarea" :border="true" border-color="#404B69" />
				<view class="delete" @click="deleteHandler(index)">
					
				</view>
			</view>
			<view class="adbtn" @click.stop="addHandler">
				<u-icon name="plus" color="#404B69" size="48"></u-icon>
			</view>
			<view class="btn" @click.stop="saveHandler">
				提交
			</view>
		</view>
	</view>
</template>

<script>
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	export default{
		components:{
			navigationCustom
		},
		data(){
			return{
				config: {
					title: '设置投票', //title
					bgcolor: 'white', //背景颜色
					fontcolor:"rgba(51, 51, 51, 1)",//文字颜色，默认白色
					type: 1, //type 1，3胶囊 2，4无胶囊模式
					transparent: false, //是否背景透明 默认白色
					linear: false, //是为开启下滑渐变
					share: false //是否将主页按钮显示为分享按钮
					// menuIcon:"../static/icon/back_.png", 当type为3或者4的时候左边的icon文件位置，注意位置与当前页面不一样
					// menuText:"返回", 当type为3或4的时候icon右边的文字
				},
				scrollTop: 0, // 当linear为true的时候需要通过onpagescroll传递参数
				scrollMaxHeight: 200 ,//滑动的高度限制，超过这个高度即背景全部显示
				textareaList:[
					{vote_title:''}
				]
			}
		},
		onLoad() {
			var vote = uni.getStorageSync('voteobj')
			if(vote){
				vote = JSON.parse(vote)
				this.textareaList = vote
			}
		},
		methods:{
			addHandler(){
				var a = 0
				this.textareaList.map((item)=>{
					if(!item.vote_title){
						a++
					}
				})
				if(a > 0){
					return this.$u.toast('请先填写选项中的内容')
				}
				this.textareaList.push({
					vote_title:''
				})
				this.$forceUpdate()
			},
			deleteHandler(index){
				this.textareaList.splice(index,1)
			},
			saveHandler(){
				var a = 0
				this.textareaList.map((item)=>{
					if(!item.vote_title){
						a++
					}
				})
				if(a > 0){
					return this.$u.toast('请先填写选项中的内容')
				}
				uni.setStorageSync('voteobj',JSON.stringify(this.textareaList))
				uni.navigateBack({})
			}
		}
		
	}
</script>

<style lang="scss" scoped>
	.setvote{
		display: flex;
		flex-direction: column;
		width:100%;
		min-height: 100vh;
		background: white;
		.content{
			padding:48upx;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			.title{
				font-size: 24upx;
				font-family: PingFang SC;
				font-weight: 400;
				color: #ED3269;
				line-height: 36upx;
				margin-bottom: 20upx;
			}
			.inputwrap{
				display: flex;
				flex-direction: row;
				align-items: center;
				.delete{
					width: 39rpx;
					height: 39rpx;
					border-radius: 50%;
					border:1rpx solid #FF9C00;
					position: relative;
					margin-left:30rpx;
				}
				.delete:after{
					position: absolute;
					content:'';
					left:50%;
					top: 50%;
					transform: translate(-50%,-50%);
					width:20rpx;
					height: 1rpx;
					background: #FF9C00;
				}
			}
			/deep/ .u-input{
				margin-bottom: 20upx;
				width: 580rpx;
				margin-right: auto;
			}
			.adbtn{
				width: 100%;
				height: 146upx;
				background: rgba(255, 156, 0, 0);
				border: 1px solid #404B69;
				border-radius: 10upx;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.btn{
				width: 654upx;
				height: 100upx;
				background: linear-gradient(44deg, #FEAA0E, #FFC000);
				border-radius: 12upx 12px 12px 12px;
				line-height: 100upx;
				text-align: center;
				position: fixed;
				left:50%;
				transform: translateX(-50%);
				bottom: 120upx;
				font-size: 38upx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #FFFFFF;
			}
		}
	}
</style>
