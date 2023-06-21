import { OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { RoomService } from './room.service';
import { Logger } from '@nestjs/common';
import { Server , Socket} from 'socket.io';
import { JoinroomDto } from './dtos/joinroom.dto';
import { UpdateUserPositonDto } from './dtos/updateposition.dto';
import { ToglMuteDto } from './dtos/toglMute.dto';


type ActiveSocketType = {
  room: string;
  id: string;
  userId: string;
}
@WebSocketGateway({ cors: true })
export class RoomGateway implements OnGatewayInit, OnGatewayDisconnect { 

  constructor(private readonly service:RoomService){}
   @WebSocketServer() wss: Server;
    
  private logger = new Logger(RoomGateway.name);
  private activeSockets :ActiveSocketType [] = [];

    async handleDisconnect(client: any){ 
      const existingOnSocket = this.activeSockets.find(
        socket => socket.id === client.id
    );

    if(!existingOnSocket) return;

    this.activeSockets = this.activeSockets.filter(
      socket => socket.id !== client.id
  );
  await this.service.deleteUsersPosition(client.id);
  client.broadcast.emit(`${existingOnSocket.room}-remove-user`, {socketId: client.id});

    this.logger.debug(`Client: ${client.id} disconnected`);
   } 

    afterInit(server: any){ 
        this.logger.log('Gateway initialized');
      } 

  @SubscribeMessage('join')
  async handleJoin (client: Socket, payload : JoinroomDto){
     const {link, userId} = payload;
     const existingOnSocket = this.activeSockets.find(
      socket => socket.room === link && socket.id === client.id);
      if (!existingOnSocket){
        this.activeSockets.push({room:link, id: client.id, userId});
        const dto = {
          link,
          userId,
          x:1,
          y:1,
          orientation: 'front'
        } as UpdateUserPositonDto
        await this.service.UpdateUserPositon(client.id, dto);
      }
        const users = await this.service.listUsersPositionByLink(link);
        this.wss.emit(`${link}-update-user-link`, {users});

        if (!existingOnSocket) {
          client.broadcast.emit(`${link}-add-user`, { user: client.id });
        }
     
        this.logger.debug(`Socket client: ${client.id} start to join room ${link}`);
}
  


  @SubscribeMessage('move')
  async handleMove (client: Socket, payload: UpdateUserPositonDto){
  const {link, userId , x, y , orientation} = payload;
  const dto = {
    link,
    userId,
    x,
    y,
    orientation
  } as UpdateUserPositonDto
  await this.service.UpdateUserPositon(client.id, dto);
  const users = await this.service.listUsersPositionByLink(link);
  this.wss.emit(`${link}-update-user-link`, {users});
}

@SubscribeMessage('toggl-mute-user')
async handleToglMute (_:Socket,payload: ToglMuteDto){
const {link} = payload;
await this.service.updateUserMute(payload);
const users = await this.service.listUsersPositionByLink(link);
this.wss.emit(`${link}-update-user-link`, {users});
}
}



  

