import { IsNotEmpty } from "class-validator";
import { RoomMessagesherper } from "../helpers/roommessages.helper";



export class JoinroomDto{
   @IsNotEmpty({message: RoomMessagesherper.JOIN_USER_NOT_VALID})
   userId:string;

   @IsNotEmpty({message: RoomMessagesherper.JOIN_LINK_NOT_VALID})
   link:string;
}