(function(undefined) {

var imageCount=0;
function loadImage(url){
    var i=new Image();
    i.onload=function(){ imageCount--; }
    i.src=url;
    imageCount++;
    return i;
};

var tw=512, th=tw/2, s=tw*0.705, a=Math.PI/4, log=[];
var asin=acos=Math.sin(a);
var floorMap=[
    "000000000000000000000000000000000000000000000000".split(""),
    "011110000000000000000000000000000000000000000000".split(""),
    "000210000000000000000000000000000000000000000000".split(""),
    "000111111111111111110000000000000000000000000000".split(""),
    "000000001000000001000000000000000000000000000000".split(""),
    "000000001000000001111111100000000000000000000000".split(""),
    "000000001000000000000000011111100000000000000000".split(""),
    "000000001000000000000000000000000000000000000000".split(""),
    "000000001100000000000000000000000000000000000000".split(""),
    "000000001111111000000000000000000000000000000000".split(""),
    "000000000100011000000000000000000000000000000000".split(""),
    "000000000100001000000000000000000000000000000000".split(""),
    "000000000100002000000000000000000000000000000000".split(""),
    "000000000100000000000000000000000000000000000000".split(""),
    "000000000110000000000000000000000000000000000000".split(""),
    "000002111111112000000000000000000000000000000000".split(""),
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

var floor=document.getElementById("floor").getContext("2d");
floor.w=floor.canvas.width;
floor.h=floor.canvas.height;

var barrelSprite=loadImage("sprite/barrel64.png");
var coinSprite=loadImage("sprite/coins10.png");
var potionSprite=loadImage("sprite/potions.png");
var houseSprite=loadImage("sprite/house.png");
var barbarianStay=loadImage("char/barbarian/stay.png");
var barbarianRun=loadImage("char/barbarian/run.png");
var barbarianAttack=loadImage("char/barbarian/push.png");
var tileMap={
    "0000": loadImage("dirt/dirt0000.png"),
    "0001": loadImage("dirt/dirt0001.png"),
    "0010": loadImage("dirt/dirt0010.png"),
    "0011": loadImage("dirt/dirt0011.png"),
    "0100": loadImage("dirt/dirt0100.png"),
    "0101": loadImage("dirt/dirt0101.png"),
    "0110": loadImage("dirt/dirt0110.png"),
    "0111": loadImage("dirt/dirt0111.png"),
    "1000": loadImage("dirt/dirt1000.png"),
    "1001": loadImage("dirt/dirt1001.png"),
    "1010": loadImage("dirt/dirt1010.png"),
    "1011": loadImage("dirt/dirt1011.png"),
    "1100": loadImage("dirt/dirt1100.png"),
    "1101": loadImage("dirt/dirt1101.png"),
    "1110": loadImage("dirt/dirt1110.png"),
    "1111": loadImage("dirt/dirt1111.png"),
    "0":    loadImage("dirt/gray.png"),
};

var hero=new Barbarian(s*1.5,s*1.5);
hero.health=hero.origin_health=1000;
setInterval(function(){
    // restore hero health
    hero.health=Math.min(hero.health+10, hero.origin_health);
},2000);

// aggresive mobs
var monsters=[];
for(var i=0;i<10;i++) {
    monsters.push(new Barbarian(randomx(),randomy()));
}//*/

setInterval(function() { // random step for mobs, attack hero
    var m=monsters[Math.ceil(Math.random()*(monsters.length-1))];
    m.to_x=m.x+(Math.random()*s-s/2);
    m.to_y=m.y+(Math.random()*s-s/2);
    for(var i in monsters){
        var m=monsters[i], attackDist=100;
        if(m.attack){
            if(Math.abs(hero.x-m.x)<attackDist &&
               Math.abs(hero.y-m.y)<attackDist){
               m.doAttack(hero);
            }else{
                m.to_x=hero.x
                m.to_y=hero.y
            }
        }
    }
}, 200);//*/

var barrels=[];
for(var i=0;i<33;i++) barrels.push(new Barrel(randomx(),randomy()));
var coins=[];
var potions=[];
for(var i=0;i<33;i++) potions.push(new PotionHealth(randomx(), randomy()));
var houses=[];
for(var y in floorMap){ // pre fetch house sprites;
    for(var x in floorMap[y]){
        if(floorMap[y][x]=="2"){
            var h=new House(
                (parseInt(x)+0.5)*s,
                (parseInt(y)+0.5)*s);
            houses.push(h);
        }
    }
}//*/

floor.canvas.onclick=function(e) { 
    var mx=e.offsetX - floor.w/2;
    var my=e.offsetY - floor.h/2;
    var isCanClick=Math.abs(mx) < 100 && Math.abs(my) < 100;
    my *= 2; //unscale
    floor.click_x=hero.x + mx * Math.cos(-a) - my * Math.sin(-a);
    floor.click_y=hero.y + mx * Math.sin(-a) + my * Math.cos(-a);
    if(isCanClick)if(processClick())return;
    hero.to_x=floor.click_x;
    hero.to_y=floor.click_y;
}//*/
window.onkeydown=function(e){
    var beltKeys=[49,50,51,52,53,54,55,56,57,48];
    var beltIndex = beltKeys.indexOf(e.keyCode);
    if(beltIndex>=0){
        if(hero.belt.items[beltIndex] instanceof PotionHealth){
           hero.belt.items[beltIndex].drink(hero);
           remove(hero.belt.items,hero.belt.items[beltIndex]);
        }
        return false;
    }
}

var lastStep=0;
setInterval(function() {
    if(imageCount) return;
    if(lastStep==0){
        hero.nextStep();
        lastStep=1;
    }
    if(imageCount) return;
    if(lastStep==1){
        for(var i in monsters)monsters[i].nextStep();
        lastStep=2
    }
    if(imageCount) return;
    floor.fillStyle="black";floor.fillRect(0,0, floor.w,floor.h);
    renderFloor();
    renderLog();
    renderHeroHealth()
    renderHeroBelt();
    lastStep=0;
}, 66);//*/

function renderHeroHealth(){
    var radius=80, padding=20;
    floor.save();
    floor.globalAlpha=0.4;
    // draw health colb
    floor.fillStyle="black";
    floor.beginPath();
    floor.arc(radius+padding, floor.h-radius-padding, radius+4, 0, Math.PI*2);
    floor.closePath();
    floor.fill();
    // draw health
    floor.fillStyle="red";        
    var percent = hero.health / hero.origin_health;
    var angleFrom = Math.PI*(0.5-percent);
    var angleTo   = Math.PI*(0.5+percent);
    floor.beginPath();
    floor.arc(radius+padding, floor.h-radius-padding, radius, angleFrom, angleTo);
    floor.closePath();
    floor.fill();
    floor.restore();
}

function renderHeroBelt(){
    floor.save();
    var tile=potionSprite;
    var tw = tile.width / tile.steps;
    var th = tile.height / tile.angles;        
    for(var i=0;i<hero.belt.size;i++){
        floor.drawImage(tile, 
            tw*2, th*3, tw, th,
            200+tw*i, 600, tw, th);
        var p = hero.belt.items[i];
        if(p){
            floor.drawImage(tile, 
                tw*p.step, th*p.angle, tw, th,
                200+tw*i, 600, tw, th);
        }
    }
    floor.restore();
}

function processClick(){
    var zb=[];
    for(var m in monsters)  if(monsters[m].isAboveHero())   zb.push(monsters[m]);
    for(var b in barrels)   if(barrels[b].isAboveHero())    zb.push(barrels[b]);
    for(var c in coins)     if(coins[c].isAboveHero())      zb.push(coins[c]);
    for(var c in potions)     if(potions[c].isAboveHero())      zb.push(potions[c]);
    
    zb.sort(function(a,b){ return b.x+b.y-a.x-a.y; });// first is asc
    var cx=(floor.click_x - floor.click_y)*acos,
        cy=(floor.click_x + floor.click_y)/2*asin;
    for(var i in zb){
        var m=zb[i]; 
        var spr=m.sprite;
        var sx=(m.x - m.y)*acos+m.offset_x,
            sy=(m.x + m.y)/2*asin+m.offset_y;
        
        var spr_w = spr.angles ? spr.width/spr.angles : spr.width;
        var spr_h = spr.steps ? spr.height/spr.steps : spr.height;
        if( cx >= sx-spr_w/2 && cx <= sx+spr_w/2 && cy >= sy-spr_h && cy <= sy){
            m.use(hero)
            return true;
        }
    }//*/
    return false;
}//*/

function renderObjects(){
    var zb=[];// z-buffer
    zb.push(hero);
    for(var m in monsters) if(monsters[m].isAboveHero()) zb.push(monsters[m]);
    for(var b in barrels) if(barrels[b].isAboveHero()) zb.push(barrels[b]);
    for(var c in coins) if(coins[c].isAboveHero()) zb.push(coins[c]);
    for(var c in potions) if(potions[c].isAboveHero()) zb.push(potions[c]);
    for(var h in houses) if(houses[h].isAboveHero()) zb.push(houses[h]);
    zb.sort(function(b,a){ return b.x+b.y-a.x-a.y; });//first is desc
    for(z in zb){
        var m=zb[z];
        floor.save()
        var sx=(m.x - m.y)*acos+m.offset_x,
            sy=(m.x + m.y)/2*asin+m.offset_y;
        var tile=m.sprite;
        // render sprite
        if(m.isOverHero && m.isOverHero()) floor.globalAlpha=0.5;
        floor.shadowColor = "rgba(0,0,0,0.7)"
        floor.shadowBlur = 10
        floor.shadowOffsetX = -10
        floor.shadowOffsetY = -10
        if(tile.steps && tile.angles){
            var tw = tile.width / tile.steps;
            var th = tile.height / tile.angles;        
            floor.drawImage(tile, 
                tw*m.step, th*m.angle, tw, th,
                Math.round(sx-tw/2), Math.round(sy-th), tw, th);
        }else{
            floor.drawImage(tile, Math.round(sx-tile.width/2), Math.round(sy-tile.height));            
        }
        floor.restore()
        // health line
        if(m.health && m.origin_health && m!= hero){
            floor.save()
            floor.globalAlpha=0.7
            if(m.sprite.steps){
                sy-=tile.height/tile.steps;
            }else{
                sy-=m.sprite.height;
            }
            sy+=20;
            var lm=Math.floor(m.origin_health/20),
                lr=Math.floor(m.health/20)
            floor.fillStyle="black"
            floor.fillRect(sx-lm/2-1, sy, lm+2, 6);
            floor.fillStyle="red"
            floor.fillRect(sx-lm/2, sy+1, lr, 4);
            floor.restore()
        }
    }
}//*/

function renderFloor() {
    floor.save();
    floor.translate(floor.w/2-th, floor.h/2);// translate to center
    var fdx=Math.floor(hero.x/s), // hero tile
        fdy=Math.floor(hero.y/s),
        miny=Math.max(0, fdy-3), // calculate camera visible tiles
        maxy=Math.min(floorMap.length-1,fdy+3),
        minx=Math.max(0, fdx-3),
        maxx=Math.min(floorMap[0].length-1,fdx+3);
    // translate to hero
    var mrx=hero.x * acos - hero.y * asin,
        mry=hero.x * asin + hero.y * acos;
        mry=mry/2;
    floor.translate(-mrx, -mry);
    // render
    for(var y=miny;y<=maxy;y++){
        for(var x=minx;x<=maxx;x++){
            var tile= getFloorTile(x, y);
            if(tile){
                var tx=( x - y ) * th,
                    ty=( x + y ) * th/2;
                floor.drawImage(tile, tx, ty, tw+1, th+1);                
            }
        }
    }
    floor.translate(th, 0); // retranslate for diamond textures
    renderObjects();
    floor.restore();
}//*/

function getFloorTile(x, y)
{
    var f = floorMap[y][x];
    switch(f){
        case "2":
        case "0":
            return tileMap["0"];
        case "1":
            var tileCode="";
            tileCode+=(isWayFloor(x, y+1)?"1":"0");
            tileCode+=(isWayFloor(x+1, y)?"1":"0");
            tileCode+=(isWayFloor(x, y-1)?"1":"0");
            tileCode+=(isWayFloor(x-1, y)?"1":"0");
            return tileMap[tileCode];
        default:
            return null;
    }
}

function isWayFloor(x, y)
{
    return floorMap[y] ? floorMap[y][x] == "1" : false;
}

function remove(ar,v){var i=ar.indexOf(v);if(i>=0)ar.splice(i,1);}
function randomx(){return Math.floor(Math.random()*(floorMap[0].length/3)*s);}
function randomy(){return Math.floor(Math.random()*(floorMap.length/3)*s);}

function isStep(x,y){
    var dx=Math.floor(x/s), 
        dy=Math.floor(y/s);
    var t = floorMap[dy] ? floorMap[dy][dx] : floorMap[dy];
    return t=="0"||t=="1";
}//*/

function renderLog(){
    floor.save();
    floor.fillStyle='#fff';
    floor.font='10px Arial';
    for(var i in log) floor.fillText(log[i],10,20+(20*i),floor.width-20);
    floor.restore();
}//*/

function Shape(sprite,x,y){
    this.x=x;
    this.y=y;
    this.offset_x=0;
    this.offset_y=0;
    this.sprite=sprite;
    this.isAboveHero=function(){
        var maxlen=tw*1.5;
        if(Math.abs(this.x-hero.x)>maxlen) return false;
        if(Math.abs(this.y-hero.y)>maxlen) return false;
        return true;
    };
}//*/

function House(x,y){
    Shape.call(this,houseSprite,x,y);
    this.offset_y=th/2;
    this.isOverHero=function(){
        var hx=(hero.x - hero.y) * acos,
            hy=(hero.x + hero.y)/2 * asin;
        var sx=(this.x - this.y) * acos,
            sy=(this.x + this.y)/2 * asin;
        return (hx >= sx-houseSprite.width/2)
            && (hx <= sx+houseSprite.width/2)
            && (hy >= sy+this.offset_y-houseSprite.height)
            && (hy <= sy)
    }
}//*/

function Barrel(x, y){
    Shape.call(this,barrelSprite,x,y);
    this.use=function(mob){
        if(mob.doAttack) mob.doAttack(this);
    };
    this.damage=function(damage){
        remove(barrels,this);
        if(Math.random()>0.7)coins.push(new Coin(this.x, this.y));
    };
}//*/

function Coin(x,y){
    Shape.call(this,coinSprite,x,y);
    this.coins=Math.floor(Math.random()*1000);
    this.use=function(mob){
        remove(coins,this);
        mob.coins+=this.coins;
        log.push("Found "+this.coins+" coins, now "+mob.coins);
    }
}//*/

function Potion(x,y){
    Shape.call(this,potionSprite,x,y);
    this.sprite.steps=6;
    this.sprite.angles=4;
    this.use=function(mob){
        if(mob.addToBelt(this)){
            remove(potions,this);
        }
    }
}

function PotionHealth(x,y){
    Potion.call(this,x,y);
    this.step=0;
    this.angle=0;
    this.health=1000;
    this.drink=function(mob){
        mob.health=Math.min(mob.origin_health, mob.health+this.health);
    }
}

function Barbarian(x,y){
    this.name=name;
    this.stay=barbarianStay
    this.stay.angles=16
    this.stay.steps=8
    this.run=barbarianRun
    this.run.steps=8
    this.run.angles=16
    this.attack=barbarianAttack
    this.attack.steps=10
    this.attack.angles=16
    this.currentState=this.stay;
    this.step=0;
    this.angle=0;
    this.belt={items:[], size:10};
    this.addToBelt=function(potion){
        for(var i=0;i<this.belt.size;i++){
            if(typeof this.belt.items[i] == "undefined"){
                this.belt.items[i]=potion;
                return true;
            }
        }
        return false;
    }
    Shape.call(this, this.currentState, x, y);
    this.rotate = function(sx,sy){
        var l=this.run.angles;
        this.angle=Math.round((Math.atan2(sy, sx)/Math.PI+2.75)*l/2+l/2)%l
    }
    this.rotateTo = function(point){
        this.rotate(point.x-this.x,point.y-this.y);
    }
    this.setState=function(state){
        if(this.currentState!=state){
            this.currentState=state;
            this.step=-1;
        }
    }
    this._nextStep=function(){
        var sx=dx=(this.to_x - this.x),
            sy=dy=(this.to_y - this.y),
            st=16, 
            x=this.x, y=this.y;
        
        if(Math.abs(dx)>st || Math.abs(dy)>st){ 
            sx=st * dx / Math.sqrt((dx*dx) + (dy*dy));
            sy=sx * dy / dx;
        }
        var run=false;
        if(isStep(x+sx,y+sy)){run=true;}
        else if(isStep(this.x,y+sy)){run=true;sx=0;}
        else if(isStep(x+sx,this.y)){run=true;sy=0;}
        
        if(Math.sqrt((sx*sx)+(sy*sy))>5){
            x += sx;
            y += sy;
            if(run){
                this.x=x;
                this.y=y;
                this.setState(this.run);
            }
            else this.setState(this.stay);
            this.rotate(sx,sy);
        }
        else this.setState(this.stay);
        this.step=(this.step+1)%(this.currentState.steps);
        this.sprite=this.currentState;
    }
    this.nextStep=function(){
        if(!this.isAboveHero())return;
        if(this.currentState == this.attack){
            if(this.step==(this.attack.steps-1)){
                this.currentState=this.stay;
                this.step=-1;
                if(this.attacked){
                    this.attacked.damage(this.getDamage());
                    this.attacked=null;
                }
            }
            this.step=(this.step+1)%(this.currentState.steps);
            this.sprite=this.currentState;
            this.offset_y=this.currentState==this.attack?35:5
        }else this._nextStep();
    }
    this.coins=0;
    this.origin_health=1000
    this.health=this.origin_health
    this.resistance=10 // damage resistance, less than 1000
    this.currentDamage=100
    this.criticalDamage=0.4;
    this.doAttack=function(mob){
        if(this.attacked!=mob){
            this.rotateTo(mob);
            this.setState(this.attack);
            this.attacked=mob;            
        }
    };
    this.use = function(mob){
        if(mob.doAttack) mob.doAttack(this);
    };
    this.damage=function(damage){
        var health=this.health - damage * 1000/(1000-this.resistance);
        if(health<=0){
            this.health=0;
            remove(monsters,this);
            if(Math.random()>0.5) coins.push(new Coin(this.x, this.y));
            log.push(this.name+" is die");
        }else{
            this.health=health;
        }
    }
    this.getDamage=function(){
        return this.currentDamage * ( Math.random() <= this.criticalDamage  && this == hero ? 4 : 1 );
    }
}

})();