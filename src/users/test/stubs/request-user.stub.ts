import { UserDto } from 'users/legacy/dto';
import { userDtoStub } from './user-dto.stub';

export const requestUserStub = (): UserDto => {
  const userStubObj = userDtoStub();

  return {
    id: 'sdfhsdghj34259034578923',
    age: userStubObj.age,
    description: userStubObj.description,
    distance: userStubObj.distance,
    email: userStubObj.email,
    isActivated: userStubObj.isActivated,
    name: userStubObj.name,
    nickname: userStubObj.nickname,
    sex: userStubObj.sex,
    preferAgeFrom: userStubObj.preferAgeFrom,
    preferAgeTo: userStubObj.preferAgeTo,
    usersOnlyInDistance: userStubObj.usersOnlyInDistance,
    preferSex: userStubObj.preferSex,
    place: {
      name: 'place-name',
      address: 'place-address',
      latitude: 12.3456789,
      longitude: 12.3456789,
    },
    interests: ['interest-1', 'interest-2'],
    zodiacSign: 'zodiac-sign',
    education: 'education',
    childrenAttitude: 'children-attitude',
    personalityType: 'personality-type',
    communicationStyle: 'communication-style',
    attentionSign: 'attention-sign',
    alcoholAttitude: 'alcohol-attitude',
    chronotype: 'chronotype',
    foodPreference: 'food-preference',
    pet: 'pet',
    smokingAttitude: 'smoking-attitude',
    socialNetworksActivity: 'social-networks-activity',
    trainingAttitude: 'training-attitude',
    pictures: [{ name: 'picture.jpg', order: 0 }],
    firstPair: undefined,
    pairsCount: 0,
  };
};
