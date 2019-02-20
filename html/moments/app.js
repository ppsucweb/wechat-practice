// TODO: 用户名称需修改为自己的名称
var userName = 'Jerry';
$(".user-name").text(userName);
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
		hasLiked: false,
		likes: ['Guo封面', '源小神'],
		comments: [{
			author: 'Guo封面',
			text: '你也喜欢华仔哈！！！'
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
		comments: []
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
		comments: []
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
		comments: []
	}
}];

// 相关 DOM
var $page = $('.page-moments');
var $momentsList = $('.moments-list');

/**
 * 点赞内容 HTML 模板
 * @param {Array} likes 点赞人列表
 * @return {String} 返回html字符串
 */
function likesHtmlTpl(likes) {
	if (!likes.length) {
		return '';
	}
	var htmlText = ['<div class="reply-like"><i class="icon-like-blue"></i>'];
	// 点赞人的html列表
	var likesHtmlArr = [];
	// 遍历生成
	for (var i = 0, len = likes.length; i < len; i++) {
		likesHtmlArr.push('<a class="reply-who" href="#">' + likes[i] + '</a>');
	}
	// 每个点赞人以逗号加一个空格来相隔
	var likesHtmlText = likesHtmlArr.join(', ');
	htmlText.push(likesHtmlText);
	//TODO:实现默认user点赞显示
	htmlText.push('</div>');
	return htmlText.join('');
}
/**
 * 评论内容 HTML 模板
 * @param {Array} likes 点赞人列表
 * @return {String} 返回html字符串
 */
function commentsHtmlTpl(comments) {
	if (!comments.length) {
		return '';
	}
	var htmlText = ['<div class="reply-comment">'];
	for (var i = 0, len = comments.length; i < len; i++) {
		var comment = comments[i];
		htmlText.push('<div class="comment-item"><a class="reply-who" href="#">' + comment.author + '</a>：' + comment.text +
			'</div>');
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
	htmlText.push(likesHtmlTpl(replyData.likes));
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
 * 分享消息模版
 * @param {Object} share 分享信息对象
 * @return {String} 返回html字符串
 */
function shareTpl(share) {
	var htmlText = '<a href="#"><div class="item-share"><div class="share-img"><img src=' + share.pic +
		' alt=""></div><span class="share-tt">' + share.text + '</span></div></a>';
	return htmlText;
}

/**
 * 单图片消息模版
 * @param {Object} pics 单图片消息的图片URL
 * @return {String} 返回html字符串
 */
function singlePicTpl(pics) {
	var htmlText = '<div class="item-only-img"><img src=' + pics[0] + ' alt=""></div>';
	return htmlText;
}

/**
 * 循环：消息体 
 * @param {Object} messageData 对象
 */
function messageTpl(messageData) {
	var user = messageData.user;
	var content = messageData.content;
	var htmlText = [];
	// 设置点赞菜单点赞图标默认样式
	var userHasLiked = messageData.reply.hasLiked ? "取消" : "点赞";

	htmlText.push('<div class="moments-item" data-index="0">');
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
			break;
		case 1:
			// TODO: 实现分享消息
			contentHtml = shareTpl(content.share);
			break;
		case 2:
			// TODO: 实现单张图片消息
			contentHtml = singlePicTpl(content.pics);
		case 3:
			// TODO: 实现无图片消息
			// 无图片消息需要做什么嘛◔ ‸◔?默认的不就可以了
	}
	htmlText.push(contentHtml);
	// 消息时间和回复按钮
	htmlText.push('<div class="item-ft">');
	htmlText.push('<span class="item-time">' + content.timeString + '</span>');
	htmlText.push('<div class="item-reply-btn">');
	htmlText.push('<span class="item-reply"></span>');
	htmlText.push('</div>');
	// 点赞评论菜单
	htmlText.push('<div class="reply-btn-menu"><div class="menu-like"><i class="icon-like"></i>' + userHasLiked +
		'</div><div class="menu-comment"><i class="icon-comment"></i>评论</div></div>');
	htmlText.push('</div>');
	// 消息回复模块（点赞和评论）
	htmlText.push(replyTpl(messageData.reply));
	htmlText.push('</div></div>');
	return htmlText.join('');
}


/**
 * 页面渲染函数：render
 */
function render() {
	// TODO: 目前只渲染了一个消息（多图片信息）,需要展示data数组中的所有消息数据。
	var messageHtml = "";
	for (var i = 0, len = data.length; i < len; i++) {
		messageHtml += messageTpl(data[i]);
	}
	$momentsList.html(messageHtml);
}


/**
 * 页面绑定事件函数：bindEvent
 */
function bindEvent() {
	// TODO: 完成页面交互功能事件绑定
	// 点赞评论菜单显示
	function displayMenu() {
		// TODO:一、当用户点击评论小图标时，判断对应的menu是否已经显示
		$momentsList.on("click", ".item-reply-btn", function() {
			// 设置flag用于判断菜单是否已经显示
			// 因为在第二步设置排他的时候，会影响到class，所以需要额外设置一个时钟信号记录menu的显示情况
			var flag = 0;
			if ($(this).siblings(".reply-btn-menu").hasClass("menu-display")) {
				flag = 1;
			}
			// 排他原则
			//TODO：二、将moments-list列表里所有的menu设置隐藏
			$(".menu-display").removeClass("menu-display");
			// TODO:排除异常，显示菜单
			if (flag === 0) {
				// 菜单未显示，则让其显示
				$(this).siblings(".reply-btn-menu").addClass("menu-display");
			}
			return false;
		});
		// TODO：点击moments-list空白内容产生的效果，隐藏menu、comments-input
		$momentsList.on("click", function() {
			$(".menu-display").removeClass("menu-display");
			// 评论输入框隐藏操作
			$(".comments-input").removeClass("displayed");
		});
	}
	// 点赞功能实现
	function likeMenu() {
		// TODO:实现兼容默认已点赞筛选
		$momentsList.on("click", ".menu-like", function() {
			// 获取点击点赞按钮后，同一个moments-item内的reply-zone
			var $thisReplyZone = $(this).parents(".item-ft").siblings(".reply-zone");
			// 判断user是否已经点过赞
			if ($(this).text() === "点赞") {
				$(this).html('<i class="icon-like"></i>取消');
				// 判断user是否是第一次点赞
				if ($thisReplyZone.children(".reply-like").length === 0) {
					$thisReplyZone.prepend('<div class="reply-like"><i class="icon-like-blue"></i><a href="#" class="reply-who">' +
						userName + '</a></div>');
				} else {
					$thisReplyZone.children(".reply-like").append('<a class="reply-who user-like" href="#">, ' + userName + '</a>');
				}
			} else {
				$(this).html('<i class="icon-like"></i>点赞');
				if ($thisReplyZone.find(".reply-like .reply-who").length === 1) {
					$thisReplyZone.find(".reply-like").remove();
				} else {
					$thisReplyZone.find(".user-like").remove();
				}
			}
		})
	}
	// 评论功能实现
	function commentsReal() {
		// 评论区块显隐切换
		var $thisComItem = null;
		$momentsList.on("click", ".menu-comment", function() {
			$(".comments-input").addClass("displayed");
			$(".menu-display").removeClass("menu-display");
			$thisComItem = $(this);
			return false;
		})
		$("#comments-input-text").on("input", function() {
			if ($("#comments-input-text").val()) {
				$(".send-comment").addClass("input-btn-actived");
			} else {
				$(".send-comment").removeClass("input-btn-actived");
			}
		})
		// 评论追加实现
		$(".send-comment").on("click", function() {
			var $thisReplyZone = $thisComItem.parents(".item-ft").siblings(".reply-zone");
			if ($(this).hasClass("input-btn-actived")) {
				// 判断user是否是第一次评论
				if ($thisReplyZone.children(".reply-comment").length) {
					$thisReplyZone.children(".reply-comment").append('<div class="comment-item"><a class="reply-who" href="#">' +
						userName + '</a>：' + $("#comments-input-text").val() + '</div>');
				} else {
					$thisReplyZone.append('<div class="reply-comment"><div class="comment-item"><a class="reply-who" href="#">' +
						userName + '</a>：' + $("#comments-input-text").val() + '</div></div>');
				}
				$("#comments-input-text").val("");
				$(".send-comment").removeClass("input-btn-actived");
				$(".comments-input").removeClass("displayed");
			}
		})
	}


	// 图片展示功能实现
	// TODO：用一个全屏fixed的flex大盒子包裹一个垂直居中的img，src通过点击时间获取并缓存
	function imgDisplay() {
		$(".img-display-wrap").on("click", function() {
			$(this).removeClass("displayed").empty();
			return false;
		})
		$momentsList.on("click", ".pic-item", function() {
			// 获取被点击图片的src
			var $imgSrc = $(this).attr("src");
			$(".img-display-wrap").addClass("displayed").append('<img src=' + $imgSrc + ' alt="">');
		})
		$momentsList.on("click", ".item-only-img", function() {
			// 获取被点击图片的src
			var $imgSrc = $(this).find("img").prop("src");//获得图片完整路径
			$(".img-display-wrap").addClass("displayed").append('<img src=' + $imgSrc + ' alt="">');
		})
	}

	displayMenu();
	likeMenu();
	imgDisplay();
	commentsReal();
}

/**
 * 页面入口函数：init
 * 1、根据数据页面内容
 * 2、绑定事件
 */
function init() {
	// 渲染页面
	render();
	bindEvent();
}

init();
