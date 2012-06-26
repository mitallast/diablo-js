(function() {

function getImage(url){ var i = new Image(); i.src = url; return i};

var tw=512, th=tw/2, s=tw*0.705, a=Math.PI/4, log=[];
var floorMap = [
	"00000000000000 000000000000000000000000000000000".split(""),
	"01111000000000 000000000000000000000000000000000".split(""),
	"00021000000000 000000000000000000000000000000000".split(""),
	"000111111111111111110000000000000000000000000000".split(""),
	"00000000100000 001000000000000000000000000000000".split(""),
	"00000000100000 001111111100000000000000000000000".split(""),
	"00000000100000 000000000011111100000000000000000".split(""),
	"        1      000000000000000000000000000000000".split(""),
	"000000001100000000000000000000000000000000000000".split(""),
	"000000001111111000000000000000000000000000000000".split(""),
	"000000000100011000000000000000000000000000000000".split(""),
	"000000000100001000000000000000000000000000000000".split(""),
	"000000000100000000000000000000000000000000000000".split(""),
	"000000000100000000000000000000000000000000000000".split(""),
	"000000000110000000000000000000000000000000000000".split(""),
	"000000111111110000000000000000000000000000000000".split(""),
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

var floor = document.getElementById("floor").getContext("2d");
floor.w = floor.canvas.width;
floor.h = floor.canvas.height;

var tileMap = {
	0: getImage("texture/tileable-grey.png"),
	1: getImage("texture/dirtsand.png"),
	2: getImage("texture/tileable-grey.png"),
};

// pre-fetch textures for Person class
var personTextures={};
var personTypes=["king_artur","safria_elf"];
for(var pt in personTypes){
	var name = personTypes[pt];
	var p = {stand:[],anim:{}};
	for(var i=1;i<=8;i++){
		p.stand.push(getImage("char/"+name+"/stand/"+i+".gif"));
		p.anim[i-1]=[];
		for(var j=1;j<=15;j++){
			var j_s = j<10?"0"+j:j;
			p.anim[i-1].push(getImage("char/"+name+"/anim/"+i+"_"+j_s+".gif"));
		}
	}
	personTextures[name] = p;
}

var hero = new Person("king_artur",s*1.5,s*1.5);
var monsters = [];
for(var i=0;i<33;i++) monsters.push(new Person("safria_elf",randomx(),randomy()));

setInterval(function() { // random step for mobs
	var m = monsters[Math.ceil(Math.random()*(monsters.length-1))];
	m.to_x = m.x+(Math.random()*s*2-s);
	m.to_y = m.y+(Math.random()*s*2-s);
}, 200);

var barrels=[];
for(var i=0;i<33;i++) barrels.push(new Barrel(randomx(),randomy()));

var coins=[];
var houses=[];
for(var y in floorMap){ // pre fetch house sprites;
	for(var x in floorMap[y]){
		if(floorMap[y][x]=="2"){
			var h = new House();
			h.x = (parseInt(x)+0.5)*s;  // at center of texture
			h.y = (parseInt(y)+0.5)*s;
			houses.push(h);
		}
	}
}

var barrelSprite = getImage("sprite/barrel64.png");
var coinSprite = getImage("sprite/coins10.png");
var houseSprite = getImage("sprite/house.png");

function House(){
	this.x=0;
	this.y=0;
	this.offset_y=th/2; // render offset
	this.sprite=function(){
		return houseSprite;
	};
	this.isOverHero = function(){
		var hx = (hero.x - hero.y) * Math.cos(a),
			hy = (hero.x + hero.y)/2 * Math.sin(a);
		var sx = (this.x - this.y) * Math.cos(a),
			sy = (this.x + this.y)/2 * Math.sin(a);
		return (hx >= sx-houseSprite.width/2)
			&& (hx <= sx+houseSprite.width/2)
			&& (hy >= sy+this.offset_y-houseSprite.height)
			&& (hy <= sy)
	}
}
function Barrel(x, y){
	this.x=x;
	this.y=y;
	this.sprite=function(){
		return barrelSprite;
	};
	this.click=function(){
		remove(barrels,this);
		var c = new Coin(this.x, this.y);
		coins.push(c);
	};
}
function Coin(x,y){
	this.x=x;
	this.y=y;
	this.coins=Math.floor(Math.random()*100);
	this.sprite=function(){
		return coinSprite;
	};
	this.click=function(){
		remove(coins,this);
		hero.coins+=this.coins;
		log.push("Found "+this.coins+" coins, now "+hero.coins);
	};
}
function processClick(){
	var zb=[];
	for(var m in monsters)zb.push(monsters[m]);
	for(var b in barrels)zb.push(barrels[b]);
	for(var c in coins)zb.push(coins[c]);
	zb.sort(function(a,b){ return b.x+b.y-a.x-a.y; });// first is asc
	for(var i in zb){
		var obj = zb[i]; 
		var spr = obj.sprite();
		if( floor.click_x >= obj.x-spr.width/2 && floor.click_x <= obj.x+spr.width/2
			&& floor.click_y >= obj.y-spr.height && floor.click_y <= obj.y){
			obj.click();
		}
	}
}

function renderObjects(){
	floor.save();
	var zb=[];// z-buffer
	zb.push(hero);
	for(var m in monsters)zb.push(monsters[m]);
	for(var b in barrels)zb.push(barrels[b]);
	for(var c in coins)zb.push(coins[c]);
	for(var h in houses)zb.push(houses[h]);
	zb.sort(function(b,a){ return b.x+b.y-a.x-a.y; });//first is desc
	for(z in zb){
		var m = zb[z];
		var sx = (m.x - m.y)*Math.cos(a),
			sy = (m.x + m.y)/2*Math.sin(a); // simplified rotate
		if(m.offset_y) sy+=m.offset_y;
		var tile = m.sprite();
		if(m.isOverHero && m.isOverHero()){
			floor.globalAlpha = 0.5;
		} 
		floor.drawImage(tile, Math.round(sx-tile.width/2), Math.round(sy-tile.height));
		floor.globalAlpha = 1;
	}
	floor.restore();
}

function renderFloor() {
	floor.save();
	floor.translate(floor.w/2-th, floor.h/2);// translate to center
	var fdx=Math.floor(hero.x/s), // hero tile
		fdy=Math.floor(hero.y/s),
		miny = Math.max(0, fdy-2), // calculate camera visible tiles
		maxy = Math.min(floorMap.length-1,fdy+2),
		minx = Math.max(0, fdx-2),
		maxx = Math.min(floorMap[0].length-1,fdx+2);
	// translate to hero
	var mrx = hero.x * Math.cos(a) - hero.y * Math.sin(a),
		mry = hero.x * Math.sin(a) + hero.y * Math.cos(a);
	mry = mry/2; // scale to isometric
	floor.translate(-mrx, -mry);
	// render
	for(var y=miny;y<=maxy;y++){
		for(var x=minx;x<=maxx;x++){
			x=parseInt(x), y=parseInt(y);
			var f = floorMap[y][x];
			if(f==" ")continue;
			var tile = tileMap[f];
			var tx = ( x - y ) * th, // for normal sprite
				ty = ( x + y ) * th/2;
			floor.drawImage(tile, tx, ty, tw, th);
		}
	}
	floor.translate(th, 0); // retranslate for diamond textures
	renderObjects();
	floor.restore();
}

function remove(ar,v){var i=ar.indexOf(v);if(i>=0)ar.splice(i,1);}
function randomx(){return Math.floor(Math.random()*(floorMap[0].length/3)*s);}
function randomy(){return Math.floor(Math.random()*(floorMap.length/3)*s);}

function typeByPoint(x,y){
	var dx=Math.floor(x/s), 
		dy=Math.floor(y/s);
	return floorMap[dy] ? floorMap[dy][dx] : floorMap[dy];
}
 
function renderLog(){
	floor.save();
	floor.fillStyle='#fff';
	floor.font = '10px Arial';
	for(var i in log) floor.fillText(log[i],10,20+(20*i),floor.width-20);
	floor.restore();
}

floor.canvas.onclick = function(e) { 
	var mx = e.offsetX - floor.w/2;
	var my = e.offsetY - floor.h/2;
		my *= 2; //unscale
	floor.click_x = hero.x + mx * Math.cos(-a) - my * Math.sin(-a);
	floor.click_y = hero.y + mx * Math.sin(-a) + my * Math.cos(-a);
	processClick();
	hero.to_x = floor.click_x;
	hero.to_y = floor.click_y;
};

var frames=0;
setInterval(function() {
	floor.clearRect(0,0, floor.w,floor.h);
	hero.nextStep();
	for(var i in monsters)monsters[i].nextStep();
	renderFloor();
	renderLog();
}, 33);

function Person(name,x,y){
	this.name=name;
	this.stand=personTextures[this.name].stand;
	this.anim=personTextures[this.name].anim;
	this.x=x;
	this.y=y;
	this.to_x = this.x;
	this.to_y = this.y;
	this.a = 4; // angel, from 0 to 7, where 0 is at 12 o´clock
	this.walk = false;
	this.step = 0;
	this.coins=0;
	this.nextStep = function(){
		this.walk=false;
		var sx = dx = (this.to_x - this.x),
		sy = dy = (this.to_y - this.y),
		st = 6, x=this.x, y=this.y;
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
		if(t == "2") return; // if House
		this.x=x;
		this.y=y;
		this.a = Math.round((Math.atan2(sy, sx)/Math.PI+2.75)%2*4)%8;
		this.step = (this.step+1)%15; 
		this.walk=true;
	};
	this.sprite = function(){
		return this.walk?
			this.anim[this.a][this.step]
			:this.stand[this.a];
	};
	this.click = function(){alert("Hello, hero!")};
}

})();