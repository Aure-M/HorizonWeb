import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import type { PaginationOptions } from '../shared/modules/pagination/pagination-option.interface';
import type { PaginatedResult } from '../shared/modules/pagination/pagination.interface';
import type { User } from '../users/user.entity';
import { BadgeUnlock } from './badge-unlock.entity';
import { Badge } from './badge.entity';
import type { CreateBadgeDto } from './dto/create-badge.dto';
import type { UpdateBadgeDto } from './dto/update-badge.dto';

@Injectable()
export class BadgesService {
  constructor(
    @InjectRepository(Badge) private readonly badgeRepository: BaseRepository<Badge>,
    @InjectRepository(BadgeUnlock) private readonly badgeUnlockRepository: BaseRepository<BadgeUnlock>,
  ) {}

  public async create(createBadgeDto: CreateBadgeDto): Promise<Badge> {
    const badge = new Badge(createBadgeDto);
    await this.badgeRepository.persistAndFlush(badge);

    return badge;
  }

  public async findAll(paginationOptions?: PaginationOptions): Promise<PaginatedResult<Badge>> {
    return await this.badgeRepository.findWithPagination(paginationOptions);
  }

  public async findOne(badgeId: number): Promise<Badge> {
    return await this.badgeRepository.findOneOrFail({ badgeId });
  }

  public async update(badgeId: number, updateBadgeDto: UpdateBadgeDto): Promise<Badge> {
    const badge = await this.badgeRepository.findOneOrFail({ badgeId });

    wrap(badge).assign(updateBadgeDto);
    await this.badgeRepository.flush();
    return badge;
  }

  public async remove(badgeId: number): Promise<void> {
    const badge = await this.badgeRepository.findOneOrFail({ badgeId });
    await this.badgeRepository.removeAndFlush(badge);
  }

  public async unlockForUser(badgeId: number, user: User): Promise<BadgeUnlock> {
    const badge = await this.badgeRepository.findOneOrFail({ badgeId });
    const badgeUnlock = new BadgeUnlock({ badge, user });
    await this.badgeUnlockRepository.persistAndFlush(badgeUnlock);
    return badgeUnlock;
  }

  public async findAllForUser(
    userId: string,
    paginationOptions?: PaginationOptions,
  ): Promise<PaginatedResult<BadgeUnlock>> {
    return await this.badgeUnlockRepository.findWithPagination(
      paginationOptions,
      { user: { userId } },
      { populate: ['badge', 'user'] },
    );
  }
}
