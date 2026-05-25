<?php
$zip = new ZipArchive();
$zipFile = __DIR__ . '/frontend_build.zip';
if ($zip->open($zipFile, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
    echo "Failed to create zip" . PHP_EOL;
    exit(1);
}
$dir = __DIR__ . '/public/build';
$files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));
foreach ($files as $file) {
    if (!$file->isDir()) {
        $filePath = $file->getRealPath();
        // Get path relative to project root for zip entry
        $relativePath = substr($filePath, strlen(__DIR__) + 1);
        $zip->addFile($filePath, $relativePath);
    }
}
$zip->close();
echo "Zip archive created at {$zipFile}" . PHP_EOL;
?>
