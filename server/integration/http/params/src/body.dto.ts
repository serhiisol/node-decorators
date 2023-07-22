import { IsString } from 'class-validator';

export class BodyDto {
  @IsString()
  example: string;
}
