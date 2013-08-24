<?php
namespace NinjaTooken\ForumBundle\Admin;

use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Doctrine\ORM\EntityRepository;

class ThreadAdmin extends Admin
{
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
                ->add('forum', 'genemu_jqueryselect2_entity', array(
                    'label' => 'Forum',
                    'class' => 'NinjaTookenForumBundle:Forum',
                    'property' => 'nom',
                    'configs' => array(
                        'placeholder' => 'Sélectionnez un forum'
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