call npm run build
del /f /s /q "..\..\Fullstack-Osa-3\puhelinluettelon-backend\build" 1>nul
xcopy /s/Y build "..\..\Fullstack-Osa-3\puhelinluettelon-backend\build"