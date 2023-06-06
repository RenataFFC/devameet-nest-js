import { Controller, Get , HttpCode, HttpStatus, Request , Put , Body} from "@nestjs/common";
import { UserService } from 'src/user/user.service';
import { UpdateUserDto } from './dtos/updateuser.dto';


@Controller('user')
export class UserController{
   constructor(private readonly UserService:UserService){}

   @Get()
   async getUser(@Request() req){
     const {userId} = req?.user;
     const result = await this.UserService.getUserById(userId);

     return {
      name:result.name,
      email:result.email,
      avatar:result.avatar,
      id:result._id.toString()
     };
   }

   @Put()
   @HttpCode(HttpStatus.OK)
   async updateUser(@Request() req, @Body() dto:UpdateUserDto){
       const {userId} = req?.user;
       await this.UserService.updateUser(userId,dto)
   }}