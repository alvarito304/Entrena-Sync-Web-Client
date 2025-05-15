import {BodyPart} from './enums/body-part';
import {MuscleGroup} from './enums/muscle-group';
import {DifficultyLevel} from './enums/difficulty-level';

export interface Exercise {
  id: string;
  name: string;
  description: string | undefined;
  bodyPart: BodyPart;
  muscleGroup: MuscleGroup;
  equipment: string | undefined;
  caloriesBurned: number | undefined;
  difficulty: DifficultyLevel;
  videoUrl: string;
  createdAt: Date;
  updatedAt: Date;
}
