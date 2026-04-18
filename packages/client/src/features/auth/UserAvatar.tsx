import './UserAvatar.css';

interface UserAvatarProps {
  displayName: string;
  thumbnailSrc: string | undefined;
}

export default function UserAvatar({ displayName, thumbnailSrc }: UserAvatarProps) {
  const initial = displayName?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="user-avatar">
      {thumbnailSrc ? (
        <img
          className="user-avatar__image"
          src={thumbnailSrc}
          alt={displayName}
          title={displayName}
        />
      ) : (
        <div className="user-avatar__placeholder" title={displayName}>
          {initial}
        </div>
      )}
    </div>
  );
}
