/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />

export class RandomGenerator {
    getRandomInteger(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}