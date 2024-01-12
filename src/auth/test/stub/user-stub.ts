export const UserStub = () => ({
  id: '0961e385-fcf1-4390-bb32-1904718ccdef',
  password: '123123123',
  activationLink: 'asdadas23234234',
  email: '123@mail.ru',
  name: 'Jason',
  description: '',
  isActivated: false,
  age: 18,
  sex: 'male',
  nickname: '',
  interests: ['programming'],
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
  place: {
    name: 'russia moscow',
    address: 'address',
    latitude: 40.0,
    longitude: 30.0,
  },
  distance: 2,
  usersOnlyInDistance: false,
  preferSex: 'female',
  preferAgeFrom: 18,
  preferAgeTo: 20,
  pictures: [
    {
      id: '123123',
      name: '123.jpg',
      order: 0,
      createdAt: new Date('01-01-2001').toISOString(),
      updatedAt: new Date('01-01-2001').toISOString(),
      userId: 'sdfhsdghj34259034578923',
    },
    {
      id: '456456',
      name: '456.jpg',
      order: 1,
      createdAt: new Date('01-01-2001').toISOString(),
      updatedAt: new Date('01-01-2001').toISOString(),
      userId: 'sdfhsdghj34259034578923',
    },
  ],
  createdAt: new Date('01-01-2001').toISOString(),
  updatedAt: new Date('01-01-2001').toISOString(),
});
