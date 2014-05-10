<?php

namespace NinjaTooken\UserBundle\Form\DataTransformer;

use Symfony\Component\Form\DataTransformerInterface;
use Symfony\Component\Form\Exception\TransformationFailedException;
class IpToLongTransformer implements DataTransformerInterface
{

    /**
     * Transforms an object to a string (id).
     *
     * @param  Object|null $entity
     * @return string
     */
    public function transform($ip = null)
    {
        if (null === $ip) {
            return "";
        }

        return long2ip($ip);
    }

    /**
     * Transforms an id to an object.
     *
     * @param  string $id
     * @return Object|null
     * @throws TransformationFailedException if object is not found.
     */
    public function reverseTransform($ip = null)
    { 
        if (!$id) {
            return null;
        }
        return ip2long($ip);
    }
}