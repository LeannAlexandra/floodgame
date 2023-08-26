//SET CONSTANTS
const browser= window;
const gameContainer=document.getElementsByClassName("flood-game-container")[0];
const game= document.getElementById("flood-game");


//set dynamic date 
document.getElementById("date").innerHTML= `&copy ${new Date().getFullYear()>2023? "2023 - "+ new Date().getFullYear(): new Date().getFullYear()}`;

//INITIALIZE VARIABLES
let width=16;   // CURRENT KNOWN LIMITATIONS: - grid must be width==height... ie a square.
                //if width > height, adds empty rows. 
let height=16; //if the height is less than width -> problem?
let depth=7;
//const dev=true;
let steps=[];
let stepCount =-1;// the first move is grid initialising the player's base.
// let functionCount=0;
let startingPosition =[0,0];

//private: 
let grid=[];
let colors=[{}];
let playerTerritory=[];//use player territory for testing and recursions. 
let base=[];// use base for painting
const uiStepDelay=50;//milliseconds
// const totalAnimationTime=2000;/*  */

// Array to store sound file URLs
var soundFiles = [
     "sounds/pop1.flac", 
     "sounds/pop2.wav  ", 
     "sounds/pop3.wav  ", 
     "sounds/pop4.wav  ", 
     "sounds/pop5.mp3  ", 
     "sounds/pop6.ogg  ", 
     "sounds/pop7.aiff  ", 
     "sounds/pop8.wav  ", 
     "sounds/pop9.wav  ", 
     "sounds/pop.wav"
];

var clickAudio = new Audio("sounds/click.wav");
// Preload audio elements in the background
var popingsound = soundFiles.map(function(soundUrl) {
    var audio = new Audio(soundUrl);
    audio.preload = "auto"; // Preload the audio file
    return audio;
});

function clickSound(){
    clickAudio.play();
}
// Function to play a sound by index
function playSound() {
    var randomIndex = Math.floor(Math.random() * popingsound.length);
    popingsound[randomIndex].play();
}


// GLOBAL LISTENERS
browser.addEventListener("resize",adjustGameSizeOnScreen);

function adjustGameSizeOnScreen(ev){
    let smaller=0;
    if(!ev){
        smaller= window.innerWidth>window.innerHeight - 141 ? window.innerHeight-131:window.innerWidth;
    }else{
        smaller= ev.target.innerWidth>ev.target.innerHeight - 141 ? ev.target.innerHeight-131:ev.target.innerWidth;
    }
   //the constant 130 ...- it is basically title (fixed 61px + footer fixed 50px = 111 + 4vh (30 px) // suspected never to be the issue anyway .. but here goes...  )
    //smaller= ev.target.innerWidth>ev.target.innerHeight - 141 ? ev.target.innerHeight-131:ev.target.innerWidth;
   //if (smaller==ev.target.innerHeight) { /* the padding in css will take care of this - i hope */}
   let tileSize=smaller/height>smaller/width? `${Math.floor(smaller/width)}px`:`${Math.floor(smaller/height)}px`;
//    tileSize=tileSize*width>smaller? tileSize-1
   document.documentElement.style.setProperty(`--var-row-size`,tileSize );
   document.documentElement.style.setProperty(`--var-column-size`, tileSize);
  //this code keeps them square...even on small screens.
  
   //we use this to set max -tile size... (to keep them square - ) also we use this to set our color frame gone on mobile.
   if (smaller<765) //under 820...>remove padding 
       document.documentElement.style.setProperty(`--var-game-frame-padding`,`0px`);
   else
       document.documentElement.style.setProperty(`--var-game-frame-padding`,`6px`);

}
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

adjustGameSizeOnScreen();//upon init morph to screensize.
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
        //console.log(line);
    }
    //console.log("\n");
}


function playValue(value){
    //console.log(`trying to play: ${value}`)
    value=Number(value);
    //consoleLog(value);
    stepCount++;
 
    //set frame * glow color 
    document.documentElement.style.setProperty('--clr-base', colors[value]);


    if(!base){
        //console.log(`resetting base?`);
        addToTerritory(startingPosition)
    }
    //console.log(`currently our base are belong to us ${base}`); //this is our problem - base...
    let totalBaseSize=0;
    // paint base 
    for (const k of base) {
        totalBaseSize+=1; //on second thought base.length would work fine...
        const tile =document.getElementById(`tile${k[0]}-${k[1]}`);
        grid[k[0]][k[1]]=value;
        setTimeout(()=>{
            tile.style.backgroundColor=colors[value];
            playSound();
        },uiStepDelay*(k[0]+k[1]));
    }
    for(const coordinates of playerTerritory){
        if (!inPlayerTerritory(north(coordinates)) && testNorth(coordinates)) 
        addToTerritory(north(coordinates));
    if (!inPlayerTerritory(east(coordinates)) && testEast(coordinates)) 
        addToTerritory(east(coordinates));
    if (!inPlayerTerritory(south(coordinates)) && testSouth(coordinates)) 
        addToTerritory(south(coordinates));
    if (!inPlayerTerritory(west(coordinates)) && testWest(coordinates)) 
        addToTerritory(west(coordinates));
    }

    //addToTerritory(value);
    if(base.length === width*height){
        showWinAnimation();
    }
    //assessTerritory();
    consoleGrid();
}



function showWinAnimation()
{   
    /*show everything bla bla:*/
    ////////SEND PLAY DATA TO SERVER?
    ////////SAVE USER PROGRESS?
    ////////UPDATE LEADERBOARD ON SERVER?
    //increate game number.

    
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
                        setTimeout(()=>{ // the last iteration. 
                            tile.style.backgroundColor=`${colors[grid[x][y]]}`; //the new grid value (Math.floor(Math.random()*depth)+1)
                            tile.classList.remove("base");
                            tile.classList.add(`c${grid[x][y]}`)
                            tile.setAttribute("value",grid[x][y]);
                            document.documentElement.style.setProperty('--clr-base', colors[(grid[startingPosition[0]][startingPosition[1]])]);
                        }, uiStepDelay*(uiStepDelay/depth)*c);
                        break;
                    } 
                    setTimeout(()=>{
                        tile.style.backgroundColor=`${colors[c]}`;
                        if(point(tile.id)[0]+point(tile.id)[1] == startingPosition[0]+startingPosition[1])
                            document.documentElement.style.setProperty('--clr-base', colors[ c ]);
                    }, uiStepDelay*(uiStepDelay/depth)*c);
         
                } //
            }, ((x+y)*uiStepDelay) );
        }     
    }
}
function addToTerritory(coordinates=startingPosition)
{
    // functionCount++;
    // if (functionCount>devLimit)
    //     return;
    let x=coordinates[0];
    let y=coordinates[1];

    //console.log(`adding ${x}:${y} to base.`);
    
    base.push(coordinates);
    playerTerritory.push(coordinates);

    const t =tile(id(coordinates))
    if(t){
        t.classList.remove(`c${grid[ x][y]}`);
        t.classList.add("base");
    }
    if (!inPlayerTerritory(north(coordinates)) && testNorth(coordinates)) 
        addToTerritory(north(coordinates));
    if (!inPlayerTerritory(east(coordinates)) && testEast(coordinates)) 
        addToTerritory(east(coordinates));
    if (!inPlayerTerritory(south(coordinates)) && testSouth(coordinates)) 
        addToTerritory(south(coordinates));
    if (!inPlayerTerritory(west(coordinates)) && testWest(coordinates)) 
        addToTerritory(west(coordinates));
    
    if( //all neighbors in territory or out of bounds.
        inPlayerTerritory(north(coordinates)) ||  (north(coordinates))[1]>0    
        && inPlayerTerritory(east(coordinates))  || (east(coordinates)) [0]<width    
        && inPlayerTerritory(south(coordinates))  || south(coordinates)[1]<height    
        && inPlayerTerritory(west(coordinates)) || west(coordinates)[0]>0    
    ){
            //clean from cutting edge once here* 
           for(let point in playerTerritory)
                if (point[0] === coordinates[0] && point[1] === coordinates[1]) {
                    playerTerritory.splice(playerTerritory.indexOf(point),1);
                }
           // }
    }

}

function assessTerritory(){
    const value=grid[startingPosition[0]][startingPosition[1]];

        for (const k of playerTerritory){
        if(         (testNorth(k, grid[k[0]][k[1]]) || k[1]-1<0)   
                &&  (testEast(k, grid[k[0]][k[1]])  || k[0]+1>=width) 
                &&  (testSouth(k,grid[k[0]][k[1]])  || k[1]+1>=height) 
                &&  (testEast(k, grid[k[0]][k[1]])  || k[0]-1>0)  
                ){
                    playerTerritory.splice(playerTerritory.indexOf(k));
                }   
    }
}

function inPlayerTerritory(coordinates)
{
    // functionCount++;
    // if (functionCount>devLimit)
    //     return;
    for (const point of base) {
        if (point[0] === coordinates[0] && point[1] === coordinates[1]) {
            return true;
        }
    }
    return false;
}
//function devTerritory(){}
function id(point){
    return `tile${point[0]}-${point[1]}`
}
function point(tileID){
    return [Number(tileID.substring(4, tileID.indexOf('-'))),Number(tileID.substring(tileID.indexOf('-')+1))];
}
function testNorth(coordinates, value=grid[startingPosition[0]][startingPosition[1]]){

    const x= coordinates[0]; //Number(tileID.substring(4, tileID.indexOf('-')));
    let y=coordinates[1]; // Number(tileID.substring(tileID.indexOf('-')+1)); 
    value=Number(value); //force cast to number
    if(!value)
        return false;
    ////console.log (`TileBeingTested: \t${x}\t${y}: with ints because ${x+y}` );
    if(y-1<0)
        return false;//out of bounds.

    //adjust offset
    y-=1;


    if(value === playerTerritory){
        for (const corinate of value) {
            if(corinate[0]===x &&corinate[1]===y)
                return true;
        }
    }else{
        //test for the physical value
        if(grid[x][y]===value)   
            return true;

    }
    return false;
}
function testEast(coordinates, value=grid[startingPosition[0]][startingPosition[1]]){
    let x= coordinates[0]; //Number(tileID.substring(4, tileID.indexOf('-')));
    const y=coordinates[1]; // Number(tileID.substring(tileID.indexOf('-')+1)); 
    value=Number(value);
    ////console.log (`TileBeingTested: \t${x}\t${y}: with ints because ${x+y}` );
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
function testSouth(coordinates, value=grid[startingPosition[0]][startingPosition[1]]){
    const x= coordinates[0]; //Number(tileID.substring(4, tileID.indexOf('-')));
    let y=coordinates[1]; // Number(tileID.substring(tileID.indexOf('-')+1)); 
    value=Number(value);
    //console.log (`s TileBeingTested: \t${x}:${y} for value: ${value} - `);
    if(y+1>height)
        return false;//out of bounds.
    y+=1;
    //console.log (`               is ${grid[x][y]} equal to ${value}         ${grid[x][y]===value} `);
    if(grid[x][y]===value)   
            return true;
    return false;
}
function testWest(coordinates, value=grid[startingPosition[0]][startingPosition[1]]){
    let x= coordinates[0]; //Number(tileID.substring(4, tileID.indexOf('-')));
    const y=coordinates[1]; // Number(tileID.substring(tileID.indexOf('-')+1));   
    value=Number(value);
    ////console.log (`TileBeingTested: \t${x}\t${y}: with ints because ${x+y}` );
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
function north(coordinates){
    const x=coordinates[0];
    let y=coordinates[1] -1;
    return [x,y];
}
function east(coordinates){
    let x=coordinates[0] +1;
    const y=coordinates[1];
return [x,y];
}
function south(coordinates){
    const x=coordinates[0];
    let y=coordinates[1] +1;
return [x,y];
}
function west(coordinates){
    let x=coordinates[0]-1;
    const y=coordinates[1];
    return [x,y];
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

function createGame(seed =1)
{
    steps=[];
    stepCount=-1;
    playerTerritory=[];
    base =[];
    base.push(startingPosition);
    playerTerritory.push(startingPosition);

    for (let y=0;y<height;y++){
        let values={};
        for(let x= 0;x<width;x++){
                values[x]= Math.floor(Math.random(seed)*1000%depth);
      //      consolePreview+=`${values[x]}\t`;
        }
        grid[y]=values;
        
    }
    seed++;
    
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
    if( !inPlayerTerritory(point(event.target.id)) )       
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

                clickSound();
                ///TODO PLAY SQUISH SOUND
                event.target.classList.remove("highlight");
                event.target.classList.remove("grow");
                const play = event.target.getAttribute("value");
                playValue(play); 
                const highlightedTiles=document.getElementsByClassName("highlight");
                for (const t of highlightedTiles) {
                    t.classList.remove("highlight");
                }
            });
            tile.addEventListener("mouseleave", (event)=>{
                event.target.classList.remove("grow"); 
                const highlightColor = event.target.getAttribute("value");
                const highlightedTiles=document.getElementsByClassName("highlight");
                for (const t of highlightedTiles) {
                    t.classList.remove("highlight");
                }
            });
            row.appendChild(tile);
        }
        game.appendChild(row);
    }
}