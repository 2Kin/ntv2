<?php

namespace NinjaTooken\ClanBundle\Admin;

use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Show\ShowMapper;

class ClanUtilisateurAdmin extends Admin
{
    protected $parentAssociationMapping = 'clan';

    /**
     * @param DatagridMapper $datagridMapper
     */
    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper
            ->add('droit')
            ->add('canEditClan')
        ;
    }

    /**
     * @param ListMapper $listMapper
     */
    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->addIdentifier('id');

        if(!$this->isChild())
            $listMapper->add('clan', null, array('label' => 'Clan'));

        $listMapper
            ->add('recruteur', null, array('label' => 'Recruteur'))
            ->add('membre', null, array('label' => 'Membre'))
            ->add('droit', null, array('label' => 'Droit', 'editable' => true))
            ->add('canEditClan', null, array('label' => 'Peut éditer le clan', 'editable' => true))
            ->add('dateAjout', null, array('label' => 'Ajouté le'))
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
        if(!$this->isChild()){
            $formMapper->add('clan', 'sonata_type_model_list', array(
                'btn_add'       => 'Ajouter Clan',
                'btn_list'      => 'List',
                'btn_delete'    => false,
            ), array(
                'placeholder' => 'Pas de clan'
            ));
        }

        $formMapper
            ->add('recruteur', 'sonata_type_model_list', array(
                'btn_add'       => 'Ajouter Utilisateur',
                'btn_list'      => 'List',
                'btn_delete'    => false,
            ), array(
                'placeholder' => 'Pas de recruteur'
            ))
            ->add('membre', 'sonata_type_model_list', array(
                'btn_add'       => 'Ajouter Utilisateur',
                'btn_list'      => 'List',
                'btn_delete'    => false,
            ), array(
                'placeholder' => 'Pas de membre'
            ))
            ->add('droit', 'choice', array(
                'label' => 'Droit',
                'multiple' => false,
                'expanded' => false,
                'choices'  => array('Shishō', 'Taishō', 'Jōnin', 'Chūnin')
            ))
            ->add('canEditClan', 'choice', array(
                'label' => 'Peut éditer le clan',
                'multiple' => false,
                'expanded' => true,
                'choices'  => array(true => 'Oui', false => 'Non')
            ))
            ->add('dateAjout', 'datetime', array(
                'label' => 'Date de recrutement'
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
            ->add('droit')
            ->add('canEditClan')
            ->add('dateAjout')
        ;
    }
}
