<?php

namespace NinjaTooken\UserBundle\Admin;

use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Show\ShowMapper;

class CaptureAdmin extends Admin
{
    protected $parentAssociationMapping = 'user';

    /**
     * @param DatagridMapper $datagridMapper
     */
    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper
            ->add('id')
            ->add('url')
            ->add('urlTmb')
            ->add('deleteHash')
            ->add('dateAjout')
        ;
    }

    /**
     * @param ListMapper $listMapper
     */
    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->addIdentifier('id');

        if(!$this->isChild())
            $listMapper->add('user', null, array('label' => 'Utilisateur'));

        $listMapper
            ->add('url', null, array('label' => 'Url'))
            ->add('urlTmb', null, array('label' => 'Url de la vignette'))
            ->add('deleteHash', null, array('label' => 'Hash de suppression'))
            ->add('dateAjout', null, array('label' => 'Créé le'))
            ->add('_action', 'actions', array(
                'actions' => array(
                    'show' => array(),
                    'edit' => array(),
                    'delete' => array(),
                )
            ))
        ;
    }

    /**
     * @param FormMapper $formMapper
     */
    protected function configureFormFields(FormMapper $formMapper)
    {
        // get the current instance
        $capture = $this->getSubject();
        $url = '';
        $thumb = '';
        if ($capture && $capture->getId() !== null) {
            $url = $capture->getUrl();
            $thumb = $capture->getUrlTmb();
        }

        if(!$this->isChild())
            $formMapper->add('user', 'sonata_type_model_list', array(
                'label'         => 'Utilisateur',
                'btn_add'       => 'Ajouter',
                'btn_list'      => 'Sélectionner',
                'btn_delete'    => false
            ));

        $formMapper
            ->add('url', 'text', array(
                'label' => 'Url'
            ))
            ->setHelps(array(
                'url' => (!empty($url)?'<img src="'.$url.'" class="thumbnail"/>':'').'',
            ))
            ->add('urlTmb', 'text', array(
                'label' => 'Url de la vignette'
            ))
            ->setHelps(array(
                'urlTmb' => (!empty($thumb)?'<img src="'.$thumb.'" class="thumbnail"/>':'').'',
            ))
            ->add('deleteHash', 'text', array(
                'label' => 'Hash de suppression'
            ))
            ->add('dateAjout', 'datetime', array(
                'required' => false,
                'label' => 'Créé le'
            ))
        ;
    }

    /**
     * @param ShowMapper $showMapper
     */
    protected function configureShowFields(ShowMapper $showMapper)
    {
        $showMapper
            ->add('id')
            ->add('url')
            ->add('urlTmb')
            ->add('deleteHash')
            ->add('dateAjout')
        ;
    }
}
