import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import styles from "./LayoutWrapper.module.css";

const LayoutWrapper = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className={styles.container}>
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className={styles.mainContent}>
        <Navbar onToggleSidebar={toggleSidebar} />
        <main className={styles.pageBody}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LayoutWrapper;
