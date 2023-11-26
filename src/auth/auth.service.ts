import { ForbiddenException, HttpCode, HttpStatus, Injectable } from "@nestjs/common";

import { AuthDto } from "./dto";
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Prisma } from "@prisma/client";
import {JwtService} from '@nestjs/jwt'
import {ConfigService} from '@nestjs/config'
import { PrismaService } from "src/prisma/prisma.service";
@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService, private jwt: JwtService, private config:ConfigService){

    }

   async signup(dto:AuthDto){
    try{
       const hash = await argon.hash(dto.password);

       const user = await this.prisma.user.create({
        data:{
            email:dto.email,
            hash
        }
       })

       return this.signToken(user.id,user.email);

    }
    catch(error){
        if(error instanceof PrismaClientKnownRequestError){
            if(error.code === 'P2002'){
                // above code shows duplicate exception 
                throw new ForbiddenException('Credentials Taken')
            }
        }
        throw error;
    }
    }
     @HttpCode(HttpStatus.OK)
    async signin(dto:AuthDto){
       
        // const user =  await this.prisma.user.findUnique({
        //     where:{
        //         email:dto.email,
        //     },
        // })
        const user = await this.prisma.user.findUnique({
            where: {
              email: dto.email,
            } as Prisma.UserWhereUniqueInput,
          });

        if(!user){
            throw new ForbiddenException("Incorrect Credentials")
        }  

        const pwMatches =  await argon.verify(user.hash,dto.password)
        if(!pwMatches){
            throw new ForbiddenException("Incorrect Credentials")
        }


        return this.signToken(user.id,user.email);
    }

    async signToken(userId:number, email:string):Promise<{access_token:string}>{
       const payload = {
        sub: userId,
        email
       }

       const secret = this.config.get("JWT_SECRET")

       const token = await this.jwt.signAsync(payload, {
        expiresIn:'15m',
        secret
       })

       return {
        access_token:token
       }
    }
}