export class Animal {
    id: string;
    name: string;
    type: string; 
    species: string;
    age: number;
    gender: string;
    weight: number;
    verse: string;

    constructor(object?: any) {
        this.id = object.id;
        this.name = object.name;
        this.type = object.type;
        this.species = object.species;
        this.age = object.age;
        this.gender = object.gender;
        this.weight = object.weight;
        this.verse = object.verse;
      }
    
}