import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAnimalDto } from '../../animal/dto/create-animal.dto';
import { UpdateAnimalDto } from '../../animal/dto/update-animal.dto';
import { IAnimal, IAnimalPage } from '../../animal/interfaces/animal.interface';
import { AnimalDocument } from '../../animal/schemas/animal.schema';

@Injectable()
export class AnimalDaoService {
  private readonly logger: Logger = new Logger(AnimalDaoService.name);
  private readonly listQueryLimit = parseInt(process.env.LIST_QUERY_LIMIT);

  constructor(
    @InjectModel('Animal') private animalModel: Model<IAnimal>
  ) {} 

  async getFirstPage(username: string): Promise<IAnimalPage> {
    this.logger.log('getFirstPage');
    try {
      const currentPage: IAnimal[] = await this.animalModel.find<AnimalDocument>({owner: username}).sort({_id: -1}).limit(this.listQueryLimit).exec();
      if (currentPage.length === this.listQueryLimit) {
        currentPage.pop();
        const nextPageCursor = currentPage[this.listQueryLimit-2]['_id']
        this.logger.log(`getFirstPage - OK - Next page available with cursor = ${nextPageCursor} - END`);
        return new IAnimalPage(currentPage, nextPageCursor);
      } else {
        this.logger.log(`getFirstPage - OK - No more pages - END`);
        return new IAnimalPage(currentPage, null);
      }
    } catch (error) {
      this.logger.error(`getFirstPage - Error - Type: ${error.name} - Message: ${error.message}`)
      throw new InternalServerErrorException(`Animal list error - Error message: ${error.message}`);
    }
  }

  async getNextPage(username: string, cursor: string): Promise<IAnimalPage> {
    this.logger.log(`getNextPage - cursor = ${cursor}`);
    try {
      const currentPage: IAnimal[] = await this.animalModel.find<AnimalDocument>({_id: {$lt: cursor}, owner: username}).sort({_id: -1}).limit(this.listQueryLimit).exec(); 
      if (currentPage.length === this.listQueryLimit) {
        currentPage.pop();
        const nextPageCursor = currentPage[this.listQueryLimit-2]['_id']
        this.logger.log(`getNextPage - OK - Next available with cursor = ${nextPageCursor} - END`);
        return new IAnimalPage(currentPage, nextPageCursor);
      } else {
        this.logger.log('getNextPage - OK - No more pages - END');
        return new IAnimalPage(currentPage, null);
      }
    } catch (error) {
      this.logger.error(`getNextPage - Error - Type: ${error.name} - Message: ${error.message}`)
      throw new InternalServerErrorException(`Animal list error - Error message: ${error.message}`);
    }
  }

  async getById(id: string, username: string): Promise<IAnimal> {
    this.logger.log(`getById - id = ${id}`);
    try {
      const queryResponse = await this.animalModel.findOne<AnimalDocument>({id: id, owner: username}).exec();
      queryResponse? this.logger.log('getById - OK - END') : this.logger.warn(`getById - No resource found for id = ${id} and username = ${username}`)
      return queryResponse;
    } catch (error) {
      this.logger.error(`getById - Error - Type: ${error.name} - Message: ${error.message}`)
      throw new InternalServerErrorException(`Animal getById error - Error message: ${error.message}`)
    }
  }

    async create(createAnimalDto: CreateAnimalDto): Promise<IAnimal> {
      this.logger.log(`create - createDto = ${JSON.stringify(createAnimalDto)}`);
      const newAnimal = new this.animalModel(createAnimalDto);
      try {
        const queryResponse = await newAnimal.save();
        this.logger.log('create - OK - END');
        return queryResponse;
      } catch (error) {
        this.logger.error(`create - Error - Type: ${error.name} - Message: ${error.message}`)
        throw new InternalServerErrorException(`Animal create error - Error message: ${error.message}`)
      }
    }

    async updateById(id: string, updateAnimalDto: UpdateAnimalDto, username: string): Promise<IAnimal> {
      this.logger.log(`updateById - id = ${id} - updateDto = ${JSON.stringify(updateAnimalDto)}`);
      try {
        const queryResponse = await this.animalModel.findOneAndUpdate({id: id, owner: username}, updateAnimalDto, {returnOriginal: false}).exec();
        queryResponse? this.logger.log('updateById - OK - END') : this.logger.error(`updateById - Error - No resource found for id = ${id} and username = ${username}`)
        return queryResponse;
      } catch (error) {
        this.logger.error(`updateById - Error - Type: ${error.name} - Message: ${error.message}`)
        throw new InternalServerErrorException(`Animal updateById error - Error message: ${error.message}`)
      }
    }

    async deleteById(id: string, username: string): Promise<IAnimal> {
      this.logger.log(`deleteById - id = ${id}`);
      try {
        const queryResponse = await this.animalModel.findOneAndDelete<AnimalDocument>({id: id, owner: username}).exec();
        queryResponse? this.logger.log('deleteById - OK - END') : this.logger.error(`deleteById - Error - No resource found for id = ${id} and username = ${username}`)
        return queryResponse;
      } catch (error) {
        this.logger.error(`deleteById - Error - Type: ${error.name} - Message: ${error.message}`)
        throw new InternalServerErrorException(`Animal deleteById error - Error message: ${error.message}`)
      }
    }
}