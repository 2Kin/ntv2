<?php
namespace NinjaTooken\ForumBundle\Admin;

use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Doctrine\ORM\EntityRepository;

class ThreadAdmin extends Admin
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
                ->add('nom', 'text', array(
                    'label' => 'Nom'
                ))
                ->add('forum', 'sonata_type_model_list', array(
                    'btn_add'       => 'Add forum',
                    'btn_list'      => 'List',
                    'btn_delete'    => false,
                ), array(
                    'placeholder' => 'No forum selected'
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
                ->add('old_id', 'integer', array(
                    'label' => 'Ancien identifiant',
                    'required' => false
                ))
                ->add('isPostit', 'choice', array(
                    'label' => 'Afficher en postit',
                    'multiple' => false,
                    'expanded' => true,
                    'choices'  => array(true => 'Oui', false => 'Non')
                ))
                ->add('isCommentable', 'choice', array(
                    'label' => 'Verrouillé',
                    'multiple' => false,
                    'expanded' => true,
                    'choices'  => array(true => 'Oui', false => 'Non')
                ))
                ->add('isEvent', 'choice', array(
                    'label' => 'Event',
                    'multiple' => false,
                    'expanded' => true,
                    'choices'  => array(true => 'Oui', false => 'Non')
                ))
                ->add('dateEventStart', 'datetime', array(
                    'label' => 'Début de l\'event',
                    'required' => false
                ))
                ->add('dateEventEnd', 'datetime', array(
                    'label' => 'Fin de l\'event',
                    'required' => false
                ))
                ->add('urlVideo', 'url', array(
                    'label' => 'url de la vidéo',
                    'required' => false
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
            ->add('author.username')
            ->add('forum.nom')
            ->add('isCommentable', null, array('editable' => true))
            ->add('isPostit', null, array('editable' => true))
            ->add('isEvent', null, array('editable' => true))
            ->add('dateAjout')
        ;
    }
}