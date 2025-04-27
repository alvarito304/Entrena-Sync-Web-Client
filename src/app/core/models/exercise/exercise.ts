export class Exercise {
  id: string;
  name: string;
  description: string | undefined;
  bodyPart: string;
  muscleGroup: string;
  equipment: string | undefined;
  caaloriesBurned: number | undefined;
  difficulty: string;
  videoUrl: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    name: string,
    description: string | undefined,
    bodyPart: string,
    muscleGroup: string,
    equipment: string | undefined,
    caaloriesBurned: number | undefined,
    difficulty: string,
    videoUrl: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.bodyPart = bodyPart;
    this.muscleGroup = muscleGroup;
    this.equipment = equipment;
    this.caaloriesBurned = caaloriesBurned;
    this.difficulty = difficulty;
    this.videoUrl = videoUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
