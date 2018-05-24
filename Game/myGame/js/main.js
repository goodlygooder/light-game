
var game = new Phaser.Game(800, 600, Phaser.AUTO); //make game
var flipFlop = true; //global variable that's just used as a toggle
//var lighter;
//var player;
//var hand;
//var nameLabel;
//var instructions;
//var light;
//var lightLevel;
//var hole;
//var timeMultiplier;
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
        timedEvent = qTimer.add(Phaser.Timer.SECOND * 5, this.timerEnd, this);
        qTimer.start();

        //game.add.text(100, 100, 'Menu',{font: '50px Courier', fill: '#ffffff'});
        lighter = game.add.sprite(300, 150, 'lighter');
        lighter.animations.add('idle', ['lighter0.png'], 1, true);
        lighter.animations.add('fire', ['lighter1.png', 'lighter2.png','lighter3.png', 'lighter4.png','lighter3.png', 'lighter4.png','lighter3.png', 'lighter4.png','lighter3.png', 'lighter4.png','lighter3.png', 'lighter4.png','lighter3.png', 'lighter4.png','lighter3.png', 'lighter4.png','lighter3.png', 'lighter4.png','lighter3.png', 'lighter4.png','lighter3.png', 'lighter4.png','lighter3.png', 'lighter4.png','lighter3.png', 'lighter4.png','lighter3.png', 'lighter4.png'], 5, true);
        game.add.text(300, 425, 'Hold q',{font: '50px Courier', fill: '#ffffff'});

        openLighter = game.add.audio('openLighter');
        strike = game.add.audio('strike');
        theme = game.add.audio('theme');

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
       		timedEvent = qTimer.add(Phaser.Timer.SECOND * 5, this.timerEnd, this);
       		qTimer.start();
       		console.log('start q timer');
       		flipFlop = true;
       		openLighter.play();
       		openLighter.onStop.add(function strikeSound() {if(game.input.keyboard.isDown(Phaser.Keyboard.Q)){strike.play()}}, this);
       		
    	}
        //if q is pressed, initiate the fire
        if(game.input.keyboard.isDown(Phaser.Keyboard.Q) == true){
            lighter.animations.play('fire');
            game.add.text(150, 500, 'Never let go of q',{font: '50px Courier', fill: '#ffffff'});
            
        }
        else{
        	lighter.animations.play('idle');
        }

    },

    //when the timer expires, go to Gameplay
    timerEnd:  function()
    {
    	console.log('q timer finished');
    	game.state.start('GamePlay');
    }


}

var GamePlay = function() {};
GamePlay.prototype = {
     preload: function() {
        console.log("GamePlay: preload");
        game.load.atlas('player', 'assets/img/walk.png', 'assets/img/walk.json');
        game.load.atlas('hand', 'assets/img/creepyHands1.png', 'assets/img/creepyHands1.json' );
        game.load.image('background', 'assets/img/background.png'); //blue background
        game.load.image('background0', 'assets/img/background0.png');//ground
        game.load.image('background1', 'assets/img/background1.png');//closest tree
        game.load.image('background2', 'assets/img/background2.png');
        game.load.image('background3', 'assets/img/background3.png');
        game.load.image('background4', 'assets/img/background4.png');//farthest tree
        game.load.image('hole', 'assets/img/hole1.png'); //light hole around player
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
       		timeMult.loop(Phaser.Timer.SECOND * 5, function timeAdvance(){ if(timeMultiplier < 2) {timeMultiplier += .05;}}, this);
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
            background = game.add.sprite(0, 0, 'background');
            background0 = game.add.sprite(0, 0, 'background0');
            background4 = game.add.tileSprite(0, -50, 800, 600, 'background4');
            background3 = game.add.tileSprite(0, -50, 800, 600, 'background3');
            background2 = game.add.tileSprite(0, -50, 800, 600, 'background2');
            background1 = game.add.tileSprite(0, -50, 800, 600, 'background1');

            player = game.add.sprite(350, 320, 'player');
            game.physics.arcade.enable(player);
            //player.anchor.setTo(.5, .5);
            player.animations.add('walk', ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png'], 6, true);

            hands = game.add.group();
            //game.physics.arcade.enable(hands);
            hands.enableBody = true;

            

            hole = game.add.sprite(0, 0, 'hole');
            nameLabel = game.add.text(100, 100, '',{font: '50px Courier', fill: '#ffffff'});
            instructions = game.add.text(400, 200, 'Press keys when prompted',{font: '25px Courier', fill: '#ffffff'});
            light = 50;
            timeMultiplier = 1;
            passed = false;
            lightLevel = game.add.text(100,175, 'Light: ' + light, {font: '20px Courier', fill: '#ffffff'} );
            theme.loopFull();
            player.animations.play('walk');

    },

    update: function() {

    	//timer is used as a bit of leeway, as phaser seems not to process input for a short period of time
    	//inbetween states.

    	//when q is not held and the leeway is used up, go to gameover

    	if((!game.input.keyboard.isDown(Phaser.Keyboard.Q) && flipFlop) || light <= 0)
    	{
    		theme.stop();
        	game.state.start('GameOver');
    	}

    	//console.log(game.input.keyboard.isDown(Phaser.Keyboard.A));
    	if(!passed)
    	{
    		checkKeyInput();
    	}

    	game.physics.arcade.overlap(player, hands, this.handCatch, null, this);
    	
    	
        //move character
        
        //hand.animations.play('creep');

        background1.tilePosition.x -= 1.25;
        background2.tilePosition.x -= 1;
        background3.tilePosition.x -= 0.75;
        background4.tilePosition.x -= 0.5;
       // game.debug.body(player);
       // game.debug.body(hands);
    },

    leewayEnd:  function()
    {
    	console.log('Leeway timer end');
    	flipFlop = true;
    },

    lowerLight: function()
    {
    	light -= 1;
    	lightLevel.text = 'Light: ' + light;
    },

    handSpawn: function()
    {
    	hand = hands.create(game.rnd.integerInRange(-800,1600), -200, 'hand');
        hand.animations.add('creep', ['creepyHands1.0.png', 'creepyHands1.1.png', 'creepyHands1.2.png'], 4, true);
        hand.animations.play('creep');
        game.physics.arcade.enable(hand);
        hand.body.setSize(100,100, 0, 200);
        hand.anchor.setTo(.5, .5);
        hand.rotation = game.physics.arcade.angleToXY(hand, 350 + player.width * .75, 320 + player.height * .75) + Math.PI/2;
        game.physics.arcade.moveToXY(hand, 350 + player.width * .75, 320 + player.height * .75, 5, 5000);
        hand.inputEnabled = true;
        hand.events.onInputDown.add(this.handClick, this);
        //hands.add(hand);

        // catchTime = game.time.create(false);
       	// catchTime.add(3500, this.handCatch, this);
       	// catchTime.start();
        
        //game.physics.enableBody(hand);
    },

    handClick: function()
    {
    	//hand.destroy();
    	//catchTime.destroy();
    	//hand.setVelocity(-hand.body.velocity.x, -hand.body.velocity.y);
    	hand.body.velocity.x = -hand.body.velocity.x;
    	hand.body.velocity.y = -hand.body.velocity.y;
    	hand.inputEnabled = false;
    },

    handCatch: function()
    {
    	console.log('catch');
    	hand.destroy();
    	// catchTime.destroy();
    	light -= 15;
    	lightLevel.text = 'Light: ' + light;
    },


    newPrompt: function()
    {
    	instructions.text = '';
    	if(!passed)
    	{
    		console.log('failed');
    		light -= 10;
    		lightLevel.text = 'Light: ' + light;
    	}
    	console.log('new prompt');
    	passed = false;
    	var letter;
    	var num = game.rnd.integerInRange(1, 2 * timeMultiplier);
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
	    			
	    		}
	    		
    		}
    	}

    	

    	promptTimer = game.time.create(false);
       	promptTimer.add(Phaser.Timer.SECOND * 5 / timeMultiplier, this.newPrompt, this);
       	promptTimer.start();

    	console.log(message);
    	nameLabel.text = message;
    	
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
        var nameLabel = game.add.text(280, 250, 'Gameover',{font: '50px Courier', fill: '#ffffff'});
        game.add.text(160, 300, 'Press r to restart',{font: '50px Courier', fill: '#ffffff'});
 
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
    		lightLevel.text = 'Light: ' + light;
    		if(wasPrompt)
    		{
    			nameLabel.text = 'passed';
    		}
    		
    	}
    }



//standard states
game.state.add('Menu', Menu);
game.state.add('GamePlay', GamePlay);
game.state.add('GameOver', GameOver);
game.state.start('Menu');