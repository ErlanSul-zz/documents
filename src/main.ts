import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { ConfigService } from './config/config.service';
import 'source-map-support/register';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: 'keyboard',
      resave: false,
      saveUninitialized: false,
    }),
  );
  const configService = app.get(ConfigService);

  // Swagger initialization
  const config = new DocumentBuilder()
    .setTitle('User documents')
    .setDescription('User documents')
    .setVersion('1.0')
    .addTag('Documents')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(configService.serverPort, configService.serverHost);
}

void bootstrap().then(() => {
  //
});
