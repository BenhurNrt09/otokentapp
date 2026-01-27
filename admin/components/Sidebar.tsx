"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Car,
    MessageSquare,
    Bell,
    FileText,
    Settings,
    ChevronLeft,
    ChevronRight,
    Menu,
    X
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SidebarProps {
    className?: string;
}

const menuItems = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
    },
    {
        title: "Kullanıcılar",
        icon: Users,
        href: "/dashboard/users",
        submenu: [
            { title: "Tüm Kullanıcılar", href: "/dashboard/users" },
            { title: "Silinmiş Kullanıcılar", href: "/dashboard/users/deleted" },
        ]
    },
    {
        title: "Araçlar",
        icon: Car,
        href: "/dashboard/vehicles",
        submenu: [
            { title: "Tüm İlanlar", href: "/dashboard/vehicles" },
            { title: "Yeni İlan Ekle", href: "/dashboard/vehicles/new" },
            { title: "Kategoriler", href: "/dashboard/vehicles/categories" },
        ]
    },
    {
        title: "Mesajlar",
        icon: MessageSquare,
        href: "/dashboard/messages",
    },
    {
        title: "Bildirimler",
        icon: Bell,
        href: "/dashboard/notifications",
    },
    {
        title: "Reklam Görselleri",
        icon: FileText,
        href: "/dashboard/content/advertisements",
    },
    {
        title: "Gelen Teklifler",
        icon: FileText, // Using FileText or maybe a better icon like Wallet or Tag if available, sticking to existing import
        href: "/dashboard/offers",
    },
    {
        title: "SSS",
        icon: FileText,
        href: "/dashboard/content/faqs",
    },
    {
        title: "Politikalar",
        icon: FileText,
        href: "/dashboard/content/policies",
    },
    {
        title: "Ayarlar",
        icon: Settings,
        href: "/dashboard/settings",
    },
];

export default function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

    const toggleSubmenu = (title: string) => {
        setOpenSubmenu(openSubmenu === title ? null : title);
    };

    const isActive = (href: string) => {
        if (href === "/dashboard") {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between p-4 border-b">
                {!isCollapsed && (
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <img src="/logo.png" alt="OtoKent" className="w-12 h-12 object-contain" />
                    </Link>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:bg-gray-100 rounded-lg hidden lg:block"
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                {menuItems.map((item) => (
                    <div key={item.title}>
                        <Link
                            href={item.href}
                            onClick={() => item.submenu && toggleSubmenu(item.title)}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                                isActive(item.href)
                                    ? "bg-blue-50 text-blue-600 font-medium"
                                    : "text-gray-700 hover:bg-gray-100",
                                isCollapsed && "justify-center"
                            )}
                        >
                            <item.icon size={20} />
                            {!isCollapsed && <span>{item.title}</span>}
                            {!isCollapsed && item.submenu && (
                                <ChevronRight
                                    size={16}
                                    className={cn(
                                        "ml-auto transition-transform",
                                        openSubmenu === item.title && "rotate-90"
                                    )}
                                />
                            )}
                        </Link>

                        {/* Submenu */}
                        {!isCollapsed && item.submenu && openSubmenu === item.title && (
                            <div className="ml-9 mt-1 space-y-1">
                                {item.submenu.map((subItem) => (
                                    <Link
                                        key={subItem.href}
                                        href={subItem.href}
                                        className={cn(
                                            "block px-3 py-2 text-sm rounded-lg transition-colors",
                                            pathname === subItem.href
                                                ? "bg-blue-50 text-blue-600 font-medium"
                                                : "text-gray-600 hover:bg-gray-100"
                                        )}
                                    >
                                        {subItem.title}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            {/* User Info */}
            {!isCollapsed && (
                <div className="p-4 border-t">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                            A
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-sm">Admin</p>
                            <p className="text-xs text-gray-500">admin@otokent.com</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
            >
                {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    "hidden lg:block fixed left-0 top-0 h-full bg-white border-r transition-all duration-300 z-30",
                    isCollapsed ? "w-20" : "w-64",
                    className
                )}
            >
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            <aside
                className={cn(
                    "lg:hidden fixed left-0 top-0 h-full bg-white border-r transition-transform duration-300 z-50 w-64",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <SidebarContent />
            </aside>
        </>
    );
}
