/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

import { Boot } from 'states/boot';
import { Preloader } from 'states/preloader';
import { Splash } from 'states/splash';
import { Gameplay } from 'states/gameplay';

class Game extends Phaser.Game
{
	game: Phaser.Game;
	
	constructor()
	{
		// create our phaser game
		// 800 - width
		// 600 - height
		// Phaser.AUTO - determine the renderer automatically (canvas, webgl)
		// 'content' - the name of the container to add our game to
		// { preload:this.preload, create:this.create} - functions to call for our states

		super(1024, 786, Phaser.AUTO, 'content', null);

		this.state.add('Boot', Boot, false);
		this.state.add('Preloader', Preloader, false);
		this.state.add('Splash', Splash, false);
		this.state.add('Gameplay', Gameplay, false);

		this.state.start('Boot');
	}
}

export default function bootGame() {
	// when the page has finished loading, create our game
	var game = new Game();
}