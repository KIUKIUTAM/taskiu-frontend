import { Outlet } from 'react-router-dom';
import Header from '@/page/public/Layout/Header';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="h-16 md:h-20" /> {/* Spacer for fixed header */}
      <Outlet />
    </div>
  );
};

export default Layout;
