<?php

namespace NinjaTooken\UserBundle\Form\Type;

use Symfony\Component\Form\FormBuilderInterface;
use FOS\UserBundle\Form\Type\RegistrationFormType as BaseType;
use Sonata\UserBundle\Model\UserInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class RegistrationFormType extends BaseType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {

        $builder
            ->add('username', null, array(
                'label' => 'compte.register.pseudo',
                'label_attr' => array('class' => 'libelle'),
                'error_bubbling' => true
            ))
            ->add('plainPassword', 'repeated', array(
                'type' => 'password',
                'first_options' => array(
                    'label' => 'compte.register.motPasse',
                    'label_attr' => array('class' => 'libelle')
                ),
                'second_options' => array(
                    'label' => 'compte.register.motPasseRepeter',
                    'label_attr' => array('class' => 'libelle')
                ),
                'invalid_message' => 'fos_user.password.mismatch',
                'error_bubbling' => true
            ))
            ->add('email', 'email', array(
                'label' => 'compte.register.mail',
                'label_attr' => array('class' => 'libelle'),
                'error_bubbling' => true
            ))
            ->add('gender', 'choice', array(
                'choices' => array(
                    UserInterface::GENDER_MAN => 'gender_male',
                    UserInterface::GENDER_FEMALE => 'gender_female'
                ),
                'data' => UserInterface::GENDER_MAN,
                'expanded' => true,
                'label_attr' => array('class' => 'libelle')
            ))
            ->add('locale', 'choice', array(
                'choices' => array('fr' => 'Français', 'en' => 'English'),
                'data' => 'fr',
                'expanded' => true,
                'label_attr' => array('class' => 'libelle')
            ))
            ->add('receive_newsletter', 'checkbox', array(
                'label' => 'compte.register.receiveNewsletter',
                'required' => false
            ))
            ->add('receive_avertissement', 'checkbox', array(
                'label' => 'compte.register.receiveAvertissement',
                'required' => false
            ))
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            "data_class" => "NinjaTooken\UserBundle\Entity\User",
            "validation_groups" => array("Registration")
        ));
    }

    public function getName()
    {
        return 'ninjatooken_user_registration';
    }
}