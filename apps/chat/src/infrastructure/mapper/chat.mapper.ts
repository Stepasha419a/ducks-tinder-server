import { Message } from 'apps/chat/src/domain';
import {
  ChatPaginationValueObject,
  MessagesPaginationValueObject,
} from 'apps/chat/src/domain/value-object';
import { ShortUser } from 'apps/user/src/infrastructure/user/mapper/interface/short-user';
import { User } from 'apps/user/src/domain/user';
import { PictureValueObject } from 'apps/user/src/domain/user/value-object';
import { UserPictureInfo } from 'apps/user/src/infrastructure/user/mapper';
import {
  ChatMessage,
  ShortChatPagination,
  ShortMessage,
  ShortMessagesPagination,
} from './interface';

export class ChatMapper {
  getShortMessagesPagination(
    messagesPagination: MessagesPaginationValueObject,
  ): ShortMessagesPagination {
    const messages = messagesPagination.messages.map((message) =>
      this.getChatMessage(message),
    );

    const users = messagesPagination.users.map((user) =>
      this.getShortUser(user),
    );

    return { ...messagesPagination, messages, users };
  }

  getShortChatPagination(
    chatPagination: ChatPaginationValueObject,
  ): ShortChatPagination {
    const lastMessage = chatPagination.lastMessage
      ? this.getShortMessage(chatPagination.lastMessage)
      : null;

    return { ...chatPagination, lastMessage };
  }

  private getShortMessage(message: Message): ShortMessage {
    return {
      id: message.id,
      text: message.text,
      userId: message.userId,
      updatedAt: message.updatedAt,
      createdAt: message.createdAt,
    };
  }

  private getChatMessage(message: Message): ChatMessage {
    return {
      id: message.id,
      text: message.text,
      userId: message.userId,
      replied: message.replied,
      updatedAt: message.updatedAt,
      createdAt: message.createdAt,
    };
  }

  private getShortUser(user: User): ShortUser {
    const pictures = user.pictures.map((picture) =>
      this.getUserPictureInfo(picture),
    );

    return {
      id: user.id,
      name: user.name,
      age: user.age,
      description: user.description,
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
}
