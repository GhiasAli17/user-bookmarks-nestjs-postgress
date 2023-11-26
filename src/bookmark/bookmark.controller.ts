import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { BookmarkService } from './bookmark.service';
import { GetUser } from 'src/auth/decorator';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Bookmarks")
@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {

    constructor(private bookmarkService:BookmarkService){

    }

    @Post()
    createBookmark(@GetUser('id') userId:number,@Body() dto:CreateBookmarkDto){
       return this.bookmarkService.createBookmark(userId,dto)
    }

    @Get()
    getBookmarks(@GetUser('id') userId:number){
       return this.bookmarkService.getBookmarks(userId)
    }

    @Get(":id")
    getBookmarkById(@GetUser('id',ParseIntPipe) userId:number,@Param('id', ParseIntPipe) bookmarkId:number){
       return this.bookmarkService.getBookmarkById(userId,bookmarkId)
    }

    @Patch(":id")
    editBookmarkById(@GetUser('id') userId:number,
    @Param('id',ParseIntPipe) bookmarkId:number,
    @Body() dto:EditBookmarkDto){
      return this.bookmarkService.editBookmarkById(userId,bookmarkId,dto)
    }

    @Delete(":id")
    deleteBookmarkById(@GetUser('id',ParseIntPipe) userId:number,@Param('id') bookmarkId:number){
       return this.bookmarkService.deleteBookmarkById(userId,bookmarkId)
    }
}
