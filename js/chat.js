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

window.onload = function() {
	//用户点击发送按钮
	document.getElementById("input-sent").addEventListener("click", function() {
		//发送input数据到text
		var userInput = document.getElementById('user-input').value;
		if(userInput == ''){
			return false;
		}
		var test = data.perception.inputText.text;
		data.perception.inputText.text = userInput;
		//将用户输入渲染出来
		var userLi = document.createElement("li");//用户回复总栏
		userLi.classList.add("user-li-right");
		var userImg = document.createElement("img");
		userImg.classList.add("item-chat-right");
		userImg.src = "../img/FJ.jpg";//用户头像
		var userItem = document.createElement("div");//用户回复框
		userItem.classList.add("chat-text-right");
		var userItemArrow = document.createElement("div");//回复框尖角
		userItemArrow.classList.add("arrow-right");
		var userInputText = document.createElement("h4");//用户输入
		var getInput = document.createTextNode(userInput);
		userInputText.appendChild(getInput);
		//拼接创建好的DOM
		document.getElementById("chat-ul").appendChild(userLi);
		userLi.appendChild(userImg);
		userLi.appendChild(userItem);
		userItem.appendChild(userItemArrow);
		userItem.appendChild(userInputText);
		//拼接完成后检测回复框高度避免遮挡
		var userItemHeight = userItem.offsetHeight;//获得回复框的高度
		userLi.style.height = userItemHeight + "px";
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
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4 && xhr.status == 200)
			{
				var cb = xhr.responseText;
				cb = eval('('+cb+')');
				a = cb.results[0].values.text;
				//将机器人的回复渲染出来
				var cbLi = document.createElement("li");//机器人回复总栏
				cbLi.classList.add("user-li-left");
				var cbImg = document.createElement("img");
				cbImg.classList.add("item-chat-left");
				cbImg.src = "../img/FJ.jpg";//机器人头像
				var cbItem = document.createElement("div");//机器人回复框
				cbItem.classList.add("chat-text-left");
				var cbItemArrow = document.createElement("div");//回复框尖角
				cbItemArrow.classList.add("arrow-left");
				var cbInputText = document.createElement("h4");
				var getInput = document.createTextNode(a);
				cbInputText.appendChild(getInput);
				//拼接创建好的DOM
				document.getElementById("chat-ul").appendChild(cbLi);
				cbLi.appendChild(cbImg);
				cbLi.appendChild(cbItem);
				cbItem.appendChild(cbItemArrow);
				cbItem.appendChild(cbInputText);
				//拼接完成后检测回复框高度避免遮挡
				var cbItemHeight = cbItem.offsetHeight;//获得回复框的高度
				cbLi.style.height = cbItemHeight + "px";
			}
		}
		document.getElementById('user-input').value = '';
	})
}
