import { AbstractEntity } from './abstract-entity';
import { DeepPartial, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { TO_VALIDATE_METADATA_KEY } from './decorators/validate.decorator';
import * as winston from 'winston';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AbstractDto } from './abstract.dto';

/**
 * Abstract service to use for every NestJS service.
 */
export abstract class AbstractService<MODEL extends AbstractEntity, DTO extends AbstractDto> {

	protected constructor(protected modelName: string, protected repository: Repository<MODEL>) {

	}

	/**
	 * Convert a model to a dto.
	 * @param model
	 */
	abstract convertToDto(model: MODEL): DTO;

	/**
	 * Convert a list of models to a list of dtos.
	 * @param models
	 */
	abstract convertToDtoList(models: MODEL[]): DTO[];

	/**
	 * Convert a dto to an entity.
	 * @param dto
	 */
	protected abstract async convertToEntity(dto: Partial<DTO>): Promise<DeepPartial<MODEL>>;

	/**
	 * Validate the parameters of a function.
	 */
	protected validateParameters(methodName: string, args: any[]): void {
		for (const arg of args) {
			let argIsOk: boolean = true;
			if (!arg) {
				argIsOk = false;
			} else if (typeof arg === 'object') {
				if (Object.keys(arg).length) {
					// For each key to validate check that the arg[key] value exists.
					const toValidateKeys: string[] = Reflect.getMetadata(TO_VALIDATE_METADATA_KEY, arg);
					if (toValidateKeys && toValidateKeys.length) {
						for (const toValidateKey of toValidateKeys) {
							argIsOk = argIsOk && !!(arg[toValidateKey]);
						}
					}
				} else {
					argIsOk = false;
				}
			}
			if (!argIsOk) {
				winston.error(`Error in ${this.modelName} Service - ${methodName}: Incorrect parameter.`, { args });
				throw new BadRequestException('Incorrect parameters.');
			}
		}
	}

	/**
	 * Throw an sql exception.
	 * @param methodName
	 * @param exception
	 * @param queryParameters: parameters of the query to display in logs.
	 */
	protected throwSqlException(methodName: string, exception: any, ...queryParameters: any[]): void {
		winston.error(`Error in ${this.modelName} Service - ${methodName}: Sql query raised an exception.`, { exception, queryParameters });
		throw new InternalServerErrorException('Wrong sql query.');
	}

	/**
	 * Find all models using the given optional options.
	 */
	async findAll(options?: FindManyOptions<MODEL>): Promise<MODEL[]> {
		try {
			return await this.repository.find(options);
		} catch (exception) {
			this.throwSqlException('findAll', exception);
		}
	}

	/**
	 * Find one entity.
	 * @param options
	 */
	async findOne(options?: FindOneOptions<MODEL>): Promise<MODEL> {
		try {
			return await this.repository.findOne(options);
		} catch (exception) {
			this.throwSqlException('findOne', exception);
		}
	}

	/**
	 * Create a model from a dto.
	 * @param dto
	 */
	async create(dto: Partial<DTO>): Promise<MODEL> {
		this.validateParameters('create', [dto]);
		const model: DeepPartial<MODEL> = await this.convertToEntity(dto);
		try {
			return await this.repository.save(model);
		} catch (exception) {
			this.throwSqlException('create', dto);
		}
	}

	/**
	 * Update a model.
	 * @param uuid
	 * @param dto
	 * @param relations: relations to return with the object.
	 */
	async update(uuid: string, dto: Partial<DTO>, relations?: string[]): Promise<MODEL> {
		this.validateParameters('update', [uuid, dto]);
		const existingModel: MODEL = await this.findOne({ where: { uuid: uuid } });
		if (!existingModel) {
			this.throwSqlException('update', new NotFoundException('Entity to update not found.'));
		}
		const updatedModel: DeepPartial<MODEL> = await this.convertToEntity(dto);
		updatedModel.id = existingModel.id as any;
		try {
			await this.repository.save(updatedModel);
			return await this.findOne({ where: { uuid }, relations: relations });
		} catch (exception) {
			this.throwSqlException('update', exception);
		}
	}

	/**
	 * Delete the model with the given uuid.
	 * @param uuid
	 */
	async delete(uuid: string): Promise<MODEL> {
		this.validateParameters('delete', [uuid]);
		const toDelete: MODEL = await this.findOne({ where: { uuid } });
		if (!toDelete) {
			this.throwSqlException('delete', new NotFoundException('Model to delete not found.'));
		}
		try {
			return await this.repository.remove(toDelete);
		} catch (exception) {
			this.throwSqlException('delete', exception);
		}
	}
}
