<?php

use Symfony\Component\HttpKernel\Kernel;
use Symfony\Component\Config\Loader\LoaderInterface;

class AppKernel extends Kernel
{
    public function registerBundles()
    {
        $bundles = array(
            new Symfony\Bundle\FrameworkBundle\FrameworkBundle(),
            new Symfony\Bundle\SecurityBundle\SecurityBundle(),
            new Symfony\Bundle\TwigBundle\TwigBundle(),
            new Symfony\Bundle\MonologBundle\MonologBundle(),
            new Symfony\Bundle\SwiftmailerBundle\SwiftmailerBundle(),
            new Symfony\Bundle\AsseticBundle\AsseticBundle(),
            new Doctrine\Bundle\DoctrineBundle\DoctrineBundle(),
            new Sensio\Bundle\FrameworkExtraBundle\SensioFrameworkExtraBundle(),
            new JMS\AopBundle\JMSAopBundle(),
            new JMS\DiExtraBundle\JMSDiExtraBundle($this),
            new JMS\SecurityExtraBundle\JMSSecurityExtraBundle(),

			new FOS\UserBundle\FOSUserBundle(),
			new Exercise\HTMLPurifierBundle\ExerciseHTMLPurifierBundle(),
			new FOS\RestBundle\FOSRestBundle(),
			new FOS\CommentBundle\FOSCommentBundle(),
			new JMS\SerializerBundle\JMSSerializerBundle($this),
            new NinjaTooken\ForumBundle\NinjaTookenForumBundle(),
            new NinjaTooken\UserBundle\NinjaTookenUserBundle(),

			new Sonata\jQueryBundle\SonatajQueryBundle(),
			new Sonata\AdminBundle\SonataAdminBundle(),
			new Knp\Bundle\MenuBundle\KnpMenuBundle(),
			new Sonata\DoctrineORMAdminBundle\SonataDoctrineORMAdminBundle(),
            new NinjaTooken\GameBundle\NinjaTookenGameBundle(),
            new NinjaTooken\ClanBundle\NinjaTookenClanBundle(),
            new NinjaTooken\CommonBundle\NinjaTookenCommonBundle(),
            new Stof\DoctrineExtensionsBundle\StofDoctrineExtensionsBundle(),
            new NinjaTooken\ChatBundle\NinjaTookenChatBundle(),
        );

        if (in_array($this->getEnvironment(), array('dev', 'test'))) {
            $bundles[] = new Symfony\Bundle\WebProfilerBundle\WebProfilerBundle();
            $bundles[] = new Sensio\Bundle\DistributionBundle\SensioDistributionBundle();
            $bundles[] = new Sensio\Bundle\GeneratorBundle\SensioGeneratorBundle();
        }

        return $bundles;
    }

    public function registerContainerConfiguration(LoaderInterface $loader)
    {
        $loader->load(__DIR__.'/config/config_'.$this->getEnvironment().'.yml');
    }
}
