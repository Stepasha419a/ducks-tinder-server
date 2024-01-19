import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { NestApplication } from '@nestjs/core';
import { HttpServer } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'app.module';
import prismaClient from '@app/common/database/test/database-client';
import {
  prepareAccessTokens,
  prepareAfter,
  prepareBefore,
} from '../preparations';
import { USERS_SORTED_GET_EXPECT } from 'apps/user/src/test/values/users.e2e-const.expect';

const currentUserId = 'sorted_current_user_id';
const secondUserId = 'sorted_second_user_id';

describe('user/sorted (GET)', () => {
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
  });

  beforeEach(async () => {
    await prepareAfter(currentUserId, secondUserId);
    await prepareBefore(currentUserId, secondUserId);
  });

  describe('when it is called correctly', () => {
    let response: request.Response;

    beforeAll(async () => {
      await prismaClient.place.update({
        where: { id: currentUserId },
        data: { latitude: 22.3456789, longitude: 22.3456789 },
      });
      await prismaClient.place.update({
        where: { id: secondUserId },
        data: { latitude: 22.5456789, longitude: 22.5456789 },
      });
      await prismaClient.user.update({
        where: { id: secondUserId },
        data: {
          age: 20,
          distance: 50,
          preferAgeFrom: 18,
          preferAgeTo: 28,
          preferSex: 'male',
          sex: 'female',
        },
      });
      await prismaClient.user.update({
        where: { id: currentUserId },
        data: {
          age: 18,
          distance: 90,
          preferAgeFrom: 18,
          preferAgeTo: 26,
          sex: 'male',
          preferSex: 'female',
        },
      });

      const { currentUserAccessToken } = prepareReadyAccessTokens();

      response = await request(httpServer)
        .get('/users/sorted')
        .set('Authorization', `Bearer ${currentUserAccessToken}`);
    });

    it('should return a user', () => {
      expect(response.status).toBe(200);
      expect(response.body).toEqual(USERS_SORTED_GET_EXPECT);
    });
  });

  describe('when there is more than 100 km (143) and usersOnlyInDistance - false', () => {
    let response: request.Response;

    beforeAll(async () => {
      await prismaClient.place.update({
        where: { id: currentUserId },
        data: { latitude: 22.3456789, longitude: 22.3456789 },
      });
      await prismaClient.place.update({
        where: { id: secondUserId },
        data: { latitude: 23.2916238, longitude: 21.3997339 },
      });
      await prismaClient.user.update({
        where: { id: secondUserId },
        data: {
          age: 20,
          distance: 50,
          preferAgeFrom: 18,
          preferAgeTo: 28,
          preferSex: 'male',
          sex: 'female',
        },
      });
      await prismaClient.user.update({
        where: { id: currentUserId },
        data: {
          age: 18,
          distance: 100,
          preferAgeFrom: 18,
          preferAgeTo: 26,
          sex: 'male',
          preferSex: 'female',
          usersOnlyInDistance: false,
        },
      });

      const { currentUserAccessToken } = prepareReadyAccessTokens();

      response = await request(httpServer)
        .get('/users/sorted')
        .set('Authorization', `Bearer ${currentUserAccessToken}`);
    });

    it('should return a user', () => {
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...USERS_SORTED_GET_EXPECT,
        distance: 143,
      });
    });
  });

  describe('when there it is 100 km (95)', () => {
    let response: request.Response;

    beforeAll(async () => {
      await prismaClient.place.update({
        where: { id: currentUserId },
        data: { latitude: 22.3456789, longitude: 22.3456789 },
      });
      await prismaClient.place.update({
        where: { id: secondUserId },
        data: { latitude: 22.9763039, longitude: 21.7150589 },
      });
      await prismaClient.user.update({
        where: { id: secondUserId },
        data: {
          age: 20,
          distance: 50,
          preferAgeFrom: 18,
          preferAgeTo: 28,
          preferSex: 'male',
          sex: 'female',
        },
      });
      await prismaClient.user.update({
        where: { id: currentUserId },
        data: {
          age: 18,
          distance: 100,
          preferAgeFrom: 18,
          preferAgeTo: 26,
          sex: 'male',
          preferSex: 'female',
          usersOnlyInDistance: true,
        },
      });

      const { currentUserAccessToken } = prepareReadyAccessTokens();

      response = await request(httpServer)
        .get('/users/sorted')
        .set('Authorization', `Bearer ${currentUserAccessToken}`);
    });

    it('should return a user', () => {
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...USERS_SORTED_GET_EXPECT,
        distance: 95,
      });
    });
  });

  describe('when there it is more than distance limit - 80 km (between users - 84km)', () => {
    let response: request.Response;

    beforeAll(async () => {
      await prismaClient.place.update({
        where: { id: currentUserId },
        data: { latitude: 22.3456789, longitude: 22.3456789 },
      });
      await prismaClient.place.update({
        where: { id: secondUserId },
        data: { latitude: 22.8501829, longitude: 21.7411749 },
      });
      await prismaClient.user.update({
        where: { id: secondUserId },
        data: {
          age: 20,
          distance: 50,
          preferAgeFrom: 18,
          preferAgeTo: 28,
          preferSex: 'male',
          sex: 'female',
        },
      });
      await prismaClient.user.update({
        where: { id: currentUserId },
        data: {
          age: 18,
          distance: 80,
          preferAgeFrom: 18,
          preferAgeTo: 26,
          sex: 'male',
          preferSex: 'female',
          usersOnlyInDistance: true,
        },
      });

      const { currentUserAccessToken } = prepareReadyAccessTokens();

      response = await request(httpServer)
        .get('/users/sorted')
        .set('Authorization', `Bearer ${currentUserAccessToken}`);
    });

    it('should throw an 404 error', () => {
      expect(response.status).toBe(404);
      expect(response.body.error).toEqual('Not Found');
      expect(response.body.message).toEqual(
        'Such user was not found, try to change settings',
      );
    });
  });

  describe('when there is no such user', () => {
    let response: request.Response;

    beforeAll(async () => {
      const { wrongUserAccessToken } = prepareReadyAccessTokens();

      response = await request(httpServer)
        .get('/users/sorted')
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
      response = await request(httpServer).get('/users/sorted');
    });

    it('should throw an error', () => {
      expect(response.status).toBe(401);
      expect(response.body.message).toEqual('Unauthorized');
    });
  });
});
