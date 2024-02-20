import { PartialType, PickType } from '@nestjs/swagger';
import { CreateAnimalDto } from './create-animal.dto';

export class UpdateAnimalDto extends PartialType(PickType(CreateAnimalDto, ['weight', 'age'] as const)) {}