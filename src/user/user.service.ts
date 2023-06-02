import {Model} from 'mongoose';
import{Injectable} from '@nestjs/common';
import{InjectModel} from '@nestjs/mongoose';
import {RegisterDto} from './dtos/register.dto';
import{User,UserDocument} from './schemas/user.schemas';
import * as CryptoJS from 'crypto-js';


@Injectable()
export class UserService{
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>){}

    async create(dto: RegisterDto){
        dto.password = CryptoJS.AES.encrypt(dto.password, process.env.USER_CYPHER_SECRET_KEY).toString();

        const createUser = new this.userModel(dto);
        return createUser.save();
      }
      async existsByEmail(email:string):Promise<boolean>{
        const result = await this.userModel.find({email});
        if(result&&result.length>0){
                 return true;
        }
        return false;
      }


}