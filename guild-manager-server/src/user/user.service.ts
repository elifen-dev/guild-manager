import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { IDiscordUser } from '../auth/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './models/user.entity';
import { UserDto } from './dto/user.dto';
import { classToPlain, plainToClass, plainToClassFromExist } from 'class-transformer';
import * as winston from 'winston';
import { AbstractService } from '../generic/abstract-service';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class UserService extends AbstractService<UserEntity, UserDto> {

	constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {
		super('User', userRepository);
	}

	convertToDto(model: UserEntity): UserDto {
		return plainToClass(UserDto, classToPlain(model));
	}

	convertToDtoList(models: UserEntity[]): UserDto[] {
		return plainToClass(UserDto, classToPlain<UserEntity>(models));
	}

	protected async convertToEntity(dto: Partial<UserDto>): Promise<DeepPartial<UserEntity>> {
		let entity: UserEntity = this.repository.create();
		entity = plainToClassFromExist(entity, dto);
		return entity;
	}

	/**
	 * Get the currently authenticated user.
	 * @param user
	 */
	async getAuthenticatedUser(user: IDiscordUser): Promise<UserDto> {
		try {
			const entity: UserEntity = await this.getOrCreate(user.id, {
				username: user.username,
				avatar: user.avatar
			});
			// Convert to DTO.
			return plainToClass(UserDto, classToPlain(entity));
		} catch (exception) {
			winston.error('Error in User service - getAuthenticatedUser: could not retrieve logged user.', { exception });
			throw new InternalServerErrorException('Could not retrieve logged user.');
		}
	}

	/**
	 * Get or create the user entity corresponding to the given dto.
	 */
	async getOrCreate(discordId: string, dto: Partial<UserDto>): Promise<UserEntity> {
		if (!discordId) {
			winston.error('Error in User service - getOrCreate: Missing parameter.', { discordId, dto });
			throw new BadRequestException('Missing parameter discordId');
		}
		try {
			const existingUser: UserEntity = await this.userRepository.findOne({ discordId });
			let toSave: UserEntity = this.userRepository.create();
			toSave.discordId = discordId;
			if (existingUser) {
				toSave = existingUser;
			}
			if (dto.avatar) {
				toSave.avatar = dto.avatar;
			}
			if (dto.username) {
				toSave.username = dto.username;
			}
			// Create or update the entity.
			return await this.userRepository.save(toSave);
		} catch (exception) {
			winston.error('Error in User Service - getOrCreate.', { exception });
			throw new InternalServerErrorException();
		}
	}
}
