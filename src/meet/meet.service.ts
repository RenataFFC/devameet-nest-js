import { Injectable, Logger, BadRequestException } from '@nestjs/common'; 
import { Meet, MeetDocument } from './schemas/meet.schema'; 
import { Model } from 'mongoose'; 
import { InjectModel } from '@nestjs/mongoose'; 
import { CreateMeetDto } from './dtos/createmeet.dto'; 
import { UserService } from 'src/user/user.service'; 
import { generateLink } from './helpers/linkgenerator.helper';
import { MeetObject, MeetObjectDocument} from './schemas/meetobject.schema';
import { UpdateMeetDto } from './dtos/updatemeet.dto';
import { MeetMessagesHelper } from './helpers/meetmessages.helper';

@Injectable() 
export class MeetService { 
      private logger = new Logger(MeetService.name); 

       constructor( 
              @InjectModel(Meet.name) private  readonly model: Model<MeetDocument>, 
              @InjectModel(MeetObject.name) private  readonly objectModel: Model<MeetObjectDocument>, 
              private readonly userService : UserService
              ){} 

              async getMeetsByUser(userId: string) { 
                this.logger.debug('getMeetsByUser - ' + userId); 
                return await this.model.find({ user: userId }); 
              } 

              async createMeet(userId: string, dto: CreateMeetDto) { 
                this.logger.debug('createMeet - ' + userId); 

              const user = await this.userService.getUserById(userId); 
              const meet = { 
              ...dto, 
              user, 
              link: generateLink() 
              }; 

              const createMeet = new this.model(meet);
                 return await createMeet.save();
          } 
          
            async deleteMeetByUser(userId: string, meetId: string) { 
                this.logger.debug(`deleteMeetByUser - ${userId} - ${meetId}` );
                return await this.model.deleteOne({ user: userId, _id: meetId }); 
            } 

            async getMeetObjects(meetId: string, userId: string) { 
              this.logger.debug(`getMeetObjects - ${userId} - ${meetId}`); 
              const user = await this.userService.getUserById(userId); 
              const meet = await this.model.findOne({ user: user, _id: meetId}); 


              return await this.objectModel.find({ meet }); 
              }


             async update( meetId: string, userId: string, dto: UpdateMeetDto){
              this.logger.debug(`getMeetObjects - ${userId} - ${meetId}`); 
              const user = await this.userService.getUserById(userId); 
              const meet = await this.model.findOne({ user: user, _id: meetId});

              if(!meet){
                 throw new  BadRequestException(MeetMessagesHelper.UPDATE_MEET_NOT_FOUND);
              }

              meet.name = dto.name;
              meet.color = dto.color;
              await this.model.findByIdAndUpdate({_id: meetId}, meet);

              await this.objectModel.deleteMany({meet});

              let objectPayload;

              for (const object of dto.objects){
                objectPayload = {
                  meet,
                  ...object
                }

                await this.objectModel.create(objectPayload);
              }

             }



}