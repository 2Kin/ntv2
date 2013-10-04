<?php
namespace NinjaTooken\ForumBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;

class CommentType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('body', 'textarea', array(
                'label' => 'label.body',
                'label_attr' => array('class' => 'libelle')
            ));
    }

    public function getName()
    {
        return 'comment';
    }
}