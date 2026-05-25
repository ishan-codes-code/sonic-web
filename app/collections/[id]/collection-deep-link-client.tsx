'use client';
import { ListMusic } from 'lucide-react';
import { DeepLinkClient } from '@/app/components/DeepLinkClient';

interface CollectionDeepLinkClientProps {
  collectionId: string;
  isRemote?: boolean;
}

export function CollectionDeepLinkClient({ collectionId, isRemote }: CollectionDeepLinkClientProps) {
  return (
    <DeepLinkClient
      id={collectionId}
      isRemote={isRemote}
      type="collection"
      icon={<ListMusic className="w-12 h-12 text-amber-500" />}
      fallbackDescription="The Sonic app isn't currently installed on this device. Download it now to view and play this collection."
    />
  );

}
