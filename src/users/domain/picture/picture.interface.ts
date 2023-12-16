export interface Picture {
  id: string;
  userId: string;
  name: string;
  order: number;

  createdAt: string;
  updatedAt: string;
}

export interface UserPictureInfo {
  id: string;
  name: string;
  order: number;
}
