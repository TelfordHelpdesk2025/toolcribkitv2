<?php

namespace App\Http\Controllers\Borrowed;

use App\Http\Controllers\Controller;
use App\Services\DataTableService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ToolkitBorrowedController extends Controller
{
    protected $datatable;
    protected $datatable1;

    public function __construct(DataTableService $datatable)
    {
        $this->datatable = $datatable;
    }


    public function index(Request $request)
    {


        $empData = session('emp_data');


        $employee = DB::connection('masterlist')->table('employee_masterlist')
            ->where('EMPLOYID', $empData['emp_id'])
            ->first();

        $result = $this->datatable->handle(
            $request,
            'server26',
            'toolkit_tbl',
            [
                'conditions' => function ($query) {
                    return $query
                        ->whereIn('status', ['Borrowed', 'Turnover'])
                        ->orderByRaw("CASE WHEN status = 'Turnover' THEN 0 ELSE 1 END")
                        ->orderBy('id', 'desc');
                },
                'searchColumns' => ['date', 'emp_name', 'team', 'item', 'location_use', 'purpose'],
            ]
        );

        // FOR CSV EXPORTING
        if ($result instanceof \Symfony\Component\HttpFoundation\StreamedResponse) {
            return $result;
        }

        // dd($employee);

        return Inertia::render('Borrowed/ToolkitBorrowed', [
            'tableData' => $result['data'],
            'empData' => $employee,
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

    public function returned($id, Request $request)
    {
        DB::connection('server26')->table('toolkit_tbl')
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

    public function accept($id, $item, $serial_no, $location, Request $request)
    {
        DB::connection('server26')->table('toolkit_tbl')
            ->where('id', $id)
            ->update([
                'accept_by_id' => session('emp_data')['emp_id'],
                'accept_by_name' => session('emp_data')['emp_name'],
                'accept_by_date' => Carbon::now()->format('m/d/Y H:i:s'),
                'status' => 'Returned',
            ]);

        DB::connection('server26')->table('toolkit_list')
            ->where('tool_description', $item)
            ->where('serial_no', $serial_no)
            ->where('location', $location)
            ->update([
                'borrowed_status' => 'Returned'
            ]);

        return back()->with('success', 'Request acknowledged successfully!');
    }
}
