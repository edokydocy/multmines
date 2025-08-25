import { useActionState, useState } from "react";
import { Button } from "./components/ui/button";

enum Content{
    Mine,
    Number
}

class CellClass{
    isTouched: boolean;
    isFlagged: boolean;
    hasStarted: boolean;
    x: number;
    y: number;
    type: Content;
    value: number;  // mine number in 3x3 field
    // flagNumber: number;
    
    constructor(x: number, y: number, type: Content, value: number, hasStarted: boolean);

    constructor(fields: {x: number, y: number, type: Content, value: number, hasStarted: boolean});
    constructor(
        xOrFields: number | {x: number, y: number, type: Content, value: number, hasStarted: boolean},
        y?: number, type?: Content, value?: number, hasStarted?: boolean
    ) {
        if (typeof xOrFields === 'object') {
            this.x = xOrFields.x; this.y=xOrFields.y;
            this.isTouched =this.isFlagged =false;
            this.hasStarted = xOrFields.hasStarted;
            this.type = xOrFields.type; this.value = xOrFields.value;
        } else {
            this.x = xOrFields; this.y=y!;  // 必须有 ! 不然不能赋值
            this.isTouched =this.isFlagged =false;
            this.hasStarted = hasStarted!;
            this.type = type!; this.value = value!;
        }
    }


    withUpdates(updates: Partial<CellClass>): CellClass{    // Use of Partial
        // Good way of writing copy
        const clone = Object.assign(    // Object.assign(target, source)
            Object.create(Object.getPrototypeOf(this)),
            this
        )
        return Object.assign(clone, updates);
    }
}

interface CellProps{
    c: CellClass,
    isEnded: boolean,
    handleClick: (c: CellClass) => void,
    handleRightClick: (c: CellClass) => void,
}

const Cell: React.FC<CellProps> = ({c, isEnded, handleClick, handleRightClick}) => {
    const colorPicker = ()=>{
        if(c.isTouched == false){
            if(isEnded && c.isFlagged && c.type != Content.Mine){
                return "bg-red-600";
            }else{
                return "bg-gray-400";
            }
        }else if(c.type == Content.Number){
            return "bg-gray-600";
        }else{
            return "bg-red-600";
        }
    }
    return (
        <Button className={`${colorPicker()} border-2 w-8 h-9`} onClick={()=>{handleClick(c);}} onContextMenu={(e)=>{e.preventDefault();handleRightClick(c);}}>
            {c.isFlagged == true? "🚩"
            : c.isTouched == false? null
            : c.type == Content.Mine? "💥"
            : c.value == 0? null
            :  c.value
            }
        </Button>
    );
}

interface GridProps{
    gameId: number,
    R: number,
    C: number,
    mineNum: number,
    className?: string
}

const Grid: React.FC<GridProps> = ({gameId, R, C, mineNum, className}) => {
    /* INSIGHT: nested functions are not testable */

    /* Diretion */
    const Dir: number[][] = [[1,0],[0,1],[-1,0],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
    /* three possibilities: beforeStart, inGame, afterGame */
    const newGrid = (R: number, C: number)=>{
        return Array.from( {length: R}, (_, x)=> Array.from( {length: C}, (_, y)=> new CellClass(x, y, Content.Number, 0, false) ) );
    }
    let [mat, setMat] = useState<CellClass[][]>(newGrid(R, C));
    let [hasStarted, setHasStarted] = useState<boolean>(false);
    let [[ix, iy], setIxy] = useState([-1,-1]);
    let isEnded = false;    // no need to be hook
    const outOfBound = (x: number, y: number) => {
        if(x<0 || x>=R || y<0 || y>=C) return true;
        return false;
    }
    const calMineNum = (cell: CellClass) => {
        let cnt = 0;
        for(let i=0; i<8; i++){
            const dx = cell.x + Dir[i][0], dy = cell.y + Dir[i][1];
            if(outOfBound(dx, dy)) continue;
            console.log(dx, dy);
            if(mat[dx][dy].type == Content.Mine) cnt++;
        }
        return cnt;
    }
    // only be called once after game get started
    /* first click of game
        OR first reveal on one cell 
        OR second reveal on one cell */
    const handleClick = (c: CellClass)=>{
        /* If isEnded, no response */
        if(isEnded)return;
        let newMat = mat.map((row,i)=>[...row]);
        const genMines = (cell: CellClass) => {
            // console.log("**** ", cell.x, cell.y);
            let cnt = 0;
            while(cnt<=mineNum){
                const x = Math.floor(Math.random() * R), y = Math.floor(Math.random() * C);
                // console.log(x, y);
                if(Math.abs(cell.x-x) <= 1 && Math.abs(cell.y-y) <= 1) continue;  // make sure first click is on blank space
                if(newMat[x][y].type == Content.Mine) continue;
                newMat[x][y].type = Content.Mine;
                cnt ++;
            }
            newMat = mat.map((row, i)=>(row.map((cell, j)=>(cell.withUpdates({hasStarted: true, value: calMineNum(cell)})))));
        };
        const reveal = (c: CellClass)=>{
            newMat[c.x][c.y].isTouched = true;
            if(c.type != Content.Number || (c.value != 0 && !checkFlags(c))) return;
            for(let i=0; i<8; i++){
                const dx = c.x+Dir[i][0], dy = c.y+Dir[i][1];
                if(outOfBound(dx, dy)) continue;
                if(newMat[dx][dy].isTouched == true || newMat[dx][dy].isFlagged == true) continue;
                reveal(newMat[dx][dy])
            }
        };
        const checkFlags = (c: CellClass) =>{
            let cnt = 0;
            for(let i=0; i<8; i++){
                const dx = c.x + Dir[i][0], dy = c.y + Dir[i][1];
                if(outOfBound(dx, dy)||mat[dx][dy].isFlagged==false) continue;
                cnt++;
            }
            console.log("As result of flag check");
            console.log(c);
            console.log("cnt=", cnt, " c.value=", c.value, (cnt==c.value));
            return (cnt==c.value);
        }
        if(c.hasStarted == false){
            setIxy([c.x, c.y]);
            genMines(c);
            reveal(newMat[c.x][c.y]);
            setMat(newMat);
            console.log(mat.map((row, i)=>row.map((cell, j)=>cell.type)));
        }else if(c.isFlagged == false && c.isTouched == false){
            reveal(newMat[c.x][c.y]);
            setMat(newMat);
        }else if(c.isFlagged == false && checkFlags(c)){
            reveal(newMat[c.x][c.y]);
            setMat(newMat);
        }
    };
    const handleRightClick = (c: CellClass) => {
        if(isEnded) return;
        if(!c.hasStarted) return;
        if(c.isTouched == true) return;
        console.log("Im triggered")
        console.log(c);
        setMat(prevmat => prevmat.map((row, i)=>
            i!=c.x? row:
            row.map((cell, j)=>
                j!=c.y? cell: c.withUpdates({isFlagged: !c.isFlagged})
            )
        ));
        console.log(c.withUpdates({isFlagged: !c.isFlagged}));
        console.log(c.isFlagged);
    };

    // Check if game end here; If encounter wrong flagged mine and clicked mine, let it go.
    // Because control flow will be back here anyway.
    const checkIfEnd = ()=>{
        for(let i=0; i<R; i++){
            for(let j=0; j<C; j++){
                if(mat[i][j].type == Content.Mine && mat[i][j].isTouched == true)
                    isEnded = true;
            }
        }
    }
    console.log("Grid rerendered");
    checkIfEnd();
    return (
        <div className={className}>
            {
                mat.map((r, x)=>( 
                <div key={x} className="flex">
                    {r.map((c, y)=>(
                        <Cell key={`${x}-${y}`} c={c} isEnded={isEnded} handleClick={handleClick} handleRightClick={handleRightClick}></Cell>
                    ))}
                </div> ))
            }
        </div>
    )   
}

export default Grid;