import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import * as path from 'path';
import * as fs from 'fs';
import { ensureDir } from 'fs-extra';
import { sync } from 'rimraf';
import { NestApplication } from '@nestjs/core';
import { HttpServer } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'app.module';
import prismaClient from '@app/common/prisma/test/prisma-client';
import {
  prepareAccessTokens,
  prepareAfter,
  prepareBefore,
} from '../preparations';
import { USERS_PICTURE_PUT_EXPECT } from 'apps/user/src/test/values/users.e2e-const.expect';

const currentUserId = 'users_picture_put_current_user_id';
const secondUserId = 'users_picture_put_second_user_id';

describe('user/picture (PUT)', () => {
  let httpServer: HttpServer;
  let app: NestApplication;

  const prepareReadyAccessTokens = () =>
    prepareAccessTokens(currentUserId, secondUserId);

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.use(cookieParser());

    await app.init();
    await prismaClient.$connect();

    await prepareBefore(currentUserId, secondUserId);

    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await prepareAfter(currentUserId, secondUserId);
    await app.close();
    await prismaClient.$disconnect();
    sync(
      path.resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        '..',
        `static\\${currentUserId}`,
      ),
    );
  });

  beforeEach(async () => {
    await prepareAfter(currentUserId, secondUserId);
    await prepareBefore(currentUserId, secondUserId);
  });

  describe('when it is called correctly', () => {
    let response: request.Response;

    beforeAll(async () => {
      // create entity
      await prismaClient.picture.create({
        data: {
          name: 'picture-name-1.jpg',
          order: 0,
          userId: currentUserId,
        },
      });
      // create dir
      await ensureDir(
        path.resolve(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          '..',
          'static',
          currentUserId,
        ),
      );
      // read and write image into the dir
      fs.readFile(
        path.resolve(__dirname, '..', '..', 'stubs', 'test-image.jpg'),
        (err, data) => {
          fs.writeFile(
            path.resolve(
              __dirname,
              '..',
              '..',
              '..',
              '..',
              '..',
              'static',
              currentUserId,
              'picture-name-1.jpg',
            ),
            data,
            () => null,
          );
        },
      );

      const { currentUserAccessToken } = prepareReadyAccessTokens();

      response = await request(httpServer)
        .put('/users/picture')
        .send({ order: 0 })
        .set('Authorization', `Bearer ${currentUserAccessToken}`);
    });

    it('should return a user', () => {
      expect(response.status).toBe(200);
      expect(response.body).toEqual(USERS_PICTURE_PUT_EXPECT);
    });
  });

  describe('when there is no such picture', () => {
    let response: request.Response;

    beforeAll(async () => {
      const { currentUserAccessToken } = prepareReadyAccessTokens();

      response = await request(httpServer)
        .put('/users/picture')
        .send({ order: 1 })
        .set('Authorization', `Bearer ${currentUserAccessToken}`);
    });

    it('should throw an error', () => {
      expect(response.status).toBe(404);
      expect(response.body.message).toEqual('Not Found');
    });
  });

  describe('when there is no such user', () => {
    let response: request.Response;

    beforeAll(async () => {
      const { wrongUserAccessToken } = prepareReadyAccessTokens();

      response = await request(httpServer)
        .put('/users/picture')
        .send({ order: 0 })
        .set('Authorization', `Bearer ${wrongUserAccessToken}`);
    });

    it('should throw an error', () => {
      expect(response.status).toBe(404);
      expect(response.body.message).toEqual('Not Found');
    });
  });

  describe('when there is no access token', () => {
    let response: request.Response;

    beforeAll(async () => {
      response = await request(httpServer)
        .put('/users/picture')
        .send({ order: 0 });
    });

    it('should throw an error', () => {
      expect(response.status).toBe(401);
      expect(response.body.message).toEqual('Unauthorized');
    });
  });
});
