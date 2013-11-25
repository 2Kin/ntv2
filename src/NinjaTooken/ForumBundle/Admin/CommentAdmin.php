<?php
namespace NinjaTooken\ForumBundle\Admin;

use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Show\ShowMapper;
use Doctrine\ORM\EntityRepository;

class CommentAdmin extends Admin
{
    protected $datagridValues = array(
        '_sort_order' => 'DESC',
        '_sort_by' => 'dateAjout'
    );

    //Fields to be shown on create/edit forms
    protected function configureFormFields(FormMapper $formMapper)
    {
        $admin = $formMapper->getAdmin();
        $current = $admin->getSubject();

        $formMapper
            ->with('General')
                ->add('thread', 'sonata_type_model_list', array(
                    'btn_add'       => 'Add thread',
                    'btn_list'      => 'List',
                    'btn_delete'    => false,
                ), array(
                    'placeholder' => 'No thread selected'
                ))
                ->add('author', 'sonata_type_model_list', array(
                    'btn_add'       => 'Add author',
                    'btn_list'      => 'List',
                    'btn_delete'    => false,
                ), array(
                    'placeholder' => 'No author selected'
                ))
                ->add('body', 'textarea', array(
                    'label' => 'Contenu',
                    'attr' => array(
                        'class' => 'tinymce',
                        'tinymce'=>'{"theme":"simple"}'
                    )
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
            ->add('body')
        ;
    }

    //Fields to be shown on lists
    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->addIdentifier('thread.nom')
            ->addIdentifier('author.username')
            ->add('dateAjout')
        ;
    }
}