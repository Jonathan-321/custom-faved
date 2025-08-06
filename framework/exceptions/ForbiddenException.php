<?php

namespace Framework\Exceptions;

use Exception;

class ForbiddenException extends Exception
{
	protected $code = 403;
}
