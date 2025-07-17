import { SignUpRepositoryInterface } from '@/backend/users/signup/domains/repositories/SignUpRepositoryInterface';
import { SignUpDto } from '../dtos/SignUpDto';

const SNACKS = [
  "cookie", "biscuit", "chip", "cracker", "pretzel",
  "popcorn", "candy", "chocolate", "gummy", "wafer",
  "brownie", "donut", "muffin", "cupcake", "pie",
  "granola", "marshmallow", "jelly", "toffee", "bar"
];


export class SignUpUsecase {
  private repository: SignUpRepositoryInterface;

  constructor(repository: SignUpRepositoryInterface) {
    this.repository = repository;
  }

  async execute(dto: SignUpDto) {
    //여기에 비즈니스 로직 구현
    dto.nickname = `${generateNickname()}${generateFourDigitRandom()}`
    return await this.repository.signUp(dto);
  }
}


function generateFourDigitRandom() {
  return Math.floor(1000 + Math.random() * 9000);
}



function generateNickname(): string {
  return SNACKS[Math.floor(Math.random() * SNACKS.length)];
}