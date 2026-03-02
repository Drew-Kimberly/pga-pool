import path from 'path';

import { Injectable } from '@nestjs/common';

@Injectable()
export class SeedDataService {
  getSeedDirPath() {
    return path.resolve(__dirname, '../../..', 'seeds');
  }
}
