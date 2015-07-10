<?php
namespace NinjaTooken\ClanBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;

class ClanType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $kamonChoices = array();
        for($i=1;$i<135;$i++){
            $num = substr('0000'.$i,-4);
            $kamonChoices['kamon'.$num] = 'bundles/ninjatookenclan/kamon/kamon'.$num.'.png';
        }
        $builder
            ->add('nom', 'text', array(
                'label' => 'label.nom',
                'label_attr' => array('class' => 'libelle')
            ))
            ->add('tag', 'text', array(
                'label' => 'label.tag',
                'label_attr' => array('class' => 'libelle'),
                'required' => false
            ))
            ->add('accroche', 'text', array(
                'label' => 'label.accroche',
                'label_attr' => array('class' => 'libelle'),
                'required' => false
            ))
            ->add('description', 'textarea', array(
                'label' => 'label.description',
                'label_attr' => array('class' => 'libelle')
            ))
            ->add('url', 'url', array(
                'label' => 'label.url',
                'label_attr' => array('class' => 'libelle'),
                'required' => false
            ))
            ->add('kamon', 'choice', array(
                'label' => 'label.kamon',
                'label_attr' => array('class' => 'libelle'),
                'multiple' => false,
                'choices'  => $kamonChoices,
                'choices_as_values' => true,
                'data' => (isset($options['data']) && $options['data']->getKamon() !== null) ? $options['data']->getKamon() : key($kamonChoices)
            ))
            ->add('kamonUpload', 'file', array(
                'label' => 'label.kamonUpload',
                'label_attr' => array('class' => 'libelle'),
                'data_class' => null,
                'required' => false
            ))
            ->add('isRecruting', 'choice', array(
                'label' => 'label.isRecruting',
                'label_attr' => array('class' => 'libelle'),
                'multiple' => false,
                'expanded' => true,
                'choices'  => array(true => 'label.oui', false => 'label.non')
            ));
    }

    public function getName()
    {
        return 'clan';
    }
}