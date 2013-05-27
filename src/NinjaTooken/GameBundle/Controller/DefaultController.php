<?php

namespace NinjaTooken\GameBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function partiesAction()
    {
        return $this->render('NinjaTookenGameBundle:Default:index.html.twig');
    }

    public function calculateurAction()
    {
        return $this->render('NinjaTookenGameBundle:Default:index.html.twig');
    }

    public function classementAction($page)
    {
        return $this->render('NinjaTookenGameBundle:Default:index.html.twig');
    }
}
