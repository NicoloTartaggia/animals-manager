import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IAnimal, IAnimalPage } from './interfaces/animal.interface';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { AnimalDaoService } from '../dao/animal-dao/animal-dao.service';
import { randomUUID } from 'crypto';

@Injectable()
export class AnimalService {
  @Inject(AnimalDaoService) private readonly animalDao: AnimalDaoService;
  private readonly logger: Logger = new Logger(AnimalService.name);

  async list(cursor: string, username: string): Promise<IAnimalPage> {
    if (cursor) {
      this.logger.log(`list - Getting next page - cursor = ${cursor}`)
      return this.animalDao.getNextPage(username, cursor)
    } else {
      this.logger.log(`list - Getting first page`)
      return this.animalDao.getFirstPage(username);
    }
  }

  async getById(id: string, username: string): Promise<IAnimal> {
    return this.animalDao.getById(id, username);
  }

  async create(createAnimalDto: CreateAnimalDto, username: string): Promise<IAnimal> { 
    createAnimalDto.id = randomUUID();
    createAnimalDto.owner = username;
    return this.animalDao.create(createAnimalDto);
  }

  async updateById(id: string, updateAnimalDto: UpdateAnimalDto, username: string): Promise<IAnimal> {
    const updatedAnimal = await this.animalDao.updateById(id, updateAnimalDto, username);
    if (!updatedAnimal) {
      throw new NotFoundException(`Animal updateById error - resource with id ${id} not found`)
    }
    return updatedAnimal;
  }

  async deleteById(id: string, username: string): Promise<IAnimal> {
    const deletedAnimal = await this.animalDao.deleteById(id, username)
    if (!deletedAnimal) {
      throw new NotFoundException(`Animal deleteById error - resource with id ${id} not found`)
    }
    return deletedAnimal;
  }
}
