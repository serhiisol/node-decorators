import { ApiParameter } from '@server/swagger';
import { IsString } from 'class-validator';

export class Message {
  @IsString()
  @ApiParameter({ description: 'Message text' })
  message: string;
}
