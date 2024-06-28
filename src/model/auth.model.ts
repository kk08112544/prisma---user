import { Prisma } from "@prisma/client";

export class User implements Prisma.UserCreateInput{
    id: number
    fullname: string;
    username: string;
    password: string;
    img: string
}
