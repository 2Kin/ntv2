<?php

namespace NinjaTooken\ClanBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use NinjaTooken\ClanBundle\Entity\Clan;
use NinjaTooken\ClanBundle\Form\Type\ClanType;
use NinjaTooken\ClanBundle\Entity\ClanUtilisateur;
use NinjaTooken\ForumBundle\Entity\Forum;
use NinjaTooken\ForumBundle\Entity\Thread;

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
            throw new NotFoundHttpException('Ce clan n\'existe pas !');
        }

        return $this->redirect($this->generateUrl('ninja_tooken_clan', array(
            'clan_nom' => $clan->getSlug(),
            'page' => 1
        )));
    }

    /**
     * @ParamConverter("clan", class="NinjaTookenClanBundle:Clan", options={"mapping": {"clan_nom":"slug"}})
     */
    public function clanAction(Clan $clan, $page = 1)
    {
        // gestion des forums
        $num = $this->container->getParameter('numReponse');
        $page = max(1, $page);

        $em = $this->getDoctrine()->getManager();

        // le forum du clan
        $forum = $em->getRepository('NinjaTookenForumBundle:Forum')->getForum($clan->getSlug(), $clan);
        $threads = array();
        if($forum){
            $forum = current($forum);
            $threads = $em->getRepository('NinjaTookenForumBundle:Thread')->getThreads($forum, $num, $page);
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
            'page' => $page,
            'nombrePage' => ceil(count($threads)/$num),
            'membres' => $membres,
            'membresListe' => $membresListe
        ));
    }

    public function clanAjouterAction(Request $request)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') ){
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
                            'Le clan a bien été ajouté.'
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
     * @ParamConverter("clan", class="NinjaTookenClanBundle:Clan", options={"mapping": {"clan_nom":"slug"}})
     */
    public function clanModifierAction(Request $request, Clan $clan)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') ){
            $user = $security->getToken()->getUser();

            // vérification des droits utilisateurs
            $canEdit = false;
            if($user->getClan()){
                $clanUser = $user->getClan()->getClan();
                if($clanUser == $clan && $user->getClan()->getCanEditClan())
                    $canEdit = true;
            }

            if($canEdit || $security->isGranted('ROLE_ADMIN') !== false){
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
                        $em->persist($clan);
                        $em->flush();

                        $this->get('session')->getFlashBag()->add(
                            'notice',
                            'Le clan a bien été modifié.'
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

        if($security->isGranted('IS_AUTHENTICATED_FULLY') ){
            $user = $security->getToken()->getUser();

            // vérification des droits utilisateurs
            $canDelete = false;
            if($user->getClan()){
                $clanUser = $user->getClan()->getClan();
                if($clanUser == $clan && $user->getClan()->getDroit()==0)
                    $canDelete = true;
            }

            if($canDelete || $security->isGranted('ROLE_ADMIN') !== false){
                $em = $this->getDoctrine()->getManager();

                $forums = $clan->getForums();
                if(!empty($forums)){
                    foreach($forums as $forum){
                        $em->getRepository('NinjaTookenForumBundle:Thread')->deleteThreadsByForum($forum);
                        $em->remove($forum);
                    }
                }
                $em->remove($clan);
                $em->flush();

                $this->get('session')->getFlashBag()->add(
                    'notice',
                    'Le clan a bien été supprimé.'
                );
            }
            return $this->redirect($this->generateUrl('ninja_tooken_clans'));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    /**
     * @ParamConverter("clan", class="NinjaTookenClanBundle:Clan", options={"mapping": {"clan_nom":"slug"}})
     * @ParamConverter("user", class="NinjaTookenUserBundle:User", options={"mapping": {"user_nom":"slug"}})
     */
    public function clanUtilisateurSupprimerAction(Clan $clan, User $user)
    {
        $security = $this->get('security.context');

        if($security->isGranted('IS_AUTHENTICATED_FULLY') ){
            $user = $security->getToken()->getUser();

            return $this->redirect($this->generateUrl('ninja_tooken_clans'));
        }
        return $this->redirect($this->generateUrl('fos_user_security_login'));
    }

    public function clanSearchAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $num = $this->container->getParameter('numReponse');

        $clans = $em->getRepository('NinjaTookenClanBundle:Clan')->searchClans($request->get('q'), $num, 1);

        return $this->render('NinjaTookenClanBundle:Default:search.html.twig', array(
            'clans' => $clans
        ));
    }

    function getRecruteur($list=array()){
        $membre = array();
        $membre[] = $list['recruteur'];
        foreach($list['recruts'] as $recrut){
            $membre = array_merge($membre, $this->getRecruteur($recrut));
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
