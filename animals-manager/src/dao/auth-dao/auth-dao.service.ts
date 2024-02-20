import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IUser } from "../../auth/interfaces/user.interface";
import { UserDocument } from "../../auth/schemas/user.schema";
import { SignUpDto } from "src/auth/dto/signup.dto";

@Injectable()
export class AuthDaoService {
  private readonly logger: Logger = new Logger(AuthDaoService.name);

  constructor(
    @InjectModel('User') private userModel: Model<IUser>
  ) {}

  async signUp(username: string, hashedPassword: string, role: string): Promise<IUser> {
    this.logger.log(`signUp - username = ${username}`)
    const newUser = new this.userModel({
      username: username, 
      password: hashedPassword,
      role: role
    });
    try {
      const queryResponse = await newUser.save();
      this.logger.log('signUp - OK - END');
      return queryResponse;
    } catch (error) {
      this.logger.error(`signUp - Error - Type: ${error.name} - Message: ${error.message}`)
      throw new InternalServerErrorException(`User signUp error - Error message: ${error.message}`)
    }
  }

  async getUser(username: string): Promise<IUser> {
    this.logger.log(`getUser - username = ${username}`);
    try {
      const queryResponse = await this.userModel.findOne<UserDocument>({'username': username}).exec();
      queryResponse? this.logger.log('getUser - OK - END') : this.logger.error(`getUser - No resource found for username = ${username}`)
      return queryResponse;
    } catch (error) {
      this.logger.error(`getUser - Error - Type: ${error.name} - Message: ${error.message}`)
      throw new InternalServerErrorException(`User getUser error - Error message: ${error.message}`)
    } 
  }
}