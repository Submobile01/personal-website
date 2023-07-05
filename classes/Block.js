class Block{
    constructor(inds){
        this.inds = inds;
        this.origInds = inds;
        this.isMoving = false;
    }

    drawSelf(Config){
        //console.log(Config.leftX+this.inds[0]*Config.sizeX, Config.topY+this.inds[1]*Config.sizeY, Config.sizeX, Config.sizeY);
        if(!this.isMoving)
            rect(Config.leftX+this.inds[1]*Config.sizeX, Config.topY+this.inds[0]*Config.sizeY, Config.sizeX, Config.sizeY);
        else
            rect(mouseX-Config.sizeX/2, mouseY-Config.sizeY/2, Config.sizeX, Config.sizeY);
    }
    settle(inds){
        
        this.inds = inds;
        this.isMoving = false;
    }

    settleBack(){
        this.inds = this.prevInds;
        this.isMoving = false;
    }

    setMoving(){
        this.isMoving = true;
        this.prevInds = this.inds;
    }
}