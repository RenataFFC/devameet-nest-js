import { IsNumber, IsString, Max, Min, } from "class-validator";
import { JoinroomDto } from "./joinroom.dto";
import { MeetMessagesHelper } from "src/meet/helpers/meetmessages.helper";

export class UpdateUserPositonDto extends JoinroomDto{
    @IsNumber({}, {message:MeetMessagesHelper.UPDATE_XY_NOT_VALID})
    @Min(0,{message:MeetMessagesHelper.UPDATE_XY_NOT_VALID})
    @Max(8,{message:MeetMessagesHelper.UPDATE_XY_NOT_VALID})
    x: number;
    @IsNumber({}, {message:MeetMessagesHelper.UPDATE_XY_NOT_VALID})
    @Min(0,{message:MeetMessagesHelper.UPDATE_XY_NOT_VALID})
    @Max(8,{message:MeetMessagesHelper.UPDATE_XY_NOT_VALID})
    y: number;

    @IsString({message:MeetMessagesHelper.UPDATE_ORIENTATION_NOT_VALID})
    orientation:string;
}