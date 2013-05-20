<?php

namespace NinjaTooken\ClanBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction($name)
    {
        return $this->render('NinjaTookenClanBundle:Default:index.html.twig', array('name' => $name));
    }
}
