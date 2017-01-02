/// <reference path="../../../node_modules/phaser/typescript/phaser.d.ts" />

import { Thing } from 'thing';
import { Reaction } from 'reaction';
import { Pickable } from 'thing';
import { Head } from '../head';

export class Beer extends Thing implements Pickable {
    constructor(game: Phaser.Game, head: Head) {
        super(game, 'beer', head);

        this.game = game;
    }

    getScoreValue(): number {
        return 50;
    }

    getLiveModifier(): number {
        return 0;    
    }

    beConsumed(): Reaction {
        this.destroy();
        return Reaction.GOOD;
    }

    move(): void {

    }
}