<?php
namespace NinjaTooken\CommonBundle\Twig;

use Symfony\Component\Routing\RouterInterface;

class TwigExtension extends \Twig_Extension
{
    protected $router;

    /**
     * Receive Router instance
     */
    public function __construct(RouterInterface $router)
    {
        $this->router = $router;
    }

    /**
     * Declare the asset_url function
     */
    public function getFunctions()
    {
        return array(
            'asset_absolute' => new \Twig_Function_Method($this, 'assetAbsolute'),
        );
    }

    /**
     * Implement asset_url function
     * We get the router context. This will default to settings in
     * parameters.yml if there is no active request
     */
    public function assetAbsolute($path)
    {
        $context = $this->router->getContext();
        $host = $context->getScheme().'://'.$context->getHost();

        return $host.$path;
    }

    /**
     * Set a name for the extension
     */
    public function getName()
    {
        return 'twig_extension';
    }
}
