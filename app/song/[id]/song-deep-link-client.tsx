'use client';
import { Disc3 } from 'lucide-react';
import { DeepLinkClient } from '@/app/components/DeepLinkClient';

interface SongDeepLinkClientProps {
  songId: string;
  isRemote?: boolean;
}

export function SongDeepLinkClient({ songId, isRemote }: SongDeepLinkClientProps) {
  return (
    <DeepLinkClient
      id={songId}
      isRemote={isRemote}
      type="song"
      icon={<Disc3 className="w-12 h-12 text-amber-500" />}
      fallbackDescription="The Sonic app isn't currently installed on this device. Download it now to start streaming your favorite music."
    />
  );
}
