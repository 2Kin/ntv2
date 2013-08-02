<?php

namespace NinjaTooken\CommonBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use NinjaTooken\GameBundle\NinjaTookenGameBundle;

class DefaultController extends Controller
{
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $repo1 = $em->getRepository('NinjaTookenForumBundle:Thread');
        $repo2 = $em->getRepository('NinjaTookenForumBundle:Forum');

        $forum = $repo2->findOneBy(array('slug' => 'nouveautes'));

        $threads = $repo1->findBy(
            array('forum' => $forum),
            array('dateAjout' => 'DESC'),
            10,0
        );

        return $this->render('NinjaTookenCommonBundle:Default:index.html.twig', array('threads' => $threads));
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
