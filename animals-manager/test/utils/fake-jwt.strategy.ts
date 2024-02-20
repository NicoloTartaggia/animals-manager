import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../../src/auth/schemas/user.schema";

export class FakeJwtStrategy extends PassportStrategy(Strategy) {
    constructor(jwtSecret: string) {
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwtSecret
      });
    }
  
    async validate(user: User) {
      return user;
    }
}