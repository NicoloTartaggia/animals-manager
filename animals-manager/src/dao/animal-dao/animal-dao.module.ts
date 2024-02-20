import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnimalDaoService } from './animal-dao.service';
import { Animal, AnimalSchema } from '../../animal/schemas/animal.schema';

@Module({
    imports: [
        MongooseModule.forRoot(process.env.MONGODB_URL, {
            dbName: process.env.DB_NAME
        }),
        MongooseModule.forFeature([{name: Animal.name, schema: AnimalSchema}])
    ],
    providers: [AnimalDaoService],
    exports: [AnimalDaoService]
})
export class AnimalDaoModule {}
