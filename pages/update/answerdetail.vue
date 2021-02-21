<template>
	<view class="answer">
		<image :src="imgUrl + 'task.png'" class="bg"></image>
		<image  :src="imgUrl + 'taskc.png'" class="taskbg" ></image>
		<view class="time">
		<u-count-down :timestamp="timestamp" @change="timeChange" :show-days="false" :show-hours="false"  bg-color="transparen" separator-color="white" color="white"></u-count-down>
		</view>
<!-- 		<swiper :indicator-dots="true"
		class="taskcontent"
		@change="change"
		:autoplay="false"  indicator-color="red" :interval="interval" :duration="duration"> -->
		        	
<!-- swiper-item  v-for="(item,index) in list[currentIndex]" :key="index"-->
		          <view class="taskcontent" >
					   <view class="titlewrap">
						<view class="tleft">
							<image src="../../static/sumbg.png" class="tbg"></image>
							<view class="tnumber">
								{{currentIndex+1}}/{{list.length}}
							</view>
						</view>
						<image src="../../static/ts.png" v-if="detail.type == 1" class="tsimg"></image>
						<image src="../../static/tm.png"  v-if="detail.type == 2" class="tsimg"></image>
					   </view>
					   <view class="askt">
						 {{detail.title}}
					   </view>
					   <view class="asklist">
						   <view :class="['askitem',
						   sitem.check && sitem.check == sitem.answer && detail.type == 1 ? 'askcheck' : (sitem.check && sitem.check != sitem.answer && detail.type == 1 ? 'error' : ''),
						   sitem.check && detail.type == 2 ? 'askcheck' :  '',
						   sitem.check && detail.type == 2 && sitem.check == sitem.answer && next ? 'askcheck' : (((sitem.check && sitem.check != sitem.answer && detail.type == 2  && next) || (!sitem.check &&  sitem.answer && detail.type == 2  && next)) ? 'error' : '')
						   ]" 
						   @click.stop="checkHandler(sitem)" 
						   v-for="(sitem,sindex) in detail.ask" :key="sindex" :index="sindex">
								{{sitem.value}}
								<image src="../../static/ok.png" class="ok" v-if="(sitem.check && sitem.check == sitem.answer && next) || (sitem.check && sitem.check == sitem.answer && detail.type == 1)"></image>
								<image src="../../static/error.png" class="ok" v-if="(sitem.check && sitem.check != sitem.answer && next) || (!sitem.check && sitem.answer && next && detail.type == 2)"></image>
						   </view>
					   </view>
					   <view class="btnsx" >
						   <view class="btn-c confirmbtn"  v-if="confirm" @click="confirmHandler">
							   确定
						   </view>
						   <view class="btn-c confirmbtn" v-if="next" @click="nextHandler">
						   		{{list.length == currentIndex+1 ? '完成' : '下一题'}}
						   </view>
					   </view>
		          </view>
		
<!-- 		      </swiper> -->

	</view>
</template>

<script>
	export default{
		data(){
			return {
				imgUrl:this.Config.minUrl,
				detail:{},
					answer_id:0,
					type:'ts',
					interval:3000,
					duration:500,
					indicatorDots:true,
					timestamp: 0,
					list:[],
					currentIndex:0,
					count:0,
					time:0,
					content:null,
					confirm:false,
					next:false
				
			}
		},
		onLoad(options){
			this.answer_id = options.answer_id || 1
			this.getList()
		},
		methods:{
			async getList(){
				var result = await this.Api.questionList({answer_id:this.answer_id})
				if(result.code == 1){
					result.data.list.map((item)=>{
						item.ask = []
						Object.keys(item.content).map((s)=>{
							if(item.type == 1){
								item.ask.push({
									key:s,
									value:item.content[s],
									check:false,
									answer:item.answer == s ? true : false
								})
							}else if(item.type == 2){
									item.ask.push({
										key:s,
										value:item.content[s],
										check:false,
										answer: new String(item.answer).toString().indexOf(s) > -1 ? true : false
									})
							}
						})
					})
					this.list = result.data.list
					this.detail = this.list[0]
					if(this.detail.type == 1){
						this.confirm = false
					}else if(this.detail.type == 2){
						this.confirm = true
					}
					this.timestamp = result.data.total_time
					this.draw_id = result.data.detail.draw_id
				}
			},
			timeChange(e){
			
				this.time = this.timestamp - e
				
				if(e <= 0 ){
					this.calc()
					return
				}
			},
			change(e){
				var type = this.list[this.currentIndex].type
				var value = 0
				var currentIndex = e.detail.current
				this.currentIndex = currentIndex
				this.list[this.currentIndex].ask.map((item)=>{
					if(item.check){
						value ++ 
					}
			
				})
				if(type == 1){

					this.confirm = false

					if(value != 1){
						this.currentIndex = currentIndex - 1
						return this.$u.toast('请选择一个答案')
					}
				}else if(type == 2){
					this.confirm = true
					if(value == 0){
						this.currentIndex = currentIndex - 1
						return this.$u.toast('请选择一个答案')
					}
				}
			},
			calc(){
				var count = 0
				var content = {}
				this.list.map((item,index)=>{
					if(item.type == 1){
					
						var c = 0
						var o = 0
						item.ask.map((sitem)=>{
							if(sitem.check){
								content[index+1]=sitem.key
								c++
								if(item.answer == sitem.key){
									o = 1
								}
							}
						})
						if(c == 1 && o == 1){
							count += item.score
							// this.list[this.currentIndex]
						}
					}
					if(item.type == 2){
						var c = 0
						var o = 0
						var l=item.answer.split(",").length
						var askarr = []
						item.ask.map((sitem)=>{
							if(sitem.check){
								c++
								askarr.push(sitem.key)
							}
							if(sitem.check == sitem.answer && sitem.check == true){
								o++
							}
						})
						content[index+1]=askarr.join(',')
						if(c == o && c == l ){
							count += item.score
							
						}
					}
				})
				this.content = content
				this.count = count
				uni.redirectTo({
					url:'answerresult?count='+this.count+'&time='+this.time+'&answer_id='+this.answer_id+'&content='+encodeURIComponent(JSON.stringify(this.content))+'&draw_id='+this.draw_id
				})
			},
			confirmHandler(){
				var ask = []
				this.detail.ask.map((item)=>{
					if(item.check){
						ask.push(item.key)
					}
				})
				var c = 0
				var o = 0
				var l=this.detail.answer.split(",").length
				var askarr = []
				this.detail.ask.map((sitem)=>{
					if(sitem.check){
						c++
						askarr.push(sitem.key)
					}
					if(sitem.check == sitem.answer && sitem.check == true){
						o++
					}
				})
				this.next = true
				this.confirm = false
			},
			nextHandler(){
				if(this.currentIndex+1 == this.list.length){
					this.calc()
					return
				}
				this.currentIndex ++
				this.detail = this.list[this.currentIndex]
				this.next = false
				if(this.detail.type == 1){
					this.confirm = false
				}else if(this.detail.type == 2){
					this.confirm = true
				}
			},
			checkHandler(sitem){
				console.log(sitem)
				if(this.next){
					return
				}
				var type = this.list[this.currentIndex].type
				var that = this
				this.list[this.currentIndex].ask.map((item)=>{
					if(type == 2){
						if(sitem.key == item.key){
							item.check = !item.check
						}else{
							console.log(1)
						}
					}
					if(type == 1){
						if(sitem.key == item.key){
							item.check = true
							if(item.key == that.detail.answer){
								if(that.currentIndex+1 == that.list.length){
									that.next = true
									return
								}
								setTimeout(()=>{
									that.currentIndex ++
									that.detail = that.list[that.currentIndex]
									if(that.detail.type == 1){
										that.confirm = false
									}else if(that.detail.type == 2){
										that.confirm = true
									}
									
								},400)
			
							}else{
								that.next = true
							}
						}else{
							item.check = false
						}
					}
				})
				// if(type == 2){
				// 	that.detail = that.list[that.currentIndex]
				// 	if(that.detail.type == 1){
				// 		that.confirm = false
				// 	}else if(that.detail.type == 2){
				// 		that.confirm = true
				// 	}
				// }
			}
		}
	}
</script>

<style lang="scss" scoped>
	.answer{
		display: flex;
		flex-direction: column;
		position: relative;
		height: 1800rpx;
		.bg{
			position: absolute;
			left:0;
			top:0;
			width:100%;
			height: 1800rpx;
			z-index: 100;
		}
		.time{
			position: fixed;
			left:50%;
			width: fit-content;
			top:120rpx;
			z-index: 300;
			transform: translateX(-50%);
		}
		.taskbg{
			position: fixed;
			width: 690rpx;
			height: 1276rpx;
			background: #FFFFFF;
			// border: 6rpx solid #F8E2B6;
			// box-shadow: 0px 10rpx 0px 0px #F56334;
			border-radius: 30rpx;
			left:50%;
			transform: translateX(-50%);
			top: 180rpx;
			z-index: 101;
		}
		.swiperwrap{
			width:500rpx;
			height:500rpx;
			background: red;
		}
		
		.taskcontent{
			position: fixed;
			width:690rpx;
			height: 1276rpx;
			left:50%;
			transform: translateX(-50%);
			top: 180rpx;
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
					height:60rpx;
					position: relative;
					z-index: 31;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 30rpx;
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
				font-size: 36rpx;
				font-family: PingFang SC;
				font-weight: 800;
				color: #4E5191;
				line-height: 50rpx;
				padding:0 40rpx;
				box-sizing: border-box;
				margin-top:30rpx;
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
					height: 100rpx;
					line-height: 100rpx;
					text-align: center;
					background: #F2F2F2;
					border-radius: 50rpx;
					padding:0 30rpx;
					font-size: 26rpx;
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
			.btnsx{
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				margin-top: 30rpx;
				.btn-c{
					width:200rpx;
					height:90rpx;
					margin-left:40rpx;
					margin-right:40rpx;
					border-radius: 20rpx;
					font-size: rpx;
					color:#333333;
					font-weight: bold;
					line-height: 90rpx;
					text-align: center;
					border:3rpx solid #333333;
				}
			}
		}
		
		

	}
</style>
