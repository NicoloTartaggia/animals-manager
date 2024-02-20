import { Module } from '@nestjs/common';
import { AnimalsController } from './animal.controller';
import { AnimalService } from './animal.service';
import { AnimalDaoModule } from '../dao/animal-dao/animal-dao.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AnimalDaoModule, AuthModule],
  controllers: [AnimalsController],
  providers: [AnimalService],
})
export class AnimalModule {}
