<?php

namespace NinjaTooken\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use NinjaTooken\UserBundle\Entity\User;
use NinjaTooken\UserBundle\Entity\Friend;
use NinjaTooken\UserBundle\Entity\Message;
use FOS\UserBundle\Mailer\MailerInterface;

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

    public function messagerieEnvoiAction(Request $request, $page=1)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') ){
            $user = $security->getToken()->getUser();
            $num = $this->container->getParameter('numReponse');
            $page = max(1, $page);
            $em = $this->getDoctrine()->getManager();

            $repo = $em->getRepository('NinjaTookenUserBundle:Message');

            $id = (int)$request->get('id');
            if(empty($id)){
                $message = current($repo->getFirstSendMessage($user));
                if($message)
                    $id = $message->getId();
            }else{
                $message = $repo->findOneBy(array('id' => $id));

                // suppression du message
                if((int)$request->get('del')==1){
                    $message->setHasDeleted(true);
                    $em->persist($message);
                    $em->flush();

                    $message = current($repo->getFirstSendMessage($user));
                    $id = $message->getId();
                }
            }

            return $this->render('NinjaTookenUserBundle:Default:messagerie.html.twig', array(
                'messages' => $repo->getSendMessages($user, $num, $page),
                'page' => $page,
                'nombrePage' => ceil($repo->getNumSendMessages($user)/$num),
                'currentmessage' => $message,
                'id' => $id
            ));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    public function messagerieAction(Request $request, $page=1)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') ){
            $user = $security->getToken()->getUser();
            $num = $this->container->getParameter('numReponse');
            $page = max(1, $page);
            $em = $this->getDoctrine()->getManager();

            $repo = $em->getRepository('NinjaTookenUserBundle:Message');

            $id = (int)$request->get('id');
            if(empty($id)){
                $message = current($repo->getFirstReceiveMessage($user));
                if($message)
                    $id = $message->getId();
            }else
                $message = $repo->findOneBy(array('id' => $id));

            // vérifie l'état de lecture
            if($message){
                foreach($message->getReceivers() as $receiver){
                    if($receiver->getUser() == $user){
                        // suppression du message
                        if((int)$request->get('del')==1){
                            $receiver->setHasDeleted(true);
                            $em->persist($receiver);
                            $em->flush();

                            $message = current($repo->getFirstReceiveMessage($user));
                            $id = $message->getId();
                            break;
                        }
                        // date de lecture
                        if($receiver->getDateRead()->format('Y')=='-0001'){
                            $receiver->setDateRead(new \DateTime('now'));
                            $em->persist($receiver);
                            $em->flush();
                            break;
                        }
                    }
                }
            }

            return $this->render('NinjaTookenUserBundle:Default:messagerie.html.twig', array(
                'messages' => $repo->getReceiveMessages($user, $num, $page),
                'page' => $page,
                'nombrePage' => ceil($repo->getNumReceiveMessages($user)/$num),
                'currentmessage' => $message,
                'id' => $id
            ));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    public function userFindAction(Request $request)
    {
        $response = new JsonResponse();
        $users = array();

        if($request->isXmlHttpRequest()){
            $user = $request->query->get('q');

            if(!empty($user)){
                $qb = $this->getDoctrine()->getEntityManager()->createQueryBuilder()
                    ->select('u.username as text, u.id')
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

    public function parametresAction(Request $request)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') ){
            return $this->render('NinjaTookenUserBundle:Default:parametres.html.twig', array(
                'formPassword' => $this->container->get('fos_user.change_password.form')->createView()
            ));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    public function parametresConfirmMailAction()
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') ){
            $user = $security->getToken()->getUser();

            $confirmation = $user->getConfirmationToken();
            if(isset($confirmation) && !empty($confirmation)){

                $this->container->get('fos_user.mailer')->sendConfirmationEmailMessage($user);

                $this->get('session')->getFlashBag()->add(
                    'notice',
                    'Un mail de confirmation vient d\'être envoyé.'
                );
            }

            return $this->redirect($this->generateUrl('ninja_tooken_user_parametres'));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    public function parametresUpdatePasswordAction(Request $request)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') ){
            $user = $security->getToken()->getUser();


            $form = $this->container->get('fos_user.change_password.form');
            $formHandler = $this->container->get('fos_user.change_password.form.handler');

            $process = $formHandler->process($user);
            if ($process) {
                $this->get('session')->getFlashBag()->add(
                    'notice',
                    'Ton mot de passe a correctement été modifié.'
                );
            }
/*

            $confirmation = $user->getConfirmationToken();
            if(isset($confirmation) && !empty($confirmation)){

                $newPassword = "";
                $user->setPlainPassword($newPassword);
                $this->container->get('fos_user.user_manager')->updateUser($user);

                $this->get('session')->getFlashBag()->add(
                    'notice',
                    'Ton mot de passe a correctement été modifié.'
                );
            }*/

            return $this->redirect($this->generateUrl('ninja_tooken_user_parametres'));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    public function parametresDeleteAccount()
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') ){
            $user = $security->getToken()->getUser();
            $this->container->get('fos_user.user_manager')->deleteUser($user);

            return $this->redirect($this->generateUrl('ninja_tooken_homepage'));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    public function amisAction($page)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') ){
            $num = $this->container->getParameter('numReponse');
            $page = max(1, $page);

            $user = $security->getToken()->getUser();

            $repo = $this->getDoctrine()->getManager()->getRepository('NinjaTookenUserBundle:Friend');

            $friends = $repo->getFriends($user, $num, $page);

            return $this->render('NinjaTookenUserBundle:Default:amis.html.twig', array(
                'friends' => $friends,
                'page' => $page,
                'nombrePage' => ceil(count($friends)/$num)
            ));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    public function amisDemandeAction($page)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') ){
            $num = $this->container->getParameter('numReponse');
            $page = max(1, $page);

            $user = $security->getToken()->getUser();

            $repo = $this->getDoctrine()->getManager()->getRepository('NinjaTookenUserBundle:Friend');

            $demandes = $repo->getDemandes($user, $num, $page);

            return $this->render('NinjaTookenUserBundle:Default:amis.html.twig', array(
                'demandes' => $demandes,
                'page' => $page,
                'nombrePage' => ceil(count($demandes)/$num)
            ));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    /**
     * @ParamConverter("friend", class="NinjaTookenUserBundle:Friend")
     */
    public function amisConfirmerAction(Friend $friend)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') ){
            $user = $security->getToken()->getUser();

            if($friend->getUser() == $user){
                $em = $this->getDoctrine()->getManager();

                $friend->setIsConfirmed(true);
                $em->persist($friend);
                $em->flush();

                $this->get('session')->getFlashBag()->add(
                    'notice',
                    $friend->getFriend()->getUsername().' fait désormais partie de tes amis.'
                );
            }
            return $this->redirect($this->generateUrl('ninja_tooken_user_amis'));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    /**
     * @ParamConverter("friend", class="NinjaTookenUserBundle:Friend")
     */
    public function amisBloquerAction(Friend $friend)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') ){
            $user = $security->getToken()->getUser();

            if($friend->getUser() == $user){
                $em = $this->getDoctrine()->getManager();

                $friend->setIsBlocked(true);
                $em->persist($friend);
                $em->flush();

                $this->get('session')->getFlashBag()->add(
                    'notice',
                    $friend->getFriend()->getUsername().' est désormais bloqué.'
                );
            }
            return $this->redirect($this->generateUrl('ninja_tooken_user_amis'));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
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

    /**
     * @ParamConverter("capture", class="NinjaTookenUserBundle:Capture")
     */
    public function capturesSupprimerAction(Capture $capture)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') ){
            $user = $security->getToken()->getUser();
            if($capture->getUser() == $user){
                // supprime d'imgur
                $ch		= curl_init();
                curl_setopt($ch, CURLOPT_HEADER, 0);
                curl_setopt($ch, CURLOPT_VERBOSE, 0);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/4.0 (compatible;)");
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
                curl_setopt($ch, CURLOPT_HTTPHEADER, array('Authorization: Client-ID 4dfd53cd4de2cb1') );
                curl_setopt($ch, CURLOPT_URL, "https://api.imgur.com/3/image/".$capture->getDeleteHash());
                $retour	= curl_exec($ch);
				if(!curl_errno($ch)){
                    $em = $this->getDoctrine()->getManager();

                    $em->remove($capture);
                    $em->flush();
                    $this->get('session')->getFlashBag()->add(
                        'notice',
                        'La capture a bien été supprimée.'
                    );
                }
            }
            return $this->redirect($this->generateUrl('ninja_tooken_user_captures'));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }
}
