import { userDtoStub } from './user-dto.stub';

export const requestUserStub = () => {
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
    preferSex: userStubObj.preferSex as 'male' | 'female',
    place: {
      id: 'sdfhsdghj34259034578923',
      name: 'place-name',
      address: 'place-address',
      latitude: 12.3456789,
      longitude: 12.3456789,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
    pictures: [
      {
        id: 'asdasda',
        userId: 'sdfhsdghj34259034578923',
        name: 'picture.jpg',
        order: 0,
        createdAt: '2022-11-11',
        updatedAt: '2022-11-11',
      },
    ],
  };
};
