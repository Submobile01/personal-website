class Level{
    constructor(bs1, bs2, cost){
        this.bs1 = bs1;
        this.bs2 = bs2;
        
        this.constructMatrix(cost);
        this.minCost = 10000000;
        this.solve();
        
    }
    drawLevel(){//needs work
        this.bs1.drawSet(true);
        this.bs2.drawSet(false);
        
    }
    constructMatrix(cost){//assume square matrix
        
        let dim = this.bs1.list_of_blocks.length;
        this.matrix = [];
        //console.log(this.matrix);
        for(let i=0; i<dim; i++){
            this.matrix[i] = [];
            
            
            for(let j=0; j<dim; j++){
                //console.log(i,j,matrix[i]);
                let curCost = cost(this.bs1.list_of_blocks[i],this.bs2.list_of_blocks[j]);
                this.matrix[i][j] =  curCost ;
            }
        }
        
    }
    solve(){
        //solves the level and gives one of the optimal ways
        let a = this.generate_n_arr(this.matrix.length);
        this.solve_with_perm(a,this.matrix.length, this.matrix.length);
        let string = "the best cost is " + this.minCost;
        let string2 = "the best permutation is " + this.bestPerm;
        textSize(32);
        fill(23);
        text(string, width/2, 0);
        text(string2, width/2, 20);
        console.log(this.minCost,this.bestPerm);
    }


    generate_n_arr(n){
        let arr = [];
        for(let i=1; i<=n; i++){
            arr.push(i);
        }
        return arr;
    }

    solve_with_perm(a,size,n){
        if (size == 1){
            let theCost = this.calculateCost(a); 
            console.log(a,theCost);
            if(theCost < this.minCost) {
                this.minCost = theCost;
                this.bestPerm = a;
            }
        }
        for (let i = 0; i < size; i++) {
            this.solve_with_perm(a, size - 1, n);
  
            // if size is odd, swap 0th i.e (first) and
            // (size-1)th i.e (last) element
            if (size % 2 == 1) {
                let temp = a[0];
                a[0] = a[size - 1];
                a[size - 1] = temp;
            }
  
            // If size is even, swap ith
            // and (size-1)th i.e last element
            else {
                let temp = a[i];
                a[i] = a[size - 1];
                a[size - 1] = temp;
            }
        }
    }

    calculateCost(a){
        let result = 0;
        for(let i=0; i<a.length; i++){
            result+=this.matrix[i][a[i]-1];
        }
        return result;
    }

    getSelected(){
        
    }

    respondPressed(){
        this.bs1.moveBlock();
    }

    respondReleased(){
        this.bs1.settleBlock();
    }

}