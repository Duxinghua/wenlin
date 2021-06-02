<template>
	<view class="push">
		<navigation-custom :config="config" :scrollTop="scrollTop" @customConduct="customConduct" :scrollMaxHeight="scrollMaxHeight"/>
		<view class="content">
			<view class="content-top">
				<veiw class="selectlist">
					<view class="selectwrap" @click.stop="selectTodo('name')" v-if="type == 1 || type == 2">
						<view class="label">{{nameLabel}}</view>
						<u-icon color="#95A0B6" name="arrow-down-fill" size="20" ></u-icon>
					</view>
					<view class="selectwrap" @click.stop="selectTodo('show')">
						<view class="label">{{selectLabel}}</view>
						<u-icon color="#95A0B6" name="arrow-down-fill" size="20" ></u-icon>
					</view>
				</veiw>
				<input v-model="title"  placeholder-class="input-title"  class="input-title-a" type="text"  placeholder="标题"  @input="titleInput" style="display:none;" />
				<view class="skillwrap" v-if="type == 9">
					<view class="s1" @click="selectKill">
						<text class="t1">选择我的技能标签：</text>
						<image class="t2" src="../../static/cardmore.png" alt="">
					</view>
					<view class="sklist" v-if="skillList.length">
						<view class="cu-item nav-item" :class="item.check?'nav-active':''" v-for="(item,index) in skillList" :key="index" :data-id="index">
							{{item.title}}
						</view>
					</view>
				</view>
				<view class="contentwrap">
					<textarea maxlength="-1"  class="servercontent-a" placeholder-style="color:#95A0B6"  v-model="content" @input="contentInput" :placeholder="list[type]" ></textarea>
					<view class="imgwrap">
						<view class="imgitem"  v-for="(item,index) in uploadList" :key="index"  v-if="uploadList.length">
							<image src="../../static/imguploaddel.png" class="uploadclose" @click="uploadDel(index)" />
							<image mode="aspectFill" :src="item.http_url"></image>
						</view>
						
						<view class="imgupload"  @click="chooseImage" v-if="uploadList.length<9">
							<image src="../../static/uploadico.png" class="imgjia"></image>
						</view>
					</view>
					<view class="houselist" v-if="false">
						<view :class="['houseitem',houseIndex == index ? 'houseitemactive' :'']" v-for="(item,index) in living_type" :key="index" :index="index" @click.stop="houseHandler(item,index)">
							{{item.name}}
						</view>
					</view>
					<view class="houselist" v-if="false">
						<view :class="['houseitem',recruitIndex == index ? 'houseitemactive' :'']" v-for="(item,index) in recruit_type" :key="index" :index="index" @click.stop="recruitHandler(item,index)">
							{{item.name}}
						</view>
					</view>
					<view class="houselist" v-if="false">
						<view :class="['houseitem',buyIndex == index ? 'houseitemactive' :'']" v-for="(item,index) in buyList" :key="index" :index="index" @click.stop="buysHandler(item,index)">
							{{item.name}}
						</view>
					</view>
				</view>
			</view>
			<view class="votewrap" @click.stop="voteHandler" v-if="type == 2">
				<view class="label">
					投票
				</view>
				<view class="labelvalue">
					{{voteValue}}
				</view>
				<u-icon name="arrow-right" color="#95A0B6" size="36"></u-icon>
			</view>
<!-- 			<view class="radiowrap" v-if="type == 3">
				    
				        <label class="radioitem" v-for="(item,index) in buyList"  :key="index" @click="buyClick(item)">
							  <view class="radiot2">{{item.name}}</view>

							<image :class="['label-image',index === 3 ? 'label-image-fix' : '']" :src="item.check ? '../../static/radioselect.png' : '../../static/radionoselect.png' "></image>
			
				          
				        </label>
				    
			</view> -->
			<view class="pricewrap" v-if="type == 3 || buyFlag && sell_type != 2" @click="priceClick">
				<text class="label">价格</text>
				<view class="pricetype">
					<text>￥{{sell_price}}</text>
					<u-icon name="arrow-right" color="#95A0B6" size="30"></u-icon>
				</view>
			</view>
			
			<view class="pricewrap" v-if="type == 6" @click="seekHelpClick(1)">
				<text class="label">悬赏积分</text>
				<view class="pricetype">
					<text>{{input_score}}</text>
					<u-icon name="arrow-right" color="#95A0B6" size="30"></u-icon>
				</view>
			</view>
			<view class="pricewrap" v-if="type == 7 && !buyFlag" @click="seekHelpClick(2)">
				<text class="label">换积分</text>
				<view class="pricetype">
					<text>{{input_score}}</text>
					<u-icon name="arrow-right" color="#95A0B6" size="30"></u-icon>
				</view>
			</view>
			
			<view class="pricewrap pricemg" v-if="type == 7 && !buyFlag" @click="changeHandler">
				<text class="label">换实物</text>
				<view class="pricetype">
					<text>{{input_entity}}</text>
					<u-icon name="arrow-right" color="#95A0B6" size="30"></u-icon>
				</view>
			</view>
			
			<view class="pricewrap" v-if="type == 8" >
				<text class="label">市场价</text>
				<view class="pricerulewrap">
					<u-input v-model="group_price" placeholder="请输入价格" type="number" @input="formatMoney"  />
					<u-input v-model="specifications" placeholder="请输入规格" type="text"  />
				</view>
			</view>
			
			<view class="pricewraps pricemg" v-if="type == 8" >
				<text class="label">团购价</text>
				<view class="labelwrap">
					<view class="labelwrapitem" v-for="(item,index) in groupbuy_info" :key="index">
						<u-input v-model="item.group_price" placeholder="请输入价格" type="number"   @input="formatNumber('group_price',index,item)"    />
						<u-input v-model="item.group_min" placeholder="请输入人数" type="number"    @input="formatNumber('group_min',index,item)"    />
						<u-icon name="minus-circle" color="#95A0B6" size="50" v-if="index != 0" @click.stop="deleGroupHandler(index)"></u-icon>
					</view>
					<view class="labelbtn" @click.stop="addgroupHandler">
						<u-icon name="plus" color="#95A0B6" size="28"></u-icon>
					</view>
				</view>
			</view>
			
			<view class="pricewrap stockfix" v-if="type == 8" >
				<text class="label">库存</text>
				<view class="pricerulewrap">
					<u-input v-model="stock" placeholder="请输入库存" type="number" @input="formatstock"  />
				</view>
			</view>
			
			<view class="pricewrap pricemg" v-if="type == 8" @click="timerHandler">
				<text class="label">截止时间</text>
				<view class="pricetype">
					<text class="time">{{group_endtime}}</text>
					<u-icon name="arrow-right" color="#95A0B6" size="30"></u-icon>
				</view>
			</view>
			
			
			
			<view class="contentinfo">
				<text class="label">联系方式</text>
				<view class="inputwrap">
					<text class="label-text">手机号:</text>
<!-- 					<button class="openmobile" plain="true" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" style="display: none;">一键授权</button>
 -->					<input class="label-inputs" placeholder-class="label-input" type="number" v-model="mobile"  />
				</view>
				<view class="inputwrap">
					<text class="label-text">微信号:</text>
					<input class="label-inputs" placeholder-class="label-input" type="text" v-model="weixin" @input="weixinInput" />
				</view>
			</view>
		</view>
		<view class="regeditwrip">
			<view class="regedit" @click="pushClick">
				发布
			</view>
		</view>
		<!-- 添加技能 -->
		<view class="popup" v-if="skillBoolean">
			<view class="mb" @click="skillClose"></view>
			<view class="addlike">
				<input class="addlikeinput" v-model="liketext" @input="addlikeInput" />
				<text class="addlikelength">{{liketext.length}}/8字</text>
				<text class="addlikebtn" @click="addLikebtn">确定</text>
			</view>
		</view>
		<!-- 价格输入框 -->
		<view class="popup" v-if="priceView">
			<view class="mb"></view>
			<view class="priceinput">
				<view class="inputwrap" @click="inputTypeHandle(1)">
					<text class="pricetitle">{{type == 6 ? '悬赏积分' :(flagsoce == 2 ? '换积分': '价格')}}</text>
					<text class="pricevalue">{{type == 6 ? '' : ( flagsoce == 2 ? '' : '￥')}}{{sell_price}}</text>
				</view>
				<view class="inputwrap"  @click="inputTypeHandle(2)" style="display: none;">
					<text class="pricetitle">入手价</text>
					<text class="pricevalue1">￥{{sell_price1}}</text>
				</view>
				<view class="inputwrap" style="display: none;">
					<text class="pricetitle">运费</text>
					<text class="pricevalue2"  @click="inputTypeHandle(3)">￥{{sell_price2}}</text>
					<view class="express">
						<image class="express-image" :src="true ? '../../static/radioselect.png' : '../../static/radionoselect.png' "></image>
						<text class="express-text">包邮</text>
					</view>
				</view>
				<view class="keywordwrap">
					<view class="keywordtop">
						<view class="numberwrip">
							<view class="number" @click="keyClick(1)">
								1
							</view>
							<view class="number" @click="keyClick(2)">
								2
							</view>
							<view class="number" @click="keyClick(3)">
								3
							</view>
							<view class="number" @click="keyClick(4)">
								4
							</view>
							<view class="number" @click="keyClick(5)">
								5
							</view>
							<view class="number" @click="keyClick(6)">
								6
							</view>
							
						</view>
						<view class="close" @click="keyClick('del')">
							<image class="keywordclose" src="../../static/keywordclose.png" mode=""></image>
						</view>

					</view>
					<view class="keywordtop">
						<view class="numberwrip">
							<view class="number" @click="keyClick(7)">
								7
							</view>
							<view class="number" @click="keyClick(8)">
								8
							</view>
							<view class="number" @click="keyClick(9)">
								9
							</view>
							<view class="number" @click="keyClick(0)">
								0
							</view>
							<view v-if="type != 6 && flagsoce != 1 && flagsoce != 2" class="number number_txt" @click="keyClick('price')">
								面议
							</view>
							<view class="number number_back" @click="keyBack()">
								返回
								<!-- <image class="keywordclose" src="../../static/keywordback.png" mode=""></image> -->
							</view>
							
						</view>
						<view class="close close_text" @click="keyClick('confirm')">
							确定
						</view>
					
					</view>
					
				</view>
			</view>
		</view>
		<!-- 积分提示 -->
		<Integraltip ref="integraltip" :types.sync="add_type" :score.sync="score_text"  />
		<SelectItem :list="selList" :type="selectType" :isShow="isShow" @select="selectHandler" @close="closeHandler"/>
		<SeekHelp ref="SeekHelp" :isShow="helpShow" @close="Helpcancel" @ok="ok" :score="score" />
		<u-popup v-model="changeShow"  mode="center" closeable border-radius="20">
			<view class="changebody">
				<view class="title">想置换的实物</view>
				<u-input v-model="exchange_goods" type="textarea" :height="height" :border="true" border-color="#F7F9FF"  />
				<view class="sbtn" @click.stop="exchangeHandler">确定</view>
			</view>
		</u-popup>
		<u-picker v-model="timeShow" mode="time" confirm-color="#FFC000" @confirm="confirmHandler" :params="params"></u-picker>
	</view>
</template>

<script>
	import Tool from '../../utils/tool.js'
	import SeekHelp from '@/components/seekhelp/seekhelp.vue';
	import Integraltip from '@/components/integraltip/integraltip.vue'
	import SelectItem from '@/components/selectitem/selectitem.vue'
	import navigationCustom from '../../components/struggler-navigationCustom/navigation-custom';
	export default {
		data () {
			return {
				params:{
					year: true,
										month: true,
										day: true,
										hour: true,
										minute: true,
										second: false
				},
				radioCurrent:1,
				radioList:[
					{value:1,name:'所有人可见',check:true},
					{value:0,name:'本小区可见',check:false}
				],
				nameList:[
					{value:0,name:'实名发布',check:false},
					{value:1,name:'匿名发布',check:true}
				],
				nameLabel:'匿名发布',
				selectLabel:'所有人可见',
				config: {
					title: '', //title
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
				title:'',
				content:'',
				TabCur:0,
				scrollLeft:0,
				navlist:[
				],
				type:1,//1求助 2新鲜事 3闲置 4鹊桥 6达人
				uploadList:[],
				liketext:'',
				buyIndex:0,
				buyFlag:false,
				buyList:[
					{name:'出售',value:1,check:true},
					{name:'赠送',value:2,check:false},
					{name:'出租',value:3,check:false},
					{name:'置换',value:4,check:false},
					{name:'求购',value:5,check:false}
				],
				houseIndex:0,
				living_type:[
					{
						name:'出租',
						value:1,
						check:true
					},
					{
						name:'求租',
						value:2,
						check:false
					},
					{
						name:'卖房',
						value:3,
						check:false
					},
					{
						name:'买房',
						value:4,
						check:false
					}
				],
				recruitIndex:0,
				recruit_type:[
					{
						name:'招聘',
						value:1,
						check:true
					},
					{
						name:'求职',
						value:2,
						check:false
					}
				],
				mobile:'',
				weixin:'',
				images:'',
				opening:1,//是否公开
				sell_type:1,
				sell_price:'面议',
				sell_price1:'',
				sell_price2:'',
				inputType:1,
				priceView:false,
				
				skillBoolean:false,//添加技能控制 
				list:{
					1:'曝光小区不文明行为（人像注意打马赛克、车牌号注意挡住部分号码、如曝光有侵权行为，平台有权删帖以保护被曝光人隐私不受侵犯）',
					2:'请说明您想和邻居一起讨论的议题和观点（发布违规话题管理员有权删除）',
					3:'发布邻里房产信息～',
					4:'发布邻里招聘或求职信息～',
					5:'身边的新鲜事，随时随地分享给邻居～',
					6:'发布求助内容，有困难找邻居帮助～',
					7:'请输入置换信息~',
					8:'请输入邻里团信息~'
				},
				skillList:[],
				add_type:'',
				score_text:'',
				isShow:false,
				selList:[],
				titleType:{
					1:'发布曝光台信息',
					2:'发布议事厅信息',
					3:'发布房产信息',
					4:'发布招聘求职信息',
					5:'发布新鲜事信息',
					6:'发布求助信息',
					7:'发布置换信息',
					8:'发布邻里团信息'
				},
				voteValue:'未添加',
				helpShow: false,
				score: 0,
				input_score:0,
				input_entity:'请填写',
				changeShow:false,
				height:200,
				exchange_goods:'',
				group_price:'',
				specifications:'',
				groupbuy_info:[
					{
						'group_price':'',
						'group_min':'',
					}
				],
				group_endtime:'请选择截止时间',
				timeShow:false,
				stock:null,
				flagsoce:0//积分区分
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onLoad(option){
			this.type = option.type
			this.config.title = this.titleType[this.type]
			if(option.data){
				var data = decodeURIComponent(option.data);
				data = JSON.parse(data)
				this.skillList = data
			}
			var selectLabel =  uni.getStorageSync('selectLabel')
			if(selectLabel){
				this.radioList.map((sitem) => {
					if(sitem.name == selectLabel){
						this.selectLabel = selectLabel
						sitem.check = true
					}else{
						sitem.check = false
					}
				})
			}
			var nameLabel =  uni.getStorageSync('nameLabel')
			if(nameLabel){
				this.nameList.map((sitem) => {
					if(sitem.name == nameLabel){
						this.nameLabel = nameLabel
						sitem.check = true
					}else{
						sitem.check = false
					}
				})
			}
			this.$forceUpdate()
			if(this.type == 1){
				this.content = uni.getStorageSync('obj1')
			}else if(this.type == 2){
				this.content = uni.getStorageSync('obj2')
			}else if(this.type == 3){
				this.content = uni.getStorageSync('obj3')
			}else if(this.type == 4){
				this.content = uni.getStorageSync('obj4')
			}else if(this.type== 6){
				this.content = uni.getStorageSync('obj6')
			}else if(this.type == 7){
				this.content = uni.getStorageSync('obj7')
			}else if(this.type == 8){
				this.content = uni.getStorageSync('obj8')
			}else if(this.type == 9){
				this.content = uni.getStorageSync('obj9')
			}
		},
		onShow(){
			if(this.type == 2){
				var vote = uni.getStorageSync('voteobj')
				if(vote){
					this.voteValue = '已添加'
				}else{
					this.voteValue = '未添加'
				}
				
			}else if(this.type == 7){
				this.buyFlag = true
			}else if(this.type == 6){
				this.sell_price = ''
			}
			if(this.type != 2){
				this.mobile = uni.getStorageSync('mobile')
				this.weixin = uni.getStorageSync('weixin')
			}else{
				this.mobile = ''
				this.weixin = ''
			}
			
		},
		methods:{
			confirmHandler(e){
				this.group_endtime = e.year + '-' + e.month +'-'+e.day +' '+e.hour+':'+e.minute
			},
			timerHandler(){
				this.timeShow = true
			},
			formatMoney(){
				this.$nextTick(()=>{
					
					this.group_price = this.group_price.replace(/[^\d.]/g,'')
					this.$forceUpdate()
					
				})
			},
			formatstock(e){
				this.$nextTick(()=>{
					this.stock = this.stock.replace(/[^\d]/g,'')
					this.$forceUpdate()
				})
			},
			formatNumber(type,index,item){
				this.$nextTick(()=>{
					if(type == 'group_price'){
						var a = item[type].replace(/[^\d.]/g,'')
						this.groupbuy_info.map((item,sindex)=>{
							if(sindex == index){
								item.group_price = a
							}
						})
					}else{
						var a = item[type].replace(/[^\d]/g,'')
						this.groupbuy_info.map((item,sindex)=>{
							if(sindex == index){
								item.group_min = a
							}
						})
					
					}
					this.$forceUpdate()
					
				})

			},
			addgroupHandler(){
				var i = 0
				this.groupbuy_info.map((item)=>{
					if(!item.group_price || !item.group_min ||
					 (!item.group_price && !item.group_min ) ||
					 (!item.group_price && item.group_min ) ||
					 (item.group_price && !item.group_min ) 
					 ){
						 i++
					 }
				})
				if(i == 0){
					this.groupbuy_info.push({
						'group_price':'',
						'group_min':''
					})
				}else{
					this.$u.toast('请输入完整的价格或拼团人数')
				}
			},
			deleGroupHandler(index){
				this.groupbuy_info.splice(index,1)
			},
			exchangeHandler(){
				if(this.exchange_goods.length == 0){
					return this.$u.toast('请输入替换物品')
				}else{
					this.input_entity = '已填写'
				}
				this.changeShow = false
			},
			changeHandler(){
				this.changeShow = true
			},
			seekHelpClick(flag){
				this.$getMyscore(res => {
					if (res.code == 1) {
						this.score = res.data.score;
						if (this.score == 0) {
							uni.showToast({
								title: '您的积分不足，请参加积分任务',
								icon: 'none',
								duration: 2000
							});
							setTimeout(() => {
								uni.navigateTo({
									url: '/pages/update/integral'
								});
							}, 2000);
						} else {
							this.priceView = true;
						}
						this.flagsoce = flag
						if(flag == 2){
							this.sell_price = ''
						}
					}
				});
			},
			Helpcancel(){
				this.helpShow = false
			},
			ok(e) {
				var score = this.$refs.SeekHelp.inputValue;
				if (!score) {
					uni.showToast({
						title: '请输入悬赏积分',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				this.input_score = score
				this.helpShow = false
			},
			recruitHandler(obj,index){
				this.recruitIndex = index
				this.recruit_type.map((item,i)=>{
					if(i == index){
						item.check = true
					}else{
						item.check = false
					}
				})
			},
			houseHandler(obj,index){
				this.houseIndex = index
				this.living_type.map((item,i)=>{
					if(i == index){
						item.check = true
					}else{
						item.check = false
					}
				})
			},
			buysHandler(obj,index){
				this.buyIndex = index
				this.buyList.map((sitem,i)=>{
					if(i == index){
						sitem.check = true
						this.sell_type = sitem.value
						if(sitem.value == 4){
							this.buyFlag = false
						}else{
							this.buyFlag = true
							
						}
					}else{
						sitem.check = false
					}
				
				})
			},
			voteHandler(){
				uni.navigateTo({
					url:'../update/setVote'
				})
			},
			//选项
			selectTodo(type){
				if(type == 'name'){
					this.selList = this.nameList
				}else if(type == 'show'){
					this.selList = this.radioList
				}
				this.selectType = type
				this.isShow = true
			},
			closeHandler(){
				this.isShow = false
			},
			selectHandler(item){
				if(this.selectType == 'name'){
					this.nameList.map((sitem) => {
						if(sitem.name == item.name){
							this.nameLabel = sitem.name
							uni.setStorageSync('nameLabel',this.nameLabel)
							sitem.check = true
						}else{
							sitem.check = false
						}
					})
				}else if(this.selectType == 'show'){
					this.radioList.map((sitem) => {
						if(sitem.name == item.name){
							this.selectLabel = sitem.name
							uni.setStorageSync('selectLabel',this.selectLabel)
							sitem.check = true
						}else{
							sitem.check = false
						}
					})
				}
				this.isShow = false
			},
			// 手机号授权处理
			getPhoneNumber(e) {
				console.log(e);
				var { encryptedData, iv } = e.detail;
			
				this.Api.setUserPhoneBySecret({ encrypted_data: encryptedData, iv: iv }).then(result => {
					if (result.code == 1) {
						this.mobile = result.data
						uni.setStorageSync('mobile', result.data);
					}
				});
			},
			selectKill(){
				uni.navigateTo({
					url:'/pages/push/skill'
				})
			},
			// 获取技能
			getcommunitySkill(){
				this.Api.communitySkill({}).then((result) => {
					if(result.code == 1){
						result.data.map((item) => {
							item.check = false
						})
						this.navlist = result.data
					}
				})
			},
			inputTypeHandle(e){
				this.inputType = e
			},
			keyBack(){
				this.priceView = false
			},
			//键盘输入处理
			keyClick(e){
				if(this.inputType == 1){
					if(!isNaN(e)){
						this.sell_price = !isNaN(this.sell_price) ? this.sell_price.toString() + e.toString() : e.toString()
					}else if(e == 'del'){
						this.sell_price = !isNaN(this.sell_price) ? this.sell_price.substring(0,this.sell_price.length-1) : ''
					}else if(e == 'confirm'){
						if(this.sell_price.length == 0 ){
							if(this.type == 6){
								this.sell_price = ''
							}else{
								if(this.sell_type != 3){
									this.sell_price = ''
								}else{
									this.sell_price = '面议'
								}
								
							}
						}
						this.input_score = this.sell_price
						if(this.flagsoce != 0){
							if(this.input_score > this.score){
								this.$u.toast('输入积分不能大于您的积分')
								this.input_score = this.score
							}
						}
						this.priceView = false
					}else if(e == 'price'){
						this.sell_price = '面议'
					}
				}else if(this.inputType == 2){
					if(!isNaN(e)){
							this.sell_price1 = this.sell_price1.toString() + e.toString() 
						}else if(e == 'del'){
							this.sell_price1 = this.sell_price1.substring(0,this.sell_price1.length-1)
						}else if(e == 'confirm'){
							this.priceView = false
					}
					
				}else if(this.inputType == 3){
					if(!isNaN(e)){
							this.sell_price2 = this.sell_price2.toString() + e.toString() 
						}else if(e == 'del'){
							this.sell_price2 = this.sell_price2.substring(0,this.sell_price2.length-1)
						}else if(e == 'confirm'){
							this.priceView = false
						}
					
				}
				this.$forceUpdate()
			},
			//价格输入处理
			priceClick(){
				console.log(this.type,this.sell_type)
				if(this.type == 3 || this.type == 7){
						this.priceView = true
				}
				
			},
			//图片处理
			uploadDel(e){
				this.uploadList.splice(e,1)
			},
			goIndex(){
				uni.redirectTo({
					url:'/pages/index/index'
				})
			},
			//发布处理
			pushClick(e){
				this.subMessageTodo(this.comIds,'2,3',(rs)=>{
					var data = {
						title:this.title,
						content:this.content,
						phone:this.mobile,
						weixin:this.weixin,
						community_id:uni.getStorageSync('community_id')
					}
					if(this.type == 1 || this.type == 2){
						this.nameList.map((item)=>{
							if(item.check){
								data.anonymous = item.value
							}
						})
					}
					console.log(JSON.stringify(data))
					
					this.radioList.map((item)=>{
						if(item.check){
							data.opening = item.value
						}
					})
					var images = []
					this.uploadList.map((item) => {
						images.push(item.url)
					})
					if(!data.content){
						uni.showToast({
						    title: '请输入内容',
							icon:'none',
						    duration: 2000
						});
						return
					}
					if(!data.weixin){
						// uni.showToast({
						//     title: '请输入微信号',
						//     duration: 2000
						// });
						// return
					}else{
						uni.setStorageSync('weixin',data.weixin)
					}
					if(this.type == 2){
						var vote = uni.getStorageSync('voteobj')
						if(vote){
							vote = JSON.parse(vote)
							data.vote_json = JSON.stringify(vote)
						}else{
							return this.$u.toast('请输入议事厅选项')
						}
						
					}
					if(this.type == 3){
						// data.sell_type = this.sell_type
						// this.living_type.map((item)=>{
						// 	if(item.check){
						// 		data.sell_type = item.value
						// 	}
						// })
						data.sell_price = this.sell_price == '面议' ? -1 : this.sell_price
					}
					if(this.type == 4){
						// this.recruit_type.map((item)=>{
						// 	if(item.check){
						// 		data.recruit_type = item.value
						// 	}
						// })
					}
					if(this.type == 5){
						data.type = 2
					}
					// if(this.type == 3 && data.sell_type != 4 || this.type != 3){
					// 	if(images.length == 0){
					// 		uni.showToast({
					// 			title: '至少上传一张图片',
					// 			duration: 2000
					// 		});
					// 		return
					// 	}
					// 	data.images = images.join(',')
					// }
					if(images.length){
						data.images = images.join(',')
					}
					if(this.type == 6){
						data.score = this.input_score
					}
					if(this.type == 7){
						if(this.sell_type == 4){
							var exchange_score = 0
							var exchange_goods = ''
							if(this.input_score != 0){
								exchange_score = this.input_score
							}
							if(this.exchange_goods){
								exchange_goods = this.exchange_goods
							}
							if(exchange_score && exchange_goods){
								data.exchange_goods = exchange_goods
							}
							if(exchange_score && !exchange_goods){
								data.exchange_score = exchange_score
							}
							if(!exchange_score && exchange_goods){
								data.exchange_goods = exchange_goods
							}
							if(!exchange_score && !exchange_goods){
								return this.$u.toast('置换需要选填一项，积分或者换实物')
							}
							
						}
						this.buyList.map((item)=>{
							if(item.check){
								data.sell_type = item.value
							}
						})
						if(data.sell_type != 4){
							if(data.sell_type != 2){
								if(this.sell_price == '面议'){
									data.sell_price = -1
								}else{
									data.sell_price =  this.sell_price
								}
							}
						}
					}
					
					if(this.type == 8){
						if(!this.group_price){
							return this.$u.toast('请输入团购价格')
						}
						if(!this.specifications){
							return this.$u.toast('请输入团购规格')
						}
						if(!this.stock){
							return this.$u.toast('请输入团购库存')
						}
						var i = 0
						this.groupbuy_info.map((item)=>{
							if(!item.group_price){
								i++
							}
							if(!item.group_min){
								i++
							}
							
						})
						if(i != 0){
							return this.$u.toast('请输入拼团信息')
						}
						if(!this.group_endtime){
							return this.$u.toast('请选择拼团结束时间')
						}
						data.group_endtime = this.group_endtime
						data.specifications = this.specifications
						data.groupbuy_info = JSON.stringify(this.groupbuy_info)
						data.price = this.group_price
						data.stock = this.stock
					}
					
					if(this.type == 9){
						var skill = []
						this.skillList.map((item) => {
							skill.push(item.skill_id)
						})
						if(skill.length == 0){
							uni.showToast({
							    title: '请选择技能',
								icon: 'none',
							    duration: 2000
							});
							return
						}
						data.skill = skill.join(',')
					}
					var that = this
					//曝光台
					console.log(data,'submit')
					if(this.type == 1){
						this.Api.publishDynamicsExposure(data).then((result)=>{
							if(result.code == 1){
								uni.showToast({
									title: result.msg,
									duration: 2000,
									success: () => {
										uni.removeStorageSync('selectLabel')
										uni.removeStorageSync('nameLabel')
										if(result.data.add){
											uni.removeStorageSync('obj1')
											that.add_type = result.data.add == -1 ? '-' : '+'
											that.score_text = result.data.score
											that.$refs.integraltip.show()
											setTimeout(()=>{
												that.add_type = ''
												that.score_text = ''
												that.$refs.integraltip.close()
												// uni.navigateBack({
												// 	delta:2
												// })
												that.goIndex()
												
											},2000)
										}else{
					
											that.goIndex()
										}
								
									
									}
								});
							}else{
								uni.showToast({
									title: result.msg,
									icon:'none',
									duration: 2000
								});
							}
						})
					}else if(this.type == 2){
						this.Api.publishDynamicsYishi(data).then((result)=>{
							if(result.code == 1){
								uni.showToast({
									title: result.msg,
									duration: 2000,
									success: () => {
										uni.removeStorageSync('selectLabel')
										uni.removeStorageSync('nameLabel')
										uni.removeStorageSync('voteobj')
										if(result.data.add){
											uni.removeStorageSync('obj1')
											that.add_type = result.data.add == -1 ? '-' : '+'
											that.score_text = result.data.score
											that.$refs.integraltip.show()
											setTimeout(()=>{
												that.add_type = ''
												that.score_text = ''
												that.$refs.integraltip.close()
												// uni.navigateBack({
												// 	delta:2
												// })
												that.goIndex()
												
											},2000)
										}else{
							
											that.goIndex()
										}
								
									
									}
								});
							}else{
								uni.showToast({
									title: result.msg,
									icon:'none',
									duration: 2000
								});
							}
							
						})
					}else if(this.type == 3){
						this.Api.publishDynamicsLiving(data).then((result)=>{
							if(result.code == 1){
								uni.showToast({
									title: result.msg,
									duration: 2000,
									success: () => {
										uni.removeStorageSync('selectLabel')
										uni.removeStorageSync('nameLabel')
										if(result.data.add){
											uni.removeStorageSync('obj3')
											that.add_type = result.data.add == -1 ? '-' : '+'
											that.score_text = result.data.score
											that.$refs.integraltip.show()
											setTimeout(()=>{
												that.add_type = ''
												that.score_text = ''
												that.$refs.integraltip.close()
												// uni.navigateBack({
												// 	delta:2
												// })
												that.goIndex()
												
											},2000)
										}else{
							
											that.goIndex()
										}
								
									
									}
								});
							}else{
								uni.showToast({
									title: result.msg,
									icon:'none',
									duration: 2000
								});
							}
						})
					}else if(this.type == 4){
						this.Api.publishDynamicsRecruit(data).then((result)=>{
							if(result.code == 1){
								uni.showToast({
									title: result.msg,
									duration: 2000,
									success: () => {
										uni.removeStorageSync('selectLabel')
										uni.removeStorageSync('nameLabel')
										if(result.data.add){
											uni.removeStorageSync('obj4')
											that.add_type = result.data.add == -1 ? '-' : '+'
											that.score_text = result.data.score
											that.$refs.integraltip.show()
											setTimeout(()=>{
												that.add_type = ''
												that.score_text = ''
												that.$refs.integraltip.close()
												// uni.navigateBack({
												// 	delta:2
												// })
												that.goIndex()
												
											},2000)
										}else{
							
											that.goIndex()
										}
								
									
									}
								});
							}else{
								uni.showToast({
									title: result.msg,
									icon:'none',
									duration: 2000
								});
							}
						})
					}else if(this.type == 5){
						this.Api.publishNewthingDynamics(data).then((result) => {
							if(result.code == 1){
								uni.showToast({
									title: result.msg,
									duration: 2000,
									success: () => {
										if(result.data.add){
											if(that.type == 1){
												uni.removeStorageSync('obj1')
											}else if(that.type == 2){
												uni.removeStorageSync('obj2')
											}else if(that.type == 4){
												uni.removeStorageSync('obj4')
											}
											that.add_type = result.data.add == -1 ? '-' : '+'
											that.score_text = result.data.score
											that.$refs.integraltip.show()
											setTimeout(()=>{
												that.add_type = ''
												that.score_text = ''
												that.$refs.integraltip.close()
												// uni.navigateBack({
												// 	delta:2
												// })
												that.goIndex()
												
											},2000)
										}else{
											// uni.navigateBack({
											// 	delta:2
											// })
											that.goIndex()
										}
								
							
									}
								});
							}else{
								uni.showToast({
									title: result.msg,
									icon:'none',
									duration: 2000
								});
							}
						})
					}else if(this.type == 6){
						this.Api.publishHelpDynamics(data).then((result) => {
							if(result.code == 1){
								uni.showToast({
									title: result.msg,
									duration: 2000,
									success: () => {
										if(result.data.add){
											uni.removeStorageSync('obj6')
											that.add_type = result.data.add == -1 ? '-' : '+'
											that.score_text = result.data.score
											that.$refs.integraltip.show()
											setTimeout(()=>{
												that.add_type = ''
												that.score_text = ''
												that.$refs.integraltip.close()
												// uni.navigateBack({
												// 	delta:2
												// })
												that.goIndex()
												
											},2000)
										}else{
											// uni.navigateBack({
											// 	delta:2
											// })
											that.goIndex()
										}
								
									
									}
								});
							}else{
								uni.showToast({
									title: result.msg,
									icon:'none',
									duration: 2000
								});
							}
						})
					}else if(this.type == 7){
						this.Api.publishDynamicsSell(data).then((result)=>{
							if(result.code == 1){
								uni.showToast({
									title: result.msg,
									duration: 2000,
									success: () => {
										if(result.data.add){
											uni.removeStorageSync('obj7')
											that.add_type = result.data.add == -1 ? '-' : '+'
											that.score_text = result.data.score
											that.$refs.integraltip.show()
											setTimeout(()=>{
												that.add_type = ''
												that.score_text = ''
												that.$refs.integraltip.close()
												// uni.navigateBack({
												// 	delta:2
												// })
												that.goIndex()
												
											},2000)
										}else{
											// uni.navigateBack({
											// 	delta:2
											// })
											that.goIndex()
										}
								
									
									}
								});
							}else{
								uni.showToast({
									title: result.msg,
									icon:'none',
									duration: 2000
								});
							}
						})
						
					}else if(this.type == 8){
						this.Api.publishGroupbuy(data).then((result)=>{
							if(result.code == 1){
								uni.showToast({
									title: result.msg,
									duration: 2000,
									success: () => {
										if(result.data.add){
											uni.removeStorageSync('obj8')
											that.add_type = result.data.add == -1 ? '-' : '+'
											that.score_text = result.data.score
											that.$refs.integraltip.show()
											setTimeout(()=>{
												that.add_type = ''
												that.score_text = ''
												that.$refs.integraltip.close()
												// uni.navigateBack({
												// 	delta:2
												// })
												that.goIndex()
												
											},2000)
										}else{
											// uni.navigateBack({
											// 	delta:2
											// })
											that.goIndex()
										}
								
									
									}
								});
							}else{
								uni.showToast({
									title: result.msg,
									icon:'none',
									duration: 2000
								});
							}
						})
						
					
					}else if(this.type == 9){
						this.Api.publishDynamicsDaren(data).then((result) => {
							if(result.code == 1){
								if(that.type == 9){
									uni.removeStorageSync('obj9')
								}
								uni.showToast({
									title: result.msg,
									duration: 2000,
									success: () => {
										if(result.data.add){
											that.add_type = result.data.add == -1 ? '-' : '+'
											that.score_text = result.data.score
											that.$refs.integraltip.show()
											setTimeout(()=>{
												that.add_type = ''
												that.score_text = ''
												that.$refs.integraltip.close()
												// uni.navigateBack({
												// 	delta:2
												// })
												that.goIndex()
												
											},2000)
										}else{
											// uni.navigateBack({
											// 	delta:2
											// })
											that.goIndex()
										}
								
									}
								});
							}else{
								uni.showToast({
									title: result.msg,
									icon: 'none',
									duration: 2000
								});
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
			customConduct(e){
				console.log(e)
			},
			//标题
			titleInput(e){
				this.title = e.detail.value
			},
			//内容
			contentInput(e){
				this.content = e.detail.value
				uni.setStorageSync('obj'+this.type,this.content)
			},
			//输入微信号
			weixinInput(e){
				this.weixin = e.detail.value
			},
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			},
			navClick(obj){
				this.navlist.map((item)=>{
					var flag = true
					if(item.skill_id == obj.skill_id){
						flag = !item.check
						item.check = flag
						console.log(flag)
					}
				})
			},
			buyClick(obj){
				this.buyList.map((item) => {
					this.sell_type = obj.value
					if(item.name == obj.name){
						item.check = true
						if(this.sell_type != 2){
							this.sell_price = '面议'
						}else{
							this.sell_price = 0
						}
						
					}else{
						item.check = false
					}
					this.$forceUpdate()
				})
			},
			//添加技能
			navAdd(e){
				this.skillBoolean = true
			},
			skillClose(){
				this.skillBoolean = false
			},
			addLikebtn(){
				if(!this.liketext){
					uni.showToast({
						title: '请输入技能',
						icon: 'none',
						duration: 2000
					});
				}
				var data = {
					title:this.liketext
				}
				this.Api.communityDynamicsAddSkill(data).then((result)=>{
					if(result.code == 1){
						uni.showToast({
							title: result.msg,
							duration: 2000
						});
						this.skillBoolean = false
						this.getcommunitySkill()
					}else{
						uni.showToast({
							title:  result.msg,
						    icon: 'none',
							duration: 2000
						});
					}
				})
			},
			//是否公开
			radioClick(obj){
				this.radioList.map((item) => {
					if(item.name == obj.name){
						item.check = true
						this.opening = item.value
					}else{
						item.check = false
					}
				})
			},
			addlikeInput(e){
				this.$nextTick(function(){
					this.liketext = e.detail.value.substr(0,8)
				})
			
			}
		},
		components:{
			navigationCustom,
			Integraltip,
			SelectItem,
			SeekHelp
		}
	}
</script>

<style lang="scss" scoped>
	page{
		background: #F7F9FF;
	}
	.push{
		display: flex;
		flex-direction: column;
		min-height:100vh;
		background: #F7F9FF;
		.changebody{
			width: 622upx;
			height: 565upx;
			background: #FFFFFF;
			padding:65upx 20upx;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			.title{
				font-size: 36upx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #404B69;
				width:100%;
				text-align: center;
			}
			/deep/ .u-input{
				padding:0;
			}
			/deep/ .u-input__textarea{
				margin-top: 30upx;
				padding:20upx;
				background: #F7F9FF;
			}
			.sbtn{
				margin:0 auto;
				margin-top:auto;
				width: calc(100% - 40upx);
				height: 99upx;
				line-height: 99upx;
				text-align: center;
				background: linear-gradient(44deg, #FEAA0E, #FFC000);
				border-radius: 10upx;
				font-size: 38upx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #FFFFFF;
				
			}
			
		}
		.content{
			display: flex;
			flex-direction: column;
			padding-bottom: 200upx;
			.votewrap{
				width:100%;
				height:112upx;
				padding:0 40upx 0 48upx;
				box-sizing: border-box;
				background:white;
				display: flex;
				flex-direction: row;
				align-items: center;
				.label{
					font-size: 36upx;
					font-family: PingFang SC;
					font-weight: bold;
					color: #020433;
				}
				.labelvalue{
					margin-left:auto;
					font-size: 36upx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #95A0B6;
				}
			}
			.content-top{
				display: flex;
				flex-direction: column;
				padding:48upx;
				box-sizing: border-box;
				margin-bottom: 10upx;
				background: white;
			}
			.selectlist{
				display: flex;
				flex-direction: row;
				align-items: center;
				.selectwrap{
					display: flex;
					flex-direction: row;
					align-items: center;
					padding:17upx;
					border: 1px solid #404B69;
					border-radius: 10upx;
					width: fit-content;
					margin-right:20upx;
					.label{
						font-size: 28upx;
						margin-right:14upx;
						font-family: PingFang SC;
						font-weight: bold;
						color: #95A0B6;
					}
					/deep/ .u-icon{
						margin-top:8upx;
					}
				}
			}
			.skillwrap{
				display: flex;
				flex-direction: column;
				min-height: 100upx;
				.s1{
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					height:100upx;
					color:#333;
					border-bottom: 1px solid rgba(222, 222, 222, 0.5);
					line-height: 100upx;
					.t1{
						font-size:30upx;
						font-family:PingFang-SC-Bold,PingFang-SC;
						color:rgba(51,51,51,1);
					}
					.t2{
						width:40upx;
						height:40upx;
						margin-top:30upx
					}
				}
				.sklist{
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					align-items: center;
					min-height: 72upx;
					padding-top:20upx;
					box-sizing: border-box;
					.nav-item{
						width:fit-content;
						padding-left:20upx;
						padding-right:20upx;
						line-height: 42upx!important;
						height:42upx;
			
						margin-right:20upx;
						margin-bottom: 20upx;
						background: rgba(255, 156, 0, 0.1);
						color: #FF9C00;
						border-radius:21upx;
					}
				}
			}
			.nav-type{
				font-size:36upx;
				font-family:PingFang-SC-Bold,PingFang-SC;
				font-weight:bold;
				color:rgba(51,51,51,1);
				line-height:50upx;
				margin-bottom: 20upx;
			}
			.nav{
				padding-bottom: 20upx;
				height: 72upx;
				border-bottom: 1px solid rgba(222,222,222,0.5);
				.nav-item{
					width:fit-content;
					padding-left:20upx;
					padding-right:20upx;
					line-height: 42upx!important;
					height:42upx;
					background:rgba(222,222,222,0.5);
					border-radius:21upx;
				}
				.nav-active{
					background:rgba(255,156,0,0.1);
					color:#FF9C00;
				}
			}
			
			.input-title{
				font-size:30upx;
				font-family:PingFang-SC-Bold,PingFang-SC;
				font-weight:bold;
				color:rgba(153,153,153,1);
				border-bottom: 1px solid rgba(222,222,222,0.5);
			}
			.input-title-a{
				height:98upx;
				font-size:32upx;
				font-family:PingFang-SC-Bold,PingFang-SC;
				font-weight:bold;
				color:#333;
				line-height:98upx;
				text-align: left;
				border-bottom: 1px solid rgba(222,222,222,0.5);
			}
			.contentwrap{
				min-height: 441upx;
				padding-bottom: 32upx;
				// padding-top:32upx;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				margin-top: 32upx;
				.servercontent{
					min-height:200upx;
					font-size:34upx;
					font-family:PingFang-SC-Medium,PingFang-SC;
					// font-weight:500;
					line-height:52upx;
				}
				.servercontent-a{
					text-align: left;
					width: 100%;
					font-size: 34upx;
					line-height:52upx;
					color:#333333;
				}
				.imgwrap{
					display: flex;
					flex-direction: row;
					flex-wrap:wrap;
					.imgitem{
						width:191upx;
						height:153upx;
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
							left:151upx;
							top:0;
							width:40upx;
							z-index: 3;
							height:40upx;
						}
					}
					.imgupload{
						width:191upx;
						height:153upx;
						display: flex;
						justify-content: center;
						align-items: center;
						background: #DEDEDE;
						border-radius: 7upx;
						position: relative;
						.imgjia{
							position: absolute;
							left:0;
							top:0;
							width:100%;
							height:100%;
						}
					}
				}
				.houselist{
					flex-direction: row;
					align-items: center;
					display: flex;
					margin-top:30upx;
					.houseitem{
						width: 135upx;
						height: 48upx;
						margin-right:20upx;
						line-height: 48upx;
						text-align: center;
						background: #EEF2FA;
						border-radius: 10upx;
						font-size: 30upx;
						font-family: PingFang SC;
						font-weight: 500;
						color: #020433;
					}
					.houseitemactive{
						background-color: #FF9C00;
						color:white;
					}
				}
			}
			.radiowrap{
				display: flex;
				width:100%;
				flex-direction: row;
				justify-content: space-between;
				height:90upx;
				border-bottom: 2upx solid rgba(222,222,222,0.5);
				.radioitem{
					display: flex;
					flex-direction: row;
					align-items: center;
					.radiot2{
						font-size:28upx;
						font-family:PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						color:rgba(51,51,51,1);
						line-height:40upx;
						margin-right:16upx;
					}
					.label-image{
						width:60upx;
						height:60upx;
						margin-right:48upx;
					}
					.label-image-fix{
						margin-right:-12upx;
					}
				}

			}
			.pricewrap{
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				height:112upx;
				padding:0 38upx 0 48upx;
				box-sizing: border-box;
				background:white;
				.label{
					font-size: 36upx;
					font-family: PingFang SC;
					font-weight: bold;
					color: #020433;
				}
				.pricerulewrap{
					width:calc(100% - 200upx);
					display: flex;
					flex-direction: row;
					align-items: center;
					/deep/ .u-input{
						border: 2upx solid #404B69;
						border-radius: 10upx;
						width:210upx;
						margin-left:20upx;
					}
					/deep/ .u-input:nth-child(2n){
						margin-left:0upx!important;
					}
				}
				.pricetype{
					display: flex;
					flex-direction: row;
					align-items: center;
					text{
						font-size:30upx;
						font-family:PingFang-SC-Bold,PingFang-SC;
						font-weight:bold;
						color:rgba(255,156,0,1);
					}
					.pricearrow{
						width:30upx;
						height:30upx;
						transform: rotate(180deg);
					}
				}
			}
			.pricemg{
				margin-top:10upx;
			}
			.time{
				font-size: 28upx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #95A0B6!important;
			}
			.pricewraps{
				display: flex;
				flex-direction: row;
				align-items: flex-start;
				justify-content: space-between;
				min-height:112upx;
				padding:0 48upx 0 48upx;
				box-sizing: border-box;
				background:white;
				.label{
					font-size: 36upx;
					font-family: PingFang SC;
					font-weight: bold;
					color: #020433;
					padding-top:20upx;
				}
				.labelwrap{
					width:calc(100% - 200upx);
					display: flex;
					flex-direction: column;
					padding:20upx 0;
					box-sizing: border-box;
					.labelwrapitem{
						width:100%;
						display: flex;
						flex-direction: row;
						align-items: center;
						margin-bottom: 20upx;
						/deep/ .u-input{
							border: 2upx solid #404B69;
							border-radius: 10upx;
							// width:180upx;
							margin-left:20upx;
						}
						/deep/ .u-icon{
							margin-left:10upx;
						}
						/deep/ .u-input:nth-child(2n){
							margin-left:0upx!important;
						}
					}
					.labelbtn{
						width:calc(100% - 20upx);
						margin-left:auto;
						height:62upx;
						display: flex;
						justify-content: center;
						align-items: center;
						background: #F5F6FA;	
						border-radius: 10upx;
					}
				}
			}
			.stockfix{
				margin-top: 10upx;
				/deep/ .u-input{
					width:440upx!important;
				}
			}
			.contentinfo{
				display: flex;
				flex-direction: column;
				background: white;
				padding:48upx;
				box-sizing: border-box;
				border-bottom: 2upx solid rgba(222,222,222,0.5);
				margin-top:10upx;
				.label{
					font-size:36upx;
					font-family:PingFang-SC-Bold,PingFang-SC;
					font-weight:bold;
					color:#020433;
					line-height:84upx;
					height: 84upx;
					margin-bottom: 10upx;
					text-align: left;
					border-bottom: 1px solid #F0F0F0;
				}
				.inputwrap{
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;
					height:84upx;
					.openmobile {
						width: 136upx;
						height: 56upx;
						background: rgba(255, 156, 0, 1);
						border-radius: 8upx;
						border: none;
						font-size: 30upx;
						font-family: PingFang-SC-Bold, PingFang-SC;
						font-weight: bold;
						color: rgba(255, 255, 255, 1);
						line-height: 56upx;
						text-align: center;
						padding: 0;
					}
					input{
						text-align: left;
						
					}
					.label-text{
						width:102upx;
						font-size:30upx;
						font-family:PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						color:#020433;
						line-height:84upx;
					}
					.label-input{
						width:calc(100% - 102upx);
						font-size:30upx;
						font-family:PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						color:#95A0B6;
						line-height:84upx;
						height:84upx;
						text-align: left;
					}
					.label-inputs{
						flex:1;
						font-size:30upx;
						font-family:PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						color:#333;
						line-height:84upx;
						height:84upx;
						text-align: left;
					}
					.label-image{
						width:60upx;
						height:60upx;
					}
					
				}
				.inputwrap:nth-of-type(2){
					border-bottom: 2upx solid transparent;
				}
				.inputwrap:last-child{
					border-bottom: 2upx solid transparent;
				}
			}
		}
		.popup{
			position: fixed;
			left:0;
			top:0;
			width:100%;
			height:100%;
			z-index: 3000;
			.mb{
				position: fixed;
				left:0;
				top:0;
				width:100%;
				height:100%;
				z-index: 3001;
				background: rgba(0,0,0,0.3);
			}
			.addlike{
				position: fixed;
				padding:0 24upx;
				box-sizing: border-box;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				z-index: 3002;
				left:0;
				bottom:0;
				width:100%;
				height:100upx;
				background:rgba(255,255,255,1);
				box-shadow:0px 12upx 20upx 0px rgba(0,0,0,0.1);
				.addlikeinput{
					width:600upx;
					height:60upx;
					background:rgba(234,234,234,0.3);
					border-radius:32upx;
					padding-left:24upx;
				}
				.addlikelength{
					position: absolute;
					right:150upx;
					top:50%;
					transform: translateY(-50%);
					font-size:24upx;
					font-family:PingFang-SC-Medium,PingFang-SC;
					font-weight:500;
					color:rgba(51,51,51,1);
				}
				.addlikebtn{
					font-size:30upx;
					font-family:PingFang-SC-Medium,PingFang-SC;
					font-weight:500;
					color:rgba(255,156,0,0.5);
				}
			}
			.priceinput{
				position: fixed;
				left:0;
				bottom: 0;
				width:100%;
				height:620upx;
				z-index: 3002;
				background:white;
				border-radius:16px 16px 0px 0px;
				padding:16upx 0;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				.inputwrap{
					display: flex;
					flex-direction: row;
					height:90upx;
					line-height: 90upx;
					margin-left:24upx;
					margin-right: 24upx;
					box-sizing: border-box;
					border-bottom: 2upx solid  rgba(222,222,222,0.6);
					.pricetitle{
						width:120upx;
						font-size:30upx;
						font-family:PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						color:rgba(51,51,51,1);
						line-height: 90upx;
					}
					.pricevalue{
						font-size:36upx;
						font-family:PingFang-SC-Bold,PingFang-SC;
						font-weight:bold;
						color:rgba(51,51,51,1);
						line-height:90upx;
					}
					.pricevalue1{
						font-size:30upx;
						font-family:PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						color:rgba(51,51,51,1);
					}
					.pricevalue2{
						font-size:30upx;
						font-family:PingFang-SC-Medium,PingFang-SC;
						font-weight:500;
						color:rgba(153,153,153,1);
					}
					.express{
						display: flex;
						flex-direction: row;
						align-items: center;
						margin-left:auto;
						.express-image{
							width:64upx;
							height:64upx;
							margin-right:10upx;
						}
						.express-text{
							font-size:30upx;
							font-family:PingFang-SC-Medium,PingFang-SC;
							font-weight:500;
							color:rgba(102,102,102,1);
						}
					}
				}
				.inputwrap:last-child{
					border-bottom: 2upx solid transparent;
				}
				.keywordwrap{
					display: flex;
					flex-direction: column;
					.keywordtop{
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						width:100%;
						.numberwrip{
							display: flex;
							flex-direction: row;
							flex-wrap: wrap;
							height:212upx;
							width:558upx;
							border-top: 2upx solid  rgba(222,222,222,0.6);
							.number{
								font-size:40upx;
								font-family:PingFang-SC-Bold,PingFang-SC;
								font-weight:bold;
								color:rgba(51,51,51,1);
								display: flex;
								justify-content: center;
								text-align: center;
								width:186upx;
								height:106upx;
								line-height: 106upx;
								border-right:2upx solid  rgba(222,222,222,0.6);
								border-bottom: 2upx solid  rgba(222,222,222,0.6);
							}
							.number_txt{
								font-size: 32upx;
							}
							.number_back{
								display: flex;
								justify-content: center;
								align-items: center;
								font-size: 32upx;
								.keywordclose{
									width:60upx;
									height:60upx;
								}
							}
						}
						.close{
							width:calc(100% - 558upx);
							height:212upx;
							display: flex;
							justify-content: center;
							align-items: center;
							border-bottom: 2upx solid  rgba(222,222,222,0.6);
							.keywordclose{
								width:60upx;
								height:60upx;
							}
						}
						.close_text{
							font-size:32upx;
							font-family:PingFang-SC-Bold,PingFang-SC;
							font-weight:bold;
							color:rgba(255,255,255,1);
							background: rgba(255, 156, 0, 1);
						}
					}
				}
			}
			
		}
		.regeditwrip{
			width:100%;
			height:100upx;
			background: transparent;
			position: fixed;
			left:0px;
			bottom: 20upx;
			z-index: 3000;
			display: flex;
			justify-content: center;
			align-items: center;
			padding:0 48upx;
			.regedit{
				width:100%;
				height:100upx;
				background: linear-gradient(44deg, #FEAA0E, #FFC000);;
				font-size:32upx;
				font-family:PingFang-SC-Bold,PingFang-SC;
				font-weight:bold;
				color:rgba(255,255,255,1);
				line-height:100upx;
				letter-spacing:8px;
				box-sizing: border-box;
				text-align: center;
				border-radius: 12upx;
			}
		}
	}
</style>
