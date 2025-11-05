<?php

namespace App\Http\Controllers\Request;

use App\Http\Controllers\Controller;
use App\Services\DataTableService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ToolkitRequestController extends Controller
{
    protected $datatable;
    protected $datatable1;

    public function __construct(DataTableService $datatable)
    {
        $this->datatable = $datatable;
    }


    public function index(Request $request)
    {

        $locations = DB::connection('server26')->table('location_list')
            ->where('location_name', '!=', 'N/A')
            ->distinct()
            ->get();

        $items = DB::connection('server26')
            ->table('toolkit_list')
            ->select('tool_description', 'location', 'serial_no', 'borrowed_status')
            ->where(function ($q) {
                $q->whereRaw('LOWER(borrowed_status) = ?', ['returned'])
                    ->orWhereNull('borrowed_status');
            })
            ->distinct()
            ->orderBy('tool_description')
            ->orderBy('location')
            ->orderBy('serial_no')
            ->get();

        $empData = session('emp_data');


        $employee = DB::connection('masterlist')->table('employee_masterlist')
            ->where('EMPLOYID', $empData['emp_id'])
            ->first();

        // 🔍 Check kung may hindi pa naibabalik na tool (based on emp_name)
        $hasBorrowed = DB::connection('server26')->table('toolkit_tbl')
            ->where('emp_name', $employee->EMPNAME)
            ->where(function ($q) {
                $q->whereNull('status')
                    ->orWhere('status', 'Borrowed')
                    ->orWhere('status', 'For Approval')
                    ->orWhere('status', 'For Acknowledge');
            })
            ->exists();

        $hasTurnover = DB::connection('server26')->table('toolkit_tbl')
            ->where('emp_name', $employee->EMPNAME)
            ->where(function ($q) {
                $q->whereNull('status')
                    ->orWhere('status', 'Turnover');
            })
            ->exists();

        // 🧩 I-attach yung flag sa employee data
        $employee->hasBorrowed = $hasBorrowed;
        $employee->hasTurnover = $hasTurnover;



        $result = $this->datatable->handle(
            $request,
            'server26',
            'toolkit_tbl',
            [
                'conditions' => function ($query) {
                    return $query
                        ->whereIn('status', ['For Approval', 'For Acknowledge'])
                        ->orderByRaw("CASE WHEN status = 'For Acknowledge' THEN 0 ELSE 1 END")
                        ->orderBy('id', 'desc');
                },
                'searchColumns' => ['date', 'emp_name', 'item', 'status'],
            ]
        );

        // FOR CSV EXPORTING
        if ($result instanceof \Symfony\Component\HttpFoundation\StreamedResponse) {
            return $result;
        }

        // dd($employee);

        return Inertia::render('Request/ToolkitRequest', [
            'tableData' => $result['data'],
            'empData' => $employee,
            'locations' => $locations,
            'items' => $items,
            'tableFilters' => $request->only([
                'search',
                'perPage',
                'sortBy',
                'sortDirection',
                'start',
                'end',
                'dropdownSearchValue',
                'dropdownFields',
            ]),
        ]);
    }

    public function store(Request $request)
    {
        // ✅ Validate inputs
        $request->validate([
            'emp_id'        => 'required|string',
            'emp_name'      => 'required|string',
            'team'          => 'required|string',
            'item'          => 'required|string',
            'serial_no'     => 'required|string',
            'productline'   => 'required|string',
            'location'      => 'required|string',
            'location_use'  => 'required|string',
            'purpose'       => 'required|string',
        ]);

        DB::connection('server26')->table('toolkit_tbl')->insert([
            'date'          => Carbon::now()->format('m/d/Y H:i:s'),
            'emp_id'        => $request->emp_id,
            'emp_name'      => $request->emp_name,
            'team'          => $request->team,
            'item'          => $request->item,
            'serial_no'     => $request->serial_no,
            'productline'   => $request->productline,
            'location'      => $request->location,
            'location_use'  => $request->location_use,
            'purpose'       => $request->purpose,
            'status'        => 'For Approval',
        ]);

        return back()->with('success', '✅ Request submitted successfully!');
    }

    public function approve($id, $item, $serial_no, $location, Request $request)
    {
        DB::connection('server26')->table('toolkit_tbl')
            ->where('id', $id)
            ->update([
                'approver_id' => session('emp_data')['emp_id'],
                'approver_name' => session('emp_data')['emp_name'],
                'approve_date' => Carbon::now()->format('m/d/Y H:i:s'),
                'status' => 'For Acknowledge',
                'approver_remarks'       => $request->input('approver_remarks'),
            ]);

        DB::connection('server26')->table('toolkit_list')
            ->where('tool_description', $item)
            ->where('serial_no', $serial_no)
            ->where('location', $location)
            ->update([
                'borrowed_status' => 'Borrowed'
            ]);

        return back()->with('success', 'Request approved successfully!');
    }

    public function acknowledge($id)
    {
        DB::connection('server26')->table('toolkit_tbl')
            ->where('id', $id)
            ->update([
                'acknowledge_by_id' => session('emp_data')['emp_id'],
                'acknowledge_by_name' => session('emp_data')['emp_name'],
                'acknowledge_date' => Carbon::now()->format('m/d/Y H:i:s'),
                'status' => 'Borrowed',
            ]);

        return back()->with('success', 'Request acknowledged successfully!');
    }
}
