import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import Modal from "@/Components/Modal";
import { useState } from "react";

export default function Tools({ tableData, tableFilters, emp_data }) {
    // States
    const [selectedRow, setSelectedRow] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Add form
    const [form, setForm] = useState({
        item_no: "",
        tool_description: "",
        qty: "",
        location: "",
        serial_no: "",
        remarks: "",
        prodline: "",
        borrowed_status: "Available",
    });

    // Edit form
    const [editForm, setEditForm] = useState({
        id: "",
        item_no: "",
        tool_description: "",
        qty: "",
        location: "",
        serial_no: "",
        remarks: "",
        prodline: "",
        borrowed_status: "",
    });

    // 🟢 View Modal
    const openViewModal = (row) => {
        setSelectedRow(row);
        setIsViewModalOpen(true);
    };

    const closeViewModal = () => {
        setSelectedRow(null);
        setIsViewModalOpen(false);
    };

    // 🟢 Add Modal
    const saveNewKit = () => {
        if (!form.item_no || !form.tool_description || !form.qty || !form.location || !form.serial_no || !form.remarks || !form.prodline) {
            alert("⚠️ Please fill out required fields.");
            return;
        }

        router.post(route("toolkit.store"), form, {
            preserveScroll: true,
            onSuccess: () => {
                setIsAddModalOpen(false);
                setForm({
                    item_no: "",
                    tool_description: "",
                    qty: "",
                    location: "",
                    serial_no: "",
                    remarks: "",
                     prodline: "",
                    borrowed_status: "Available",
                });
                alert("✅ New tool kit added successfully!");
                router.visit(route("toolkit.index"));
            },
        });
    };

    // 🟢 Edit Modal Functions
    const openEditModal = (row) => {
        setEditForm(row);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const saveEditKit = () => {
        router.put(route("toolkit.update", editForm.id), editForm, {
            preserveScroll: true,
            onSuccess: () => {
                alert("✅ toolkit updated successfully!");
                setIsEditModalOpen(false);
                router.visit(route("toolkit.index"));
            },
        });
    };

    // Delete Function
    const deleteActivity = (id) => {
        if (confirm("⚠️ Are you sure you want to delete this toolkit?")) {
            router.delete(route("toolkit.destroy", id), {
                preserveScroll: true,
                onSuccess: () => {
                    alert("🗑️ toolkit deleted successfully!");
                    router.visit(route("toolkit.index"));
                },
            });
        }
    };

    // 🧩 Prepare table rows with action buttons
    const tableRows = tableData.data.map((row) => ({
        ...row,
        actions: (
            <div className="flex gap-2 justify-center">
                <button
                    className="px-3 py-2 bg-blue-600 text-white rounded-md"
                    onClick={() => openEditModal(row)}
                >
                    <i className="fa-solid fa-pen"></i>
                </button>

                <button
                    className="px-3 py-2 bg-red-600 text-white rounded-md"
                    onClick={() => deleteActivity(row.id)}
                >
                    <i className="fa-solid fa-trash"></i>
                </button>
            </div>
        ),
    }));

    return (
        <AuthenticatedLayout>
            <Head title="Tools Kit Inventory" />

            {/* Header + Add Button */}
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <i className="fa-solid fa-table-list"></i> Tools Kit Inventory
                </h1>

                <button
                    className="btn bg-green-600 text-white hover:bg-green-700 rounded-md"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    <i className="fa-solid fa-plus"></i> Add New
                </button>
            </div>

            {/* Data Table */}
            <DataTable
                columns={[
                    { key: "tool_description", label: "Description" },
                    { key: "qty", label: "Qty." },
                    { key: "location", label: "Location" },
                    { key: "serial_no", label: "Serial No" },
                    { key: "remarks", label: "Remarks" },
                    { key: "prodline", label: "Product Line" },
                    { key: "borrowed_status", label: "Status" },
                    { key: "actions", label: "Actions" },
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
                routeName={route("toolkit.index")}
                filters={tableFilters}
                rowKey="id"
                showExport={false}
            />

            {/* 🟢 View Modal */}
            {isViewModalOpen && selectedRow && (
                <Modal
                    id="RowModal"
                    title="toolkit Kit Details"
                    show={true}
                    onClose={closeViewModal}
                    className="w-[400px] max-w-none"
                >
                    <div className="space-y-2">
                        <p><strong>Case No:</strong> {selectedRow.case_no}</p>
                        <p><strong>Asset No:</strong> {selectedRow.asset_no}</p>
                        <p><strong>Model:</strong> {selectedRow.model}</p>
                        <p><strong>Serial No:</strong> {selectedRow.serial_no}</p>
                        <p><strong>Package To:</strong> {selectedRow.package_to}</p>
                        <p><strong>Location:</strong> {selectedRow.location}</p>
                        <p><strong>Machine:</strong> {selectedRow.machine}</p>
                        <p><strong>Condition:</strong> {selectedRow.condition}</p>
                        <p><strong>Status:</strong> {selectedRow.borrowed_status}</p>
                    </div>

                    <div className="flex justify-end mt-4">
                        <button
                            className="btn bg-gray-600 hover:bg-gray-700 text-white"
                            onClick={closeViewModal}
                        >
                            Close
                        </button>
                    </div>
                </Modal>
            )}

            {/* 🟢 Add Modal */}
            {isAddModalOpen && (
                <Modal
                    id="AddKitModal"
                    title="Add New toolkit Kit"
                    show={true}
                    onClose={() => setIsAddModalOpen(false)}
                    className="w-[400px] max-w-none"
                >
                    <div className="grid grid-cols-1 gap-3">
                        {[
                             "item_no",
                            "tool_description",
                            "qty",
                            "location",
                            "serial_no",
                            "remarks",
                            "prodline",
                        ].map((field) => (
                            <div key={field}>
                                <label className="block text-sm mb-1 capitalize">
                                    {field.replace("_", " ")}
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={form[field]}
                                    onChange={(e) =>
                                        setForm({ ...form, [field]: e.target.value })
                                    }
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            className="btn bg-red-600 text-white hover:bg-red-700 mr-2 rounded-md"
                            onClick={() => setIsAddModalOpen(false)}
                        >
                            <i className="fa-solid fa-x"></i> Cancel
                        </button>
                        <button
                            className="btn bg-green-600 text-white hover:bg-green-700 rounded-md"
                            onClick={saveNewKit}
                        >
                            <i className="fa-solid fa-floppy-disk"></i> Save
                        </button>
                    </div>
                </Modal>
            )}

            {/* 🟢 Edit Modal */}
            {isEditModalOpen && (
                <Modal
                    id="EditKitModal"
                    title="Edit toolkit Kit"
                    show={true}
                    onClose={closeEditModal}
                    className="w-[400px] max-w-none"
                >
                    <div className="grid grid-cols-1 gap-3">
                        {[
                            "item_no",
                            "tool_description",
                            "qty",
                            "location",
                            "serial_no",
                            "remarks",
                            "prodline",
                        ].map((field) => (
                            <div key={field}>
                                <label className="block text-sm mb-1 capitalize">
                                    {field.replace("_", " ")}
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={editForm[field] || ""}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, [field]: e.target.value })
                                    }
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            className="btn bg-red-600 text-white hover:bg-red-700 mr-2 rounded-md"
                            onClick={closeEditModal}
                        >
                            <i className="fa-solid fa-x"></i>
                            Cancel
                        </button>
                        <button
                            className="btn bg-blue-600 text-white hover:bg-blue-700 rounded-md"
                            onClick={saveEditKit}
                        >
                            <i className="fa-solid fa-floppy-disk"></i>
                            Save Changes
                        </button>
                    </div>
                </Modal>
            )}
        </AuthenticatedLayout>
    );
}
