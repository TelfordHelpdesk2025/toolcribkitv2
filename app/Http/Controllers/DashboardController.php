<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{

    public function index(Request $request)
    {


        $empData = session('emp_data');
        $empName = $empData['emp_name'] ?? null;

        $totalConversionkitBorrows = DB::connection('server26')->table('toolcrib_tbl')
            ->where('status', 'Borrowed')
            ->where('emp_name', $empName)
            ->count();

        $totalConversionkitRetuns = DB::connection('server26')->table('toolcrib_tbl')
            ->where('status', 'Returned')
            ->where('returned_by', $empName)
            ->count();

        $totalToolkitBorrows = DB::connection('server26')->table('toolkit_tbl')
            ->where('status', 'Borrowed')
            ->where('emp_name', $empName)
            ->count();

        $totalToolkitRetuns = DB::connection('server26')->table('toolkit_tbl')
            ->where('status', 'Returned')
            ->where('returned_by', $empName)
            ->count();

        $forAcknowledgeConversionkit = DB::connection('server26')->table('toolcrib_tbl')
            ->where('status', 'For Acknowledge')
            ->count();

        $forAcknowledgeToolkit = DB::connection('server26')->table('toolkit_tbl')
            ->where('status', 'For Acknowledge')
            ->where('emp_name', $empName)
            ->count();

        //admin cards

        $totalConversionkitInventory = DB::connection('server26')->table('conversion_kit')->count();

        $totalToolkitInventory = DB::connection('server26')->table('toolkit_list')->count();

        $totalConversionkitBorrowed = DB::connection('server26')->table('toolcrib_tbl')
            ->where('status', 'Borrowed')
            ->count();

        $totalConversionkitRetuned = DB::connection('server26')->table('toolcrib_tbl')
            ->where('status', 'Returned')
            ->count();

        $totalToolkitBorrowed = DB::connection('server26')->table('toolkit_tbl')
            ->where('status', 'Borrowed')
            ->count();

        $totalToolkitRetuned = DB::connection('server26')->table('toolkit_tbl')
            ->where('status', 'Returned')
            ->count();

        $conversionkitRequests = DB::connection('server26')->table('toolcrib_tbl')
            ->where('status', 'For Approval')
            ->count();

        $toolkitRequests = DB::connection('server26')->table('toolkit_tbl')
            ->where('status', 'For Approval')
            ->count();

        $conversionkitReturned = DB::connection('server26')->table('toolcrib_tbl')
            ->where('status', 'Turnover')
            ->count();

        $toolkitReturned = DB::connection('server26')->table('toolkit_tbl')
            ->where('status', 'Turnover')
            ->count();

        // dd($totalToolkitBorrowed);

        return Inertia::render('Dashboard', [
            'emp_data' => $empData,
            'totalConversionkitBorrows' => $totalConversionkitBorrows,
            'totalConversionkitRetuns' => $totalConversionkitRetuns,
            'totalToolkitBorrows' => $totalToolkitBorrows,
            'totalToolkitRetuns' => $totalToolkitRetuns,
            'forAcknowledgeConversionkit' => $forAcknowledgeConversionkit,
            'forAcknowledgeToolkit' => $forAcknowledgeToolkit,
            'totalConversionkitInventory' => $totalConversionkitInventory,
            'totalToolkitInventory' => $totalToolkitInventory,
            'totalConversionkitBorrowed' => $totalConversionkitBorrowed,
            'totalConversionkitRetuned' => $totalConversionkitRetuned,
            'totalToolkitBorrowed' => $totalToolkitBorrowed,
            'totalToolkitRetuned' => $totalToolkitRetuned,
            'conversionkitRequests' => $conversionkitRequests,
            'toolkitRequests' => $toolkitRequests,
            'conversionkitReturned' => $conversionkitReturned,
            'toolkitReturned' => $toolkitReturned
        ]);
    }
}
