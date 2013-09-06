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
                'label' => 'Contenu',
                'label_attr' => array('class' => 'libelle')
            ));
    }

    public function getName()
    {
        return 'ninjatooken_forumbundle_commenttype';
    }
}