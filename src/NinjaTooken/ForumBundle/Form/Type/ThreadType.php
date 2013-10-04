<?php
namespace NinjaTooken\ForumBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;

class ThreadType extends AbstractType
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
            ));
    }

    public function getName()
    {
        return 'thread';
    }
}