<?php
namespace NinjaTooken\ForumBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;

class EventType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('nom', 'text', array(
                'label' => 'Nom',
                'label_attr' => array('class' => 'libelle')
            ))
            ->add('body', 'textarea', array(
                'label' => 'Contenu',
                'label_attr' => array('class' => 'libelle')
            ))
            ->add('dateEventStart', 'date', array(
                'label' => 'Début de l\'event',
                'label_attr' => array('class' => 'libelle'),
                'required' => false
            ))
            ->add('dateEventEnd', 'date', array(
                'label' => 'Fin de l\'event',
                'label_attr' => array('class' => 'libelle'),
                'required' => false
            ))
            ->add('url_video', 'text', array(
                'label' => 'Url Vidéo',
                'label_attr' => array('class' => 'libelle'),
                'required' => false
            ));
    }

    public function getName()
    {
        return 'event';
    }
}