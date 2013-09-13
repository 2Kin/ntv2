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
        $gameData = $this->get('ninjatooken_game.gamedata');

        $level = 0;
        $classe = "suiton";
        // les données du joueur connecté
        $security = $this->get('security.context');
        $ninja = null;
        if($security->isGranted('IS_AUTHENTICATED_FULLY') ){
            $user = $security->getToken()->getUser();
            $ninja = $user->getNinja();

            if($ninja){
                // l'expérience (et données associées)
                $gameData->setExperience($ninja->getExperience(), $ninja->getGrade());
                $level = $gameData->getLevelActuel();

                $classeP = $this->container->getParameter('class');
                $classe = strtolower($classeP[$ninja->getClasse()]);
            }
        }

        $capacites = array(
            'force' => array(
                'nom' => 'Force',
                'current' => $ninja?$ninja->getAptitudeForce():0
            ),
            'vitesse' => array(
                'nom' => 'Vitesse',
                'current' => $ninja?$ninja->getAptitudeVitesse():0
            ),
            'vie' => array(
                'nom' => 'Vie',
                'current' => $ninja?$ninja->getAptitudeVie():0
            ),
            'chakra' => array(
                'nom' => 'Chakra',
                'current' => $ninja?$ninja->getAptitudeChakra():0
            )
        );
        $aptitudes = array(
            'bouleElementaire' => array(
                'nom' => 'Boule élémentaire',
                'values' => array(
                    'degat' => 'Inflige ## points de dégats',
                    'rayon' => 'Grosseur de ##m.',
                    'chakra' => 'Coute ## points de chakra'
                ),
                'current' => $ninja?$ninja->getJutsuBoule():0
            ),
            'doubleSaut' => array(
                'nom' => 'Double saut',
                'values' => array(
                    'saut1' => 'Portée du 1° saut augmenté de ##% par rapport à la hauteur de base',
                    'saut2' => 'Portée du 2° saut augmenté de ##% par rapport à la hauteur de base'
                ),
                'current' => $ninja?$ninja->getJutsuDoubleSaut():0
            ),
            'bouclierElementaire' => array(
                'nom' => 'Bouclier élémentaire',
                'values' => array(
                    'reduction' => 'Protège à ##%',
                    'chakra' => 'Coute ## points de chakra',
                    'last' => 'Dure ##s.'
                ),
                'current' => $ninja?$ninja->getJutsuBouclier():0
            ),
            'marcherMur' => array(
                'nom' => 'Marcher sur les murs',
                'values' => array(
                    'chakra' => 'Coute ## points de chakra',
                    'last' => 'Dure ##s.'
                ),
                'current' => $ninja?$ninja->getJutsuMarcherMur():0
            ),
            'acierRenforce' => array(
                'nom' => 'Acier renforcé',
                'values' => array(
                    'degat' => 'Inflige ## points de dégats',
                    'chakra' => 'Coute ## points de chakra',
                    'last' => 'Dure ##s.'
                ),
                'current' => $ninja?$ninja->getJutsuAcierRenforce():0
            ),
            'deflagrationElementaire' => array(
                'nom' => 'Déflagration élémentaire',
                'values' => array(
                    'degat' => 'Inflige ## points de dégats',
                    'chakra' => 'Coute ## points de chakra',
                    'rayon' => 'Couvre une sphère de ##m. de diamètre',
                ),
                'current' => $ninja?$ninja->getJutsuDeflagration():0
            ),
            'chakraVie' => array(
                'nom' => 'Chakra de vie',
                'values' => array(
                    'chakra' => 'Coute ## points de chakra',
                    'last' => 'Dure ##s.'
                ),
                'current' => $ninja?$ninja->getJutsuChakraVie():0
            ),
            'resistanceExplosion' => array(
                'nom' => 'Résistance aux explosions',
                'values' => array(
                    'reduction' => 'Protège à ##%',
                    'last' => 'Dure ##s.'
                ),
                'current' => $ninja?$ninja->getJutsuResistanceExplosion():0
            ),
            'marcherViteEau' => array(
                'nom' => 'Marcher sur l\'eau',
                'values' => array(
                    'last' => 'Dure ##s.'
                ),
                'current' => $ninja?$ninja->getJutsuMarcherEau():0
            ),
            'changerObjet' => array(
                'nom' => 'Métamorphose',
                'values' => array(
                    'last' => 'Dure ##s.'
                ),
                'current' => $ninja?$ninja->getJutsuMetamorphose():0
            ),
            'multishoot' => array(
                'nom' => 'Multishoot',
                'values' => array(
                    'speed' => 'Temps entre chaque tire diminué de ##s.',
                    'chakra' => 'Coute ## points de chakra',
                    'last' => 'Dure ##s.'
                ),
                'current' => $ninja?$ninja->getJutsuMultishoot():0
            ),
            'invisibleman' => array(
                'nom' => 'Invisiblité',
                'values' => array(
                    'opacity' => 'Invisible à ##%',
                    'last' => 'Dure ##s.'
                ),
                'current' => $ninja?$ninja->getJutsuInvisibilite():0
            ),
            'phoenix' => array(
                'nom' => 'Phoenix',
                'values' => array(
                    'degat' => 'Inflige ## points de dégats',
                    'rayon' => 'Couvre une sphère de ##m. de diamètre',
                    'chakra' => 'Coute ## points de chakra',
                    'distance' => 'Peut être lancé jusqu\'à ##m.'
                ),
                'current' => $ninja?$ninja->getJutsuPhoenix():0
            ),
            'vague' => array(
                'nom' => 'Vague',
                'values' => array(
                    'degat' => 'Inflige ## points de dégats',
                    'temps' => 'Dure ##s.',
                    'chakra' => 'Coute ## points de chakra',
                    'distance' => 'Peut être lancé jusqu\'à ##m.'
                ),
                'current' => $ninja?$ninja->getJutsuVague():0
            ),
            'pieux' => array(
                'nom' => 'Pieux',
                'values' => array(
                    'degat' => 'Inflige ## points de dégats',
                    'largeur' => 'Les pieux s\'étendent sur ##m. de largeur.',
                    'longueur' => 'Les pieux s\'étendent sur ##m. de longueur',
                    'chakra' => 'Coute ## points de chakra',
                    'distance' => 'Peut être lancé jusqu\'à ##m.'
                ),
                'current' => $ninja?$ninja->getJutsuPieux():0
            ),
            'teleportation' => array(
                'nom' => 'Téléportation',
                'values' => array(
                    'vie' => 'Inflige ## points de dégats',
                    'chakra' => 'Coute ## points de chakra',
                    'distance' => 'Peut être lancé jusqu\'à ##m.'
                ),
                'current' => $ninja?$ninja->getJutsuTeleportation():0
            ),
            'tornade' => array(
                'nom' => 'Tornade',
                'values' => array(
                    'degat' => 'Inflige ## points de dégats',
                    'temps' => 'Dure ##s.',
                    'chakra' => 'Coute ## points de chakra',
                    'distance' => 'Peut être lancé jusqu\'à ##m.'
                ),
                'current' => $ninja?$ninja->getJutsuTornade():0
            ),
            'kusanagi' => array(
                'nom' => 'Kusanagi',
                'values' => array(
                    'degat' => 'Inflige ## points de dégats',
                    'last' => 'Dure ##s.',
                    'chakra' => 'Coute ## points de chakra'
                ),
                'current' => $ninja?$ninja->getJutsuKusanagi():0
            )
        );

        $dom = $gameData->getDocument();

        $levelUp = array();
        $cd = $dom->getElementsByTagName('levelUp')->item(0);
        $levelUp['capacite'] = json_encode(array(
            'val' => (int)$cd->getElementsByTagName('capacite')->item(0)->getAttribute('val'),
            'depart' => (int)$cd->getElementsByTagName('capacite')->item(0)->getAttribute('depart'),
        ));
        $levelUp['aptitude'] = json_encode(array(
            'val' => (int)$cd->getElementsByTagName('aptitude')->item(0)->getAttribute('val'),
            'depart' => (int)$cd->getElementsByTagName('aptitude')->item(0)->getAttribute('depart'),
        ));

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

        $classes = array();
        $cd = $dom->getElementsByTagName('classe')->item(0)->getElementsByTagName('x');
        foreach($cd as $v){
            $classes[$v->getAttribute('val')] = strtolower($v->getAttribute('name'));
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
            $limit = $dom->getElementsByTagName($k)->item(0)->getAttribute('limit');
            $aptitudes[$k]['limit'] = isset($classes[$limit])?$classes[$limit]:'';
            $aptitudes[$k]['niveau'] = $dom->getElementsByTagName($k)->item(0)->getAttribute('niveau');
            $aptitudes[$k]['xml'] = json_encode($xml);
            $aptitudes[$k]['values'] = json_encode($aptitudes[$k]['values']);
        }

        return $this->render('NinjaTookenGameBundle:Default:calculateur.html.twig', array(
            'capacites' => $capacites,
            'aptitudes' => $aptitudes,
            'classes' => $this->container->getParameter('class'),
            'levelUp' => $levelUp,
            'level' => $level,
            'classe' => $classe
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
