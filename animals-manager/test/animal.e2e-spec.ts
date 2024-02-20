
import * as request from 'supertest';
import { plainToInstance } from 'class-transformer';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule} from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Connection, Model, connect } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { randomUUID } from 'crypto';
import { AnimalService } from '../src/animal/animal.service';
import { AnimalDaoModule } from '../src/dao/animal-dao/animal-dao.module';
import { AnimalsController } from '../src/animal/animal.controller';
import { Animal, AnimalSchema } from '../src/animal/schemas/animal.schema';
import { CreateAnimalDto, Gender } from '../src/animal/dto/create-animal.dto';
import { AuthDaoModule } from '../src/dao/auth-dao/auth-dao.module';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import { User, UserSchema } from '../src/auth/schemas/user.schema';
import { Role, SignUpDto } from '../src/auth/dto/signup.dto';
import { JwtStrategy } from '../src/auth/jwt.strategy';
import { FakeJwtStrategy } from './utils/fake-jwt.strategy';

describe('AnimalController', () => {
    let app: INestApplication;
    let mongod: MongoMemoryServer;
    let mongoConnection: Connection;
    let animalModel: Model<Animal>;
    let userModel: Model<User>;
      
    const responseMock = {
        json: jest.fn((x) => x),
        status: jest.fn((x) => responseMock),
        send: jest.fn((x) => x),
    } as unknown as Response

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        mongoConnection = (await connect(uri)).connection;
        animalModel = mongoConnection.model(Animal.name, AnimalSchema);
        userModel = mongoConnection.model(User.name, UserSchema);
        const jwtSecret = 'jwtsecrettest'
        const jwtService = new JwtService({
            secret: jwtSecret,
            signOptions: { expiresIn: '600s' }
        });
        let authService = {
            signUp: (signUpDto: SignUpDto) => jwtService.sign({username: signUpDto.username, role: signUpDto.role}),
            signIn: (signInDto: SignUpDto) => jwtService.sign({username: signInDto.username, role: signInDto.role})
        }
        const fakeJwtStrategy: FakeJwtStrategy = new FakeJwtStrategy(jwtSecret);

        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [AnimalDaoModule, AuthDaoModule],
            controllers: [AnimalsController, AuthController],
            providers: [
                AnimalService,
                {provide: JwtService, useValue: jwtService},
                {provide: AuthService, useValue: authService},
                {provide: JwtStrategy, useValue: fakeJwtStrategy}
            ]
        })
        .overrideModule(AnimalDaoModule)
        .useModule({
            module: AnimalDaoModule,
            imports: [MongooseModule.forRoot(uri)],
            providers: [{provide: getModelToken(Animal.name), useValue: animalModel}]
        })
        .overrideModule(AuthDaoModule)
        .useModule({
            module: AuthDaoModule,
            imports: [MongooseModule.forRoot(uri)],
            providers: [{provide: getModelToken(User.name), useValue: userModel}]
        })
        .compile();

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({whitelist: true}));
        app.useLogger(false);
        await app.init();
    });

    afterAll(async () => {
        await mongoConnection.dropDatabase();
        await mongoConnection.close();
        await mongod.stop();
        await app.close();
      });
    
    afterEach(async () => {
        const collections = mongoConnection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
    });

    describe('getById', () => {
        it('should return a status of 204 if input id is not found', async () => {
            const user = createUser(Role.Admin);
            let jwtToken = await app.get<AuthService>(AuthService).signUp(plainToInstance(SignUpDto, user));
            const bearerToken = `Bearer ${jwtToken}`;

            return request(app.getHttpServer())
                .get('/api/v1/animals/inexistentId')
                .set('Authorization', bearerToken)
                .expect(204)
        });
    });

    describe('create', () => {
        const newAnimal = createDefaultAnimal();
        it('should return a status of 201 if input is correct and user has allowed role', async () => {
            const user = createUser(Role.Admin);
            let jwtToken = await app.get<AuthService>(AuthService).signUp(plainToInstance(SignUpDto, user));
            const bearerToken = `Bearer ${jwtToken}`;

            return request(app.getHttpServer())
                .post('/api/v1/animals')
                .set('Authorization', bearerToken)
                .send(newAnimal)
                .expect(201)
                .expect(({body}) => {
                    expect(body.name).toEqual(newAnimal.name);
                    expect(body.type).toEqual(newAnimal.type);
                    expect(body.species).toEqual(newAnimal.species);
                    expect(body.age).toEqual(newAnimal.age);
                    expect(body.gender).toEqual(newAnimal.gender);
                    expect(body.weight).toEqual(newAnimal.weight);
                    expect(body.verse).toEqual(newAnimal.verse);
                    expect(body.id).toBeDefined();
                });
        });

        it('should return a status of 400 if name is missing or is empty', async () => {
            const user = createUser(Role.Admin);
            let jwtToken = await app.get<AuthService>(AuthService).signUp(plainToInstance(SignUpDto, user));
            const bearerToken = `Bearer ${jwtToken}`;

            let newAnimal = createDefaultAnimal();
            newAnimal.name = null;
            return request(app.getHttpServer())
                .post('/api/v1/animals')
                .set('Authorization', bearerToken)
                .send(newAnimal)
                .expect(400)
        });

        it('should return a status of 401 is user has not an allowed role', async () => {
            const user = createUser(Role.Reader);
            let jwtToken = await app.get<AuthService>(AuthService).signUp(plainToInstance(SignUpDto, user));
            const bearerToken = `Bearer ${jwtToken}`;

            let newAnimal = createDefaultAnimal();
            return request(app.getHttpServer())
                .post('/api/v1/animals')
                .set('Authorization', bearerToken)
                .send(newAnimal)
                .expect(401)
        });
    });

    describe('updateById', () => {
        it('should return a status of 200 if input is correct and user has allowed role', async () => {
            const user = createUser(Role.Admin);
            let jwtToken = await app.get<AuthService>(AuthService).signUp(plainToInstance(SignUpDto, user));
            const bearerToken = `Bearer ${jwtToken}`;

            const newAnimal = await app.get<AnimalService>(AnimalService).create(plainToInstance(CreateAnimalDto, createDefaultAnimal(user.username)), user.username)
            return request(app.getHttpServer())
                .put(`/api/v1/animals/${newAnimal.id}`)
                .set('Authorization', bearerToken)
                .send({weight: 100})
                .expect(200)
        });

        it('should not update properties not included in the corresponding updateDto model', async () => {
            const user = createUser(Role.Admin);
            let jwtToken = await app.get<AuthService>(AuthService).signUp(plainToInstance(SignUpDto, user));
            const bearerToken = `Bearer ${jwtToken}`;

            const newAnimal = await app.get<AnimalService>(AnimalService).create(plainToInstance(CreateAnimalDto, createDefaultAnimal()), user.username)
            return request(app.getHttpServer())
                .put(`/api/v1/animals/${newAnimal.id}`)
                .set('Authorization', bearerToken)
                .send({id: 'newId', weight: 100})
                .expect(200)
                .expect(({body}) => {
                    expect(body.id).toEqual(newAnimal.id)
                    expect(body.weight).not.toEqual(newAnimal.weight)
                })
        });

        it('should return a status of 400 if input id is not found', async () => {
            const user = createUser(Role.Admin);
            let jwtToken = await app.get<AuthService>(AuthService).signUp(plainToInstance(SignUpDto, user));
            const bearerToken = `Bearer ${jwtToken}`;

            return request(app.getHttpServer())
                .put('/api/v1/animals/inexistentId')
                .set('Authorization', bearerToken)
                .send({})
                .expect(404)
        });
    });
    
    describe('deleteById', () => {
        it('should return a status of 404 if input id is not found', async () => {
            const user = createUser(Role.Admin);
            let jwtToken = await app.get<AuthService>(AuthService).signUp(plainToInstance(SignUpDto, user));
            const bearerToken = `Bearer ${jwtToken}`;

            return request(app.getHttpServer())
                .delete('/api/v1/animals/inexistentId')
                .set('Authorization', bearerToken)
                .expect(404)
        })
    })
});

function createUser(role: Role) {
    return {
        username: randomUUID().slice(0, 21),
        password: 'password',
        role: role
    };
};

function createDefaultAnimal(owner?: string) {
    return {
        name: 'name',
        owner: owner? owner : 'test',
        type: 'type',
        species: 'species',
        age: 1,
        gender: Gender.Male,
        weight: 1,
        verse: 'verse'
    };
}