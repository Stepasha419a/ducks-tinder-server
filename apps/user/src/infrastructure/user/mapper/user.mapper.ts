import { User } from 'apps/user/src/domain/user';
import {
  ShortUserPlaceInfo,
  UserPictureInfo,
  WithoutPrivateFields,
} from './interface';
import { ShortUserWithDistance } from './interface/short-user-with-distance';
import {
  PictureValueObject,
  PlaceValueObject,
} from 'apps/user/src/domain/user/value-object';

export class UserMapper {
  getWithoutPrivateFields(user: User): WithoutPrivateFields {
    const pictures = user.pictures.map((picture) =>
      this.getUserPictureInfo(picture),
    );

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      age: user.age,
      sex: user.sex,
      preferSex: user.preferSex,
      preferAgeFrom: user.preferAgeFrom,
      preferAgeTo: user.preferAgeTo,
      description: user.description,
      distance: user.distance,
      isActivated: user.isActivated,

      interests: user.interests,
      zodiacSign: user.zodiacSign,
      education: user.education,
      alcoholAttitude: user.alcoholAttitude,
      chronotype: user.chronotype,
      foodPreference: user.foodPreference,
      pet: user.pet,
      smokingAttitude: user.smokingAttitude,
      socialNetworksActivity: user.socialNetworksActivity,
      trainingAttitude: user.trainingAttitude,
      childrenAttitude: user.childrenAttitude,
      personalityType: user.personalityType,
      communicationStyle: user.communicationStyle,
      attentionSign: user.attentionSign,

      place: user.place,

      pictures: pictures,
    };
  }

  getShortUserWithDistance(user: User): ShortUserWithDistance {
    const pictures = user.pictures.map((picture) =>
      this.getUserPictureInfo(picture),
    );

    const place = this.getShortUserPictureInfo(user.place);

    return {
      id: user.id,
      name: user.name,
      age: user.age,
      description: user.description,
      distance: user.distance,
      isActivated: user.isActivated,

      interests: user.interests,
      zodiacSign: user.zodiacSign,
      education: user.education,
      alcoholAttitude: user.alcoholAttitude,
      chronotype: user.chronotype,
      foodPreference: user.foodPreference,
      pet: user.pet,
      smokingAttitude: user.smokingAttitude,
      socialNetworksActivity: user.socialNetworksActivity,
      trainingAttitude: user.trainingAttitude,
      childrenAttitude: user.childrenAttitude,
      personalityType: user.personalityType,
      communicationStyle: user.communicationStyle,
      attentionSign: user.attentionSign,

      place,

      pictures,
    };
  }

  private getUserPictureInfo(picture: PictureValueObject): UserPictureInfo {
    return {
      id: picture.id,
      name: picture.name,
      order: picture.order,
    };
  }

  private getShortUserPictureInfo(
    picture: PlaceValueObject,
  ): ShortUserPlaceInfo {
    return {
      name: picture.name,
    };
  }
}
