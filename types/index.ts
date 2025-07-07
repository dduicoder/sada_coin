export type User = {
  id: string;
  name: string;
  hash: string;
  type: string;
};

export type Transaction = {
  id: string;
  amount: number;
  transaction_type: "club_to_student" | "student_to_club";
  timestamp: string;
  title: string;
};

export type Activity = {
  id: number;
  title: string;
  description: string;
  amount: number;
  type: "club_to_student" | "student_to_club";
  club_id: string;
};
