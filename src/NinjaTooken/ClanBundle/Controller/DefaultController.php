<?php

namespace NinjaTooken\ClanBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use NinjaTooken\ClanBundle\Entity\Clan;
use NinjaTooken\ClanBundle\Form\Type\ClanType;
use NinjaTooken\ClanBundle\Entity\ClanUtilisateur;
use NinjaTooken\ClanBundle\Entity\ClanProposition;
use NinjaTooken\ClanBundle\Entity\ClanPostulation;
use NinjaTooken\ForumBundle\Entity\Forum;
use NinjaTooken\ForumBundle\Entity\Thread;
use NinjaTooken\UserBundle\Entity\User;
use NinjaTooken\UserBundle\Entity\Message;
use NinjaTooken\UserBundle\Entity\MessageUser;

class DefaultController extends Controller
{
    public function listeAction(Request $request, $page = 1)
    {
        $num = $this->container->getParameter('numReponse');
        $page = max(1, $page);

        $em = $this->getDoctrine()->getManager();

        $order = $request->get('order');
        if(empty($order))
            $order = 'composition';

        $repo = $em->getRepository('NinjaTookenClanBundle:Clan');

        return $this->render('NinjaTookenClanBundle:Default:liste.html.twig', array(
            'clans' => $repo->getClans($order, $num, $page),
            'lastClans' => $repo->getClans("date", 10, 1),
            'page' => $page,
            'nombrePage' => ceil($repo->getNumClans()/$num),
            'order' => $order
        ));
    }

    public function oldClanAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        $clan = $em->getRepository('NinjaTookenClanBundle:Clan')->findOneBy(array('old_id' => (int)$request->get('ID')));

        if(!$clan){
            throw new NotFoundHttpException($this->get('translator')->trans('description.error404.clan'));
        }

        return $this->redirect($this->generateUrl('ninja_tooken_clan', array(
            'clan_nom' => $clan->getSlug(),
            'page' => 1
        )));
    }

    /**
     * @ParamConverter("clan", class="NinjaTookenClanBundle:Clan", options={"mapping": {"clan_nom":"slug"}})
     */
    public function clanAction(Clan $clan)
    {
        $em = $this->getDoctrine()->getManager();

        // le forum du clan
        $forum = $em->getRepository('NinjaTookenForumBundle:Forum')->getForum($clan->getSlug(), $clan);
        $threads = array();
        if($forum){
            $forum = current($forum);
            $threads = $em->getRepository('NinjaTookenForumBundle:Thread')->getThreads($forum, 5, 1);
            if(count($threads)>0)
                $forum->threads = $threads;
            else
                $forum->threads = array();
        }

        // l'arborescence des membres
        $shishou = $em->getRepository('NinjaTookenClanBundle:ClanUtilisateur')->getMembres($clan, 0, null, 1, 1);
        $membres = array();
        if($shishou){
            $shishou = current($shishou);
            $membres = array(
                'recruteur' => $shishou,
                'recruts' => $this->getRecruts($shishou)
            );
        }

        // l'arborescence des membres mise à plat (listing simple)
        $membresListe = $this->getRecruteur($membres);

        return $this->render('NinjaTookenClanBundle:Default:clan.html.twig', array(
            'clan' => $clan,
            'forum' => $forum,
            'membres' => $membres,
            'membresListe' => $membresListe
        ));
    }

    public function clanAjouterAction(Request $request)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') || $security->isGranted('IS_AUTHENTICATED_REMEMBERED') ){
            $user = $security->getToken()->getUser();

            if(!$user->getClan()){
                $clan = new Clan();
                $form = $this->createForm(new ClanType(), $clan);
                if('POST' === $request->getMethod()) {
                    // cas particulier du formulaire avec tinymce
                    $request->request->set('clan', array_merge(
                        $request->request->get('clan'),
                        array('description' => $request->get('clan_description'))
                    ));

                    $form->bind($request);

                    if ($form->isValid()) {
                        $em = $this->getDoctrine()->getManager();

                        // permet de générer le fichier
                        $file = $request->files->get('clan')['kamonUpload'];
                        if($file !== null){
                            $extension = strtolower($file->guessExtension());
                            if(in_array($extension, array('jpeg','jpg','png','gif'))){
                                $clan->file = $file;
                                $cachedImage = dirname(__FILE__).'/../../../../web/cache/kamon/'.$clan->getWebKamonUpload();
                                if(file_exists($cachedImage)){
                                    unlink($cachedImage);
                                }
                                $clan->setKamonUpload('');
                            }
                        }

                        $clanutilisateur = new ClanUtilisateur();
                        $clanutilisateur->setCanEditClan(true);
                        $clanutilisateur->setRecruteur($user);
                        $clanutilisateur->setMembre($user);

                        $clan->addMembre($clanutilisateur);
                        $user->setClan($clanutilisateur);

                        $forum = new Forum();
                        $forum->setNom($clan->getNom());
                        $forum->setClan($clan);

                        $thread = new Thread();
                        $thread->setNom('Général');
                        $thread->setBody($clan->getDescription());
                        $thread->setForum($forum);
                        $thread->setAuthor($user);

                        $em->persist($thread);
                        $em->persist($forum);
                        $em->persist($clanutilisateur);
                        $em->persist($user);
                        $em->persist($clan);
                        $em->flush();

                        $this->get('session')->getFlashBag()->add(
                            'notice',
                            $this->get('translator')->trans('notice.clan.ajoutOk')
                        );

                        return $this->redirect($this->generateUrl('ninja_tooken_clan', array(
                            'clan_nom' => $clan->getSlug()
                        )));
                    }
                }
            }else{
                return $this->redirect($this->generateUrl('ninja_tooken_clan', array(
                    'clan_nom' => $user->getClan()->getClan()->getSlug()
                )));
            }
            return $this->render('NinjaTookenClanBundle:Default:clan.form.html.twig', array(
                'form' => $form->createView()
            ));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    /**
     * @ParamConverter("utilisateur", class="NinjaTookenUserBundle:User", options={"mapping": {"user_nom":"slug"}})
     */
    public function clanEditerSwitchAction(User $utilisateur)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') || $security->isGranted('IS_AUTHENTICATED_REMEMBERED') ){
            $user = $security->getToken()->getUser();

            // vérification des droits utilisateurs
            $isShisho = false;
            if($user->getClan()){
                if($user->getClan()->getDroit()==0)
                    $isShisho = true;
            }

            if($isShisho || $security->isGranted('ROLE_ADMIN') !== false || $security->isGranted('ROLE_MODERATOR') !== false){

                $clanutilisateur = $utilisateur->getClan();
                $clan = $user->getClan()->getClan();
                if($clanutilisateur && $clanutilisateur->getClan()==$clan){
                    $em = $this->getDoctrine()->getManager();

                    $clanutilisateur->setCanEditClan(!$clanutilisateur->getCanEditClan());
                    $em->persist($clanutilisateur);

                    $em->flush();

                    $this->get('session')->getFlashBag()->add(
                        'notice',
                        $this->get('translator')->trans('notice.clan.editOk')
                    );
                }
                return $this->redirect($this->generateUrl('ninja_tooken_clan', array(
                    'clan_nom' => $clan->getSlug()
                )));
            }
            return $this->redirect($this->generateUrl('ninja_tooken_clans'));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    /**
     * @ParamConverter("clan", class="NinjaTookenClanBundle:Clan", options={"mapping": {"clan_nom":"slug"}})
     */
    public function clanModifierAction(Request $request, Clan $clan)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') || $security->isGranted('IS_AUTHENTICATED_REMEMBERED') ){
            $user = $security->getToken()->getUser();

            // vérification des droits utilisateurs
            $canEdit = false;
            $clanutilisateur = $user->getClan();
            if($clanutilisateur){
                if($clanutilisateur->getClan() == $clan && ($clanutilisateur->getCanEditClan() || $clanutilisateur->getDroit()==0))
                    $canEdit = true;
            }

            if($canEdit || $security->isGranted('ROLE_ADMIN') !== false || $security->isGranted('ROLE_MODERATOR') !== false){
                $form = $this->createForm(new ClanType(), $clan);
                if('POST' === $request->getMethod()) {
                    // cas particulier du formulaire avec tinymce
                    $request->request->set('clan', array_merge(
                        $request->request->get('clan'),
                        array('description' => $request->get('clan_description'))
                    ));

                    $form->bind($request);

                    if ($form->isValid()) {
                        $em = $this->getDoctrine()->getManager();

                        // permet de générer le fichier
                        $file = $request->files->get('clan')['kamonUpload'];
                        if($file !== null){
                            $extension = strtolower($file->guessExtension());
                            if(in_array($extension, array('jpeg','jpg','png','gif'))){
                                $clan->file = $file;
                                $cachedImage = dirname(__FILE__).'/../../../../web/cache/kamon/'.$clan->getWebKamonUpload();
                                if(file_exists($cachedImage)){
                                    unlink($cachedImage);
                                }
                                $clan->setKamonUpload('');
                            }
                        }

                        $em->persist($clan);
                        $em->flush();

                        $this->get('session')->getFlashBag()->add(
                            'notice',
                            $this->get('translator')->trans('notice.clan.editOk')
                        );

                        return $this->redirect($this->generateUrl('ninja_tooken_clan', array(
                            'clan_nom' => $clan->getSlug()
                        )));
                    }
                }
                return $this->render('NinjaTookenClanBundle:Default:clan.form.html.twig', array(
                    'form' => $form->createView(),
                    'clan' => $clan
                ));
            }
            return $this->redirect($this->generateUrl('ninja_tooken_clans'));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    /**
     * @ParamConverter("clan", class="NinjaTookenClanBundle:Clan", options={"mapping": {"clan_nom":"slug"}})
     */
    public function clanSupprimerAction(Clan $clan)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') || $security->isGranted('IS_AUTHENTICATED_REMEMBERED') ){
            $user = $security->getToken()->getUser();

            // vérification des droits utilisateurs
            $canDelete = false;
            $clanutilisateur = $user->getClan();
            if($clanutilisateur){
                if($clanutilisateur->getClan() == $clan && $clanutilisateur->getDroit()==0)
                    $canDelete = true;
            }

            if($canDelete || $security->isGranted('ROLE_ADMIN') !== false || $security->isGranted('ROLE_MODERATOR') !== false){
                $em = $this->getDoctrine()->getManager();

                // enlève les évènement sur clan_utilisateur
                // on cherche à tous les supprimer et pas à ré-agencer la structure
                $evm = $em->getEventManager();
                $evm->removeEventListener(array('postRemove'), $this->get('ninjatooken_clan.clan_utilisateur_listener'));

                $em->remove($clan);
                $em->flush();

                $this->get('session')->getFlashBag()->add(
                    'notice',
                    $this->get('translator')->trans('notice.clan.deleteOk')
                );
            }
            return $this->redirect($this->generateUrl('ninja_tooken_clans'));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    /**
     * @ParamConverter("utilisateur", class="NinjaTookenUserBundle:User", options={"mapping": {"user_nom":"slug"}})
     */
    public function clanUtilisateurSupprimerAction(User $utilisateur)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') || $security->isGranted('IS_AUTHENTICATED_REMEMBERED') ){
            $user = $security->getToken()->getUser();
            $em = $this->getDoctrine()->getManager();

            $userRecruts = $user->getRecruts();
            $clanutilisateur = $utilisateur->getClan();
            if($clanutilisateur){
                // l'utilisateur actuel est le recruteur du joueur visé, ou est le joueur lui-même !
                if( (!empty($userRecruts) && $userRecruts->contains($clanutilisateur)) || $user==$utilisateur ){
                    $clan = $clanutilisateur->getClan();

                    $em->remove($clanutilisateur);
                    $em->flush();

                    $this->get('session')->getFlashBag()->add(
                        'notice',
                        $this->get('translator')->trans('notice.clan.revokeOk')
                    );

                    if($clan){
                        return $this->redirect($this->generateUrl('ninja_tooken_clan', array(
                            'clan_nom' => $clan->getSlug()
                        )));
                    }
                }
            }
            $this->get('session')->getFlashBag()->add(
                'notice',
                $this->get('translator')->trans('notice.clan.revokeKo')
            );
            return $this->redirect($this->generateUrl('ninja_tooken_clans'));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    /**
     * @ParamConverter("utilisateur", class="NinjaTookenUserBundle:User", options={"mapping": {"user_nom":"slug"}})
     */
    public function clanUtilisateurSupprimerShishouAction(User $utilisateur)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') || $security->isGranted('IS_AUTHENTICATED_REMEMBERED') ){
            $user = $security->getToken()->getUser();
            $em = $this->getDoctrine()->getManager();

            if($user->getClan()){
                $clanutilisateur = $user->getClan();
                // est le shishou
                if($clanutilisateur->getDroit() == 0){
                    $clan = $clanutilisateur->getClan();

                    // on vérifie que le joueur visé fait parti du même clan
                    if($utilisateur->getClan()){
                        $clanutilisateur_promote = $utilisateur->getClan();
                        if($clanutilisateur_promote->getClan() == $clan){

                            // permet de remplacer le ninja promu dans la hiérarchie via le listener
                            $em->remove($clanutilisateur_promote);
                            $em->flush();

                            // modifie la liaison du shisho pour pointer vers le nouveau !
                            $clanutilisateur->setMembre($utilisateur);
                            $em->persist($clanutilisateur);
                            $em->persist($utilisateur);

                            // échange les recruts avec le shishou actuel
                            $recruts = $user->getRecruts();
                            foreach($recruts as $recrut){
                                $recrut->setRecruteur($utilisateur);
                                $em->persist($recrut);
                                $em->persist($utilisateur);
                            }
                            $em->flush();

                            $this->get('session')->getFlashBag()->add(
                                'notice',
                                $this->get('translator')->trans('notice.clan.promotionOk')
                            );

                            return $this->redirect($this->generateUrl('ninja_tooken_clan', array(
                                'clan_nom' => $clan->getSlug()
                            )));
                        }
                    }
                }
            }
            $this->get('session')->getFlashBag()->add(
                'notice',
                $this->get('translator')->trans('notice.clan.promotionKo')
            );
            return $this->redirect($this->generateUrl('ninja_tooken_clans'));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    public function clanUtilisateurRecruterAction()
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') || $security->isGranted('IS_AUTHENTICATED_REMEMBERED') ){
            $user = $security->getToken()->getUser();
            $clan = $user->getClan();
            $em = $this->getDoctrine()->getManager();

            $repo_proposition = $em->getRepository('NinjaTookenClanBundle:ClanProposition');
            $repo_demande = $em->getRepository('NinjaTookenClanBundle:ClanPostulation');

            return $this->render('NinjaTookenClanBundle:Default:clan.recrutement.html.twig', array(
                'recrutements' => $repo_proposition->getPropositionByRecruteur($user),
                'propositions' => $repo_proposition->getPropositionByPostulant($user),
                'demandes' => $repo_demande->getByUser($user),
                'demandesFrom' => $clan && $clan->getDroit()<3?$repo_demande->getByClan($clan->getClan()):null
            ));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    /**
     * @ParamConverter("utilisateur", class="NinjaTookenUserBundle:User", options={"mapping": {"user_nom":"slug"}})
     */
    public function clanUtilisateurRecruterSupprimerAction(User $utilisateur)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') || $security->isGranted('IS_AUTHENTICATED_REMEMBERED') ){
            $user = $security->getToken()->getUser();
            $em = $this->getDoctrine()->getManager();

            if($user->getClan()){
                $clanProposition = $em->getRepository('NinjaTookenClanBundle:ClanProposition')->getPropositionByUsers($user, $utilisateur);
                if($clanProposition){
                    $em->remove($clanProposition);
                    $em->flush();

                    $this->get('session')->getFlashBag()->add(
                        'notice',
                        $this->get('translator')->trans('notice.recrutement.cancelOk')
                    );
                }
                return $this->redirect($this->generateUrl('ninja_tooken_clan_recruter'));
            }
            return $this->redirect($this->generateUrl('ninja_tooken_homepage'));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    /**
     * @ParamConverter("utilisateur", class="NinjaTookenUserBundle:User", options={"mapping": {"user_nom":"slug"}})
     */
    public function clanUtilisateurRecruterAjouterAction(User $utilisateur)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') || $security->isGranted('IS_AUTHENTICATED_REMEMBERED') ){
            $user = $security->getToken()->getUser();
            $em = $this->getDoctrine()->getManager();

            if($user->getClan()){
                $clanProposition = $em->getRepository('NinjaTookenClanBundle:ClanProposition')->getPropositionByUsers($user, $utilisateur);
                $translator = $this->get('translator');
                if(!$clanProposition){

                    $clanProposition = new ClanProposition();
                    $clanProposition->setRecruteur($user);
                    $clanProposition->setPostulant($utilisateur);
                    // ajoute le message
                    $message = new Message();
                    $message->setAuthor($user);
                    $message->setNom($translator->trans('mail.recrutement.nouveau.sujet'));
                    $message->setContent($translator->trans('mail.recrutement.nouveau.contenu', array(
                        '%userUrl%' => $this->generateUrl('ninja_tooken_user_fiche', array(
                            'user_nom' => $user->getSlug()
                        )),
                        '%userPseudo%' => $user->getUsername(),
                        '%urlRefuser%' => $this->generateUrl('ninja_tooken_clan_recruter_refuser', array(
                            'user_nom' => $utilisateur->getSlug(),
                            'recruteur_nom' => $user->getSlug()
                        )),
                        '%urlAccepter%' => $this->generateUrl('ninja_tooken_clan_recruter_accepter', array(
                            'user_nom' => $utilisateur->getSlug(),
                            'recruteur_nom' => $user->getSlug()
                        ))
                    )));

                    $messageuser = new MessageUser();
                    $messageuser->setDestinataire($utilisateur);
                    $message->addReceiver($messageuser);

                    $em->persist($messageuser);
                    $em->persist($message);
                    $em->persist($clanProposition);
                    $em->flush();

                    $this->get('session')->getFlashBag()->add(
                        'notice',
                        $translator->trans('notice.recrutement.addOk')
                    );
                }else{
                    $this->get('session')->getFlashBag()->add(
                        'notice',
                        $translator->trans('notice.recrutement.addKo')
                    );
                }
                return $this->redirect($this->getRequest()->headers->get('referer'));
            }
            return $this->redirect($this->generateUrl('ninja_tooken_clan_recruter'));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    /**
     * @ParamConverter("utilisateur", class="NinjaTookenUserBundle:User", options={"mapping": {"user_nom":"slug"}})
     * @ParamConverter("recruteur", class="NinjaTookenUserBundle:User", options={"mapping": {"recruteur_nom":"slug"}})
     */
    public function clanUtilisateurRecruterAccepterAction(User $utilisateur, User $recruteur)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') || $security->isGranted('IS_AUTHENTICATED_REMEMBERED') ){
            $user = $security->getToken()->getUser();
            $em = $this->getDoctrine()->getManager();

            $clanProposition = $em->getRepository('NinjaTookenClanBundle:ClanProposition')->getPropositionByUsers($recruteur, $utilisateur);
            if($clanProposition && $clanProposition->getEtat()==0){
                if($user == $utilisateur && $recruteur->getClan() !== null){
                    $clanutilisateur = $recruteur->getClan();
                    if($clanutilisateur->getDroit()<3){
                        $translator = $this->get('translator');

                        // on supprime l'ancienne liaison
                        $cu = $user->getClan();
                        if($cu !== null){
                            $user->setClan(null);
                            $em->persist($user);
                            $em->remove($cu);
                            $em->flush();
                        }

                        // le nouveau clan
                        $clan = $clanutilisateur->getClan();

                        // on met à jour la proposition
                        $clanProposition->setEtat(1);
                        $em->persist($clanProposition);

                        // on ajoute la nouvelle liaison
                        $cu = new ClanUtilisateur();

                        $cu->setRecruteur($recruteur);
                        $cu->setMembre($user);
                        $cu->setClan($clan);
                        $cu->setDroit($clanutilisateur->getDroit() + 1);
                        $user->setClan($cu);

                        $em->persist($user);
                        $em->persist($cu);

                        // on ajoute un message
                        $message = new Message();
                        $message->setAuthor($utilisateur);
                        $message->setNom($translator->trans('mail.recrutement.accepter.sujet'));
                        $message->setContent($translator->trans('mail.recrutement.accepter.contenu'));
                        $messageuser = new MessageUser();
                        $messageuser->setDestinataire($recruteur);
                        $message->addReceiver($messageuser);
                        $em->persist($messageuser);
                        $em->persist($message);

                        $em->flush();

                        $this->get('session')->getFlashBag()->add(
                            'notice',
                            $translator->trans('notice.recrutement.bienvenue')
                        );

                        return $this->redirect($this->generateUrl('ninja_tooken_clan', array(
                            'clan_nom' => $clan->getSlug()
                        )));
                    }
                }
            }
            return $this->redirect($this->generateUrl('ninja_tooken_clan_recruter'));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    /**
     * @ParamConverter("utilisateur", class="NinjaTookenUserBundle:User", options={"mapping": {"user_nom":"slug"}})
     * @ParamConverter("recruteur", class="NinjaTookenUserBundle:User", options={"mapping": {"recruteur_nom":"slug"}})
     */
    public function clanUtilisateurRecruterRefuserAction(User $utilisateur, User $recruteur)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') || $security->isGranted('IS_AUTHENTICATED_REMEMBERED') ){
            $user = $security->getToken()->getUser();
            $em = $this->getDoctrine()->getManager();

            $clanProposition = $em->getRepository('NinjaTookenClanBundle:ClanProposition')->getPropositionByUsers($recruteur, $utilisateur);
            if($clanProposition && $clanProposition->getEtat()==0){
                if($user == $utilisateur){
                    $translator = $this->get('translator');

                    // on met à jour la proposition
                    $clanProposition->setEtat(2);
                    $em->persist($clanProposition);

                    // on ajoute un message
                    $message = new Message();
                    $message->setAuthor($utilisateur);
                    $message->setNom($translator->trans('mail.recrutement.refuser.sujet'));
                    $message->setContent($translator->trans('mail.recrutement.refuser.contenu'));
                    $messageuser = new MessageUser();
                    $messageuser->setDestinataire($recruteur);
                    $message->addReceiver($messageuser);
                    $em->persist($messageuser);
                    $em->persist($message);

                    $em->flush();
                }
            }
            return $this->redirect($this->generateUrl('ninja_tooken_clan_recruter'));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    /**
     * @ParamConverter("clan", class="NinjaTookenClanBundle:Clan", options={"mapping": {"clan_nom":"slug"}})
     */
    public function clanUtilisateurPostulerAction(Clan $clan)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') || $security->isGranted('IS_AUTHENTICATED_REMEMBERED') ){
            $user = $security->getToken()->getUser();
            $em = $this->getDoctrine()->getManager();

            // vérification des droits utilisateurs
            $canPostule = true;
            if($user->getClan()){
                $clanUser = $user->getClan()->getClan();
                if($clanUser == $clan)
                    $canPostule = false;
            }

            // le clan recrute, on peut postuler
            if($clan->getIsRecruting() && $canPostule){

                $ok = false;

                $postulation = $em->getRepository('NinjaTookenClanBundle:ClanPostulation')->getByClanUser($clan, $user);
                if($postulation){
                    // si on avait supprimé la proposition
                    if($postulation->getEtat()==1){
                        if($postulation->getDateChangementEtat() <= new \DateTime('-1 days')){
                            $postulation->setEtat(0);
                            $ok = true;
                        }else
                            $this->get('session')->getFlashBag()->add(
                                'notice',
                                $this->get('translator')->trans('notice.clan.postulationKo2')
                            );
                    }else
                        $this->get('session')->getFlashBag()->add(
                            'notice',
                            $this->get('translator')->trans('notice.clan.postulationKo1')
                        );
                }else{
                    $postulation = new ClanPostulation();
                    $postulation->setClan($clan);
                    $postulation->setPostulant($user);
                    $ok = true;
                }

                if($ok){
                    $em->persist($postulation);
                    $em->flush();

                    $this->get('session')->getFlashBag()->add(
                        'notice',
                        $this->get('translator')->trans('notice.clan.postulationOk')
                    );
                }

            }

            return $this->redirect($this->generateUrl('ninja_tooken_clan', array(
                'clan_nom' => $clan->getSlug()
            )));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    /**
     * @ParamConverter("clan", class="NinjaTookenClanBundle:Clan", options={"mapping": {"clan_nom":"slug"}})
     */
    public function clanUtilisateurPostulerSupprimerAction(Clan $clan)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') || $security->isGranted('IS_AUTHENTICATED_REMEMBERED') ){
            $user = $security->getToken()->getUser();
            $em = $this->getDoctrine()->getManager();

            $postulation = $em->getRepository('NinjaTookenClanBundle:ClanPostulation')->getByClanUser($clan, $user);
            if($postulation && $postulation->getEtat()==0){
                $postulation->setEtat(1);
                $em->persist($postulation);
                $em->flush();

                $this->get('session')->getFlashBag()->add(
                    'notice',
                    $this->get('translator')->trans('notice.clan.postulationSupprimeOk')
                );
            }
            return $this->redirect($this->generateUrl('ninja_tooken_clan_recruter'));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    function getRecruteur($list=array()){
        $membre = array();
        if(isset($list['recruteur'])){
            $membre[] = $list['recruteur'];
            foreach($list['recruts'] as $recrut){
                $membre = array_merge($membre, $this->getRecruteur($recrut));
            }
        }
        return $membre;
    }

    function getRecruts(ClanUtilisateur $recruteur){
        $em = $this->getDoctrine()->getManager();
        $recruts = $em->getRepository('NinjaTookenClanBundle:ClanUtilisateur')->getMembres(null, null, $recruteur->getMembre(), 100);
        $membres = array();
        foreach($recruts as $recrut){
            $membres[] = array(
                'recruteur' => $recrut,
                'recruts' => $this->getRecruts($recrut)
            );
        }

        return $membres;
    }
}
