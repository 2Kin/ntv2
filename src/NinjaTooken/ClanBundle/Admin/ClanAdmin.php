<?php
namespace NinjaTooken\ClanBundle\Admin;

use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Show\ShowMapper;
use Doctrine\ORM\EntityRepository;
use Sonata\AdminBundle\Admin\AdminInterface;
use Knp\Menu\ItemInterface as MenuItemInterface;

class ClanAdmin extends Admin
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
            'Clan',
            array('uri' => $admin->generateUrl('edit', array('id' => $id)))
        );

        $menu->addChild(
            'Forums',
            array('uri' => $admin->generateUrl('ninjatooken.forum.admin.forum.list', array('id' => $id)))
        );

        $menu->addChild(
            'Membres',
            array('uri' => $admin->generateUrl('ninjatooken_clan.admin.clan_utilisateur.list', array('id' => $id)))
        );

        $menu->addChild(
            'Postulations',
            array('uri' => $admin->generateUrl('ninjatooken_clan.admin.clan_postulation.list', array('id' => $id)))
        );

    }
}