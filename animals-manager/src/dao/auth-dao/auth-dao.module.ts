import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthDaoService } from './auth-dao.service';
import { User, UserSchema } from '../../auth/schemas/user.schema';

@Module({
    imports: [
        MongooseModule.forRoot(process.env.MONGODB_URL, {
            dbName: process.env.DB_NAME
        }),
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}])
    ],
    providers: [AuthDaoService],
    exports: [AuthDaoService]
})
export class AuthDaoModule {}