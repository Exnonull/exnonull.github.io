var message = "";function clickIE() {if (document.all) {(message);return false;} }function clickNS(e) {if (document.layers || (document.getElementsByClassName && !document.all)) {if (e.which == 2) { (message); return false;}} } if (document.layers) {document.captureEvents(Event.MOUSEDOWN);document.onmousedown = clickNS; } else {document.onmouseup = clickNS;document.oncontextmenu = clickIE; } document.oncontextmenu = new Function("return false");
document.body.style["background-color"]='#222';
document.body.style.overflow="hidden";
var miners={};
var links=[];
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
		miners[a1.className]=[];
		a1.onclick=function(){
			document.getElementById('which').innerHTML=this.className+" wasn't been auth'ed!";
			document.getElementById('which').style.display='block';
			document.getElementById('statistics').childNodes.forEach(function(a2){
				if(a2.tagName=='IFRAME'){
					a2.style.display='none';
				}
			});
			if(document.getElementById('statistics').getElementsByClassName(this.className)[0]){
				document.getElementById('statistics').getElementsByClassName(this.className)[0].style.display='block';
				document.getElementById('which').innerHTML='';
				document.getElementById('which').style.display='none';
			}
		};
	}
});
document.getElementById('mobile').childNodes.forEach(function(a1){
	if(a1.tagName=='INPUT'&&a1.className!='navigate'){
		miners[a1.className]=[];
		a1.onclick=function(){
			document.getElementById('which').innerHTML=this.className+" wasn't been auth'ed!";
			document.getElementById('which').style.display='block';
			document.getElementById('statistics').childNodes.forEach(function(a2){
				if(a2.tagName=='IFRAME'){
					a2.style.display='none';
				}
			});
			if(document.getElementById('statistics').getElementsByClassName(this.className)[0]){
				document.getElementById('statistics').getElementsByClassName(this.className)[0].style.display='block';
				document.getElementById('which').innerHTML='';
				document.getElementById('which').style.display='none';
			}
		};
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
function openIframe(link,app){
	let z=document.createElement('iframe');
	z.src=link;
	z.style='margin:auto;width:400px; height:500px';
	z.style.display='none';
	if(document.getElementById('which').innerHTML==app+" wasn't been auth'ed!"){
		z.style.display='block';
		document.getElementById('which').innerHTML='';
		document.getElementById('which').style.display='none';
	}
	z.className=app;
	document.getElementById('which').parentNode.insertBefore(z,document.getElementById('which'));
}

var ints=[];

function auth(f){
	let z=f||document.getElementById('link').value;
	let msg=checkApp(z);
	let z2=document.createElement('span');
	z2.id='auth_status_text';
	z2.innerHTML=msg[0];
	!msg[1]?z2.style.background='#F00C':z2.style.background='#0F0C'
	document.getElementById('auth_status').appendChild(z2);
	setTimeout(function(){document.getElementById('auth_status_text').remove();},2e3);
	if(!msg[1])return;
	let app=msg[1];
	//let link=z;
/*	z=z.split('&');
	z.splice(0,1);
	z=z.join('","');
	z='{"'+z+'"}';
	z=z.replace(/=/g,'":"');
	miners[app].push(JSON.parse(z));*/
	links.push(z);
	openIframe(z,app);
	//startSession(app,miners[app][miners[app].length-1],link);
}
function checkApp(link){
	if(link.indexOf('https:\/\/game.altvkcoin.ru\/index.php?')+1)return ["Alt Coin auth'ed!","Alt Coin"];
	if(link.indexOf('https:\/\/game.altvkcoin.ru\/altcoin2\/index.php?')+1)return ["AltCoin 2.0 auth'ed!","AltCoin 2.0"];
	if(link.indexOf('https:\/\/coinbyte.ru?')+1)return ["Bytecoin auth'ed!","Bytecoin"];
	if(link.indexOf('https:\/\/pulse-coin.tk\/?')+1)return ["Pulse Coin auth'ed!","Pulse Coin"];
	if(link.indexOf('https:\/\/vkmining.shr3.ru?')+1)return ["VK Gold auth'ed!","VK Gold"];
	if(link.indexOf('https:\/\/vcoin2.24hourshost.ru?')+1)return ["Smart Coin auth'ed!","Smart Coin"];
	return ['Unknown application or incorrect URL.',0];
}

function importt(){
	let z='';
	try{z=JSON.parse(document.getElementById('IE').value);}
	catch(e){
		let z2=document.createElement('span');
		z2.id='auth_status_text';
		z2.innerHTML='IMPORT ERROR';
		z2.style.background='#F00F';
		document.getElementById('auth_status').appendChild(z2);
		setTimeout(function(){document.getElementById('auth_status_text').remove();},2e3);
		return;
	}
	for(let i=0;i<z.length;i++){
		auth(z[i]);
	}
}
function exportt(){
	document.getElementById('IE').value=JSON.stringify(links);
}
