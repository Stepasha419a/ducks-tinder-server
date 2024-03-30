export interface Chat {
  id: string;
  blocked: boolean;
  blockedById?: string;

  createdAt: string;
  updatedAt: string;
}
