import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../shared/lib/repositories/base.repository';
import { assertPermissions } from '../../shared/lib/utils/assertPermission';
import { Action } from '../../shared/modules/authorization';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import type { PaginationOptions } from '../../shared/modules/pagination/pagination-option.interface';
import type { PaginatedResult } from '../../shared/modules/pagination/pagination.interface';
import type { User } from '../../users/user.entity';
import { DocSeries } from '../doc-series/doc-series.entity';
import type { FileUpload } from '../file-uploads/file-upload.entity';
import type { CreateInfoDocDto } from './dto/create-info-doc.dto';
import type { UpdateInfoDocDto } from './dto/update-info-doc.dto';
import { InfoDoc } from './info-doc.entity';
import { InfoDocSearchService } from './info-docs-search.service';

@Injectable()
export class InfoDocsService {
  constructor(
    @InjectRepository(InfoDoc) private readonly infoDocRepository: BaseRepository<InfoDoc>,
    @InjectRepository(DocSeries) private readonly docSeriesRepository: BaseRepository<DocSeries>,
    private readonly infoDocSearchService: InfoDocSearchService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async create(createInfoDocDto: CreateInfoDocDto, file: FileUpload): Promise<InfoDoc> {
    const docSeries = await this.docSeriesRepository.findOne({ docSeriesId: createInfoDocDto.docSeries });
    const infoDoc = new InfoDoc({ ...createInfoDocDto, file, docSeries });
    await this.infoDocRepository.persistAndFlush(infoDoc);
    await this.infoDocSearchService.add(infoDoc);
    return infoDoc;
  }

  public async findAll(paginationOptions?: PaginationOptions): Promise<PaginatedResult<InfoDoc>> {
    // TODO: Maybe the user won't have access to all docs. There can be some restrictions
    // (i.e. "sensitive"/"deprecated" docs)
    return await this.infoDocRepository.findWithPagination(
      paginationOptions,
      {},
      { populate: ['file', 'file.user', 'docSeries'] },
    );
  }

  public async findOne(infoDocId: string): Promise<InfoDoc> {
    // TODO: Maybe the user won't have access to this doc. There can be some restrictions
    // (i.e. "sensitive"/"deprecated" docs)
    return await this.infoDocRepository.findOneOrFail(
      { infoDocId },
      { populate: ['file', 'file.user', 'docSeries'] },
    );
  }

  public async update(user: User, infoDocId: string, updateCourseDto: UpdateInfoDocDto): Promise<InfoDoc> {
    const infoDoc = await this.infoDocRepository.findOneOrFail(
      { infoDocId },
      { populate: ['file', 'file.user', 'docSeries'] },
    );

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Update, infoDoc);

    const docSeries = await this.docSeriesRepository.findOneOrFail({ docSeriesId: updateCourseDto.docSeries });

    wrap(infoDoc).assign({ ...updateCourseDto, docSeries });
    await this.infoDocRepository.flush();
    await this.infoDocSearchService.update(infoDoc);
    return infoDoc;
  }

  public async remove(user: User, infoDocId: string): Promise<void> {
    const infoDoc = await this.infoDocRepository.findOneOrFail({ infoDocId }, { populate: ['file'] });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Delete, infoDoc);

    await this.infoDocRepository.removeAndFlush(infoDoc);
    await this.infoDocSearchService.remove(infoDoc.infoDocId);
  }
}
