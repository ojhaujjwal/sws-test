import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';

export default {
  type: 'sqlite',
  database: 'swt.sqlite3',
  entities: [
    path.join(__dirname, '../entity/view/*.view.{js,ts}'),
    path.join(__dirname, '../entity/*.entity.{js,ts}')
  ],
  // TODO: this should be a database migration instead
  // synchronize: true is not a good practice for production environment
  synchronise: true,
} as TypeOrmModuleOptions;
