import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, router } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import Modal from "@/Components/Modal";

import { useEffect, useState } from "react";

export default function Admin({ tableData, tableFilters, emp_data }) {
    const [role, setRole] = useState(null);

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

        const getStatusBadge = (status) => {
        let badgeColor = "bg-gray-500";
        switch (status) {
            
            case "Returned":
                badgeColor = "bg-green-500 text-green-500 border-green-600 hover:bg-green-600 hover:text-white hover:border-green-100";
                break;
        }

        return (
            <span
                className={`px-3 py-1 rounded-md border-2 text-white text-sm font-semibold ${badgeColor}`}
            >
                {status || "N/A"}
            </span>
        );
    };

    const tableRows = tableData.data.map((row) => ({
  ...row,
  status_badge: getStatusBadge(row.status),
  actions: (() => {

    if (row.status === "Returned") {
      return (
        <button
          className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 border border-blue-800 hover:border-blue-100"
          onClick={() => openViewModal(row)}
        >
          <i className="fas fa-eye mr-1"></i> View
        </button>
      );
    }
  })(),
}));


    return (
        <AuthenticatedLayout>
            <Head title="Returned Toolkit" />

            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Returned Toolkit</h1>
            </div>

            <DataTable
                columns={[
                    { key: "returned_date", label: "Date Returned" },
                    { key: "returned_by", label: "Returned By" },
                    { key: "item", label: "Item Name" },
                    { key: "emp_name", label: "Borrowed By" },
                    { key: "location_use", label: "Location Used" },
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
                routeName={route("toolkit.returned.index")}
                filters={tableFilters}
                rowKey="EMPLOYID"
                // selectable={true}
                // onSelectionChange={setSelectedRows}
                // dateRangeSearch={true}
                showExport={false}
            >
                
            </DataTable>

            {isViewModalOpen && selectedRow && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-xl shadow-lg w-[95%] max-w-7xl p-6 border-t-4 border-blue-500 overflow-auto max-h-[90vh]">
      <h2 className="text-xl font-bold text-blue-600 mb-4 flex items-center">
        <i className="fa-solid fa-eye mr-2 animate-pulse"></i> View Details
      </h2>

      {/* Borrowed Information */}
      <table className="min-w-full border border-gray-300 text-gray-600 text-lg">
        <thead className="bg-blue-100 text-center">
          <tr>
            <th colSpan="8" className="py-2">Borrowed Information</th>
          </tr>
          <tr>
            <th>Date Borrowed</th>
            <th>Tech Badge ID</th>
            <th>Tech Name</th>
            <th>Team</th>
            <th>Product Line</th>
            <th>Item Tool</th>
            <th>Location Used</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody className="text-center">
          <tr>
            <td>{selectedRow.date}</td>
            <td>{selectedRow.emp_id}</td>
            <td>{selectedRow.emp_name}</td>
            <td>{selectedRow.team}</td>
            <td>{selectedRow.productline}</td>
            <td>{selectedRow.item}</td>
            <td>{selectedRow.location_use}</td>
            <td>
              <span
                className={`px-2 py-1 rounded text-white ${
                  selectedRow.status === "Returned"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                {selectedRow.status}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Approver Information */}
      <table className="min-w-full border border-gray-300 text-gray-600 text-lg mt-6">
        <thead className="bg-blue-100 text-center">
          <tr>
            <th colSpan="6" className="py-2">Approver Information</th>
          </tr>
          <tr>
            <th>Badge ID</th>
            <th>Approver Name</th>
            <th>Approve Date</th>
            <th colSpan="3">Remarks</th>
          </tr>
        </thead>
        <tbody className="text-center">
          <tr>
            <td>{selectedRow.approver_id}</td>
            <td>{selectedRow.approver_name}</td>
            <td>{selectedRow.approve_date}</td>
            <td colSpan="3">{selectedRow.approver_remarks}</td>
          </tr>
        </tbody>
      </table>

      {/* Acknowledgement Information */}
      <table className="min-w-full border border-gray-300 text-gray-600 text-lg mt-6">
        <thead className="bg-blue-100 text-center">
          <tr>
            <th colSpan="5" className="py-2">Acknowledgement Information</th>
          </tr>
          <tr>
            <th>Badge ID</th>
            <th>Acknowledge By</th>
            <th colSpan="3">Acknowledge Date</th>
          </tr>
        </thead>
        <tbody className="text-center">
          <tr>
            <td>{selectedRow.acknowledge_by_id}</td>
            <td>{selectedRow.acknowledge_by_name}</td>
            <td colSpan="3">{selectedRow.acknowledge_date}</td>
          </tr>
        </tbody>
      </table>

      {/* Returned Information */}
      <table className="min-w-full border border-gray-300 text-gray-600 text-lg mt-6">
        <thead className="bg-blue-100 text-center">
          <tr>
            <th colSpan="6" className="py-2">Returned Information</th>
          </tr>
          <tr>
            <th>Badge ID</th>
            <th>Returned By</th>
            <th>Returned Date</th>
            <th colSpan="3">Remarks</th>
          </tr>
        </thead>
        <tbody className="text-center">
          <tr>
            <td>{selectedRow.returned_id}</td>
            <td>{selectedRow.returned_by}</td>
            <td>{selectedRow.returned_date}</td>
            <td colSpan="3">{selectedRow.returned_remarks}</td>
          </tr>
        </tbody>
      </table>

      {/* Acceptance Information */}
      <table className="min-w-full border border-gray-300 text-gray-600 text-lg mt-6">
        <thead className="bg-blue-100 text-center">
          <tr>
            <th colSpan="6" className="py-2">Acceptance Information</th>
          </tr>
          <tr>
            <th>Badge ID</th>
            <th>Accepted By</th>
            <th>Accepted Date</th>
          </tr>
        </thead>
        <tbody className="text-center">
          <tr>
            <td>{selectedRow.accept_by_id}</td>
            <td>{selectedRow.accept_by_name}</td>
            <td>{selectedRow.accept_by_date}</td>
          </tr>
        </tbody>
      </table>


      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={closeModals}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          <i className="fa-solid fa-xmark mr-1"></i> Close
        </button>
      </div>
    </div>
  </div>
)}

        </AuthenticatedLayout>
    );
}
