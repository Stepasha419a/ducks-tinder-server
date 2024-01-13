import { UserPictureInfo } from 'user/infrastructure/mapper';
import { ShortUserWithDistance, User } from '../user.interface';

export interface GetShortUserWithDistance {
  getShortUserWithDistance(): Promise<ShortUserWithDistance>;
}

export async function GET_SHORT_USER_WITH_DISTANCE(
  this: User,
): Promise<ShortUserWithDistance> {
  const pictures = await Promise.all(
    this.pictures.map(
      (picture) =>
        ({
          id: picture.id,
          name: picture.name,
          order: picture.order,
        } as UserPictureInfo),
    ),
  );

  return {
    id: this.id,
    name: this.name,
    age: this.age,
    description: this.description,
    distance: this.distance,
    isActivated: this.isActivated,

    interests: this.interests,
    zodiacSign: this.zodiacSign,
    education: this.education,
    alcoholAttitude: this.alcoholAttitude,
    chronotype: this.chronotype,
    foodPreference: this.foodPreference,
    pet: this.pet,
    smokingAttitude: this.smokingAttitude,
    socialNetworksActivity: this.socialNetworksActivity,
    trainingAttitude: this.trainingAttitude,
    childrenAttitude: this.childrenAttitude,
    personalityType: this.personalityType,
    communicationStyle: this.communicationStyle,
    attentionSign: this.attentionSign,

    place: this.place,

    pictures,
  };
}
