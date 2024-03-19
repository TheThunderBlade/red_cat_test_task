import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from './utils/pipes/validation.pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function start() {
    const PORT = process.env.PORT;
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('Red cat API')
        .setDescription('The red cat test task API description')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());

    await app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
start();
