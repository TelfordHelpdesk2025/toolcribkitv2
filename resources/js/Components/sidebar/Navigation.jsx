import Dropdown from "@/Components/sidebar/Dropdown";
import SidebarLink from "@/Components/sidebar/SidebarLink";
import { usePage } from "@inertiajs/react";

export default function NavLinks() {
    const { emp_data } = usePage().props;
    return (
        <nav
            className="flex flex-col flex-grow space-y-1 overflow-y-auto"
            style={{ scrollbarWidth: "none" }}
        >
            <SidebarLink
                href={route("dashboard")}
                label="Dashboard"
                icon={<i className="fa-solid fa-gauge"></i>}
            />

            <Dropdown
                label="Requested Items"
                icon={<i className="fa-solid fa-arrows-turn-to-dots"></i>}
                links={[
                    {
                        href: route("conversionkit.request.index"),
                        label: "Conversion Kits",
                    },
                    {
                        href: route("toolkit.request.index"),
                        label: "Tools",
                    },
                ]}
            />

            <Dropdown
                label="Borrowed Items"
                icon={<i className="fa-solid fa-hands-bound"></i>}
                links={[
                    {
                        href: route("conversionkit.borrowed.index"),
                        label: "Conversion Kits",
                    },
                    {
                        href: route("toolkit.borrowed.index"),
                        label: "Tools",
                    },
                ]}
            />
{["superadmin", "admin"].includes(emp_data?.emp_system_role) || ["1710", "16103", "1707"].includes(emp_data?.emp_id) && (
            <Dropdown
                label="Returned Items"
                icon={<i className="fa-solid fa-boxes-packing"></i>}
                links={[
                    {
                        href: route("conversionkit.returned.index"),
                        label: "Conversion Kits",
                    },
                    {
                        href: route("toolkit.returned.index"),
                        label: "Tools",
                    },
                ]}
            />
)}
{["superadmin", "admin"].includes(emp_data?.emp_system_role) || ["1710", "16103", "1707"].includes(emp_data?.emp_id) && (
            <Dropdown
                label="Inventory"
                icon={<i className="fa-solid fa-list-ol"></i>}
                links={[
                    {
                        href: route("conversionkit.index"),
                        label: "Conversion Kits",
                    },
                    {
                        href: route("toolkit.index"),
                        label: "Tools",
                    },
                ]}
            />
)}

            {["superadmin", "admin"].includes(emp_data?.emp_system_role) && (
                <div>
                    <SidebarLink
                        href={route("admin")}
                        label="Administrators"
                        icon={<i className="fa-solid fa-user-shield"></i>}
                    />
                </div>
            )}
            {["superadmin"].includes(emp_data?.emp_system_role) && (
                <div>
                    <SidebarLink
                        href={route("employees.index")}
                        label="Employee List"
                        icon={<i className="fa-solid fa-user-shield"></i>}
                    />
                </div>
            )}
        </nav>
    );
}
