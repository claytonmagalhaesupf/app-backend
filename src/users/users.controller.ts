import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDTO } from 'src/dtos/create-user-dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @Post()
  async createUser(@Body() body: CreateUserDTO) {
    await this.service.createUser(body);
  }

  //material 2
  @Get()
  async findAll() {
    return await this.service.getAllUsers();
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateUserDTO,
  ) {
    await this.service.updateUser(id, body);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.service.deleteUser(id);
  }
}
