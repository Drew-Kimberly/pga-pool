import fs from 'fs';
import path from 'path';

import { Injectable, Logger, LoggerService, OnModuleInit, Optional } from '@nestjs/common';

@Injectable()
export class SeedDataService implements OnModuleInit {
  private data: Record<string, object> = {};

  constructor(
    @Optional()
    private readonly logger: LoggerService = new Logger(SeedDataService.name)
  ) {}

  onModuleInit() {
    this.loadSeedData();
  }

  getAllSeedData<T = Record<string, object>>(): T {
    return this.data as T;
  }

  getSeedData<T = object>(key: string): T | undefined {
    return this.data[key] as T;
  }

  getSeedDirPath() {
    return path.resolve(__dirname, '../../..', 'seeds');
  }

  private loadSeedData() {
    const seedDirPath = this.getSeedDirPath();

    let seedFiles: string[];
    try {
      seedFiles = fs.readdirSync(seedDirPath);
    } catch (e) {
      this.logger.error(`Failed reading seed data files from directory: ${seedDirPath}`);
      throw e;
    }

    if (seedFiles.length === 0) {
      throw new Error(`No seed data files found in directory: ${seedDirPath}`);
    }

    this.logger.log(`Found ${seedFiles.length} seed data files in directory: ${seedDirPath}`);

    for (const seedFile of seedFiles) {
      let seedData: object;
      try {
        seedData = JSON.parse(fs.readFileSync(`${seedDirPath}/${seedFile}`).toString());
      } catch (e) {
        this.logger.error(`Failed reading seed data from file: ${seedFile}`);
        throw e;
      }

      if (!this.isObject(seedData)) {
        throw new Error(`Unexpected seed data value found at ${seedFile}: ${seedData}`);
      }

      const seedName = this.getSeedName(seedFile);
      this.data[seedName] = seedData;

      this.logger.log(`Successfully loaded "${seedName}" seed data`);
    }
  }

  private getSeedName(seedFilename: string) {
    return seedFilename.split('.json')[0];
  }

  private isObject(val: unknown) {
    return typeof val === 'object' && val !== null && !Array.isArray(val);
  }
}
