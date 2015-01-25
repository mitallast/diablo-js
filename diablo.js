(function(undefined) {

var imageCount=0;
function loadImage(url,angles,steps,offsetX){
    imageCount++;
    var i=new Image();
    i.onload=function(){
        imageCount--;
        i.offsetX=offsetX?((i.height/angles)>>2):0;
    }
    i.src=url;
    if(typeof angles!="undefined" && typeof steps!="undefined"){
        i.angles=angles;
        i.steps=steps;
    }
    return i;
}
function load(img,callback){
    if(img.complete)callback();
    else img.addEventListener('load',callback,false);
}

var level = {
    floor:{
        prefix:"dttool/output/1/",
        map:[
            [   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,],
            [   0,   0, 756, 756, 756, 756, 756, 756,   0,   0,   0,],
            [   0, 756, 756, 756, 756, 756, 756, 756, 756, 756, 756,],
            [   0, 756, 756, 756, 756, 756, 756, 756,1140, 756, 756,],
            [   0, 756, 756, 756, 756, 756, 756, 756, 756, 756, 756,],
            [   0, 756, 756, 756, 756, 756, 756, 756, 756, 756, 756,],
            [   0, 756, 756, 756, 756, 756, 756, 756, 756, 756, 756,],
            [   0, 756, 756, 756, 756, 756, 756, 756, 756, 756, 756,],
            [   0, 756, 756,1140, 756, 756, 756, 756, 756, 756, 756,],
            [   0, 756, 756, 660, 660, 372, 756, 756, 756, 756, 756,],
            [   0, 756, 756, 756, 756, 756, 756, 756, 756, 756, 756,],
            [   0, 756, 756,1908, 756, 756, 756, 756, 756, 756, 756,],
            [   0,   0, 756, 756, 756, 756, 756, 756,   0,   0,   0,],
            [   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,],
            [   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,],
        ],
        header:{
            372:false,
            660:false,
            756:false,
            1140:false,
            1908:false,  
        }
    },  
    wall:{
        prefix:"dttool/output/0/",
        map:[
            [   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,],
            [   0,   0, 948, 372, 372, 372, 948, 372,2100,   0,   0,],
            [   0, 948,1140,   0,   0,   0, 468,   0,2004, 372, 948,],
            [   0, 468,   0,   0,   0,   0,1524,   0,   0,   0, 468,],
            [   0, 468,   0,   0,   0,   0,1428,   0,   0,   0, 468,],
            [   0, 468,   0,   0,   0,   0, 468,   0,   0,   0, 468,],
            [   0, 468,   0,   0,   0,   0, 468,   0,   0,   0,1524,],
            [   0, 948, 372, 372, 372, 372,1140,   0,   0,   0,1428,],
            [   0, 468,   0,   0,   0,   0,   0,   0,   0,   0, 468,],
            [   0, 468,   0,   0,   0,   0,   0,   0,   0,   0, 468,],
            [   0, 468,   0,   0,   0,   0,   0,   0,   0,   0, 468,],
            [   0, 468,   0,   0,   0,   0,   0,   0,   0,   0, 468,],
            [   0,2004,2100,   0,   0,   0,   0,   0, 948, 372,2004,],
            [   0,   0,2004, 372, 372, 372, 372, 372,1140,   0,   0,],
            [   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,],
        ],
        header:{
            276:{orientation:8, main_index:5, sub_index:2, direction:1, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,]},
            372:{orientation:2, main_index:5, sub_index:0, direction:2, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,]},
            468:{orientation:1, main_index:5, sub_index:0, direction:1, walk:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,]},
            564:{orientation:2, main_index:5, sub_index:0, direction:2, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,]},
            660:{orientation:2, main_index:5, sub_index:0, direction:2, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,]},
            756:{orientation:1, main_index:5, sub_index:0, direction:1, walk:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,]},
            852:{orientation:1, main_index:5, sub_index:0, direction:1, walk:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,]},
            948:{orientation:3, main_index:5, sub_index:0, direction:3, walk:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,1,1,1,1,]},
            1044:{orientation:4, main_index:5, sub_index:0, direction:3, walk:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,1,1,1,1,]},
            1140:{orientation:7, main_index:5, sub_index:0, direction:4, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,]},
            1236:{orientation:9, main_index:5, sub_index:0, direction:2, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,]},
            1332:{orientation:9, main_index:5, sub_index:1, direction:2, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,]},
            1428:{orientation:8, main_index:5, sub_index:0, direction:1, walk:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,]},
            1524:{orientation:8, main_index:5, sub_index:1, direction:1, walk:[0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,]},
            1620:{orientation:9, main_index:5, sub_index:0, direction:2, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,]},
            1716:{orientation:9, main_index:5, sub_index:1, direction:2, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,]},
            1812:{orientation:8, main_index:5, sub_index:1, direction:1, walk:[0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,]},
            1908:{orientation:8, main_index:5, sub_index:0, direction:1, walk:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,]},
            2004:{orientation:6, main_index:5, sub_index:0, direction:2, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,1,1,1,]},
            2100:{orientation:5, main_index:5, sub_index:0, direction:1, walk:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,1,0,0,0,1,1,0,0,0,]},
            2196:{orientation:6, main_index:5, sub_index:0, direction:2, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,1,1,1,]},
            2292:{orientation:5, main_index:5, sub_index:0, direction:1, walk:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,1,0,0,0,1,1,0,0,0,]},
            2388:{orientation:2, main_index:5, sub_index:0, direction:2, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,]},
            2484:{orientation:1, main_index:5, sub_index:0, direction:1, walk:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,]},
            2580:{orientation:3, main_index:5, sub_index:0, direction:3, walk:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,1,1,1,1,]},
            2676:{orientation:4, main_index:5, sub_index:0, direction:3, walk:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,1,1,1,1,]},
            2772:{orientation:12, main_index:5, sub_index:0, direction:3, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,]},
        }
    },
    object:{
        prefix:"dttool/output/2/",
        map:[
            [   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,],
            [   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,],
            [   0,   0,   0,   0,5844,   0,   0,3828,   0,   0,   0,],
            [   0,   0,4212,4116,   0,   0,   0,3732,   0,   0,   0,],
            [   0,   0,   0,4404,1524,   0,   0,   0,   0,   0,   0,],
            [   0,   0,   0,4308,   0,   0,   0,   0,   0,   0,   0,],
            [   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,],
            [   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,],
            [   0,   0,5652, 372, 276,   0,   0,   0,   0,   0,   0,],
            [   0,   0,   0,   0,   0,   0,5748,   0,   0,   0,   0,],
            [   0,   0,   0,2676,2580,2484,   0,   0,   0,   0,   0,],
            [   0,   0,2868,   0,   0,   0,   0,   0,   0,   0,   0,],
            [   0,   0,   0,3444,   0,   0,   0,   0,   0,   0,   0,],
            [   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,],
            [   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,],
        ],
        header:{
            276:{orientation:2, main_index:9, sub_index:12, direction:2, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,1,1,0,0,0,]},
            372:{orientation:2, main_index:9, sub_index:11, direction:2, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,]},
            468:{orientation:12, main_index:50, sub_index:0, direction:3, walk:[0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,0,0,]},
            564:{orientation:12, main_index:9, sub_index:33, direction:3, walk:[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,1,1,1,0,1,1,1,1,0,]},
            660:{orientation:1, main_index:9, sub_index:33, direction:1, walk:[1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,]},
            756:{orientation:7, main_index:9, sub_index:33, direction:4, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,0,]},
            852:{orientation:12, main_index:9, sub_index:32, direction:3, walk:[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,]},
            948:{orientation:12, main_index:9, sub_index:31, direction:3, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,1,1,1,0,0,]},
            1044:{orientation:1, main_index:9, sub_index:10, direction:1, walk:[0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,]},
            1140:{orientation:1, main_index:9, sub_index:9, direction:1, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,]},
            1236:{orientation:1, main_index:9, sub_index:8, direction:1, walk:[1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,]},
            1332:{orientation:12, main_index:9, sub_index:11, direction:3, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,]},
            1428:{orientation:12, main_index:9, sub_index:10, direction:3, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,]},
            1524:{orientation:12, main_index:9, sub_index:9, direction:3, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,]},
            1620:{orientation:12, main_index:9, sub_index:8, direction:3, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,]},
            1716:{orientation:12, main_index:9, sub_index:7, direction:3, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,]},
            1812:{orientation:12, main_index:9, sub_index:6, direction:3, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,]},
            1908:{orientation:12, main_index:9, sub_index:5, direction:3, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,]},
            2004:{orientation:12, main_index:9, sub_index:4, direction:3, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,]},
            2100:{orientation:12, main_index:9, sub_index:3, direction:3, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,]},
            2196:{orientation:12, main_index:9, sub_index:2, direction:3, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,]},
            2292:{orientation:12, main_index:9, sub_index:1, direction:3, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,]},
            2388:{orientation:12, main_index:9, sub_index:0, direction:3, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,]},
            2484:{orientation:2, main_index:9, sub_index:10, direction:2, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,]},
            2580:{orientation:2, main_index:9, sub_index:9, direction:2, walk:[0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,]},
            2676:{orientation:2, main_index:9, sub_index:8, direction:2, walk:[0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,]},
            2772:{orientation:2, main_index:9, sub_index:7, direction:2, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,]},
            2868:{orientation:2, main_index:9, sub_index:6, direction:2, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,]},
            2964:{orientation:1, main_index:9, sub_index:7, direction:1, walk:[0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,]},
            3060:{orientation:1, main_index:9, sub_index:6, direction:1, walk:[0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,]},
            3156:{orientation:2, main_index:9, sub_index:5, direction:2, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,]},
            3252:{orientation:2, main_index:9, sub_index:4, direction:2, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1,1,1,1,0,]},
            3348:{orientation:1, main_index:9, sub_index:5, direction:1, walk:[0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,]},
            3444:{orientation:1, main_index:9, sub_index:4, direction:1, walk:[0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,]},
            3540:{orientation:12, main_index:9, sub_index:30, direction:3, walk:[0,0,0,0,0,0,0,1,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,0,0,]},
            3636:{orientation:12, main_index:9, sub_index:29, direction:3, walk:[0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,0,0,0,]},
            3732:{orientation:1, main_index:9, sub_index:3, direction:1, walk:[0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,]},
            3828:{orientation:1, main_index:9, sub_index:2, direction:1, walk:[1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,]},
            3924:{orientation:2, main_index:9, sub_index:3, direction:2, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1,1,1,1,1,]},
            4020:{orientation:2, main_index:9, sub_index:2, direction:2, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,]},
            4116:{orientation:2, main_index:9, sub_index:1, direction:2, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,]},
            4212:{orientation:2, main_index:9, sub_index:0, direction:2, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,]},
            4308:{orientation:1, main_index:9, sub_index:1, direction:1, walk:[0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,]},
            4404:{orientation:1, main_index:9, sub_index:0, direction:1, walk:[1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,]},
            4500:{orientation:12, main_index:9, sub_index:28, direction:3, walk:[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,]},
            4596:{orientation:12, main_index:9, sub_index:27, direction:3, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,]},
            4692:{orientation:12, main_index:9, sub_index:24, direction:3, walk:[0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,]},
            4788:{orientation:12, main_index:9, sub_index:23, direction:3, walk:[0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,]},
            4884:{orientation:12, main_index:9, sub_index:22, direction:3, walk:[0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,]},
            4980:{orientation:12, main_index:9, sub_index:21, direction:3, walk:[0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,]},
            5076:{orientation:12, main_index:9, sub_index:20, direction:3, walk:[0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,]},
            5172:{orientation:12, main_index:9, sub_index:17, direction:3, walk:[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,1,0,0,0,1,1,0,0,0,]},
            5268:{orientation:12, main_index:9, sub_index:18, direction:3, walk:[0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,]},
            5364:{orientation:12, main_index:9, sub_index:19, direction:3, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,0,0,]},
            5460:{orientation:12, main_index:9, sub_index:16, direction:3, walk:[0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,]},
            5556:{orientation:12, main_index:9, sub_index:15, direction:3, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,]},
            5652:{orientation:12, main_index:9, sub_index:13, direction:3, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,0,]},
            5748:{orientation:12, main_index:9, sub_index:12, direction:3, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,]},
            5844:{orientation:12, main_index:9, sub_index:14, direction:3, walk:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1,1,1,1,0,]},
        }
    }
};
for(var l in level){
    level[l].tiles={};  
    for(i in level[l].header) if(!level[l].tiles[i]) level[l].tiles[i]=loadImage(level[l].prefix+i+".png");
} 

var floor=document.getElementById("floor").getContext("2d");
floor.w=floor.canvas.width;
floor.h=floor.canvas.height;
var tw=160, th=tw/2, s=tw*0.705, a=Math.PI/4, visible=7, asin=acos=Math.sin(a);

var barrelSprite=loadImage("sprite/barrel64.png");
var coinSprite=loadImage("sprite/coins10.png");
var potionSprite=loadImage("sprite/potions.png");

function isWayWall(x,y){
    var block_x = Math.floor(x/s),
        block_y = Math.floor(y/s),
        ix = Math.floor((x%s)/(s/5)),
        iy = 4-Math.floor((y%s)/(s/5)),
        w_inx = iy*5+ix, h, idx;
    for(var l in level){
        if(level[l].map[block_y] && (idx=level[l].map[block_y][block_x]) && (h=level[l].header[idx])){
            if(h.walk[w_inx]==1) return false;
            else if(h.orientation==3){
                for(var idx in level.wall.header){
                    var tb=level.wall.header[idx];
                    if(tb.main_index==h.main_index && tb.sub_index==h.sub_index && tb.orientation==4 && h.walk[w_inx]==1){
                        return false;
                    }
                }
            }   
        }
    }    
    return true;
}

function getFloorTile(x, y) {
    if(!level.floor.map[y]) return null;
    if(!level.floor.map[y][x]) return null;
    var f = level.floor.map[y][x];
    return level.floor.tiles[f];
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

var hero=new HeroBarbarian(s*3,s*3);
setInterval(function(){
    hero.health=Math.min(hero.health+10, hero.origin_health);
},2000);

// aggresive mobs
var monsters=[],deathmobs=[],barrels=[],coins=[],potions=[],walls=[];
for(var i=0;i<2;i++) monsters.push(new AgressiveMob(randomx(),randomy(), 'SK'));
for(var i=0;i<2;i++) monsters.push(new AgressiveMob(randomx(),randomy(), 'FS'));
for(var i=0;i<2;i++) monsters.push(new AgressiveMob(randomx(),randomy(), 'SI'));
//for(var i=0;i<2;i++) barrels.push(new Barrel(randomx(),randomy()));
for(var i=0;i<2;i++) potions.push(new PotionHealth(randomx(), randomy()));

for(var y in level.wall.map){
    for(var x in level.wall.map[y]){
        var index = level.wall.map[y][x];
        if(index>0){
            walls.push(new Wall(index,x*s,y*s));
        }
    }
}
for(var y in level.object.map){
    for(var x in level.object.map[y]){
        var index = level.object.map[y][x];
        if(index>0){
            walls.push(new WallObject(index,x*s,y*s));
        }
    }
}

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
    var mx=(e.offsetX==undefined?e.layerX:e.offsetX) - floor.w/2;
    var my=(e.offsetY==undefined?e.layerY:e.offsetY) - floor.h/2;
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
    if(e.keyCode==9){
        showMap=!showMap;
        return false;
    }
}

var showMap=false;
setInterval(function() {
    if(imageCount>0) return;
    hero.nextStep();
    for(var i in monsters) monsters[i].nextStep();
    floor.fillStyle="black";floor.fillRect(0,0, floor.w,floor.h);
    renderFloor();
    renderHeroHealth()
    renderHeroBelt();
    if(showMap) renderMap();
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
    var all=[monsters,potions,barrels,click?[]:[hero],click?[]:walls];
    for(var t in all) 
        for(var m in all[t]) 
            if(all[t][m].isAboveHero()) 
                tmp_zb.push(all[t][m]);
    // asc sort
    tmp_zb.sort(function(a,b){ var c=(b.x+b.offset_x)+(b.y+b.offset_y)-(a.x+a.offset_x)-(a.y+a.offset_y); return order?c:0-c});
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
            floor.drawImage(tile, Math.round(sx-tile.width/2)+1, Math.round(sy-tile.height)+1);
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
        maxy=Math.min(level.floor.map.length-1,fdy+visible),
        minx=Math.max(0, fdx-visible),
        maxx=Math.min(level.floor.map[0].length-1,fdx+visible);
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
                floor.drawImage(tile, tx, ty, tile.width+0.707, tile.height+0.707);
            }
        }
    }
    floor.translate(th, 0); // retranslate for diamond textures
    renderObjects();
    floor.restore();
}

function renderMap() {
    floor.save();
    floor.translate(floor.w/2, floor.h/2);
    var sc=0.5;
    floor.scale(1*sc,0.5*sc);
    floor.rotate(Math.PI*0.25);
    floor.translate(-hero.x, -hero.y);
    floor.fillStyle="rgba(0,0,0,0.5)";
    var wallOffset=[];
    for(var y=4;y>=0;y--) for(var x=0;x<=4;x++) wallOffset.push({x:x*s/5, y:y*s/5});
    for(var i in walls){
        var v=walls[i], walk=v.header.walk;
        if(v.header.orientation==4)continue;
        for(var j=0;j<25;j++) if(walk[j]==1) floor.fillRect(v.x+wallOffset[j].x, v.y+wallOffset[j].y, s/5, s/5);
    }
    floor.fillRect(hero.x, hero.y, s/5, s/5);
    floor.restore();
}

function remove(ar,v){var i=ar.indexOf(v);if(i>=0)ar.splice(i,1);}
function randomx(){return Math.floor(Math.random()*(level.floor.map[0].length)*s);}
function randomy(){return Math.floor(Math.random()*(level.floor.map.length)*s);}

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

function BaseWall(sprite,header,x,y){
    Shape.call(this,sprite,x,y);
    this.header=header;
    this.isAboveHero=function(){return true;}
    this.offset_x-=14;
    this.offset_y+=82;
}

function Wall(index,x,y){
    BaseWall.call(this,level.wall.tiles[index],level.wall.header[index],x,y);
    switch(this.header.orientation){
        case 2:
            this.offset_x+=16;
            break;
        case 6:
            this.offset_x+=16;
            break;
        case 5:
            this.offset_x-=16;
            break;
        case 3:
            for(var inx in level.wall.header){
                var h = level.wall.header[inx];
                if(h.orientation==4 && h.main_index==this.header.main_index && h.sub_index==this.header.sub_index){
                    walls.push(new Wall(inx, x, y))
                    break;
                }
            }
            this.offset_x+=16;
            break;
        case 4:
            this.offset_x-=16;
            break;
    }
}

function WallObject(index,x,y){
    BaseWall.call(this,level.object.tiles[index],level.object.header[index],x,y);
    this.offset_x+=16;
    var self=this;
    load(this.sprite, function(){
        if(self.sprite.width<160){
            self.offset_x-=(160-self.sprite.width)/2
        }
    })
    
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
    this.to_x=x;this.to_y=y;
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
        var l=this.currentState.angles;
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
        var dx=(this.to_x - this.x),
            dy=(this.to_y - this.y);
        if((Math.sqrt((dx*dx)+(dy*dy)))>this.st){ // run
            var tx=0;ty=0;
            for(var st=0;st<this.st;st+=0.01){
                var sx=st * dx / Math.sqrt((dx*dx) + (dy*dy));
                var sy=sx * dy / dx;
                if(isWayWall(this.x+sx,this.y+sy)){tx=sx;ty=sy;}
                else break;
            }
            this.rotate(tx, ty);
            if(Math.sqrt((tx*tx)+(ty*ty))>=this.st/2){
                this.x+=tx;
                this.y+=ty;
                this.setState(this.run);
            }
            else{ this.setState(this.stay); this.x+=tx;this.y+=ty;this.to_x=this.x;this.to_y=this.y;}
        } else{ this.setState(this.stay); this.to_x=this.x;this.to_y=this.y;}
        this.step=(this.step+1)%(this.currentState.steps);
        this.sprite=this.currentState;
    }
    this.origin_health=this.health=1000;
    this.resistance=10; // damage resistance, less than 1000
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
        }else this._nextStep();
        this.offset_y=this.currentState==this.attack?this.attackOffset:this.normalOffset;
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
    this.attackOffset=40;
    this.normalOffset=10;
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