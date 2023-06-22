import { IsBoolean} from "class-validator";
import { JoinroomDto } from "./joinroom.dto";
import { RoomMessagesherper } from "../helpers/roommessages.helper";

export class ToglMuteDto extends JoinroomDto{
   @IsBoolean({message: RoomMessagesherper.MUTE_NOT_VALID})
    muted:boolean;
}