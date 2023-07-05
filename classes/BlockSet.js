class BlockSet{
    
    constructor(rows, cols, list_of_inds){
        this.rows = rows;
        this.cols = cols;
        this.createBlocks(list_of_inds);
        this.Config = {
            leftX : width/4, 
            topY : height/4,
            sizeX : width/2/this.cols,
            sizeY : height/2/this.rows,
        }
    }
    drawSet(isBack){
        

        for(let i =0; i<this.list_of_blocks.length; i++ ){
            let block = this.list_of_blocks[i];
            //console.log(pair);
            if(!isBack) fill(155,0,0,55);
            else fill(0,0,155, 255);
            block.drawSelf(this.Config);
            
        }
    }

    moveBlock(){
        let inds = this.getSelected();
        let block = this.getBlock(inds);
        this.movingBlock = block;
        if(block != null){
            block.setMoving();
        }

    }

    settleBlock(){
        let inds = this.getSelected();
        
        if(this.movingBlock != null){
            if(inds[1] < this.cols && inds[1] >= 0 &&
                inds[0] < this.rows && inds[0] >= 0)
                this.movingBlock.settle(inds);
            else 
                this.movingBlock.settleBack();
        }

    }

    getBlock(inds){
        if(inds.length != 2) return;
        console.log("detected inds is",inds);
        for(let i=0; i<this.list_of_blocks.length; i++){
            let block = this.list_of_blocks[i];
            if(block.inds[0] == inds[0] &&
                block.inds[1] == inds[1])
                return block;
        }
        return null;
    }

    getSelected(){
        let indX = (mouseX-this.Config.leftX)/this.Config.sizeX;
        let indY = (mouseY-this.Config.topY)/this.Config.sizeY;
        indX = indX | 0;
        indY = indY | 0;
        if(indX < this.cols && indX >= 0 &&
            indY < this.rows && indY >= 0)
        {
            return [indY,indX];
        }
        else return [indY,indX, "notgood"];
    }

    createBlocks(list_of_inds){
        this.list_of_blocks = [];
        for(let i=0; i< list_of_inds.length; i++){
            
            this.list_of_blocks.push(new Block(list_of_inds[i]));
        }
    }
    
}
