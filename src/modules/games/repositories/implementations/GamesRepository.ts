import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder('games').where('games.title ilike :title', { title:  `%${param}%` }).getMany();
      // Complete usando query builder
  }

  async countAllGames(): Promise<[{ count: string }]> {
    // Complete usando raw query
    return this.repository.query('select count(*) from games'); 
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    
    const game =  await this.repository.createQueryBuilder('games').innerJoinAndSelect('games.users', 'user',).where('games.id = :id', {id}).getOne();
    if( !game){
      const users: User[] = [];
      return users;
    }
    return game.users;
   
      // Complete usando query builder
  }
}
