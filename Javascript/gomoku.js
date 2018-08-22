/*
 * Create by Yu Li
*/
var boardNormal = window.document.getElementById('boardNormal');
var contextNormal = boardNormal.getContext('2d');
var startPlayer = true; //Represent the start player.
var stone = true;		//Represent who is placing the stone.
var boardRecord = [];	//board
var stoneCountForWin = 0;	
var gameover = false;	//Is the game over?
var player1Name = "player1";	//player1 name
var player2Name = "player2";	//	player2 name
var player1Score = 0;	//The score of player1
var player2Score = 0;	//The score of pl
var size = 19;			//default board size
var replayStep = 0;		//The number of stones placed in a game
var recordForRetract = []; 	//Record the order of each step.

document.getElementById("sctxt").innerHTML = "SCORE";
document.getElementById("sctxt").setAttribute('style',"font-size : 28px");
document.getElementById("p1Score").innerHTML = player1Score;
document.getElementById("p1Score").setAttribute('style', "font-size : 23px");
document.getElementById("p2Score").innerHTML = player2Score;
document.getElementById("p2Score").setAttribute('style', "font-size : 23px");
document.getElementById("player1").style.border = "solid 3px #9696cc";
document.getElementById("player2").style.border = "solid 0px #9696cc";

//Initialize the board
for(var i = 0; i < 19; i++)
{
    boardRecord[i] = [];
    for(var j = 0; j < 19 ; j++)
        boardRecord[i][j] = -1;
}


//Create a board
// Default board with default size which is 19 * 19
for(var i=0; i<size; i++)
{
    contextNormal.beginPath()
    contextNormal.strokeStyle = "#e5e5e5";
    contextNormal.moveTo(15 + i*30, 15);
    contextNormal.lineTo(15 + i*30, 555);
    contextNormal.stroke();
    contextNormal.moveTo(15, 15 + i*30);
    contextNormal.lineTo(555, 15+ i*30);
    contextNormal.stroke();
    contextNormal.closePath();
}

// Draw a new board without any stone on it. The board size depend on the size varialbe.
drawBoard = function()
{
	var addition1 = 75;
	var addition2 = 495;
	if(size == 19)
	{
	 	addition1 = 15;
		addition2 = 555;
	}
	contextNormal.clearRect(0, 0, 570, 570);
	for(var i=0; i<size; i++)
     {
        contextNormal.beginPath();
        contextNormal.strokeStyle = "#e5e5e5";
        contextNormal.moveTo(addition1 + i*30, addition1);
        contextNormal.lineTo(addition1 + i*30, addition2);
        contextNormal.stroke(); 
        contextNormal.moveTo(addition1, addition1 + i*30);
        contextNormal.lineTo(addition2, addition1+ i*30);
        contextNormal.stroke();
        contextNormal.closePath();       
     }     
}

//Function to place a stone at a specific positon.
var placingStone = function(x, y, stone, size)
{
    contextNormal.beginPath();
    contextNormal.arc(15 + 30*x, 15 + 30*y, 13.5, 0, 2*Math.PI);
    contextNormal.closePath();
    if(stone)
        contextNormal.fillStyle = '#383a3d';
    else
        contextNormal.fillStyle = '#edf0f2';
    contextNormal.fill();
	if(!gameover)
		retractEnable();          
}

/*
	Bind the click listener that placing a stone when click. It can place the stone on 
	the position that clicked. If there is already a stone there or game is over, it doesn't work.
*/
boardNormal.onclick = function(Event)
{
    if(gameover == true)
    {
        //window.alert('This game is over, please start a new game');
        return;
    }
	
    var x = Math.floor(Event.offsetX / 30);
    var y = Math.floor(Event.offsetY / 30);
	if(size == 15)
		if(x<2 || x>16 || y<2 ||y>16)
			return;
    if(boardRecord[x][y] == -1)
	{
		placingStone(x, y, stone, size);
        if(stone)
			boardRecord[x][y] = 0;
        else
            boardRecord[x][y] = 1;
        var step = new Object();
        step.xValue = x;
        step.yValue = y;
        step.player = stone;
        recordForRetract.push(step);
		var originStone = stone;
        
        stone = !stone;
		if(stone)
		{
			document.getElementById("player1").style.borderWidth = "3px";
			document.getElementById("player2").style.borderWidth = "0px";
		}
		else
		{
			document.getElementById("player2").style.borderWidth = "3px";
			document.getElementById("player1").style.borderWidth = "0px";
		}
		setTimeout(winnerMention(originStone,1000));
		if(size * size == recordForRetract.length)
		{
			window.alert("No one win the game!");
			document.getElementById("replay").disabled = false;
		}
	}
}

/*
	This function will call the isWin() to find out the winner and metion it.
*/
var winnerMention = function(stone)
{
    if(isWin(stone))
        {   
            if(stone)
                window.alert(player1Name + " win the game!!!");
            else
                window.alert(player2Name + " win the game!!!");
            gameover = true;
			retractDisable();
			startPlayer = !startPlayer;
			document.getElementById("replay").disabled = false;
			document.getElementById("player1").style.borderWidth = "0px";
			document.getElementById("player2").style.borderWidth = "0px";
			document.getElementById("p1Score").innerHTML = player1Score;
			document.getElementById("p2Score").innerHTML = player2Score;
        }
}

/*
	This function is to find out the winner. It will check each row, column and 
	the diagnonal line for five same pieces in succession.
*/
 var isWin = function()
 {
    for(var i = 0; i < 19; i++)
    {
        for(var j = 0; j < 19; j++)
            {
                if(boardRecord[i][j] != -1)
                {
                    stoneCountForWin = 1;
                    var win = boardRecord[i][j];
                    for(var k=1; k<5; k++)
                    {
                        if(i+4 >= 19)
                            break;
                        if(boardRecord[i+k][j] == win)
                            stoneCountForWin++;
                        else
                        {
                            stoneCountForWin = 1;
                            break;
                        }
                        if(stoneCountForWin == 5)
                        {
                            if(win == 0)
                                player1Score++;
                            else
                                player2Score++;
                            return true;
                        }
                    }
                    
                    for(var l=1; l<5; l++)
                    {
                        if(l+4 >= size)
                            break;
                        if(boardRecord[i][j+l] == win)
                            stoneCountForWin++;
                        else
                        {
                            stoneCountForWin = 1;
                            break;
                        }
                        if(stoneCountForWin == 5)
                        {
                            if(win == 0)
                                player1Score++;
                            else
                                player2Score++;
                            return true;
                        }
                    }
                    for(var m=1; m<5; m++)
                    {
                        if(i+4 >= 19 || j+4 >=19)
                            break;
                        if(boardRecord[i+m][j+m] == win)
                              stoneCountForWin++;
                        else
                        {
                            stoneCountForWin = 1;
                            break;
                        }
                        if(stoneCountForWin == 5)
                        {
                            if(win == 0)
                                player1Score++;
                            else
                                player2Score++;
                            return true;
                        }
                    }
                    for(var n=1; n<5; n++)
                    {
                        if(i-4 <0 || j+4 >19)
                            break;
                         if(boardRecord[i-n][j+n] == win)
                              stoneCountForWin++;
                        else
                        {
                            stoneCountForWin = 1;
                            break;
                        }
                        if(stoneCountForWin == 5)
                        {
                            if(win == 0)
                                player1Score++;
                            else
                                player2Score++;
                            return true;
                        }
                    }
                }
            }
    }
     return false;
    
 }

 /*
 	This function can retract a move. If there is not stone on the board, it will
	disable the retract button.
 */
retract = function()
 {
     if(recordForRetract.length < 1)
    {
        window.alert('Failed! Do not have the record.');
        return ;
    }
    if(gameover == true)
    {
        window.alert("Failed! The game is over.");
        return;
    }
     var current = recordForRetract[recordForRetract.length-1];
     contextNormal.clearRect(0, 0, 570, 570);
     stone = current.player;
	 if(stone)
	{
		document.getElementById("player1").style.borderWidth = "3px";
		document.getElementById("player2").style.borderWidth = "0px";
	}
	else
	{
		document.getElementById("player2").style.borderWidth = "3px";
		document.getElementById("player1").style.borderWidth = "0px";
	}
     recordForRetract.pop();
     boardRecord[current.xValue][current.yValue] = -1;
	 drawBoard();
     for(var i = 0; i < recordForRetract.length; i++)
     {
         var info = recordForRetract[i];
         placingStone(info.xValue, info.yValue, info.player, size);           
     }
	 if(recordForRetract.length < 1)
		 retractDisable();
     return ;
 }

/*
	This function will restart a new game. It will draw a new board, set the 
	variable to default value. It will also exchange the right that placing the 
	first stone.
*/
restart = function()
{
	drawBoard();
    gameover = false;
    recordForRetract = [];
    stoneCountForWin = 0;
    stone = startPlayer;
	if(stone)
	{
		document.getElementById("player1").style.borderWidth = "3px";
		document.getElementById("player2").style.borderWidth = "0px";
	}
	else
	{
		document.getElementById("player2").style.borderWidth = "3px";
		document.getElementById("player1").style.borderWidth = "0px";
	}
    for(var i=0; i < 19; i++)
    {
        for(var j = 0; j < 19; j++)
        {
            boardRecord[i][j] = -1;            
        }
    }
	retractDisable();
	document.getElementById("replay").disabled = true;
	document.getElementById("previous").disabled = true;
	document.getElementById("next").disabled = true;
	replayStep = 0;
	if(stone)
	{
		document.getElementById("player1").style.borderWidth = "3px";
		document.getElementById("player2").style.borderWidth = "0px";
	}
	else
	{
		document.getElementById("player2").style.borderWidth = "3px";
		document.getElementById("player1").style.borderWidth = "0px";
	}
}

//This function will clear the score board to 0:0
clearScore = function()
{
	player1Score = 0;
	player2Score = 0;
	document.getElementById("p1Score").innerHTML = player1Score;
	document.getElementById("p2Score").innerHTML = player2Score;	
}

//This function will siwtch the board and disable or enable correspond button.
switchBoard = function()
{
	if(size == 19)
	{
		document.getElementById("regular").disabled = false;
		document.getElementById("small").disabled = true;
		size = 15;
		restart();
		retractDisable();
	}
	else
	{
		document.getElementById("small").disabled = false;
		document.getElementById("regular").disabled = true;
		size = 19;
		restart();
		retractDisable();
	}
}

//This function can disable the retract button.
retractDisable = function()
{
	document.getElementById("retract").disabled = true;
}
//This function can enable the retract button.
retractEnable = function()
{
	document.getElementById("retract").disabled = false;
}


/*
	This function is for replay. It can replay the last game step by step.
	It will enable the next button to begin the replay.
*/
replay = function()
{
	replayStep = 0;
	drawBoard();
	document.getElementById("next").disabled = false;
	document.getElementById("previous").disabled = true;
}

/* 
	This function is for replay section. Go to the next step. If there is no 
	next step, the next button will be disabled.
*/
nextStep = function()
{
	var x = recordForRetract[replayStep].xValue;
	var y = recordForRetract[replayStep].yValue;
	var player = recordForRetract[replayStep].player;
	placingStone(x, y, player, size);
	replayStep++;
	document.getElementById("previous").disabled = false;
	if(replayStep == recordForRetract.length)
	{
		document.getElementById("next").disabled = true;
		replayStep = recordForRetract.length-1;
	}
}


/* 
	This function is for replay section. Go to the previous step. If there is no 
	previous step, the previous button will be disabled.
*/
previousStep = function()
{
	drawBoard();
	for(var i = 0 ; i < replayStep; i++)
	{
		var x = recordForRetract[i].xValue;
		var y = recordForRetract[i].yValue;
		var player = recordForRetract[i].player;
		placingStone(x, y, player, size);
	}
	replayStep--;
	document.getElementById("next").disabled = false;
	if(replayStep < 0)
	{
		document.getElementById("previous").disabled = true;
		replayStep = 0;
	}	
}

/*
	This function is to start in menu.
*/
startGame = function()
{
	var i = 0;
	if(document.getElementsByName("board")[i].checked == false)
		i = 1;		
	var boardStart = document.getElementsByName("board")[i];
	var bs = boardStart.value;
	size = bs;
	var p1 = document.getElementById("player1Input");
	var name1 = p1.value;
	var p2 = document.getElementById("player2Input");
	var name2 = p2.value;
	player1Name = name1;
	player2Name = name2;
	var j = 0;
	
	if(document.getElementsByName("startFirst")[j].checked == false)
	   	j = 1;
	var one = document.getElementsByName("startFirst")[j];
	var firstPlayer = one.value;
	if(firstPlayer == "player1")
		startPlayer = true;
	else 
		startPlayer = false;
	document.getElementById("menu").style.display = "none";
	document.getElementById("container").style.display = "block";
	stone = startPlayer;
	drawBoard();
	if(stone)
	{
		document.getElementById("player1").style.borderWidth = "3px";
		document.getElementById("player2").style.borderWidth = "0px";
	}
	else
	{
		document.getElementById("player2").style.borderWidth = "3px";
		document.getElementById("player1").style.borderWidth = "0px";
	}
	document.getElementById("nameBoard").innerHTML = player1Name + " " + " VS " + " " + player2Name;
//window.alert(stone + " " + " ");
}
