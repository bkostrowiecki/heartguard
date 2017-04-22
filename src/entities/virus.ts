/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />
import { RandomGenerator } from '../helpers/randomGenerator';
import { Heart } from './heart';

enum VirusState {
    FollowHeart = 0,
    PrepareToAttack = 1,
    Attack = 2
};

export class Virus extends Phaser.Sprite {
    game: Phaser.Game;
    heart: Heart;

    virusState: VirusState;
    virusbeatTween: Phaser.Tween;
    attackTimer: Phaser.Timer;

    attackCallback: Function = () => {};

    randomGenerator: RandomGenerator;

    constructor(game: Phaser.Game, heart: Heart) {
        super(game, game.world.centerX - 300, game.world.centerY, 'virus', 1);

        this.game = game;
        this.heart = heart;

        this.virusState = VirusState.FollowHeart;

        this.randomGenerator = new RandomGenerator();

        this.game.add.existing(this);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.anchor.setTo(0.5, 0.5);

        this.body.setCircle(this.width / 2);

        this.health = 100;
        this.maxHealth = 100;

        this.scale.x = 1;
        this.scale.y = 1;

        this.virusbeatTween = this.game.add.tween(this.scale).to({
            x: 0.85,
            y: 0.85
        }, 100, 'Linear', true, 0, -1);

        this.virusbeatTween.yoyo(true, 100);

        this.attackTimer = this.game.time.create(false);
        this.attackTimer.loop(3000, this.attackTick.bind(this), this);
    }

    update() {
        this.game.physics.arcade.overlap(this, this.heart, this.overlapHandler.bind(this), null, this);

        if (this.virusState === VirusState.FollowHeart) {
            this.game.physics.arcade.moveToObject(this, this.heart, 100);
        }
    }

    attackTick() {
        this.attackCallback(this, this.heart);
        this.heart.health -= 10;
    }

    attachAttackCallback(attackCallback: Function) {
        this.attackCallback = attackCallback;
    }

    overlapHandler() {
        this.virusState = VirusState.PrepareToAttack;

        this.game.time.events.add(this.randomGenerator.getRandomInteger(1000, 5000), () => {
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
        });

        this.attackTimer.start();
    }
}