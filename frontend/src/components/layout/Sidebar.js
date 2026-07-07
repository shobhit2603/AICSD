import React from "react";
import {
  SquaresFour,
  Package,
  Wallet,
  UserPlus,
  Broadcast,
  Storefront,
  Truck,
  MagnifyingGlass,
  ChartBar,
  FileText,
  SignOut,
  CaretDoubleLeft,
  Money,
} from "@phosphor-icons/react";

export default function Sidebar() {
  const menuItems = [
    { name: "Dashboard", icon: SquaresFour, active: true },
    { name: "Orders", icon: Package },
    {
      name: "Finance",
      icon: Wallet,
    },
    { name: "Onboarding", icon: UserPlus },
    { name: "Live OMT", icon: Broadcast },
    { name: "Vendors", icon: Storefront },
    { name: "Shippers", icon: Truck },
    { name: "Tracking", icon: MagnifyingGlass },
    { name: "Statistics", icon: ChartBar },
    { name: "POD Dashboard", icon: FileText },
  ];

  return (
    <div className="w-64 bg-white h-screen flex flex-col border-r border-slate-200 shrink-0 sticky top-0 overflow-y-auto">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-brand-orange font-semibold text-2xl tracking-wide">
          ReeRoute
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1">
        {menuItems.map((item) => (
          <div key={item.name}>
            <button
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                item.active
                  ? "bg-orange-50 text-brand-orange"
                  : "text-slate-600 hover:bg-slate-50 hover:text-brand-black"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  size={20}
                  weight={item.active ? "duotone" : "regular"}
                  className={
                    item.active ? "text-brand-orange" : "text-slate-400"
                  }
                />
                {item.name}
              </div>
            </button>

            {/* Sub-items */}
            {item.subItems && (
              <div className="mt-1 space-y-1">
                {item.subItems.map((subItem) => (
                  <button
                    key={subItem.name}
                    className="w-full flex items-center gap-3 pl-11 pr-3 py-2 text-sm text-slate-500 hover:text-brand-black transition-colors"
                  >
                    <subItem.icon size={16} className="text-slate-400" />
                    {subItem.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-100 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
          <SignOut size={20} className="text-slate-400" />
          Logout
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors">
          <CaretDoubleLeft size={20} className="text-slate-400" />
          Collapse
        </button>
      </div>
    </div>
  );
}
