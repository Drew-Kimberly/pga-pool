import 'dotenv/config';

import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: [
    {
      [process.env.PGA_TOUR_API_GQL_URL ?? 'https://orchestrator.pgatour.com/graphql']: {
        headers: {
          'X-Api-Key': process.env.PGA_TOUR_API_GQL_API_KEY ?? '',
        },
      },
    },
  ],
  documents: 'src/pga-tour-api/lib/v2/operations/**/*.graphql',
  generates: {
    'src/pga-tour-api/lib/v2/generated/graphql.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-graphql-request'],
      config: {
        enumsAsTypes: true,
        defaultScalarType: 'unknown',
      },
    },
  },
};

export default config;
