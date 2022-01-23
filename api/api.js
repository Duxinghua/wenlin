import { wxRequest, wxUploadFile } from 'utils/request';
import {baseURL} from '../utils/config.js'
// var baseURL = 'https://sq.wenlinapp.com/'



//POST 用户模块
const wechatAuth = (params) => wxRequest(params, baseURL + 'api/wxapp/public/communityLoginByCode', 'POST')
// POST 授权获取手机号 /api/wxapp/public/setUserPhoneBySecret
const setUserPhoneBySecret  = (params) => wxRequest(params, baseURL + 'api/wxapp/public/setUserPhoneBySecret', 'POST')
// 拿token
const communityLogin  = (params) => wxRequest(params, baseURL + 'api/wxapp/public/communityLogin', 'POST')
//POST 设置用户小区
const setUserCommunityInfo = (params) => wxRequest(params, baseURL + 'api/community/community/setUserCommunityInfo', 'POST')
//POST 搜索小区 
const searchCommunity = (params) => wxRequest(params, baseURL + 'api/community/community/searchCommunity', 'POST')
//POST 获取附近的小区
const getNearCommunity = (params) => wxRequest(params, baseURL + 'api/community/community/getNearCommunity', 'POST')
//POST 我的小区动态
const allByCommunityId = (params) => wxRequest(params, baseURL + 'api/community/community_dynamics/allByCommunityId', 'POST')
//POST 附近小区动态
const nearByCommunityId = (params) => wxRequest(params, baseURL + 'api/community/community_dynamics/nearByCommunityId', 'POST')
//获取他人名片 用户信息 api/community/user/getOtherUserInfo
const getOtherUserInfo = (params) => wxRequest(params, baseURL + 'api/community/user/getOtherUserInfo', 'POST')
//POST 认识
const usersetKown = (params) => wxRequest(params, baseURL + 'api/community/user/setKown', 'POST')
// POST 取消认识
const userunSetKown = (params) => wxRequest(params, baseURL + 'api/community/user/unSetKown', 'POST')
// POST 留言
const userleaveMessage = (params) => wxRequest(params, baseURL + 'api/community/user/leaveMessage', 'POST')
//POST 帖子搜索接口
const searchDynamics = (params) => wxRequest(params, baseURL + 'api/community/community_dynamics/searchDynamics', 'POST')
//POST 便民列表
const getCommunityWiki = (params) => wxRequest(params, baseURL + 'api/community/community_dynamics/getCommunityWiki', 'POST')
//POST 便民详情
const communitydynamicswikiDetail = (params) => wxRequest(params, baseURL + 'api/community/community_dynamics/wikiDetail', 'POST')
//POST 便民挑错
const communitydynamicswikiCorrection = (params) => wxRequest(params, baseURL + 'api/community/community_dynamics/wikiCorrection', 'POST')

//POST 动态收藏
const setFavorites = (params) => wxRequest(params, baseURL + 'api/community/favorites/setDynamicsFavorites', 'POST')
//POST 动态取消收藏
const unsetFavorites = (params) => wxRequest(params, baseURL + 'api/community/favorites/unsetDynamicsFavorites', 'POST')
//POST 小区名片
const communityDetail = (params) => wxRequest(params, baseURL + 'api/community/community/communityDetail', 'POST')
// 小区详情 api/community/community_dynamics/detail
const communityDynamicsDetail = (params) => wxRequest(params, baseURL + 'api/community/community_dynamics/detail', 'POST')
// 检测小区开通 /api/community/community/checkUserCommunityOpening
const checkUserCommunityOpening = (params) => wxRequest(params, baseURL + 'api/community/community/checkUserCommunityOpening', 'POST')
//POST 开通小区
const communityOpening = (params) => wxRequest(params, baseURL + 'api/community/community/communityOpening', 'POST')
//POST 发布小区动态--1、求助，2、新鲜事，4、鹊桥
// Post新鲜事 publishNewthingDynamics

const publishNewthingDynamics = (params) => wxRequest(params, baseURL + 'api/community/community_dynamics/publishNewthingDynamics', 'POST')

const publishDynamics = (params) => wxRequest(params, baseURL + 'api/community/community_dynamics/publishDynamics', 'POST')
//{{onlineurl}}/api/community/ucenter/setDefaultCommunity 设置默认
const setDefaultCommunity = (params) => wxRequest(params, baseURL + 'api/community/ucenter/setDefaultCommunity', 'POST')
//POST 用户模块--获取他人达人信息
const otherUserDarenInfo = (params) => wxRequest(params, baseURL + 'api/community/user/otherUserDarenInfo', 'POST')

//POST 发布小区动态—达人
const publishDynamicsDaren = (params) => wxRequest(params, baseURL + 'api/community/community_dynamics/publishDynamicsDaren', 'POST')
//POST 动态评论（设置评论）
const setComments = (params) => wxRequest(params, baseURL + 'api/community/user_comment/setComments', 'POST')
//POST 删除评论
const delComments = (params) => wxRequest(params, baseURL + 'api/community/user_comment/delComments','POST')


const getMultistageComments = (params) => wxRequest(params, baseURL + 'api/community/user_comment/getMultistageComments', 'POST')
// POST 通用点赞接口
const setLikes = (params) => wxRequest(params, baseURL + 'api/community/Likes/setCommonLikes', 'POST')
//POST 通用取消点赞
const unsetLikes = (params) => wxRequest(params, baseURL + 'api/community/Likes/unsetCommonLikes', 'POST')
//POST 举报分类
const getAccusationType = (params) => wxRequest(params, baseURL + 'api/community/user/getAccusationType', 'POST')
//POST 举报提交
const setUserAccusation = (params) => wxRequest(params, baseURL + 'api/community/user/setUserAccusation', 'POST')


//POST 帖子推帮
const communityDynamicsPushDynamics = (params) => wxRequest(params, baseURL + 'api/community/community_dynamics/pushDynamics', 'POST')
//POST 帮推动态列表
const helpDynamicsByCommunityId = (params) => wxRequest(params, baseURL + 'api/community/community_dynamics/helpDynamicsByCommunityId', 'POST')
//POST 闲置答谢
const communityDynamicsThanksHelp= (params) => wxRequest(params, baseURL + 'api/community/community_dynamics/thanksHelp', 'POST')
// POST 用户模块--获取他人帖子列表
const getOtherUserDynamicsList = (params) => wxRequest(params, baseURL + 'api/community/user/getOtherUserDynamicsList', 'POST')
//POST 获取所有的技能
const communitySkill = (params) => wxRequest(params, baseURL + 'api/community/community_dynamics/communitySkill', 'POST')
//POST 添加技能
const communityDynamicsAddSkill = (params) => wxRequest(params, baseURL + 'api/community/community_dynamics/addSkill', 'POST')


//POST 上传图片（单个）
// 文件上传
const uploadOne = (params) => wxUploadFile(params, baseURL + 'api/community/upload/one')
// 生成海报  api/wxapp/wxapp/getWXACodeUnlimit
const getWXACodeUnlimit = (params) => wxRequest(params, baseURL + 'api/wxapp/wxapp/getWXACodeUnlimit', 'POST')

//POST 居委会详情
const getCommitteeDetail = (params) => wxRequest(params, baseURL + 'api/community/committee/getCommitteeDetail', 'POST')
//POST 居委会工作人员
const getPersonnels = (params) => wxRequest(params, baseURL + 'api/community/committee/getPersonnels', 'POST')
//POST 居委会留言列表
const getLeaveMessages = (params) => wxRequest(params, baseURL + 'api/community/committee/getLeaveMessages', 'POST')
//POST 给居委会留言
const setLeaveMessage = (params) => wxRequest(params, baseURL + 'api/community/committee/setLeaveMessage', 'POST')
//POST 居委会动态详情 {{onlineurl}}/api/community/community_dynamics/dongtaiDetail dynamics_id  帖子id
const dongtaiDetail = (params) => wxRequest(params, baseURL + 'api/community/community_dynamics/detail', 'POST')
// POST 居委会动态
const committeeDynamics = (params) => wxRequest(params, baseURL + 'api/community/community_dynamics/committeeDynamics', 'POST')
//POST 活动详情
const activityDetail = (params) => wxRequest(params, baseURL + 'api/community/activity/detail', 'POST')
//POST 活动报名 api/community/Activity/join
const activityjoin = (params) => wxRequest(params, baseURL + 'api/community/Activity/join', 'POST')
//POST 活动报名者列表
const getJoinUser = (params) => wxRequest(params, baseURL + 'api/community/Activity/getJoinUser', 'POST')
//POST 帮推列表 api/community/community_dynamics/getDynamicsPushLog
const getDynamicsPushLog = (params) => wxRequest(params, baseURL + 'api/community/community_dynamics/getDynamicsPushLog', 'POST')
//POST 当前用户个人中心--我的信息
const myinfo = (params) => wxRequest(params, baseURL + 'api/community/ucenter/myinfo', 'POST')
//更新 api/community/ucenter/updateUserInfo
const updateUserInfo = (params) => wxRequest(params, baseURL + 'api/community/ucenter/updateUserInfo', 'POST')
// 签到 api/community/user/saveSign
const userSaveSign = (params) => wxRequest(params, baseURL + 'api/community/user/saveSign', 'POST')
//POST 用户个人中心--积分任务
const myScoreTask = (params) => wxRequest(params, baseURL + 'api/community/ucenter/myScoreTask', 'POST')
//POST 用户个人中心--积分日志
const myScoreLog = (params) => wxRequest(params, baseURL + 'api/community/ucenter/myScoreLog', 'POST')
// POST 当前用户个人中心--我的个人中心
const myCenter = (params) => wxRequest(params, baseURL + 'api/community/ucenter/myCenter', 'POST')
//POST 当前用户个人中心--我的发帖
const getMyDynamicsList = (params) => wxRequest(params, baseURL + 'api/community/ucenter/myDynamicsList', 'POST')
//POST 当前用户个人中心--刷新帖子
const refreshMyDynamics = (params) => wxRequest(params, baseURL + 'api/community/ucenter/refreshMyDynamics', 'POST')
//POST 帖子-删除
const deleteDynamics = (params) => wxRequest(params, baseURL + 'api/community/community_dynamics/deleteDynamics', 'POST')
//POST 获取用户闲置
const getUserDynamicsList = (params) => wxRequest(params, baseURL + 'api/community/user/getUserDynamicsList', 'POST')
//POST 当前用户个人中心--我的系统消息 https://sq.wenlinapp.com//api/community/ucenter/mySysNotices
const mySysNotices = (params) => wxRequest(params, baseURL + 'api/community/ucenter/mySysNotices', 'POST')
//POST  当前用户个人中心--我的系统消息详情 sysNoticesDetail 
const sysNoticesDetail = (params) => wxRequest(params, baseURL + 'api/community/ucenter/sysNoticesDetail', 'POST')
// POST 当前用户个人中心--我的系统消息删除
const  delSysNotices = (params) => wxRequest(params, baseURL + 'api/community/ucenter/delSysNotices', 'POST')
//POST 当前用户个人中心--我的小区
const  myCommunity = (params) => wxRequest(params, baseURL + 'api/community/ucenter/myCommunity', 'POST')
//POST 当前用户个人中心--我的小区-退出小区
const  exitCommunity = (params) => wxRequest(params, baseURL + 'api/community/ucenter/exitCommunity', 'POST')
// POST 当前用户个人中心--我的邻居列表 api/community/ucenter/myNeighbour
const myNeighbour = (params) => wxRequest(params, baseURL + 'api/community/ucenter/myNeighbour', 'POST')
//POST 当前用户个人中心--我的达人信息
const myDarenInfo = (params) => wxRequest(params, baseURL + 'api/community/ucenter/myDarenInfo', 'POST')
//POST 当前用户个人中心--我的居委会
//api/community/committee/myCommitteeList
const myCommitteeList = (params) => wxRequest(params, baseURL + 'api/community/committee/myCommitteeList', 'POST')
//const myCommitteeList = (params) => wxRequest(params, baseURL + 'api/community/ucenter/myCommitteeList', 'POST')
//POST 当前用户个人中心--更新我的达人信息
const updateMyDaren = (params) => wxRequest(params, baseURL + 'api/community/ucenter/updateMyDaren', 'POST')
//POST 当前用户个人中心--我的未读消息统计
const myUnread = (params) => wxRequest(params, baseURL + 'api/community/ucenter/myUnread', 'POST')
//POST 当前用户个人中心--我的评论消息
const myCommentNotices = (params) => wxRequest(params, baseURL + 'api/community/ucenter/myCommentNotices', 'POST')
//POST 当前用户个人中心--我的答谢消息
const myThanksNotices = (params) => wxRequest(params, baseURL + 'api/community/ucenter/myThanksNotices', 'POST')
//POST 当前用户个人中心--我的留言消息
const myLeaveMessageNotices = (params) => wxRequest(params, baseURL + 'api/community/ucenter/myLeaveMessageNotices', 'POST')
// 获取积分 {{onlineurl}}/api/community/ucenter/myScore
const ucenterMyScore = (params) => wxRequest(params, baseURL + 'api/community/ucenter/myScore', 'POST')
// POST 当前用户个人中心--我的收藏帖子
const myFavoriteList = (params) => wxRequest(params, baseURL + 'api/community/ucenter/myFavoriteList', 'POST')
//爱心列表 {{onlineurl}}/api/community/ucenter/myLoveLog
const myLoveLog = (params) => wxRequest(params, baseURL + 'api/community/ucenter/myLoveLog', 'POST')
// POST 认识好友-我认识的好友
const myKownList = (params) => wxRequest(params, baseURL + 'api/community/ucenter/myKownList', 'POST')
// POST 认识好友--认识我的好友
const kownMyList = (params) => wxRequest(params, baseURL + 'api/community/ucenter/kownMyList', 'POST')
//POST 认识好友--统计
const kownCount = (params) => wxRequest(params, baseURL + 'api/community/ucenter/kownCount', 'POST')
//POST 提交建议 api/community/user/addSuggestion
const addSuggestion = (params) => wxRequest(params, baseURL + 'api/community/user/addSuggestion', 'POST')
//POST 绑定上下级 /api/community/user/inviteNeighbor
const inviteNeighbor = (params) => wxRequest(params, baseURL + 'api/community/user/inviteNeighbor', 'POST')
//获取积分接口 {{onlineurl}}/api/community/public/getScoreSetting
const getScoreSetting = (params) => wxRequest(params, baseURL + 'api/community/public/getScoreSetting', 'POST')



//新加入的用户 {{localhostwenlin}}/api/community/community/getNewNeighbor
const getNewNeighbor = (params) => wxRequest(params, baseURL + 'api/community/community/getNewNeighbor', 'POST')
//发布小区帖子—曝光台--1.1 api/community/community_dynamics/publishDynamicsExposure
const publishDynamicsExposure = (params) => wxRequest(params, baseURL + 'api/community/community_dynamics/publishDynamicsExposure', 'POST')
//发布小区帖子—议事厅--1.1  api/community/community_dynamics/publishDynamicsYishi
const publishDynamicsYishi = (params) => wxRequest(params, baseURL + 'api/community/community_dynamics/publishDynamicsYishi', 'POST')
//发布小区帖子—安居--1.1 api/community/community_dynamics/publishDynamicsLiving
const publishDynamicsLiving = (params) => wxRequest(params, baseURL + 'api/community/community_dynamics/publishDynamicsLiving', 'POST')
//发布小区帖子—乐业--1.1 api/community/community_dynamics/publishDynamicsRecruit
const publishDynamicsRecruit = (params) => wxRequest(params, baseURL + 'api/community/community_dynamics/publishDynamicsRecruit', 'POST')
//发布小区帖子（1、求助）--1.1  api/community/community_dynamics/publishHelpDynamics
const publishHelpDynamics = (params) => wxRequest(params, baseURL + 'api/community/community_dynamics/publishHelpDynamics', 'POST')
//发布小区帖子—闲置--1.1 api/community/community_dynamics/publishDynamicsSell
const publishDynamicsSell = (params) => wxRequest(params, baseURL + 'api/community/community_dynamics/publishDynamicsSell', 'POST')
//发布小区帖子—团购--1.1 api/community/community_dynamics/publishGroupbuy
const publishGroupbuy = (params) => wxRequest(params, baseURL + 'api/community/community_dynamics/publishGroupbuy', 'POST')

//议事厅
// 议事厅详情--1.1 {{localhost}}/api/community/vote/dynamicsVoteDetail
const dynamicsVoteDetail = (params) => wxRequest(params, baseURL + 'api/community/vote/dynamicsVoteDetail', 'POST')
// 议事厅投票--1.1 {{localhost}}/api/community/vote/vote
const vote = (params) => wxRequest(params, baseURL + 'api/community/vote/vote', 'POST')
// 议事厅添加投票选项--1.1  {{localhost}}/api/community/vote/addDynamicsVoteVote
const addDynamicsVoteVote = (params) => wxRequest(params, baseURL + 'api/community/vote/addDynamicsVoteVote', 'POST')
// 议事厅单个投票详情--1.1 {{localhost}}/api/community/vote/singleVoteDetail
const singleVoteDetail = (params) => wxRequest(params, baseURL + 'api/community/vote/singleVoteDetail', 'POST')
//议事厅投票评论--1.1  {{localhost}}/api/community/vote/voteComment
const voteComment = (params) => wxRequest(params, baseURL + 'api/community/vote/voteComment', 'POST')

const voteCommentReply = (params) => wxRequest(params, baseURL + 'api/community/vote/voteCommentReply', 'POST')

//议事厅投票评论列表--1.1 {{localhost}}/api/community/vote/getMultistageComments
const getVoteMultistageComments = (params) => wxRequest(params, baseURL + 'api/community/vote/getMultistageComments', 'POST')
// 小区公益---1.1 community/community_score/communityScore
const getCommunityScore = (params) => wxRequest(params, baseURL + 'api/community/community_score/communityScore', 'POST')
//小区公益--捐赠积分--1.1 {{localhost}}/api/community/user/donateScore
const userDonateScore = (params) => wxRequest(params, baseURL + 'api/community/user/donateScore', 'POST')
//小区公益-捐赠榜单--1.1 api/community/community_score/donateScoreList
const donateScoreList = (params) => wxRequest(params, baseURL + 'api/community/community_score/donateScoreList', 'POST')


//发布小区帖子—团购详情--1.1 {{localhost}}/api/community/groupbuy/groupbuyDetail
const groupbuyDetail = (params) => wxRequest(params, baseURL + 'api/community/groupbuy/groupbuyDetail', 'POST')


//用户订阅消息--1.1  {{localhost}}/api/subscribe/subscribe_message/addMessage
const addMessage = (params) => wxRequest(params, baseURL + 'api/subscribe/subscribe_message/addMessage', 'POST')

//抽奖-点击抽奖--1.1  {{localhost}}/api/draw/draw/gotoDraw
const gotoDraw = (params) => wxRequest(params, baseURL + 'api/draw/draw/gotoDraw', 'POST')
//抽奖-中奖列表--1.1 {{localhost}}/api/draw/draw/drawUser
const drawUser = (params) => wxRequest(params, baseURL + 'api/draw/draw/drawUser', 'POST')
//抽奖详情--1.1 {{localhost}}/api/draw/draw/drawDetail
const drawDetail = (params) => wxRequest(params, baseURL + 'api/draw/draw/drawDetail', 'POST')
//团购报名--1.1 {{localhost}}/api/community/groupbuy/jionGroupbuy
const jionGroupbuy = (params) => wxRequest(params, baseURL + 'api/community/groupbuy/jionGroupbuy', 'POST')
//团购报名列表--1.1  {{localhost}}/api/community/groupbuy/groupbuyJoinList
const groupbuyJoinList = (params) => wxRequest(params, baseURL + 'api/community/groupbuy/groupbuyJoinList', 'POST')
//团购报名列表-设置备注-1.1 {{localhost}}/api/community/groupbuy/addJoinMark
const addJoinMark = (params) => wxRequest(params, baseURL + 'api/community/groupbuy/addJoinMark', 'POST')
// 试题列表--1.1 {{localhost}}/api/answer/answer/questionList
const questionList = (params) => wxRequest(params, baseURL + 'api/answer/answer/questionList', 'POST')
//答题--1.1 {{test}}/api/answer/answer/questionAnswer
const questionAnswer = (params) => wxRequest(params, baseURL + 'api/answer/answer/questionAnswer', 'POST')


//附近小区帖子--1.1 {{localhost}}/api/community/community_dynamics/nearDynamics
const nearDynamics = (params) => wxRequest(params, baseURL + 'api/community/community_dynamics/nearDynamics', 'POST')


//用户转送积分--1.1  {{localhost}}/api/community/user/transferScore
const transferScore = (params) => wxRequest(params, baseURL + 'api/community/user/transferScore', 'POST')

//当前用户中心-我的领居列表-达人--1.1 /api/community/ucenter/myNeighbourDare
const myNeighbourDare = (params) => wxRequest(params, baseURL + 'api/community/ucenter/myNeighbourDare', 'POST')

//拜年列表
const newyearGreetings = (params) => wxRequest(params, baseURL + 'api/community/newyear_greetings/getList', 'POST')
// 发布内容  {{online}}/api/community/newyear_greetings/publishGreetings
const publishGreetings = (params) => wxRequest(params, baseURL + 'api/community/newyear_greetings/publishGreetings', 'POST')
//点赞功能 {{online}}/api/community/newyear_greetings/greetingsLike
const greetingsLike = (params) => wxRequest(params, baseURL + 'api/community/newyear_greetings/greetingsLike', 'POST')
//已答列表 {{online}}/api/answer/answer/resultList
const answerresultList = (params) => wxRequest(params, baseURL + 'api/answer/answer/resultList', 'POST')
//通过手机号登录 {{localhost}}/api/wxapp/public/loginByMobile
const loginByMobile = (params) => wxRequest(params, baseURL + 'api/wxapp/public/loginByMobile', 'POST')
//显示测试 {{localhost}}/api/wxapp/public/showTestLogin
const showTestLogin = (params) => wxRequest(params, baseURL + 'api/wxapp/public/showTestLogin', 'POST')
//城市 服务 /api/community/public/getJsCity
const getJsCity = (params) => wxRequest(params, baseURL + 'api/community/public/getJsCity', 'POST')
//小区图片 /api/community/communityDynamics/communityDynamics
const communityDynamicsImg =  (params) => wxRequest(params, baseURL + 'api/community/community_dynamics/communityDynamics', 'POST')
// 活动 {{test}}/api/community/activity/detail
const pactivityDetail = (params) => wxRequest(params, baseURL + 'api/community/activity/detail', 'POST')

// 更新用户信息微信（头像、昵称等） https://sq.wenlinapp.com/api/wxapp/public/updateUserInfo 
const updateUs = (params) => wxRequest(params, baseURL + 'api/wxapp/public/updateUserInfo', 'POST')

// {{online}}/api/community/Community_notices/getLastNotices
const getLastNotices = (params) => wxRequest(params, baseURL + 'api/community/Community_notices/getLastNotices', 'POST')
//{{online}}/api/community/Community_notices/detail
const getNoticesDetail = (params) => wxRequest(params, baseURL + 'api/community/Community_notices/detail', 'POST')
//{{online}}/api/community/vote/delComments 删除议事厅
const votedelComments = (params) => wxRequest(params, baseURL + 'api/community/vote/delComments', 'POST')

//核酸 
//{{online}}/api/nucleicacid/nucleic_acid/narounds

const narounds = (params) => wxRequest(params, baseURL + 'api/nucleicacid/nucleic_acid/narounds', 'POST')
//核酸打卡 

const punchclock = (params) => wxRequest(params, baseURL + 'api/nucleicacid/nucleic_acid/punchclock', 'POST')
//核酸预约

const addAppointment = (params) => wxRequest(params, baseURL + 'api/nucleicacid/nucleic_acid/addAppointment', 'POST')
//添加代打卡用户

const otherUserInfo = (params) => wxRequest(params, baseURL + 'api/nucleicacid/nucleic_acid/otherUserInfo', 'POST')
//我添加的用户列表
const myUsersList = (params) => wxRequest(params, baseURL + 'api/nucleicacid/nucleic_acid/myUsers', 'POST')
 //获取需要做核酸的小区
const getNucleicAcidCommunity = (params) => wxRequest(params, baseURL + 'api/nucleicacid/nucleic_acid/getNucleicAcidCommunity', 'POST')
 
 //获取需要做核酸的小区的楼栋
const getCommunityBuilding = (params) => wxRequest(params, baseURL + 'api/nucleicacid/nucleic_acid/getCommunityBuilding', 'POST')

//第一次添加用户

 const addUserInfo = (params) => wxRequest(params, baseURL + 'api/nucleicacid/nucleic_acid/addUserInfo', 'POST')
 
 //获取用户详情
 
  const getUserinfo = (params) => wxRequest(params, baseURL + 'api/nucleicacid/nucleic_acid/getUserinfo', 'POST')
  
  //修改用户信息
  
    const editUserinfo = (params) => wxRequest(params, baseURL + 'api/nucleicacid/nucleic_acid/editUserinfo', 'POST')

export default {
	wechatAuth,
	setUserPhoneBySecret,
	communityLogin,
	setUserCommunityInfo,
	searchCommunity,
	communityOpening,
	uploadOne,
	publishDynamics,
	publishDynamicsSell,
	publishDynamicsDaren,
	communityDynamicsDetail,
	checkUserCommunityOpening,
	getNearCommunity,
	communitySkill,
	communityDynamicsAddSkill,
	allByCommunityId,
	nearByCommunityId,
	setComments,
	delComments,
	getMultistageComments,
	getOtherUserDynamicsList,
	setFavorites,
	unsetFavorites,
	setLikes,
	unsetLikes,
	getOtherUserInfo,
	getCommunityWiki,
	getCommitteeDetail,
	getPersonnels,
	activityDetail,
	activityjoin,
	getJoinUser,
	usersetKown,
	userunSetKown,
	userleaveMessage,
	getAccusationType,
	setUserAccusation,
	communityDynamicsPushDynamics,
	getLeaveMessages,
	setLeaveMessage,
	helpDynamicsByCommunityId,
	userSaveSign,
	getWXACodeUnlimit,
	getDynamicsPushLog,
	communitydynamicswikiDetail,
	myScoreTask,
	communitydynamicswikiCorrection,
	myScoreLog,
	communityDynamicsThanksHelp,
	myCenter,
	getMyDynamicsList,
	mySysNotices,
	sysNoticesDetail,
	myNeighbour,
	myDarenInfo,
	myCommitteeList,
	updateMyDaren,
	refreshMyDynamics,
	delSysNotices,
	deleteDynamics,
	getUserDynamicsList,
	myCommunity,
	exitCommunity,
	searchDynamics,
	myUnread,
	myCommentNotices,
	myThanksNotices,
	myLeaveMessageNotices,
	ucenterMyScore,
	myFavoriteList,
	myLoveLog,
	myKownList,
	kownMyList,
	kownCount,
	dongtaiDetail,
	committeeDynamics,
	myinfo,
	updateUserInfo,
	communityDetail,
	setDefaultCommunity,
	otherUserDarenInfo,
	addSuggestion,
	inviteNeighbor,
	getScoreSetting,
	getNewNeighbor,
	publishDynamicsExposure,
	publishDynamicsYishi,
	publishDynamicsLiving,
	publishDynamicsRecruit,
	publishHelpDynamics,
	publishGroupbuy,
	dynamicsVoteDetail,
	vote,
	addDynamicsVoteVote,
	singleVoteDetail,
	voteComment,
	getVoteMultistageComments,
	getCommunityScore,
	userDonateScore,
	donateScoreList,
	groupbuyDetail,
	addMessage,
	gotoDraw,
	drawUser,
	drawDetail,
	jionGroupbuy,
	groupbuyJoinList,
	addJoinMark,
	questionList,
	questionAnswer,
	nearDynamics,
	transferScore,
	myNeighbourDare,
	newyearGreetings,
	publishGreetings,
	greetingsLike,
	answerresultList,
	loginByMobile,
	showTestLogin,
	getJsCity,
	updateUserInfo,
	communityDynamicsImg,
	publishNewthingDynamics,
	pactivityDetail,
	updateUs,
	getLastNotices,
	getNoticesDetail,
	voteCommentReply,
	votedelComments,
	narounds,
	punchclock,
	addAppointment,
	otherUserInfo,
	myUsersList,
	getNucleicAcidCommunity,
	getCommunityBuilding,
	addUserInfo,
	getUserinfo,
	editUserinfo
}
