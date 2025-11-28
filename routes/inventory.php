<?php

use App\Http\Middleware\AuthMiddleware;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Inventory\ConversionkitController;
use App\Http\Controllers\Inventory\ToolsController;

$app_name = env('APP_NAME', '');

Route::redirect('/', "/$app_name");

Route::prefix($app_name)->middleware(AuthMiddleware::class)->group(function () {

  Route::get("/inventory/conversionkit", [ConversionkitController::class, 'index'])->name('conversionkit.index');

  Route::post("/inventory/conversionkit/store", [ConversionkitController::class, 'store'])->name('conversionkit.store');
  Route::put("/inventory/conversionkit/update/{id}", [ConversionkitController::class, 'update'])->name('conversionkit.update');
  Route::delete("/inventory/conversionkit/destroy/{id}", [ConversionkitController::class, 'destroy'])->name('conversionkit.destroy');

  Route::get("/inventory/toolkit", [ToolsController::class, 'index'])->name('toolkit.index');
  Route::post("/inventory/toolkit/store", [ToolsController::class, 'store'])->name('toolkit.store');
  Route::put("/inventory/toolkit/update/{id}", [ToolsController::class, 'update'])->name('toolkit.update');
  Route::delete("/inventory/toolkit/destroy/{id}", [ToolsController::class, 'destroy'])->name('toolkit.destroy');
});
