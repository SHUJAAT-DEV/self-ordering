import { Global, Module } from "@nestjs/common";
import { ExceptionService } from "./services/exception.service";
import { SharedService } from "./services/shared.service";
import { SharedController } from "./shared.controller";
import { ResponseService } from "./services/response.service";

@Global()
@Module({
  providers: [SharedService, ExceptionService, ResponseService],
  controllers: [SharedController],
  exports: [SharedService, ExceptionService, ResponseService],
})
export class SharedModule {}
