import { userDtoStub } from '../stubs';
import { MixPicturesDto } from 'apps/user/src/application/command';

export const USER_SORTS_DATA = {
  ...userDtoStub(),
  distance: 100,
  usersOnlyInDistance: false,
  age: 20,
  preferAgeFrom: 18,
  preferAgeTo: 25,
  sex: 'male',
  preferSex: 'female' as 'male' | 'female',
  userIds: [],
  password: '123123123',
  place: {
    name: 'place-name',
    address: 'place-address',
    latitude: 12.3456789,
    longitude: 12.3456789,
  },
};

export const CREATE_USER_DTO = {
  email: userDtoStub().email,
  password: '123123123',
  name: userDtoStub().name,
};

export const UPDATE_USER_DTO = {
  name: 'William',
  email: 'email123123@gmail.com',
};

export const UPDATE_USER_PLACE_DTO = {
  latitude: 12.34567,
  longitude: 12.34567,
};

export const UPDATE_USER_RELATIONS_DTO = {
  attentionSign: 'attention-sign',
  childrenAttitude: 'children-attitude',
  communicationStyle: 'communication-style',
  education: 'education',
  interests: ['interest-1', 'interest-2', 'wrong-interest'],
  personalityType: 'personality-type',
  zodiacSign: 'zodiac-sign',
};

export const MIX_PICTURES_DTO: MixPicturesDto = {
  pictureOrders: [2, 0, 1],
};
