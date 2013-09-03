<?php
namespace NinjaTooken\ClanBundle\Admin;

use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Doctrine\ORM\EntityRepository;

class ClanAdmin extends Admin
{
    //Fields to be shown on create/edit forms
    protected function configureFormFields(FormMapper $formMapper)
    {
        $admin = $formMapper->getAdmin();
        $current = $admin->getSubject();

        $formMapper
            ->add('nom', 'text', array(
                'label' => 'Nom'
            ))
            ->add('tag', 'text', array(
                'label' => 'Tag',
                'required' => false
            ))
            ->add('old_id', 'integer', array(
                'label' => 'Ancien identifiant',
                'required' => false
            ))
            ->add('membres', 'entity', array(
                'label' => 'Membres',
                'multiple' => true,
                'expanded' => true,
                'class' => 'NinjaTookenClanBundle:ClanUtilisateur',
                'query_builder' => function(EntityRepository $er) use ($current) {
                    return $er->createQueryBuilder('cu')
                        ->where('cu.clan = :clan')
                        ->setParameter('clan', $current->getId());
                },
                'property' => 'membre'
            ))
            ->add('accroche', 'text', array(
                'label' => 'Accroche',
                'required' => false
            ))
            ->add('description', 'textarea', array(
                'label' => 'Description',
                'required' => false,
                'attr' => array(
                    'class' => 'tinymce',
                    'tinymce'=>'{"theme":"simple"}'
                )
            ))
            ->add('url', 'url', array(
                'label' => 'Url perso',
                'required' => false
            ))
            ->add('kamon', 'text', array(
                'label' => 'Kamon'
            ))
            ->add('dateAjout', 'datetime', array(
                'label' => 'Date de création'
            ))
            ->add('online', 'choice', array(
                'label' => 'Afficher le clan',
                'multiple' => false,
                'expanded' => true,
                'choices'  => array(true => 'Oui', false => 'Non')
            ))
            ->add('isRecruting', 'choice', array(
                'label' => 'Le clan recrute',
                'multiple' => false,
                'expanded' => true,
                'choices'  => array(true => 'Oui', false => 'Non')
            ))
        ;
    }

    //Fields to be shown on filter forms
    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper
            ->add('nom')
            ->add('tag')
        ;
    }

    //Fields to be shown on lists
    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->addIdentifier('nom')
            ->add('tag')
            ->add('online', null, array('editable' => true))
            ->add('dateAjout')
        ;
    }
}