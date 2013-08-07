<?php

namespace NinjaTooken\ForumBundle\Twig;

use Exercise\HTMLPurifierBundle\Twig\HTMLPurifierExtension;
use Symfony\Component\DependencyInjection\ContainerInterface;

class HTMLPurifierExtensionNT extends HTMLPurifierExtension
{

    public $container;
    /**
     * Constructor.
     *
     * @param \HTMLPurifier $purifier
     */
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    /**
     * Filter the input through an HTMLPurifier service.
     *
     * @param string $string
     * @param string $profile
     * @return string
     */
    public function purify($string, $profile = 'default')
    {
        $HTMLPurifier = $this->getHTMLPurifierForProfile($profile);

        // ajoute certaines définitions
        if($profile=='full'){
            if($def = $HTMLPurifier->config->maybeGetRawHTMLDefinition()) {
                $def->addAttribute('embed', 'allowfullscreen', 'Enum#true,false');
                $def->addAttribute('object', 'classid', 'CDATA');
                $def->addElement(
                    'fieldset',
                    'Block',
                    'Flow',
                    'Common',
                    array()
                );
                $def->addElement(
                    'legend',
                    'Block',
                    'Flow',
                    'Common',
                    array()
                );
            }
        }

        return $HTMLPurifier->purify($string);
    }

    /**
     * Get the HTMLPurifier service corresponding to the given profile.
     *
     * @param string $profile
     * @return \HTMLPurifier
     * @throws \RuntimeException
     */
    private function getHTMLPurifierForProfile($profile)
    {
        if (!isset($this->purifiers[$profile])) {
            $purifier = $this->container->get('exercise_html_purifier.' . $profile);

            if (!$purifier instanceof \HTMLPurifier) {
                throw new \RuntimeException(sprintf('Service "exercise_html_purifier.%s" is not an HTMLPurifier instance.', $profile));
            }

            $this->purifiers[$profile] = $purifier;
        }

        return $this->purifiers[$profile];
    }
}
