import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";

export default function Dashboard({
  emp_data,
  totalConversionkitBorrows,
  totalConversionkitRetuns,
  totalToolkitBorrows,
  totalToolkitRetuns,
  forAcknowledgeConversionkit,
  forAcknowledgeToolkit,

  totalConversionkitInventory,
  totalToolkitInventory,
  totalConversionkitBorrowed,
  totalConversionkitRetuned,
  totalToolkitBorrowed,
  totalToolkitRetuned,

  conversionkitRequests,
  toolkitRequests,
  conversionkitReturned,
  toolkitReturned
}) {
  const props = usePage().props;
  const role = emp_data?.emp_system_role ?? "user";
  const empName = emp_data?.emp_firstname ?? "User";
  const empBadge = emp_data?.emp_id ?? "User";

  // Ensure props exist
  const convForAck = props.forAcknowledgeConversionkit ?? 0;
  const toolForAck = props.forAcknowledgeToolkit ?? 0;

  // admin Cards
    const convReq = props.conversionkitRequests ?? 0;
  const toolReq = props.toolkitRequests ?? 0;
  const convForRet = props.conversionkitReturned ?? 0;
  const toolForRet = props.toolkitReturned ?? 0;

  if (!emp_data) {
    return (
      <AuthenticatedLayout>
        <Head title="Dashboard" />
        <div className="text-center text-gray-600 mt-10">Loading dashboard...</div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <Head title="Dashboard" />

      {["superadmin", "admin"].includes(role) || ["1710", "16103", "1707"].includes(empBadge) ? (
        <div>
          <p className="text-lg font-semibold mb-4">Welcome Admin, 
            <span className="font-bold text-purple-400 text-1xl ml-2">{empName}</span></p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <SummaryCard title="Total Conversion Kits" value={totalConversionkitInventory} color="bg-cyan-200" icon={<i className="fa-solid fa-list"></i>}/>
            <SummaryCard title="Total Borrowed Conversionkit" value={totalConversionkitBorrowed} color="bg-pink-200" icon={<i className="fa-solid fa-arrows-up-down"></i>}/>
            <SummaryCard title="Total Returned Conversionkit" value={totalConversionkitRetuned} color="bg-rose-200" icon={<i className="fa-solid fa-arrows-left-right"></i>}/>
            <SummaryCard title="Total Toolkits" value={totalToolkitInventory} color="bg-emerald-200" icon={<i className="fa-solid fa-list-ol"></i>}/>
            <SummaryCard title="Total Borrowed Toolkits" value={totalToolkitBorrowed} color="bg-lime-200" icon={<i className="fa-solid fa-arrows-turn-right"></i>}/>
            <SummaryCard title="Total Returned Toolkits" value={totalToolkitRetuned} color="bg-yellow-200" icon={<i className="fa-solid fa-arrows-turn-to-dots"></i>}/>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Conversion Kit Card */}
            <div className="card bg-blue-400 text-white w-full shadow-lg">
              <div className="card-body">
                <h2 className="card-title flex items-center gap-2">
                  <i className="fa-regular fa-thumbs-up text-4xl"></i>
                  <span className="text-2xl">Conversionkit Request</span>
                </h2>
                <p className="font-bold text-sky-800 text-right text-5xl">{convReq}</p>
                <div className="card-actions justify-end">
                  {convReq === 0 ? (
                     <span className="text-2xl font-bold text-rose-700"><i className="fa-regular fa-bell-slash mr-2"></i>No Conversionkit for approval</span>
                  ) : (
                    <button
                      className="btn bg-white text-black hover:bg-gray-200"
                      onClick={() => { window.location.href = route("conversionkit.forapproval.index"); }}
                    >
                      View Details <i className="fa-solid fa-arrow-right ml-2"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Toolkit Card */}
            <div className="card bg-stone-400 text-white w-full shadow-lg">
              <div className="card-body">
                <h2 className="card-title flex items-center gap-2">
                  <i className="fa-solid fa-people-carry-box text-4xl"></i>
                  <span className="text-2xl">TOOLKIT REQUEST</span>
                </h2>
                <p className="font-bold text-gray-800 text-right text-5xl">{toolReq}</p>
                <div className="card-actions justify-end">
                  {toolReq === 0 ? (
                     <span className="text-2xl font-bold text-rose-700"><i className="fa-regular fa-bell-slash mr-2"></i>No toolkit for approval</span>
                  ) : (
                    <button
                      className="btn bg-white text-black hover:bg-gray-200"
                      onClick={() => { window.location.href = route("toolkit.forapproval.index"); }}
                    >
                      View Details <i className="fa-solid fa-arrow-right ml-2"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Conversion Kit Card */}
            <div className="card bg-orange-400 text-white w-full shadow-lg">
              <div className="card-body">
                <h2 className="card-title flex items-center gap-2">
                  <i className="fa-regular fa-share-from-square text-4xl"></i>
                  <span className="text-2xl">RETURNED CONVERSIONKIT</span>
                </h2>
                <p className="font-bold text-sky-800 text-right text-5xl">{convForRet}</p>
                <div className="card-actions justify-end">
                  {convForRet === 0 ? (
                     <span className="text-2xl font-bold text-rose-700"><i className="fa-regular fa-bell-slash mr-2"></i>No Conversionkit Returned</span>
                  ) : (
                    <button
                      className="btn bg-white text-black hover:bg-gray-200"
                      onClick={() => { window.location.href = route("conversionkit.turnover.index"); }}
                    >
                      View Details <i className="fa-solid fa-arrow-right ml-2"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Toolkit Card */}
            <div className="card bg-emerald-400 text-white w-full shadow-lg">
              <div className="card-body">
                <h2 className="card-title flex items-center gap-2">
                  <i className="fa-solid fa-arrow-down-up-across-line text-4xl"></i>
                  <span className="text-2xl">RETURNED TOOLKIT</span>
                </h2>
                <p className="font-bold text-gray-800 text-right text-5xl">{toolForRet}</p>
                <div className="card-actions justify-end">
                  {toolForRet === 0 ? (
                     <span className="text-2xl font-bold text-rose-700"><i className="fa-regular fa-bell-slash mr-2"></i>No toolkit Returned</span>
                  ) : (
                    <button
                      className="btn bg-white text-black hover:bg-gray-200"
                      onClick={() => { window.location.href = route("toolkit.turnover.index"); }}
                    >
                      View Details <i className="fa-solid fa-arrow-right ml-2"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Welcome to your dashboard,{" "}
            <span className="font-bold text-amber-400 text-2xl">{empName}</span>
          </h2>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <SummaryCard title="Borrowed Conversion Kits" value={totalConversionkitBorrows} color="bg-rose-200" icon={<i className="fa-solid fa-arrows-turn-right"></i>} />
            <SummaryCard title="Returned Conversion Kits" value={totalConversionkitRetuns} color="bg-stone-200" icon={<i className="fa-solid fa-arrows-up-down"></i>} />
            <SummaryCard title="Borrowed Toolkits" value={totalToolkitBorrows} color="bg-orange-200" icon={<i className="fa-solid fa-arrow-up-from-bracket"></i>} />
            <SummaryCard title="Returned Toolkits" value={totalToolkitRetuns} color="bg-lime-200" icon={<i className="fa-solid fa-arrow-up-right-from-square"></i>} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Conversion Kit Card */}
            <div className="card bg-blue-400 text-white w-full shadow-lg">
              <div className="card-body">
                <h2 className="card-title flex items-center gap-2">
                  <i className="fa-regular fa-thumbs-up text-4xl"></i>
                  <span className="text-2xl">CONVERSION KIT FOR ACKNOWLEDGEMENT</span>
                </h2>
                <p className="font-bold text-sky-800 text-right text-5xl">{convForAck}</p>
                <div className="card-actions justify-end">
                  {convForAck === 0 ? (
                     <span className="text-2xl font-bold text-rose-700"><i className="fa-regular fa-bell-slash mr-2"></i>No Conversionkit for acknowledgement</span>
                  ) : (
                    <button
                      className="btn bg-white text-black hover:bg-gray-200"
                      onClick={() => { window.location.href = route("conversionkit.request.index"); }}
                    >
                      View Details <i className="fa-solid fa-arrow-right ml-2"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Toolkit Card */}
            <div className="card bg-stone-400 text-white w-full shadow-lg">
              <div className="card-body">
                <h2 className="card-title flex items-center gap-2">
                  <i className="fa-solid fa-people-carry-box text-4xl"></i>
                  <span className="text-2xl">TOOLKIT FOR ACKNOWLEDGEMENT</span>
                </h2>
                <p className="font-bold text-gray-800 text-right text-5xl">{toolForAck}</p>
                <div className="card-actions justify-end">
                  {toolForAck === 0 ? (
                     <span className="text-2xl font-bold text-rose-700"><i className="fa-regular fa-bell-slash mr-2"></i>No toolkit for acknowledgement</span>
                  ) : (
                    <button
                      className="btn bg-white text-black hover:bg-gray-200"
                      onClick={() => { window.location.href = route("toolkit.request.index"); }}
                    >
                      View Details <i className="fa-solid fa-arrow-right ml-2"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}

function SummaryCard({ title, value, color, icon }) {
  return (
    <div className={`p-4 ${color} rounded-lg shadow text-gray-700`}>
      <div className="flex items-center justify-between">
        <div className="text-4xl text-gray-600 opacity-80">{icon}</div>
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-3xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}
