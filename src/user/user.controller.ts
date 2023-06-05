import { Controller, Get , Request } from "@nestjs/common";
import { UserService } from 'src/user/user.service';

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
}