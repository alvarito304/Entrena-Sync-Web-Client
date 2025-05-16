import {BodyPart} from './enums/body-part';
import {MuscleGroup} from './enums/muscle-group';
import {DifficultyLevel} from './enums/difficulty-level';

export interface ExerciseUpdateRequest {
  name?: string;
  description?: string;
  bodyPart?: BodyPart;
  muscleGroup?: MuscleGroup;
  equipment?: string;
  caloriesBurned?: number;
  difficulty?: DifficultyLevel;
  videoUrl?: string;
}
