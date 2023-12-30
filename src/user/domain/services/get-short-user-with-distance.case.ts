import { PictureAggregate } from '../picture';
import { PlaceAggregate } from '../place';
import { ShortUserWithDistance, User } from '../user.interface';

export interface GetShortUserWithDistance {
  getShortUserWithDistance(): Promise<ShortUserWithDistance>;
}

export async function GET_SHORT_USER_WITH_DISTANCE(
  this: User,
): Promise<ShortUserWithDistance> {
  const placeAggregate = PlaceAggregate.create({
    ...this.place,
    id: this.id,
  });

  const place = await placeAggregate.getShortUserPlaceInfo();

  const pictures = await Promise.all(
    this.pictures.map((picture) =>
      PictureAggregate.create(picture).getUserPictureInfo(),
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

    place,

    pictures,
  };
}
