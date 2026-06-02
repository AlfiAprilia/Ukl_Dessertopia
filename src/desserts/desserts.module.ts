import { Module } from '@nestjs/common';
import { DessertsController } from './desserts.controller';
import { DessertsService } from './desserts.service';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [DessertsController],
  providers: [DessertsService],
})
export class DessertsModule {}