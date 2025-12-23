<?php

use App\Http\Controllers\Request\ConversionkitForApprovalController;
use App\Http\Middleware\AuthMiddleware;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Request\ConversionkitRequestController;
use App\Http\Controllers\Request\ToolkitForApprovalController;
use App\Http\Controllers\Request\ToolkitRequestController;

$app_name = env('APP_NAME', '');

Route::redirect('/', "/$app_name");

Route::prefix($app_name)->middleware(AuthMiddleware::class)->group(function () {

  Route::get("/request/conversionkit", [ConversionkitRequestController::class, 'index'])->name('conversionkit.request.index');
  Route::get('/expired/request/conversionkit', [ConversionkitRequestController::class, 'expired'])
    ->name('expired.conversionkit.request');
  Route::post("/request/conversionkit/store", [ConversionkitRequestController::class, 'store'])->name('conversionkit.request.store');
  Route::put('/conversionkit/request/approve/{id}/{conversionkitId}/{location}', [ConversionKitRequestController::class, 'approve'])->name('conversionkit.request.approve');
  Route::post('/conversionkit/request/acknowledge/{id}', [ConversionKitRequestController::class, 'acknowledge'])->name('conversionkit.request.acknowledge');

  Route::get("/request/toolkit", [ToolkitRequestController::class, 'index'])->name('toolkit.request.index');
  Route::post("/request/toolkit/store", [ToolkitRequestController::class, 'store'])->name('toolkit.request.store');
  Route::post('/toolkit/request/approve/{id}/{item}/{serial_no}/{location}', [ToolkitRequestController::class, 'approve'])->name('toolkit.request.approve');
  Route::post('/toolkit/request/acknowledge/{id}', [ToolkitRequestController::class, 'acknowledge'])->name('toolkit.request.acknowledge');

  Route::get("/forapproval/conversionkit", [ConversionkitForApprovalController::class, 'index'])->name('conversionkit.forapproval.index');
  Route::get("/forapproval/toolkit", [ToolkitForApprovalController::class, 'index'])->name('toolkit.forapproval.index');
});
