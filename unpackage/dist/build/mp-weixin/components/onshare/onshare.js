(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/onshare/onshare"],{"22c9":function(t,n,e){"use strict";e.r(n);var o=e("8c6e"),u=e.n(o);for(var a in o)"default"!==a&&function(t){e.d(n,t,(function(){return o[t]}))}(a);n["default"]=u.a},"31d4":function(t,n,e){"use strict";var o;e.d(n,"b",(function(){return u})),e.d(n,"c",(function(){return a})),e.d(n,"a",(function(){return o}));var u=function(){var t=this,n=t.$createElement;t._self._c},a=[]},"8c6e":function(t,n,e){"use strict";(function(t){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var e={data:function(){return{}},mounted:function(){},props:{isCollect:{type:Boolean,default:!1},isShow:{type:Boolean,default:!1},pos:{type:String,default:"nohome"},isHome:{type:Boolean,default:!1},ng:{type:Boolean,default:!1}},computed:{autoFix:function(){return!0},autoShare:function(){return"android"==t.getStorageSync("platform")&&!!this.isHome}},methods:{close:function(){this.$emit("close")},onshare:function(){this.$emit("onshare")},ontodo:function(){this.$emit("ontodo")},onsend:function(){this.$emit("onsend")}}};n.default=e}).call(this,e("543d")["default"])},"9f13":function(t,n,e){},b185:function(t,n,e){"use strict";e.r(n);var o=e("31d4"),u=e("22c9");for(var a in u)"default"!==a&&function(t){e.d(n,t,(function(){return u[t]}))}(a);e("b9c6");var c,i=e("f0c5"),r=Object(i["a"])(u["default"],o["b"],o["c"],!1,null,"58b7adf6",null,!1,o["a"],c);n["default"]=r.exports},b9c6:function(t,n,e){"use strict";var o=e("9f13"),u=e.n(o);u.a}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/onshare/onshare-create-component',
    {
        'components/onshare/onshare-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("b185"))
        })
    },
    [['components/onshare/onshare-create-component']]
]);
