<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Services\DataTableService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ToolsController extends Controller
{
    protected $datatable;
    protected $datatable1;

    public function __construct(DataTableService $datatable)
    {
        $this->datatable = $datatable;
    }


    public function index(Request $request)
    {
        $result = $this->datatable->handle(
            $request,
            'server26',
            'toolkit_list',
            [
                'conditions' => function ($query) {
                    return $query
                        ->orderBy('id', 'desc');
                },
                'searchColumns' => ['item_no', 'tool_description', 'qty', 'location', 'serial_no', 'remarks', 'prodline', 'borrowed_status'],
            ]
        );

        // dd($result);

        // FOR CSV EXPORTING
        if ($result instanceof \Symfony\Component\HttpFoundation\StreamedResponse) {
            return $result;
        }

        return Inertia::render('Inventory/Tools', [
            'tableData' => $result['data'],
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

        // dd($request->all());
        $checkIfExists = DB::connection('server26')->table('toolkit_list')
            ->where('serial_no', $request->input('serial_no'))
            ->exists();

        if (!$checkIfExists) {
            DB::connection('server26')->table('toolkit_list')
                ->insert([
                    'item_no' => $request->input('item_no'),
                    'tool_description' => $request->input('tool_description'),
                    'qty' => $request->input('qty'),
                    'location' => $request->input('location'),
                    'serial_no' => $request->input('serial_no'),
                    'remarks' => $request->input('remarks'),
                    'prodline' => $request->input('prodline'),
                    'created_by' => session('emp_data')['emp_name'],
                ]);
        }

        return back()->with('success', 'toolkit kit added successfully.');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'item_no' => 'required|string|max:255',
            'tool_description' => 'required|string|max:255',
            'qty' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'serial_no' => 'required|string|max:255',
            'remarks' => 'required|string|max:1000',
            'prodline' => 'required|string|max:255',
            'borrowed_status' => 'required|string|max:255',
        ]);

        DB::connection('server26')->table('toolkit_list')
            ->where('id', $id)
            ->update([
                'item_no' => $request->item_no,
                'tool_description' => $request->tool_description,
                'qty' => $request->qty,
                'location' => $request->location,
                'serial_no' => $request->serial_no,
                'remarks' => $request->remarks,
                'prodline' => $request->prodline,
                'borrowed_status' => $request->borrowed_status,
                'updated_by' => session('emp_data')['emp_name'] ?? 'Unknown',
            ]);

        return back()->with('success', 'toolkit kit updated successfully!');
    }

    public function destroy($id)
    {
        DB::connection('server26')->table('toolkit_list')->where('id', $id)->delete();
        return back()->with('success', 'toolkit kit deleted successfully!');
    }
}
