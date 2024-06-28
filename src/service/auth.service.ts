import { PrismaService } from "src/prisma.service";
import { Injectable } from "@nestjs/common";
import * as fs from 'fs';
import * as path from 'path';
import { User, Prisma } from "@prisma/client";
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService, private jwtService: JwtService) {}

    async getAllUser(): Promise<any[]> { 
        return this.prisma.user.findMany({
            select: {
              id: true,
              fullname: true,
              username: true,
              img: true
            }
          });
    }

   
    async getUsername(username: string): Promise<any> {
        return this.prisma.user.findFirst({
          where: { username: username },
        });
      }

 
    

    async getUser(id: number): Promise<any> { 
        return this.prisma.user.findUnique({
            select: {
              id: true,
              fullname: true,
              username: true,
              img: true
            },
            where: { id: Number(id) },
          });
    }


    async createUser(data: User): Promise<any> {
        const hashedPassword: string = await bcrypt.hash(data.password, 10); 
        const createUser: User = await this.prisma.user.create({
          data: {
            ...data,
            password: hashedPassword, 
          },
        });
        const accessToken = this.jwtService.sign({ userId: createUser.id, username: createUser.username });
        return { data: createUser, accessToken };
    }

    
  
    async validateUser(username: string, password:string): Promise<any>{
        const user = await this.prisma.user.findFirst({
            where: { username: username },
        });

        if(user && await bcrypt.compare(password, user.password)){
            const {...result} = user;
            return result;
        }

        return null;
    }
    
    async login(user:any): Promise<any> {
        const payload = {username: user.username, sub: user.id};
        const accesstoken = this.jwtService.sign(payload);
        user.accesstoken = accesstoken;
        return {
            user: user,
        };
    }
    

    async updateUser(id: number, data: Prisma.UserUpdateInput): Promise<User> {
        return this.prisma.user.update({
            where: { id: Number(id) },
            data: {
                fullname: data.fullname,
                username: data.username,
            },
        });
    }
   
    async deleteUser(id: number): Promise<User> {
       
        return this.prisma.user.delete({
            where: { id: Number(id) },
        });
    }
}
