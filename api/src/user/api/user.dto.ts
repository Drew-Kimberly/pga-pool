import { User } from '../lib/user.entity';

export class UserDto {
  id: string;
  name: string;
  nickname: string | null;
  email: string | null;

  static fromEntity(user: User): UserDto {
    const dto = new UserDto();

    dto.id = user.id;
    dto.name = user.name;
    dto.nickname = user.nickname;
    dto.email = user.email;

    return dto;
  }
}
