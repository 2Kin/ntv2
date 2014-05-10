<?php

namespace NinjaTooken\GameBundle\Admin;

use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Show\ShowMapper;

class NinjaAdmin extends Admin
{
    /**
     * @param DatagridMapper $datagridMapper
     */
    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper
            ->add('id')
            ->add('aptitudeForce')
            ->add('aptitudeVitesse')
            ->add('aptitudeVie')
            ->add('aptitudeChakra')
            ->add('jutsuBoule')
            ->add('jutsuDoubleSaut')
            ->add('jutsuBouclier')
            ->add('jutsuMarcherMur')
            ->add('jutsuDeflagration')
            ->add('jutsuMarcherEau')
            ->add('jutsuMetamorphose')
            ->add('jutsuMultishoot')
            ->add('jutsuInvisibilite')
            ->add('jutsuResistanceExplosion')
            ->add('jutsuPhoenix')
            ->add('jutsuVague')
            ->add('jutsuPieux')
            ->add('jutsuTeleportation')
            ->add('jutsuTornade')
            ->add('jutsuKusanagi')
            ->add('jutsuAcierRenforce')
            ->add('jutsuChakraVie')
            ->add('jutsuFujin')
            ->add('jutsuRaijin')
            ->add('jutsuSarutahiko')
            ->add('jutsuSusanoo')
            ->add('jutsuKagutsuchi')
            ->add('grade')
            ->add('experience')
            ->add('classe')
            ->add('masque')
            ->add('masqueCouleur')
            ->add('masqueDetail')
            ->add('costume')
            ->add('costumeCouleur')
            ->add('costumeDetail')
            ->add('missionAssassinnat')
            ->add('missionCourse')
            ->add('accomplissement')
        ;
    }

    /**
     * @param ListMapper $listMapper
     */
    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->add('id')
            ->add('aptitudeForce')
            ->add('aptitudeVitesse')
            ->add('aptitudeVie')
            ->add('aptitudeChakra')
            ->add('jutsuBoule')
            ->add('jutsuDoubleSaut')
            ->add('jutsuBouclier')
            ->add('jutsuMarcherMur')
            ->add('jutsuDeflagration')
            ->add('jutsuMarcherEau')
            ->add('jutsuMetamorphose')
            ->add('jutsuMultishoot')
            ->add('jutsuInvisibilite')
            ->add('jutsuResistanceExplosion')
            ->add('jutsuPhoenix')
            ->add('jutsuVague')
            ->add('jutsuPieux')
            ->add('jutsuTeleportation')
            ->add('jutsuTornade')
            ->add('jutsuKusanagi')
            ->add('jutsuAcierRenforce')
            ->add('jutsuChakraVie')
            ->add('jutsuFujin')
            ->add('jutsuRaijin')
            ->add('jutsuSarutahiko')
            ->add('jutsuSusanoo')
            ->add('jutsuKagutsuchi')
            ->add('grade')
            ->add('experience')
            ->add('classe')
            ->add('masque')
            ->add('masqueCouleur')
            ->add('masqueDetail')
            ->add('costume')
            ->add('costumeCouleur')
            ->add('costumeDetail')
            ->add('missionAssassinnat')
            ->add('missionCourse')
            ->add('accomplissement')
            ->add('_action', 'actions', array(
                'actions' => array(
                    'show' => array(),
                    'edit' => array(),
                    'delete' => array(),
                )
            ))
        ;
    }

    /**
     * @param FormMapper $formMapper
     */
    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->add('aptitudeForce', 'integer', array(
                'label' => 'Force'
            ))
            ->add('aptitudeVitesse', 'integer', array(
                'label' => 'Vitesse'
            ))
            ->add('aptitudeVie', 'integer', array(
                'label' => 'Vie'
            ))
            ->add('aptitudeChakra', 'integer', array(
                'label' => 'Chakra'
            ))
            ->add('jutsuBoule', 'integer', array(
                'label' => 'Boule d\'énergie'
            ))
            ->add('jutsuDoubleSaut', 'integer', array(
                'label' => 'Double saut'
            ))
            ->add('jutsuBouclier', 'integer', array(
                'label' => 'Bouclier d\'énergie'
            ))
            ->add('jutsuMarcherMur', 'integer', array(
                'label' => 'Marcher sur les murs'
            ))
            ->add('jutsuDeflagration', 'integer', array(
                'label' => 'Déflagration'
            ))
            ->add('jutsuMarcherEau', 'integer', array(
                'label' => 'Marcher sur l\'eau'
            ))
            ->add('jutsuMetamorphose', 'integer', array(
                'label' => 'Changer en rocher'
            ))
            ->add('jutsuMultishoot', 'integer', array(
                'label' => 'Multishoot'
            ))
            ->add('jutsuInvisibilite', 'integer', array(
                'label' => 'Invisibilité'
            ))
            ->add('jutsuResistanceExplosion', 'integer', array(
                'label' => 'Résistance aux explosions'
            ))
            ->add('jutsuPhoenix', 'integer', array(
                'label' => 'Pheonix'
            ))
            ->add('jutsuVague', 'integer', array(
                'label' => 'Tsunami'
            ))
            ->add('jutsuPieux', 'integer', array(
                'label' => 'Pieux'
            ))
            ->add('jutsuTeleportation', 'integer', array(
                'label' => 'Téléportation'
            ))
            ->add('jutsuTornade', 'integer', array(
                'label' => 'Tornade'
            ))
            ->add('jutsuKusanagi', 'integer', array(
                'label' => 'Kusanagi'
            ))
            ->add('jutsuAcierRenforce', 'integer', array(
                'label' => 'Acier renforcé'
            ))
            ->add('jutsuChakraVie', 'integer', array(
                'label' => 'Chakra de vie'
            ))
            ->add('jutsuFujin', 'integer', array(
                'label' => 'Fujin'
            ))
            ->add('jutsuRaijin', 'integer', array(
                'label' => 'Raijin'
            ))
            ->add('jutsuSarutahiko', 'integer', array(
                'label' => 'Sarutahiko'
            ))
            ->add('jutsuSusanoo', 'integer', array(
                'label' => 'Susanoo'
            ))
            ->add('jutsuKagutsuchi', 'integer', array(
                'label' => 'Kagutsuchi'
            ))
            ->add('grade', 'integer', array(
                'label' => 'Dan'
            ))
            ->add('experience', 'integer', array(
                'label' => 'Expérience'
            ))
            ->add('classe', 'text', array(
                'label' => 'Classe'
            ))
            ->add('masque', 'integer', array(
                'label' => 'Masque'
            ))
            ->add('masqueCouleur', 'integer', array(
                'label' => 'Couleur de masque'
            ))
            ->add('masqueDetail', 'integer', array(
                'label' => 'Détail de masque'
            ))
            ->add('costume', 'integer', array(
                'label' => 'Costume'
            ))
            ->add('costumeCouleur', 'integer', array(
                'label' => 'Couleur de costume'
            ))
            ->add('costumeDetail', 'integer', array(
                'label' => 'Détail de costume'
            ))
            ->add('missionAssassinnat', 'integer', array(
                'label' => 'Assassinnat'
            ))
            ->add('missionCourse', 'integer', array(
                'label' => 'Course'
            ))
            ->add('accomplissement', 'text', array(
                'label' => 'Accomplissement'
            ))
        ;
    }

    /**
     * @param ShowMapper $showMapper
     */
    protected function configureShowFields(ShowMapper $showMapper)
    {
        $showMapper
            ->add('id')
            ->add('aptitudeForce')
            ->add('aptitudeVitesse')
            ->add('aptitudeVie')
            ->add('aptitudeChakra')
            ->add('jutsuBoule')
            ->add('jutsuDoubleSaut')
            ->add('jutsuBouclier')
            ->add('jutsuMarcherMur')
            ->add('jutsuDeflagration')
            ->add('jutsuMarcherEau')
            ->add('jutsuMetamorphose')
            ->add('jutsuMultishoot')
            ->add('jutsuInvisibilite')
            ->add('jutsuResistanceExplosion')
            ->add('jutsuPhoenix')
            ->add('jutsuVague')
            ->add('jutsuPieux')
            ->add('jutsuTeleportation')
            ->add('jutsuTornade')
            ->add('jutsuKusanagi')
            ->add('jutsuAcierRenforce')
            ->add('jutsuChakraVie')
            ->add('jutsuFujin')
            ->add('jutsuRaijin')
            ->add('jutsuSarutahiko')
            ->add('jutsuSusanoo')
            ->add('jutsuKagutsuchi')
            ->add('grade')
            ->add('experience')
            ->add('classe')
            ->add('masque')
            ->add('masqueCouleur')
            ->add('masqueDetail')
            ->add('costume')
            ->add('costumeCouleur')
            ->add('costumeDetail')
            ->add('missionAssassinnat')
            ->add('missionCourse')
            ->add('accomplissement')
        ;
    }
}
