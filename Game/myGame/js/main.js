
var game = new Phaser.Game(800, 600, Phaser.AUTO); //make game
var flipFlop = true; //global variable that's just used as a toggle
var lighter;
var player;
var walking;
var hand;
var nameLabel;
var instructions;
var light;
var lightLevel;
var hole;
var timeMultiplier;
var keysPressed = [false, false, false, false, false, false, false, false, false, false, 
					false, false, false, false, false, false, false, false, false, false, 
					false, false, false, false, false];

var currentPrompt = [false, false, false, false, false, false, false, false, false, false, 
					false, false, false, false, false, false, false, false, false, false, 
					false, false, false, false, false];
//var passed = false;

//var openLighter;
//var strike;
var theme;
var hands;
var hand;

var forest1 = false;
var forest2 = false;
var shack = false;
var house = false;


var Menu = function(game) {};
Menu.prototype = {
    preload: function() {
        console.log("Menu: preload");
        game.load.atlas('lighter', 'assets/img/lighter.png', 'assets/img/lighter.json');
        game.load.audio('theme', ['assets/audio/417993__magmusas__creepy-bell-music-1.mp3', 'assets/audio/417993__magmusas__creepy-bell-music-1.ogg'] );
        //https://freesound.org/people/ABStudios/sounds/177157/ changed by cutting out sections as needed
		game.load.audio('openLighter', ['assets/audio/lighterOpen.mp3', 'assets/audio/lighterOpen.ogg'] );
		game.load.audio('strike', ['assets/audio/lighterStrike.mp3', 'assets/audio/lighterStrike.ogg'] );
	},

    create: function() {
        console.log("Menu: create");
        //makes game window in the center
        game.scale.pageAlignHorizontally = true;
        //start a timer
        qTimer = game.time.create(false);
        timedEvent = qTimer.add(Phaser.Timer.SECOND * 3, this.timerEnd, this);
        qTimer.start();

        //game.add.text(100, 100, 'Menu',{font: '50px Courier', fill: '#ffffff'});
        lighter = game.add.sprite(300, 150, 'lighter');
        lighter.animations.add('idle', ['lighter0.png'], 1, true);
        lighter.animations.add('fire', ['lighter1.png', 'lighter2.png','lighter3.png', 'lighter4.png','lighter3.png', 'lighter4.png','lighter3.png', 'lighter4.png','lighter3.png', 'lighter4.png','lighter3.png', 'lighter4.png','lighter3.png', 'lighter4.png','lighter3.png', 'lighter4.png','lighter3.png', 'lighter4.png','lighter3.png', 'lighter4.png','lighter3.png', 'lighter4.png','lighter3.png', 'lighter4.png','lighter3.png', 'lighter4.png','lighter3.png', 'lighter4.png'], 5, true);
        //game.add.text(300, 425, 'Hold q',{font: '50px Courier', fill: '#ffffff'});
        //game.add.text(250, 200, 'Q',{font: '50px Courier', fill: '#ffffff'});

        openLighter = game.add.audio('openLighter');
        strike = game.add.audio('strike');
        if(!forest1)
        {
        	theme = game.add.audio('theme');
        }
        


    },



    update: function() {

    	//if q was just raised, destroy the timer
    	if(!game.input.keyboard.isDown(Phaser.Keyboard.Q) && flipFlop == true)
    	{
    		qTimer.destroy();
    		console.log('stop q timer');
    		flipFlop = false;
    	}
    	//if q was just pressed, start a timer for 5 seconds
    	else if(game.input.keyboard.isDown(Phaser.Keyboard.Q) && flipFlop == false)
    	{
    		qTimer = game.time.create(false);
       		timedEvent = qTimer.add(Phaser.Timer.SECOND * 3, this.timerEnd, this);
       		qTimer.start();
       		console.log('start q timer');
       		flipFlop = true;
       		openLighter.play();
       		openLighter.onStop.add(function strikeSound() {if(game.input.keyboard.isDown(Phaser.Keyboard.Q)){strike.play()}}, this);
       		
    	}
        //if q is pressed, initiate the fire
        if(game.input.keyboard.isDown(Phaser.Keyboard.Q) == true){
            lighter.animations.play('fire');
            //game.add.text(150, 500, 'Never let go of q',{font: '50px Courier', fill: '#ffffff'});
            
        }
        else{
        	lighter.animations.play('idle');
        }

    },

    //when the timer expires, go to Gameplay
    timerEnd:  function()
    {
    	console.log('q timer finished');
    	if(!shack)
    	{
    		console.log('go to instr')
    		game.state.start('Instructions');
    	}
    	else if(!forest1)
    	{
    		console.log('go to forest1')
    		game.state.start('Outside');
    	}
    	else if(!house)
    	{
    		console.log('go to house')
    		game.state.start('House');
    	}
    	else if(!forest2)
    	{
    		console.log('go to forest2')
    		game.state.start('Outside')
    	}
    	else
    	{
    		console.log('go to lake');
    		game.state.start('Outside');
    	}
    }


}

var Instructions = function(game) {};
Instructions.prototype = {
    preload: function() {
        console.log("Instructions: preload");
        game.load.atlas('player1', 'assets/img/walk.png', 'assets/img/walk.json');
        game.load.image('shack1', 'assets/img/shack.png');
        game.load.image('shack2', 'assets/img/shack-open.png');
        //game.load.image('standing', 'assets/img/standingPlayer.png');
    },

    create: function() {
        shack = game.add.sprite(0, 0, 'shack1');
        
        player1 = game.add.sprite(300, 130, 'player1');
        player1.scale.setTo(1.2, 1.2);
        player1.animations.add('walk1', ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png'], 6, true);
        game.physics.enable([player1], Phaser.Physics.ARCADE);

        hitBox = game.add.sprite(700, 130, 'player1');
        game.physics.enable([hitBox], Phaser.Physics.ARCADE);
        hitBox.alpha = 0;

        qTimer = game.time.create(false);
       	leewayTimer = qTimer.add(Phaser.Timer.SECOND * .25, this.leewayEnd, this);
       	qTimer.start();
       	flipFlop = false;

       	console.log('Leeway timer start');

       	shack.inputEnabled = true;
       	shack.events.onInputDown.add(this.openDoor, this);

       	helpTimer = game.time.create(false);
       	helpTimer.add(Phaser.Timer.SECOND * 15,function help(){instructions = game.add.text(400, 200, 'Click Door',{font: '25px Courier', fill: '#ffffff'});}, this);
       	helpTimer.start();


        //player1.body.collideWorldBounds=true;
    },

    update: function() {
    	//game.input.keyboard.update();
        if((!game.input.keyboard.isDown(Phaser.Keyboard.Q) && flipFlop))
        {
            theme.stop();
            game.state.start('GameOver');
        }
        

        game.physics.arcade.overlap(player1, hitBox, function play(){game.state.start('Outside'); shack = true;}, null, this);

    //     if(game.input.keyboard.isDown(Phaser.Keyboard.W)){
    //         player1.animations.play('walk1');
    //         player1.x += 3;
    //         //game.debug.body(player1);

    //     }
        

    //     if(!game.input.keyboard.isDown(Phaser.Keyboard.W)){
    //         player1.animations.stop('walk1');
    //     }
    },

    leewayEnd:  function()
    {
    	console.log('Leeway timer end');
    	flipFlop = true;
    },

    openDoor: function()
    {
    	shack.loadTexture('shack2', 0);
    	helpTimer.destroy();
    	player1.body.velocity.x = 100;
    	player1.animations.play('walk1');


    },
}

var Outside = function() {};
Outside.prototype = {
     preload: function() {
        console.log("GamePlay: preload");
        game.load.atlas('player', 'assets/img/walk.png', 'assets/img/walk.json');
        game.load.atlas('hand1', 'assets/img/creepyHands1.png', 'assets/img/creepyHands1.json' );
        game.load.atlas('hand2', 'assets/img/creepyHands2.png', 'assets/img/creepyHands2.json' );
        game.load.atlas('keys', 'assets/img/keys.png', 'assets/img/keys.json' );
        game.load.atlas('hole', 'assets/img/hole.png', 'assets/img/hole.json'); //light hole around player
        game.load.image('background', 'assets/img/background.png'); //blue background
        game.load.image('background0', 'assets/img/background0.png');//ground
        game.load.image('background1', 'assets/img/background1.png');//closest tree
        game.load.image('background2', 'assets/img/background2.png');
        game.load.image('background3', 'assets/img/background3.png');
        game.load.image('background4', 'assets/img/background4.png');//farthest tree
        game.load.image('forestA', 'assets/img/forestA.png');//closest tree
        game.load.image('forestB', 'assets/img/forestB.png');
        game.load.image('forestC', 'assets/img/forestC.png');
        game.load.image('forestD', 'assets/img/forestD.png');//farthest tree
        game.load.image('lake','assets/img/lake.png' );
        game.load.image('waterGround','assets/img/waterGround.png' );
        game.load.image('lakePlayer','assets/img/lakePlayer.png' );

        game.load.image('gate1', 'assets/img/gate1.png');
        game.load.image('gate2', 'assets/img/gate2.png');
        
    },

    create: function() {
        console.log("GamePlay: create");

        	//start another timer for .5 seconds and set the toggle to false to give the player some starting leeway
        	qTimer = game.time.create(false);
       		leewayTimer = qTimer.add(Phaser.Timer.SECOND * .25, this.leewayEnd, this);
       		qTimer.start();
       		console.log('Leeway timer start');
       		flipFlop = false;
       		//yet another timer. This one loops to keep prompting for keyboard presses
       		promptTimer = game.time.create(false);
       		promptTimer.add(Phaser.Timer.SECOND * 5, this.newPrompt, this);
       		promptTimer.start();

       		timeMult = game.time.create(false);
       		timeMult.loop(Phaser.Timer.SECOND * 5, function timeAdvance(){ if(timeMultiplier < 1.9) {timeMultiplier += .05;}}, this);
       		timeMult.start();

       		lightTimer = game.time.create(false);
       		lightTimer.loop(Phaser.Timer.SECOND, this.lowerLight, this);
       		lightTimer.start();

       		
       		if(!forest1)
       		{
	       		stateTimer = game.time.create(false);
	       		stateTimer.add(Phaser.Timer.SECOND * 30, this.spawnGate, this);
	       		stateTimer.start();
       		}
       		else
       		{
       			stateTimer = game.time.create(false);
	       		stateTimer.add(Phaser.Timer.SECOND * 30, this.goToNextState, this);
	       		stateTimer.start();
	       		if(!forest2)
	       		{
	       			handSpawn = game.time.create(false);
       				handSpawn.loop(Phaser.Timer.SECOND * 5, this.handSpawn, this);
       				handSpawn.start();
	       		}
       			else
       			{
       				handSpawn = game.time.create(false);
       				handSpawn.loop(Phaser.Timer.SECOND * 3.5, this.handSpawn, this);
       				handSpawn.start();
       			}
       		}
       		


       		console.log('promptTimer start');
            //Gameplay text

           
            //background
            background = game.add.sprite(0, 0, 'background');
            
            if(!forest1)
            {
            	background4 = game.add.tileSprite(0, -50, 800, 600, 'background4');
            	background3 = game.add.tileSprite(0, -50, 800, 600, 'background3');
            	background2 = game.add.tileSprite(0, -50, 800, 600, 'background2');
            	background1 = game.add.tileSprite(0, -50, 800, 600, 'background1');
            	background0 = game.add.sprite(0, 0, 'background0');
            }
            else if(!forest2)
            {
            	background4 = game.add.tileSprite(0, -50, 8855, 675, 'forestD');
            	background3 = game.add.tileSprite(0, -50, 8855, 675, 'forestC');
            	background2 = game.add.tileSprite(0, -50, 8855, 675, 'forestB');
            	background1 = game.add.tileSprite(0, -50, 8855, 675, 'forestA');
            	background0 = game.add.sprite(0, 0, 'background0');
            }
            else
            {
            	lake = game.add.tileSprite(0, -50, 800, 600, 'lake');
            	background0 = game.add.sprite(0, 0, 'waterGround');
            }
            
            //8855, 675

            keys = [game.add.sprite(350,280, 'keys'), game.add.sprite(400,280, 'keys'), game.add.sprite(450,280, 'keys')];
            for(var i = 0; i < keys.length; i ++)
            {
            	keys[i].animations.add('display', ['A.png', 'B.png', 'C.png', 'D.png', 'E.png', 'F.png', 'G.png', 'H.png', 'I.png', 'J.png', 'K.png', 'L.png', 'M.png', 'N.png', 'O.png', 'P.png', 'R.png', 'S.png', 'T.png', 'U.png', 'V.png', 'W.png', 'X.png', 'Y.png', 'Z.png'], 5, true);
            	keys[i].frame = 0;
            	keys[i].visible = false;
            }


            
            //player.anchor.setTo(.5, .5);
            if(!forest2)
            {
            	player = game.add.sprite(350, 320, 'player');
            	player.animations.add('walk', ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png'], 6, true);
            }
            else
            {
            	player = game.add.sprite(350, 320, 'lakePlayer');
            }
            game.physics.arcade.enable(player);
            

            hands = game.add.group();
            //game.physics.arcade.enable(hands);
            hands.enableBody = true;

            

            hole = game.add.sprite(0, 0, 'hole');
            hole.animations.add('lightness', ['hole1.png', 'hole2.png', 'hole3.png', 'hole4.png', 'hole5.png', 'hole6.png', 'hole7.png', 'hole8.png', 'hole9.png', 'hole10.png', 'hole11.png', 'hole12.png', 'hole13.png', 'hole14.png', 'hole15.png', 'hole16.png'], 6, true);
            ui = game.add.group();
            ui.add(hole);
            ui.add(keys[0]);
            ui.add(keys[1]);
            ui.add(keys[2]);

            if(!forest1)
            {
            	instructions = game.add.text(400, 200, 'Press keys when prompted',{font: '25px Courier', fill: '#ffffff'});
            }
            else
            {
            	instructions = game.add.text(400, 200, '',{font: '25px Courier', fill: '#ffffff'});
            }
            
            light = 50;
            timeMultiplier = 1;
            passed = false;
            

            if(!forest1)
            {
            	theme.loopFull();
            }
            
            player.animations.play('walk');

            playerLayering = game.add.group();
            playerLayering.add(player);

            scrollBackground = true;

            hitBox = game.add.sprite(700, 200, 'player');
       		game.physics.enable([hitBox], Phaser.Physics.ARCADE);
       		hitBox.alpha = 0;

    },

    update: function() {

    	//timer is used as a bit of leeway, as phaser seems not to process input for a short period of time
    	//inbetween states.

    	//when q is not held and the leeway is used up, go to gameover

    	if((!game.input.keyboard.isDown(Phaser.Keyboard.Q) && flipFlop) || light <= 0)
    	{
    		
        	game.state.start('GameOver');
    	}

    	//console.log(game.input.keyboard.isDown(Phaser.Keyboard.A));
    	if(!passed)
    	{
    		checkKeyInput();
    	}

    	game.physics.arcade.overlap(player, hands, this.handCatch, null, this);
    	game.physics.arcade.overlap(player, hitBox, this.leaveForest, null, this);

    	if(player.body.velocity.x == 0)
    	{
    		this.updateLight();
    	}
    	
    	
    	
        //move character
        
        //hand.animations.play('creep');
        if(scrollBackground)
        {
        	if(!forest2)
        	{
        		background1.tilePosition.x -= 1.25;
		        background2.tilePosition.x -= 1;
		        background3.tilePosition.x -= 0.75;
		        background4.tilePosition.x -= 0.5;
        	}
        	else
        	{
        		lake.tilePosition.x -= 1.25
        	}
        	
        }
        
        hole.sendToBack();



       // game.debug.body(player);
       // game.debug.body(hands);
    },

    leaveForest: function()
    {
    	if(!forest1)
    	{
    		forest1 = true;
    		game.state.start('Menu');
    	}
    	
    	
    },

    goToNextState: function()
    {
    	if(!forest2)
    	{
    		forest2 = true;
    		game.state.start('Menu');
    	}
    	else
    	{
    		game.state.start('Win');
    	}
    	
    },

    leewayEnd:  function()
    {
    	console.log('Leeway timer end');
    	flipFlop = true;
    },

    lowerLight: function()
    {
    	light -= 1;
    	
    },

    handSpawn: function()
    {
    	if(game.rnd.integerInRange(0,1) == 0)
    	{
    		hand = hands.create(game.rnd.integerInRange(-800,1600), -200, 'hand1');
        	hand.animations.add('creep', ['creepyHands1.0.png', 'creepyHands1.1.png', 'creepyHands1.2.png'], 4, true);
    	}
    	else
    	{
    		hand = hands.create(game.rnd.integerInRange(-800,1600), -200, 'hand2');
        	hand.animations.add('creep', ['creepyHands2.0.png', 'creepyHands2.1.png', 'creepyHands2.2.png'], 4, true);
    	}
    	
        hand.animations.play('creep');
        game.physics.arcade.enable(hand);
        hand.body.setSize(100,100, 0, 200);
        hand.anchor.setTo(.5, .5);
        hand.rotation = game.physics.arcade.angleToXY(hand, 350 + player.width * .75, 320 + player.height * .75) + Math.PI/2;
        game.physics.arcade.moveToXY(hand, 350 + player.width * .75, 320 + player.height * .75, 5, 5000);
        
        hand.inputEnabled = true;
        hand.events.onInputDown.add(this.handClick, this);
    },

    handClick: function()
    {
    	hand.body.velocity.x = -hand.body.velocity.x;
    	hand.body.velocity.y = -hand.body.velocity.y;
    	hand.inputEnabled = false;
    },

    handCatch: function()
    {
    	console.log('catch');
    	hand.destroy();
    	light -= 15;
    	
    },

    spawnGate: function()
    {
    	//gate = game.add.sprite(500, 150, 'gate1');  //end location
    	gate = game.add.sprite(900, 150, 'gate1');
    	playerLayering.add(gate);
    	//gate.inputEnabled = true;
    	game.physics.arcade.enable(gate);
    	gate.body.velocity.x = -75;

    	gateEnterTimer = game.time.create(false);
       	gateEnterTimer.add(Phaser.Timer.SECOND * 5, this.gateInPlace, this);
       	gateEnterTimer.start();

    	gate.events.onInputDown.add(this.openGate, this);
    },

    gateInPlace: function()
    {
    	gate.body.velocity.x = 0;
    	gate.inputEnabled = true;
    	player.animations.stop();
    	scrollBackground = false;

    	helpTimer = game.time.create(false);
       	helpTimer.add(Phaser.Timer.SECOND * 15, function help(){instructions = game.add.text(400, 200, 'Click Door',{font: '25px Courier', fill: '#ffffff'});}, this);
       	helpTimer.start();


    },

    openGate: function()
    {
    	gate.inputEnabled = false;
    	player.animations.play('walk');
    	player.body.velocity.x = 75;
    	if(hole.frame < 6)
    	{
    		hole.frame = 6;
    	}
    	
    	gate.loadTexture('gate2', 0);
    	gate.sendToBack();

    	
    },

    updateLight: function()
    {
    	
    	if(light > 45)
    	{
    		hole.frame = 3
    	}
    	else if(light > 40)
    	{
    		hole.frame = 4;
    	}
    	else if(light > 35)
    	{
    		hole.frame = 5;
    	}
    	else if (light > 30)
    	{
    		hole.frame = 6;
    	}
    	else if(light > 25)
    	{
    		hole.frame = 7;
    	}
    	else if(light > 20)
    	{
    		hole.frame = 8;
    	}
    	else if(light > 15)
    	{
    		hole.frame = 9;
    	}
    	else if(light > 10)
    	{
    		hole.frame = 10;
    	}
    	else
    	{
    		hole.frame = 11;
    	}
    },


    newPrompt: function()
    {
    	instructions.text = '';
    	if(!passed)
    	{
    		console.log('failed');
    		light -= 10;
    		
    	}
    	console.log('new prompt');
    	passed = false;
    	var letter;
    	var num = game.rnd.integerInRange(1, 2 * timeMultiplier);
    	if(num > 3)
    	{
    		num = 3;
    	}
    	var message = '';
    	for(var i = 0; i < keysPressed.length; i++)
    	{
    		currentPrompt[i] = false;
    	}
    	for(var j = 0; j < num; j++)
    	{
    		letter = game.rnd.integerInRange(0,24);
    		for(var i = 0; i < currentPrompt.length; i++)
    		{
	    		if(letter == i && !currentPrompt[i])
	    		{
	    			currentPrompt[i] = true;
	    			if(letter < 16)
	    			{
	    				message += String.fromCharCode(i + 97);
	    			}
	    			else if(letter >= 16)
	    			{
	    				message += String.fromCharCode(i + 98);
	    			}
	    			keys[j].frame = i;
	    			keys[j].visible = true
	    		}
	    		
    		}

    	}
    	if(num < 3)
    	{
    		keys[2].visible = false;
    	}
    	if(num < 2)
    	{
    		keys[1].visible = false;
    	}
    	

    	

    	promptTimer = game.time.create(false);
       	promptTimer.add(Phaser.Timer.SECOND * 5 / timeMultiplier, this.newPrompt, this);
       	promptTimer.start();

    	console.log(message);
    	
    	
    }
}

var House = function() {};
House.prototype = {
     preload: function() {
        console.log("House: preload");
        game.load.atlas('player', 'assets/img/walk.png', 'assets/img/walk.json');
        game.load.atlas('hand1', 'assets/img/creepyHands1.png', 'assets/img/creepyHands1.json' );
        game.load.atlas('hand2', 'assets/img/creepyHands2.png', 'assets/img/creepyHands2.json' );
        game.load.atlas('keys', 'assets/img/keys.png', 'assets/img/keys.json' );
        game.load.atlas('hole', 'assets/img/hole.png', 'assets/img/hole.json'); //light hole around player
        game.load.image('house', 'assets/img/house.png');
        game.load.image('openDoor', 'assets/img/openDoor.png');
        game.load.image('closedDoor', 'assets/img/closedDoor.png');
        
    },

    create: function() {
        console.log("House: create");

        	//start another timer for .5 seconds and set the toggle to false to give the player some starting leeway
        	qTimer = game.time.create(false);
       		leewayTimer = qTimer.add(Phaser.Timer.SECOND * .25, this.leewayEnd, this);
       		qTimer.start();
       		console.log('Leeway timer start');
       		flipFlop = false;
       		//yet another timer. This one loops to keep prompting for keyboard presses
       		promptTimer = game.time.create(false);
       		promptTimer.add(Phaser.Timer.SECOND * 5, this.newPrompt, this);
       		promptTimer.start();

       		timeMult = game.time.create(false);
       		timeMult.loop(Phaser.Timer.SECOND * 5, function timeAdvance(){ if(timeMultiplier < 1.9) {timeMultiplier += .05;}}, this);
       		timeMult.start();

       		lightTimer = game.time.create(false);
       		lightTimer.loop(Phaser.Timer.SECOND, this.lowerLight, this);
       		lightTimer.start();

       		handSpawn = game.time.create(false);
       		handSpawn.loop(Phaser.Timer.SECOND * 5, this.handSpawn, this);
       		handSpawn.start();

       		

       		


       		console.log('promptTimer start');
            //Gameplay text

           
            //background
            //6153, 600
            house = game.add.sprite(0, 0, 'house');
            game.physics.arcade.enable(house);
            house.body.velocity.x = -150;

            door = game.add.sprite(5903, 200, 'closedDoor');
            game.physics.arcade.enable(door);
            door.body.velocity.x = -150;
            
           

            keys = [game.add.sprite(350,280, 'keys'), game.add.sprite(400,280, 'keys'), game.add.sprite(450,280, 'keys')];
            for(var i = 0; i < keys.length; i ++)
            {
            	keys[i].animations.add('display', ['A.png', 'B.png', 'C.png', 'D.png', 'E.png', 'F.png', 'G.png', 'H.png', 'I.png', 'J.png', 'K.png', 'L.png', 'M.png', 'N.png', 'O.png', 'P.png', 'R.png', 'S.png', 'T.png', 'U.png', 'V.png', 'W.png', 'X.png', 'Y.png', 'Z.png'], 5, true);
            	keys[i].frame = 0;
            	keys[i].visible = false;
            }


            player = game.add.sprite(350, 320, 'player');
            game.physics.arcade.enable(player);
            //player.anchor.setTo(.5, .5);
            player.animations.add('walk', ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png'], 6, true);

            hands = game.add.group();
            //game.physics.arcade.enable(hands);
            hands.enableBody = true;
            atStop = false

            

            hole = game.add.sprite(0, 0, 'hole');
            hole.animations.add('lightness', ['hole1.png', 'hole2.png', 'hole3.png', 'hole4.png', 'hole5.png', 'hole6.png', 'hole7.png', 'hole8.png', 'hole9.png', 'hole10.png', 'hole11.png', 'hole12.png', 'hole13.png', 'hole14.png', 'hole15.png', 'hole16.png'], 6, true);
            ui = game.add.group();
            ui.add(hole);
            ui.add(keys[0]);
            ui.add(keys[1]);
            ui.add(keys[2]);

            
            light = 50;
            timeMultiplier = 1;
            passed = false;
            

           
            
            player.animations.play('walk');

            playerLayering = game.add.group();
            playerLayering.add(player);

            instructions = game.add.text(400, 175, 'Click hands to dispel them',{font: '25px Courier', fill: '#ffffff'});

            hitBox = game.add.sprite(700, 320, 'player');
       		game.physics.enable([hitBox], Phaser.Physics.ARCADE);
       		hitBox.alpha = 0;

    },

    update: function() {

    	//timer is used as a bit of leeway, as phaser seems not to process input for a short period of time
    	//inbetween states.

    	//when q is not held and the leeway is used up, go to gameover

    	if((!game.input.keyboard.isDown(Phaser.Keyboard.Q) && flipFlop) || light <= 0)
    	{
    		
        	game.state.start('GameOver');
    	}

    	//console.log(game.input.keyboard.isDown(Phaser.Keyboard.A));
    	if(!passed)
    	{
    		checkKeyInput();
    	}

    	game.physics.arcade.overlap(player, hands, this.handCatch, null, this);
    	game.physics.arcade.overlap(player, hitBox, function play(){game.state.start('Menu'); forest1 = true;}, null, this);
    	if(player.body.velocity.x == 0)
    	{
    		this.updateLight();
    	}
    	
    	
        //move character
        
        //hand.animations.play('creep');
        
        
        hole.sendToBack();

        if(house.x <= (-(house.width) + 800) && !atStop)
        {
        	house.body.velocity.x = 0;
        	door.body.velocity.x = 0;
        	atStop = true;
        	this.atEnd();
        }





       // game.debug.body(player);
       // game.debug.body(hands);
    },

    leewayEnd:  function()
    {
    	console.log('Leeway timer end');
    	flipFlop = true;
    },

    atEnd: function()
    {
    	door.inputEnabled = true;
    	player.animations.stop();
       	door.events.onInputDown.add(this.openDoor, this);

       	helpTimer = game.time.create(false);
       	helpTimer.add(Phaser.Timer.SECOND * 15, function help(){instructions = game.add.text(400, 200, 'Click Door',{font: '25px Courier', fill: '#ffffff'});}, this);
       	helpTimer.start();
    },

    openDoor: function()
    {
    	house.inputEnabled = false;
    	
    	player.animations.play('walk');
    	walking = true;
    	player.body.velocity.x = 75;
    	if(hole.frame < 6)
    	{
    		hole.frame = 6;
    	}
    	
    	door.loadTexture('openDoor', 0);

    	
    },

    lowerLight: function()
    {
    	light -= 1;
    	
    },

    handSpawn: function()
    {
    	if(game.rnd.integerInRange(0,1) == 0)
    	{
    		hand = hands.create(game.rnd.integerInRange(-800,1600), -200, 'hand1');
        	hand.animations.add('creep', ['creepyHands1.0.png', 'creepyHands1.1.png', 'creepyHands1.2.png'], 4, true);
    	}
    	else
    	{
    		hand = hands.create(game.rnd.integerInRange(-800,1600), -200, 'hand2');
        	hand.animations.add('creep', ['creepyHands2.0.png', 'creepyHands2.1.png', 'creepyHands2.2.png'], 4, true);
    	}
    	
        hand.animations.play('creep');
        game.physics.arcade.enable(hand);
        hand.body.setSize(100,100, 0, 200);
        hand.anchor.setTo(.5, .5);
        hand.rotation = game.physics.arcade.angleToXY(hand, 350 + player.width * .75, 320 + player.height * .75) + Math.PI/2;
        game.physics.arcade.moveToXY(hand, 350 + player.width * .75, 320 + player.height * .75, 5, 5000);
        
        hand.inputEnabled = true;
        hand.events.onInputDown.add(this.handClick, this);
    },

    handClick: function()
    {
    	hand.body.velocity.x = -hand.body.velocity.x;
    	hand.body.velocity.y = -hand.body.velocity.y;
    	hand.inputEnabled = false;
    },

    handCatch: function()
    {
    	console.log('catch');
    	hand.destroy();
    	light -= 15;
    	
    },


    updateLight: function()
    {
    	
    	if(light > 45)
    	{
    		hole.frame = 3
    	}
    	else if(light > 40)
    	{
    		hole.frame = 4;
    	}
    	else if(light > 35)
    	{
    		hole.frame = 5;
    	}
    	else if (light > 30)
    	{
    		hole.frame = 6;
    	}
    	else if(light > 25)
    	{
    		hole.frame = 7;
    	}
    	else if(light > 20)
    	{
    		hole.frame = 8;
    	}
    	else if(light > 15)
    	{
    		hole.frame = 9;
    	}
    	else if(light > 10)
    	{
    		hole.frame = 10;
    	}
    	else
    	{
    		hole.frame = 11;
    	}
    },


    newPrompt: function()
    {
    	instructions.text = '';
    	if(!passed)
    	{
    		console.log('failed');
    		light -= 10;
    		
    	}
    	console.log('new prompt');
    	passed = false;
    	var letter;
    	var num = game.rnd.integerInRange(1, 2 * timeMultiplier);
    	if(num > 3)
    	{
    		num = 3;
    	}
    	var message = '';
    	for(var i = 0; i < keysPressed.length; i++)
    	{
    		currentPrompt[i] = false;
    	}
    	for(var j = 0; j < num; j++)
    	{
    		letter = game.rnd.integerInRange(0,24);
    		for(var i = 0; i < currentPrompt.length; i++)
    		{
	    		if(letter == i && !currentPrompt[i])
	    		{
	    			currentPrompt[i] = true;
	    			if(letter < 16)
	    			{
	    				message += String.fromCharCode(i + 97);
	    			}
	    			else if(letter >= 16)
	    			{
	    				message += String.fromCharCode(i + 98);
	    			}
	    			keys[j].frame = i;
	    			keys[j].visible = true
	    		}
	    		
    		}

    	}
    	if(num < 3)
    	{
    		keys[2].visible = false;
    	}
    	if(num < 2)
    	{
    		keys[1].visible = false;
    	}
    	

    	

    	promptTimer = game.time.create(false);
       	promptTimer.add(Phaser.Timer.SECOND * 5 / timeMultiplier, this.newPrompt, this);
       	promptTimer.start();

    	console.log(message);
    	
    	
    }
}

var GameOver = function(game) {}; //unchanged
GameOver.prototype = {
     preload: function() {
        console.log("GameOver: preload");

    },

    create: function() {
        console.log("GameOver: create");
        //Gameover text
        theme.stop();
        var nameLabel = game.add.text(280, 250, 'GameOver',{font: '50px Courier', fill: '#ffffff'});
        game.add.text(160, 300, 'Press r to restart',{font: '50px Courier', fill: '#ffffff'});

        forest1 = false;
        forest2 = false;
        shack  = false;
        house = false;
 
    },

    update: function() {
        if(game.input.keyboard.isDown(Phaser.Keyboard.R)){
            game.state.start('Menu');
        }
        
    }
}

var Win = function(game) {}; //unchanged
Win.prototype = {
     preload: function() {
        console.log("Win: preload");
        game.load.image('end', 'assets/img/end.png');
    },

    create: function() {
        console.log("Win: create");
        //Gameover text
        theme.stop();
        game.add.sprite(0, 0, 'end');
       

        forest1 = false;
        forest2 = false;
        shack  = false;
        house = false;
 
    },

    update: function() {
        if(game.input.keyboard.isDown(Phaser.Keyboard.R)){
            game.state.start('Menu');
        }
        
    }
}

checkKeyInput = function()
    {
    	passed = true;
    	var wasPrompt = false;

    	for(var i = 0; i < keysPressed.length; i++)
    	{
    		keysPressed[i] = false;
    	}

    	if(game.input.keyboard.isDown(Phaser.Keyboard.A))
    	{
    		keysPressed[0] = true;
    	}
    	if(game.input.keyboard.isDown(Phaser.Keyboard.B))
    	{
    		keysPressed[1] = true;
    	}
    	if(game.input.keyboard.isDown(Phaser.Keyboard.C))
    	{
    		keysPressed[2] = true;
    	}
    	if(game.input.keyboard.isDown(Phaser.Keyboard.D))
    	{
    		keysPressed[3] = true;
    	}
    	if(game.input.keyboard.isDown(Phaser.Keyboard.E))
    	{
    		keysPressed[4] = true;
    	}
    	if(game.input.keyboard.isDown(Phaser.Keyboard.F))
    	{
    		keysPressed[5] = true;
    	}
    	if(game.input.keyboard.isDown(Phaser.Keyboard.G))
    	{
    		keysPressed[6] = true;
    	}
    	if(game.input.keyboard.isDown(Phaser.Keyboard.H))
    	{
    		keysPressed[7] = true;
    	}
    	if(game.input.keyboard.isDown(Phaser.Keyboard.I))
    	{
    		keysPressed[8] = true;
    	}
    	if(game.input.keyboard.isDown(Phaser.Keyboard.J))
    	{
    		keysPressed[9] = true;
    	}
    	if(game.input.keyboard.isDown(Phaser.Keyboard.K))
    	{
    		keysPressed[10] = true;
    	}
    	if(game.input.keyboard.isDown(Phaser.Keyboard.L))
    	{
    		keysPressed[11] = true;
    	}
    	if(game.input.keyboard.isDown(Phaser.Keyboard.M))
    	{
    		keysPressed[12] = true;
    	}
    	if(game.input.keyboard.isDown(Phaser.Keyboard.N))
    	{
    		keysPressed[13] = true;
    	}
    	if(game.input.keyboard.isDown(Phaser.Keyboard.O))
    	{
    		keysPressed[14] = true;
    	}
    	if(game.input.keyboard.isDown(Phaser.Keyboard.P))
    	{
    		keysPressed[15] = true;
    	}
    	if(game.input.keyboard.isDown(Phaser.Keyboard.R))
    	{
    		keysPressed[16] = true;
    	}
    	if(game.input.keyboard.isDown(Phaser.Keyboard.S))
    	{
    		keysPressed[17] = true;
    	}
    	if(game.input.keyboard.isDown(Phaser.Keyboard.T))
    	{
    		keysPressed[18] = true;
    	}
    	if(game.input.keyboard.isDown(Phaser.Keyboard.U))
    	{
    		keysPressed[19] = true;
    	}
    	if(game.input.keyboard.isDown(Phaser.Keyboard.V))
    	{
    		keysPressed[20] = true;
    	}
    	if(game.input.keyboard.isDown(Phaser.Keyboard.W))
    	{
    		keysPressed[21] = true;
    	}
    	if(game.input.keyboard.isDown(Phaser.Keyboard.X))
    	{
    		keysPressed[22] = true;
    	}
    	if(game.input.keyboard.isDown(Phaser.Keyboard.Y))
    	{
    		keysPressed[23] = true;
    	}
    	if(game.input.keyboard.isDown(Phaser.Keyboard.Z))
    	{
    		keysPressed[24] = true;
    	}

    	
    	//console.log(keysPressed);

    	for(var i = 0; i < keysPressed.length; i++)
    	{
    		if(keysPressed[i] != currentPrompt[i])
    		{
    			passed = false;
    		}
    		if(currentPrompt[i])
    		{
    			wasPrompt = true;
    		}
    	}
    	if(passed)
    	{
    		console.log('passed');
    		light += 7;
    		if(light > 50)
    		{
    			light = 50;
    		}
    		
    		if(wasPrompt)
    		{
    			
    			for(var i = 0; i < keys.length; i++)
    			{
    				keys[i].visible = false;
    			}
    		}
    		
    	}
    }



//standard states
game.state.add('Menu', Menu);
game.state.add('Instructions', Instructions);
game.state.add('Outside', Outside);
game.state.add('House', House);
game.state.add('Win', Win);
game.state.add('GameOver', GameOver);
game.state.start('Menu');