const game= document.getElementById("flood-game");
document.getElementById("date").innerHTML= `&copy ${new Date().getFullYear()}`;
game.addEventListener('mouseleave', ()=>{
    const remC1=document.getElementsByClassName("grow");
    const remC2=document.getElementsByClassName("highlight");
    for (const t of remC1) { 
            t.classList.remove("grow");
     }
     for (const t of remC2) { 
        t.classList.remove("highlight");
    }
});


let width=16;   //if width > height, adds empty rows. 
let height=16; //if the height is less than width -> problem?
let depth=7;
//const dev=true;


let steps=[];
let stepCount =-1;// the first move is grid initialising the player's base.

let startingPosition =[0,0];

//private: 
let grid=[];
let colors=[{}];
let playerTerritory=[];//use player territory for testing and recursions. 
let base=[];// use base for painting
const uiStepDelay=50;//milliseconds
// const totalAnimationTime=2000;/*  */

createColors(depth);
createGame(0);//time seed in the future - so that every refresh of the page make a new version.
consoleGrid();
updateToScreen(grid);
//playValue();
playValue(grid[startingPosition[0]][startingPosition[1]]);// initialise the game.
//addToTerritory(startingPosition, grid[ startingPosition[0] ][ startingPosition[1] ] );
function consoleGrid(){
    for (let y = 0; y < height; y++) {
        let line="";
        for (let x = 0; x < width; x++) {
            line+=`${grid[x][y]}  `;
        }
        console.log(line);
    }
    console.log("\n");
}


function playValue(value){

    value=Number(value);
    if (!value){
       /////////---> debug showWinAnimation();
        return;
    }
    stepCount++;
     console.log("THE PLAY VALUE FOR STEP "+stepCount+" is: "+ value);
    
    
    document.documentElement.style.setProperty('--clr-base', colors[value]);
    if(!base){
        addToTerritory([startingPosition[0],startingPosition[1]])
    }

    for (const k of base) {
        //console.log('base: '+ k +`it illiterally is: ${k[0]}-${k[1]} `);
        const tile =document.getElementById(`tile${k[0]}-${k[1]}`);
        //console.log(`CONST TILE =: ${tile} `);
       
       // console.log(`removed the old c value class of `);
        grid[k[0]][k[1]] = value;   
        tile.classList.add(`base`);
        tile.setAttribute("value",value) //a=grid[x][y];
        setTimeout(()=>{
            tile.style.backgroundColor=colors[value];
        },uiStepDelay*(k[0]+k[1]));
       
    }
    for (const k of playerTerritory)
    {
        console.log(`k of playerterritory: ${k} illiterary values are: ${k[0]},${k[1]}`);
        console.log(`test South: ${testSouth(id(k),grid[k[0]][k[1]])} && southTile(id(k)).classList.contains("base")? ${southTile(id(k)).classList.contains("base")} `);
        if(testNorth(id(k)) && !northTile(id(k)).classList.contains("base")){
            addToTerritory(  [k[0],k[1]-1]   );
        }
        if( testEast(id(k)) && !eastTile(id(k)).classList.contains("base")){
            addToTerritory([k[0]+1,k[1]]);
        }
        if(  testSouth(id(k)) && !southTile(id(k)).classList.contains("base") ){
            addToTerritory([k[0],k[1]+1]);
        }
        if( testWest(id(k)) && !westTile(id(k)).classList.contains("base")){
            addToTerritory([k[0]-1,k[1]]);
        }
        
        
    }
    //assesWin if base.size() === width*height -> win
    //else
    assessTerritory();//cleanout unnecessary points in the cutting edge.
    consoleGrid();

}

function showWinAnimation()
{   
    /*show everything bla bla:*/
    createGame();// creates a new grid. 
    for (let y=0;y<height;y++){
        for(let x=0;x<width;x++){
            
            setTimeout(() => {
                const tile =document.getElementById(`tile${x}-${y}`);
                tile.classList.remove(`c${grid[x][y]}`);
                tile.classList.remove("highlight");
                tile.classList.remove("grow");
                tile.style.background=" hotpink";

                for(let c=0;c<=depth;c++) // C what I did there? ;>
                {
                    if(c==depth){
                        setTimeout(()=>{
                            tile.style.backgroundColor=`${colors[grid[x][y]]}`; //the new grid value (Math.floor(Math.random()*depth)+1)
                        }, uiStepDelay*(uiStepDelay/depth)*c);
                        break;
                    } 
                    setTimeout(()=>{
                        tile.style.backgroundColor=`${colors[c]}`;
                    }, uiStepDelay*(uiStepDelay/depth)*c);
         
                } //
            }, ((x+y)*uiStepDelay) );
        }     
    }
}
function addToTerritory(coordinates=startingPosition, colorVal = grid[ startingPosition[0] ][ startingPosition[1] ]   )
{
    let x=coordinates[0];
    let y=coordinates[1];

    playerTerritory.push(coordinates);
    base.push(coordinates);

    tile(id(coordinates)).classList.remove(`c${grid[k[0]][k[1]]}`);
    tile(id(coordinates)).classList.add("base");
}
function assessTerritory(){
    for (const k of playerTerritory){
        if(         (testNorth(id(k), grid[k[0]][k[1]]) || k[1]-1<0)   
                &&  (testEast(id(k), grid[k[0]][k[1]])  || k[0]+1>=width) 
                &&  (testSouth(id(k),grid[k[0]][k[1]])  || k[1]+1>=height) 
                &&  (testEast(id(k), grid[k[0]][k[1]])  || k[0]-1>0)  
                ){
                    playerTerritory.splice(playerTerritory.indexOf(k));
                }   
    }   
}
function inPlayerTerritory(tileID)
{
    const x=Number(tileID.substring(4, tileID.indexOf('-')));
    const y=Number(tileID.substring(tileID.indexOf('-')+1)); 
    for (const point of base) {
        if(point[0]===x &&point[1]===y)
            return true;
    }
    return false;
}
//function devTerritory(){}
function id(point){
    return `tile${point[0]}-${point[1]}`
}
function point(id){
    return [Number(tileID.substring(4, tileID.indexOf('-'))),Number(tileID.substring(tileID.indexOf('-')))];
}
function testNorth(tileID, value=grid[startingPosition[0],startingPosition[1]]){

    const x=Number(tileID.substring(4, tileID.indexOf('-')));
    let y=Number(tileID.substring(tileID.indexOf('-')+1)); 
    value=Number(value); //force cast to number
    if(!value)
        return false;
    //console.log (`TileBeingTested: \t${x}\t${y}: with ints because ${x+y}` );
    if(y-1<0)
        return false;//out of bounds.

    //adjust offset
    y-=1;


    if(value === playerTerritory){
        for (const point of value) {
            if(point[0]===x &&point[1]===y)
                return true;
        }
    }else{
        //test for the physical value
        if(grid[x][y]===value)   
            return true;

    }
    return false;
}
function testEast(tileID, value=grid[startingPosition[0],startingPosition[1]]){
    let x=Number(tileID.substring(4, tileID.indexOf('-')));
    const y=Number(tileID.substring(tileID.indexOf('-')+1)); 
    
    //console.log (`TileBeingTested: \t${x}\t${y}: with ints because ${x+y}` );
    if(x+1>=width)
        return false;//out of bounds.

    //adjust offset
    x+=1;

    if(value === playerTerritory){
        for (const point of value) {
            if(point[0]===x &&point[1]===y)
                return true;
        }
    }else{
        //test for the physical value
        if(grid[x][y]===value)   
            return true;

    }
    return false;
}
function testSouth(tileID, value=grid[startingPosition[0],startingPosition[1]]){
    const x=Number(tileID.substring(4, tileID.indexOf('-')));
    let y=Number(tileID.substring(tileID.indexOf('-')+1)); 
    
    //console.log (`TileBeingTested: \t${x}\t${y}: with ints because ${x+y}` );
    if(y+1>height)
        return false;//out of bounds.

    //adjust offset
    y+=1;

    if(value === playerTerritory){
        for (const point of value) {
            if(point[0]===x &&point[1]===y)
                return true;
        }
    }else{
        //test for the physical value
        if(grid[x][y]===value)   
            return true;

    }
    return false;
}
function testWest(tileID, value=grid[startingPosition[0],startingPosition[1]]){
    let x=Number(tileID.substring(4, tileID.indexOf('-')));
    const y=Number(tileID.substring(tileID.indexOf('-')+1));   
    //console.log (`TileBeingTested: \t${x}\t${y}: with ints because ${x+y}` );
    if(x-1<0)
        return false;//out of bounds.
    //adjust offset
    x-=1;
    if(value === base){
        for (const point of playerTerritory) {
            if(point[0]===x &&point[1]===y)
                return true;
        }
    }else{
        //test for the physical value
        if(grid[x][y]===value)   
            return true;

    }
    return false;
}
function north(tileID){
    const x=Number(tileID.substring(4, tileID.indexOf('-')));
    let y=Number(tileID.substring(tileID.indexOf('-')+1)) -1;
    return `tile${x}-${y}`;
}
function east(tileID){
    let x=Number(tileID.substring(4, tileID.indexOf('-'))) +1;
    const y=Number(tileID.substring(tileID.indexOf('-')+1));
return `tile${x}-${y}`;
}
function south(tileID){
    const x=Number(tileID.substring(4, tileID.indexOf('-')));
    let y=Number(tileID.substring(tileID.indexOf('-')+1)) +1;
return `tile${x}-${y}`;
}
function west(tileID){
    let x=Number(tileID.substring(4, tileID.indexOf('-')))-1;
    const y=Number(tileID.substring(tileID.indexOf('-')+1));
    return `tile${x}-${y}`;
}
function northTile(tileID){
    return document.getElementById(north(tileID));
}
function eastTile(tileID){
    return document.getElementById(east(tileID));
}
function southTile(tileID){
    return document.getElementById(south(tileID));
}
function westTile(tileID){
    return document.getElementById(west(tileID));
}
function tile(tileID){
    return document.getElementById(tileID);
}

function adjacentToPlayerTerritory(tileID){
    if(testNorth(tileID, playerTerritory))
    {
        /* add likemindeds

        */
         return true;
    
    }
    /* else if(testNorth(tileID, Number(document.getElementById(tileID).getAttribute("value"))))
    return adjacentToPlayerTerritory(north(tileID)) */


    if(testEast(tileID, playerTerritory))
         return true;
       /*   else if(testEast(tileID, Number(document.getElementById(tileID).getAttribute("value"))))
         return adjacentToPlayerTerritory(east(tileID))
  */
   
         if(testSouth(tileID, playerTerritory))
         return true;
     /*     else if(testSouth(tileID, Number(document.getElementById(tileID).getAttribute("value"))))
         return adjacentToPlayerTerritory(south(tileID))
     */
   
         if(testWest(tileID, playerTerritory))
         return true;
  /*        else if(testWest(tileID, Number(document.getElementById(tileID).getAttribute("value"))))
            return adjacentToPlayerTerritory(west(tileID))
  */
         return false;
}

function createGame(seed =1)
{
    steps=[];
    stepCount=-1;
    playerTerritory=[];
    base =[];
    //base.push(startingPosition);
    //playerTerritory.push(startingPosition);

    for (let y=0;y<height;y++){
        let values={};
        for(let x= 0;x<width;x++){
                values[x]= Math.floor(Math.random(seed++)*1000%depth);
      //      consolePreview+=`${values[x]}\t`;
        }
        grid[y]=values;
        
    }
    
}
function createColors(depth=4,saturation=50,lightness=50){
    const interval=360/(depth+1); 
    for(let i =0; i<depth;i++)
        {
            let degree =i*interval;
            colors[i]= `hsl(${i*interval},${saturation}% ,${lightness}%)`; 

        }
}
function updateTerritoryColor(val){
    const colorNum=Number(val);
    for (const k of playerTerritory){
       
       //get associated tile
        const tile =document.getElementById(`tile${k[0]}-${k[1]}`);
       
       //remove current color info
        tile.classList.remove(`c${grid[k[0]][k[1]]}`);
       
       //set new value
        grid[k[0]][k[1]] = colorNum;   

       //set new color class
       tile.classList.add(`c${colorNum}`);
       
       //add new value to tile 
       tile.setAttribute("value",colorNum) //a=grid[x][y];
        
        //this is the important part
        tile.style.backgroundColor=colors[colorNum];
    }

}
function highlightPotentialGain(event){
    if( !inPlayerTerritory(event.target.id) )       
    event.target.classList.add("grow"); 
  else    
      return; //do nothing if it is in the player territory. 

  //the value of the possible selection by number
  const highlightColor = event.target.getAttribute("value");

  //limits the highlight only to elements of the same value (the value is added as class "c${highlightColor}")
  let highlightedTiles=document.getElementsByClassName(`c${highlightColor}`);
  
  //test each of these tiles and only add the class "highlight" to those directly adjacent to a player tile - player tiles are stored by coordinates in an integer array playerTerritory[] (it is an array of tiles but stored as points [1,0] of coordinates.)
  for (const t of highlightedTiles) {
          
      //TODO: test if(adjacentToPlayerTerritory(t.id) )
          t.classList.add("highlight");
          /*TODO: test all neighbours for same value (if it matches the current tile, do this function for that tile too) recursively, skip player territory*/    

  }
}
function updateToScreen(grid)
{
    game.innerHTML="";//clear the grid.
    
    for (let y=0;y<height;y++){//foreach row...
        const row =document.createElement("div");
        row.id=`row${y}`;
        row.classList.add("row");
        row.classList.add(`row${y}`)
       
        
        for(let x= 0;x<width;x++){//foreach column (tile in row)
           const tile =document.createElement("div");
            
            tile.id=`tile${x}-${y}`;
            tile.classList.add("tile");
            tile.classList.add(`c${grid[x][y]}`);
            tile.setAttribute("value",grid[x][y]) //a=grid[x][y];
            tile.style.backgroundColor=colors[grid[x][y]];

            tile.addEventListener("mouseover", highlightPotentialGain);
            tile.addEventListener("click", (event)=>{

                ///TODO PLAY SQUISH SOUND

                const play = event.target.getAttribute("value");
                playValue(play); 
            });
            tile.addEventListener("mouseleave", (event)=>{
                //console.log(event.target);
                event.target.classList.remove("grow"); 
                const highlightColor = event.target.getAttribute("value");
                //console.log(event.target.getAttribute("value"));
                const highlightedTiles=document.getElementsByClassName("highlight");
                for (const t of highlightedTiles) {
                    t.classList.remove("highlight");
                   // t.setAttribute("style","");
                }
                //event.toElement
            });
            row.appendChild(tile);
        }
        game.appendChild(row);
    }
}