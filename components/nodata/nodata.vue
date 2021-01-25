<template>
  <view class="nodata" :class="[type? 'small': '']">
    <image :src="imgUrl + 'nodata.png'" alt="">
    <text>{{text}}</text>
  </view>
</template>

<script>
export default {
	props:{
		type:{
			type:[String,Boolean],
			default:false
		},
		text:{
			type:[String],
			default:'暂无数据'
		}
	},
  data () {
    return {
		imgUrl:this.Config.minUrl
    }
  },
  mounted () {

  },
  methods: {

  }

}
</script>

<style lang='scss' scoped>
  .nodata{
    position: relative;
    top: 50%;
    left:50%;
    transform: translate(-50%,-50%);
	margin-top:35upx;
	width:100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
    image{
      display: block;
      width: 654upx;
      height: 550upx;
      margin: 0 auto;
    }
    text{
      margin-top: 0upx;
      text-align: center;
	  color:#95A0B6;
      font-size: 28upx;
	  width:100%;
    }
  }
  .small{
	  image{
		  width:calc(654upx * 0.8);
		  height:calc(550upx * 0.8);
	  }
	  text{
		  margin-top:0upx;
	  }
  }
</style>
