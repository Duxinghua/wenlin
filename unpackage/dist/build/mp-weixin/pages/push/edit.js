(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/push/edit"],{5453:function(e,t,i){"use strict";(function(e){i("4038");n(i("66fd"));var t=n(i("ef15"));function n(e){return e&&e.__esModule?e:{default:e}}e(t.default)}).call(this,i("543d")["createPage"])},"5f10":function(e,t,i){"use strict";i.r(t);var n=i("f403"),o=i.n(n);for(var s in n)"default"!==s&&function(e){i.d(t,e,(function(){return n[e]}))}(s);t["default"]=o.a},"80f5":function(e,t,i){"use strict";i.d(t,"b",(function(){return o})),i.d(t,"c",(function(){return s})),i.d(t,"a",(function(){return n}));var n={uIcon:function(){return i.e("uview-ui/components/u-icon/u-icon").then(i.bind(null,"3cb5"))},uInput:function(){return Promise.all([i.e("common/vendor"),i.e("uview-ui/components/u-input/u-input")]).then(i.bind(null,"5d6e"))},uPopup:function(){return i.e("uview-ui/components/u-popup/u-popup").then(i.bind(null,"b3a9"))},uPicker:function(){return Promise.all([i.e("common/vendor"),i.e("uview-ui/components/u-picker/u-picker")]).then(i.bind(null,"bd87"))}},o=function(){var e=this,t=e.$createElement;e._self._c},s=[]},cef3:function(e,t,i){"use strict";var n=i("e28c"),o=i.n(n);o.a},e28c:function(e,t,i){},ef15:function(e,t,i){"use strict";i.r(t);var n=i("80f5"),o=i("5f10");for(var s in o)"default"!==s&&function(e){i.d(t,e,(function(){return o[e]}))}(s);i("cef3");var c,a=i("f0c5"),r=Object(a["a"])(o["default"],n["b"],n["c"],!1,null,"2ff8deac",null,!1,n["a"],c);t["default"]=r.exports},f403:function(e,t,i){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;n(i("03c0"));function n(e){return e&&e.__esModule?e:{default:e}}var o=function(){i.e("components/seekhelp/seekhelp").then(function(){return resolve(i("5637"))}.bind(null,i)).catch(i.oe)},s=function(){i.e("components/integraltip/integraltip").then(function(){return resolve(i("5c3c"))}.bind(null,i)).catch(i.oe)},c=function(){i.e("components/selectitem/selectitem").then(function(){return resolve(i("7fba"))}.bind(null,i)).catch(i.oe)},a=function(){i.e("components/struggler-navigationCustom/navigation-custom").then(function(){return resolve(i("e7f2"))}.bind(null,i)).catch(i.oe)},r={data:function(){return{params:{year:!0,month:!0,day:!0,hour:!0,minute:!0,second:!0},radioCurrent:1,radioList:[{value:1,name:"所有人可见",check:!1},{value:0,name:"本小区可见",check:!0}],nameList:[{value:1,name:"实名发布",check:!1},{value:0,name:"匿名发布",check:!0}],nameLabel:"匿名发布",selectLabel:"本小区可见",config:{title:"",bgcolor:"white",fontcolor:"rgba(51, 51, 51, 1)",type:1,transparent:!1,linear:!1,share:!1},scrollTop:0,scrollMaxHeight:200,title:"",content:"",TabCur:0,scrollLeft:0,navlist:[],type:1,uploadList:[],liketext:"",buyIndex:0,buyFlag:!1,buyList:[{name:"出售",value:1,check:!0},{name:"赠送",value:2,check:!1},{name:"出租",value:3,check:!1},{name:"置换",value:4,check:!1},{name:"求购",value:5,check:!1}],houseIndex:0,living_type:[{name:"出租",value:1,check:!0},{name:"求租",value:2,check:!1},{name:"卖房",value:3,check:!1},{name:"买房",value:4,check:!1}],recruitIndex:0,recruit_type:[{name:"招聘",value:1,check:!0},{name:"求职",value:2,check:!1}],mobile:"",weixin:"",images:"",opening:1,sell_type:1,sell_price:"面议",sell_price1:"",sell_price2:"",inputType:1,priceView:!1,skillBoolean:!1,list:{1:"曝光小区不文明行为（人像注意打马赛克、车牌号注意挡住部分号码、如曝光有侵权行为，平台有权删帖以保护被曝光人隐私不受侵犯）",2:"请说明您想和邻居一起讨论的议题和观点（发布违规话题管理员有权删除）",3:"发布邻里房产信息～",4:"发布邻里招聘或求职信息～",5:"身边的新鲜事，随时随地分享给邻居～",6:"发布求助内容，有困难找邻居帮助～",7:"请输入置换信息~",8:"请输入邻里团信息~"},skillList:[],add_type:"",score_text:"",isShow:!1,selList:[],titleType:{1:"发布曝光台信息",2:"发布议事厅信息",3:"发布房产信息",4:"发布招聘求职信息",5:"发布新鲜事信息",6:"发布求助信息",7:"发布置换信息",8:"发布邻里团信息"},voteValue:"未添加",helpShow:!1,score:0,input_score:0,input_entity:"请填写",changeShow:!1,height:200,exchange_goods:"",group_price:"",specifications:"",groupbuy_info:[{group_price:"",group_min:""}],group_endtime:"请选择截止时间",timeShow:!1,flagsoce:0}},onPageScroll:function(e){this.scrollTop=e.scrollTop},onLoad:function(t){var i=this;if(this.type=t.type,this.config.title=this.titleType[this.type],t.data){var n=decodeURIComponent(t.data);n=JSON.parse(n),this.skillList=n}var o=e.getStorageSync("selectLabel");o&&this.radioList.map((function(e){e.name==o?(i.selectLabel=o,e.check=!0):e.check=!1}));var s=e.getStorageSync("nameLabel");s&&this.nameList.map((function(e){e.name==s?(i.nameLabel=s,e.check=!0):e.check=!1})),this.$forceUpdate(),1==this.type?this.content=e.getStorageSync("obj1"):2==this.type?this.content=e.getStorageSync("obj2"):3==this.type?this.content=e.getStorageSync("obj3"):4==this.type?this.content=e.getStorageSync("obj4"):6==this.type?this.content=e.getStorageSync("obj6"):7==this.type?this.content=e.getStorageSync("obj7"):8==this.type&&(this.content=e.getStorageSync("obj8"))},onShow:function(){if(2==this.type){var t=e.getStorageSync("voteobj");this.voteValue=t?"已添加":"未添加"}else 7==this.type?this.buyFlag=!0:6==this.type&&(this.sell_price="");2!=this.type?(this.mobile=e.getStorageSync("mobile"),this.weixin=e.getStorageSync("weixin")):(this.mobile="",this.weixin="")},methods:{confirmHandler:function(e){this.group_endtime=e.year+"-"+e.month+"-"+e.day+" "+e.hour+":"+e.minute+":"+e.second},timerHandler:function(){this.timeShow=!0},formatMoney:function(){var e=this;this.$nextTick((function(){e.group_price=e.group_price.replace(/[^\d.]/g,""),e.$forceUpdate()}))},formatNumber:function(e,t,i){var n=this;this.$nextTick((function(){if("group_price"==e){var o=i[e].replace(/[^\d.]/g,"");n.groupbuy_info.map((function(e,i){i==t&&(e.group_price=o)}))}else{o=i[e].replace(/[^\d]/g,"");n.groupbuy_info.map((function(e,i){i==t&&(e.group_min=o)}))}n.$forceUpdate()}))},addgroupHandler:function(){var e=0;this.groupbuy_info.map((function(t){(!t.group_price||!t.group_min||!t.group_price&&!t.group_min||!t.group_price&&t.group_min||t.group_price&&!t.group_min)&&e++})),0==e?this.groupbuy_info.push({group_price:"",group_min:""}):this.$u.toast("请输入完整的价格或拼团人数")},deleGroupHandler:function(e){this.groupbuy_info.splice(e,1)},exchangeHandler:function(){if(0==this.exchange_goods.length)return this.$u.toast("请输入替换物品");this.input_entity="已填写",this.changeShow=!1},changeHandler:function(){this.changeShow=!0},seekHelpClick:function(t){var i=this;this.$getMyscore((function(n){1==n.code&&(i.score=n.data.score,0==i.score?(e.showToast({title:"您的积分不足，请参加积分任务",icon:"none",duration:2e3}),setTimeout((function(){e.navigateTo({url:"/pages/update/integral"})}),2e3)):i.priceView=!0,i.flagsoce=t,2==t&&(i.sell_price=""))}))},Helpcancel:function(){this.helpShow=!1},ok:function(t){var i=this.$refs.SeekHelp.inputValue;i?(this.input_score=i,this.helpShow=!1):e.showToast({title:"请输入悬赏积分",icon:"none",duration:2e3})},recruitHandler:function(e,t){this.recruitIndex=t,this.recruit_type.map((function(e,i){e.check=i==t}))},houseHandler:function(e,t){this.houseIndex=t,this.living_type.map((function(e,i){e.check=i==t}))},buysHandler:function(e,t){var i=this;this.buyIndex=t,this.buyList.map((function(e,n){n==t?(e.check=!0,i.sell_type=e.value,4==e.value?i.buyFlag=!1:i.buyFlag=!0):e.check=!1}))},voteHandler:function(){e.navigateTo({url:"../update/setVote"})},selectTodo:function(e){"name"==e?this.selList=this.nameList:"show"==e&&(this.selList=this.radioList),this.selectType=e,this.isShow=!0},closeHandler:function(){this.isShow=!1},selectHandler:function(t){var i=this;"name"==this.selectType?this.nameList.map((function(n){n.name==t.name?(i.nameLabel=n.name,e.setStorageSync("nameLabel",i.nameLabel),n.check=!0):n.check=!1})):"show"==this.selectType&&this.radioList.map((function(n){n.name==t.name?(i.selectLabel=n.name,e.setStorageSync("selectLabel",i.selectLabel),n.check=!0):n.check=!1})),this.isShow=!1},getPhoneNumber:function(t){var i=this;console.log(t);var n=t.detail,o=n.encryptedData,s=n.iv;this.Api.setUserPhoneBySecret({encrypted_data:o,iv:s}).then((function(t){1==t.code&&(i.mobile=t.data,e.setStorageSync("mobile",t.data))}))},selectKill:function(){e.navigateTo({url:"/pages/push/skill"})},getcommunitySkill:function(){var e=this;this.Api.communitySkill({}).then((function(t){1==t.code&&(t.data.map((function(e){e.check=!1})),e.navlist=t.data)}))},inputTypeHandle:function(e){this.inputType=e},keyBack:function(){this.priceView=!1},keyClick:function(e){1==this.inputType?isNaN(e)?"del"==e?this.sell_price=isNaN(this.sell_price)?"":this.sell_price.substring(0,this.sell_price.length-1):"confirm"==e?(0==this.sell_price.length&&(6==this.type||3!=this.sell_type?this.sell_price="":this.sell_price="面议"),this.input_score=this.sell_price,0!=this.flagsoce&&this.input_score>this.score&&(this.$u.toast("输入积分不能大于您的积分"),this.input_score=this.score),this.priceView=!1):"price"==e&&(this.sell_price="面议"):this.sell_price=isNaN(this.sell_price)?e.toString():this.sell_price.toString()+e.toString():2==this.inputType?isNaN(e)?"del"==e?this.sell_price1=this.sell_price1.substring(0,this.sell_price1.length-1):"confirm"==e&&(this.priceView=!1):this.sell_price1=this.sell_price1.toString()+e.toString():3==this.inputType&&(isNaN(e)?"del"==e?this.sell_price2=this.sell_price2.substring(0,this.sell_price2.length-1):"confirm"==e&&(this.priceView=!1):this.sell_price2=this.sell_price2.toString()+e.toString()),this.$forceUpdate()},priceClick:function(){console.log(this.type,this.sell_type),3!=this.type&&7!=this.type||(this.priceView=!0)},uploadDel:function(e){this.uploadList.splice(e,1)},goIndex:function(){e.redirectTo({url:"/pages/index/index"})},pushClick:function(t){var i={title:this.title,content:this.content,phone:this.mobile,weixin:this.weixin,community_id:e.getStorageSync("community_id")};1!=this.type&&2!=this.type||this.nameList.map((function(e){e.check&&(i.anonymous=e.value)})),this.radioList.map((function(e){e.check&&(i.opening=e.value)}));var n=[];if(this.uploadList.map((function(e){n.push(e.url)})),i.content){if(i.weixin&&e.setStorageSync("weixin",i.weixin),2==this.type){var o=e.getStorageSync("voteobj");if(!o)return this.$u.toast("请输入议事厅选项");o=JSON.parse(o),i.vote_json=JSON.stringify(o)}if(3==this.type&&(i.sell_type=this.sell_type,this.living_type.map((function(e){e.check&&(i.sell_type=e.value)})),i.sell_price="面议"==this.sell_price?-1:this.sell_price),4==this.type&&this.recruit_type.map((function(e){e.check&&(i.recruit_type=e.value)})),5==this.type&&(i.type=2),n.length&&(i.images=n.join(",")),6==this.type&&(i.score=this.input_score),7==this.type){if(4==this.sell_type){var s=0,c="";if(0!=this.input_entity&&(s=this.input_entity),this.exchange_goods&&(c=this.exchange_goods),s&&c&&(i.exchange_goods=c),s&&!c&&(i.exchange_score=s),!s&&c&&(i.exchange_goods=c),!s&&!c)return this.$u.toast("置换需要选填一项，积分或者换实物")}this.buyList.map((function(e){e.check&&(i.sell_type=e.value)})),4!=i.sell_type&&2!=i.sell_type&&("面议"==this.sell_price?i.sell_price=-1:i.sell_price=this.sell_price)}if(8==this.type){if(!this.group_price)return this.$u.toast("请输入团购价格");if(!this.specifications)return this.$u.toast("请输入团购规格");var a=0;if(this.groupbuy_info.map((function(e){e.group_price||a++,e.group_min||a++})),0!=a)return this.$u.toast("请输入拼团信息");if(!this.group_endtime)return this.$u.toast("请选择拼团结束时间");i.group_endtime=this.group_endtime,i.specifications=this.specifications,i.groupbuy_info=JSON.stringify(this.groupbuy_info),i.price=this.group_price}var r=this;console.log(i,"submit"),1==this.type?this.Api.publishDynamicsExposure(i).then((function(t){1==t.code?e.showToast({title:t.msg,duration:2e3,success:function(){e.removeStorageSync("selectLabel"),e.removeStorageSync("nameLabel"),t.data.add?(e.removeStorageSync("obj1"),r.add_type=-1==t.data.add?"-":"+",r.score_text=t.data.score,r.$refs.integraltip.show(),setTimeout((function(){r.add_type="",r.score_text="",r.$refs.integraltip.close(),r.goIndex()}),2e3)):r.goIndex()}}):e.showToast({title:t.msg,icon:"none",duration:2e3})})):2==this.type?this.Api.publishDynamicsYishi(i).then((function(t){1==t.code?e.showToast({title:t.msg,duration:2e3,success:function(){e.removeStorageSync("selectLabel"),e.removeStorageSync("nameLabel"),e.removeStorageSync("voteobj"),t.data.add?(e.removeStorageSync("obj1"),r.add_type=-1==t.data.add?"-":"+",r.score_text=t.data.score,r.$refs.integraltip.show(),setTimeout((function(){r.add_type="",r.score_text="",r.$refs.integraltip.close(),r.goIndex()}),2e3)):r.goIndex()}}):e.showToast({title:t.msg,icon:"none",duration:2e3})})):3==this.type?this.Api.publishDynamicsLiving(i).then((function(t){1==t.code?e.showToast({title:t.msg,duration:2e3,success:function(){e.removeStorageSync("selectLabel"),e.removeStorageSync("nameLabel"),t.data.add?(e.removeStorageSync("obj3"),r.add_type=-1==t.data.add?"-":"+",r.score_text=t.data.score,r.$refs.integraltip.show(),setTimeout((function(){r.add_type="",r.score_text="",r.$refs.integraltip.close(),r.goIndex()}),2e3)):r.goIndex()}}):e.showToast({title:t.msg,icon:"none",duration:2e3})})):4==this.type?this.Api.publishDynamicsRecruit(i).then((function(t){1==t.code?e.showToast({title:t.msg,duration:2e3,success:function(){e.removeStorageSync("selectLabel"),e.removeStorageSync("nameLabel"),t.data.add?(e.removeStorageSync("obj4"),r.add_type=-1==t.data.add?"-":"+",r.score_text=t.data.score,r.$refs.integraltip.show(),setTimeout((function(){r.add_type="",r.score_text="",r.$refs.integraltip.close(),r.goIndex()}),2e3)):r.goIndex()}}):e.showToast({title:t.msg,icon:"none",duration:2e3})})):5==this.type?this.Api.publishDynamics(i).then((function(t){1==t.code?e.showToast({title:t.msg,duration:2e3,success:function(){t.data.add?(1==r.type?e.removeStorageSync("obj1"):2==r.type?e.removeStorageSync("obj2"):4==r.type&&e.removeStorageSync("obj4"),r.add_type=-1==t.data.add?"-":"+",r.score_text=t.data.score,r.$refs.integraltip.show(),setTimeout((function(){r.add_type="",r.score_text="",r.$refs.integraltip.close(),r.goIndex()}),2e3)):r.goIndex()}}):e.showToast({title:t.msg,icon:"none",duration:2e3})})):6==this.type?this.Api.publishHelpDynamics(i).then((function(t){1==t.code?e.showToast({title:t.msg,duration:2e3,success:function(){t.data.add?(e.removeStorageSync("obj6"),r.add_type=-1==t.data.add?"-":"+",r.score_text=t.data.score,r.$refs.integraltip.show(),setTimeout((function(){r.add_type="",r.score_text="",r.$refs.integraltip.close(),r.goIndex()}),2e3)):r.goIndex()}}):e.showToast({title:t.msg,icon:"none",duration:2e3})})):7==this.type?this.Api.publishDynamicsSell(i).then((function(t){1==t.code?e.showToast({title:t.msg,duration:2e3,success:function(){t.data.add?(e.removeStorageSync("obj7"),r.add_type=-1==t.data.add?"-":"+",r.score_text=t.data.score,r.$refs.integraltip.show(),setTimeout((function(){r.add_type="",r.score_text="",r.$refs.integraltip.close(),r.goIndex()}),2e3)):r.goIndex()}}):e.showToast({title:t.msg,icon:"none",duration:2e3})})):8==this.type?this.Api.publishGroupbuy(i).then((function(t){1==t.code?e.showToast({title:t.msg,duration:2e3,success:function(){t.data.add?(e.removeStorageSync("obj8"),r.add_type=-1==t.data.add?"-":"+",r.score_text=t.data.score,r.$refs.integraltip.show(),setTimeout((function(){r.add_type="",r.score_text="",r.$refs.integraltip.close(),r.goIndex()}),2e3)):r.goIndex()}}):e.showToast({title:t.msg,icon:"none",duration:2e3})})):61==this.type&&this.Api.publishDynamicsDaren(i).then((function(t){1==t.code?(6==r.type&&e.removeStorageSync("obj6"),e.showToast({title:t.msg,duration:2e3,success:function(){t.data.add?(r.add_type=-1==t.data.add?"-":"+",r.score_text=t.data.score,r.$refs.integraltip.show(),setTimeout((function(){r.add_type="",r.score_text="",r.$refs.integraltip.close(),r.goIndex()}),2e3)):r.goIndex()}})):e.showToast({title:t.msg,icon:"none",duration:2e3})}))}else e.showToast({title:"请输入内容",icon:"none",duration:2e3})},chooseImage:function(){var t=this;e.chooseImage({count:9-this.uploadList.length,sizeType:["original","compressed"],sourceType:["album","camera"],success:function(e){var i=e.tempFilePaths;i.map((function(e){t.Api.uploadOne(e).then((function(e){1==e.code&&(console.log(e.data),t.uploadList.push(e.data))}))}))}})},customConduct:function(e){console.log(e)},titleInput:function(e){this.title=e.detail.value},contentInput:function(t){this.content=t.detail.value,e.setStorageSync("obj"+this.type,this.content)},weixinInput:function(e){this.weixin=e.detail.value},tabSelect:function(e){this.TabCur=e.currentTarget.dataset.id,this.scrollLeft=60*(e.currentTarget.dataset.id-1)},navClick:function(e){this.navlist.map((function(t){var i=!0;t.skill_id==e.skill_id&&(i=!t.check,t.check=i,console.log(i))}))},buyClick:function(e){var t=this;this.buyList.map((function(i){t.sell_type=e.value,i.name==e.name?(i.check=!0,2!=t.sell_type?t.sell_price="面议":t.sell_price=0):i.check=!1,t.$forceUpdate()}))},navAdd:function(e){this.skillBoolean=!0},skillClose:function(){this.skillBoolean=!1},addLikebtn:function(){var t=this;this.liketext||e.showToast({title:"请输入技能",icon:"none",duration:2e3});var i={title:this.liketext};this.Api.communityDynamicsAddSkill(i).then((function(i){1==i.code?(e.showToast({title:i.msg,duration:2e3}),t.skillBoolean=!1,t.getcommunitySkill()):e.showToast({title:i.msg,icon:"none",duration:2e3})}))},radioClick:function(e){var t=this;this.radioList.map((function(i){i.name==e.name?(i.check=!0,t.opening=i.value):i.check=!1}))},addlikeInput:function(e){this.$nextTick((function(){this.liketext=e.detail.value.substr(0,8)}))}},components:{navigationCustom:a,Integraltip:s,SelectItem:c,SeekHelp:o}};t.default=r}).call(this,i("543d")["default"])}},[["5453","common/runtime","common/vendor"]]]);