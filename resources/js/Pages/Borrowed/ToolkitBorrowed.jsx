import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, router } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import Modal from "@/Components/Modal";
import { useEffect, useState } from "react";

export default function ToolkitBorrowed({ tableData, tableFilters, emp_data, empData }) {

const [isAssessModalOpen, setIsAssessModalOpen] = useState(false);
const [isViewModalOpen, setIsViewModalOpen] = useState(false);
const [selectedRow, setSelectedRow] = useState(null);

const openEditModal = (row) => {
  setSelectedRow(row);
  setIsAssessModalOpen(true);
};

const openViewModal = (row) => {
  setSelectedRow(row);
  setIsViewModalOpen(true);
};

const closeModals = () => {
  setIsAssessModalOpen(false);
  setIsViewModalOpen(false);
  setSelectedRow(null);
};


    const empname = empData?.EMPNAME;

     const getStatusBadge = (status) => {
        let badgeColor = "";
        switch (status) {
            
            case "Borrowed":
                badgeColor = "bg-red-200 text-red-500 border-red-600 hover:bg-red-600 hover:text-white hover:border-red-100";
                break;

            case "Turnover":
                badgeColor = "bg-gray-200 text-gray-500 border-gray-600 hover:bg-gray-600 hover:text-white hover:border-gray-100";
                break;
        }

        return (
            <span
                className={`px-3 py-1 rounded-md border-2 text-sm font-semibold ${badgeColor}`}
            >
                {status || "N/A"}
            </span>
        );
    };

     // 🎨 Generate all colors with random shade from 100–500
    const baseColors = [
      "pink", "red", "orange", "amber", "yellow", "lime",
      "green", "emerald", "teal", "cyan", "sky", "blue",
      "indigo", "violet", "purple", "fuchsia", "rose"
    ];
    
    const shades = [200, 300, 400, 500];
    
    // 🔹 Randomize shade per color
    const colors = baseColors.map(color => {
      const randomShade = shades[Math.floor(Math.random() * shades.length)];
      return `text-${color}-${randomShade}`;
    });
    
    // 🔹 Shuffle the final array (Fisher–Yates shuffle)
    for (let i = colors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [colors[i], colors[j]] = [colors[j], colors[i]];
    }
    
    
    
        const [currentColor, setCurrentColor] = useState(colors[0]);
    
        useEffect(() => {
            let index = 0;
            const interval = setInterval(() => {
                index = (index + 1) % colors.length;
                setCurrentColor(colors[index]);
            }, 5000); // 🔄 Change every 2 second
    
            return () => clearInterval(interval);
        }, []);

const tableRows = tableData.data.map((row) => ({
  ...row,
  status_badge: getStatusBadge(row.status),
  actions: (() => {

    if (
      ["superadmin", "admin", "toolcrib"].includes(emp_data?.emp_system_role) && ["16103", "1710", "1707"].includes(emp_data?.emp_id) &&
      row.status === "Turnover"
    ) {
      return (
        <button
          className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 border border-green-800 hover:border-green-100"
          onClick={() => openEditModal(row)}
        >
          <i className="fa-solid fa-check-to-slot"></i> Accept
        </button>
      );
    }

      if (
      empData?.EMPNAME === row.emp_name &&
      row.status === "Borrowed"
    ) {
      return (
        <button
          className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 border border-blue-800 hover:border-blue-100"
          onClick={() => openViewModal(row)}
        >
          <i className="fas fa-eye mr-1"></i> View
        </button>
      );
    }

   if (row.status === "Borrowed") {
      return (
        <p className={`${currentColor} text-sm flex items-center transition-colors text-red-600 duration-500 animate-pulse`}>
        <i className="fa-solid fa-triangle-exclamation mr-2"></i>
        Borrower only can Return<br />this Item
      </p>
      );
    }

    return (
      <p className={`${currentColor} text-sm flex items-center transition-colors text-sky-600 duration-500`}>
        <i className="fa-solid fa-arrows-rotate mr-2 animate-spin"></i>
        Waiting to Accept by ToolCrib<br></br> Personnel
      </p>
    );
  })(),
}));


const [returned_remarks, setReturnedRemarks] = useState("");
const [accept_remarks, setAcceptRemarks] = useState("");



    return (
        <AuthenticatedLayout>
            <Head title="Borrowed Conversion Kits" />

            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold animate-bounce"><i className="fa-solid fa-arrow-up-right-from-square mr-2"></i>Borrowed Tool Kits</h1>
            </div>

            <DataTable
                columns={[
                    { key: "date", label: "Start Date" },
                    { key: "emp_name", label: "Technician Name" },
                    { key: "team", label: "Team" },
                    { key: "item", label: "Tools" },
                    { key: "location_use", label: "Location of Use" },
                    { key: "purpose", label: "Purpose" },
                    { key: "status_badge", label: "Status" },
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
                routeName={route("toolkit.borrowed.index")}
                filters={tableFilters}
                rowKey="EMPLOYID"
                // selectable={true}
                // onSelectionChange={setSelectedRows}
                // dateRangeSearch={true}
                showExport={false}
            >
                
            
            </DataTable>

                {isAssessModalOpen && selectedRow && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-2xl p-6 border-t-4 border-emerald-500">
      <h2 className="text-xl font-bold text-emerald-600 mb-4">
        <i className="fa-solid fa-clipboard-list mr-2"></i> Assess Request
      </h2>

      <div className="space-y-2 text-gray-700">
         <div className="grid grid-cols-2 gap-4">
           <div>
                <label htmlFor="" className="text-emerald-500">Date Returned</label>
                <input type="text" name="returned_date" value={selectedRow.returned_date} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
            <div>
                <label htmlFor="" className="text-emerald-500">Returned By</label>
                <input type="text" name="returned_by" value={selectedRow.returned_by} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
            <div>
                <label htmlFor="">Date</label>
                <input type="text" name="date" value={selectedRow.date} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
            <div>
                <label htmlFor="">Badge</label>
                <input type="text" name="emp_id" value={selectedRow.emp_id} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
            <div>
                <label htmlFor="">Technician</label>
                <input type="text" name="emp_name" value={selectedRow.emp_name} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
            <div>
                <label htmlFor="">Team</label>
                <input type="text" name="team" value={selectedRow.team} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
            <div>
                <label htmlFor="">Production Line</label>
                <input type="text" name="productline" value={selectedRow.productline} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
            <div>
                <label htmlFor="">Tools</label>
                <input type="text" name="item" value={selectedRow.item} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
            <div>
                <label htmlFor="">Serial No.</label>
                <input type="text" name="serial_no" value={selectedRow.serial_no} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
            <div>
                <label htmlFor="">Locatione</label>
                <input type="text" name="location" value={selectedRow.location} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
            <div>
                <label htmlFor="">Location of Use</label>
                <input type="text" name="location_use" value={selectedRow.location_use} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
            <div>
                <label htmlFor="">Status</label>
                <input type="text" name="status" value={selectedRow.status} className="w-full border border-gray-700 text-white rounded-md p-2 pointer-events-none bg-gray-500" readOnly/>
            </div>
          </div>
            <div>
                <label htmlFor="">Purpose</label>
                <input type="text" name="purpose" value={selectedRow.purpose} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
            <div>
        
                <label htmlFor="">Borrower remarks</label>
                <textarea name="returned_remarks" value={selectedRow.returned_remarks} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly></textarea>
            </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={closeModals}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          <i className="fa-solid fa-xmark mr-1"></i> Close
        </button>
        <button
  onClick={() => {
    if (!selectedRow) return;
    if (confirm("Are you sure you want to accept this request?")) {
      router.post(
        route("toolkit.borrowed.accept", {
          id: selectedRow.id,
          item: selectedRow.item,
          serial_no: selectedRow.serial_no,
          location: selectedRow.location,
        }),
        { accept_remarks }, // send remarks
        {
          onSuccess: () => {
            alert("✅ Accept request successfully!");
            closeModals();
            router.visit(route("toolkit.borrowed.index"));
          },
          onError: (errors) => {
            console.error(errors);
            alert("❌ Failed to accept request.");
          },
        }
      );
    }
  }}
  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
>
  <i className="fa-solid fa-check mr-1"></i> Accept
</button>


      </div>
    </div>
  </div>
)}

            {isViewModalOpen && selectedRow && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-xl p-6 border-t-4 border-blue-500">
      <h2 className="text-xl font-bold text-blue-600 mb-4">
        <i className="fa-solid fa-eye mr-2"></i> View Request
      </h2>

      <div className="space-y-2 text-gray-700">
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="">Date</label>
                <input type="text" name="date" value={selectedRow.date} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
            <div>
                <label htmlFor="">Badge</label>
                <input type="text" name="emp_id" value={selectedRow.emp_id} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
            <div>
                <label htmlFor="">Technician</label>
                <input type="text" name="emp_name" value={selectedRow.emp_name} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
            <div>
                <label htmlFor="">Productline</label>
                <input type="text" name="productline" value={selectedRow.productline} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
            <div>
                <label htmlFor="">Tools</label>
                <input type="text" name="item" value={selectedRow.item} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
            <div>
                <label htmlFor="">Location of Use</label>
                <input type="text" name="location_use" value={selectedRow.location_use} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
            <div>
                <label htmlFor="">Status</label>
                <input type="text" name="status" value={selectedRow.status} className="w-full border border-rose-700 text-white rounded-md p-2 pointer-events-none bg-rose-400" readOnly/>
            </div>
            <div>
                <label htmlFor="">Purpose</label>
                <input type="text" name="purpose" value={selectedRow.purpose} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
        </div>
        <div>
                <label htmlFor="">Remarks</label>
            <textarea
      id="returned_remarks"
      name="returned_remarks"
      value={returned_remarks}
      onChange={(e) => setReturnedRemarks(e.target.value)}
      className="w-full border border-gray-300 rounded-md p-2"
      required
    ></textarea>
            </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={closeModals}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          <i className="fa-solid fa-xmark mr-1"></i> Close
        </button>
        <button
  onClick={() => {
    if (!selectedRow) return;
    if (confirm("Mark this borrowed as returned?")) {
      router.post(
        route("toolkit.borrowed.returned", selectedRow.id),
        {returned_remarks},
        {
          onSuccess: () => {
            alert("📘 Successfully Returned!");
            closeModals();
            router.visit(route("toolkit.borrowed.index"));
          },
          onError: (errors) => {
            console.error(errors);
            alert("❌ Failed to return!.");
          },
        }
      );
    }
  }}
  className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600"
>
  <i className="fa-solid fa-arrows-rotate mr-1"></i> Return
</button>

      </div>
    </div>
  </div>
            )}
        </AuthenticatedLayout>
    );
}
