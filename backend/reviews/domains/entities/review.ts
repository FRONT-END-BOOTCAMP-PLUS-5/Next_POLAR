export class ReviewEntity {
  constructor(
    public readonly id: number | undefined, // 리뷰 고유 ID
    public helpId: number, // 도움 요청 ID
    public writerId: string, // 작성자 UUID
    public receiverId: string, // 피드백 받는 사람 UUID
    public writerNickname: string, // 작성자 닉네임
    public receiverNickname: string, // 피드백 받는 사람 닉네임
    public rating: number, // 평점
    public text: string, // 리뷰 내용
    public reviewImgUrl: string | null, // 리뷰 이미지 URL
    public readonly createdAt: Date | undefined // 생성일시
  ) {}

  toJSON() {
    return {
      id: this.id,
      helpId: this.helpId,
      writerId: this.writerId,
      receiverId: this.receiverId,
      writerNickname: this.writerNickname,
      receiverNickname: this.receiverNickname,
      rating: this.rating,
      text: this.text,
      reviewImgUrl: this.reviewImgUrl,
      createdAt: this.createdAt,
    };
  }
}
