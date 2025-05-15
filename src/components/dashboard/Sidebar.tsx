"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { HomeIcon, CompassIcon, CalendarIcon, UserIcon } from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavItem[] = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  { name: "Explore", href: "/dashboard/explore", icon: CompassIcon },
  { name: "My Events", href: "/dashboard/my-events", icon: CalendarIcon },
  { name: "Profile", href: "/dashboard/profile", icon: UserIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-40 flex-col border-r border-space-300 bg-space-200">
      <div className="flex h-16 items-center border-b border-space-300 px-4">
        <h2 className="text-lg font-semibold text-blue-600">Join The Spot</h2>
      </div>
      <div className="relative flex-1">
        <nav className="absolute inset-0 space-y-1 px-2 py-4">
          {navigation.map((item) => {
            const isActive = pathname.endsWith(item.href);
            console.log(
              `Path: ${pathname}, Item: ${item.href}, IsActive: ${isActive}`
            );
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center rounded-md p-2 text-sm font-medium
                  ${
                    isActive
                      ? "bg-cosmic-500 text-white-100"
                      : "text-lunar-300 hover:bg-space-100 hover:text-white-100"
                  }
                  transition-colors duration-200
                `}
              >
                <item.icon
                  className={`
                    mr-3 size-5
                    ${isActive ? "text-terracotta-800" : "text-lunar-400"}
                  `}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="flex h-full items-center justify-center">
          <Image
            className="mt-4 h-auto w-full max-w-[200px]"
            src="/astronaut.png"
            width={200}
            height={200}
            alt="astronaut"
            sizes="(max-width: 100px) 100vw, 200px"
          />
        </div>
      </div>
    </div>
  );
}
