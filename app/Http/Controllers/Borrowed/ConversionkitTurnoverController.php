<?php

namespace App\Http\Controllers\Borrowed;

use App\Http\Controllers\Controller;
use App\Services\DataTableService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ConversionkitTurnoverController extends Controller
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
            ->get();

        $packagesTo = DB::connection('server26')
            ->table('conversion_kit')
            ->select('package_to', 'machine', 'case_no', 'location', 'borrowed_status')
            ->where(function ($q) {
                $q->whereRaw('LOWER(borrowed_status) = ?', ['returned'])
                    ->orWhereNull('borrowed_status');
            })
            ->distinct()
            ->orderBy('case_no')
            ->orderBy('package_to')
            ->orderBy('location')
            ->get();




        $empData = session('emp_data');


        $employee = DB::connection('masterlist')->table('employee_masterlist')
            ->where('EMPLOYID', $empData['emp_id'])
            ->first();

        $conversionkit_request = DB::connection('server26')->table('toolcrib_tbl')->get();



        $result = $this->datatable->handle(
            $request,
            'server26',
            'toolcrib_tbl',
            [
                'conditions' => function ($query) {
                    return $query
                        ->whereIn('status', ['Turnover'])
                        ->orderBy('id', 'desc');
                },

                'searchColumns' => ['date', 'emp_name', 'package_from', 'package_to', 'case_no', 'machine'],
            ]
        );

        // FOR CSV EXPORTING
        if ($result instanceof \Symfony\Component\HttpFoundation\StreamedResponse) {
            return $result;
        }

        // dd($employee);

        return Inertia::render('Borrowed/ConversionkitTurnover', [
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
            'location'      => $request->location,
            'taper_track'   => $request->taper_track,
            'purpose'       => $request->purpose,
            'status'        => 'For Approval',
        ]);

        return back()->with('success', '✅ Request submitted successfully!');
    }

    public function returned($id, Request $request)
    {
        DB::connection('server26')->table('toolcrib_tbl')
            ->where('id', $id)
            ->update([
                'returned_id' => session('emp_data')['emp_id'],
                'returned_by' => session('emp_data')['emp_name'],
                'returned_date' => Carbon::now()->format('m/d/Y H:i:s'),
                'status' => 'Turnover',
                'returned_remarks'       => $request->input('returned_remarks'),
            ]);

        return back()->with('success', 'Request turnover successfully!');
    }

    public function accept($id, $package_to, $machine, $case_no, $location, Request $request)
    {
        DB::connection('server26')->table('toolcrib_tbl')
            ->where('id', $id)
            ->update([
                'accept_by_id' => session('emp_data')['emp_id'],
                'accept_by_name' => session('emp_data')['emp_name'],
                'accept_by_date' => Carbon::now()->format('m/d/Y H:i:s'),
                'status' => 'Returned',
                'accept_remarks' => $request->input('accept_remarks'),
            ]);

        DB::connection('server26')->table('conversion_kit')
            ->where('package_to', $package_to)
            ->where('machine', $machine)
            ->where('case_no', $case_no)
            ->where('location', $location)
            ->update([
                'borrowed_status' => 'Returned'
            ]);

        return back()->with('success', 'Request acknowledged successfully!');
    }
}
