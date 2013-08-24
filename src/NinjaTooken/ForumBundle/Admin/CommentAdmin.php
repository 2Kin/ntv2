<?php
namespace NinjaTooken\ForumBundle\Admin;

use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Doctrine\ORM\EntityRepository;

class CommentAdmin extends Admin
{
    //Fields to be shown on create/edit forms
    protected function configureFormFields(FormMapper $formMapper)
    {
        $admin = $formMapper->getAdmin();
        $current = $admin->getSubject();

        $formMapper
            ->with('General')
                ->add('thread', 'genemu_jqueryselect2_entity', array(
                    'label' => 'Forum',
                    'class' => 'NinjaTookenForumBundle:Thread',
                    'property' => 'nom',
                    'configs' => array(
                        'placeholder' => 'Sélectionnez un topic'
                    )
                ))
                ->add('author', 'genemu_jqueryselect2_entity', array(
                    'label' => 'Auteur',
                    'class' => 'NinjaTookenUserBundle:User',
                    'query_builder' => function(EntityRepository $er) use ($current) {
                        return $er->createQueryBuilder('u')
                            ->where('u = :user')
                            ->setParameter('user', $current->getAuthor())
                            ->setFirstResult(0)
                            ->setMaxResults(1);
                    },
                    'property' => 'username',
                    'configs' => array(
                        'minimumInputLength' => 3,
                        'allowClear' => false,
                        'ajaxUrl' => $admin->getRouteGenerator()->generate('ninja_tooken_user_find')
                    )
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