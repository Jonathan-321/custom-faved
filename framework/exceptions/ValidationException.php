<?php

namespace Framework\Exceptions;

use Exception;

class ValidationException extends Exception
{
	protected $message = 'Validation failed.';

	public function __construct($message = null, $code = 422, ?Exception $previous = null)
	{
		if ($message !== null) {
			$this->message = $message;
		}

		parent::__construct($this->message, $code, $previous);
	}
}
