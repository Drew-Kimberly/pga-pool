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
    this.loadFromDir(this.getSeedDirPath(), this.data);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private loadFromDir(dirPath: string, data: Record<string, any>) {
    let seedFiles: string[];
    try {
      seedFiles = fs.readdirSync(dirPath);
    } catch (e) {
      this.logger.error(`Failed reading seed data files from directory: ${dirPath}`);
      throw e;
    }

    if (seedFiles.length === 0) {
      throw new Error(`No seed data files found in directory: ${dirPath}`);
    }

    for (const seedFile of seedFiles) {
      const fullPath = `${dirPath}/${seedFile}`;
      if (fs.lstatSync(fullPath).isDirectory()) {
        data[seedFile] = {};
        this.loadFromDir(fullPath, data[seedFile]);
        continue;
      }

      if (!seedFile.endsWith('.json')) {
        continue;
      }

      let seedData: object;
      try {
        seedData = JSON.parse(fs.readFileSync(fullPath).toString());
      } catch (e) {
        this.logger.error(`Failed reading seed data from file: ${fullPath}`);
        throw e;
      }

      if (!this.isObject(seedData)) {
        throw new Error(`Unexpected seed data value found at ${fullPath}: ${seedData}`);
      }

      const seedName = this.getSeedName(seedFile);
      data[seedName] = seedData;

      this.logger.debug?.(`Successfully loaded "${seedName}" seed data`);
    }
  }

  private getSeedName(seedFilename: string) {
    return seedFilename.split('.json')[0];
  }

  private isObject(val: unknown) {
    return typeof val === 'object' && val !== null && !Array.isArray(val);
  }
}
