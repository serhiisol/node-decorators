import * as express from 'express';
import { attachControllers, Controller, Get, Put, Response, Params } from "@decorators/express";
import { enableOpenApi, registerSchema } from "../helpers";
import {
  BodyContent, Deprecated, Description,
  OpenApiResponse,
  Schema,
  Param,
  Property,
  Responses,
  Summary, Tags,
  WithDefinitions
} from "../decorators";

const app = express();

@WithDefinitions({ basePath: '/users' })
@Controller('/users')
class UsersController {
  @Get('/')
  @Summary('this endpoint gets a list of users')
  @Param('id', 'query')
  @Param('created_after', 'query')
  @OpenApiResponse(200, 'Successful response')
  @OpenApiResponse(200, 'application/json', { $ref: '#/components/schemas/User' })
  public getUsers(@Response() res: express.Response) {
    res.send([]);
  }

  // Defining all responses at once
  @Get('/:id')
  @Param('id', 'path', { required: true })
  @Responses({
    '200': {
      description: 'successful response',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/User',
          }
        }
      }
    },
    '404': {
      description: 'user not found',
      content: {},
    }
  })
  public getUserById(@Response() res: express.Response) {
    res.sendStatus(404);
  }

  // custom tags for one operation
  @Put('/:id')
  @Description('this endpoint updates an user or creates a new one if there is no user with that id')
  @BodyContent('application/json', { $ref: '#/components/schemas/User' })
  @Responses({
    '200': {
      description: 'successful response',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/User',
          }
        }
      }
    },
    '400': {
      description: 'bad request',
      content: {},
    }
  })
  @Tags('users', 'upsert functions') // When defining custom tags, the default one is excluded
  public upsertUser(@Params('id') id: string, @Response() res: express.Response) {
    const user = new User();
    user.id = id;
    res.send(user);
  }

  // deprecated endpoints
  @Get('/get_by_post_id')
  @Param('post_id', 'query', { required: true })
  @Deprecated()
  public getUserByPostId(@Response() res: express.Response) {
    res.send(new User());
  }

}

@Schema()
class User {
  @Property({ type: 'string', format: 'uuid', readOnly: true })
  public id: string;

  @Property({ type: 'array', items: { $ref: '#/components/schemas/Post' } })
  public posts: object[];
}

registerSchema('Post', {
  type: 'object',
  properties: {
    id: { type: 'integer', minimum: 1, readOnly: true },
    content: { type: 'string' }
  },
  required: ['id'],
  example: { id: 1, content: 'lorem ipsum dolor' }
});

// it is also possible to define non-object schemas with registerSchema
registerSchema('uuid', {
  type: "string",
  format: 'uuid',
});
registerSchema('successfulHttpStatus', {
  type: 'integer',
  minimum: 200,
  maximum: 299,
});

attachControllers(app, [UsersController]);
enableOpenApi(app);

app.listen(3000);
