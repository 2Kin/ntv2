<?php

namespace NinjaTooken\CommonBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction()
    {
        return $this->render('NinjaTookenCommonBundle:Default:index.html.twig');
    }

    public function jouerAction()
    {
        return $this->render('NinjaTookenCommonBundle:Default:jouer.html.twig');
    }

    public function manuelAction()
    {
        return $this->render('NinjaTookenCommonBundle:Default:manuel.html.twig');
    }

    public function reglementAction()
    {
        return $this->render('NinjaTookenCommonBundle:Default:reglement.html.twig');
    }

    public function chatAction()
    {
        return $this->render('NinjaTookenCommonBundle:Default:chat.html.twig');
    }

    public function faqGeneraleAction()
    {
        return $this->render('NinjaTookenCommonBundle:Default:faqGenerale.html.twig');
    }

    public function faqTechniqueAction()
    {
        return $this->render('NinjaTookenCommonBundle:Default:faqTechnique.html.twig');
    }

    public function teamAction()
    {
        return $this->render('NinjaTookenCommonBundle:Default:team.html.twig');
    }

    public function mentionsLegalesAction()
    {
        return $this->render('NinjaTookenCommonBundle:Default:mentionsLegales.html.twig');
    }

    public function contactAction()
    {
        return $this->render('NinjaTookenCommonBundle:Default:contact.html.twig');
    }
}
