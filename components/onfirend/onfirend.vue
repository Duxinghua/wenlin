<template>
  <view class="firend" v-if="show">
	 <view class="mb" @click="onclose"></view>
	 <image src="../../static/onfirend.png" class="firendimg"></image>
  </view>
</template>

<script>
export default {
  data () {
    return {
      show:false
    }
  },
  mounted () {

  },
  methods: {
	onshow(){
		this.show = true
	},
	onclose(){
		this.show = false
	}
  }

}
</script>

<style lang='scss' scoped>
.firend{
	position: fixed;
	left:0;
	top:0;
	width:100%;
	height:100%;
	background:rgba($color: #000000, $alpha: 0.7);
	z-index: 60000;
	.mb{
		position: fixed;
		left:0;
		top:0;
		z-index: 60001;
		width:100%;
		height:100%;
	}
	.firendimg{
		position: fixed;
		width:483upx;
		height:164upx;
		top:150upx;
		left:50%;
		transform: translateX(-50%);
		z-index: 60002;
	}
}
</style>
