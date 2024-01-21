import {
    Allow,
    IsBoolean,
    IsDate,
    IsEmail,
    IsEmpty,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateUserRequest {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class ReadUserRequest {
    @IsString()
    @IsOptional()
    id: string;

    @IsString()
    @IsOptional()
    username: string;
}

export class UpdateUserQuery {
    @IsString()
    @IsNotEmpty()
    id: string;
}

export class UpdateUserBody {
    @IsString()
    @IsOptional()
    username?: string;

    @IsString()
    @IsOptional()
    profileImage?: string;

    @IsString()
    @IsOptional()
    bio?: string;

    @IsBoolean()
    @IsOptional()
    darkmode?: boolean;

    @IsString()
    @IsOptional()
    locale?: string;

    @IsBoolean()
    @IsOptional()
    expired?: boolean;
}
