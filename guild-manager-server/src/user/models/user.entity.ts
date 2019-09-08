import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../generic/abstract-entity';
import { Exclude } from 'class-transformer';

@Entity('user')
export class UserEntity extends AbstractEntity {

	@Column()
	username: string;

	@Column({ nullable: true })
	@Exclude()
	token: string;

	@Column({ nullable: true })
	@Exclude()
	refreshToken: string;

	@Column({ nullable: true })
	avatar: string;

	@Column()
	discordId: string;
}
