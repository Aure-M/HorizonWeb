import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Action, CheckPolicies } from '../shared/modules/authorization';
import { PaginateDto } from '../shared/modules/pagination/paginate.dto';
import type { PaginatedResult } from '../shared/modules/pagination/pagination.interface';
import type { BadgeUnlock } from './badge-unlock.entity';
import { Badge } from './badge.entity';
import { BadgesService } from './badges.service';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';

@ApiTags('Badges')
@Controller({ path: 'badges' })
export class BadgesController {
  constructor(
    private readonly badgesService: BadgesService,
  ) {}

  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, Badge))
  public async create(@Body() createTagDto: CreateBadgeDto): Promise<Badge> {
    return await this.badgesService.create(createTagDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, Badge))
  public async findAll(@Query() query: PaginateDto): Promise<PaginatedResult<Badge>> {
    if (query.page)
      return await this.badgesService.findAll({ page: query.page, itemsPerPage: query.itemsPerPage ?? 10 });
    return await this.badgesService.findAll();
  }

  @Get('/user/:userId')
  @CheckPolicies(ability => ability.can(Action.Read, Badge))
  public async findAllForUser(
    @Param('userId') userId: string,
    @Query() query: PaginateDto,
  ): Promise<PaginatedResult<BadgeUnlock>> {
    if (query.page) {
      const options = { page: query.page, itemsPerPage: query.itemsPerPage ?? 10 };
      return await this.badgesService.findAllForUser(userId, options);
    }
    return await this.badgesService.findAllForUser(userId);
  }

  @Get(':badgeId')
  @CheckPolicies(ability => ability.can(Action.Read, Badge))
  public async findOne(@Param('badgeId', ParseIntPipe) badgeId: number): Promise<Badge> {
    return await this.badgesService.findOne(badgeId);
  }

  @Patch(':badgeId')
  @CheckPolicies(ability => ability.can(Action.Update, Badge))
  public async update(@Param('badgeId', ParseIntPipe) badgeId: number, @Body() updateBadgeDto: UpdateBadgeDto): Promise<Badge> {
    return await this.badgesService.update(badgeId, updateBadgeDto);
  }

  @Delete(':badgeId')
  @CheckPolicies(ability => ability.can(Action.Delete, Badge))
  public async remove(@Param('badgeId', ParseIntPipe) badgeId: number): Promise<void> {
    await this.badgesService.remove(badgeId);
  }
}
