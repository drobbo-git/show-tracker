export interface Show {
  id: number;
  title: string;
  venue: string | null;
  date_seen: string | null;
  rating: number | null;
  notes: string | null;
  status: 'seen' | 'wishlist';
  created_at: string;
}

export interface ShowFormData {
  title: string;
  venue: string;
  date_seen: string;
  rating: number | '';
  notes: string;
  status: 'seen' | 'wishlist';
}
