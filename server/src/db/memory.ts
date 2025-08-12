export type ID = string;
export const db = {
  operations: [] as any[],
  users: new Map<ID, { id:ID; phone:string; name:string; chatId?:string }>(),
  projects: new Map<ID, { id:ID; title:string; memberIds:ID[] }>(),
  chats: new Map<ID, { id:ID; projectId:ID; title:string; memberIds:ID[] }>(),
  messages: new Map<ID, { id:ID; chatId:ID; senderId:ID; text:string; createdAt:number; opId?:ID }>(),
  invites: new Map<ID, { id:ID; projectId:ID; phone:string; code:string; createdAt:number; status:'pending'|'accepted'|'expired' }>(),
  authRequests: {} as Record<string, {phone:string, code:string, createdAt:number}>,
  telegramLinks: {} as Record<string, {phone:string, linkedAt:number}>
};
