<?php
namespace NinjaTooken\ForumBundle\Admin;

use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Doctrine\ORM\EntityRepository;
use Sonata\AdminBundle\Admin\AdminInterface;
use Knp\Menu\ItemInterface as MenuItemInterface;

class ThreadAdmin extends Admin
{

    protected $parentAssociationMapping = 'forum';

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
                ));

        if(!$this->isChild())
            $formMapper->add('forum', 'sonata_type_model_list', array(
                    'btn_add'       => 'Add forum',
                    'btn_list'      => 'List',
                    'btn_delete'    => false,
                ), array(
                    'placeholder' => 'No forum selected'
                ));

        $formMapper
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
                    'choices'  => array('Oui' => true, 'Non' => false),
                    'choice_value' => function($choice){
                        return $choice;
                    },
                    'choices_as_values' => true
                ))
                ->add('isCommentable', 'choice', array(
                    'label' => 'Verrouillé',
                    'multiple' => false,
                    'expanded' => true,
                    'choices'  => array('Oui' => true, 'Non' => false),
                    'choice_value' => function($choice){
                        return $choice;
                    },
                    'choices_as_values' => true
                ))
                ->add('isEvent', 'choice', array(
                    'label' => 'Event',
                    'multiple' => false,
                    'expanded' => true,
                    'choices'  => array('Oui' => true, 'Non' => false),
                    'choice_value' => function($choice){
                        return $choice;
                    },
                    'choices_as_values' => true
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
            ->add('author.username');

        if(!$this->isChild())
            $listMapper->add('forum.nom');

        $listMapper
            ->add('isCommentable', null, array('editable' => true))
            ->add('isPostit', null, array('editable' => true))
            ->add('isEvent', null, array('editable' => true))
            ->add('dateAjout')
        ;
    }

    /**
    * {@inheritdoc}
    */
    protected function configureSideMenu(MenuItemInterface $menu, $action, AdminInterface $childAdmin = null)
    {
        if (!$childAdmin && !in_array($action, array('edit'))) {
            return;
        }

        $admin = $this->isChild() ? $this->getParent() : $this;

        $id = $admin->getRequest()->get('id');
        $menu->addChild(
            'Topic',
            array('uri' => $admin->generateUrl('edit', array('id' => $id)))
        );

        $menu->addChild(
            'Commentaires',
            array('uri' => $admin->generateUrl('ninjatooken.forum.admin.comment.list', array('id' => $id)))
        );

    }
}