import { SignUpRepositoryInterface } from '@/backend/users/signup/domains/repositories/SignUpRepositoryInterface';
import { SignUpDto } from '../dtos/SignUpDto';

const ADJECTIVES = [
  "Cute", "Brave", "Happy", "Wise", "Fast",
  "Relaxed", "Mysterious", "Cheerful", "Elegant", "Energetic"
];

const ANIMALS = [
  "Rabbit", "Tiger", "Fox", "Bear", "Lion",
  "Wolf", "Squirrel", "Cat", "Dog", "Penguin"
];


export class SignUpUsecase {
  private repository: SignUpRepositoryInterface;

  constructor(repository: SignUpRepositoryInterface) {
    this.repository = repository;
  }

  async execute(dto: SignUpDto) {
    //여기에 비즈니스 로직 구현
    dto.nickname = combineNickname(generateNickname(), generateFourDigitRandom());
    return await this.repository.signUp(dto);
  }
}


function generateFourDigitRandom() {
  return Math.floor(1000 + Math.random() * 9000);
}



function generateNickname(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  return `${adj}${animal}`;
}

function combineNickname(nickname: string, randomNumber: number): string {
  return `${nickname}${randomNumber}`;
}