import { Body, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { AbstractService } from './abstract-service';
import { AbstractEntity } from './abstract-entity';
import { AbstractDto } from './abstract.dto';
import { ApiImplicitParam } from '@nestjs/swagger';

export abstract class AbstractController<MODEL extends AbstractEntity, DTO extends AbstractDto> {

	protected constructor(protected service: AbstractService<MODEL, DTO>) {

	}

	@Get()
	async findAll(): Promise<DTO[]> {
		const models: MODEL[] = await this.service.findAll();
		return this.service.convertToDtoList(models);
	}

	@Get(':uuid')
	@ApiImplicitParam({ name: 'uuid', description: 'Uuid of the model to find.' })
	async findOne(@Param('uuid') uuid: string): Promise<DTO> {
		const model: MODEL = await this.service.findOne({ where: { uuid } });
		if (!model) {
			throw new NotFoundException('Model not found.');
		}
		return this.service.convertToDto(model);
	}

	@Post()
	async create(@Body() dto: DTO): Promise<DTO> {
		return this.service.convertToDto(await this.service.create(dto));
	}

	@Put(':uuid')
	async update(@Param('uuid') uuid: string, @Body() dto: DTO): Promise<DTO> {
		return this.service.convertToDto(await this.service.update(uuid, dto));
	}

	@Delete(':uuid')
	async delete(@Param('uuid') uuid: string): Promise<DTO> {
		return this.service.convertToDto(await this.service.delete(uuid));
	}
}
