<?php

namespace NinjaTooken\GameBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use NinjaTooken\GameBundle\Utils\GameData;

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
                'nom' => 'Force'
            ),
            'vitesse' => array(
                'nom' => 'Vitesse'
            ),
            'vie' => array(
                'nom' => 'Vie'
            ),
            'chakra' => array(
                'nom' => 'Chakra'
            )
        );
        $aptitudes = array(
            'bouleElementaire' => array(
                'nom' => 'Boule élémentaire',
                'values' => array(
                    'degat' => 'dégâts',
                    'rayon' => 'taille',
                    'chakra' => 'chakra'
                )
            ),
            'doubleSaut' => array(
                'nom' => 'Double saut',
                'values' => array(
                    'saut1' => '1° saut',
                    'saut2' => '2° saut'
                )
            ),
            'bouclierElementaire' => array(
                'nom' => 'Bouclier élémentaire',
                'values' => array(
                    'reduction' => 'taux de protection',
                    'chakra' => 'chakra',
                    'last' => 'durée'
                )
            ),
            'marcherMur' => array(
                'nom' => 'Marcher sur les murs',
                'values' => array(
                    'chakra' => 'chakra',
                    'last' => 'durée'
                )
            ),
            'acierRenforce' => array(
                'nom' => 'Acier renforcé',
                'values' => array(
                    'degat' => 'dégâts',
                    'chakra' => 'chakra',
                    'last' => 'durée'
                )
            ),
            'deflagrationElementaire' => array(
                'nom' => 'Déflagration élémentaire',
                'values' => array(
                    'degat' => 'dégâts',
                    'chakra' => 'chakra',
                    'rayon' => 'taille',
                )
            ),
            'chakraVie' => array(
                'nom' => 'Chakra de vie',
                'values' => array(
                    'chakra' => 'chakra',
                    'last' => 'durée'
                )
            ),
            'resistanceExplosion' => array(
                'nom' => 'Résistance aux explosions',
                'values' => array(
                    'reduction' => 'réduction',
                    'last' => 'durée'
                )
            ),
            'marcherViteEau' => array(
                'nom' => 'Marcher sur l\'eau',
                'values' => array(
                    'last' => 'durée'
                )
            ),
            'changerObjet' => array(
                'nom' => 'Métamorphose',
                'values' => array(
                    'last' => 'durée'
                )
            ),
            'multishoot' => array(
                'nom' => 'Multishoot',
                'values' => array(
                    'speed' => 'diminution de temps',
                    'chakra' => 'chakra',
                    'last' => 'durée'
                )
            ),
            'invisibleman' => array(
                'nom' => 'Invisiblité',
                'values' => array(
                    'opacity' => 'taux d\'invisibilité',
                    'last' => 'durée'
                )
            ),
            'phoenix' => array(
                'nom' => 'Phoenix',
                'values' => array(
                    'degat' => 'dégâts',
                    'rayon' => 'taille',
                    'chakra' => 'chakra',
                    'distance' => 'distance'
                )
            ),
            'vague' => array(
                'nom' => 'Vague',
                'values' => array(
                    'degat' => 'dégâts',
                    'temps' => 'durée',
                    'chakra' => 'chakra',
                    'distance' => 'distance'
                )
            ),
            'pieux' => array(
                'nom' => 'Pieux',
                'values' => array(
                    'degat' => 'dégâts',
                    'largeur' => 'largeur',
                    'longueur' => 'longueur',
                    'chakra' => 'chakra',
                    'distance' => 'distance'
                )
            ),
            'teleportation' => array(
                'nom' => 'Téléportation',
                'values' => array(
                    'vie' => 'dégâts',
                    'chakra' => 'chakra',
                    'distance' => 'distance'
                )
            ),
            'tornade' => array(
                'nom' => 'Tornade',
                'values' => array(
                    'degat' => 'dégâts',
                    'temps' => 'durée',
                    'chakra' => 'chakra',
                    'distance' => 'distance'
                )
            ),
            'kusanagi' => array(
                'nom' => 'Kusanagi',
                'values' => array(
                    'degat' => 'dégâts',
                    'last' => 'durée',
                    'chakra' => 'chakra'
                )
            )
        );

        $data = new GameData();
        $dom = $data->getDocument();
        foreach($capacites as $k=>$val){
            $xml = array();
            $cd = $dom->getElementsByTagName($k)->item(0)->getElementsByTagName('x');
            foreach($cd as $v){
                $xml[] = array(
                    'val' => (float)str_replace('a','.',$v->getAttribute('val')),
                    'lvl' => (int)$v->getAttribute('niveau')
                 );
            }
            $capacites[$k]['xml'] = json_encode($xml);
        }

        foreach($aptitudes as $k=>$val){
            $xml = array();
            $cd = $dom->getElementsByTagName($k)->item(0)->getElementsByTagName('x');
            foreach($cd as $v){
                $attr = array();
                $attr['lvl'] = (int)$v->getAttribute('niveau');
                foreach($val['values'] as $k1=>$v1){
                    $attr[$k1] = (float)str_replace('a','.',$v->getAttribute($k1));
                }
                $xml[] = $attr;
            }
            $aptitudes[$k]['xml'] = json_encode($xml);
            $aptitudes[$k]['values'] = json_encode($aptitudes[$k]['values']);
        }

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
