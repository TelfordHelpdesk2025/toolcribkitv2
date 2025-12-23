<?php

use App\Http\Controllers\Borrowed\ConversionkitBorrowedController;
use App\Http\Controllers\Borrowed\ConversionkitTurnoverController;
use App\Http\Controllers\Borrowed\ToolkitBorrowedController;
use App\Http\Controllers\Borrowed\ToolkitTurnoverController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DemoController;
use App\Http\Controllers\Inventory\ConversionkitController;
use App\Http\Controllers\Inventory\ToolsController;
use App\Http\Controllers\Request\ConversionkitForApprovalController;
use App\Http\Controllers\Request\conversionkitRequestController;
use App\Http\Controllers\Request\ToolkitForApprovalController;
use App\Http\Controllers\Request\ToolkitRequestController;
use App\Http\Controllers\Returned\ConversionkitReturnedController;
use App\Http\Controllers\Returned\ToolkitReturnedController;
use App\Http\Middleware\AuthMiddleware;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

$app_name = env('APP_NAME', '');

// Authentication routes
require __DIR__ . '/auth.php';

// General routes
require __DIR__ . '/general.php';

require __DIR__ . '/inventory.php';

require __DIR__ . '/request.php';

require __DIR__ . '/borrowed.php';

require __DIR__ . '/returned.php';
Route::prefix($app_name)->middleware(AuthMiddleware::class)->group(function () {
    Route::get("/", [DashboardController::class, 'index'])->name('dashboard');
});

// Route::fallback(function () {
//     return Inertia::render('404');
// })->name('404');

Route::fallback(function () {
    // For Inertia requests, just redirect back to the same URL
    return redirect()->to(request()->fullUrl());
})->name('404');

Route::get('/maintenance', function () {
    return Inertia::render('Maintenance');
})->name('maintenance');
