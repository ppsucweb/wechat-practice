// TODO: 用户名称需修改为自己的名称
var userName = 'Lu仔酱';
// 朋友圈页面的数据
var data = [{
	user: {
		name: '阳和',
		avatar: './img/avatar2.png'
	},
	content: {
		type: 0, // 多图片消息
		text: '华仔真棒，新的一年继续努力！',
		pics: ['./img/reward1.png', './img/reward2.png', './img/reward3.png', './img/reward4.png'],
		share: {},
		timeString: '3分钟前'
	},
	reply: {
		type: 0,
		hasLiked: false,
		likes: ['Guo封面', '源小神'],
		comments: [{
			author: 'Guo封面',
			text: '你也喜欢华仔哈！！！',
			type: 0,
		}, {
			author: '喵仔zsy',
			text: '华仔实至名归哈'
		}]
	}
}, {
	user: {
		name: '伟科大人',
		avatar: './img/avatar3.png'
	},
	content: {
		type: 1, // 分享消息
		text: '全面读书日',
		pics: [],
		share: {
			pic: 'http://coding.imweb.io/img/p3/transition-hover.jpg',
			text: '飘洋过海来看你'
		},
		timeString: '50分钟前'
	},
	reply: {
		hasLiked: false,
		likes: ['阳和'],
		comments: [{
			type: 1
		}]
	}
}, {
	user: {
		name: '深圳周润发',
		avatar: './img/avatar4.png'
	},
	content: {
		type: 2, // 单图片消息
		text: '很好的色彩',
		pics: ['http://coding.imweb.io/img/default/k-2.jpg'],
		share: {},
		timeString: '一小时前'
	},
	reply: {
		hasLiked: false,
		likes: [],
		comments: [{
			type: 2
		}]
	}
}, {
	user: {
		name: '喵仔zsy',
		avatar: './img/avatar5.png'
	},
	content: {
		type: 3, // 无图片消息
		text: '以后咖啡豆不敢浪费了',
		pics: [],
		share: {},
		timeString: '2个小时前'
	},
	reply: {
		hasLiked: false,
		likes: [],
		comments: [{
			type: 3
		}]
	}
}];
// 相关 DOM
var $page = document.querySelector('.page-moments');
var $momentsList = document.querySelector('.moments-list');

/**
 * 点赞内容 HTML 模板
 * @param {Array} likes 点赞人列表
 * @return {String} 返回html字符串
 */
function likesHtmlTpl(likes, comments) {
	/*if (!likes.length) {
		return '';
	}*/
	var htmlText = ['<div  id="reply-like" class="reply-like"><i class="icon-like-blue"></i>'];
	// 点赞人的html列表
	var likesHtmlArr = [];
	// 遍历生成
	for (var i = 0, len = likes.length; i < len; i++) {
		likesHtmlArr.push('<a class="reply-who" href="#">' + likes[i] + '</a>');
	}
	// 每个点赞人以逗号加一个空格来相隔
	var likesHtmlText = likesHtmlArr.join(', ');
	htmlText.push(likesHtmlText);
	htmlText.push('<a id="new-like" value=1 class="reply-who" href="#"></a>');
	htmlText.push('</div>');
	return htmlText.join('');
}
/**
 * 评论内容 HTML 模板
 * @param {Array} likes 点赞人列表
 * @return {String} 返回html字符串
 */
function commentsHtmlTpl(comments) {
	/*if (comments.length < 2) {
		return '';
	}*/
	var htmlText = ['<div id="reply-comment" class="reply-comment">'];
	for (var i = 0, len = comments.length; i < len; i++) {
		var comment = comments[i];
		htmlText.push('<div class="comment-item"></div>');
		if (comments.length > 1) {
			htmlText.push('<a class="reply-who" href="#">' + comment.author + '</a>：' + comment.text);
		}
	}
	htmlText.push('</div>');
	return htmlText.join('');
}
/**
 * 评论点赞总体内容 HTML 模板
 * @param {Object} replyData 消息的评论点赞数据
 * @return {String} 返回html字符串
 */
function replyTpl(replyData) {
	var htmlText = [];
	htmlText.push('<div class="reply-zone">');
	htmlText.push(likesHtmlTpl(replyData.likes, replyData.comments));
	htmlText.push(commentsHtmlTpl(replyData.comments));
	htmlText.push('</div>');
	return htmlText.join('');
}
/**
 * 多张图片消息模版 （可参考message.html）
 * @param {Object} pics 多图片消息的图片列表
 * @return {String} 返回html字符串
 */
function multiplePicTpl(pics) {
	var htmlText = [];
	htmlText.push('<ul class="item-pic">');
	for (var i = 0, len = pics.length; i < len; i++) {
		htmlText.push('<img class="pic-item" src="' + pics[i] + '">')
	}
	htmlText.push('</ul>');
	return htmlText.join('');
}
/**
 * 分享页面拼接函数
 */
function share_page(pics, text) {
	var htmlText = [];
	htmlText.push('<ul class="item-pic share-item-pic">');
	htmlText.push('<img class="pic-item share-pic-item" src="http://coding.imweb.io/img/p3/transition-hover.jpg" />');
	htmlText.push('<p style="line-height: 45px;padding-left: 50px;">' + text + '</p>');
	htmlText.push('</ul>');
	return htmlText.join('');
}
/**
 * 单图片页面拼接函数
 */
function onepic(pics) {
	var htmlText = [];
	htmlText.push('<ul class="item-pic">');
	htmlText.push('<img class="pic-item onepic-pic-item" src="' + pics + '">');
	htmlText.push('</ul>');
	return htmlText.join('');
}
/**
 * 循环：消息体 
 * @param {Object} messageData 对象
 */
function messageTpl(messageData) {
	var a = "点赞";
	var b = "评论";
	var c = "发送";
	var user = messageData.user;
	var content = messageData.content;
	var htmlText = [];
	htmlText.push('<div id="page-div" class="moments-item" data-index="0">');
	htmlText.push('<div id="new-reply" class="new-reply-item new-reply-item-before">');
	htmlText.push('<input id="get-reply" class="get-reply-item">');
	htmlText.push('<button id="sent" class="new-reply-button">' + c + '</button>');
	htmlText.push('</div>');
	// 消息用户头像
	htmlText.push('<a class="item-left" href="#">');
	htmlText.push('<img src="' + user.avatar + '" width="42" height="42" alt=""/>');
	htmlText.push('</a>');
	// 消息右边内容
	htmlText.push('<div class="item-right">');
	// 消息内容-用户名称
	htmlText.push('<a href="#" class="item-name">' + user.name + '</a>');
	// 消息内容-文本信息
	htmlText.push('<p class="item-msg">' + content.text + '</p>');
	// 消息内容-图片列表 
	var contentHtml = '';
	// 目前只支持多图片消息，需要补充完成其余三种消息展示
	switch (content.type) {
		// 多图片消息
		case 0:
			contentHtml = multiplePicTpl(content.pics);
			htmlText.push(contentHtml);
			break;
		case 1:
			// TODO: 实现分享消息
			contentHtml = share_page(content.share.pics, content.share.text);
			htmlText.push(contentHtml);
			break;
		case 2:
			// TODO: 实现单张图片消息
			contentHtml = onepic(content.pics);
			htmlText.push(contentHtml);
			break;
		case 3:
			// TODO: 实现无图片消息
			htmlText.push(contentHtml);
			break;
	}
	htmlText.push('<div class="item-ft">');
	htmlText.push('<span class="item-time">' + content.timeString + '</span>');
	htmlText.push('<div id="reply-item" class="buttom-content buttom-content-before">');
	htmlText.push(
		'<button id="likes-buttom" type="button" class="mui-btn  mui-btn-block item-buttom "><i class="icon-like"></i>' + a +
		'</button>');
	htmlText.push(
		'<button id="comments-buttom" type="button" class="mui-btn  mui-btn-block item-buttom "><i class="icon-comment"></i>' +
		b + '</button>');
	htmlText.push('</div>');
	htmlText.push('<div id="reply" class="item-reply-btn">');
	htmlText.push('<span class="item-reply"></span>');
	htmlText.push('</div></div>');
	// 消息回复模块（点赞和评论）
	htmlText.push(replyTpl(messageData.reply));
	htmlText.push('</div></div>');
	// 图片弹出层
	htmlText.push('<div id="outerdiv" class="outerdiv new-reply-item-before">');
	htmlText.push('<div id="innerdiv" class="innerdiv">');
	htmlText.push('<img id="bigimg" src=""');
	htmlText.push('</div></div>');
	return htmlText.join('');
}

var len = data.length;
var replyLike = [];
var newLike = []
var replyComments = []
var reply = [];
var replyItem = [];
var likesButtom = [];
var commentsButtom = [];
var newReply = [];
var getReply = [];
var sent = [];
/**
 * 页面渲染函数：render
 */
function render() {
	// TODO: 目前只渲染了一个消息（多图片信息）,需要展示data数组中的所有消息数据。
	for (var i = 0; i < len; i++) {
		var messageHtml = messageTpl(data[i]);
		$momentsList.innerHTML += messageHtml;
		//回复按钮id赋予
		reply.push('reply' + i);
		replyItem.push('reply-item' + i);
		likesButtom.push('likes-buttom' + i);
		commentsButtom.push('comments-buttom' + i);
		document.getElementById("reply").id = reply[i];
		document.getElementById("reply-item").id = replyItem[i];
		document.getElementById("likes-buttom").id = likesButtom[i];
		document.getElementById("comments-buttom").id = commentsButtom[i];
		//点赞按钮id赋予
		replyLike.push('reply-like' + i);
		document.getElementById("reply-like").id = replyLike[i];
		//新点赞人id赋予
		newLike.push('new-like' + i);
		document.getElementById("new-like").id = newLike[i];
		//评论按钮id赋予
		replyComments.push('reply-comment' + i);
		document.getElementById("reply-comment").id = replyComments[i];
		//评论输入框和发送按钮id赋予
		newReply.push('new-reply' + i);
		getReply.push('get-reply' + i);
		sent.push('sent' + i);
		document.getElementById("new-reply").id = newReply[i];
		document.getElementById("get-reply").id = getReply[i];
		document.getElementById("sent").id = sent[i];
		//若无点赞评论人则隐藏点赞评论框
		var likes = data[i].reply.likes;
		if (likes == '') {
			document.getElementById(replyLike[i]).classList.add('new-reply-item-before');
		}
		var comments = data[i].reply.comments;
		if (comments.length < 2) {
			document.getElementById(replyComments[i]).classList.add('new-reply-item-before');
		}

	}
}

/**
 * 页面绑定事件函数：bindEvent
 */
function bindEvent() {
	window.onload = function() {
		document.getElementById("sent0").style.background = "#EFEFF4";

		//用户按下按键时判断
		document.getElementById("get-reply0").onkeydown = function() {
			if (document.getElementById("get-reply0").value == "") {
				document.getElementById("sent0").style.background = "#EFEFF4";
				document.getElementById("sent0").onclick = function() {
					return false;
				};
			} else {
				document.getElementById("sent0").style.background = "#4CD964";
			}
		}
	}
	// TODO: 完成页面交互功能事件绑定
	// 多图片消息回复按钮监听
	document.getElementById('reply0').addEventListener("click", function() {
		document.getElementById("reply-item0").classList.remove("buttom-content-before");
	}, true)
	//多图片消息点赞按钮监听
	document.getElementById('likes-buttom0').addEventListener("click", function() {
		var a = document.getElementById('new-like0');
		if (a.value != 0) {
			a.innerHTML = ", " + userName;
			document.getElementById('likes-buttom0').innerHTML = "<i class=\"icon-like\"></i>取消";
			a.value = 0;
		} else {
			a.innerHTML = ''
			document.getElementById('likes-buttom0').innerHTML = "<i class=\"icon-like\"></i>点赞";
			a.value = 1;
		}
	}, true)
	//多图片消息评论按钮监听
	document.getElementById('comments-buttom0').addEventListener("click", function() {
		document.getElementById("new-reply0").classList.remove("new-reply-item-before")
	}, true)
	document.getElementById('sent0').addEventListener("click", function() {
		var a = document.getElementById("get-reply0").value; //获得用户输入
		if (a != '') {
			var i = document.createElement("div");
			var h = document.getElementById('reply-comment0');
			h.appendChild(i);
			i.classList.add('comment-item')
			i.innerHTML = "<a class=\"reply-who\" href=\"#\">" + userName + "</a>：" + a
			document.getElementById("new-reply0").classList.add("new-reply-item-before")
			document.getElementById("get-reply0").value = '';
			document.getElementById("sent0").style.background = "#EFEFF4";
		}
	}, true)
	//多图片消息点击空白处收起
	document.getElementById("body").addEventListener("click", function() {
		document.getElementById('reply-item0').classList.add("buttom-content-before");
	}, true)
	// 分享消息回复按钮监听
	document.getElementById('reply1').addEventListener("click", function() {
		document.getElementById("reply-item1").classList.remove("buttom-content-before");
	}, true)
	//分享消息点赞按钮监听
	document.getElementById('likes-buttom1').addEventListener("click", function() {
		var a = document.getElementById('new-like1');
		if (a.value != 0) {
			a.innerHTML = ", " + userName;
			document.getElementById('likes-buttom1').innerHTML = "<i class=\"icon-like\"></i>取消";
			a.value = 0;
		} else {
			a.innerHTML = ''
			document.getElementById('likes-buttom1').innerHTML = "<i class=\"icon-like\"></i>点赞";
			a.value = 1;
		}
	}, true)
	document.getElementById("body").addEventListener("click", function() {
		document.getElementById('reply-item1').classList.add("buttom-content-before");
	}, true)
	// 单图片消息回复按钮监听
	document.getElementById('reply2').addEventListener("click", function() {
		document.getElementById("reply-item2").classList.remove("buttom-content-before");
	}, true)
	//单图片消息点赞按钮监听
	document.getElementById('likes-buttom2').addEventListener("click", function() {
		var a = document.getElementById('new-like2');
		if (a.value != 0) {
			document.getElementById(replyLike[2]).classList.remove('new-reply-item-before');
			a.innerHTML = ", " + userName;
			document.getElementById('likes-buttom2').innerHTML = "<i class=\"icon-like\"></i>取消";
			a.value = 0;
		} else {
			document.getElementById(replyLike[2]).classList.add('new-reply-item-before');
			a.innerHTML = ''
			document.getElementById('likes-buttom2').innerHTML = "<i class=\"icon-like\"></i>点赞";
			a.value = 1;
		}
	}, true)
	document.getElementById("body").addEventListener("click", function() {
		document.getElementById('reply-item2').classList.add("buttom-content-before");
	}, true)
	// 无图片消息回复按钮监听
	document.getElementById('reply3').addEventListener("click", function() {
		document.getElementById("reply-item3").classList.remove("buttom-content-before");
	}, true)
	document.getElementById("body").addEventListener("click", function() {
		document.getElementById('reply-item3').classList.add("buttom-content-before");
	}, true)
}

function bindEvent2() {
	//委拖给body
	window.onload = function() {
		var Body = document.getElementById("body");
		Body.onclick = function(ev) {
			var ev = ev || window.event;
			var target = ev.target || ev.srcElement;
			//点击出现回复按钮
			if (target.nodeName.toLocaleLowerCase() == 'div') {
				for (var i = 0; i < len; i++) {
					var a = reply[i];
					var b = replyItem[i];
					replyCp(a, b);
				}

				function replyCp(a, b) {
					document.getElementById(a).addEventListener("click", function() {
						document.getElementById(b).classList.remove("buttom-content-before");
					}, true);
					document.getElementById("body").addEventListener("click", function() {
						document.getElementById(b).classList.add("buttom-content-before");
					}, true);
				}
			}
			//点赞
			if (target.nodeName.toLocaleLowerCase() == 'button') {
				for (var i = 0; i < len; i++) {
					var c = likesButtom[i];
					var d = newLike[i];
					var f = replyLike[i];
					var like = data[i].reply.likes;
					likeCp(c, d, f, like);
				}

				function likeCp(c, d, f, like) {
					document.getElementById(c).addEventListener("click", function() {
						var a = document.getElementById(d);
						if (a.value != 0) {
							if (like == '') {
								document.getElementById(f).classList.remove('new-reply-item-before');
								a.innerHTML = userName;
								document.getElementById(c).innerHTML = "<i class=\"icon-like\"></i>取消";
								a.value = 0;
							} else {
								a.innerHTML = ", " + userName;
								document.getElementById(c).innerHTML = "<i class=\"icon-like\"></i>取消";
								a.value = 0;
							}
						} else {
							if (like == '') {
								document.getElementById(f).classList.add('new-reply-item-before');
							}
							a.innerHTML = ''
							document.getElementById(c).innerHTML = "<i class=\"icon-like\"></i>点赞";
							a.value = 1;
						}
					}, true)
				}
			}
			//评论
			if (target.nodeName.toLocaleLowerCase() == 'button') {
				for (var i = 0; i < len; i++) {
					var h = commentsButtom[i];
					var j = newReply[i];
					var k = getReply[i];
					var l = sent[i];
					var m = replyComments[i];
					commentCp(h, j, k, l, m);
					conlsent(l, k);
				}

				function conlsent(l, k) {
					//document.getElementById(l).style.background = "#EFEFF4";
					//用户按下按键时判断
					document.getElementById(k).onkeyup = function() {
						if (document.getElementById(k).value == "") {
							document.getElementById(l).style.background = "#EFEFF4";
							document.getElementById(l).onclick = function() {
								return false;
							};
						} else {
							document.getElementById(l).style.background = "#4CD964";
						}
					}
				}

				function commentCp(h, j, k, l, m) {
					document.getElementById(h).addEventListener("click", function() {
						document.getElementById(j).classList.remove("new-reply-item-before")
					}, true)
					document.getElementById(l).addEventListener("click", function() {
						var a = document.getElementById(k).value; //获得用户输入
						if (a != '') {
							var i = document.createElement("div");
							var h = document.getElementById(m);
							h.appendChild(i);
							i.classList.add('comment-item')
							i.innerHTML = "<a class=\"reply-who\" href=\"#\">" + userName + "</a>：" + a
							document.getElementById(j).classList.add("new-reply-item-before")
							document.getElementById(k).value = '';
							document.getElementById(l).style.background = "#EFEFF4";
							document.getElementById(m).classList.remove('new-reply-item-before');
						}
					}, true)
				}
			}
			//图片放大
			if (target.nodeName.toLocaleLowerCase() == 'img') {
				var imgSrc = target.src;
				document.getElementById('bigimg').src = imgSrc;
				document.getElementById('outerdiv').classList.remove("new-reply-item-before");
				document.getElementById('outerdiv').addEventListener('click', function() {
					document.getElementById('outerdiv').classList.add("new-reply-item-before");
				});
			}
		}
	}
}


/**
 * 页面入口函数：init
 * 1、根据数据页面内容
 * 2、绑定事件
 */
function init() {
	// 渲染页面
	render();
	bindEvent2();
}

init();