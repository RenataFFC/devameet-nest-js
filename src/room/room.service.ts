import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {Meet, MeetDocument } from 'src/meet/schemas/meet.schema';
import { PositionDocument, Position } from './schemas/position.schema';
import { MeetObjectDocument , MeetObject} from 'src/meet/schemas/meetobject.schema';
import { UserService } from 'src/user/user.service';
import { RoomMessagesherper } from './helpers/roommessages.helper';
import { UpdateUserPositonDto } from './dtos/updateposition.dto';
import { ToglMuteDto } from './dtos/toglMute.dto';

@Injectable()
export class RoomService {
    private logger = new Logger(RoomService.name);

    constructor(
         @InjectModel(Meet.name) private readonly meetModel:Model<MeetDocument>,
         @InjectModel(MeetObject.name) private readonly objectModel:Model<MeetObjectDocument>,
         @InjectModel(Position.name) private readonly positionModel:Model<PositionDocument>,
         private readonly userService: UserService
    ){ }

    async getRoom(link: string){
    this.logger.debug(`getRoom - ${link}`);

    const meet = await this._getMeet(link);
    const objects = await this.objectModel.find({meet});
return {
    link,
    name: meet.name,
    color: meet.color,
    objects
};
    }
    async listUsersPositionByLink(link:string){
        this.logger.debug(`listUsersPositionByLink - ${link}`);

        const meet = await this._getMeet(link);
        return await this.positionModel.find({meet});
    }
    
    async deleteUsersPosition(clientId:string){
        this.logger.debug(`deleteUsersPosition - ${clientId}`);
        return await this.positionModel.deleteMany({clientId});
    }

    async UpdateUserPositon(clientId: string, dto: UpdateUserPositonDto){
        this.logger.debug(`listUsersPositionByLink - ${dto.link}`);

           const meet = await this._getMeet(dto.link);
           const user = await this.userService.getUserById(dto.userId);

           if(!user){
            throw new BadRequestException(RoomMessagesherper.JOIN_USER_NOT_VALID);
           }

           const position = {
              ...dto,
              clientId,
              user,
              meet,
              name:user.name,
              avatar:user.avatar || 'avatar_01'
           }

           const usersInRoom = await this.positionModel.find({meet});
           const loogedUserInRoom = usersInRoom.find(u =>
               u.user.toString() === user._id.toString() || u.clientId === clientId);

               if(loogedUserInRoom){
                await this.positionModel.findByIdAndUpdate({_id:loogedUserInRoom._id},position);
               }else{
                if(usersInRoom && usersInRoom.length >10){
                    throw new BadRequestException(RoomMessagesherper.ROOM_MAX_USERS);
                };
                await this.positionModel.create(position);
               }    
             }
             async updateUserMute (dto:ToglMuteDto){
                this.logger.debug(`updateUserMute - ${dto.link}-  ${dto.userId}`);

                const meet = await this._getMeet(dto.link);
                const user = await this.userService.getUserById(dto.userId);
                await this.positionModel.updateMany({user, meet}, {muted: dto.muted});
             }   
    

    async _getMeet(link: string){
        const meet = await this.meetModel.findOne({link});
       if(!meet){
        throw new BadRequestException(RoomMessagesherper.JOIN_LINK_NOT_VALID);
    }
    return meet
    }
}
