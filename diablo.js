(function() {

var floor = document.getElementById("floor").getContext("2d");

function getImage(url){ var i = new Image(); i.src = url; return i};
var tileMap = {
	0: getImage("texture/tileable-grey.png"),
	1: getImage("texture/dirtsand.png"),
	2: getImage("texture/tileable-grey.png"),
};
var spriteMap = {
	2: getImage("sprite/house.png"),
};

// sprites for hero
var heroMap = {stand:[],anim:{}};
for(var i=1;i<=8;i++){
	heroMap.stand.push(getImage("char/king_artur/Stand-Still/Stand_01_"+i+".gif"));	
	heroMap.anim[i-1]=[];
	for(var j=1;j<=15;j++){
		var j_s = j<10?"0"+j:j;
		heroMap.anim[i-1].push(getImage("char/king_artur/Anim-Frames/01_0"+i+"_"+j_s+".gif"));
	}
}

var floorMap = [
	"00000000000000 000000000000000000000000000000000".split(""),
	"01111000000000 000000000000000000000000000000000".split(""),
	"00021000000000 000000000000000000000000000000000".split(""),
	"000211111111111111110000000000000000000000000000".split(""),
	"00000000100000 001000000000000000000000000000000".split(""),
	"00000000100000 001111111100000000000000000000000".split(""),
	"00000000100000 000000000011111100000000000000000".split(""),
	"        1      000000000000000000000000000000000".split(""),
	"000000001100000000000000000000000000000000000000".split(""),
	"000000001111111000000000000000000000000000000000".split(""),
	"000000000100011000000000000000000000000000000000".split(""),
	"000000000100002000000000000000000000000000000000".split(""),
	"000000000100000000000000000000000000000000000000".split(""),
	"000000000100000000000000000000000000000000000000".split(""),
	"000000000110000000000000000000000000000000000000".split(""),
	"000000211111110000000000000000000000000000000000".split(""),
	"000000000000000000000000000000000000000000000000".split(""),
	"000000000000000000000000000000000000000000000000".split(""),
	"000000000000000000000000000000000000000000000000".split(""),
	"000000000000000000000000000000000000000000000000".split(""),
	"000000000000000000000000000000000000000000000000".split(""),
	"000000000000000000000000000000000000000000000000".split(""),
	"000000000000000000000000000000000000000000000000".split(""),
	"000000000000000000000000000000000000000000000000".split(""),
	"000000000000000000000000000000000000000000000000".split(""),
];

var tw=512, th=tw/2, s=tw*0.705;
floor.hero_a = 4; // from 0 to 7, where 0 is at 12 o´clock
floor.hero_walk=false;
floor.hero_step=0;
floor.x = s*1.5; // hero coordinates
floor.y = s*1.5;
floor.to_x = floor.x; //hero way coordinates
floor.to_y = floor.y;
floor.w = floor.canvas.width;
floor.h = floor.canvas.height;

var objects = {
	0: getImage("sprite/barrel64.png"),
};
var objectMap={};
for(var t in objects){
	var obj = objects[t];
	for(var i=0;i<50;i++){
		var y = Math.ceil(Math.random()*(floorMap.length-1));
		var x = Math.ceil(Math.random()*(floorMap[y].length-1));
		if(!objectMap[y])objectMap[y]={};
		objectMap[y][x]={
			tile: obj,
			x:tw/4*Math.ceil(Math.random()*2+1),
			y:th/4
		};
	}
}

function renderFloor() {
	floor.save();
	floor.clearRect(0,0, floor.w,floor.h);
	floor.translate(floor.w/2-th, floor.h/2);// translate to center
	var a = Math.PI / 4, // translate to hero
		mrx = floor.x * Math.cos(a) - floor.y * Math.sin(a),
		mry = floor.x * Math.sin(a) + floor.y * Math.cos(a);
	mry = mry/2; // scale to isometric
	floor.translate(-mrx, -mry);
	// render
	for(var y in floorMap){
		for(var x in floorMap[y]){
			x=parseInt(x), y=parseInt(y);
			var f = floorMap[y][x];
			if(f==" ")continue;
			var tile = tileMap[f];
			var tx = ( x - y ) * th, // for normal sprite
				ty = ( x + y ) * th/2;
			if(tile){
				floor.drawImage(tile, tx, ty, tw, th);
			}
			var spr = spriteMap[f];
			if(spr){
				var sx = tx, // for non-normal height sprite
					sy = ty - (spr.height - th);
				// if hero over ( th is for hero)
				if( mrx > sx-th && mrx < sx+spr.width-th
					&& mry > sy && mry < sy+spr.height-th/2
				){  // draw as transparent sprite
					floor.save();
					floor.globalAlpha = 0.5;
					// @todo scale to s constant
					floor.drawImage(spr, sx, sy);
					floor.restore();
				}else{
					floor.drawImage(spr, sx, sy);
				}
			}
			else if(objectMap[y] && objectMap[y][x]){
				var obj = objectMap[y][x];
				floor.drawImage(obj.tile, Math.round(tx+obj.x),Math.floor(ty+obj.y));
			}
		}
	}
	floor.restore();
};

function renderHero() {
	floor.save();
	floor.translate(floor.w/2, floor.h/2);
	var spr = floor.hero_walk?
		heroMap.anim[floor.hero_a][floor.hero_step]
		:heroMap.stand[floor.hero_a];
	floor.drawImage(spr,Math.round(-spr.width/2), Math.round(-spr.height));
	floor.restore();
};
// return type of sprite by point
function typeByPoint(x,y){
	var dx=Math.floor(x/s), 
		dy=Math.floor(y/s);
	return floorMap[dy] ? floorMap[dy][dx] : floorMap[dy];
}
// calculate current step of hero
function stepFloor() {
	floor.hero_walk=false;
	var sx = dx = (floor.to_x - floor.x),
		sy = dy = (floor.to_y - floor.y),
		st = 6, x=floor.x, y=floor.y;
	// if more than one step
	if(Math.abs(dx) > st || Math.abs(dy) > st){
		var sx = st * dx / Math.sqrt((dx*dx) + (dy*dy)),
			sy = sx * dy / dx;
	}
	if(Math.abs(sx)<1 && Math.abs(sy) <1) return; // if no step
	x += sx; 
	y += sy;
	var t = typeByPoint(x,y);
	if(typeof t == 'undefined') return; // if on not map
	if(t == " ") return; // if empty slot
	if(spriteMap[t]) return; // if on sprite
	floor.x=x;
	floor.y=y;
	floor.hero_a = Math.round((Math.atan2(sy, sx)/Math.PI+2.75)%2*4)%8;
	floor.hero_step = (floor.hero_step+1)%15; 
	floor.hero_walk=true;
}
var log = [];
 
function renderLog(){
	floor.save();
	floor.fillStyle='#fff';
	floor.font = '10px Arial'
	for(var i in log)
		floor.fillText(log[i],10,20+(20*i),floor.width-20);
	floor.restore();
}

floor.canvas.onclick = function(e) { 
	// untranslate
	var mx = e.offsetX - floor.w/2,
		my = e.offsetY - floor.h/2;
	my *= 2; //unscale
	// unrotate
	var a = - Math.PI / 4,
		mrx = mx * Math.cos(a) - my * Math.sin(a),
		mry = mx * Math.sin(a) + my * Math.cos(a);
	// translate
	floor.to_x = floor.x + mrx;
	floor.to_y = floor.y + mry;
	return false;
};

setInterval(function() {
	stepFloor();
	renderFloor();
	renderHero();
	renderLog();
}, 33);
 
})();