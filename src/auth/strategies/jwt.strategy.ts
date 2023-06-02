import { Injectable } from '@nestjs/common';
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy} from 'passport-jwt';



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
  constructor(){
     super({
        jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration:true,
        secretOrkey: process.env.USER_JWT_SECRET_KEY,
     });
  }

  async validate(payload:any){
    return {userId:payload.sub, email:payload.email};
  } 

}