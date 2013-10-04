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
                'label' => 'label.nom',
                'label_attr' => array('class' => 'libelle')
            ))
            ->add('body', 'textarea', array(
                'label' => 'label.body',
                'label_attr' => array('class' => 'libelle')
            ))
            ->add('dateEventStart', 'date', array(
                'format' => 'dd MMMM yyyy',
                'view_timezone' => "Europe/Paris",
                'model_timezone' => "Europe/Paris",
                'empty_value' => array(
                    'day' => 'label.jour',
                    'month' => 'label.mois',
                    'year' => 'label.annee'
                ),
                'label' => 'label.dateEventStart',
                'label_attr' => array('class' => 'libelle'),
                'required' => false
            ))
            ->add('dateEventEnd', 'date', array(
                'format' => 'dd MMMM yyyy',
                'view_timezone' => "Europe/Paris",
                'model_timezone' => "Europe/Paris",
                'empty_value' => array(
                    'day' => 'label.jour',
                    'month' => 'label.mois',
                    'year' => 'label.annee'
                ),
                'label' => 'label.dateEventEnd',
                'label_attr' => array('class' => 'libelle'),
                'required' => false
            ))
            ->add('url_video', 'text', array(
                'label' => 'label.url_video',
                'label_attr' => array('class' => 'libelle'),
                'required' => false
            ));
    }

    public function getName()
    {
        return 'event';
    }
}