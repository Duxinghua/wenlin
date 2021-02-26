<template>
	<view class="answer">
		<image :src="imgUrl + 'task.png'" class="bg"></image>
		<image  :src="imgUrl + 'result.png'" class="taskbg" ></image>
		<view class="taskbgc">
			<view class="text">
				你的成绩为：{{count}}分 
			</view>
			<view class="text">
				达到该成绩用时：{{time}}秒
			</view>
			<view class="btn1" @click="todo(1)" v-if="count >= 90">
				赶紧去抽奖 >
			</view>
			<view class="btn2" @click="todo(2)">
				返回首页 >
			</view>
		</view>
		<image :src="imgUrl + 'good.png'" class="good" v-if="count == 90"></image>
		<image :src="imgUrl + 'overico.png'" class="good" v-if="count != 90"></image>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				imgUrl:this.Config.minUrl,
				detail:{},
					answer_id:0,
					content:'',
					type:'ts',
					interval:3000,
					duration:500,
					indicatorDots:true,
					timestamp: 86400,
					asklist:[],
					list:[],
					currentIndex:0,
					count:0,
					time:0,
					draw_id:0
				
			}
		},
		async onLoad(options){
			this.count = options.count
			this.time = options.time
			this.answer_id = options.answer_id
			this.content = decodeURIComponent(options.content)
			this.draw_id = options.draw_id
			var data = {
				answer_id:this.answer_id,
				take_time:this.time,
				score:this.count,
				community_id:uni.getStorageSync('community_id'),
				content:this.content
			}
			var result = await this.Api.questionAnswer(data)
			if(result.code == 1){
				
			}
		},
		
		methods:{
			todo(index){
					if(index == 2){
						uni.redirectTo({
							url:'../index/index'
						})
					}
					if(index == 1){
						uni.redirectTo({
							url:'award?award_id='+this.draw_id
						})
					}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.answer{
		display: flex;
		flex-direction: column;
		position: relative;
		.bg{
			position: absolute;
			left:0;
			top:0;
			width:100%;
			height: 1624rpx;
			z-index: 100;
		}
		.time{
			position: absolute;
			left:50%;
			width: fit-content;
			top:230rpx;
			z-index: 300;
			transform: translateX(-50%);
		}
		.good{
			position: fixed;
			width:618rpx;
			height:474rpx;
			top:290rpx;
			left:50%;
			transform: translateX(-50%);
			z-index: 103;
		}
		.taskbg{
			position: fixed;
			width: 690rpx;
			height: 915rpx;
			background: #FFFFFF;
			// border: 6rpx solid #F8E2B6;
			// box-shadow: 0px 10rpx 0px 0px #F56334;
			border-radius: 30rpx;
			left:50%;
			transform: translateX(-50%);
			top: 440rpx;
			z-index: 101;
		}
		
		.taskbgc{
			position: fixed;
			width: 690rpx;
			height: 915rpx;
			background: #FFFFFF;
			// border: 6rpx solid #F8E2B6;
			// box-shadow: 0px 10rpx 0px 0px #F56334;
			border-radius: 30rpx;
			left:50%;
			transform: translateX(-50%);
			top: 440rpx;
			z-index: 102;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding-top:350rpx;
			.text{
				font-size: 33rpx;
				font-family: PingFang SC;
				font-weight: 800;
				color: #4E5191;
				line-height: 57rpx;
			}
			.text:nth-child(2n){
				margin-bottom: 40rpx;
			}
			.btn1{
				width: 570rpx;
				height: 120rpx;
				background: linear-gradient(90deg, #FC6786, #FF415B);
				border-radius: 60rpx;
				line-height: 120rpx;
				text-align: center;
				color:white;
				margin-top:41rpx;

			}
			.btn2{
				width: 570rpx;
				height: 120rpx;
				background: linear-gradient(90deg, #FDAB1B, #FA892D);
				border-radius: 60rpx;
				line-height: 120rpx;
				text-align: center;
				color:white;
				margin-top:41rpx;
			}
		}
		.swiperwrap{
			width:500rpx;
			height:500rpx;
			background: red;
		}
		
		.taskcontent{
			position: fixed;
			width:690rpx;
			height: 1076rpx;
			left:50%;
			transform: translateX(-50%);
			top: 274rpx;
			z-index: 102;
			display: flex;
			flex-direction: column;
			.titlewrap{
				display: flex;
				flex-direction: row;
				align-items: center;
				margin-top:49rpx;
				.tleft{
					width: 200rpx;
					height:70rpx;
					position: relative;
					z-index: 31;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 34rpx;
					font-family: PingFang SC;
					font-weight: bold;
					color: #FFFFFF;
					.tbg{
						position: absolute;
						left:0;
						top:0;
						width:200rpx;
						height:70rpx;
						z-index: -1;
					}
					.tnumber{
						position: absolute;
						left:50%;
						top:50%;
						z-index: 32;
						transform: translate(-50%,-50%);
					}
				}
				.tsimg{
					width: 167rpx;
					height: 62rpx;
					margin-right:33rpx;
					margin-left:auto;
				}
			}
			.askt{
				font-size: 40rpx;
				font-family: PingFang SC;
				font-weight: 800;
				color: #4E5191;
				line-height: 60rpx;
				padding:0 40rpx;
				box-sizing: border-box;
			}
			.asklist{
				display: flex;
				flex-direction: column;
				padding:0 40rpx;
				box-sizing: border-box;
				.askitem{
					margin-top:16rpx;
					margin-bottom: 16rpx;
					width:100%;
					height: 120rpx;
					line-height: 120rpx;
					text-align: center;
					background: #F2F2F2;
					border-radius: 60rpx;
					padding:0 30rpx;
					font-size: 33rpx;
					font-family: PingFang SC;
					font-weight: 800;
					color: #4E5191;
					box-sizing: border-box;
					// overflow: hidden;
					// text-overflow: ellipsis;
					// white-space: nowrap;
					position: relative;
				}
				.askcheck{
					color:white;
					background: linear-gradient(90deg, #FDAB1B, #FA892D);
				}
				.error{
					color:white;
					background: linear-gradient(90deg, #FC6786, #FF415B);
				}
				.ok{
					position: absolute;
					right:30rpx;
					top:50%;
					width:60rpx;
					height:60rpx;
					transform: translateY(-50%);
				}
			
			}
		}
		
		

	}
</style>
