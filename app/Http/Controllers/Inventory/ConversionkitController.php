<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Services\DataTableService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ConversionkitController extends Controller
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
            'conversion_kit',
            [
                'conditions' => function ($query) {
                    return $query
                        ->orderBy('id', 'desc');
                },
                'searchColumns' => ['case_no', 'asset_no', 'serial_no', 'package_to', 'location', 'machine', 'model', 'condition', 'borrowed_status'],
            ]
        );

        // dd($result);

        // FOR CSV EXPORTING
        if ($result instanceof \Symfony\Component\HttpFoundation\StreamedResponse) {
            return $result;
        }

        return Inertia::render('Inventory/Conversionkit', [
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
        $checkIfExists = DB::connection('server26')->table('conversion_kit')
            ->where('serial_no', $request->input('serial_no'))
            ->exists();

        if (!$checkIfExists) {
            DB::connection('server26')->table('conversion_kit')
                ->insert([
                    'case_no' => $request->input('case_no'),
                    'asset_no' => $request->input('asset_no'),
                    'model' => $request->input('model'),
                    'serial_no' => $request->input('serial_no'),
                    'package_to' => $request->input('package_to'),
                    'location' => $request->input('location'),
                    'machine' => $request->input('machine'),
                    'condition' => $request->input('condition'),
                    'created_by' => session('emp_data')['emp_name'],
                ]);
        }

        return back()->with('success', 'Conversion kit added successfully.');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'case_no' => 'required|string|max:255',
            'asset_no' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'serial_no' => 'required|string|max:255',
            'package_to' => 'required|string|max:1000',
            'location' => 'required|string|max:255',
            'machine' => 'required|string|max:255',
            'condition' => 'required|string|max:255',
            'borrowed_status' => 'required|string|max:255',
        ]);

        DB::connection('server26')->table('conversion_kit')
            ->where('id', $id)
            ->update([
                'case_no' => $request->case_no,
                'asset_no' => $request->asset_no,
                'model' => $request->model,
                'serial_no' => $request->serial_no,
                'package_to' => $request->package_to,
                'location' => $request->location,
                'machine' => $request->machine,
                'condition' => $request->condition,
                'borrowed_status' => $request->borrowed_status,
                'updated_by' => session('emp_data')['emp_name'] ?? 'Unknown',
            ]);

        return back()->with('success', 'Conversion kit updated successfully!');
    }

    public function destroy($id)
    {
        DB::connection('server26')->table('conversion_kit')->where('id', $id)->delete();
        return back()->with('success', 'Conversion kit deleted successfully!');
    }
}
