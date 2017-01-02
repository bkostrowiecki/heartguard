/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />

import { Head } from '../entities/head';
import { HeadMoodState } from '../entities/headState';

import { Thing } from '../entities/things/thing';
import { Beer } from '../entities/things/beer';
import { Broccoli } from '../entities/things/broccoli';

import { RandomGenerator } from '../randomGenerator';

export class Gameplay extends Phaser.State {
    score: number;
    lives: number;

    comboCounter: number;
    comboPoints: number;

    head: Head;
    background: Phaser.Sprite;
    
    things: Thing[];
    canCreateThing: boolean;

    randomGenerator: RandomGenerator;

    spacebar: Phaser.Key;
    activePointer: Phaser.Pointer;

    preload() {
        this.randomGenerator = new RandomGenerator();

        this.score = 0;
        this.lives = 3;

        this.comboCounter = 0;
        this.comboPoints = 0;

        this.things = [];
        this.canCreateThing = true;

        this.game.stage.backgroundColor = 0x000000;
    }

    create() {
        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.background = this.add.sprite(0, 0, 'background');

        this.head = new Head(this.game, this.world.centerX, this.world.centerY);

        this.input.mouse.capture = true;
        this.spacebar = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.activePointer = this.input.activePointer;

        this.head.body.onCollide = new Phaser.Signal();
        this.head.body.onCollide.add(this.headWithThingCollide, this);

        this.head.registerMoodChangeCallback(this.headMoodChangeCallback, this);
    }

    headMoodChangeCallback(headMoodState: HeadMoodState) {
        if (headMoodState == HeadMoodState.CALM && this.comboCounter > 0) {
            this.finishCombo();
        }
    }

    update() {
        if (this.spacebar.isDown && this.canCreateThing) {
            this.canCreateThing = false;
            this.game.time.events.add(Phaser.Timer.SECOND * 0.5, () => {
                this.canCreateThing = true;
            });
            this.createRandomThing();
        }

        if (this.activePointer.leftButton.isDown) {
            this.head.prepareForSnack();
        } else {
            this.head.giveUpOnSnack();
        }

        for (let i = 0; i < this.things.length; i++) {
            this.game.physics.arcade.collide(this.head, this.things[i]);
        }
    }

    render() {
        this.game.debug.text(['Score:', this.score, '   Lives:', this.lives].join(' '), 10, 10, 'white');
        this.game.debug.body(this.head);
        for (let i = 0; i < this.things.length; i++) {
            this.game.debug.body(this.things[i]);
        }
    }

    createRandomThing() {
        let randomConstructors = [Beer];

        let randomConstructorIndex = this.randomGenerator.getRandomInteger(0, randomConstructors.length - 1);
        
        let newThing = new randomConstructors[randomConstructorIndex](this.game, this.head);
        this.things.push(newThing);
    }

    headWithThingCollide(head: Head, collider: Thing) {
        let thing = collider;

        this.score += collider.getScoreValue();
        
        if (head.getMood() == HeadMoodState.HAPPY) {
            this.comboCounter++;
            this.comboPoints += collider.getScoreValue();
        }

        if (this.activePointer.leftButton.isDown) {
            this.lives -= collider.getLiveModifier();
        }

        head.react(collider.beConsumed());
    }

    finishCombo() {
        this.score += this.comboPoints * (this.comboCounter);
        console.log('COMBO!', this.comboPoints, this.comboCounter);

        this.comboCounter = 0;
        this.comboPoints = 0;
    }
}