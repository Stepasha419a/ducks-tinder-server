import { ResponseUser, User } from '../user.interface';

export interface GetResponseUser {
  getResponseUser(): Promise<ResponseUser>;
}

export async function GET_RESPONSE_USER(this: User): Promise<ResponseUser> {
  return {
    id: this.id,
    email: this.email,
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

    pictures: this.pictures,
  };
}
