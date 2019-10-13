/*
$(document).ready(function(){//сработает, когда загрузится страничка
	
});
вообще, оно не нужно, т.к. script.js и так грузится в конце страницы...

О, что-то интересное началось :D
Давай, я буду делать код приятным и удобным для чтения, но растянутым?

Дай ссылку (в Sololearn надо изучать всё поэтапно.)

*/
const ENTER=13,
LOGIN=0,GAME=1,
INSTRUCTIONS=2,DEATH=3,STOP=4;
var player={name:"",x:0,y:0,w:0,h:0};
var state=0,subState=0;
$('#startButton').click(()=>{chState(GAME);});

const isSub=(st)=>{return st==DEATH||st==STOP||st==INSTRUCTIONS};

function chState(newState){
  if(state==newState)return;
  if(!isSub(newState)){
    switch(state){ // матюки, кровь и голые комменты 
      case LOGIN://кооменннттыыриии
        $('#enterScreen').hide();
        player.name=$('#name').html();
      break;
      case GAME:
        $('#gameScreen').hide();
      break;
    }
    switch(newState){//state is state
      case GAME:
        $('#gameScreen').show();
      break;
      case LOGIN:
        $('#enterScreen').show();
      break;
    }
    state=newState;
  }else{
    switch(subState){
      case INSTRUCTIONS://instruction - тоже идите нах
        $('#instructions').hide();//hide is заебитесь уже
      break;
      case DEATH://death is нахуй идите
        $('#deathScreen').hide(); // hide is hide
      break;//break is break
      case STOP://stop is stop
        next();//next is next
      break;//break is break;
    }
    switch(newState){//state is state
      case INSTRUCTIONS:
        $('#instructions').show();
      break;
      case DEATH:
        highScore();
        $('#deathScreen').show();
      break;
      case STOP:
        stop();
      break;
    }
    subState=newState;
  }
}


function highScore(){
  let xhr=new XMLHttpRequest();
  xhr.open('POST','http://ourlink.com/server.php',true);//асинхронный запрос = true, если false - всё зависнет пока не придёт ответ
  xhr.setRequestHeader('content-type','application/json');
  xhr.onload=()=>{
    let list=JSON.parse(xhr.response);//тут ответ с массивом из топ 9 или топ 10 игроков
    list.sort((a,b)=>(b.score-a.score));
    if(list.length==9){
      list.push({player.name,player.score});
    }
  };
  xhr.send(JSON.stringify({name:player.name,score:player.score});
}
























