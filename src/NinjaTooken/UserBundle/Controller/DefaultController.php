<?php

namespace NinjaTooken\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use NinjaTooken\UserBundle\Entity\User;
use NinjaTooken\UserBundle\Entity\Friend;
use NinjaTooken\UserBundle\Entity\Capture;
use NinjaTooken\UserBundle\Entity\Message;
use NinjaTooken\UserBundle\Form\Type\MessageType;
use NinjaTooken\UserBundle\Entity\MessageUser;

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
        $em = $this->getDoctrine()->getManager();
        $repo_message = $em->getRepository('NinjaTookenUserBundle:Message');
        $repo_friend = $em->getRepository('NinjaTookenUserBundle:Friend');
        $user->numNewMessage = $repo_message->getNumNewMessages($user);
        $user->numDemandesFriends = $repo_friend->getNumDemandes($user);

        $ninja = $user->getNinja();
        if($ninja){
            $gameData = $this->get('ninjatooken_game.gamedata');

            // l'expérience (et données associées)
            $gameData->setExperience($ninja->getExperience(), $ninja->getGrade());

            $user->level = $gameData->getLevelActuel();
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

    public function messagerieEnvoiAction(Request $request, $page=1)
    {
        return $this->messagerie($request, $page, false);
    }

    public function messagerieAction(Request $request, $page=1)
    {
        return $this->messagerie($request, $page);
    }

    public function messagerie(Request $request, $page=1, $reception=true)
    {
        $security = $this->get('security.context');

        if($security->isGranted('ROLE_USER') ){
            $user = $security->getToken()->getUser();

            $num = $this->container->getParameter('numReponse');
            $page = max(1, $page);
            $id = 0;

            $em = $this->getDoctrine()->getManager();
            $repo_message = $em->getRepository('NinjaTookenUserBundle:Message');

            // est dans l'envoi d'un message ?
            $isNewMessage = (int)$request->get('add')==1;

            // est dans la suppression d'un message ?
            $isDeleteMessage = (int)$request->get('del')==1;

            // l'envoi d'un message
            $form = null;
            if($isNewMessage){
                $message = new Message();
                $form = $this->createForm(new MessageType(), $message);
                if('POST' === $request->getMethod()) {
                    // cas particulier du formulaire avec tinymce
                    $request->request->set('message', array_merge(
                        $request->request->get('message'),
                        array('content' => $request->get('message_content'))
                    ));

                    $form->bind($request);

                    if ($form->isValid()) {
                        $destinataires = array();
                        $destis = $request->request->get('destinataires');
                        if($destis){
                            $repo_user = $em->getRepository('NinjaTookenUserBundle:User');
                            foreach($destis as $desti){
                                $destinataire = $repo_user->findOneById((int)$desti);
                                if($destinataire)
                                    $destinataires[] = $destinataire;
                            }
                        }

                        if(!empty($destinataires)){
                            $message->setAuthor($user);
                            foreach($destinataires as $destinataire){
                                $messageuser = new MessageUser();
                                $messageuser->setDestinataire($destinataire);
                                $message->addReceiver($messageuser);

                                $em->persist($messageuser);
                            }
                            $em->persist($message);

                            $em->flush();
                        }

                        $this->get('session')->getFlashBag()->add(
                            'notice',
                            'Le message a bien été envoyé.'
                        );
                        return $this->redirect($this->generateUrl($reception?'ninja_tooken_user_messagerie':'ninja_tooken_user_messagerie_envoi', array(
                            'page' => $page
                        )));
                    }
                }
            // lecture - suppression
            }else{

                // cherche un message à afficher
                $id = (int)$request->get('id');
                if(!empty($id))
                    $message = $repo_message->findOneBy(array('id' => $id));
                else{
                    $message = current($reception?$repo_message->getFirstReceiveMessage($user):$repo_message->getFirstSendMessage($user));
                    if($message)
                        $id = $message->getId();
                }

                if($message){
                    // en réception
                    if($reception){
                        foreach($message->getReceivers() as $receiver){
                            if($receiver->getDestinataire() == $user){
                                // suppression du message
                                if($isDeleteMessage){
                                    $receiver->setHasDeleted(true);
                                    $em->persist($receiver);
                                    $em->flush();

                                    $this->get('session')->getFlashBag()->add(
                                        'notice',
                                        'Le message a bien été supprimé.'
                                    );
                                    return $this->redirect($this->generateUrl('ninja_tooken_user_messagerie', array(
                                        'page' => $page
                                    )));
                                }
                                // date de lecture
                                if($receiver->getDateRead()===null){
                                    $receiver->setDateRead(new \DateTime('now'));
                                    $em->persist($receiver);
                                    $em->flush();
                                    break;
                                }
                            }
                        }
                    // en envoi : suppression du message
                    }elseif($isDeleteMessage){
                        $message->setHasDeleted(true);
                        $em->persist($message);
                        $em->flush();

                        $this->get('session')->getFlashBag()->add(
                            'notice',
                            'Le message a bien été supprimé.'
                        );
                        return $this->redirect($this->generateUrl('ninja_tooken_user_messagerie_envoi', array(
                            'page' => $page
                        )));
                    }
                }
                // le formulaire de réponse d'un message
                if($message){
                    $messageform = new Message();
                    $messageform->setNom('Re : '.str_replace('Re : ', '', $message->getNom()));
                    $messageform->setContent('<fieldset><legend>'.$message->getAuthor()->getUsername().'</legend>'.$message->getContent().'</fieldset><p></p>');

                    $form = $this->createForm(new MessageType(), $messageform);
                }
            }

            if($reception){
                $messages = $repo_message->getReceiveMessages($user, $num, $page);
                $total = $repo_message->getNumReceiveMessages($user);
            }else{
                $messages = $repo_message->getSendMessages($user, $num, $page);
                $total = $repo_message->getNumSendMessages($user);
            }

            return $this->render('NinjaTookenUserBundle:Default:messagerie.html.twig', array(
                    'messages' => $messages,
                    'page' => $page,
                    'nombrePage' => ceil($total/$num),
                    'currentmessage' => $message,
                    'id' => $id,
                    'form' => $form?$form->createView():null
                )
            );
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    public function userFindAction(Request $request)
    {
        $response = new JsonResponse();
        $users = array();

        if($request->isXmlHttpRequest()){
            $user = (string)$request->query->get('q');

            if(!empty($user)){
                $users = $this->getDoctrine()
                    ->getEntityManager()
                    ->getRepository('NinjaTookenUserBundle:User')
                    ->searchUser($user, 10, false);
            }
        }

        $response->setData($users);
        return $response;
    }

    public function userSearchAction(Request $request)
    {
        $users = array();

        $user = (string)$request->get('q');
        if(!empty($user)){
            $users = $this->getDoctrine()
                ->getEntityManager()
                ->getRepository('NinjaTookenUserBundle:User')
                ->searchUser($user, $this->container->getParameter('numReponse'));
        }

        return $this->render('NinjaTookenUserBundle:Default:search.html.twig', array(
            'users' => $users
        ));
    }

    public function parametresAction()
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') ){
            return $this->render('NinjaTookenUserBundle:Default:parametres.html.twig', array(
                'form' => $this->container->get('fos_user.change_password.form')->createView()
            ));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    public function parametresUpdateAction(Request $request)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') ){
            // post request
            if ($request->getMethod() === 'POST') {
                $user = $security->getToken()->getUser();
                $em = $this->getDoctrine()->getManager();

                $update = false;
                // paramètres de compte
                if((int)$request->get('editAccount') == 1){
                    $userManager = $this->container->get('fos_user.user_manager');

                    // modification de pseudo
                    $oldPseudo = $user->getOldUsernames();
                    $pseudo = trim((string)$request->get('pseudo'));
                    if(count($oldPseudo)<4 || in_array($pseudo, $oldPseudo)){
                        $oPseudo = $user->getUsername();
                        if($oPseudo != $pseudo && !empty($pseudo)){
                            // le pseudo n'est pas actuellement utilisé
                            if(!$userManager->findUserByUsername($pseudo)){
                                // le pseudo n'est pas utilisé par un autre joueur
                                if(!$em->getRepository('NinjaTookenUserBundle:User')->findUserByOldPseudo($pseudo, $user->getId())){
                                    $user->setUsername($pseudo);
                                    $user->addOldUsername($oPseudo);
                                }else{
                                    $this->get('session')->getFlashBag()->add(
                                        'notice',
                                        'Le pseudo demandé est déjà utilisé.'
                                    );
                                }
                            }else{
                                $this->get('session')->getFlashBag()->add(
                                    'notice',
                                    'Le pseudo demandé est déjà utilisé.'
                                );
                            }
                        }
                    }else{
                        $this->get('session')->getFlashBag()->add(
                            'notice',
                            'Maximum de changement de pseudo atteint.'
                        );
                    }

                    // modification d'email
                    $email = (string)$request->get('email');
                    if(preg_match('#^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,6}$#', $email)){
                        $oEmail = $user->getEmail();
                        if($oEmail != $email){
                            if(!$userManager->findUserByEmail($email)){
                                if (null === $user->getConfirmationToken()) {
                                    $user->setConfirmationToken($this->get('fos_user.util.token_generator')->generateToken());
                                }
                                $user->setEmail($email);
                            }else{
                                $this->get('session')->getFlashBag()->add(
                                    'notice',
                                    'Le mail demandé est déjà utilisé.'
                                );
                            }
                        }
                    }

                    $user->setGender((string)$request->get('gender')=='f'?'f':'m');
                    $user->setLocale((string)$request->get('locale')=='fr'?'fr':'en');

                    $user->setDateOfBirth(new \DateTime((int)$request->get('annee')."-".(int)$request->get('mois')."-".(int)$request->get('jour')));

                    $user->setDescription((string)$request->get('user_description'));

                    $user->setReceiveNewsletter((int)$request->get('news') == 1);
                    $user->setReceiveAvertissement((int)$request->get('mail') == 1);

                    $this->get('session')->getFlashBag()->add(
                        'notice',
                        'Tes paramètres ont bien été mis à jour.'
                    );

                    $update = true;
                // hébergement de l'avatar
                }elseif((int)$request->get('editAvatar') == 1){
                    $user->setUseGravatar(
                        $request->get('avatar') == 'gravatar'
                    );

                    $this->get('session')->getFlashBag()->add(
                        'notice',
                        'Le mode d\'hébergement de ton avatar a été modifié.'
                    );

                    $update = true;
                }

                // permet d'enregistrer les modifications
                if($update){
                    $em->persist($user);
                    $em->flush();
                }

            }
            return $this->redirect($this->generateUrl('ninja_tooken_user_parametres'));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    public function parametresUpdateAvatarAction(Request $request)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') ){
            // post request
            if ($request->getMethod() === 'POST') {
                $user = $security->getToken()->getUser();
                $em = $this->getDoctrine()->getManager();

                // permet de générer le fichier
                $file = $request->files->get('avatar');
                if($file !== null){
                    $extension = strtolower($file->guessExtension());
                    if(in_array($extension, array('jpeg','jpg','png','gif'))){
                        $user->file = $file;
                        $cachedImage = dirname(__FILE__).'/../../../../www/cache/avatar/'.$user->getWebAvatar();
                        if(file_exists($cachedImage)){
                            unlink($cachedImage);
                        }
                        $user->setAvatar('');
                    }
                }

                $em->persist($user);
                $em->flush();

                $this->get('session')->getFlashBag()->add(
                    'notice',
                    'Ton avatar a bien été mis à jour.'
                );
            }

            return $this->redirect($this->generateUrl('ninja_tooken_user_parametres'));
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

                $newPassword = "";
                $user->setPlainPassword($newPassword);
                $this->container->get('fos_user.user_manager')->updateUser($user);

                $this->get('session')->getFlashBag()->add(
                    'notice',
                    'Ton mot de passe a correctement été modifié.'
                );
            */

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
                'numFriends' => $repo->getNumFriends($user),
                'numBlocked' => $repo->getNumBlocked($user),
                'numDemande' => $repo->getNumDemandes($user),
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
                'numFriends' => $repo->getNumFriends($user),
                'numBlocked' => $repo->getNumBlocked($user),
                'numDemande' => $repo->getNumDemandes($user),
                'page' => $page,
                'nombrePage' => ceil(count($demandes)/$num)
            ));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    public function amisBlockedAction($page)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') ){
            $num = $this->container->getParameter('numReponse');
            $page = max(1, $page);

            $user = $security->getToken()->getUser();

            $repo = $this->getDoctrine()->getManager()->getRepository('NinjaTookenUserBundle:Friend');

            $blocked = $repo->getBlocked($user, $num, $page);

            return $this->render('NinjaTookenUserBundle:Default:amis.html.twig', array(
                'blocked' => $blocked,
                'numFriends' => $repo->getNumFriends($user),
                'numBlocked' => $repo->getNumBlocked($user),
                'numDemande' => $repo->getNumDemandes($user),
                'page' => $page,
                'nombrePage' => ceil(count($blocked)/$num)
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
            return $this->redirect($this->generateUrl('ninja_tooken_user_amis_blocked'));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    /**
     * @ParamConverter("friend", class="NinjaTookenUserBundle:Friend")
     */
    public function amisDebloquerAction(Friend $friend)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') ){
            $user = $security->getToken()->getUser();

            if($friend->getUser() == $user){
                $em = $this->getDoctrine()->getManager();

                $friend->setIsBlocked(false);
                $em->persist($friend);
                $em->flush();

                $this->get('session')->getFlashBag()->add(
                    'notice',
                    $friend->getFriend()->getUsername().' est débloqué.'
                );
            }
            return $this->redirect($this->generateUrl('ninja_tooken_user_amis'));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    /**
     * @ParamConverter("friend", class="NinjaTookenUserBundle:Friend")
     */
    public function amisSupprimerAction(Friend $friend)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') ){
            $user = $security->getToken()->getUser();

            if($friend->getUser() == $user){
                $em = $this->getDoctrine()->getManager();

                $em->remove($friend);
                $em->flush();

                $this->get('session')->getFlashBag()->add(
                    'notice',
                    'Suppression correctement effectuée.'
                );
            }
            return $this->redirect($this->generateUrl('ninja_tooken_user_amis_blocked'));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    public function amisBlockedSupprimerAction()
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') ){
            $user = $security->getToken()->getUser();
            $em = $this->getDoctrine()->getManager();
            $repo = $em->getRepository('NinjaTookenUserBundle:Friend');

            $repo->deleteAllBlocked($user);

            $this->get('session')->getFlashBag()->add(
                'notice',
                'Suppressions correctement effectuées.'
            );
            return $this->redirect($this->generateUrl('ninja_tooken_user_amis_blocked'));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    public function amisDemandeSupprimerAction()
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') ){
            $user = $security->getToken()->getUser();
            $em = $this->getDoctrine()->getManager();
            $repo = $em->getRepository('NinjaTookenUserBundle:Friend');

            $repo->deleteAllDemandes($user);

            $this->get('session')->getFlashBag()->add(
                'notice',
                'Suppressions correctement effectuées.'
            );
            return $this->redirect($this->generateUrl('ninja_tooken_user_amis_blocked'));
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
                $imgur = $this->container->getParameter('imgur');
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_HEADER, 0);
                curl_setopt($ch, CURLOPT_VERBOSE, 0);
                curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/4.0 (compatible;)");
                curl_setopt($ch, CURLOPT_URL, "https://api.imgur.com/3/image/".$capture->getDeleteHash());
                curl_setopt($ch, CURLOPT_POST, true);
                curl_setopt($ch, CURLOPT_HTTPHEADER, array('Authorization: Client-ID '.$imgur) );
                if($retour = curl_exec($ch)){
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
