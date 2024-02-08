import { AuthUser } from 'apps/user/src/domain/auth';
import { UserPictureInfo } from 'apps/user/src/infrastructure/mapper';

export class AuthMapper {
  getWithoutPrivateFields(authUser: AuthUser) {
    const pictures = authUser.pictures.map(
      (picture) =>
        ({
          id: picture.id,
          name: picture.name,
          order: picture.order,
        }) as UserPictureInfo,
    );

    return {
      id: authUser.id,
      email: authUser.email,
      name: authUser.name,
      age: authUser.age,
      sex: authUser.sex,
      preferSex: authUser.preferSex,
      preferAgeFrom: authUser.preferAgeFrom,
      preferAgeTo: authUser.preferAgeTo,
      description: authUser.description,
      distance: authUser.distance,
      isActivated: authUser.isActivated,

      interests: authUser.interests,
      zodiacSign: authUser.zodiacSign,
      education: authUser.education,
      alcoholAttitude: authUser.alcoholAttitude,
      chronotype: authUser.chronotype,
      foodPreference: authUser.foodPreference,
      pet: authUser.pet,
      smokingAttitude: authUser.smokingAttitude,
      socialNetworksActivity: authUser.socialNetworksActivity,
      trainingAttitude: authUser.trainingAttitude,
      childrenAttitude: authUser.childrenAttitude,
      personalityType: authUser.personalityType,
      communicationStyle: authUser.communicationStyle,
      attentionSign: authUser.attentionSign,

      place: authUser.place,

      pictures: pictures,

      accessToken: authUser.accessToken,
    };
  }
}
