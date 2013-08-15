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

    public function oldUserAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        $user = $em->getRepository('NinjaTookenUserBundle:User')->findOneBy(array('old_id' => (int)$request->get('ID')));

        if(!$user){
            throw new NotFoundHttpException('Cet utilisateur n\'existe pas !');
        }

        return $this->redirect($this->generateUrl('ninja_tooken_user_fiche', array(
            'user_nom' => $user->getSlug(),
            'page' => 1
        )));
    }

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
    public function ficheAction(User $user, $page = 1)
    {
        // amis
        $num = $this->container->getParameter('numReponse');
        $page = max(1, $page);

        $friends = $this->getDoctrine()->getManager()
            ->getRepository('NinjaTookenUserBundle:Friend')
            ->getFriends($user, $num, $page);

        return $this->render('NinjaTookenUserBundle:Default:fiche.html.twig', array(
            'friends' => $friends,
            'page' => $page,
            'nombrePage' => ceil(count($friends)/$num),
            'user' => $user
        ));
    }

    public function userSearchAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $num = $this->container->getParameter('numReponse');
        $q = $request->get('q');

        $query = $em->getRepository('NinjaTookenUserBundle:User')->createQueryBuilder('u')
            ->where('u.locked = :locked')
            ->setParameter('locked', false);

        if(!empty($q)){
            $query->andWhere('u.username LIKE :q')
                ->setParameter('q', $q.'%');
        }

        $query->setFirstResult(0)
            ->setMaxResults($num);

        return $this->render('NinjaTookenUserBundle:Default:search.html.twig', array(
            'users' => $query->getQuery()->getResult()
        ));
    }

    public function messagerieAction($page=1)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') ){
            $user = $security->getToken()->getUser();
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
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    /**
     * @ParamConverter("message", class="NinjaTookenUserBundle:Message", options={"mapping": {"message_id":"id"}})
     */
    public function messagerieVoirAction(Message $message, $page=1)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') ){
            $user = $security->getToken()->getUser();
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
        return $this->redirect($this->generateUrl('fos_user_security_login'));
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
                $qb = $this->getDoctrine()->getEntityManager()->createQueryBuilder()
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
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') ){
            return $this->render('NinjaTookenUserBundle:Default:messagerie.html.twig', array('messages' => array()));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    public function parametresAction()
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') ){
            return $this->render('NinjaTookenUserBundle:Default:parametres.html.twig');
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    public function parametresModifierAction()
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') ){
            return $this->render('NinjaTookenUserBundle:Default:parametres.html.twig');
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    public function amisAction($page1, $page2)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') ){
            $num = $this->container->getParameter('numReponse');
            $page1 = max(1, $page1);
            $page2 = max(1, $page2);

            $user = $security->getToken()->getUser();

            $repo = $this->getDoctrine()->getManager()->getRepository('NinjaTookenUserBundle:Friend');

            $friends = $repo->getFriends($user, $num, $page1);

            $demandes = $repo->getDemandes($user, $num, $page2);

            return $this->render('NinjaTookenUserBundle:Default:amis.html.twig', array(
                'friends' => $friends,
                'demandes' => $demandes,
                'page1' => $page1,
                'page2' => $page2,
                'nombrePage1' => ceil(count($friends)/$num),
                'nombrePage2' => ceil(count($demandes)/$num)
            ));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    /**
     * @ParamConverter("friend", class="NinjaTookenUserBundle:User", options={"mapping": {"user_nom":"slug"}})
     */
    public function amisConfirmerAction(User $friend)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') ){
            $user = $security->getToken()->getUser();

            $friends = $this->getDoctrine()->getManager()
                ->getRepository('NinjaTookenUserBundle:Friend')
                ->getFriends($friend, 1, 0);

            return $this->render('NinjaTookenUserBundle:Default:amis.html.twig', array(
                'friends' => $friends
            ));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    /**
     * @ParamConverter("user", class="NinjaTookenUserBundle:User", options={"mapping": {"user_nom":"slug"}})
     */
    public function amisBloquerAction(User $user)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') ){
            return $this->render('NinjaTookenUserBundle:Default:amis.html.twig');
        }
    }

    public function capturesAction($page)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') ){
            $num = $this->container->getParameter('numReponse');
            $page = max(1, $page);

            $captures = $this->getDoctrine()->getManager()
                ->getRepository('NinjaTookenUserBundle:Capture')
                ->getCaptures($security->getToken()->getUser(), $num, $page);

            return $this->render('NinjaTookenUserBundle:Default:captures.html.twig', array(
                'captures' => $captures,
                'page' => $page,
                'nombrePage' => ceil(count($captures)/$num)
            ));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    public function capturesSupprimerAction($id)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') ){
            return $this->render('NinjaTookenUserBundle:Default:captures.html.twig');
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }
}
