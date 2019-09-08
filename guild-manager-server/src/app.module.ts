import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DATABASE_NAME, DATABASE_PASSWORD, DATABASE_USER } from '../environment';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'mariadb',
			host: 'localhost',
			port: 3306,
			username: DATABASE_USER,
			password: DATABASE_PASSWORD,
			database: DATABASE_NAME,
			entities: [__dirname + '/**/*.entity{.ts,.js}'],
			synchronize: true
		}),
		AuthModule,
		UserModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {
}
