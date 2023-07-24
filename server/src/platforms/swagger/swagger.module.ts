import { Module, ModuleWithProviders } from '../../core';
import { SWAGGER_CONFIG, SwaggerDocument, SwaggerResolver } from './helpers';
import { SwaggerConfig } from './types';

@Module({
  providers: [
    SwaggerDocument,
    SwaggerResolver,
  ],
})
export class SwaggerModule {
  static forRoot(config: SwaggerConfig = {}) {
    return {
      module: SwaggerModule,
      providers: [
        {
          provide: SWAGGER_CONFIG,
          useValue: {
            path: 'swagger',
            theme: 'auto',
            ...config,
          } as SwaggerConfig,
        },
      ],
    } as ModuleWithProviders;
  }

  constructor(swagger: SwaggerResolver) {
    swagger.resolve();
  }
}
