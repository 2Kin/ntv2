<?php

namespace NinjaTooken\UserBundle\Form\Type;

use Symfony\Component\Form\FormBuilderInterface;
use FOS\UserBundle\Form\Type\RegistrationFormType as BaseType;

class RegistrationFormType extends BaseType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('username', null, array(
                'label' => 'Pseudo',
                'label_attr' => array('class' => 'libelle')
            ))
            ->add('plainPassword', 'repeated', array(
                'type' => 'password',
                'first_options' => array('label' => 'Mot de passe', 'label_attr' => array('class' => 'libelle')),
                'second_options' => array('label' => 'Répéter', 'label_attr' => array('class' => 'libelle')),
                'invalid_message' => 'fos_user.password.mismatch'
            ))
            ->add('email', 'email', array(
                'label' => 'Mail',
                'label_attr' => array('class' => 'libelle')
            ))
            ->add('gender', 'choice', array(
                'choices' => array(
                    UserInterface::GENDER_UNKNOWN => 'gender_unknown',
                    UserInterface::GENDER_FEMALE  => 'gender_female',
                    UserInterface::GENDER_MAN     => 'gender_male',
                ),
                'data' => 'H',
                'expanded' => true,
                'required' => true,
                'label_attr' => array('class' => 'libelle')
            ))
            ->add('locale', 'choice', array(
                'choices' => array('fr' => 'Français', 'en' => 'English'),
                'data' => 'fr',
                'expanded' => true,
                'required' => true,
                'label_attr' => array('class' => 'libelle')
            ))
            ->add('receive_newsletter', 'checkbox', array(
                'label' => 'J\'accepte de recevoir par mail les news du site',
                'required' => false
            ))
            ->add('receive_avertissement', 'checkbox', array(
                'label' => 'Je souhaite être averti par mail de l\'arrivée de nouveaux messages',
                'required' => false
            ))
        ;
    }

    public function getName()
    {
        return 'ninjatooken_user_registration';
    }
}