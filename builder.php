<?php
function builder_assets(array $file_paths_input, string $file_path_output)
{
	$content = null;
	$mtime_input = null;
	$mtime_output = file_exists($file_path_output) ? filemtime($file_path_output) : null;

	foreach ($file_paths_input as $file_path)
	{
		if ( ! file_exists($file_path)) {
			throw new Exception(
				sprintf(
					'File not found "%s"',
					$file_path
				)
			);
		}

		$mtime_input = filemtime($file_path) > $mtime_input ? filemtime($file_path) : $mtime_input;

		$content =
			$content."\r\n\r\n".
			file_get_contents($file_path);
	}

	if ($mtime_input > $mtime_output) {
		file_put_contents($file_path_output, $content);
	}
}