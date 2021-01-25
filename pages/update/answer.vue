<template>
	<view class="answer">
		<image :src="Config.minUrl + 'anserbg.jpg'" class="bg"></image>
		<image  @click.stop="detailHandler" src="../../static/answerbtn.png" class="answerbtn" ></image>
		<view class="subtext">
			已有 {{detail.detail ? detail.detail.join_num : 0}} 人参加活动
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				Config:this.Config,
				answer_id:'',
				detail:{
					
					detail:{
						join_num:0
					}
				}
			}
		},
		async onLoad(options) {
			var data = {answer_id:options.answer_id || 1}
			this.answer_id = options.answer_id || 1
			var result = await this.Api.questionList(data)
			if(result.code == 1){
				this.detail = result.data
			}
		},
		methods:{
			detailHandler(){
				uni.navigateTo({
					url:'answerdetail?answer_id='+this.answer_id
				})
				if(this.detail.has_answer == 1){
					//return this.$u.toast('您已参加此次答题，请下次再来参与')
				}else{
					uni.navigateTo({
						url:'answerdetail?answer_id='+this.answer_id
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
		}
		.answerbtn{
			position: fixed;
			width:618rpx;
			height:148rpx;
			left:50%;
			transform: translateX(-50%);
			bottom: 250rpx;
		}
		.subtext{
			position: fixed;
			left:50%;
			width: fit-content;
			transform: translateX(-50%);
			bottom: 200rpx;
			color:white;
		}
	}
</style>
