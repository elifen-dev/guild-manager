import {AbstractEntity} from './abstract-entity';
import {Repository} from 'typeorm';

/**
 * Abstract service to use for every NestJS service.
 */
export abstract class AbstractService<MODEL extends AbstractEntity> {

	protected constructor(repository: Repository<MODEL>) {

	}
}
