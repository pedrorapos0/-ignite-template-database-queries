import { getRepository, Repository } from "typeorm";

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from "../../dtos";
import { User } from "../../entities/User";
import { IUsersRepository } from "../IUsersRepository";

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    // Complete usando ORM
    const user = await this.repository.findOne(user_id, {
      relations: ["games"],
    });
    if (!user) {
      throw new Error("User not exist!");
    }
    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    // Complete usando raw query
    return this.repository.query("SELECT * FROM users order by first_name");
  }

  async findUserByFullName({
    // Complete usando raw query
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    
    return  await this.repository.query(
      "select first_name, last_name, email, created_at, updated_at from (select u.id , u.first_name, u.last_name, lower(u.first_name) as first_name_lower, lower(u.last_name) as last_name_lower, u.email ,u.created_at , u.updated_at from users u) as users where users.first_name_lower=$1 and last_name_lower=$2",
      [first_name.toLowerCase(),last_name.toLowerCase()]
    );
 
  }
}
