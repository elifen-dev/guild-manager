import { SetMetadata } from '@nestjs/common';
export const ADMIN_ONLY_METADATA_KEY: symbol = Symbol.for('isAdminOnly');

export const AdminOnly = (): PropertyDecorator => SetMetadata(ADMIN_ONLY_METADATA_KEY, true);
