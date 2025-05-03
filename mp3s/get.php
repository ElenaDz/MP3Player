<?php
try {
	$filename = urldecode($_SERVER['QUERY_STRING']);
	if (empty($filename)) {
		throw new Exception('Empty filename');
	}

	$_filename = mb_convert_encoding($filename, 'cp1251', 'utf8');

	$file_path = __DIR__.'/'.urldecode($_filename);
	if ( ! file_exists($file_path)) {
		throw new Exception('File not found "'.$filename.'"');
	}

	// эмулируем сетевую задержку
	usleep(200 * 1000);

	header('Content-Type: audio/mpeg');
	header('Expires: 0');
	header('Cache-Control: must-revalidate');
	header('Pragma: public');
	header('Content-Length: ' . filesize($file_path));

	readfile($file_path);
	exit;

} catch (Exception $e) {
	header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found", true, 404);
	echo  $e->getMessage();
}

