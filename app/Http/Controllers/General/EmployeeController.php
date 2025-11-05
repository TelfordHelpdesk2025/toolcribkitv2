<?php

namespace App\Http\Controllers\General;

use App\Http\Controllers\Controller;
use App\Services\DataTableService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class EmployeeController extends Controller
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
            'masterlist',
            'employee_masterlist',
            [

                'conditions' => function ($query) {
                    return $query
                        ->where('ACCSTATUS', 1)
                        ->whereNot('EMPLOYID', 0);
                },

                'searchColumns' => ['EMPLOYID', 'PASSWRD', 'EMPNAME', 'BIRTHDAY', 'JOB_TITLE', 'DEPARTMENT', 'ACCSTATUS'],
            ]
        );

        // FOR CSV EXPORTING
        if ($result instanceof \Symfony\Component\HttpFoundation\StreamedResponse) {
            return $result;
        }

        return Inertia::render('Admin/Emp', [
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
}
