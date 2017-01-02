/// <reference path="../../../node_modules/phaser/typescript/phaser.d.ts" />

import { Thing } from 'thing';
import { Pickable } from 'thing';
import { Reaction } from '../../reaction';
import { Head } from '../head';

export class Broccoli extends Thing implements Pickable {
    constructor(game: Phaser.Game, head: Head) {
        super(game, 'broccoli', head);

        this.game = game;
    }

    getScoreValue(): number {
        return 0;
    }

    getLiveModifier(): number {
        return 1;    
    }

    beConsumed(): Reaction {
        this.destroy();
        return Reaction.NONE;
    }

    move(): void {
    }
}