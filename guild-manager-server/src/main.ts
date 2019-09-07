import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as winston from 'winston';
import { LOG_CONSOLE_LEVEL, NODE_ENV } from '../environment';
import { format } from 'winston';
import { transports } from 'winston';

// Logger configuration
if (NODE_ENV === 'dev') {
	winston.configure({
		transports: [
			new (winston.transports.Console)({
				format: winston.format.combine(
					winston.format.colorize({ colors: { info: 'blue', debug: 'yellow', error: 'red' } }),
					winston.format.timestamp(),
					winston.format.simple()
				),
				level: LOG_CONSOLE_LEVEL
			})
		]
	});
} else {
	winston.configure({
		level: 'info',
		format: format.json(),
		transports: [
			//
			// - Write to all logs with level `info` and below to `combined.log`
			// - Write all logs error (and below) to `error.log`.
			//
			new transports.File({ filename: 'error.log', level: 'error' }),
			new transports.File({ filename: 'combined.log' })
		]
	});
}

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule);

	// Swagger configuration
	const options = new DocumentBuilder()
		.setTitle('Guild Manager')
		.setDescription('Guild manager API')
		.setVersion('0.0')
		.build();
	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('swagger-api', app, document);

	// Start the app.
	const port: number = 3000;
	winston.info('App listening on port ' + port);
	await app.listen(port);
}

bootstrap();
