/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />

import { HeadMoodState } from './headState';
import { Reaction } from '../reaction';

export class Head extends Phaser.Sprite  {
    moodState: HeadMoodState;
    moodTimer: Phaser.TimerEvent;
    moodChangeCallback: Function;
    moodChangeCallbackContext: Object;

    constructor(game: Phaser.Game, x: number, y: number) {
        super(game, x, y, 'head', 1);
        
        this.anchor.setTo(0.5, 0.5);

        this.animations.frame = 0;

        this.game.add.existing(this);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.setCircle(this.width / 3, this.width / 6, this.height / 6);
        this.body.immovable = true;

        this.moodState = HeadMoodState.CALM;
        this.moodTimer = new Phaser.TimerEvent(new Phaser.Timer(this.game, false), 0, 0, 0, false, () => {}, this);
    }

    update() {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
    }

    prepareForSnack() {
        if (!this.isMoodDominating()) {
            this.animations.frame = 1;
            this.moodState = HeadMoodState.CONSUMING;
            this.triggerMoodChangeCallback();
        }
    }

    giveUpOnSnack() {
        if (!this.isMoodDominating()) {
            this.animations.frame = 0;
            this.moodState = HeadMoodState.CALM;
            this.triggerMoodChangeCallback();
        }
    }

    isMoodDominating() {
        return this.moodState == HeadMoodState.HAPPY || this.moodState == HeadMoodState.SAD;
    }

    react(reaction: Reaction) {
        switch (reaction) {
            case Reaction.GOOD:
                this.reactOnGoodie();
                break;
            case Reaction.BAD:
                this.reactOnBaddie();
                break;
            default:
                break;
        }
    }

    reactOnGoodie() {
        this.animations.frame = 2;
        this.moodState = HeadMoodState.HAPPY;

        this.game.time.events.remove(this.moodTimer);

        this.moodTimer = this.game.time.events.add(Phaser.Timer.SECOND * 2, () => {
            this.animations.frame = 0;
            this.moodState = HeadMoodState.CALM;
            this.triggerMoodChangeCallback();
        });
    }

    reactOnBaddie() {
        this.moodState = HeadMoodState.SAD;
        this.animations.frame = 0;

        this.game.time.events.remove(this.moodTimer);

        this.moodTimer = this.game.time.events.add(Phaser.Timer.SECOND * 2, () => {
            this.animations.frame = 0;
            this.moodState = HeadMoodState.CALM;
            this.triggerMoodChangeCallback();
        });
    }

    registerMoodChangeCallback(callback: Function, context: Object): void {
        this.moodChangeCallback = callback;
        this.moodChangeCallbackContext = context;
    }

    getMood(): HeadMoodState {
        return this.moodState;
    }

    triggerMoodChangeCallback(): void {
        this.moodChangeCallback.call(this.moodChangeCallbackContext, this.moodState);
    }
}