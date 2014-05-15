<?php
namespace NinjaTooken\UserBundle\Admin;

use Sonata\AdminBundle\Route\RouteCollection;
use Sonata\AdminBundle\Admin\Admin;

class DetectionAdmin extends Admin
{

    protected $baseRoutePattern = 'detection';
    protected $baseRouteName = 'detection';

    protected function configureRoutes(RouteCollection $collection)
    {
        $collection->clearExcept(array('list'));
    }
}
