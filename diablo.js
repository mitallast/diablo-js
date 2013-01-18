(function(undefined) {

var imageCount=0;
function loadImage(url,angles,steps,offsetX){
    var i=new Image();
    i.onload=function(){
        imageCount--;
        i.offsetX=offsetX?((i.height/angles)>>2):0;
    }
    i.src=url;
    imageCount++;
    if(typeof angles!="undefined" && typeof steps!="undefined"){
        i.angles=angles;
        i.steps=steps;
    }
    return i;
};

var floor=document.getElementById("floor").getContext("2d");
floor.w=floor.canvas.width;
floor.h=floor.canvas.height;

var barrelSprite=loadImage("sprite/barrel64.png");
var coinSprite=loadImage("sprite/coins10.png");
var potionSprite=loadImage("sprite/potions.png");

var tiles=[756,1140,660,372,1908,];
var tileMap={};
for(var i in tiles){
    tileMap[tiles[i]]=loadImage("dttool/output/1/"+tiles[i]+".png");
}


var tw=160, th=tw/2, s=tw*0.705, a=Math.PI/4, visible=7;
var asin=acos=Math.sin(a);

var floorMap=[
[ 756,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 756,],
[   0,   0, 756, 756, 756, 756, 756, 756, 756, 756, 756, 756,   0,   0,   0,],
[   0, 756, 756, 756, 756, 756, 756, 756, 756, 756, 756, 756, 756,   0,   0,],
[   0, 756, 756, 756, 756, 756, 756, 756,1140, 660, 756,1908, 756,   0,   0,],
[   0, 756, 756, 756, 756, 756, 756, 756, 756, 660, 756, 756, 756,   0,   0,],
[   0, 756, 756, 756, 756, 756, 756, 756, 756, 372, 756, 756, 756,   0,   0,],
[   0, 756, 756, 756, 756, 756, 756, 756, 756, 756, 756, 756, 756,   0,   0,],
[   0, 756, 756, 756, 756, 756, 756, 756, 756, 756, 756, 756, 756,   0,   0,],
[   0,   0, 756,1140, 756, 756, 756, 756, 756, 756, 756, 756,   0,   0,   0,],
[   0,   0, 756, 756, 756, 756, 756, 756, 756, 756, 756, 756,   0,   0,   0,],
[   0,   0, 756, 756, 756, 756, 756, 756, 756, 756, 756, 756,   0,   0,   0,],

,];
function isWayFloor(x,y) {
    return floorMap[y] ? floorMap[y][x] !== " " : false;
}
function isStep(x,y){
    return isWayFloor(Math.floor(x/s), Math.floor(y/s));
}
function getFloorTile(x, y) {
    if(!floorMap[y]) return null;
    if(!floorMap[y][x]) return null;
    var f = floorMap[y][x];
    return tileMap[f];
}

var monsterMap={
    SK: {
        A1: loadImage("monsters/SK/A1/map.png",8,16,true),
        NU: loadImage("monsters/SK/NU/map.png",8,8,true),
        WL: loadImage("monsters/SK/WL/map.png",8,8,true),
        DD: loadImage("monsters/SK/DD/map.png",8,1),
        attackOffset:10,
    },
    FS: {
        A1: loadImage("monsters/FS/A1/map.png",8,17,true),
        NU: loadImage("monsters/FS/NU/map.png",8,12,true),
        WL: loadImage("monsters/FS/WL/map.png",8,14,true),
        DD: loadImage("monsters/FS/DD/map.png",8,1),
    },
    SI: {
        A1: loadImage("monsters/SI/A1/map.png",8,16,true),
        NU: loadImage("monsters/SI/NU/map.png",8,8,true),
        WL: loadImage("monsters/SI/WL/map.png",8,9,true),
        DD: loadImage("monsters/SI/DD/map.png",8,1),
    },
    BA: {
        A1: loadImage("monsters/BA/A1/map.png",16,9,true),
        NU: loadImage("monsters/BA/NU/map.png",16,8,true),
        WL: loadImage("monsters/BA/WL/map.png",16,8,true),
    }
};

var hero=new HeroBarbarian(s*1.5,s*1.5);
setInterval(function(){
    // restore hero health
    hero.health=Math.min(hero.health+10, hero.origin_health);
},2000);

// aggresive mobs
var monsters=[],deathmobs=[],barrels=[],coins=[],potions=[];
//for(var i=0;i<10;i++) monsters.push(new AgressiveMob(randomx(),randomy(), 'SK'));
//for(var i=0;i<10;i++) monsters.push(new AgressiveMob(randomx(),randomy(), 'FS'));
//for(var i=0;i<10;i++) monsters.push(new AgressiveMob(randomx(),randomy(), 'SI'));
//for(var i=0;i<33;i++) barrels.push(new Barrel(randomx(),randomy()));
//for(var i=0;i<33;i++) potions.push(new PotionHealth(randomx(), randomy()));


setInterval(function() { // random step for mobs, attack hero
    if(monsters.length==0)return;
    var m=monsters[Math.ceil(Math.random()*(monsters.length-1))];
    if(typeof m.attacked != "object"){
        m.to_x=m.x+(Math.random()*s-s/2);
        m.to_y=m.y+(Math.random()*s-s/2);
    }
    for(var i in monsters){
        var m=monsters[i], attackDist=100;
        if(m.attack && m.isAboveHero()){
            if(Math.abs(hero.x-m.x)<attackDist &&
               Math.abs(hero.y-m.y)<attackDist){
               m.doAttack(hero);
               m.to_x = m.x;
               m.to_y = m.y;
            }else{
                m.to_x=hero.x;
                m.to_y=hero.y;
            }
        }
    }
}, 200);

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
}

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

setInterval(function() {
    if(imageCount) return;
    hero.nextStep();
    for(var i in monsters) monsters[i].nextStep();
    floor.fillStyle="black";floor.fillRect(0,0, floor.w,floor.h);
    renderFloor();
    renderHeroHealth()
    renderHeroBelt();
}, 66);

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

function loadZb(order,click){
    var tmp_zb=[], zb=[];
    var all=[monsters,potions,barrels,click?[]:[hero]];
    for(var t in all) 
        for(var m in all[t]) 
            if(all[t][m].isAboveHero()) 
                tmp_zb.push(all[t][m]);
    // asc sort
    tmp_zb.sort(function(a,b){ var c=b.x+b.y-a.x-a.y; return order?c:0-c});
    var all=[coins,deathmobs,tmp_zb];
    for(var i in all) for(var j in all[i]) zb.push(all[i][j]);
    return zb;
}

function processClick(){
    var zb=loadZb(true,true);
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
    }
    return false;
}

function renderObjects(){
    var zb=loadZb(false);
    for(z in zb){
        var m=zb[z];
        floor.save()
        var sx=(m.x - m.y)*acos+m.offset_x,
            sy=(m.x + m.y)/2*asin+m.offset_y;
        var tile=m.sprite;
        // render sprite
        var tw = tile.width;
        var th = tile.height
        if(tile.steps && tile.angles){
            tw/=tile.steps;
            th/=tile.angles;
            floor.drawImage(tile, 
                tw*m.step, th*m.angle, tw, th,
                Math.round(sx-tw/2-tile.offsetX), Math.round(sy-th), tw, th);
        }else{
            floor.drawImage(tile, Math.round(sx-tile.width/2), Math.round(sy-tile.height));            
        }
        floor.restore()
        // health line
        if(m.health && m.origin_health && m != hero){
            floor.save()
            floor.globalAlpha=0.7
            sy-=90;
            var lm=Math.floor(m.origin_health/20),
                lr=Math.floor(m.health/20)
            floor.fillStyle="black"
            floor.fillRect(sx-lm/2-1, sy, lm+2, 6);
            floor.fillStyle="red"
            floor.fillRect(sx-lm/2, sy+1, lr, 4);
            floor.restore()
        }
    }
}

function renderFloor() {
    floor.save();
    floor.translate(floor.w/2-th, floor.h/2);// translate to center
    var fdx=Math.floor(hero.x/s), // hero tile
        fdy=Math.floor(hero.y/s),
        miny=Math.max(0, fdy-visible), // calculate camera visible tiles
        maxy=Math.min(floorMap.length-1,fdy+visible),
        minx=Math.max(0, fdx-visible),
        maxx=Math.min(floorMap[0].length-1,fdx+visible);
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
}

function remove(ar,v){var i=ar.indexOf(v);if(i>=0)ar.splice(i,1);}
function randomx(){return Math.floor(Math.random()*(floorMap[0].length)*s);}
function randomy(){return Math.floor(Math.random()*(floorMap.length)*s);}

function Shape(sprite,x,y){
    this.x=x;
    this.y=y;
    this.offset_x=0;
    this.offset_y=0;
    this.sprite=sprite;
    this.isAboveHero=function(){
        var maxlen=tw*visible/2;
        return (Math.abs(this.x-hero.x)<=maxlen) && (Math.abs(this.y-hero.y)<=maxlen);
    };
}

function DeathMob(mob){
    Shape.call(this,mob.death,mob.x,mob.y);
    this.step=0;
    this.angle=mob.angle;
    this.used=false;
    this.use=function(mob){
        if(!this.used && Math.random()>0.5) coins.push(new Coin(this.x+50, this.y+50));
        if(!this.used && Math.random()>0.5) potions.push(new PotionHealth(this.x+50, this.y));
        this.used=true;
    }
}

function Barrel(x, y){
    Shape.call(this,barrelSprite,x,y);
    this.use=function(mob){
        if(mob.doAttack) mob.doAttack(this);
    };
    this.damage=function(damage){
        remove(barrels,this);
        if(Math.random()>0.7) coins.push(new Coin(this.x, this.y));
    };
}

function Coin(x,y){
    Shape.call(this,coinSprite,x,y);
    this.coins=Math.floor(Math.random()*1000);
    this.use=function(mob){
        remove(coins,this);
        mob.coins+=this.coins;
    }
}

function Potion(x,y){
    Shape.call(this,potionSprite,x,y);
    this.sprite.steps=6;
    this.sprite.angles=4;
    this.use=function(mob){
        if(mob.addToBelt(this)) remove(potions,this);
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

function Mob(x,y,name){
    this.name=name;
    this.stay=monsterMap[name].NU
    this.run=monsterMap[name].WL
    this.death=monsterMap[name].DD
    this.currentState=this.stay;
    this.step=0;
    this.angle=0;
    this.st=8;
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
    this.nextStep=function(){
        var sx=dx=(this.to_x - this.x),
            sy=dy=(this.to_y - this.y),
            st=this.st, 
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
    this.origin_health=this.health=1000;
    this.resistance=10 // damage resistance, less than 1000
    this.use = function(mob){
        if(mob.doAttack) mob.doAttack(this);
    };
    this.damage=function(damage){
        var health=this.health - damage * 1000/(1000-this.resistance);
        if(health<=0){
            this.health=0;
            remove(monsters,this);
            if(this.death) deathmobs.push(new DeathMob(this));
        }else{
            this.health=health;
        }
    }
}

function AgressiveMob(x,y,name){
    Mob.call(this,x,y,name);
    this.attack=monsterMap[name].A1
    this.attackOffset=monsterMap[name].attackOffset||0;
    this.normalOffset=0;
    this._nextStep=this.nextStep;
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
            this.offset_y=this.currentState==this.attack?this.attackOffset:this.normalOffset;
        }else this._nextStep();
    }
    this.currentDamage=30;
    this.getDamage=function(){
        return this.currentDamage;
    }
    this.attacked=null;
    this.doAttack=function(mob){
        if(this.attacked!=mob){
            this.rotateTo(mob);
            this.setState(this.attack);
            this.attacked=mob;            
        }
    }
}

function HeroBarbarian(x,y){
    AgressiveMob.call(this,x,y,"BA");
    this.attackOffset=35;
    this.normalOffset=5;
    this.health=this.origin_health=1000;
    this.belt={items:[], size:10};
    this.st=16;
    this.addToBelt=function(potion){
        for(var i=0;i<this.belt.size;i++){
            if(typeof this.belt.items[i] == "undefined"){
                this.belt.items[i]=potion;
                return true;
            }
        }
        return false;
    }
    this.criticalDamage=0.4;
    this.currentDamage=120;
    this.getDamage=function(){
        return this.currentDamage * ( Math.random() <= this.criticalDamage ? 4 : 1 );
    }
}

})();