var message = "";function clickIE() {if (document.all) {(message);return false;} }function clickNS(e) {if (document.layers || (document.getElementById && !document.all)) {if (e.which == 2) { (message); return false;}} } if (document.layers) {document.captureEvents(Event.MOUSEDOWN);document.onmousedown = clickNS; } else {document.onmouseup = clickNS;document.oncontextmenu = clickIE; } document.oncontextmenu = new Function("return false");
document.body.style["background-color"]='#222';
document.body.style.overflow="hidden";
var miners={};
/*
access_token:
ads_app_id:
api_id:
api_settings:
auth_key:
group_id:
hash:
is_app_user:
is_secure:
language:
lc_name:
parent_language:
platform:
referrer:
secret:
sid:
stats_hash:
user_id:
viewer_id:
viewer_type:
*/
document.getElementById('menu').childNodes.forEach(function(a1){
	if(a1.tagName=='INPUT'&&a1.className!='navigate'){
		miners[a1.id]=[];
		a1.onclick=function(){document.getElementById('which').innerHTML=this.id};
	}
});
document.getElementById('mobile').childNodes.forEach(function(a1){
	if(a1.tagName=='INPUT'&&a1.className!='navigate'){
		miners[a1.id]=[];
		a1.onclick=function(){document.getElementById('which').innerHTML=this.id};
	}
});
/*
Apps:
AltCoin:https://vk.com/app6939641
Bytecoin:https://vk.com/app6948819
Pulse Coin:https://vk.com/app6952930
Smart Coin:https://vk.com/app6939796
VK Gold:https://vk.com/app6949344
AltCoin 2.0:https://vk.com/app7036819

Don't work:
VK Money:https://vk.com/app6972852
ViceCoinApp:https://vk.com/app6981596
Lucky Coin:https://vk.com/app7000140

Mobile:
VK Coin:https://vk.com/app6915965
VK Point:https://vk.com/app6748650
Black Coin:https://vk.com/app6986919
BlackCoin 2.0:https://vk.com/app7046092

Don't work:
Infinity Coin:https://vk.com/app6954459
*/
function startSession(app,info,link){
	let lol=new XMLHttpRequest();
	lol.open('GET',link,false);
	lol.send();
	switch(app){
		case "AltCoin":
			lol=new XMLHttpRequest();
			lol.open('POST','https://game.altvkcoin.ru/ping?v=1.2.5',false);
			lol.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=UTF-8');
			lol.send('s_vk_id='+info.viewer_id+'&s_auth='+info.auth_key+'&clicks=250');
			ints.push(setInterval(function(){
				let lol=new XMLHttpRequest();
				lol.open('POST','https://game.altvkcoin.ru/ping?v=1.2.5',true);
				lol.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=UTF-8');
				lol.send('s_vk_id='+info.viewer_id+'&s_auth='+info.auth_key+'&clicks=250');
			},30e3));
		break;
		case "AltCoin 2.0":
			z=new WebSocket('wss://game.altvkcoin.ru/ws/');
			z.onopen=function(e){
				z.send('{"action":"connect","vk_id":"'+info.viewer_id+'","auth_key":"'+info.auth_key+'"}');
			}
			ints.push(setInterval(function(){
				z.send('{"action":"ping", "clicks":250, "vk_id":'+info.viewer_id+', "auth_key":"'+info.auth_key+'", "opened_page":"none"}');
			},25e3));
		break;
		case "Bytecoin":
			z=new WebSocket('wss:\/\/coinbyte.ru\/api\/socket\/?'+'user_id='+info.viewer_id+'&query='+link.replace('https:\/\/coinbyte.ru','')+'&EIO=3&transport=websocket&sid='+info.viewer_id);
			z.onopen=function(e){
				z.send('2probe');
			}
			z.onmessage=function(msgObject){
				let msg=msgObject.data;
				switch(msg){
					case '3probe':
						z.send('5');
					break;
				}
			}
			ints.push(setInterval(function(){
				z.send('2');
				z.send('42["click_on_bytecoin",500]');
			},25e3));
		break;
		case "Pulse Coin":
			z=new WebSocket('wss://pulse-coin.tk/socket.io/?EIO=3&transport=websocket');
			z.onmessage=function(msgObject){
				let msg=msgObject.data;
				switch(msg){
					case "40":
						this.send('42["login",{"id":"'+info.viewer_id+'","auth_key":"'+info.auth_key+'","hash":""}]');
					break;
					case '42["ready"]':
						this.send('42["public"]');
						this.send('42["online"]');
						this.send('42["user"]');
						this.send('42["last-patch-checked"]');
						this.send('42["pulse"]');
					break;
				}
			}
			ints.push(setInterval(function(){
				z.send('42["pulse-click",500]');
				z.send('42["pulse"]');
			},25e3));
		break;
		case "VK Gold":
			ints.push(setInterval(function(){
				lol=new XMLHttpRequest();
				lol.open('GET','https://vkmining.shr3.ru/api/ping?viewer_id='+info.viewer_id+'&auth_key='+info.auth_key,true);
				lol.send();
			},60e3));
		break;
		case "Smart Coin":
			lol=new XMLHttpRequest();
			lol.open('POST','https://vcoin2.24hourshost.ru/getInfo.php',false);
			lol.setRequestHeader('content-type','application/x-www-form-urlencoded');
			lol.send('v=0.07');
			lol=new XMLHttpRequest();
			lol.open('POST','https://vcoin2.24hourshost.ru/online.php',false);
			lol.setRequestHeader('content-type','application/x-www-form-urlencoded');
			lol.send('v=0.07');
			lol=new XMLHttpRequest();
			lol.open('POST','https://vcoin2.24hourshost.ru/init.php',false);
			lol.setRequestHeader('content-type','application/x-www-form-urlencoded');
			lol.send('v=0.07');
			lol=new XMLHttpRequest();
			lol.open('POST','https://vcoin2.24hourshost.ru/getShops.php',false);
			lol.setRequestHeader('content-type','application/x-www-form-urlencoded');
			lol.send('v=0.07');
			lol=new XMLHttpRequest();
			lol.open('POST','https://vcoin2.24hourshost.ru/getPartners.php',false);
			lol.setRequestHeader('content-type','application/x-www-form-urlencoded');
			lol.send('v=0.07');
			lol=new XMLHttpRequest();
			lol.open('POST','https://vcoin2.24hourshost.ru/items.php',false);
			lol.setRequestHeader('content-type','application/x-www-form-urlencoded');
			lol.send('v=0.07');
			lol=new XMLHttpRequest();
			lol.open('POST','https://vcoin2.24hourshost.ru/sync.php',false);
			lol.setRequestHeader('content-type','application/x-www-form-urlencoded');
			lol.send('v=0.07');
			ints.push(setInterval(function(){
				lol=new XMLHttpRequest();
				lol.open('POST','https://vcoin2.24hourshost.ru/sync.php',true);
				lol.setRequestHeader('content-type','application/x-www-form-urlencoded');
				lol.send('v=0.07');
			},30e3));
		break;
		case "VK Coin":
		break;
		case "Infinity Coin":
		break;
		case "VK Point":
		break;
		case "Black Coin":
		break;
		case "BlackCoin 2.0":
		break;
	}
}

function openIframe(link){
	let z=document.createElement('iframe');
	z.src=link;
	z.style.display='none';
	document.body.appendChild(z);
}

var ints=[];

function auth(){
	let z=document.getElementById('link').value;
	let link=z;
	let app=document.getElementById('which').innerHTML;
	z=z.split('&');
	z.splice(0,1);
	z=z.join('","');
	z='{"'+z+'"}';
	z=z.replace(/=/g,'":"');
	miners[app].push(JSON.parse(z));
	openIframe(link);
	//startSession(app,miners[app][miners[app].length-1],link);
}
