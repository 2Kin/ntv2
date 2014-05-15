<?php

namespace NinjaTooken\UserBundle\Admin;

use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Show\ShowMapper;

class FriendAdmin extends Admin
{
    protected $parentAssociationMapping = 'user';

    /**
     * @param DatagridMapper $datagridMapper
     */
    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper
            ->add('dateAjout')
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
            $listMapper->add('user', null, array('label' => 'Utilisateur'));

        $listMapper
            ->add('friend', null, array('label' => 'Ami'))
            ->add('isBlocked', null, array('editable' => true, 'label' => 'Bloqué'))
            ->add('isConfirmed', null, array('editable' => true, 'label' => 'Confirmé'))
            ->add('dateAjout', null, array('label' => 'Créé le'))
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
        if(!$this->isChild())
            $formMapper->add('user', 'sonata_type_model_list', array(
                'label'         => 'Utilisateur',
                'btn_add'       => 'Ajouter',
                'btn_list'      => 'Sélectionner',
                'btn_delete'    => false
            ));

        $formMapper
            ->add('friend', 'sonata_type_model_list', array(
                'label'         => 'Ami',
                'btn_add'       => 'Ajouter',
                'btn_list'      => 'Sélectionner',
                'btn_delete'    => false
            ))
            ->add('isBlocked', 'choice', array(
                'label' => 'Bloqué ?',
                'multiple' => false,
                'expanded' => true,
                'choices'  => array(true => 'Oui', false => 'Non')
            ))
            ->add('isConfirmed', 'choice', array(
                'label' => 'Confirmé ?',
                'multiple' => false,
                'expanded' => true,
                'choices'  => array(true => 'Oui', false => 'Non')
            ))
            ->add('dateAjout', 'datetime', array(
                'required' => false,
                'label' => 'Créé le'
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
            ->add('user')
            ->add('friend')
            ->add('isBlocked')
            ->add('isConfirmed')
            ->add('dateAjout')
        ;
    }
}
