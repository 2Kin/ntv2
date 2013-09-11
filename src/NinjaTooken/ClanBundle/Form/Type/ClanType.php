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
            $kamonChoices['bundles/ninjatookenclan/kamon/kamon'.$num.'.png'] = 'kamon'.$num;
        }
        $builder
            ->add('nom', 'text', array(
                'label' => 'Nom',
                'label_attr' => array('class' => 'libelle')
            ))
            ->add('tag', 'text', array(
                'label' => 'Tag de clan',
                'label_attr' => array('class' => 'libelle'),
                'required' => false
            ))
            ->add('accroche', 'text', array(
                'label' => 'Accroche',
                'label_attr' => array('class' => 'libelle'),
                'required' => false
            ))
            ->add('description', 'textarea', array(
                'label' => 'Contenu',
                'label_attr' => array('class' => 'libelle')
            ))
            ->add('url', 'url', array(
                'label' => 'Page perso',
                'label_attr' => array('class' => 'libelle'),
                'required' => false
            ))
            ->add('kamon', 'choice', array(
                'label' => 'Kamon',
                'label_attr' => array('class' => 'libelle'),
                'multiple' => false,
                'choices'  => $kamonChoices,
                'data' => (isset($options['data']) && $options['data']->getKamon() !== null) ? $options['data']->getKamon() : key($kamonChoices)
            ))
            ->add('kamonUpload', 'file', array(
                'label' => 'Kamon perso',
                'label_attr' => array('class' => 'libelle'),
                'data_class' => null,
                'required' => false
            ))
            ->add('isRecruting', 'choice', array(
                'label' => 'Le clan recrute',
                'label_attr' => array('class' => 'libelle'),
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