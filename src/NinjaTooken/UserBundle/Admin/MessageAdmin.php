<?php

namespace NinjaTooken\UserBundle\Admin;

use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Show\ShowMapper;

class MessageAdmin extends Admin
{
    protected $parentAssociationMapping = 'author';

    protected $datagridValues = array(
        '_sort_order' => 'DESC',
        '_sort_by' => 'dateAjout'
    );

    /**
     * @param DatagridMapper $datagridMapper
     */
    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper
            ->add('nom', null, array('label' => 'Nom'))
            ->add('content', null, array('label' => 'Contenu'))
        ;
    }

    /**
     * @param ListMapper $listMapper
     */
    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->addIdentifier('nom', null, array('label' => 'Nom'));

        if(!$this->isChild())
            $listMapper->add('author', null, array('label' => 'Auteur'));

        $listMapper
            ->add('dateAjout', null, array('label' => 'Créé le'))
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
        if(!$this->isChild())
            $formMapper->add('author', 'sonata_type_model_list', array(
                'label'         => 'Auteur',
                'btn_add'       => 'Ajouter',
                'btn_list'      => 'Sélectionner',
                'btn_delete'    => false
            ));

        $formMapper
            ->add('nom', 'text', array(
                'label' => 'Nom'
            ))
            ->add('content', 'textarea', array(
                'label' => 'Contenu',
                'attr' => array(
                    'class' => 'tinymce',
                    'tinymce'=>'{"theme":"simple"}'
                )
            ))
            ->add('old_id', 'text', array(
                'required' => false,
                'label' => 'Ancien identifiant'
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
            ->add('receivers', 'sonata_type_collection', array(
                'type_options' => array('delete' => false, 'read_only' => true),
                'by_reference' => false,
                'label' => 'Destinataires'
            ), array(
                'edit' => 'inline',
                'inline' => 'table'
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
            ->add('old_id')
            ->add('author')
            ->add('nom')
            ->add('content')
            ->add('dateAjout')
            ->add('hasDeleted')
        ;
    }
}
