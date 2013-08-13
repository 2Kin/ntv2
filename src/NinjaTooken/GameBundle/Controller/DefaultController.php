<?php

namespace NinjaTooken\GameBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    public function partiesAction()
    {
        $repo = $this->getDoctrine()->getManager()->getRepository('NinjaTookenGameBundle:Lobby');

        $games = $repo->createQueryBuilder('a')
            ->orderBy('a.dateDebut', 'DESC')
            ->getQuery()->getResult();

        return $this->render('NinjaTookenGameBundle:Default:parties.html.twig', array(
            'games' => $games
        ));
    }

    public function calculateurAction()
    {
        return $this->render('NinjaTookenGameBundle:Default:calculateur.html.twig');
    }

    public function classementAction(Request $request, $page)
    {
        $num = $this->container->getParameter('numReponse');
        $page = max(1, $page);

        $order = $request->get('order');
        if(empty($order))
            $order = 'experience';

        $filter = $request->get('filter');

        $repo = $this->getDoctrine()->getManager()->getRepository('NinjaTookenGameBundle:Ninja');

        $total = $repo->getNumNinjas();

        $classe = $this->container->getParameter('class');
        foreach($classe as $k=>$v){
            $classeNum[$k] = $repo->getNumNinjas($k);
        }

        return $this->render('NinjaTookenGameBundle:Default:classement.html.twig', array(
            'order' => $order,
            'filter' => $filter,
            'joueurs' => $repo->getNinjas($order, $filter, $num, $page),
            'page' => $page,
            'nombrePage' => ceil($total/$num),
            'nombre' => $num,
            'nombreNinja' => $total,
            'experienceTotal' => $repo->getSumExperience(),
            'classes' => $classeNum
        ));
    }
    
    public function recentGamesAction($max = 3)
    {
        $repo = $this->getDoctrine()->getManager()->getRepository('NinjaTookenGameBundle:Lobby');

        $q = $repo->createQueryBuilder('a')->orderBy('a.dateDebut', 'DESC')->getQuery();
        $q->setFirstResult(0);
        $q->setMaxResults($max);
        $games = $q->getResult();

        return $this->render('NinjaTookenGameBundle:Games:recentList.html.twig', array('games' => $games));
    }
    
    public function signatureAction(\NinjaTooken\UserBundle\Entity\User $user)
    {
        $ninja = $user->getNinja();

        if($ninja){
            $xml = file_get_contents(dirname(__FILE__).'/../Resources/public/xml/game.xml');
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
            $user->ratio = ($xp - $levelActu->getAttribute("val"))/($levelSuivant->getAttribute("val")-$levelActu->getAttribute("val"))*100;

            // classement
            $repo = $this->getDoctrine()->getManager()->getRepository('NinjaTookenGameBundle:Ninja');
            $classement = $repo->createQueryBuilder('a')
                 ->select('COUNT(a)')
                 ->leftJoin('NinjaTookenUserBundle:User', 'u', 'WITH', 'a.user = u.id')
                 ->where('u.locked = 0')
                 ->andWhere('a.experience > :experience')
                 ->setParameters(array(
                    'experience' => $experience
                ))
                 ->getQuery()
                 ->getSingleScalarResult();
			$user->classement		= $classement+1;

            // total de joueurs
            $total = $repo->createQueryBuilder('a')
                 ->select('COUNT(a)')
                 ->leftJoin('NinjaTookenUserBundle:User', 'u', 'WITH', 'a.user = u.id')
                 ->where('u.locked = 0')
                 ->getQuery()
                 ->getSingleScalarResult();
			$user->total		= $total;

            return $this->render('NinjaTookenGameBundle:Default:signature.html.twig', array('user' => $user));
        }
    }
}
