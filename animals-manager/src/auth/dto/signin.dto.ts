import { SignUpDto } from "./signup.dto";
import { PartialType, PickType } from "@nestjs/swagger"

export class SignInDto extends PartialType(PickType(SignUpDto, ['username', 'password'] as const)) {}