<?php

use App\Http\Controllers\Borrowed\ConversionkitTurnoverController;
use App\Http\Controllers\Borrowed\ToolkitTurnoverController;
use App\Http\Middleware\AuthMiddleware;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Returned\ConversionkitReturnedController;
use App\Http\Controllers\Returned\ToolkitReturnedController;

$app_name = env('APP_NAME', '');

Route::redirect('/', "/$app_name");

Route::prefix($app_name)->middleware(AuthMiddleware::class)->group(function () {

  Route::get("/returned/conversionkitReturned", [ConversionkitReturnedController::class, 'index'])->name('conversionkit.returned.index');

  Route::get("/returned/toolkitReturned", [ToolkitReturnedController::class, 'index'])->name('toolkit.returned.index');



  Route::get("/turnover/conversionkit", [ConversionkitTurnoverController::class, 'index'])->name('conversionkit.turnover.index');
  Route::get("/turnover/toolkit", [ToolkitTurnoverController::class, 'index'])->name('toolkit.turnover.index');
});
