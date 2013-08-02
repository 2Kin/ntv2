<?php

namespace NinjaTooken\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use NinjaTooken\UserBundle\Entity\User;
use NinjaTooken\UserBundle\Entity\Message;

class DefaultController extends Controller
{
    /**
     * @ParamConverter("user", class="NinjaTookenUserBundle:User", options={"mapping": {"user_nom":"slug"}})
     */
    public function ficheAction(User $user)
    {
        return $this->render('NinjaTookenUserBundle:Default:fiche.html.twig', array('user' => $user));
    }

    public function listMessageAction($page=1){
        $user = $this->get('security.context')->getToken()->getUser();
        $repo = $this->getDoctrine()->getManager()->getRepository('NinjaTookenUserBundle:Message');

        $num = 20;
        $page = max(1, $page);

        $q = $repo->createQueryBuilder('a')
            ->orderBy('a.dateAjout', 'DESC')
            ->leftJoin('NinjaTookenUserBundle:MessageUser', 't', 'WITH', 'a.id = t.message')
            ->where('t.user = :user')
            ->setParameter('user', $user);

        return $q->getQuery()
            ->setFirstResult(($page-1)*$num)
            ->setMaxResults($num)
            ->getResult();
    }

    public function messagerieAction($page=1)
    {
        return $this->render('NinjaTookenUserBundle:Default:messagerie.html.twig', array('messages' => $this->listMessageAction($page)));
    }

    /**
     * @ParamConverter("message", class="NinjaTookenUserBundle:Message", options={"mapping": {"message_id":"id"}})
     */
    public function messagerieVoirAction(Message $message, $page=1)
    {
        return $this->render('NinjaTookenUserBundle:Default:messagerie.html.twig', array('messages' => $this->listMessageAction($page)));
    }

    public function messagerieAjouterAction()
    {
        return $this->render('NinjaTookenUserBundle:Default:messagerie.html.twig', array('messages' => $this->listMessageAction(1)));
    }

    /**
     * @ParamConverter("message", class="NinjaTookenUserBundle:Message", options={"mapping": {"message_id":"id"}})
     */
    public function messagerieSupprimerAction(Message $message, $page=1)
    {
        return $this->render('NinjaTookenUserBundle:Default:messagerie.html.twig', array('messages' => $this->listMessageAction($page)));
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

    /**
     * @ParamConverter("user", class="NinjaTookenUserBundle:User", options={"mapping": {"user_nom":"slug"}})
     */
    public function amisConfirmerAction(User $user)
    {
        return $this->render('NinjaTookenUserBundle:Default:amis.html.twig');
    }

    /**
     * @ParamConverter("user", class="NinjaTookenUserBundle:User", options={"mapping": {"user_nom":"slug"}})
     */
    public function amisBloquerAction(User $user)
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
