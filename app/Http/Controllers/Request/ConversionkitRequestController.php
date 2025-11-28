<?php

namespace App\Http\Controllers\Request;

use App\Http\Controllers\Controller;
use App\Services\DataTableService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Events\ConversionKitRequested;

class conversionkitRequestController extends Controller
{
    protected $datatable;
    protected $datatable1;

    public function __construct(DataTableService $datatable)
    {
        $this->datatable = $datatable;
    }


    public function index(Request $request)
    {
        $packagesFrom = DB::connection('server26')->table('conversion_kit')
            ->where('package_to', '!=', 'N/A')
            ->where('package_to', '!=', '-')
            ->distinct()
            ->orderBy('package_to')
            ->get();

        $packagesTo = DB::connection('server26')
            ->table('conversion_kit')
            ->select('conversionkit_id', 'package_to', 'machine', 'case_no', 'serial_no', 'location', 'borrowed_status')
            ->where(function ($q) {
                $q->whereRaw('LOWER(borrowed_status) = ?', ['returned'])
                    ->orWhereNull('borrowed_status');
            })
            ->where('package_to', '!=', 'N/A')
            ->where('package_to', '!=', '-')
            ->distinct()
            ->orderBy('package_to')
            ->get();

        $empData = session('emp_data');

        $employee = DB::connection('masterlist')->table('employee_masterlist')
            ->where('EMPLOYID', $empData['emp_id'])
            ->first();

        // 🔍 Check kung may hindi pa naibabalik na tool (based on emp_name)
        $hasBorrowed = DB::connection('server26')->table('toolcrib_tbl')
            ->where('emp_name', $employee->EMPNAME)
            ->whereIn('status', ['Borrowed', 'For Approval', 'For Acknowledge'])
            ->exists();

        $hasTurnover = DB::connection('server26')->table('toolcrib_tbl')
            ->where('emp_name', $employee->EMPNAME)
            ->where('status', 'Turnover')
            ->exists();


        $requestCount = DB::connection('server26')->table('toolcrib_tbl')
            ->where('emp_name', $employee->EMPNAME)
            ->whereIn('status', ['Borrowed', 'For Approval', 'For Acknowledge'])
            ->count();

        $canRequest = $requestCount < 2;


        // 🧩 I-attach yung flag sa employee data
        $employee->hasBorrowed = $hasBorrowed;
        $employee->hasTurnover = $hasTurnover;
        $employee->requestCount = $requestCount;
        $employee->canRequest = $canRequest;



        $conversionkit_request = DB::connection('server26')->table('toolcrib_tbl')->get();

        $result = $this->datatable->handle(
            $request,
            'server26',
            'toolcrib_tbl',
            [
                'conditions' => function ($query) {
                    return $query
                        ->whereIn('status', ['For Approval', 'For Acknowledge'])
                        ->orderByRaw("CASE WHEN status = 'For Acknowledge' THEN 0 ELSE 1 END")
                        ->orderBy('id', 'desc');
                },
                'searchColumns' => ['date', 'emp_name', 'package_from', 'package_to', 'case_no', 'machine'],
            ]
        );

        if ($result instanceof \Symfony\Component\HttpFoundation\StreamedResponse) {
            return $result;
        }

        return Inertia::render('Request/ConversionkitRequest', [
            'tableData' => $result['data'],
            'empData' => $employee,
            'packagesFrom' => $packagesFrom,
            'packagesTo' => $packagesTo,
            'conversionkit_request' => $conversionkit_request,
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
            'package_from'  => 'required|string',
            'package_to'    => 'required|string',
            'case_no'       => 'required|string',
            'machine'       => 'required|string',
            'serial_no'       => 'required|string',
            'conversionkitId'       => 'required|string',
            'location'      => 'required|string',
            'taper_track'   => 'required|string',
            'purpose'       => 'required|string',
        ]);

        DB::connection('server26')->table('toolcrib_tbl')->insert([
            'date'          => Carbon::now()->format('m/d/Y H:i:s'),
            'emp_id'        => $request->emp_id,
            'emp_name'      => $request->emp_name,
            'team'          => $request->team,
            'package_from'  => $request->package_from,
            'package_to'    => $request->package_to,
            'case_no'       => $request->case_no,
            'machine'       => $request->machine,
            'serial_no'       => $request->serial_no,
            'conversionkitId'       => $request->conversionkitId,
            'location'      => $request->location,
            'taper_track'   => $request->taper_track,
            'purpose'       => $request->purpose,
            'status'        => 'For Approval',
        ]);

        return back()->with('success', '✅ Request submitted successfully!');
    }

    // public function store(Request $request)
    // {
    //     // ✅ Validate inputs
    //     $request->validate([
    //         'emp_id'        => 'required|string',
    //         'emp_name'      => 'required|string',
    //         'team'          => 'required|string',
    //         'package_from'  => 'required|string',
    //         'package_to'    => 'required|string',
    //         'case_no'       => 'required|string',
    //         'machine'       => 'required|string',
    //         'serial_no'     => 'required|string',
    //         'location'      => 'required|string',
    //         'taper_track'   => 'required|string',
    //         'purpose'       => 'required|string',
    //     ]);

    //     // 🔹 Insert into server26 DB
    //     DB::connection('server26')->table('toolcrib_tbl')->insert([
    //         'date'          => Carbon::now()->format('m/d/Y H:i:s'),
    //         'emp_id'        => $request->emp_id,
    //         'emp_name'      => $request->emp_name,
    //         'team'          => $request->team,
    //         'package_from'  => $request->package_from,
    //         'package_to'    => $request->package_to,
    //         'case_no'       => $request->case_no,
    //         'machine'       => $request->machine,
    //         'serial_no'     => $request->serial_no,
    //         'location'      => $request->location,
    //         'taper_track'   => $request->taper_track,
    //         'purpose'       => $request->purpose,
    //         'status'        => 'For Approval',
    //     ]);

    //     // 🔹 Prepare data to broadcast
    //     $data = $request->all();
    //     $data['status'] = 'For Approval';
    //     $data['date'] = Carbon::now()->format('m/d/Y H:i:s');

    //     // 🔹 Broadcast event for realtime
    //     broadcast(new ConversionKitRequested((object)$data))->toOthers();

    //     // ✅ Return a proper Inertia response with flash message
    //     return back()->with('success', '✅ Request submitted successfully!');
    // }



    public function approve($id, $conversionkitId, $location, Request $request)
    {
        DB::connection('server26')->table('toolcrib_tbl')
            ->where('id', $id)
            ->update([
                'approver_id' => session('emp_data')['emp_id'],
                'approver_name' => session('emp_data')['emp_name'],
                'approve_date' => Carbon::now()->format('m/d/Y H:i:s'),
                'status' => 'For Acknowledge',
                'remarks'       => $request->input('remarks'),
            ]);

        DB::connection('server26')->table('conversion_kit')
            ->where('conversionkit_id', $conversionkitId)
            ->where('location', $location)
            ->update([
                'borrowed_status' => 'Borrowed'
            ]);



        return back()->with('success', 'Request approved successfully!');
    }

    public function acknowledge($id)
    {
        DB::connection('server26')->table('toolcrib_tbl')
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
