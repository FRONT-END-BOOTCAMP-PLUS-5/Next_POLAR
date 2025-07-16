import ProfileBanner from '../_components/ProfileBanner';
import ProfileCard from '../_components/ProfileCard';
import TierCard from '../_components/TierCard';

export default function TestComponentsPage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 40,
        alignItems: 'center',
        padding: 40,
      }}
    >
      <ProfileCard />
      <TierCard />
      <ProfileBanner />
    </div>
  );
}
