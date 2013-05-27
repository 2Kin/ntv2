<?php

namespace NinjaTooken\ClanBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function listeAction()
    {
        return $this->render('NinjaTookenClanBundle:Default:liste.html.twig');
    }

    public function clanAction($clan_nom)
    {
        return $this->render('NinjaTookenClanBundle:Default:clan.html.twig');
    }
}
