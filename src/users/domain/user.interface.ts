export interface User {
  id: string;
  password: string;
  email: string;
  name: string;
  description?: string;
  nickname?: string;
  isActivated: boolean;
  activationLink: string;
  age?: number;
  sex?: string;
  distance?: number;
  usersOnlyInDistance?: boolean;
  preferSex?: string;
  preferAgeFrom?: number;
  preferAgeTo?: number;

  createdAt: string;
  updatedAt: string;

  //token?: Token;
  //pictures: Picture[]
  //interests: Interest[]

  //messages: Message[]
  //chats: Chat[]
  //chatsVisit: ChatVisit[]

  //pairFor: User[]
  //pairs: User[]

  //place?: Place

  //checked: CheckedUsers[]
  //wasChecked: CheckedUsers[]

  //zodiacSign?: ZodiacSign
  //zodiacSignId?: String

  //education?:   Education
  //educationId?: String

  //childrenAttitude?: ChildrenAttitude
  //childrenAttitudeId?: String

  //personalityType?: PersonalityType
  //personalityTypeId?: String

  //communicationStyle?: CommunicationStyle
  //communicationStylesId?: String

  //attentionSign?: AttentionSign
  //attentionSignsId?: String

  //pet?: Pet
  //petId?: String

  //alcoholAttitude?: AlcoholAttitude
  //alcoholAttitudeId?: String

  //smokingAttitude?: SmokingAttitude
  //smokingAttitudeId?: String?

  //trainingAttitude?: TrainingAttitude
  //trainingAttitudeId?: String?

  //foodPreference?: FoodPreference
  //foodPreferenceId?: String

  //socialNetworksActivity?: SocialNetworksActivity
  //socialNetworksActivityId?: String

  //chronotype?: Chronotype
  //chronotypeId?: String
}
