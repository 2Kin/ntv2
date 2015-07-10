<?php

namespace NinjaTooken\GameBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use NinjaTooken\GameBundle\Utils\GameData;
use NinjaTooken\UserBundle\Entity\User;

class DefaultController extends Controller
{
    public function partiesAction()
    {
        return $this->render('NinjaTookenGameBundle:Default:parties.html.twig', array(
            'games' => $this->getDoctrine()->getManager()->getRepository('NinjaTookenGameBundle:Lobby')->getRecent(50)
        ));
    }

    public function calculateurAction()
    {
        $translator = $this->get('translator');

        $gameData = $this->get('ninjatooken_game.gamedata');

        $level = 0;
        $classe = "suiton";
        // les données du joueur connecté
        $ninja = null;
        $authorizationChecker = $this->get('security.authorization_checker');
        if($authorizationChecker->isGranted('IS_AUTHENTICATED_FULLY') || $authorizationChecker->isGranted('IS_AUTHENTICATED_REMEMBERED') ){
            $user = $this->get('security.token_storage')->getToken()->getUser();
            $ninja = $user->getNinja();
            if($ninja){
                $c = $ninja->getClasse();
                if(!empty($c)){
                    // l'expérience (et données associées)
                    $gameData->setExperience($ninja->getExperience(), $ninja->getGrade());
                    $level = $gameData->getLevelActuel();

                    $classeP = $this->container->getParameter('class');
                    $classe = strtolower($classeP[$c]);
                }
            }
        }

        $capacites = array(
            'force' => array(
                'nom' => $translator->trans('game.force', array(), 'common'),
                'current' => $ninja?$ninja->getAptitudeForce():0
            ),
            'vitesse' => array(
                'nom' => $translator->trans('game.vitesse', array(), 'common'),
                'current' => $ninja?$ninja->getAptitudeVitesse():0
            ),
            'vie' => array(
                'nom' => $translator->trans('game.vie', array(), 'common'),
                'current' => $ninja?$ninja->getAptitudeVie():0
            ),
            'chakra' => array(
                'nom' => $translator->trans('game.chakra', array(), 'common'),
                'current' => $ninja?$ninja->getAptitudeChakra():0
            )
        );
        $aptitudes = array(
            'bouleElementaire' => array(
                'nom' => $translator->trans('game.bouleElementaire.nom', array(), 'common'),
                'values' => array(
                    'degat' => $translator->trans('game.bouleElementaire.degat', array(), 'common'),
                    'rayon' => $translator->trans('game.bouleElementaire.rayon', array(), 'common'),
                    'chakra' => $translator->trans('game.bouleElementaire.chakra', array(), 'common')
                ),
                'current' => $ninja?$ninja->getJutsuBoule():0
            ),
            'doubleSaut'  => array(
                'nom' => $translator->trans('game.doubleSaut.nom', array(), 'common'),
                'values' => array(
                    'saut1' => $translator->trans('game.doubleSaut.saut1', array(), 'common'),
                    'saut2' => $translator->trans('game.doubleSaut.saut2', array(), 'common')
                ),
                'current' => $ninja?$ninja->getJutsuDoubleSaut():0
            ),
            'bouclierElementaire'  => array(
                'nom' => $translator->trans('game.bouclierElementaire.nom', array(), 'common'),
                'values' => array(
                    'reduction' => $translator->trans('game.bouclierElementaire.reduction', array(), 'common'),
                    'chakra' => $translator->trans('game.bouclierElementaire.chakra', array(), 'common'),
                    'last' => $translator->trans('game.bouclierElementaire.last', array(), 'common')
                ),
                'current' => $ninja?$ninja->getJutsuBouclier():0
            ),
            'marcherMur'  => array(
                'nom' => $translator->trans('game.marcherMur.nom', array(), 'common'),
                'values' => array(
                    'chakra' => $translator->trans('game.marcherMur.chakra', array(), 'common'),
                    'last' => $translator->trans('game.marcherMur.last', array(), 'common')
                ),
                'current' => $ninja?$ninja->getJutsuMarcherMur():0
            ),
            'acierRenforce'  => array(
                'nom' => $translator->trans('game.acierRenforce.nom', array(), 'common'),
                'values' => array(
                    'degat' => $translator->trans('game.acierRenforce.degat', array(), 'common'),
                    'chakra' => $translator->trans('game.acierRenforce.chakra', array(), 'common'),
                    'last' => $translator->trans('game.acierRenforce.last', array(), 'common')
                ),
                'current' => $ninja?$ninja->getJutsuAcierRenforce():0
            ),
            'deflagrationElementaire'  => array(
                'nom' => $translator->trans('game.deflagrationElementaire.nom', array(), 'common'),
                'values' => array(
                    'degat' => $translator->trans('game.deflagrationElementaire.degat', array(), 'common'),
                    'chakra' => $translator->trans('game.deflagrationElementaire.chakra', array(), 'common'),
                    'rayon' => $translator->trans('game.deflagrationElementaire.rayon', array(), 'common')
                ),
                'current' => $ninja?$ninja->getJutsuDeflagration():0
            ),
            'chakraVie'  => array(
                'nom' => $translator->trans('game.chakraVie.nom', array(), 'common'),
                'values' => array(
                    'chakra' => $translator->trans('game.chakraVie.chakra', array(), 'common'),
                    'last' => $translator->trans('game.chakraVie.last', array(), 'common')
                ),
                'current' => $ninja?$ninja->getJutsuChakraVie():0
            ),
            'resistanceExplosion'  => array(
                'nom' => $translator->trans('game.resistanceExplosion.nom', array(), 'common'),
                'values' => array(
                    'reduction' => $translator->trans('game.resistanceExplosion.reduction', array(), 'common'),
                    'last' => $translator->trans('game.resistanceExplosion.last', array(), 'common')
                ),
                'current' => $ninja?$ninja->getJutsuResistanceExplosion():0
            ),
            'marcherViteEau'  => array(
                'nom' => $translator->trans('game.marcherViteEau.nom', array(), 'common'),
                'values' => array(
                    'last' => $translator->trans('game.marcherViteEau.last', array(), 'common')
                ),
                'current' => $ninja?$ninja->getJutsuMarcherEau():0
            ),
            'changerObjet'  => array(
                'nom' => $translator->trans('game.changerObjet.nom', array(), 'common'),
                'values' => array(
                    'last' => $translator->trans('game.changerObjet.last', array(), 'common')
                ),
                'current' => $ninja?$ninja->getJutsuMetamorphose():0
            ),
            'multishoot'  => array(
                'nom' => $translator->trans('game.multishoot.nom', array(), 'common'),
                'values' => array(
                    'speed' => $translator->trans('game.multishoot.speed', array(), 'common'),
                    'chakra' => $translator->trans('game.multishoot.chakra', array(), 'common'),
                    'last' => $translator->trans('game.multishoot.last', array(), 'common')
                ),
                'current' => $ninja?$ninja->getJutsuMultishoot():0
            ),
            'invisibleman'  => array(
                'nom' => $translator->trans('game.invisibleman.nom', array(), 'common'),
                'values' => array(
                    'opacity' => $translator->trans('game.invisibleman.opacity', array(), 'common'),
                    'last' => $translator->trans('game.invisibleman.last', array(), 'common')
                ),
                'current' => $ninja?$ninja->getJutsuInvisibilite():0
            ),
            'phoenix'  => array(
                'nom' => $translator->trans('game.phoenix.nom', array(), 'common'),
                'values' => array(
                    'degat' => $translator->trans('game.phoenix.degat', array(), 'common'),
                    'rayon' => $translator->trans('game.phoenix.rayon', array(), 'common'),
                    'chakra' => $translator->trans('game.phoenix.chakra', array(), 'common'),
                    'distance' => $translator->trans('game.phoenix.distance', array(), 'common')
                ),
                'current' => $ninja?$ninja->getJutsuPhoenix():0
            ),
            'vague'  => array(
                'nom' => $translator->trans('game.vague.nom', array(), 'common'),
                'values' => array(
                    'degat' => $translator->trans('game.vague.degat', array(), 'common'),
                    'temps' => $translator->trans('game.vague.temps', array(), 'common'),
                    'chakra' => $translator->trans('game.vague.chakra', array(), 'common'),
                    'distance' => $translator->trans('game.vague.distance', array(), 'common')
                ),
                'current' => $ninja?$ninja->getJutsuVague():0
            ),
            'pieux'  => array(
                'nom' => $translator->trans('game.pieux.nom', array(), 'common'),
                'values' => array(
                    'degat' => $translator->trans('game.pieux.degat', array(), 'common'),
                    'largeur' => $translator->trans('game.pieux.largeur', array(), 'common'),
                    'longueur' => $translator->trans('game.pieux.longueur', array(), 'common'),
                    'chakra' => $translator->trans('game.pieux.chakra', array(), 'common'),
                    'distance' => $translator->trans('game.pieux.distance', array(), 'common')
                ),
                'current' => $ninja?$ninja->getJutsuPieux():0
            ),
            'teleportation'  => array(
                'nom' => $translator->trans('game.teleportation.nom', array(), 'common'),
                'values' => array(
                    'vie' => $translator->trans('game.teleportation.vie', array(), 'common'),
                    'chakra' => $translator->trans('game.teleportation.chakra', array(), 'common'),
                    'distance' => $translator->trans('game.teleportation.distance', array(), 'common')
                ),
                'current' => $ninja?$ninja->getJutsuTeleportation():0
            ),
            'tornade'  => array(
                'nom' => $translator->trans('game.tornade.nom', array(), 'common'),
                'values' => array(
                    'degat' => $translator->trans('game.tornade.degat', array(), 'common'),
                    'temps' => $translator->trans('game.tornade.temps', array(), 'common'),
                    'chakra' => $translator->trans('game.tornade.chakra', array(), 'common'),
                    'distance' => $translator->trans('game.tornade.distance', array(), 'common')
                ),
                'current' => $ninja?$ninja->getJutsuTornade():0
            ),
            'kusanagi'  => array(
                'nom' => $translator->trans('game.kusanagi.nom', array(), 'common'),
                'values' => array(
                    'degat' => $translator->trans('game.kusanagi.degat', array(), 'common'),
                    'last' => $translator->trans('game.kusanagi.last', array(), 'common'),
                    'chakra' => $translator->trans('game.kusanagi.chakra', array(), 'common')
                ),
                'current' => $ninja?$ninja->getJutsuKusanagi():0
            ),
            'kamiRaijin'  => array(
                'nom' => $translator->trans('game.kamiRaijin.nom', array(), 'common'),
                'values' => array(
                    'effect' => $translator->trans('game.kamiRaijin.effect', array(), 'common'),
                    'rayon' => $translator->trans('game.kamiRaijin.rayon', array(), 'common'),
                    'temps' => $translator->trans('game.kamiRaijin.temps', array(), 'common'),
                    'distance' => $translator->trans('game.kamiRaijin.distance', array(), 'common'),
                    'chakra' => $translator->trans('game.kamiRaijin.chakra', array(), 'common')
                ),
                'current' => $ninja?$ninja->getJutsuRaijin():0
            ),
            'kamiSarutahiko'  => array(
                'nom' => $translator->trans('game.kamiSarutahiko.nom', array(), 'common'),
                'values' => array(
                    'effect' => $translator->trans('game.kamiSarutahiko.effect', array(), 'common'),
                    'rayon' => $translator->trans('game.kamiSarutahiko.rayon', array(), 'common'),
                    'temps' => $translator->trans('game.kamiSarutahiko.temps', array(), 'common'),
                    'distance' => $translator->trans('game.kamiSarutahiko.distance', array(), 'common'),
                    'chakra' => $translator->trans('game.kamiSarutahiko.chakra', array(), 'common')
                ),
                'current' => $ninja?$ninja->getJutsuSarutahiko():0
            ),
            'kamiFujin'  => array(
                'nom' => $translator->trans('game.kamiFujin.nom', array(), 'common'),
                'values' => array(
                    'rayon' => $translator->trans('game.kamiFujin.rayon', array(), 'common'),
                    'temps' => $translator->trans('game.kamiFujin.temps', array(), 'common'),
                    'distance' => $translator->trans('game.kamiFujin.distance', array(), 'common'),
                    'chakra' => $translator->trans('game.kamiFujin.chakra', array(), 'common')
                ),
                'current' => $ninja?$ninja->getJutsuFujin():0
            ),
            'kamiSusanoo'  => array(
                'nom' => $translator->trans('game.kamiSusanoo.nom', array(), 'common'),
                'values' => array(
                    'effect' => $translator->trans('game.kamiSusanoo.effect', array(), 'common'),
                    'rayon' => $translator->trans('game.kamiSusanoo.rayon', array(), 'common'),
                    'temps' => $translator->trans('game.kamiSusanoo.temps', array(), 'common'),
                    'distance' => $translator->trans('game.kamiSusanoo.distance', array(), 'common'),
                    'chakra' => $translator->trans('game.kamiSusanoo.chakra', array(), 'common')
                ),
                'current' => $ninja?$ninja->getJutsuSusanoo():0
            ),
            'kamiKagutsuchi'  => array(
                'nom' => $translator->trans('game.kamiKagutsuchi.nom', array(), 'common'),
                'values' => array(
                    'effect' => $translator->trans('game.kamiKagutsuchi.effect', array(), 'common'),
                    'rayon' => $translator->trans('game.kamiKagutsuchi.rayon', array(), 'common'),
                    'temps' => $translator->trans('game.kamiKagutsuchi.temps', array(), 'common'),
                    'distance' => $translator->trans('game.kamiKagutsuchi.distance', array(), 'common'),
                    'chakra' => $translator->trans('game.kamiKagutsuchi.chakra', array(), 'common')
                ),
                'current' => $ninja?$ninja->getJutsuKagutsuchi():0
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
        return $this->render('NinjaTookenGameBundle:Games:recentList.html.twig', array(
            'games' => $this->getDoctrine()->getManager()->getRepository('NinjaTookenGameBundle:Lobby')->getRecent($max)
        ));
    }

    public function signatureAction(User $user)
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

        }
        return $this->render('NinjaTookenGameBundle:Default:signature.html.twig', array('user' => $user));
    }
}
