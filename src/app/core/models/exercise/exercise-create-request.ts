import {DifficultyLevel} from './enums/difficulty-level';
import {MuscleGroup} from './enums/muscle-group';
import {BodyPart} from './enums/body-part';

export interface ExerciseCreateRequest {
  name: string;
  description: string;
  bodyPart: BodyPart;
  muscleGroup: MuscleGroup;
  equipment?: string;
  caloriesBurned: number;
  difficulty: DifficultyLevel;
  videoUrl?: string;
}
