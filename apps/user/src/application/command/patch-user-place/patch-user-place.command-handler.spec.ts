import { PatchUserPlaceCommandHandler } from './patch-user-place.command-handler';
import { Test } from '@nestjs/testing';
import { MapApi } from '../../adapter';
import { UserRepository } from 'apps/user/src/domain/repository';
import { MapApiMock, UserRepositoryMock } from 'apps/user/src/test/mock';
import {
  PlaceValueObjectStub,
  UserAggregateStub,
  UserStub,
} from 'apps/user/src/test/stub';
import { UserAggregate } from 'apps/user/src/domain';
import { PatchUserPlaceCommand } from './patch-user-place.command';

jest.mock('apps/user/src/domain/value-object', () => ({
  PlaceValueObject: jest.fn(),
}));

import { PlaceValueObject } from 'apps/user/src/domain/value-object';

describe('when patch user place is called', () => {
  let patchUserPlaceCommandHandler: PatchUserPlaceCommandHandler;
  let repository: UserRepository;
  let mapApi: MapApi;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PatchUserPlaceCommandHandler,
        { provide: UserRepository, useValue: UserRepositoryMock() },
        { provide: MapApi, useValue: MapApiMock() },
      ],
    }).compile();

    patchUserPlaceCommandHandler = moduleRef.get<PatchUserPlaceCommandHandler>(
      PatchUserPlaceCommandHandler,
    );
    repository = moduleRef.get<UserRepository>(UserRepository);
    mapApi = moduleRef.get<MapApi>(MapApi);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when it is called correctly', () => {
    const userAggregate = UserAggregateStub();

    beforeAll(() => {
      repository.findOne = jest.fn().mockResolvedValue(userAggregate);
      mapApi.getGeocode = jest
        .fn()
        .mockResolvedValue({ address: 'place-address', name: 'place-name' });
      repository.save = jest.fn().mockResolvedValue(UserAggregateStub());
      PlaceValueObject.create = jest
        .fn()
        .mockReturnValue(PlaceValueObjectStub());
    });

    let response: UserAggregate;
    const dto = {
      latitude: 12.3456789,
      longitude: 12.3456789,
    };

    beforeEach(async () => {
      response = await patchUserPlaceCommandHandler.execute(
        new PatchUserPlaceCommand(UserStub().id, dto),
      );
    });

    it('should call repository findOne', () => {
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith(UserStub().id);
    });

    it('should call mapApi getGeocode', () => {
      expect(mapApi.getGeocode).toHaveBeenCalledTimes(1);
      expect(mapApi.getGeocode).toHaveBeenCalledWith(
        dto.latitude,
        dto.longitude,
      );
    });

    it('should call userAggregate setPlace', () => {
      expect(userAggregate.setPlace).toHaveBeenCalledTimes(1);
      expect(userAggregate.setPlace).toHaveBeenCalledWith(
        PlaceValueObjectStub(),
      );
    });

    it('should call repository save', () => {
      expect(repository.save).toHaveBeenCalledTimes(1);

      const calledWithArg = (repository.save as jest.Mock).mock.calls[0][0];
      expect(JSON.parse(JSON.stringify(calledWithArg))).toEqual(
        JSON.parse(JSON.stringify({ ...UserAggregateStub() })),
      );
    });

    it('should return a user aggregate', () => {
      expect(JSON.parse(JSON.stringify(response))).toEqual(
        JSON.parse(JSON.stringify(UserAggregateStub())),
      );
    });
  });
});
