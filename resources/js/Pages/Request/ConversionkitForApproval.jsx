import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import { useEffect, useState } from "react";

export default function ConversionkitForApproval({ tableData, tableFilters, packagesFrom, packagesTo, empData, emp_data, conversionkit_request }) {

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // 🟢 For Modals
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


    const [now, setNow] = useState(new Date());
    const [showModal, setShowModal] = useState(false);

    const SelectedPackagesFrom = packagesFrom.map((item) => item.package_to);

    const SelectedPackagesTo = packagesTo.map((item) => item.package_to);

    // 🔹 State for selected package info
    const [selectedTo, setSelectedTo] = useState("");
    const [conversionkitId, setconversionkitId] = useState("");
    const [caseNo, setCaseNo] = useState("");
    const [machine, setMachine] = useState("");
    const [serial_no, setSerialNo] = useState("");
    const [location, setLocation] = useState("");

    // 🔹 Handle Package To selection
    const handlePackageToChange = (e) => {
        const value = e.target.value;
        setSelectedTo(value);

        // Find the selected package record from your data
        const selectedPackage = packagesTo.find((pkg) => pkg.package_to === value);

        if (selectedPackage) {
          setconversionkitId(selectedPackage.conversionkit_id || "");
            setCaseNo(selectedPackage.case_no || "");
            setMachine(selectedPackage.machine || "");
            setSerialNo(selectedPackage.serial_no || "");
            setLocation(selectedPackage.location || "");
        } else {
            // reset fields if no match
            setconversionkitId("");
            setCaseNo("");
            setMachine("");
            setSerialNo("");
            setLocation("");
        }
    };

    const empname = empData?.EMPNAME;
    const empid = empData?.EMPLOYID;
    const empTeam = empData?.TEAM;

    const teamMap = {
    1: "N",
    2: "A",
    3: "B",
    4: "C",
    };

    const Eteam = teamMap[empTeam] || ""; // default to empty if undefined




    // console.log("Employee Data:", empname, empid, empTeam);

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "N/A";

    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
};


    const getRunningTime = (startDate) => {
        if (!startDate) return "N/A";
        const start = new Date(startDate);
        if (isNaN(start)) return "Invalid Date";

        const diff = now - start;
        if (diff < 0) return "Invalid";

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        let result = "";
        if (days > 0) result += `${days}d `;
        if (hours > 0) result += `${hours}h `;
        if (minutes > 0) result += `${minutes}m `;
        result += `${seconds}s`;

        return result.trim();
    };

    const getStatusBadge = (status) => {
        let badgeColor = "";
        switch (status) {
            case "For Approval":
                badgeColor = "bg-blue-200 text-blue-500 border-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-100";
                break;
            case "For Acknowledge":
                badgeColor = "bg-teal-200 text-teal-500 border-teal-600 hover:bg-teal-600 hover:text-white hover:border-teal-100";
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

    // const tableRows = tableData.data.map((row) => ({
    //     ...row,
        
    // }));

    const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
        emp_id: empid,
        emp_name: empname,
        team: Eteam,
        package_from: e.target.package_from.value,
        package_to: e.target.package_to.value,
        conversionkitId: conversionkitId,
        case_no: caseNo,
        machine: machine,
        serial_no: serial_no,
        location: location,
        taper_track: e.target.taper_track.value,
        purpose: e.target.purpose.value,
    };

    router.post(route('conversionkit.request.store'), data, {
        onSuccess: () => {
            alert("✅ Request submitted!");
            setShowModal(false);
            router.visit(route("conversionkit.request.index"));
        },
        onError: (errors) => {
            console.error(errors);
            alert("❌ Failed to submit request.");
        }
    });
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
        }, 2000); // 🔄 Change every 2 second

        return () => clearInterval(interval);
    }, []);



const tableRows = tableData.data.map((row) => ({
  ...row,
  running_time: getRunningTime(row.date),
  status_badge: getStatusBadge(row.status),
  actions: (() => {
    if (
      ["superadmin", "admin", "toolcrib"].includes(emp_data?.emp_system_role) && ["16103", "1710", "1707"].includes(emp_data?.emp_id) &&
      row.status === "For Approval"
    ) {
      return (
        <button
          className="px-3 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 border border-emerald-800 hover:border-emerald-100"
          // className="px-3 py-2 text-emerald-600 rounded-md bg-emerald-100 border-2 border-emerald-700 hover:bg-emerald-800 hover:text-white hover:border-white"
          onClick={() => openEditModal(row)}
        >
          <i className="fa-solid fa-clipboard-list mr-1"></i> Assess
        </button>
      );
    }

    if (row.status === "For Acknowledge") {
      return (
        <button
          className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 border border-blue-800 hover:border-blue-100"
          onClick={() => openViewModal(row)}
        >
          <i className="fas fa-eye mr-1"></i> View
        </button>
      );
    }

    return (
      <p className={`${currentColor} text-sm flex items-center transition-colors duration-500`}>
        <i className="fa-solid fa-arrows-spin animate-spin mr-1"></i>
        Waiting for Approval
      </p>
    );
  })(),
}));



const [remarks, setRemarks] = useState("");


    return (
        <AuthenticatedLayout>
            <Head title="Conversion Kit Request" />

            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold animate-bounce"><i className="fa-solid fa-arrows-turn-to-dots mr-2"></i> Conversion Kit For Approval</h1>
            </div>

            {/* 🔹 DataTable */}
            <DataTable
                columns={[
                    { key: "date", label: "Request Date" },
                    { key: "emp_name", label: "Technician Name" },
                    { key: "package_from", label: "Package From" },
                    { key: "package_to", label: "Package To" },
                    { key: "case_no", label: "Case No" },
                    { key: "machine", label: "Machine" },
                    { key: "running_time", label: "Running Time" },
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
                routeName={route("conversionkit.forapproval.index")}
                filters={tableFilters}
                rowKey="id"
                showExport={false}
            />

            {/* 🔹 Modal for "Request New" */}
{showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-3xl p-6 border-2 border-blue-400">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 p-2 bg-gradient-to-r from-emerald-700 to-green-300 rounded">
        <h2 className="text-xl font-semibold text-white">
          <i className="fa-solid fa-plus mr-2"></i> New Conversion Kit Request
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
        {/* Employee Info */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Date", value: formatDate(new Date()), name: "date" },
            { label: "Badge", value: empid, name: "emp_id" },
            { label: "Name", value: empname, name: "emp_name" },
            { label: "Team", value: Eteam, name: "team" },
          ].map((f, i) => (
            <div key={i}>
              <label className="block text-sm font-medium text-gray-500">{f.label}</label>
              <input
                type="text"
                name={f.name}
                value={f.value}
                readOnly
                className="w-full border border-gray-300 rounded-md p-2 bg-gray-100"
              />
            </div>
          ))}
        </div>

        {/* Packages */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Package From</label>
            <select
              name="package_from"
              required
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select Package</option>
              {SelectedPackagesFrom.map((pkg, i) => (
                <option key={i}>{pkg}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">Package To</label>
            <select
              name="package_to"
              value={selectedTo}
              onChange={handlePackageToChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select Package</option>
              {SelectedPackagesTo.map((pkg, i) => (
                <option key={i}>{pkg}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-3 gap-4">
          {[
  { label: "Conversionkit ID", name: "conversionkit_id", value: conversionkitId, setter: setconversionkitId, hidden: true },
  { label: "Case No", name: "case_no", value: caseNo, setter: setCaseNo, editable: true },
  { label: "Machine", name: "machine", value: machine, setter: setMachine, editable: true },
  { label: "Serial", name: "serial_no", value: serial_no, setter: setSerialNo, editable: false },
].map((f, i) => (
  !f.hidden && (
    <div key={i}>
      <label className="block text-sm font-medium text-gray-500">{f.label}</label>
      <input
        type="text"
        name={f.name}
        value={f.value}
        onChange={(e) => f.editable && f.setter(e.target.value)}
        className={`w-full border border-gray-300 rounded-md p-2 ${f.editable ? "bg-white" : "bg-gray-100 cursor-not-allowed"}`}
        readOnly={!f.editable}
      />
    </div>
  )
))}
        </div>

        {/* Taper Track */}
        <div>
          <label className="block text-sm font-medium text-gray-500">Taper Track:</label>
          <div className="grid grid-cols-5 gap-3">
            {["8mm", "10mm", "12mm", "16mm", "N/A"].map((val) => (
              <label key={val}>
                <input type="radio" name="taper_track" value={val} /> {val}
              </label>
            ))}
          </div>
        </div>

        {/* Purpose */}
        <div>
          <label className="block text-sm font-medium text-gray-500">Purpose</label>
          <textarea
            name="purpose"
            required
            className="w-full border border-gray-300 rounded-md p-2"
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            <i className="fas fa-times mr-1"></i> Close
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <i className="fas fa-paper-plane mr-2"></i> Submit
          </button>
        </div>
      </form>
    </div>
  </div>
)}

{isAssessModalOpen && selectedRow && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-2xl p-6 border-t-4 border-emerald-500">
      <h2 className="text-xl font-bold text-emerald-600 mb-4">
        <i className="fa-solid fa-clipboard-list mr-2"></i> Assess Request
      </h2>

      <div className="space-y-2 text-gray-700">
         <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="">Date</label>
                <input type="text" name="date" value={selectedRow.date} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
            <div>
                <label htmlFor="">Technician</label>
                <input type="text" name="emp_name" value={selectedRow.emp_name} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
            <div>
                <label htmlFor="">Package From</label>
                <input type="text" name="package_from" value={selectedRow.package_from} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
            <div>
                <label htmlFor="">Package To</label>
                <input type="text" name="package_to" value={selectedRow.package_to} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
            <div>
                <label htmlFor="">Machine</label>
                <input type="text" name="machine" value={selectedRow.machine} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
            <div>
                <label htmlFor="">Serial</label>
                <input type="text" name="serial_no" value={selectedRow.serial_no} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
            <div>
                <label htmlFor="">Location</label>
                <input type="text" name="location" value={selectedRow.location} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
            <div>
                <label htmlFor="">Status</label>
                <input type="text" name="status" value={selectedRow.status} className="w-full border border-blue-700 text-white rounded-md p-2 pointer-events-none bg-blue-500" readOnly/>
            </div>
            <div>
                <input type="text" name="conversionkitId" value={selectedRow.conversionkitId} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
            
      </div>
            <div>
              <label htmlFor="">Purpose</label>
              <textarea name="purpose" value={selectedRow.purpose} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
            <div>
    <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">
      Remarks
    </label>
    <textarea
      id="remarks"
      name="remarks"
      value={remarks}
      onChange={(e) => setRemarks(e.target.value)}
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
    if (confirm("Are you sure you want to approve this request?")) {
      router.put(
  route("conversionkit.request.approve",
    {
          id: selectedRow.id,
          conversionkitId: selectedRow.conversionkitId,
          location: selectedRow.location,
    }
  ),
  { remarks }, // ✅ send remarks to backend
  {
    onSuccess: () => {
      alert("✅ Request approved successfully!");
      closeModals();
      router.visit(route("conversionkit.request.index"));
    },
    onError: (errors) => {
      console.error(errors);
      alert("❌ Failed to approve request.");
    },
  }
);

    }
  }}
  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
>
  <i className="fa-solid fa-check mr-1"></i> Approve
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
                <label htmlFor="" className="text-green-500">Approved Date</label>
                <input type="text" name="approve_date" value={selectedRow.approve_date} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
            <div>
                <label htmlFor="" className="text-green-500">Approved By</label>
                <input type="text" name="approver_name" value={selectedRow.approver_name} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
            <div>
                <label htmlFor="">Date</label>
                <input type="text" name="date" value={selectedRow.date} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
            <div>
                <label htmlFor="">Technician</label>
                <input type="text" name="emp_name" value={selectedRow.emp_name} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
            <div>
                <label htmlFor="">Package From</label>
                <input type="text" name="package_from" value={selectedRow.package_from} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
            <div>
                <label htmlFor="">Package To</label>
                <input type="text" name="package_to" value={selectedRow.package_to} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
            <div>
                <label htmlFor="">Machine</label>
                <input type="text" name="machine" value={selectedRow.machine} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
            <div>
                <label htmlFor="">Serial</label>
                <input type="text" name="serial_no" value={selectedRow.serial_no} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
            <div>
                <label htmlFor="">Location</label>
                <input type="text" name="location" value={selectedRow.location} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
            <div>
                <label htmlFor="">Status</label>
                <input type="text" name="status" value={selectedRow.status} className="w-full border border-emerald-700 text-white rounded-md p-2 pointer-events-none bg-emerald-500" readOnly/>
            </div>
            <div>
                {/* <label htmlFor="">Purpose</label>
                <input type="text" name="purpose" value={selectedRow.purpose} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/> */}
            </div>
        </div>
        <div>
              <label htmlFor="">Purpose</label>
              <textarea name="purpose" value={selectedRow.purpose} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly/>
            </div>
        <div>
                <label htmlFor="">Remarks</label>
            <textarea name="purpose" value={selectedRow.remarks} className="w-full border border-gray-300 rounded-md p-2 pointer-events-none bg-gray-100" readOnly></textarea>
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
    if (confirm("Mark this request as acknowledged?")) {
      router.post(
        route("conversionkit.request.acknowledge", selectedRow.id),
        {},
        {
          onSuccess: () => {
            alert("📘 Request acknowledged!");
            closeModals();
            router.visit(route("conversionkit.request.index"));
          },
          onError: (errors) => {
            console.error(errors);
            alert("❌ Failed to acknowledge request.");
          },
        }
      );
    }
  }}
  className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
>
  <i className="fa-solid fa-thumbs-up mr-1"></i> Acknowledge
</button>

      </div>
    </div>
  </div>
)}



        </AuthenticatedLayout>
    );
}
