<?php
namespace NinjaTooken\ForumBundle\Admin;

use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Show\ShowMapper;
use Doctrine\ORM\EntityRepository;

class CommentUserAdmin extends Admin
{
    protected $parentAssociationMapping = 'author';

    protected $datagridValues = array(
        '_sort_order' => 'DESC',
        '_sort_by' => 'dateAjout'
    );

    public function getBaseRouteName()
    {
        $matches = array('ninjatooken', 'user', 'comment');

        if ($this->isChild()) { // the admin class is a child, prefix it with the parent route name
            $this->baseRouteName = sprintf('%s_%s',
                $this->getParent()->getBaseRouteName(),
                $this->urlize($matches[2])
            );
        } else {

            $this->baseRouteName = sprintf('admin_%s_%s_%s',
                $this->urlize($matches[0]),
                $this->urlize($matches[1]),
                $this->urlize($matches[2])
            );
        }

        return $this->baseRouteName;
    }

    public function getBaseRoutePattern()
    {
        $matches = array('ninjatooken', 'user', 'comment');

        if ($this->isChild()) { // the admin class is a child, prefix it with the parent route name
            $this->baseRoutePattern = sprintf('%s/{id}/%s',
                $this->getParent()->getBaseRoutePattern(),
                $this->urlize($matches[2], '-')
            );
        } else {

            $this->baseRoutePattern = sprintf('/%s/%s/%s',
                $this->urlize($matches[0], '-'),
                $this->urlize($matches[1], '-'),
                $this->urlize($matches[2], '-')
            );
        }

        return $this->baseRoutePattern;
    }

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
            ));

        if(!$this->isChild())
            $formMapper->add('author', 'sonata_type_model_list', array(
                    'btn_add'       => 'Add author',
                    'btn_list'      => 'List',
                    'btn_delete'    => false,
                ), array(
                    'placeholder' => 'No author selected'
                ));

        $formMapper
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
            ->addIdentifier('id')
            ->add('thread', null, array('label' => 'Topic'));

        if(!$this->isChild())
            $listMapper->add('author', null, array('label' => 'Auteur'));

        $listMapper
            ->add('dateAjout', null, array('label' => 'Créé le'))
        ;
    }
}