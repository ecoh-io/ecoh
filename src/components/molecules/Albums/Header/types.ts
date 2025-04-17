export interface HeaderProps {
  title: string;
  username: string;
  coverPhoto: string;
  onBack: () => void;
  onDeleteAlbum: () => void;
  onToggleEdit: () => void;
  editMode: boolean;
}
