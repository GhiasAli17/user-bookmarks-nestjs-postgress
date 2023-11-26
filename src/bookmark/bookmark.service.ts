import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookmarkService {

    constructor(private prismaService:PrismaService){

    }

    async createBookmark(userId:number, dto:CreateBookmarkDto){

        const bookmark = this.prismaService.bookmark.create({
          data:{
            userId,
            ...dto
          }
        })

        return bookmark;
    }

    async getBookmarks(userId:number){
      return this.prismaService.bookmark.findMany({
        where:{
            userId
        }
       })
    }

    async getBookmarkById(userId:number, bookmarkId:number){

        return this.prismaService.bookmark.findFirst({
            where:{
                userId,
                id:bookmarkId
            }
           })
    }

    async editBookmarkById(userId:number, bookmarkId:number, dto:EditBookmarkDto){

        const bookmark = await this.prismaService.bookmark.findUnique({
            where:{
                id:bookmarkId
            },
        
        })

        if(!bookmark || bookmark.userId !== userId){
            throw new ForbiddenException("Access resouce denied")
        }

        return this.prismaService.bookmark.update({
            where:{
                id:bookmarkId
            },
            data:{
                ...dto
            }
        })

    }

    async deleteBookmarkById(userId:number, bookmarkId:number){

        const bookmark = await this.prismaService.bookmark.findUnique({
            where:{
                id:bookmarkId
            },
        
        })

        if(!bookmark || bookmark.userId !== userId){
            throw new ForbiddenException("Access resouce denied")
        }

        await this.prismaService.bookmark.delete({
            where:{
                id:bookmarkId
            }
        })

    }
}
