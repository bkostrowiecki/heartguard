/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />
import { RandomGenerator } from '../helpers/randomGenerator';
import { Heart } from './heart';

export enum VirusState {
    FollowHeart = 0,
    PrepareToAttack = 1,
    Attack = 2,
    HeartIsDead = 3
};

export class Virus extends Phaser.Sprite {
    game: Phaser.Game;
    heart: Heart;

    public virusState: VirusState;
    virusbeatTween: Phaser.Tween;
    attackTimer: Phaser.Timer;

    attackCallback: Function = () => {};
    deathCallback: Function = () => {};

    randomGenerator: RandomGenerator;

    constructor(game: Phaser.Game, heart: Heart) {
        super(game, -2000, -200, 'virus', 1);

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

        if (this.randomGenerator.getRandomInteger(0, 1)) {
            this.position.x = -100;
        } else {
            this.position.x = this.game.world.width + 100;
        }
        
        this.position.y = this.randomGenerator.getRandomInteger(-100, this.game.world.height + 100);

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

        if (!this.alive) {
            this.destroy();
            this.attackTimer.destroy();
        }

        if (this.alive && this.virusState === VirusState.FollowHeart) {
            this.game.physics.arcade.moveToObject(this, this.heart, 100);
        }
    }

    attackTick() {
        if (this.heart.health <= 0 && this.heart.alive) {
            this.heart.alive = false;

            this.heart.stop();
            this.deathCallback(this, this.heart);

            return;
        }

        if (!this.heart.alive) {
            return;
        }
        
        this.attackCallback(this, this.heart);
        this.heart.health -= 5;

        this.heart.increaseHeartbeat();

        this.heart.tint = 0xffff00;
        this.heart.alpha = 0.5;

        this.game.time.events.add(200, () => {
             this.heart.tint = 0xffffff;
             this.heart.alpha = 1;
        });
    }

    heartIsDead() {
        this.virusState = VirusState.HeartIsDead;

        if (this.body) {
            this.body.velocity.x = this.randomGenerator.getRandomInteger(0, 1000) - 500;
            this.body.velocity.y = this.randomGenerator.getRandomInteger(0, 1000) - 500;
        }
    }

    attachDeathCallback(deathCallback: Function) {
        this.deathCallback = deathCallback;
    }

    attachAttackCallback(attackCallback: Function) {
        this.attackCallback = attackCallback;
    }

    overlapHandler() {
        if (this.virusState === VirusState.HeartIsDead) {
            return;
        }

        this.virusState = VirusState.PrepareToAttack;

        this.game.time.events.add(this.randomGenerator.getRandomInteger(1000, 5000), () => {
            if (this.alive) {
                this.body.velocity.x = 0;
                this.body.velocity.y = 0;
            }
        });

        this.attackTimer.start();
    }
}