import { Module } from '@nestjs/common';
import { FileModule } from './module/file.module';
import { AuthModule } from './module/auth.module';



@Module({
  imports: [
   FileModule,
   AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
