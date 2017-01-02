/// <reference path="../../../node_modules/phaser/typescript/phaser.d.ts" />

import { RandomGenerator } from '../../randomGenerator';
import { Reaction } from '../../reaction';
import { Head } from '../head';

export class Thing extends Phaser.Sprite implements Pickable {
    game: Phaser.Game;
    randomGenerator: RandomGenerator;
    velocity: Phaser.Point;

    constructor(game: Phaser.Game, assetId: string, head: Head) {
        super(game, 0, 0, assetId, 0);

        this.game = game;
        this.randomGenerator = new RandomGenerator();

        this.placeInRandomPositionNotCollidingWithHead(head);
        this.establishPhysics();
        this.applyRandomDirection();

        this.establishUserControls();

        this.playAppearingAnimation();
    }

    placeInRandomPositionNotCollidingWithHead(head: Head): void {
        let point: Phaser.Point = new Phaser.Point(head.x, head.y);
        
        while (this.doesRectangleIntersectWithHead(point, head)) {
            point = new Phaser.Point(this.randomGenerator.getRandomInteger(0, this.game.canvas.clientWidth), this.randomGenerator.getRandomInteger(0, this.game.canvas.clientHeight));
        }
        
        this.x = point.x;
        this.y = point.y;
    }

    private doesRectangleIntersectWithHead(point: Phaser.Point, head: Head) {
        return ((point.x + this.width/2 > head.x - head.width / 2 && point.x - this.width/2 < head.x + head.width / 2) &&
            (point.y + this.height/2 > head.y - head.height / 2 && point.y - this.height/2 < head.y + head.height / 2));
    }

    establishPhysics() {
        this.anchor.setTo(0.5, 0.5);

        this.game.add.existing(this);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
    }

    applyRandomDirection(): void {
        this.velocity = new Phaser.Point(this.randomGenerator.getRandomInteger(0, 100) - 50, this.randomGenerator.getRandomInteger(0, 100) - 50);
        this.body.velocity.x = this.velocity.x;
        this.body.velocity.y = this.velocity.y;
    }

    establishUserControls() {
        this.inputEnabled = true;
        this.input.enableDrag(true);
        this.events.onDragStart.add(this.onDragStart, this);
        this.events.onDragStop.add(this.onDragStop, this);
    }

    playAppearingAnimation(): void {
        this.scale.x = 0;
        this.scale.y = 0;

        let startTweens: Phaser.Tween[] = [];
        
        startTweens.push(this.game.add.tween(this.scale).to({
            x: 1.25,
            y: 1.25
        }, 200, Phaser.Easing.Exponential.Out, false, 0));

        startTweens.push(this.game.add.tween(this.scale).to({
            x: 1,
            y: 1
        }, 50, Phaser.Easing.Linear.None, false, 0));

        startTweens[0].chain(startTweens[1]);
        startTweens[0].start();
    }

    onDragStart(): void {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
    }

    onDragStop(): void {
        this.body.velocity.x = this.velocity.x;
        this.body.velocity.y = this.velocity.y;
    }

    getScoreValue(): number {
        return 0;
    }

    getLiveModifier(): number {
        return 0;
    }

    beConsumed(): Reaction {
        return Reaction.NONE;
    }

    move(): void {}
}

export interface Pickable {
    getScoreValue(): number;
    getLiveModifier(): number;
    beConsumed(): Reaction;
    move(): void;
}