import {Get} from '@nestjs/common';
import {AbstractService} from './abstract-service';
import {AbstractEntity} from './abstract-entity';

export abstract class AbstractController<MODEL extends AbstractEntity> {

	protected constructor(service: AbstractService<MODEL>) {

	}

	@Get()
	async findAll(): Promise<any> {
		return 'Hello world';
	}
}
