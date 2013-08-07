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

        $order = $request->get('order');
        if(empty($order))
            $order = 'composition';

        $repo = $this->getDoctrine()->getManager()->getRepository('NinjaTookenClanBundle:Clan');

        return $this->render('NinjaTookenClanBundle:Default:liste.html.twig', array(
            'clans' => $repo->getClans($order, $num, $page),
            'lastClans' => $repo->getClans("date", 10, 1),
            'page' => $page,
            'nombrePage' => ceil($repo->getNumClans()/$num),
            'order' => $order
        ));
    }

    /**
     * @ParamConverter("clan", class="NinjaTookenClanBundle:Clan", options={"mapping": {"clan_nom":"slug"}})
     */
    public function clanAction(Clan $clan, $page = 1)
    {
        // gestion des forums
        $num = $this->container->getParameter('numReponse');
        $page = max(1, $page);

        $repo_forum = $this->getDoctrine()->getManager()->getRepository('NinjaTookenForumBundle:Forum');

        $forum = $repo_forum->createQueryBuilder('f')
            ->where('f.type = :type')
            ->andWhere('f.slug = :slug')
            ->setParameter('type', 'clan')
            ->setParameter('slug', $clan->getSlug())
            ->getQuery()->getResult();
        if($forum){
            $forum = current($forum);
            $threads = $this->getDoctrine()->getManager()->getRepository('NinjaTookenForumBundle:Thread')->getThreads($forum, $num, $page);
            if(count($threads)>0)
                $forum->threads = $threads;
            else
                $forum->threads = array();
        }

        // gestion des membres
        $repo_membre = $this->getDoctrine()->getManager()->getRepository('NinjaTookenClanBundle:ClanUtilisateur');
        $shishou = $repo_membre->createQueryBuilder('cu')
            ->where('cu.clan = :clan')
            ->andWhere('cu.droit = :droit')
            ->setParameter('clan', $clan)
            ->setParameter('droit', 'Shishou')
            ->getQuery()->getResult();
        $membres = array();
        if($shishou){
            $shishou = current($shishou);
            $membres = array(
                'recruteur' => $shishou,
                'recruts' => $this->getRecruts($shishou)
            );
        }

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

    function getRecruteur($list=array()){
        $membre = array();
        $membre[] = $list['recruteur'];
        foreach($list['recruts'] as $recrut){
            $membre = array_merge($membre, $this->getRecruteur($recrut));
        }
        return $membre;
    }

    function getRecruts(ClanUtilisateur $recruteur){
        $membres = array();
        $repo_membre = $this->getDoctrine()->getManager()->getRepository('NinjaTookenClanBundle:ClanUtilisateur');

        $recruts =  $repo_membre->createQueryBuilder('cu')
            ->where('cu.recruteur = :recruteur')
            ->andWhere('cu.membre <> :recruteur')
            ->setParameter('recruteur', $recruteur->getMembre()->getId())
            ->getQuery()->getResult();

        foreach($recruts as $recrut){
            $membres[] = array(
                'recruteur' => $recrut,
                'recruts' => $this->getRecruts($recrut)
            );
        }

        return $membres;
    }
}
