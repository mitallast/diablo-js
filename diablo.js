(function() {

function getImage(url){ var i = new Image(); i.src = url; return i};

var tw=512, th=tw/2, s=tw*0.705, a=Math.PI/4, log=[];
var asin = acos = Math.sin(a);
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

var barrelSprite = getImage("sprite/barrel64.png");
var coinSprite = getImage("sprite/coins10.png");
var houseSprite = getImage("sprite/house.png");

// pre-fetch textures for Person class
var personTextures={};
var personTypes=["king_artur","safria_elf"];
for(var pt in personTypes){
	var name = personTypes[pt];
	var p = {stay:{},run:{}};
	for(var i=1;i<=8;i++){
		p.stay[i-1]=[getImage("char/"+name+"/stand/"+i+".gif")];
		p.run[i-1]=[];
		for(var j=1;j<=15;j++){
			var j_s = j<10?"0"+j:j;
			p.run[i-1].push(getImage("char/"+name+"/anim/"+i+"_"+j_s+".gif"));
		}
	}
	personTextures[name] = p;
}
var bt=personTextures["barbarian"]={stay:{},run:{},push:{}};
for(var ba=0;ba<=15;ba++){
	bt.stay[ba]=[];
	bt.run[ba]=[];
	bt.push[ba]=[];
	for(var t=0;t<=7;t++)  bt.stay[ba].push(getImage("char/barbarian/stay/"+ba+"-"+t+".png"));
	for(var t=0;t<=7;t++)  bt.run[ba].push(getImage("char/barbarian/run/"+ba+"-"+t+".png"));
	for(var t=0;t<=17;t++) bt.push[ba].push(getImage("char/barbarian/push/"+ba+"-"+t+".png"));
}


var hero = new Person("barbarian",s*1.5,s*1.5);
var monsters = [];
for(var i=0;i<33;i++) monsters.push(new Person("safria_elf",randomx(),randomy()));
setInterval(function() { // random step for mobs
	var m = monsters[Math.ceil(Math.random()*(monsters.length-1))];
	m.to_x = m.x+(Math.random()*s-s/2);
	m.to_y = m.y+(Math.random()*s-s/2);
}, 200);

var barrels=[];
for(var i=0;i<33;i++) barrels.push(new Barrel(randomx(),randomy()));

var coins=[];
var houses=[];
for(var y in floorMap){ // pre fetch house sprites;
	for(var x in floorMap[y]){
		if(floorMap[y][x]=="2"){
			var h = new House(
				(parseInt(x)+0.5)*s,
				(parseInt(y)+0.5)*s);
			houses.push(h);
		}
	}
}

function House(x,y){
	Shape.call(this,houseSprite,x,y);
	this.offset_y=th/2;
	this.isOverHero = function(){
		var hx = (hero.x - hero.y) * acos,
			hy = (hero.x + hero.y)/2 * asin;
		var sx = (this.x - this.y) * acos,
			sy = (this.x + this.y)/2 * asin;
		return (hx >= sx-houseSprite.width/2)
			&& (hx <= sx+houseSprite.width/2)
			&& (hy >= sy+this.offset_y-houseSprite.height)
			&& (hy <= sy)
	}
}
function Barrel(x, y){
	Shape.call(this,barrelSprite,x,y);
	this.click=function(){
		var self = this;
		hero.doPush(function(){
			remove(barrels,self);
			coins.push(new Coin(self.x, self.y));
		});
	};
}
function Coin(x,y){
	Shape.call(this,coinSprite,x,y);
	this.coins=Math.floor(Math.random()*100);
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
		var spr = obj.sprite;
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
		var sx = (m.x - m.y)*acos+m.offset_x,
			sy = (m.x + m.y)/2*asin+m.offset_y;
		var tile = m.sprite;
		if(m.isOverHero && m.isOverHero()){
			floor.globalAlpha = 0.5;
		}
		floor.drawImage(tile, Math.round(sx-tile.width/2), Math.round(sy-tile.height));
		floor.globalAlpha = 1;
		if(m.life && m.origin_life && m!= hero){
			floor.save()
			sy-=m.sprite.height+20;
			var lm = Math.floor(m.origin_life/20),
				lr = Math.floor(m.life/20)
			floor.fillStyle = "black"
			floor.fillRect(sx-lm/2-1, sy, lm+2, 6);
			floor.fillStyle = "red"
			floor.fillRect(sx-lm/2, sy+1, lr, 4);
			floor.restore()
		}
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
	var mrx = hero.x * acos - hero.y * asin,
		mry = hero.x * asin + hero.y * acos;
		mry = mry/2;
	floor.translate(-mrx, -mry);
	// render
	for(var y=miny;y<=maxy;y++){
		for(var x=minx;x<=maxx;x++){
			x=parseInt(x), y=parseInt(y);
			var f = floorMap[y][x];
			if(f==" ")continue;
			var tile = tileMap[f];
			var tx = ( x - y ) * th,
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
	var isCanClick = Math.abs(mx) < 100 && Math.abs(my) < 100;
	my *= 2; //unscale
	floor.click_x = hero.x + mx * Math.cos(-a) - my * Math.sin(-a);
	floor.click_y = hero.y + mx * Math.sin(-a) + my * Math.cos(-a);
	if(isCanClick)processClick();
	hero.to_x = floor.click_x;
	hero.to_y = floor.click_y;
};

log[0]=0;
setInterval(function() {
	floor.clearRect(0,0, floor.w,floor.h);
	hero.nextStep();
	for(var i in monsters)monsters[i].nextStep();
	renderFloor();
	log[0]++;
	renderLog();
}, 66);
function Person(name,x,y){
	this.name=name;
	// for render;
	this.stay=personTextures[this.name].stay;
	this.run=personTextures[this.name].run;
	this.push=personTextures[this.name].push;
	this.currentState=this.stay;
	
	this.a = (this.name=="barbarian")?0:4;
	this.step = 0;
	this.pushCallback=null;

	Shape.call(this,this.stay[this.a][0],x,y);
	this.to_x = this.x;
	this.to_y = this.y;
	this.coins=0;
	// life
	this.origin_life = 1000
	this.life=600;
	// characteristic
	this.damage = 100
	this.resistance = 10 // damage resistance, less than 1000
	this.nextStep = function(){
		if(this.currentState == this.push){
			if(this.step==(this.push[0].length-1)){
				this.currentState = this.stay;
				this.step=-1;
				if(this.pushCallback){
					this.pushCallback();
					this.pushCallback=null;
				}
			}
		}else{
			var sx = dx = (this.to_x - this.x),
			sy = dy = (this.to_y - this.y),
			st = this.name =="barbarian"?17:6, x=this.x, y=this.y;
			// if more than one step
			if(Math.abs(dx) > st || Math.abs(dy) > st){
				var sx = st * dx / Math.sqrt((dx*dx) + (dy*dy)),
					sy = sx * dy / dx;
			}
			if(Math.abs(sx)>1 || Math.abs(sy) >1){
				x += sx; 
				y += sy;
				var t = typeByPoint(x,y);
				if(t=="0"||t=="1"||t=="2"||t=="3"){
					this.x=x;
					this.y=y;
					if(this.currentState != this.run){
						this.currentState = this.run;
						this.step = -1;
					}
					if(this.name=="barbarian"){
						this.a = Math.round((Math.atan2(sy, sx)/Math.PI+2.75)%2*9+7)%16;
					}else{
						this.a = Math.round((Math.atan2(sy, sx)/Math.PI+2.75)%2*4)%8;
					}	
				}
			}
			else{
				if(this.currentState != this.stay){
					this.currentState = this.stay;
					this.step = -1;
				}
			}
		}
		this.step = (this.step+1)%(this.currentState[this.a].length);
		this.sprite = this.currentState[this.a][this.step];
	};
	this.doPush = function(callback){
		this.currentState = this.push;
		this.step=-1;
		this.pushCallback=callback;
	}
	this.click = function(){
		var self = this;
		hero.doPush(function(){
			var health = self.life - hero.damage * 1000/(1000-self.resistance);
			if(health<=0){
				self.life = 0;
				remove(monsters,self);
				log.push(self.name+" is die");
			}else{
				self.life = health;
			}
		});		
	}
}
function Shape(sprite,x,y){
	this.x = x;
	this.y = y;
	this.offset_x = 0;
	this.offset_y = 0;
	this.sprite = sprite;
}
})();