export default function UserProfilePage({ params }: { params: { uuid: string } }) {
  return (
    <div>
      <h1>유저 프로필</h1>
      <p>UUID: {params.uuid}</p>
      <a href={`/user/profile/${params.uuid}/reviews`}>
        이 유저의 리뷰 보기
      </a>
    </div>
  );
} 