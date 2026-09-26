import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar title={title} subtitle={subtitle} />
        <main className="page-container">{children}</main>
      </div>
    </div>
  );
};
