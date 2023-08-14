const game= document.getElementById("flood-game");
document.getElementById("date").innerHTML= `&copy ${new Date().getFullYear()}`;

let width=16;
let height=16;
let depth=7;
const dev=true;

  let startingPosition =[0,0];

//private: 
let grid=[[]];
let colors=[{}];
let playerTerritory=[[]];//a list of tiles in the unified region

createColors(depth);
createGame(0);//time seed in the future - so that every refresh of the page make a new version.
updateToScreen(grid);
addToTerritory(startingPosition, grid[ startingPosition[0] ][ startingPosition[1] ] );





















function play(value){
    //upate territory to new value
    for (const k of playerTerritory){
        const tile =document.getElementById(`tile${k[0]}-${k[1]}`);
        tile.classList.remove(`c${grid[k[0]][k[1]]}`);
        grid[k[0]][k[1]] = value;   
        tile.classList.add(`c${value}`);
        tile.setAttribute("value",value) //a=grid[x][y];
        tile.style.backgroundColor=`hsl(${colors[value].degree},${colors[value].saturation},${colors[value].lightness})`;
    }
    
   // if (adjacentToPlayerTerritory )
     
   //they get added in the onclick function using class.  addToTerritory(coordinates=startingPosition, value);

    
}


function addToTerritory(coordinates=startingPosition, colorVal = grid[ startingPosition[0] ][ startingPosition[1] ]   )
{
    //if ()
    let x=coordinates[0];
    let y=coordinates[1];
   /*  for (const point of playerTerritory) {
        if(point[0]===x &&point[1]===y)
            {
                //point is already in the territory

            }//return true;
    
    
    } */
    playerTerritory.push(coordinates); //only one point 
    
   /* 
    if(testNorth(`tile${coordinates[0]}-${coordinates[1]}`,colorVal))
        addToTerritory([x,(y-1)]);
    //add
    if(testEast(`tile${coordinates[0]}-${coordinates[1]}`,colorVal))
        addToTerritory([(x+1),y]);
    //add
    if(testSouth(`tile${coordinates[0]}-${coordinates[1]}`,colorVal))
        addToTerritory([x,(y+1)]);

    if(testNorth(`tile${coordinates[0]}-${coordinates[1]}`,colorVal))
        addToTerritory([(x-1),y]); */
    //add
//done
}
function inPlayerTerritory(tileID)
{
    const x=Number(tileID.substring(4, tileID.indexOf('-')));
    const y=Number(tileID.substring(tileID.indexOf('-')+1)); 
    for (const point of playerTerritory) {
        if(point[0]===x &&point[1]===y)
            return true;
    }
    return false;
}
//function devTerritory(){}

function testNorth(tileID, value){
    const x=Number(tileID.substring(4, tileID.indexOf('-')));
    let y=Number(tileID.substring(tileID.indexOf('-')+1)); 
    value=Number(value); //force cast to number
    //console.log (`TileBeingTested: \t${x}\t${y}: with ints because ${x+y}` );
    if(y-1<0)
        return false;//out of bounds.

    //adjust offset
    y-=1;


    if(value === playerTerritory){
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
function testEast(tileID, value){
    let x=Number(tileID.substring(4, tileID.indexOf('-')));
    const y=Number(tileID.substring(tileID.indexOf('-')+1)); 
    
    //console.log (`TileBeingTested: \t${x}\t${y}: with ints because ${x+y}` );
    if(x+1>=width)
        return false;//out of bounds.

    //adjust offset
    x+=1;

    if(value === playerTerritory){
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
function testSouth(tileID, value){
    const x=Number(tileID.substring(4, tileID.indexOf('-')));
    let y=Number(tileID.substring(tileID.indexOf('-')+1)); 
    
    //console.log (`TileBeingTested: \t${x}\t${y}: with ints because ${x+y}` );
    if(y+1>height)
        return false;//out of bounds.

    //adjust offset
    y+=1;

    if(value === playerTerritory){
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
function testWest(tileID, value){
    let x=Number(tileID.substring(4, tileID.indexOf('-')));
    const y=Number(tileID.substring(tileID.indexOf('-')+1));   
    //console.log (`TileBeingTested: \t${x}\t${y}: with ints because ${x+y}` );
    if(x-1<0)
        return false;//out of bounds.
    //adjust offset
    x-=1;
    if(value === playerTerritory){
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
    const x=Number(tileID.substring(4, tileID.indexOf('-')));
    let y=Number(tileID.substring(tileID.indexOf('-')+1)) -1;
    return document.getElementById(`tile${x}-${y}`);
}
function eastTile(tileID){
    let x=Number(tileID.substring(4, tileID.indexOf('-'))) +1;
    const y=Number(tileID.substring(tileID.indexOf('-')+1));
return document.getElementById(`tile${x}-${y}`);
}
function southTile(tileID){
    const x=Number(tileID.substring(4, tileID.indexOf('-')));
    let y=Number(tileID.substring(tileID.indexOf('-')+1)) +1;
return document.getElementById(`tile${x}-${y}`);
}
function westTile(tileID){
    let x=Number(tileID.substring(4, tileID.indexOf('-')))-1;
    const y=Number(tileID.substring(tileID.indexOf('-')+1));
    return document.getElementById(`tile${x}-${y}`);
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
    playerTerritory=[];
    //playerTerritory[0]=[startingPosition];

    //let consolePreview="";
    for (let y=0;y<height;y++){
        let values={};
        for(let x= 0;x<width;x++){
                values[x]= Math.floor(Math.random(seed++)*1000%depth);
      //      consolePreview+=`${values[x]}\t`;
        }
        grid[y]=values;
        //consolePreview+="\n"
    }
}
function createColors(depth=4,colorLimitPerSaturation=7,saturation="50%",lightness="50%"){
    const interval=360/depth; 
   // if (depth<=colorLimitPerSaturation){
        for(let i =0; i<depth;i++)
        {
            let degree =i*interval;
            colors[i]= {degree ,saturation,lightness};   //hsl()
            //console.log(`COLOR ${i}: HSL(${degree},${saturation},${lightness})`);
        }
    //}
    //else{
      /*   let groups=1;
        while(depth/groups>colorLimitPerSaturation){
            groups++;

        } */
        //implement a color scemer
  //  }


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
        tile.style.backgroundColor=`hsl(${colors[colorNum].degree},${colors[colorNum].saturation},${colors[colorNum].lightness})`;
    }

}
function updateToScreen(grid)
{
    game.innerHTML="";//clear the grid.

    for (let y=0;y<height;y++){
        const row =document.createElement("div");
        row.id=`row${y}`;
        row.classList.add("row");
        row.classList.add(`row${y}`)
       
        
        for(let x= 0;x<width;x++){
           // console.log( ` ${colors[grid[x][y]].degree} `);
            //console.log( `tile${x}-${y}, \tval: ${grid[x][y]} is: \thsl(${colors[grid[x][y]]},${colors[grid[x][y]]} ,${colors[grid[x][y]]})`); //.assert.apply. ...
           // row.innerHTML+=`<div id="tile${x}-${y}" class="tile" style="background-color:hsl(${colors[grid[x][y]].degree},${colors[grid[x][y]].saturation} ,${colors[grid[x][y]].lightness});"></div>`;
            const tile =document.createElement("div");
            
            tile.id=`tile${x}-${y}`;
            tile.classList.add("tile");
            tile.classList.add(`c${grid[x][y]}`);
            tile.setAttribute("value",grid[x][y]) //a=grid[x][y];
            tile.style.backgroundColor=`hsl(${colors[grid[x][y]].degree},${colors[grid[x][y]].saturation} ,${colors[grid[x][y]].lightness})`;

            tile.addEventListener("mouseover", (event)=>{
                //console.log(event.target);
                
               if( !inPlayerTerritory(event.target.id) ) 
               {
                
                event.target.classList.add("grow"); 
                //event.target.classList.con
            
                 }
                const highlightColor = event.target.getAttribute("value");
                //console.log(event.target.getAttribute("value"));
                let highlightedTiles=document.getElementsByClassName(`c${grid[x][y]}`);
                
          
                for (const t of highlightedTiles) {
                    //console.log("SOUTHTILE :" +southTile(t.id));
                    //test if close so user square
                   // console.log(`ev.target.id= ${target.event.id}  t.id: ${t.id}`)
                        if(!inPlayerTerritory(t.id) ){
                            t.classList.add("highlight");

                           /* if(testNorth(t.id,t.value) && !northTile(t.id).classList.contains("highlight") ){ //this adds the next tile - this should happen recursively.
                                northTile(t.id).classList.add("highlight"); 
                            }
                            if(testEast(t.id,t.value) && !eastTile(t.id).classList.contains("highlight")){ //this adds the next tile - this should happen recursively.
                                eastTile(t.id).classList.add("highlight"); 
                            }
        
                            if(testSouth(t.id,t.value) && !southTile(t.id).classList.contains("highlight")){ //this adds the next tile - this should happen recursively.
                                southTile(t.id).classList.add("highlight"); 
                            }
        
                            if(testWest(t.id,t.value) && !westTile(t.id).classList.contains("highlight")){ //this adds the next tile - this should happen recursively.
                                westTile(t.id).classList.add("highlight"); 
                            }*/
///TODO: ---------------                        //add neighbors of same coloretc.
                       // if ()
                    }
                    //t.setAttribute("style","Filter: Glow(Color=#00FF00, Strength=20)");
                }
                // classList.c
                highlightedTiles=document.getElementsByClassName("highlight");
                //console.log("TILE t of Hightlighted Tiles: "+highlightedTiles);
                for (const t of highlightedTiles) {
                    //add highlight class to group
                   // console.log("TILE t of Hightlighted "+t);

                    if(testNorth(t.id,t.value) && !northTile(t.id).classList.contains("highlight") ){ //this adds the next tile - this should happen recursively.
                        northTile(t.id).classList.add("highlight"); 
                    }

                    if(testEast(t.id,t.value) && !eastTile(t.id).classList.contains("highlight")){ //this adds the next tile - this should happen recursively.
                        eastTile(t.id).classList.add("highlight"); 
                    }

                    if(testSouth(t.id,t.value) && !southTile(t.id).classList.contains("highlight")){ //this adds the next tile - this should happen recursively.
                        southTile(t.id).classList.add("highlight"); 
                    }

                    if(testWest(t.id,t.value) && !westTile(t.id).classList.contains("highlight")){ //this adds the next tile - this should happen recursively.
                        westTile(t.id).classList.add("highlight"); 
                    }

                }

                //event.toElement
            });
            tile.addEventListener("click", (event)=>{

                ///TODO PLAY SQUISH SOUND

                const play = event.target.getAttribute("value");

                //this only gets one element...?
                const highlightedTiles=document.getElementsByClassName(`highlight`);
                //console.log(highlightedTiles);
          
                for (const t of highlightedTiles) {
                    //console.log(t);
                    //if(adjacentToPlayerTerritory(t.id)){ //already tested and highligted, because they are...
                        let x=Number(t.id.substring(4, t.id.indexOf('-')));
                        let y=Number(t.id.substring(t.id.indexOf('-')+1)); 
                        let point =[x,y];
                        addToTerritory(point);
                        t.classList.remove("highlight");
                    //}
                    //t.setAttribute("style","Filter: Glow(Color=#00FF00, Strength=20)");
                }
                //updateScreen();

                updateTerritoryColor(play);


                //event.toElement
            });
            tile.addEventListener("mouseleave", (event)=>{
                //console.log(event.target);
                event.target.classList.remove("grow"); 
                const highlightColor = event.target.getAttribute("value");
                //console.log(event.target.getAttribute("value"));
                const highlightedTiles=document.getElementsByClassName(`c${grid[x][y]}`);
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