<?php

namespace NinjaTooken\TournamentBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction($name)
    {
        return $this->render('NinjaTookenTournamentBundle:Default:index.html.twig', array('name' => $name));
    }
}
