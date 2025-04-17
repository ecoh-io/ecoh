export interface ParsedTextContentProps {
  text: string;
  isExpanded: boolean;
  onHashtagPress?: (hashtag: string) => void;
  onMentionPress?: (mention: string) => void;
  onLinkPress?: (url: string) => void;
  color?: string;
}
