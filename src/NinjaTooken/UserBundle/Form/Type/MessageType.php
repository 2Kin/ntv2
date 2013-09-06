<?php

namespace NinjaTooken\UserBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class MessageType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('nom', 'text', array(
                'label' => 'Sujet',
                'label_attr' => array('class' => 'libelle')
            ))
            ->add('content', 'textarea', array(
                'label' => 'Message',
                'label_attr' => array('class' => 'libelle')
            ))
        ;
    }

    public function getName()
    {
        return 'message';
    }
}
