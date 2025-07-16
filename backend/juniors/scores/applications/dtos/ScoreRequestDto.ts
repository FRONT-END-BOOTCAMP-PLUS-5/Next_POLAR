export class ScoreRequestDtoWithCategoryId {
  constructor(public readonly categoryId: number) {}
}

export class ScoreRequestDtoWithSeason {
  constructor(public readonly season: number) {}
}

export class ScoreRequestDtoWithCategoryIdAndSeason {
  constructor(
    public readonly categoryId: number,
    public readonly season: number
  ) {}
}

export class ScoreRequestDtoWithNickname {
  constructor(public readonly nickname: string) {}
}

export class ScoreRequestDtoWithNicknameAndSeason {
  constructor(
    public readonly nickname: string,
    public readonly season: number
  ) {}
}

export class ScoreRequestDtoWithNicknameAndCategoryId {
  constructor(
    public readonly nickname: string,
    public readonly categoryId: number
  ) {}
}
