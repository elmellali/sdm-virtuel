"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import styles from "./admin-layout.module.css";
import {
    LayoutDashboard,
    Building2,
    MapPin,
    FolderOpen,
    Settings,
    LogOut,
    Menu,
    X
} from "lucide-react";
import { useState } from "react";

// Fixing intentional typo here since we can't afford broken code
import NextLink from "next/link";

export default function AdminLayoutComponent({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // If we are on the login page, don't render the sidebar, just the content
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    const navigation = [
        { name: "Tableau de bord", href: "/admin", icon: LayoutDashboard },
        { name: "Promoteurs", href: "/admin/promoteurs", icon: Building2 },
        { name: "Projets", href: "/admin/projets", icon: FolderOpen },
        { name: "Médias", href: "/admin/medias", icon: FolderOpen },
        { name: "Paramètres", href: "/admin/parametres", icon: Settings },
    ];

    const handleLogout = () => {
        signOut({ callbackUrl: "/admin/login" });
    };

    return (
        <div className={styles.container}>
            {/* Mobile Topbar */}
            <div className={styles.mobileTopbar}>
                <div className="title-gradient" style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                    SDM Admin
                </div>
                <button
                    className={styles.mobileMenuButton}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`glass-panel ${styles.sidebar} ${isMobileMenuOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.sidebarHeader}>
                    <h2 className="title-gradient" style={{ fontSize: '1.5rem', fontWeight: 700 }}>SDM virtuel</h2>
                    <span className={styles.badge}>Admin</span>
                </div>

                <nav className={styles.nav}>
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <NextLink
                                key={item.name}
                                href={item.href}
                                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <item.icon size={20} />
                                {item.name}
                            </NextLink>
                        );
                    })}
                </nav>

                <div className={styles.sidebarFooter}>
                    <div className={styles.userInfo}>
                        <div className={styles.avatar}>
                            {session?.user?.name?.charAt(0) || "A"}
                        </div>
                        <div className={styles.userDetails}>
                            <span className={styles.userName}>{session?.user?.name || "Admin"}</span>
                            <span className={styles.userRole}>Administrateur</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className={styles.logoutButton}>
                        <LogOut size={20} />
                        Déconnexion
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                <div className={styles.content}>
                    {children}
                </div>
            </main>

            {/* Mobile overlay */}
            {isMobileMenuOpen && (
                <div
                    className={styles.overlay}
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </div>
    );
}
