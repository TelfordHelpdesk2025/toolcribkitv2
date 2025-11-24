<?php

use App\Http\Controllers\Borrowed\ConversionkitBorrowedController;
use App\Http\Controllers\Borrowed\ConversionkitTurnoverController;
use App\Http\Controllers\Borrowed\ToolkitBorrowedController;
use App\Http\Controllers\Borrowed\ToolkitTurnoverController;
use App\Http\Controllers\DemoController;
use App\Http\Controllers\Inventory\ConversionkitController;
use App\Http\Controllers\Inventory\ToolsController;
use App\Http\Controllers\Request\ConversionkitForApprovalController;
use App\Http\Controllers\Request\conversionkitRequestController;
use App\Http\Controllers\Request\ToolkitForApprovalController;
use App\Http\Controllers\Request\ToolkitRequestController;
use App\Http\Controllers\Returned\ConversionkitReturnedController;
use App\Http\Controllers\Returned\ToolkitReturnedController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

$app_name = env('APP_NAME', '');

// Authentication routes
require __DIR__ . '/auth.php';

// General routes
require __DIR__ . '/general.php';

Route::get("/demo", [DemoController::class, 'index'])->name('demo');

Route::get("/inventory/conversionkit", [ConversionkitController::class, 'index'])->name('conversionkit.index');

Route::post("/inventory/conversionkit/store", [ConversionkitController::class, 'store'])->name('conversionkit.store');
Route::put("/inventory/conversionkit/update/{id}", [ConversionkitController::class, 'update'])->name('conversionkit.update');
Route::delete("/inventory/conversionkit/destroy/{id}", [ConversionkitController::class, 'destroy'])->name('conversionkit.destroy');

Route::get("/inventory/toolkit", [ToolsController::class, 'index'])->name('toolkit.index');
Route::post("/inventory/toolkit/store", [ToolsController::class, 'store'])->name('toolkit.store');
Route::put("/inventory/toolkit/update/{id}", [ToolsController::class, 'update'])->name('toolkit.update');
Route::delete("/inventory/toolkit/destroy/{id}", [ToolsController::class, 'destroy'])->name('toolkit.destroy');

Route::get("/request/conversionkit", [conversionkitRequestController::class, 'index'])->name('conversionkit.request.index');
Route::post("/request/conversionkit/store", [conversionkitRequestController::class, 'store'])->name('conversionkit.request.store');
Route::put('/conversionkit/request/approve/{id}/{serial_no}/{location}', [ConversionKitRequestController::class, 'approve'])->name('conversionkit.request.approve');

Route::post('/conversionkit/request/acknowledge/{id}', [ConversionKitRequestController::class, 'acknowledge'])->name('conversionkit.request.acknowledge');

Route::get("/borrowed/conversionkitBorrowed", [ConversionkitBorrowedController::class, 'index'])->name('conversionkit.borrowed.index');
Route::post('/conversionkit/request/borrowed/{id}', [ConversionkitBorrowedController::class, 'returned'])->name('conversionkit.borrowed.returned');

Route::put('/conversionkit/borrowed/accept/{id}/{serial_no}/{location}', [ConversionkitBorrowedController::class, 'accept'])->name('conversionkit.borrowed.accept');

Route::get("/returned/conversionkitReturned", [ConversionkitReturnedController::class, 'index'])->name('conversionkit.returned.index');

Route::get("/request/toolkit", [ToolkitRequestController::class, 'index'])->name('toolkit.request.index');
Route::post("/request/toolkit/store", [ToolkitRequestController::class, 'store'])->name('toolkit.request.store');
Route::post('/toolkit/request/approve/{id}/{item}/{serial_no}/{location}', [ToolkitRequestController::class, 'approve'])->name('toolkit.request.approve');
Route::post('/toolkit/request/acknowledge/{id}', [ToolkitRequestController::class, 'acknowledge'])->name('toolkit.request.acknowledge');

Route::get("/borrowed/toolkitBorrowed", [ToolkitBorrowedController::class, 'index'])->name('toolkit.borrowed.index');
Route::post('/toolkit/request/borrowed/{id}', [ToolkitBorrowedController::class, 'returned'])->name('toolkit.borrowed.returned');
Route::post(
    '/toolkit/request/accept/{id}/{item}/{serial_no}/{location}',
    [ToolkitBorrowedController::class, 'accept']
)->name('toolkit.borrowed.accept');

Route::get("/returned/toolkitReturned", [ToolkitReturnedController::class, 'index'])->name('toolkit.returned.index');

Route::get("/forapproval/conversionkit", [ConversionkitForApprovalController::class, 'index'])->name('conversionkit.forapproval.index');
Route::get("/forapproval/toolkit", [ToolkitForApprovalController::class, 'index'])->name('toolkit.forapproval.index');

Route::get("/turnover/conversionkit", [ConversionkitTurnoverController::class, 'index'])->name('conversionkit.turnover.index');
Route::get("/turnover/toolkit", [ToolkitTurnoverController::class, 'index'])->name('toolkit.turnover.index');


// Route::fallback(function () {
//     return Inertia::render('404');
// })->name('404');

Route::fallback(function () {
    // For Inertia requests, just redirect back to the same URL
    return redirect()->to(request()->fullUrl());
})->name('404');
