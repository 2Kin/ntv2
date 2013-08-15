<?php

namespace NinjaTooken\ClanBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use NinjaTooken\ClanBundle\Entity\Clan;
use NinjaTooken\ClanBundle\Entity\ClanUtilisateur;

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
        $forum = $em->getRepository('NinjaTookenForumBundle:Forum')->getForum($clan->getSlug(), 'clan');
        if($forum){
            $forum = current($forum);
            $threads = $em->getRepository('NinjaTookenForumBundle:Thread')->getThreads($forum, $num, $page);
            if(count($threads)>0)
                $forum->threads = $threads;
            else
                $forum->threads = array();
        }

        // l'arborescence des membres
        $shishou = $em->getRepository('NinjaTookenClanBundle:ClanUtilisateur')->getMembres($clan, 'Shishou', null, 1, 1);
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

        $recruts = $em->getRepository('NinjaTookenClanBundle:ClanUtilisateur')->getMembres(null, '',  $recruteur->getMembre());
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
