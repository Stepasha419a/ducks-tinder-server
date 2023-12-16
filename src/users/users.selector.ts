import { Prisma } from '@prisma/client';

export class UsersSelector {
  static selectUser(): Prisma.UserSelect {
    return {
      interests: { select: { name: true } },
      pictures: {
        orderBy: { order: 'asc' as 'asc' | 'desc' },
      },
      place: {
        select: { name: true, address: true, latitude: true, longitude: true },
      },
      zodiacSign: {
        select: { name: true },
      },
      education: {
        select: { name: true },
      },
      childrenAttitude: {
        select: { name: true },
      },
      personalityType: {
        select: { name: true },
      },
      communicationStyle: {
        select: { name: true },
      },
      attentionSign: {
        select: { name: true },
      },
      alcoholAttitude: {
        select: { name: true },
      },
      chronotype: {
        select: { name: true },
      },
      foodPreference: {
        select: { name: true },
      },
      pet: {
        select: { name: true },
      },
      smokingAttitude: {
        select: { name: true },
      },
      socialNetworksActivity: {
        select: { name: true },
      },
      trainingAttitude: {
        select: { name: true },
      },
    };
  }

  static selectShortUser() {
    return {
      id: true,
      name: true,
      age: true,
      description: true,
      isActivated: true,
      interests: { select: { name: true } },
      place: {
        select: { name: true, latitude: true, longitude: true },
      },
      pictures: {
        select: { name: true, order: true },
        orderBy: { order: 'asc' as 'asc' | 'desc' },
      },
      zodiacSign: {
        select: { name: true },
      },
      education: {
        select: { name: true },
      },
      childrenAttitude: {
        select: { name: true },
      },
      personalityType: {
        select: { name: true },
      },
      communicationStyle: {
        select: { name: true },
      },
      attentionSign: {
        select: { name: true },
      },
      alcoholAttitude: {
        select: { name: true },
      },
      chronotype: {
        select: { name: true },
      },
      foodPreference: {
        select: { name: true },
      },
      pet: {
        select: { name: true },
      },
      smokingAttitude: {
        select: { name: true },
      },
      socialNetworksActivity: {
        select: { name: true },
      },
      trainingAttitude: {
        select: { name: true },
      },
    };
  }
}
