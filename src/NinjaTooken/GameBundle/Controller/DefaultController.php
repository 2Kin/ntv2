<?php

namespace NinjaTooken\GameBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    public function partiesAction()
    {
        return $this->render('NinjaTookenGameBundle:Default:parties.html.twig', array(
            'games' => $this->getDoctrine()->getManager()->getRepository('NinjaTookenGameBundle:Lobby')->findBy(array(), array('dateDebut' => 'DESC'))
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
            $gameData = $this->get('ninjatooken_game.gamedata');

            // l'expérience (et données associées)
            $gameData->setExperience($ninja->getExperience(), $ninja->getGrade());

            $user->level = $gameData->getLevelActuel();
            $user->ratio = $gameData->getRatio();

            // classement
            $repo = $this->getDoctrine()->getManager()->getRepository('NinjaTookenGameBundle:Ninja');

			$user->classement = $repo->getClassement($ninja->getExperience());

            // total de joueurs
            $user->total = $repo->getNumNinjas();

            return $this->render('NinjaTookenGameBundle:Default:signature.html.twig', array('user' => $user));
        }
    }
}
