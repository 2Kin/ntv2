<?php

namespace NinjaTooken\ForumBundle\Block;

use Sonata\BlockBundle\Block\BlockContextInterface;
use Symfony\Bundle\FrameworkBundle\Templating\EngineInterface;
use Symfony\Component\HttpFoundation\Response;

use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Validator\ErrorElement;
use Sonata\DoctrineORMAdminBundle\Datagrid\Pager;

use Sonata\BlockBundle\Model\BlockInterface;
use Sonata\BlockBundle\Block\BaseBlockService;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Doctrine\ORM\EntityManager;
use Sonata\DoctrineORMAdminBundle\Datagrid\ProxyQuery;

class RecentCommentsBlockService extends BaseBlockService
{

    private $em;
    
    /**
     * @param string               $name
     * @param EngineInterface      $templating
     */
    public function __construct($name, EngineInterface $templating, EntityManager $entityManager)
    {
        $this->em = $entityManager;

        parent::__construct($name, $templating);
    }

    /**
     * {@inheritdoc}
     */
    public function execute(BlockContextInterface $blockContext, Response $response = null)
    {
        $criteria = array(
            'mode' => $blockContext->getSetting('mode')
        );

        $query = $this->em->getRepository("NinjaTookenForumBundle:Comment")
            ->createQueryBuilder('c')
            ->orderby('c.dateAjout', 'DESC');
        $pager = new Pager();
        $pager->setMaxPerPage($blockContext->getSetting('number'));
        $pager->setQuery(new ProxyQuery($query));
        $pager->setPage(1);
        $pager->init();

        $parameters = array(
            'context'   => $blockContext,
            'settings'  => $blockContext->getSettings(),
            'block'     => $blockContext->getBlock(),
            'pager'     => $pager
        );

        if ($blockContext->getSetting('mode') === 'admin') {
            return $this->renderPrivateResponse($blockContext->getTemplate(), $parameters, $response);
        }

        return $this->renderResponse($blockContext->getTemplate(), $parameters, $response);
    }

    /**
     * {@inheritdoc}
     */
    public function validateBlock(ErrorElement $errorElement, BlockInterface $block)
    {
        // TODO: Implement validateBlock() method.
    }

    /**
     * {@inheritdoc}
     */
    public function buildEditForm(FormMapper $formMapper, BlockInterface $block)
    {
        $formMapper->add('settings', 'sonata_type_immutable_array', array(
            'keys' => array(
                array('number', 'integer', array('required' => true)),
                array('title', 'text', array('required' => false)),
                array('mode', 'choice', array(
                    'choices' => array(
                        'public' => 'public',
                        'admin'  => 'admin'
                    )
                ))
            )
        ));
    }

    /**
     * {@inheritdoc}
     */
    public function getName()
    {
        return 'Recent Comments';
    }

    /**
     * {@inheritdoc}
     */
    public function setDefaultSettings(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'number'     => 5,
            'mode'       => 'public',
            'title'      => 'Recent Comments',
            'template'   => 'NinjaTookenForumBundle:Block:recent_comments.html.twig'
        ));
    }
}
