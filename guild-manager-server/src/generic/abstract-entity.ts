import { Generated, PrimaryGeneratedColumn } from 'typeorm';
import {Exclude} from 'class-transformer';

/**
 * Abstract base for application entities.
 */
export abstract class AbstractEntity {

	@PrimaryGeneratedColumn()
	@Exclude()
	id: number;

	@Generated('uuid')
	uuid: string;
}
