<?php

namespace NinjaTooken\UserBundle\Admin;

use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Show\ShowMapper;

class MessageUserAdmin extends Admin
{
    /**
     * @param DatagridMapper $datagridMapper
     */
    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper
            ->add('id')
            ->add('destinataire')
            ->add('dateRead')
            ->add('hasDeleted')
        ;
    }

    /**
     * @param ListMapper $listMapper
     */
    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->addIdentifier('id', null, array('label' => 'Id'))
            ->add('destinataire', null, array('label' => 'Destinataire'))
            ->add('dateRead', null, array('label' => 'Lu le'))
            ->add('hasDeleted', null, array('editable' => true, 'label' => 'Supprimé ?'))
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
            ->add('destinataire', 'sonata_type_model_list', array(
                'label'         => 'Destinataire',
                'btn_add'       => 'Ajouter',
                'btn_list'      => 'Sélectionner',
                'btn_delete'    => false
            ))
            ->add('dateRead', 'datetime', array(
                'required' => false,
                'label' => 'Lu le'
            ))
            ->add('hasDeleted', 'choice', array(
                'label' => 'Supprimé ?',
                'multiple' => false,
                'expanded' => true,
                'choices'  => array('Oui' => true, 'Non' => false),
                'choice_value' => function($choice){
                    return $choice;
                },
                'choices_as_values' => true
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
            ->add('destinataire')
            ->add('dateRead')
            ->add('hasDeleted')
        ;
    }
}
