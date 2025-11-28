import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import Modal from "@/Components/Modal";
import { useState, useEffect } from "react";

export default function ConversionKit({ tableData, tableFilters, emp_data }) {
    // States
    const [selectedRow, setSelectedRow] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    function generateConversionKitId() {
  // Generate random 5-letter combination of upper and lower case
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let randomLetters = "";
  for (let i = 0; i < 5; i++) {
    randomLetters += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  // Generate random number (example: 9 digits)
  const randomNumber = Math.floor(Math.random() * 900000000) + 100000000;

  return `${randomLetters}-${randomNumber}`;
}

    // Add form
    const [form, setForm] = useState({
        conversionkit_id: "",
        case_no: "",
        asset_no: "",
        model: "",
        serial_no: "",
        package_to: "",
        location: "",
        machine: "",
        condition: "",
        borrowed_status: "Returned",
    });

    // Edit form
    const [editForm, setEditForm] = useState({
        id: "",
        conversionkit_id: "",
        case_no: "",
        asset_no: "",
        model: "",
        serial_no: "",
        package_to: "",
        location: "",
        machine: "",
        condition: "",
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

     // Auto-generate ID when modal opens
  useEffect(() => {
    if (isAddModalOpen) {
      setForm((prev) => ({ ...prev, conversionkit_id: generateConversionKitId() }));
    }
  }, [isAddModalOpen]);

    // 🟢 Add Modal
    const saveNewKit = () => {
        if (!form.case_no || !form.asset_no || !form.model) {
            alert("⚠️ Please fill out required fields.");
            return;
        }

        router.post(route("conversionkit.store"), form, {
            preserveScroll: true,
            onSuccess: () => {
                setIsAddModalOpen(false);
                setForm({
                    conversionkit_id: "",
                    case_no: "",
                    asset_no: "",
                    model: "",
                    serial_no: "",
                    package_to: "",
                    location: "",
                    machine: "",
                    condition: "",
                    borrowed_status: "Available",
                });
                alert("✅ New conversion kit added successfully!");
                router.visit(route("conversionkit.index"));
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
    router.put(route("conversionkit.update", editForm.id), editForm, {
        preserveScroll: true,
        onSuccess: (page) => {
            alert("✅ Conversion kit updated successfully!");
            setIsEditModalOpen(false);
            router.visit(route("conversionkit.index")); // optional
        },
        onError: (errors) => {
            console.log("Validation errors:", errors);
            alert("❌ Validation failed. Check console.");
        },
    });
};


    // 🗑️ Delete Function
    const deleteActivity = (id) => {
        if (confirm("⚠️ Are you sure you want to delete this conversion kit?")) {
            router.delete(route("conversionkit.destroy", id), {
                preserveScroll: true,
                onSuccess: () => {
                    alert("🗑️ Conversion kit deleted successfully!");
                    router.visit(route("conversionkit.index"));
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
            <Head title="Conversion Kits Inventory" />

            {/* Header + Add Button */}
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <i className="fa-solid fa-list-ol"></i> Conversion Kits Inventory
                </h1>

                <button
                    className="btn bg-green-600 text-white hover:bg-green-700 rounded-md"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    <i className="fa-solid fa-plus"></i> Add New Kit
                </button>
            </div>

            {/* Data Table */}
            <DataTable
                columns={[
                    { key: "asset_no", label: "Asset" },
                    { key: "model", label: "Model" },
                    { key: "serial_no", label: "Serial" },
                    { key: "package_to", label: "Package" },
                    { key: "location", label: "Location" },
                    { key: "machine", label: "Machine" },
                    { key: "condition", label: "Condition" },
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
                routeName={route("conversionkit.index")}
                filters={tableFilters}
                rowKey="id"
                showExport={false}
            />

            {/* 🟢 View Modal */}
            {isViewModalOpen && selectedRow && (
                <Modal
                    id="RowModal"
                    title="Conversion Kit Details"
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
          icon={<i className="fa-solid fa-plus"></i>}
          title="Add New Conversion Kit"
          show={true}
          onClose={() => setIsAddModalOpen(false)}
          className="w-[400px] max-w-none"
        >
          <div className="grid grid-cols-1 gap-3">
            {[
              "conversionkit_id",
              "case_no",
              "asset_no",
              "model",
              "serial_no",
              "package_to",
              "location",
              "machine",
              "condition",
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
                  readOnly={field === "conversionkit_id"} // Read-only for the generated ID
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
                    title="Edit Conversion Kit"
                    show={true}
                    onClose={closeEditModal}
                    className="w-[400px] max-w-none"
                >
                    <div className="grid grid-cols-1 gap-3">
                        {[
                            "case_no",
                            "asset_no",
                            "model",
                            "serial_no",
                            "package_to",
                            "location",
                            "machine",
                            "condition",
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
