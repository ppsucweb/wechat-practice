var data = {
	"perception": {
		"inputText": {
			"text": ""
		},
	},
	"userInfo": {
		"apiKey": "a700c41c65de4895a164d88c98841422",
		"userId": "402413"
	}
}

// 监听plusready事件  
document.addEventListener("plusready", function() {
	// 扩展API加载完毕，现在可以正常调用扩展API
	// ...
}, false);
var text = null;

function startRecognize() {
	var options = {};
	options.engine = 'iFly';
	text = "";
	plus.speech.startRecognize(options, function(s) {
		text += s;
		document.getElementById('user-input').value = text;
	}, function(e) {
		alert("语音识别失败：" + e.message);
	});
	setTimeout(stopRecognize, 99999);
}

function stopRecognize() {
	plus.speech.stopRecognize();
}
//渲染函数
function render(turn, input) {
	var htmlText =
		`<img class="item-chat-${turn}" src="../img/FJ.jpg" />
		<div id="test1" class="chat-text-${turn}">
			<h4>${input}</h4>
		</div>`;
	var newLi = document.createElement("li");
	newLi.classList.add("user-li-" + turn);
	newLi.innerHTML = htmlText;
	document.getElementById("chat-ul").appendChild(newLi);
}

var LR = ['left', 'right'];
window.onload = function() {
	//用户按下按键时判断
	document.getElementById("user-input").onkeyup = function(){
		if(document.getElementById('user-input').value != ''){
			document.getElementById("input-sent").classList.remove("display-none");
		}else{
			document.getElementById("input-sent").classList.add("display-none");
		}
	}
	//用户点击发送按钮
	document.getElementById("input-sent").addEventListener("click", function() {
		//发送input数据到text
		var userInput = document.getElementById('user-input').value;
		if (userInput == '') {
			return false;
		}
		var test = data.perception.inputText.text;
		data.perception.inputText.text = userInput;
		//将用户输入渲染出来
		render(LR[1], userInput);
		//发送后回到页面底部
		var talkArea = document.getElementById('body');
		talkArea.scrollTop = talkArea.scrollHeight;
		//2.AJAX五部曲
		var xhr = new XMLHttpRequest();
		//创建链接
		xhr.open('POST', 'http://openapi.tuling123.com/openapi/api/v2');
		xhr.setRequestHeader("Content-type", "application/json");
		//发送请求
		var newdata = JSON.stringify(data);
		xhr.send(newdata);
		//监听状态变化
		var a;
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var cb = xhr.responseText;
				cb = eval('(' + cb + ')');
				a = cb.results[0].values.text;
				//将机器人的回复渲染出来
				render(LR[0], a);
				//发送后回到页面底部
				var talkArea = document.getElementById('body');
				talkArea.scrollTop = talkArea.scrollHeight;
			}
		}
		document.getElementById('user-input').value = '';
		document.getElementById('input-sent').classList.add('display-none');
	})
}
