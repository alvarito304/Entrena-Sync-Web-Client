export interface Exercise {
  id: string;
  name: string;
  description: string | undefined;
  bodyPart: string;
  muscleGroup: string;
  equipment: string | undefined;
  caloriesBurned: number | undefined;
  difficulty: string;
  videoUrl: string;
  createdAt: Date;
  updatedAt: Date;
}
