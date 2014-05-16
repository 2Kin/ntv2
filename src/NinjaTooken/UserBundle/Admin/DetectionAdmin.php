<?php
namespace NinjaTooken\UserBundle\Admin;

use Sonata\AdminBundle\Route\RouteCollection;
use Sonata\AdminBundle\Admin\Admin;

class DetectionAdmin extends Admin
{

    protected function configureRoutes(RouteCollection $collection)
    {
        $collection->clearExcept(array('list'));
    }

    public function getBaseRouteName()
    {
        $matches = array('ninjatooken', 'user', 'detection');

        if ($this->isChild()) { // the admin class is a child, prefix it with the parent route name
            $this->baseRouteName = sprintf('%s_%s',
                $this->getParent()->getBaseRouteName(),
                $this->urlize($matches[2])
            );
        } else {

            $this->baseRouteName = sprintf('admin_%s_%s_%s',
                $this->urlize($matches[0]),
                $this->urlize($matches[1]),
                $this->urlize($matches[2])
            );
        }

        return $this->baseRouteName;
    }

    public function getBaseRoutePattern()
    {
        $matches = array('ninjatooken', 'user', 'detection');

        if ($this->isChild()) { // the admin class is a child, prefix it with the parent route name
            $this->baseRoutePattern = sprintf('%s/{id}/%s',
                $this->getParent()->getBaseRoutePattern(),
                $this->urlize($matches[2], '-')
            );
        } else {

            $this->baseRoutePattern = sprintf('/%s/%s/%s',
                $this->urlize($matches[0], '-'),
                $this->urlize($matches[1], '-'),
                $this->urlize($matches[2], '-')
            );
        }

        return $this->baseRoutePattern;
    }
}
