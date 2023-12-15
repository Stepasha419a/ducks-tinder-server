export interface Picture {
  id: string;
  userId: string;
  name: string;
  order: number;

  createdAt: string;
  updatedAt: string;
}

export interface UserPictureInfo {
  name: string;
  order: number;
}
