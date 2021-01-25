const appid = 'wx84b740e715665e3c'
const sec = '620e225734b322d7530cd99369b4c50f'
const mapkey = 'RMLBZ-A3WHU-2FWV7-45MEW-X2YZH-LJBNX'
var  upload = 'https://sq.wenlinapp.com/upload/'
var minUrl = 'https://sq.wenlinapp.com/upload/mini/'
var  baseURL = 'https://sq.wenlinapp.com/'
const type = 'wxapp'
const flag = 'update'
if(flag == 'test'){
	 baseURL = 'https://gx.wenlinapp.com/'
	 upload = 'https://gx.wenlinapp.com/upload/'
}
const subscription = {
	comment:'WKmoq7K1gmAiAhnzQqUK_9s2CGv87zk8iD_8yeU0X38',
	vote:'wedVxVL7kxxEMfcnjhVgWCottnrhwHzZ9SYZaWiGs48',
	jointuan:'8acnia-tVCSVzY49oVA3jteQCh1qhxrEc9DIfpsEIfg'
}
module.exports = {
	appid,
	sec,
	mapkey,
	type,
	baseURL,
	upload,
	subscription,
	minUrl
}