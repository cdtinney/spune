import UsersSection from '../features/admin/UsersSection';
import SessionsSection from '../features/admin/SessionsSection';
import KeepaliveSection from '../features/admin/KeepaliveSection';
import LogsSection from '../features/admin/LogsSection';
import './AdminPage.css';

export default function AdminPage() {
  return (
    <div className="admin-page">
      <h1 className="admin-page__title">Admin</h1>
      <UsersSection />
      <SessionsSection />
      <KeepaliveSection />
      <LogsSection />
    </div>
  );
}
