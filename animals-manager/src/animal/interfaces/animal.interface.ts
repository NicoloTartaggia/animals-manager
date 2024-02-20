import { Document } from 'mongoose'

export interface IAnimal extends Document {
    readonly id: string,
    readonly owner: string,
    readonly name: string,
    readonly type: string, 
    readonly species: string
    readonly age: number, 
    readonly gender: string,
    readonly weight: number,
    readonly verse: string 
}

export class IAnimalPage {
    constructor(public animals: IAnimal[], public nextPageCursor: string) {
        this.animals = animals;
        this.nextPageCursor = nextPageCursor;
    }
}