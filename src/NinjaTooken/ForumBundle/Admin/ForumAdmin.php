<?php
namespace NinjaTooken\ForumBundle\Admin;

use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;

class ForumAdmin extends Admin
{
    //Fields to be shown on create/edit forms
    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->add('nom', 'text', array(
                'label' => 'Nom'
            ))
            ->add('clan', 'genemu_jqueryselect2_entity', array(
                'label' => 'Clan',
                'class' => 'NinjaTookenClanBundle:Clan',
                'property' => 'nom',
                'configs' => array(
                    'placeholder' => 'Sélectionnez un clan'
                )
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