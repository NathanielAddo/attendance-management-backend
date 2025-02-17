// biometric.ts

export interface Biometric {
    id: number;
    user_id: number;
    voice_data?: string | null;
    image_data?: string | null;
    created_at: Date;
    updated_at?: Date | null;
  }
  