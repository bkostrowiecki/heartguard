/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />

import { Heart } from '../entities/heart';
import { Virus } from '../entities/virus';
import { RandomGenerator } from '../helpers/randomGenerator';

export class Gameplay extends Phaser.State {
    heart: Heart;
    virusTest: Virus;

    preload() {
        this.game.stage.backgroundColor = 0x890029;
    }

    create() {
        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.heart = new Heart(this.game);

        this.virusTest = new Virus(this.game, this.heart);
    }

    update() {

    }

    render() {
        this.game.debug.body(this.heart);
        this.game.debug.body(this.virusTest);

        this.game.debug.text(this.heart.health.toString(), 10, 10, '#fff');
        // for (let i = 0; i < this.things.length; i++) {
        //     this.game.debug.body(this.things[i]);
        // }
    }
}