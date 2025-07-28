export type Room = {
  id: string;
  code: string;
  status: 'lobby' | 'learning' | 'duo1' | 'duo2' | 'ended';
  host_id: string;
  alibi: string;
  questions: { id: string; text: string; duo: 1 | 2 }[];
};

export type Player = {
  id: string;
  pseudo: string;
  duo: 1 | 2 | null;
  is_host: boolean;
};

export type Response = {
  id: string;
  question_id: string;
  answer: string;
};