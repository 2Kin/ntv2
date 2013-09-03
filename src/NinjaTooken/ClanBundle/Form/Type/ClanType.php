<?php
namespace NinjaTooken\ClanBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;

class ClanType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('nom', 'text', array(
                'label' => 'Nom'
            ))
            ->add('tag', 'text', array(
                'label' => 'Tag de clan'
            ))
            ->add('accroche', 'text', array(
                'label' => 'Accroche'
            ))
            ->add('description', 'textarea', array(
                'label' => 'Contenu'
            ))
            ->add('url', 'url', array(
                'label' => 'Page perso'
            ))
            ->add('kamon', 'url', array(
                'label' => 'Kamon'
            ))
            ->add('isRecruting', 'choice', array(
                'label' => 'Le clan recrute',
                'multiple' => false,
                'expanded' => true,
                'choices'  => array(true => 'Oui', false => 'Non')
            ));
    }

    public function getName()
    {
        return 'clan';
    }
}