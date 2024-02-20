import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateAnimalDto, Gender } from "./create-animal.dto";

describe('createAnimalDto', () => {

    let newAnimal = {
        name: 'test',
        type: 'test',
        species: 'test',
        age: 1,
        gender: Gender.Male,
        weight: 1,
        verse: 'verse'
    };

    it('should not be valid if name is missing or is empty', async () => {
        newAnimal.name = null;
        const errors = await validate(plainToInstance(CreateAnimalDto, newAnimal));
        expect(errors.length).not.toBe(0);
        expect(JSON.stringify(errors)).toContain('name should not be empty');
        newAnimal.name = 'test'
    });

    it('should not be valid if name exceeds maximum length', async () => {
        newAnimal.name = 'a'.repeat(31);
        const errors = await validate(plainToInstance(CreateAnimalDto, newAnimal));
        expect(errors.length).not.toBe(0);
        expect(JSON.stringify(errors)).toContain('name must be shorter than or equal to 30 characters');
        newAnimal.name = 'test';
    });

    it('should not be valid if age is not a positive integer', async () => {
        newAnimal.age = -1.1;
        const errors = await validate(plainToInstance(CreateAnimalDto, newAnimal));
        expect(errors.length).not.toBe(0);
        expect(JSON.stringify(errors)).toContain('age must be a positive number');
        expect(JSON.stringify(errors)).toContain('age must be an integer number');
        newAnimal.age = 1;
    });

    it('should not be valid if gender is not an allowed Enum value', async () => {
        newAnimal.gender = 'notAllowed' as Gender;
        const errors = await validate(plainToInstance(CreateAnimalDto, newAnimal));
        expect(errors.length).not.toBe(0);
        expect(JSON.stringify(errors)).toContain(`Accepted values for gender are: [${Object.values(Gender)}]`);
        newAnimal.gender = Gender.Male;
    });
})