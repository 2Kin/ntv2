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
        $capacites = array(
            'force' => array(
                'nom' => 'force'
            ),
            'vitesse' => array(
                'nom' => 'vitesse'
            ),
            'vie' => array(
                'nom' => 'vie'
            ),
            'chakra' => array(
                'nom' => 'chakra'
            )
        );
        $aptitudes = array(
            'bouleElementaire' => array(
                'nom' => 'boule élémentaire',
                'values' => array(
                    array('nom' => 'dégâts', 'value' => 'degat'),
                    array('nom' => 'rayon', 'value' => 'rayon'),
                    array('nom' => 'chakra', 'value' => 'chakra')
                )
            ),
            'doubleSaut' => array(
                'nom' => 'double saut',
                'values' => array(
                    array('nom' => 'Augmentation du 1° saut', 'value' => 'saut1'),
                    array('nom' => 'Augmentation du 2° saut', 'value' => 'saut2')
                )
            ),
            'bouclierElementaire' => array(
                'nom' => 'bouclier élémentaire',
                'values' => array(
                    array('nom' => 'réduction', 'value' => 'reduction'),
                    array('nom' => 'chakra', 'value' => 'chakra'),
                    array('nom' => 'durée', 'value' => 'last')
                )
            ),
            'marcherMur' => array(
                'nom' => 'marcher sur les murs',
                'values' => array(
                    array('nom' => 'chakra', 'value' => 'chakra'),
                    array('nom' => 'durée', 'value' => 'last')
                )
            ),
            'acierRenforce' => array(
                'nom' => 'acier renforcé',
                'values' => array(
                    array('nom' => 'dégâts', 'value' => 'degat'),
                    array('nom' => 'chakra', 'value' => 'chakra'),
                    array('nom' => 'durée', 'value' => 'last')
                )
            ),
            'deflagrationElementaire' => array(
                'nom' => 'déflagration élémentaire',
                'values' => array(
                    array('nom' => 'dégâts', 'value' => 'degat'),
                    array('nom' => 'chakra', 'value' => 'chakra'),
                    array('nom' => 'rayon', 'value' => 'rayon')
                )
            ),
            'chakraVie' => array(
                'nom' => 'déflagration élémentaire',
                'values' => array(
                    array('nom' => 'chakra', 'value' => 'chakra'),
                    array('nom' => 'durée', 'value' => 'last')
                )
            ),
            'resistanceExplosion' => array(
                'nom' => 'résistance aux explosions',
                'values' => array(
                    array('nom' => 'réduction', 'value' => 'reduction'),
                    array('nom' => 'durée', 'value' => 'last')
                )
            ),
            'marcherViteEau' => array(
                'nom' => 'marcher sur l\'eau',
                'values' => array(
                    array('nom' => 'durée', 'value' => 'last')
                )
            ),
            'changerObjet' => array(
                'nom' => 'métamorphose',
                'values' => array(
                    array('nom' => 'durée', 'value' => 'last')
                )
            ),
            'multishoot' => array(
                'nom' => 'métamorphose',
                'values' => array(
                    array('nom' => 'vitesse', 'value' => 'speed'),
                    array('nom' => 'chakra', 'value' => 'chakra'),
                    array('nom' => 'durée', 'value' => 'last')
                )
            ),
            'invisibleman' => array(
                'nom' => 'invisiblité',
                'values' => array(
                    array('nom' => 'opacité', 'value' => 'opacity'),
                    array('nom' => 'durée', 'value' => 'last')
                )
            ),
            'phoenix' => array(
                'nom' => 'phoenix',
                'values' => array(
                    array('nom' => 'dégâts', 'value' => 'degat'),
                    array('nom' => 'rayon', 'value' => 'rayon'),
                    array('nom' => 'chakra', 'value' => 'chakra'),
                    array('nom' => 'distance', 'value' => 'distance')
                )
            ),
            'vague' => array(
                'nom' => 'vague',
                'values' => array(
                    array('nom' => 'dégâts', 'value' => 'degat'),
                    array('nom' => 'temps', 'value' => 'temps'),
                    array('nom' => 'chakra', 'value' => 'chakra'),
                    array('nom' => 'distance', 'value' => 'distance')
                )
            ),
            'pieux' => array(
                'nom' => 'pieux',
                'values' => array(
                    array('nom' => 'dégâts', 'value' => 'degat'),
                    array('nom' => 'largeur', 'value' => 'largeur'),
                    array('nom' => 'longueur', 'value' => 'longueur'),
                    array('nom' => 'chakra', 'value' => 'chakra'),
                    array('nom' => 'distance', 'value' => 'distance')
                )
            ),
            'teleportation' => array(
                'nom' => 'téléportation',
                'values' => array(
                    array('nom' => 'dégâts', 'value' => 'vie'),
                    array('nom' => 'chakra', 'value' => 'chakra'),
                    array('nom' => 'distance', 'value' => 'distance')
                )
            ),
            'tornade' => array(
                'nom' => 'tornade',
                'values' => array(
                    array('nom' => 'dégâts', 'value' => 'degat'),
                    array('nom' => 'temps', 'value' => 'temps'),
                    array('nom' => 'chakra', 'value' => 'chakra'),
                    array('nom' => 'distance', 'value' => 'distance')
                )
            ),
            'kusanagi' => array(
                'nom' => 'tornade',
                'values' => array(
                    array('nom' => 'dégâts', 'value' => 'degat'),
                    array('nom' => 'durée', 'value' => 'last'),
                    array('nom' => 'chakra', 'value' => 'chakra')
                )
            )
        );

        return $this->render('NinjaTookenGameBundle:Default:calculateur.html.twig', array(
            'capacites' => $capacites,
            'aptitudes' => $aptitudes
        ));
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
