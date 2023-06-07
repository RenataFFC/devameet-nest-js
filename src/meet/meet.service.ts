import { Injectable, Logger } from '@nestjs/common'; 
import { Meet, MeetDocument } from './schemas/meet.schema'; 
import { Model } from 'mongoose'; 
import { InjectModel } from '@nestjs/mongoose'; 
import { CreateMeetDto } from './dtos/createmeet.dto'; 
import { UserService } from 'src/user/user.service'; 


@Injectable() 
export class MeetService { 
private logger = new Logger(MeetService.name); 

constructor( 
@InjectModel(Meet.name) private model: Model<MeetDocument>, 
private readonly userService : UserService) { } 

async getMeetsByUser(userId: string) { 
this.logger.debug('getMeetsByUser - start'); 
return await this.model.find({ user: userId }); 
} 

async create(userId: string, dto: CreateMeetDto) { 
this.logger.debug('create - start'); 

const user = await this.userService.getUserById(userId); 
const payload = { 
...dto, 
user, 
 	    link : generateLink() 
}; 
this.logger.debug('create - payload before save', payload); 

const createdUser = new this.model(payload); 
return createdUser.save(); 
} 
async delete(userId: string, meetId: string) { 
this.logger.debug('delete - start'); 
return await this.model.deleteOne({ user: userId, _id: meetId }); 
} 
}