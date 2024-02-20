import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export enum Role {
    Admin = "Admin",
    Modifier = "Modifier",
    Reader = "Reader"
}

export class SignUpDto {
    @ApiProperty({
        required: true,
        maxLength: 20
    })
    @IsString()
    @MaxLength(20)
    @IsNotEmpty()
    readonly username: string;

    @ApiProperty({
        required: true,
        minLength: 6
    })
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    readonly password: string;

    @ApiProperty({
        example: 'Admin|Modifier|Reader',
        required: true
    })
    @IsEnum(Role, {message: `Accepted values for role are: [${Object.values(Role)}]`})
    readonly role: Role;
    
}