import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsNotEmpty, IsPositive, IsString, MaxLength } from "class-validator";

export enum Gender {
  Male = "Male",
  Female = "Female"
}

export class CreateAnimalDto {
  id: string;
  owner: string;

  @ApiProperty({
    required: true,
    maxLength: 30
  })
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    required: true,
    maxLength: 20
  })
  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  readonly type: string;

  @ApiProperty({
    required: true,
    maxLength: 20
  })
  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  readonly species: string;

  @ApiProperty({
    required: true,
    minimum: 1
  })
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  readonly age: number;

  @ApiProperty({
    example: 'Male|Female',
    required: true
  })
  @IsEnum(Gender, {message: `Accepted values for gender are: [${Object.values(Gender)}]`})
  readonly gender: Gender;
  
  @ApiProperty({
    required: true,
    minimum: 1
  })
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  readonly weight: number;

  @ApiProperty({
    required: true,
    maxLength: 30
  })
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly verse: string;
}