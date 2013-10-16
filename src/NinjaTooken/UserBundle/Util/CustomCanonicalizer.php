<?php

namespace NinjaTooken\UserBundle\Util;

use FOS\UserBundle\Util\CanonicalizerInterface;

class CustomCanonicalizer implements CanonicalizerInterface
{
    public function canonicalize($string)
    {
        //return null === $string ? null : mb_convert_case($string, MB_CASE_LOWER, mb_detect_encoding($string));
        return $string;
    }
}