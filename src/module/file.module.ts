import { Module } from '@nestjs/common';
import { FileController } from 'src/controller/file.controller';

@Module({
  imports:[],
  controllers: [FileController],
})
export class FileModule {}