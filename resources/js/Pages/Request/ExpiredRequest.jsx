import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, router } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import Modal from "@/Components/Modal";

import { useState } from "react";

export default function ExpiredRequest({ tableData, tableFilters, emp_data }) {

    const getStatusBadge = (status) => {
    let badgeColor = "";
    let displayStatus = status; // default display

    switch (status) {
        case "Deleted":
            displayStatus = "Expired"; // 💡 display Expired instead of Deleted
            badgeColor = "text-red-600 bg-blue-200 border-red-700 hover:bg-red-800 hover:text-white hover:border-white";
            break;
        default:
            badgeColor = "text-gray-600 bg-gray-100 border-gray-700 hover:bg-gray-800 hover:text-white hover:border-white";
    }

    return (
        <span
            className={`px-3 py-1 rounded-md border-2 text-sm font-semibold ${badgeColor}`}
        >
            {displayStatus || "N/A"}
        </span>
    );
};


    const tableRows = tableData.data.map((row) => ({
    ...row,
    status_badge: getStatusBadge(row.status),
    }));


    return (
        <AuthenticatedLayout>
            <Head title="Manage Expired Request" />

            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-red-500">
                    <i className="fa-solid fa-ban"></i> Expired Request
                </h1>
            </div>

            <DataTable
                            columns={[
                                { key: "date", label: "Request Date" },
                                { key: "date_updated", label: "Date Expired" },
                                { key: "emp_name", label: "Technician Name" },
                                { key: "package_from", label: "Package From" },
                                { key: "package_to", label: "Package To" },
                                { key: "case_no", label: "Case No" },
                                { key: "machine", label: "Machine" },
                                { key: "status_badge", label: "Status" },
                            ]}
                            data={tableRows}
                            meta={{
                                from: tableData.from,
                                to: tableData.to,
                                total: tableData.total,
                                links: tableData.links,
                                currentPage: tableData.current_page,
                                lastPage: tableData.last_page,
                            }}
                            routeName={route("expired.conversionkit.request")}
                            filters={tableFilters}
                            rowKey="id"
                            showExport={false}
                        />
        </AuthenticatedLayout>
    );
}
