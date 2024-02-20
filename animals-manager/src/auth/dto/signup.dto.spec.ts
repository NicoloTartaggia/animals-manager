import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Role, SignUpDto } from "./signup.dto";

describe('updateAnimalDto', () => {

    let user = {
        username: 'username',
        password: 'password',
        role: Role.Admin
    };

    it('should not be valid if username is missing or is empty', async () => {
        user.username = null;
        const errors = await validate(plainToInstance(SignUpDto, user));
        expect(errors.length).not.toBe(0);
        expect(JSON.stringify(errors)).toContain('username should not be empty');
        user.username = 'username';
    });

    it('should not be valid if username exceeds maximum length', async () => {
        user.username = 'a'.repeat(31);
        const errors = await validate(plainToInstance(SignUpDto, user));
        expect(errors.length).not.toBe(0);
        expect(JSON.stringify(errors)).toContain('username must be shorter than or equal to 20 characters');
        user.username = 'username';
    });

    it('should not be valid if password does not contain at least 6 characters', async () => {
        user.password = 'a';
        const errors = await validate(plainToInstance(SignUpDto, user));
        expect(errors.length).not.toBe(0);
        expect(JSON.stringify(errors)).toContain('password must be longer than or equal to 6 characters');
        user.password = 'password';
    });

    it('should not be valid if role is not an allowed Enum value', async () => {
        user.role = 'notAllowed' as Role;
        const errors = await validate(plainToInstance(SignUpDto, user));
        expect(errors.length).not.toBe(0);
        expect(JSON.stringify(errors)).toContain(`Accepted values for role are: [${Object.values(Role)}]`);
        user.role = Role.Admin;
    });
})