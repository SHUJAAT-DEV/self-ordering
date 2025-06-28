import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import * as bodyParser from "body-parser";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./root.module";
import * as dotenv from "dotenv";
import { SeederService } from "./api/user/seeder.service";
import { OrderStatusSeederService } from "./api/order/order-status/orderStatus.seeder.service";
import * as os from 'os';

async function bootstrap() {
  dotenv.config(); // Load .env file at the start
  const app: NestExpressApplication = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();
  
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>("PORT") || 3000;
  const host = '0.0.0.0';

  app.set("trust proxy", 1);
  app.use(bodyParser.json());
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix("api/v1");

  // Seed data on application start
  const seederService = app.get(SeederService);
  await seederService.seedUserIfNotExists();

  // Seed order status on application start
  const orderStatusService = app.get(OrderStatusSeederService);
  await orderStatusService.seedOrderStatus();

  await app.listen(port, host, () => {
    const networkInterfaces = os.networkInterfaces();
    const localAddress = Object.values(networkInterfaces).flat().find(details => details.family === 'IPv4' && !details.internal)?.address || 'localhost';
    console.log("[WEB]", `http://localhost:${port}`);
    console.log("[NETWORK]", `http://${localAddress}:${port}`);
  });
}

bootstrap();
