import React from 'react';
import useMe from '../api/data/use-me';

export default function ProfilePage() {
  const { me } = useMe();
  return (
    <div>
      <h1>Profile</h1>
      <pre>{JSON.stringify(me, null, 2)}</pre>
    </div>
  );
}
