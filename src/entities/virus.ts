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

    explosionEmitter: Phaser.Particles.Arcade.Emitter;
    heartbleedEmitter: Phaser.Particles.Arcade.Emitter;

    explosionSound: Phaser.Sound;
    hitSound: Phaser.Sound;

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
        //this.body.setSize(80, 80, 0, 0);

        this.body.immovable = true;

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
        }, 100, Phaser.Easing.Cubic.In, true, 0, -1);

        this.virusbeatTween.yoyo(true, 100);

        this.attackTimer = this.game.time.create(false);
        this.attackTimer.loop(3000, this.attackTick.bind(this), this);

        this.events.onKilled.addOnce(() => {
            this.onKilled();
        });

        this.explosionEmitter = this.game.add.emitter(this.game.world.centerX, this.game.world.centerY, 30);

        this.explosionEmitter.makeParticles('explosionParticle');
        this.explosionEmitter.gravity = 0;
        this.explosionEmitter.lifespan = 400;
        this.explosionEmitter.minParticleScale = 0.75;
        this.explosionEmitter.minParticleSpeed.set(-500, -500);
        this.explosionEmitter.maxParticleSpeed.set(500, 500);
        this.explosionEmitter.maxParticleScale = 2;

        this.heartbleedEmitter = this.game.add.emitter(this.game.world.centerX, this.game.world.centerY, 5);
        this.heartbleedEmitter.makeParticles('blood');
        this.heartbleedEmitter.gravity = 1000;
        this.heartbleedEmitter.lifespan = 400;
        this.heartbleedEmitter.minParticleScale = 0.75;
        this.heartbleedEmitter.minParticleSpeed.set(-100, -100);
        this.heartbleedEmitter.maxParticleSpeed.set(100, 250);
        this.heartbleedEmitter.maxParticleScale = 2;

        this.explosionSound = this.game.add.audio('explosion');
        this.explosionSound.allowMultiple = false;

        this.hitSound = this.game.add.audio('hit');
        this.hitSound.allowMultiple = true;
        this.hitSound.volume = 0.4;
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
        
        this.explosionEmitter.x = this.x;
        this.explosionEmitter.y = this.y;

        this.heartbleedEmitter.x = this.x;
        this.heartbleedEmitter.y = this.y;
    }

    onKilled() {
        this.explosionEmitter.start(true, 400, null, 20, false);
        
        this.explosionEmitter.forEachAlive((particle: Phaser.Particle) => {
            particle.alpha = 1;
            this.game.add.tween(particle).to({
                alpha: 0
            }, 350, Phaser.Easing.Cubic.In, true, 0, null, false);
        }, this);

        this.explosionSound.play();

        this.game.time.events.add(1000, () => {
            this.explosionEmitter.destroy();
        }, this);

        this.game.time.events.add(2000, () => {
            this.explosionSound.destroy();
        }, this);
    }

    playDamageSound() {
        this.hitSound.play();
    }

    animateDamage() {
        this.tint = 0xcccc00;

        this.game.time.events.add(200, () => {
            if (this && this.alive) {
                this.tint = 0xffffff;
                this.alpha = 1;
            }
        });
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

        this.heartbleedEmitter.start(true, 300, null, 5);

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
            if (this.alive && this.virusState !== VirusState.HeartIsDead) {
                this.body.velocity.x = 0;
                this.body.velocity.y = 0;
            }
        });

        this.attackTimer.start();
    }
}