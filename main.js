let level1;
function setup(){

    
    createCanvas(600,600);
    
    //construct levels
    let l1cost = (pos1, pos2) => {
        return Math.abs(pos1[0]-pos2[0]) + Math.abs(pos1[1]-pos2[1]);
    }
    var bs1  = new BlockSet(3,3,[[2,2],[1,1],[0,0]]);
    var bs2 = new BlockSet(3,3,[[2,0],[1,1],[0,2]]);
    level1 =  new Level(bs1,bs2,l1cost);
    let fontsize = 32;
    textSize(fontsize);
    textAlign(CENTER, CENTER);
}

function draw(){
    drawBackground();
    
    //rect(100,100,50,50);
    level1.drawLevel();
    text("haha", 40,40);
    //rect(250,100,50,50);
}

function mousePressed(){
    level1.getSelected();
    level1.respondPressed();
}

function mouseReleased(){
    level1.respondReleased();
}

function drawBackground(){
    background(200);
}

