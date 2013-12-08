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

			new Sonata\CoreBundle\SonataCoreBundle(),
			new Sonata\BlockBundle\SonataBlockBundle(),
			new Sonata\jQueryBundle\SonatajQueryBundle(),
			new Sonata\AdminBundle\SonataAdminBundle(),
            new Sonata\DoctrineORMAdminBundle\SonataDoctrineORMAdminBundle(),
			new Knp\Bundle\MenuBundle\KnpMenuBundle(),
            new Sonata\UserBundle\SonataUserBundle('FOSUserBundle'),
            new Stfalcon\Bundle\TinymceBundle\StfalconTinymceBundle(),
            new Ornicar\GravatarBundle\OrnicarGravatarBundle(),
            new Avalanche\Bundle\ImagineBundle\AvalancheImagineBundle(),

			new Exercise\HTMLPurifierBundle\ExerciseHTMLPurifierBundle(),
            new NinjaTooken\ForumBundle\NinjaTookenForumBundle(),
            new NinjaTooken\UserBundle\NinjaTookenUserBundle(),
            new NinjaTooken\GameBundle\NinjaTookenGameBundle(),
            new NinjaTooken\ClanBundle\NinjaTookenClanBundle(),
            new NinjaTooken\CommonBundle\NinjaTookenCommonBundle(),
            new NinjaTooken\ChatBundle\NinjaTookenChatBundle(),
            new Stof\DoctrineExtensionsBundle\StofDoctrineExtensionsBundle(),
			new FOS\UserBundle\FOSUserBundle(),
            new FOS\FacebookBundle\FOSFacebookBundle(),
            new NinjaTooken\TournamentBundle\NinjaTookenTournamentBundle(),
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
