import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Gender } from '../dto/create-animal.dto';

export type AnimalDocument = HydratedDocument<Animal>;

@Schema({
  timestamps: true
})
export class Animal {
  @Prop()
  id: string;

  @Prop()
  owner: string;

  @Prop()
  name: string;

  @Prop()
  type: string;

  @Prop()
  species: string;

  @Prop()
  age: number;

  @Prop({type: String, enum: Gender})
  gender: string;

  @Prop()
  weight: number;

  @Prop()
  verse: string;
}

export const AnimalSchema = SchemaFactory.createForClass(Animal);