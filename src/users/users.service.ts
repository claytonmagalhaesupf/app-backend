import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDTO } from 'src/dtos/create-user-dto';
import { GetUserDTO } from 'src/dtos/get-user-dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /* async createUser(dto: CreateUserDTO): Promise<void> {
    await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
      },
    });
  }*/

  async createUser(dto: CreateUserDTO) {
    //remove Promise<void> to return the created user
    const passwordHash = await bcrypt.hash(dto.passwordHash, 10);
    return await this.prisma.user.create({
      //add return to return the created user
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash: passwordHash,
      },
    });
  }

  //material 2

  /*async getAllUsers(): Promise<CreateUserDTO[]> {
    const users = await this.prisma.user.findMany();
    return users;
  }
*/
  async getAllUsers(): Promise<GetUserDTO[]> {
    return this.prisma.user.findMany({
      select: { id: true, name: true, email: true, createdAt: true },
      orderBy: { name: 'asc' },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async updateUser(id: number, dto: CreateUserDTO): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: {
        name: dto.name ?? '',
        email: dto.email ?? '',
      },
    });
  }

  async deleteUser(id: number): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
