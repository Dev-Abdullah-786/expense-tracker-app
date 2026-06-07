import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { styles } from "../assets/dummyStyles";
import type { LayoutProps } from "../types/api.types";

const Layout = ({ onLogout, user, children }: LayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={styles.layout.root}>
      <Navbar user={user} onLogout={onLogout} />
      <div className="flex">
        <Sidebar
          user={user}
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
          onLogout={onLogout}
        />
        <div className={styles.layout.mainContainer(sidebarCollapsed)}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
