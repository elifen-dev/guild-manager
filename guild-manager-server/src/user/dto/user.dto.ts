import { Validate } from '../../generic/decorators/validate.decorator';
import { AbstractDto } from '../../generic/abstract.dto';
import { ApiModelProperty } from '@nestjs/swagger';

export class UserDto extends AbstractDto {
	@Validate()
	@ApiModelProperty()
	username: string;

	avatar: string;

	@ApiModelProperty()
	discordId: string;
}
