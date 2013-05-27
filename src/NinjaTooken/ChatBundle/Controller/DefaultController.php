<?php

namespace NinjaTooken\ChatBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction($name)
    {
        return $this->render('NinjaTookenChatBundle:Default:index.html.twig');
    }
}
