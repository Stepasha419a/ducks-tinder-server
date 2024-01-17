import { Prisma } from '@prisma/client';

export class UserSelector {
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
}
