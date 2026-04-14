import './UserAvatar.css';

export default function UserAvatar({ displayName, thumbnailSrc }) {
  return (
    <div className="user-avatar">
      <img
        className="user-avatar__image"
        src={thumbnailSrc}
        alt={displayName}
        title={displayName}
      />
      <span className="user-avatar__name">{displayName}</span>
    </div>
  );
}
