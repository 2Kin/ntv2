<?php

namespace NinjaTooken\UserBundle\Form\Type;

use Symfony\Component\Form\FormBuilderInterface;
use FOS\UserBundle\Form\Type\ResettingFormType as BaseType;

class ResettingFormType extends BaseType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('new', 'repeated', array(
            'type' => 'password',
            'options' => array('translation_domain' => 'NinjaTookenUserBundle'),
            'first_options' => array(
                'label' => 'resetting.new_password',
                'label_attr' => array('class' => 'libelle')
            ),
            'second_options' => array(
                'label' => 'resetting.new_password_confirmation',
                'label_attr' => array('class' => 'libelle')
            ),
            'invalid_message' => 'resetting.mismatch',
        ));
    }

    public function getName()
    {
        return 'ninjatooken_user_resetting';
    }
}
