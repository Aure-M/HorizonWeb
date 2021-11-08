import { EntityRepository, UniqueConstraintViolationException, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { CreateTagDto } from './dto/create-tag.dto';
import type { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: EntityRepository<Tag>,
  ) {}

  public async create(createTagDto: CreateTagDto): Promise<Tag> {
    const tag = new Tag(createTagDto);
    try {
      await this.tagRepository.persistAndFlush(tag);
    } catch (error: unknown) {
      if (error instanceof UniqueConstraintViolationException)
        throw new BadRequestException('Tag name already exists');
      throw error;
    }
    return tag;
  }

  public async findAll(): Promise<Tag[]> {
    return await this.tagRepository.findAll();
  }

  public async findOne(name: string): Promise<Tag> {
    const tag = await this.tagRepository.findOne({ name });
    if (!tag)
      throw new NotFoundException('Tag not found');
    return tag;
  }

  public async update(name: string, updateTagDto: UpdateTagDto): Promise<Tag> {
    const tag = await this.tagRepository.findOne({ name });
    if (!tag)
      throw new NotFoundException('Tag not found');
    wrap(tag).assign(updateTagDto);
    await this.tagRepository.flush();
    return tag;
  }

  public async remove(name: string): Promise<void> {
    const tag = await this.tagRepository.findOne({ name });
    if (!tag)
      throw new NotFoundException('Tag not found');

    await this.tagRepository.removeAndFlush(tag);
  }
}
