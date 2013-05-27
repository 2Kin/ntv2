<?php

namespace NinjaTooken\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function ficheAction($user_nom)
    {
        return $this->render('NinjaTookenUserBundle:Default:fiche.html.twig');
    }

    public function messagerieAction($page)
    {
        return $this->render('NinjaTookenUserBundle:Default:messagerie.html.twig');
    }

    public function messagerieVoirAction($message_nom)
    {
        return $this->render('NinjaTookenUserBundle:Default:messagerie.html.twig');
    }

    public function messagerieAjouterAction()
    {
        return $this->render('NinjaTookenUserBundle:Default:messagerie.html.twig');
    }

    public function messagerieModifierAction($id)
    {
        return $this->render('NinjaTookenUserBundle:Default:messagerie.html.twig');
    }

    public function messagerieSupprimerAction($id)
    {
        return $this->render('NinjaTookenUserBundle:Default:messagerie.html.twig');
    }

    public function parametresAction()
    {
        return $this->render('NinjaTookenUserBundle:Default:parametres.html.twig');
    }

    public function parametresModifierAction()
    {
        return $this->render('NinjaTookenUserBundle:Default:parametres.html.twig');
    }

    public function amisAction($page1, $page2)
    {
        return $this->render('NinjaTookenUserBundle:Default:amis.html.twig');
    }

    public function amisConfirmerAction($user_nom)
    {
        return $this->render('NinjaTookenUserBundle:Default:amis.html.twig');
    }

    public function amisBloquerAction($user_nom)
    {
        return $this->render('NinjaTookenUserBundle:Default:amis.html.twig');
    }

    public function capturesAction($page)
    {
        return $this->render('NinjaTookenUserBundle:Default:captures.html.twig');
    }

    public function capturesSupprimerAction($id)
    {
        return $this->render('NinjaTookenUserBundle:Default:captures.html.twig');
    }
}
