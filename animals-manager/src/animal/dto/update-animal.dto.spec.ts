import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { UpdateAnimalDto } from "./update-animal.dto";

describe('updateAnimalDto', () => {

    let updateAnimal = {
        weight: 1,
        age: 1,
    };

    it('should not be valid if weight is not a positive integer', async () => {
        updateAnimal.weight = -1.1;
        const errors = await validate(plainToInstance(UpdateAnimalDto, updateAnimal));
        expect(errors.length).not.toBe(0);
        expect(JSON.stringify(errors)).toContain('weight must be a positive number');
        expect(JSON.stringify(errors)).toContain('weight must be an integer number');
        updateAnimal.weight = 1;
    });
})