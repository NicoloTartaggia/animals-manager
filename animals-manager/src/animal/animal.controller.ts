import { Body, Controller, Delete, ForbiddenException, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AnimalService } from './animal.service';
import { IAnimal, IAnimalPage } from './interfaces/animal.interface';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '../auth/dto/signup.dto';
import { ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Animals')
@Controller('api/v1/animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalService) {}

  validateRole(userRole: string, targetRole: Role) {
    if (Role[userRole as keyof typeof Role] > targetRole) {
      throw new ForbiddenException(`Minimum role level to perform this operation is: ${targetRole} - Current user role: ${userRole}`)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiResponse({ status: 200, description: 'Animal list has been retrieved successfully.'})
  @ApiResponse({ status: 500, description: 'Animal list could not be retrieved.'})
  @ApiQuery({
    name: 'cursor',
    description: 'cursor for getting next page',
    required: false
  })
  async list(@Req() request, @Query('cursor') nextPageCursor: string, @Res() response): Promise<IAnimalPage> {
    try {
      this.validateRole(request.user.role, Role.Reader);
      const animalPage = await this.animalsService.list(nextPageCursor, request.user.username);
      return response.status(HttpStatus.OK).json(animalPage);
    } catch (error) {
      throw error;
    } 
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Animal has been retrieved successfully.'})
  @ApiResponse({ status: 204, description: 'Operation ended successfully but the requested resource does not exist.'})
  @ApiResponse({ status: 500, description: 'Animal could not be retrieved.'})
  @ApiParam({
    name: 'id',
    description: 'id of the animal'
  })
  async getById(@Req() request, @Param('id') id: string, @Res() response): Promise<IAnimal> {
    try {
      this.validateRole(request.user.role, Role.Reader);
      const animalById = await this.animalsService.getById(id, request.user.username);
      if (!animalById) {
        return response.status(HttpStatus.NO_CONTENT).send();
      }
      return response.status(HttpStatus.OK).json(animalById);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiResponse({ status: 201, description: 'New animal has been created successfully.'})
  @ApiResponse({ status: 400, description: 'Invalid request body.'})
  @ApiResponse({ status: 403, description: 'Logged user does not have the minimum role to perform this operation.'})
  @ApiResponse({ status: 500, description: 'New animal could not be saved.'})
  @ApiBody({
      type: CreateAnimalDto,
      description: 'Json structure for user new animal object',
  })
  async create(@Req() request, @Body() createAnimalDto: CreateAnimalDto, @Res() response): Promise<IAnimal> {
    try {
      this.validateRole(request.user.role, Role.Modifier);
      const newAnimal = await this.animalsService.create(createAnimalDto, request.user.username);
      return response.status(HttpStatus.CREATED).json(newAnimal);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiResponse({ status: 200, description: 'Animal has been updated successfully.'})
  @ApiResponse({ status: 403, description: 'Logged user does not have the minimum role to perform this operation.'})
  @ApiResponse({ status: 404, description: 'Animal does not exist.'})
  @ApiResponse({ status: 500, description: 'Animal could not be updated.'})
  @ApiParam({
    name: 'id',
    description: 'id of the animal'
  })
  @ApiBody({
      type: UpdateAnimalDto,
      description: 'Json structure for user update animal object',
  })
  async updateById(@Req() request, @Param('id') id: string, @Body() updateAnimalDto: UpdateAnimalDto, @Res() response): Promise<IAnimal> {
    try {
      this.validateRole(request.user.role, Role.Modifier);
      const updatedAnimal = await this.animalsService.updateById(id, updateAnimalDto, request.user.username);
      return response.status(HttpStatus.OK).json(updatedAnimal);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Animal has been deleted successfully.'})
  @ApiResponse({ status: 403, description: 'Logged user does not have the minimum role to perform this operation.'})
  @ApiResponse({ status: 404, description: 'Animal does not exist.'})
  @ApiResponse({ status: 500, description: 'Animal could not be deleted.'})
  @ApiParam({
    name: 'id',
    description: 'id of the animal'
  })
  async deleteById(@Req() request, @Param('id') id: string, @Res() response): Promise<IAnimal> {
    try {
      this.validateRole(request.user.role, Role.Admin);
      const deletedAnimal = await this.animalsService.deleteById(id, request.user.username);
      return response.status(HttpStatus.OK).json(deletedAnimal);
    } catch (error) {
      throw error;
    }
  }
}
