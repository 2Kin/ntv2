<?php

namespace NinjaTooken\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use NinjaTooken\UserBundle\Entity\User;
use NinjaTooken\UserBundle\Entity\Message;

class DefaultController extends Controller
{
    
    public function connectedAction(User $user)
    {
        $repo = $this->getDoctrine()->getManager()->getRepository('NinjaTookenUserBundle:Message');
        $user->numNewMessage = $repo->getNumNewMessages($user);

        $ninja = $user->getNinja();
        if($ninja){
            $xml = file_get_contents(dirname(__FILE__).'/../../GameBundle/Resources/public/xml/game.xml');
            $document = new \DOMDocument();
            $document->loadXml('<root>'.$xml.'</root>' );

            // l'expérience (et données associées)
            $experience	= $ninja->getExperience();
            $dan        = $ninja->getGrade();
            $niveau		= 0;
            $xpXML		= $document->getElementsByTagName('experience')->item(0)->getElementsByTagName('x');
            $k			= 0;
            $xp			= $experience-$dan*$xpXML->item($xpXML->length-2)->getAttribute('val');
            foreach ($xpXML as $exp){
                if($exp->getAttribute('val')<=$xp)
                    $k++;
                else
                    break;
            }
            $levelActu = $xpXML->item($k>0?$k-1:0);
            $levelSuivant = $xpXML->item($k);

            $user->level = $levelActu->getAttribute('niveau');
        }

        return $this->render('NinjaTookenUserBundle:Default:connected.html.twig', array('user' => $user));
    }

    /**
     * @ParamConverter("user", class="NinjaTookenUserBundle:User", options={"mapping": {"user_nom":"slug"}})
     */
    public function ficheAction(User $user)
    {
        return $this->render('NinjaTookenUserBundle:Default:fiche.html.twig', array('user' => $user));
    }

    public function messagerieAction($page=1)
    {
        $user = $this->get('security.context')->getToken()->getUser();
        $num = $this->container->getParameter('numReponse');
        $page = max(1, $page);

        $repo = $this->getDoctrine()->getManager()->getRepository('NinjaTookenUserBundle:Message');

        $message = current($repo->getFirstMessage($user));

        return $this->render('NinjaTookenUserBundle:Default:messagerie.html.twig', array(
            'messages' => $repo->getMessages($user, $num, $page),
            'page' => $page,
            'nombrePage' => ceil($repo->getNumMessages($user)/$num),
            'currentmessage' => $message
        ));
    }

    /**
     * @ParamConverter("message", class="NinjaTookenUserBundle:Message", options={"mapping": {"message_id":"id"}})
     */
    public function messagerieVoirAction(Message $message, $page=1)
    {
        $user = $this->get('security.context')->getToken()->getUser();
        $num = $this->container->getParameter('numReponse');
        $page = max(1, $page);

        $repo = $this->getDoctrine()->getManager()->getRepository('NinjaTookenUserBundle:Message');

        return $this->render('NinjaTookenUserBundle:Default:messagerie.html.twig', array(
            'messages' => $repo->getMessages($user, $num, $page),
            'page' => $page,
            'nombrePage' => ceil($repo->getNumMessages($user)/$num),
            'currentmessage' => $message
        ));
    }

    public function messagerieAjouterAction()
    {
        return $this->render('NinjaTookenUserBundle:Default:messagerie.html.twig', array('messages' => array()));
    }

    public function userFindAction(Request $request)
    {
        $response = new JsonResponse();
        $users = array();

        if($request->isXmlHttpRequest()){
            $user = $request->query->get('q');

            if(!empty($user)){
                $qb = $this->container->get('doctrine')->getEntityManager()->createQueryBuilder()
                    ->select('u.username')
                    ->from('NinjaTookenUserBundle:User', 'u')
                    ->where("u.username LIKE :q")
                    ->orderBy('u.username', 'ASC')
                    ->setParameter('q', $user.'%')
                    ->setFirstResult(0)
                    ->setMaxResults(10);

                $users = $qb->getQuery()->getResult();
            }
        }

        $response->setData($users);
        return $response;
    }

    /**
     * @ParamConverter("message", class="NinjaTookenUserBundle:Message", options={"mapping": {"message_id":"id"}})
     */
    public function messagerieSupprimerAction(Message $message, $page=1)
    {
        return $this->render('NinjaTookenUserBundle:Default:messagerie.html.twig', array('messages' => array()));
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
        $num = $this->container->getParameter('numReponse');
        $page1 = max(1, $page1);
        $page2 = max(1, $page2);

        $user = $this->get('security.context')->getToken()->getUser();

        $repo = $this->getDoctrine()->getManager()->getRepository('NinjaTookenUserBundle:Friend');

        $friends = $repo->createQueryBuilder('f')
            ->where('f.user = :user')
            ->andWhere('f.isConfirmed = true')
            ->andWhere('f.isBlocked = false')
            ->setParameter('user', $user)
            ->addOrderBy('f.dateAjout', 'DESC')
            ->setFirstResult(($page1-1) * $num)
            ->setMaxResults($num)
            ->getQuery()->getResult();

        $total1 = $repo->createQueryBuilder('f')
            ->select('COUNT(f)')
            ->where('f.user = :user')
            ->andWhere('f.isConfirmed = true')
            ->andWhere('f.isBlocked = false')
            ->setParameter('user', $user)
            ->getQuery()->getSingleScalarResult();

        $demandes = $repo->createQueryBuilder('f')
            ->where('f.user = :user')
            ->andWhere('f.isConfirmed = false')
            ->andWhere('f.isBlocked = false')
            ->setParameter('user', $user)
            ->addOrderBy('f.dateAjout', 'DESC')
            ->setFirstResult(($page2-1) * $num)
            ->setMaxResults($num)
            ->getQuery()->getResult();

        $total2 = $repo->createQueryBuilder('f')
            ->select('COUNT(f)')
            ->where('f.user = :user')
            ->andWhere('f.isConfirmed = false')
            ->andWhere('f.isBlocked = false')
            ->setParameter('user', $user)
            ->getQuery()->getSingleScalarResult();

        return $this->render('NinjaTookenUserBundle:Default:amis.html.twig', array(
            'friends' => $friends,
            'demandes' => $demandes,
            'page1' => $page1,
            'page2' => $page2,
            'nombrePage1' => ceil($total1/$num),
            'nombrePage2' => ceil($total2/$num)
        ));
    }

    /**
     * @ParamConverter("user", class="NinjaTookenUserBundle:User", options={"mapping": {"user_nom":"slug"}})
     */
    public function amisConfirmerAction(User $user)
    {
        $repo = $this->getDoctrine()->getManager()->getRepository('NinjaTookenUserBundle:Friend');
        $friends = $repo->createQueryBuilder('f')
            ->where('f.user = :user')
            ->andWhere('f.user = :user')
            ->setParameter('user', $user)
            ->addOrderBy('f.dateAjout', 'DESC')
            ->setFirstResult(0)
            ->setMaxResults(1)
            ->getQuery()->getResult();

        return $this->render('NinjaTookenUserBundle:Default:amis.html.twig', array(
            'friends' => $friends
        ));
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
        $num = $this->container->getParameter('numReponse');
        $page = max(1, $page);

        $user = $this->get('security.context')->getToken()->getUser();

        $repo = $this->getDoctrine()->getManager()->getRepository('NinjaTookenUserBundle:Capture');

        $captures = $repo->createQueryBuilder('c')
            ->where('c.user = :user')
            ->setParameter('user', $user)
            ->addOrderBy('c.dateAjout', 'DESC')
            ->setFirstResult(($page-1) * $num)
            ->setMaxResults($num)
            ->getQuery()->getResult();

        $total = $repo->createQueryBuilder('c')
            ->select('COUNT(c)')
            ->where('c.user = :user')
            ->setParameter('user', $user)
            ->getQuery()->getSingleScalarResult();

        return $this->render('NinjaTookenUserBundle:Default:captures.html.twig', array(
            'captures' => $captures,
            'page' => $page,
            'nombrePage' => ceil($total/$num)
        ));
    }

    public function capturesSupprimerAction($id)
    {
        return $this->render('NinjaTookenUserBundle:Default:captures.html.twig');
    }
}
