import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}

    @Post('signup')
    @ApiResponse({ status: 200, description: 'User information has been saved and user is successfully authenticated.'})
    @ApiResponse({ status: 400, description: 'Invalid request body.'})
    @ApiResponse({ status: 500, description: 'User information could not be saved.'})
    @ApiBody({
       type: SignUpDto,
       description: 'Json structure for user sign up object',
    })
    async signUp(@Body() signUpDto: SignUpDto, @Res() response): Promise<string> {
        try {
            const signUpResponse = await this.authService.signUp(signUpDto);
            return response.status(HttpStatus.OK).json(signUpResponse);
        } catch (error) {
            throw error;
        }
    }

    @ApiResponse({ status: 200, description: 'User is successfully authenticated.'})
    @ApiResponse({ status: 400, description: 'Invalid request body.'})
    @ApiResponse({ status: 401, description: 'Invalid user credentials.'})
    @ApiResponse({ status: 404, description: 'User does not exist.'})
    @ApiResponse({ status: 500, description: 'User information could not be retrieved.'})
    @ApiBody({
       type: SignInDto,
       description: 'Json structure for user sign in object',
    })
    @Post('signin')
    async signIn(@Body() signInDto: SignInDto, @Res() response): Promise<string> {
        try {
            const signInResponse = await this.authService.signIn(signInDto);
            return response.status(HttpStatus.OK).json(signInResponse);
        } catch (error) {
            throw error;
        }
    }
}
