<?php
namespace NinjaTooken\ForumBundle\Admin;

use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;

class ForumAdmin extends Admin
{
    protected $datagridValues = array(
        '_sort_order' => 'DESC',
        '_sort_by' => 'dateAjout'
    );

    //Fields to be shown on create/edit forms
    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->add('nom', 'text', array(
                'label' => 'Nom'
            ))
            ->add('clan', 'sonata_type_model_list', array(
                'btn_add'       => 'Add Clan',
                'btn_list'      => 'List',
                'btn_delete'    => false,
            ), array(
                'placeholder' => 'No clan selected'
            ))
            ->add('old_id', 'integer', array(
                'label' => 'Ancien identifiant',
                'required' => false
            ))
            ->add('ordre', 'integer', array(
                'label' => 'Position'
            ))
            ->add('dateAjout', 'datetime', array(
                'label' => 'Date de création'
            ))
        ;
    }

    //Fields to be shown on filter forms
    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper
            ->add('nom')
        ;
    }

    //Fields to be shown on lists
    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->addIdentifier('nom')
            ->addIdentifier('clan.nom')
            ->add('ordre')
            ->add('dateAjout')
        ;
    }
}