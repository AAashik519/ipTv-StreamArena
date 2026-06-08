import ChannelCard from "@/components/ui/ChannelCard";
import { Channel } from "@/lib/types";

interface Props {
  channels: Channel[];
  showCategory?: boolean;
}

export default function ChannelGrid({ channels, showCategory = false }: Props) {
  if (channels.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <span className="text-4xl block mb-3">📺</span>
        <p className="text-lg font-medium">No channels found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {channels.map((channel) => (
        <ChannelCard key={channel.id} channel={channel} showCategory={showCategory} />
      ))}
    </div>
  );
}
