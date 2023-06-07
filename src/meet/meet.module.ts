import { Module } from '@nestjs/common';
import { MeetService } from './meet.service';
import { MeetController } from './meet.controller';

@Module({
  providers: [MeetService],
  controllers: [MeetController]
})
export class MeetModule {}
