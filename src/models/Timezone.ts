
// src/models/TimeZone.tz

export interface Timezone {
  id: number;
  name: string;
  display_name: string;
  utc_offset: string;
  is_dst: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface TimezoneInput {
  name: string;
  display_name: string;
  utc_offset: string;
  is_dst?: boolean;
}