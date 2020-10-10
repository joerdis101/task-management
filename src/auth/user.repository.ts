import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;
    const user = this.create();

    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await UserRepository.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch (error) {
      if (error?.code) {
        throw new ConflictException(error.detail)
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });

    if (user && await user.validatePassword(password)) {
      return user.username;
    } else {
      return null;
    }
  }

  private static async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
