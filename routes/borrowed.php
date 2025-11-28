<?php

use App\Http\Controllers\Borrowed\ConversionkitBorrowedController;
use App\Http\Controllers\Borrowed\ToolkitBorrowedController;
use App\Http\Middleware\AuthMiddleware;
use Illuminate\Support\Facades\Route;

$app_name = env('APP_NAME', '');

Route::redirect('/', "/$app_name");

Route::prefix($app_name)->middleware(AuthMiddleware::class)->group(function () {

  Route::get("/borrowed/conversionkitBorrowed", [ConversionkitBorrowedController::class, 'index'])->name('conversionkit.borrowed.index');
  Route::post('/conversionkit/request/borrowed/{id}', [ConversionkitBorrowedController::class, 'returned'])->name('conversionkit.borrowed.returned');

  Route::put('/conversionkit/borrowed/accept/{id}/{conversionkitId}/{location}', [ConversionkitBorrowedController::class, 'accept'])->name('conversionkit.borrowed.accept');
  Route::get("/borrowed/toolkitBorrowed", [ToolkitBorrowedController::class, 'index'])->name('toolkit.borrowed.index');
  Route::post('/toolkit/request/borrowed/{id}', [ToolkitBorrowedController::class, 'returned'])->name('toolkit.borrowed.returned');
  Route::post(
    '/toolkit/request/accept/{id}/{item}/{serial_no}/{location}',
    [ToolkitBorrowedController::class, 'accept']
  )->name('toolkit.borrowed.accept');
});
