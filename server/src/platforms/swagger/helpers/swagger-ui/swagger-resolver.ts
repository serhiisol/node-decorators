import { Inject, Injectable } from '@decorators/di';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { absolutePath } from 'swagger-ui-dist';

import { addLeadingSlash, buildUrl } from '../../../../core';
import { HTTP_ADAPTER, HttpApplicationAdapter, ParameterType } from '../../../http';
import { SwaggerConfig } from '../../types';
import { SWAGGER_CONFIG } from '../constants';
import { SwaggerDocument } from './swagger-document';

@Injectable()
export class SwaggerResolver {
  constructor(
    @Inject(HTTP_ADAPTER) private adapter: HttpApplicationAdapter,
    @Inject(SWAGGER_CONFIG) private config: SwaggerConfig,
    private document: SwaggerDocument,
  ) { }

  resolve() {
    const swaggerPath = addLeadingSlash(this.config.path);
    const swaggerFilePath = addLeadingSlash(buildUrl(this.config.path, 'swagger.json'));

    this.adapter.routes([
      {
        handler: this.simpleHandler(
          JSON.stringify(this.document.generate()),
          { 'content-type': 'application/json' },
        ),
        type: 'get',
        url: swaggerFilePath,
      },
      {
        handler: this.simpleHandler(
          indexStyles(this.config.theme),
          { 'content-type': 'text/css' },
        ),
        type: 'get',
        url: `${swaggerPath}/index.css`,
      },
      {
        handler: this.simpleHandler(
          initializerScriptContent(swaggerFilePath),
          { 'content-type': 'text/javascript' },
        ),
        type: 'get',
        url: `${swaggerPath}/swagger-initializer.js`,
      },
    ]);

    this.adapter.serveStatic(swaggerPath, absolutePath());
  }

  private simpleHandler(response: unknown, headers: Record<string, string> = {}) {
    return async (...args: any[]) => {
      const res = await this.adapter.getParam(ParameterType.RESPONSE, null, ...args);

      Object.entries(headers).forEach(([name, value]) =>
        this.adapter.setHeader(res(), name, value),
      );

      this.adapter.reply(res(), response);
    };
  }
}

function initializerScriptContent(jsonPath: string) {
  return `
    window.onload = function() {
      window.ui = SwaggerUIBundle({
        url: "${jsonPath}",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset.slice(1) // slice removes top-bar plugin
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout"
      });
    };
  `;
}

function indexStyles(theme: SwaggerConfig['theme']) {
  const styles = readFileSync(resolve(absolutePath(), 'index.css'), 'utf-8');
  const darkStyles = readFileSync(resolve(__dirname, 'swagger-dark.css'), 'utf-8');

  const styleOverrides = `
    ${styles}
  `;

  if (theme === 'light') {
    return styleOverrides;
  }

  return `
    ${styleOverrides}

    ${theme === 'auto' ? '@media only screen and (prefers-color-scheme: dark) {' : ''}
      ${darkStyles}
    ${theme === 'auto' ? '}' : ''}
  `;
}
