<?php
namespace NinjaTooken\ForumBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use FOS\CommentBundle\Entity\Thread as BaseThread;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * @ORM\Entity
 * @ORM\ChangeTrackingPolicy("DEFERRED_EXPLICIT")
 */
class Thread extends BaseThread
{
    /**
     * @var string $id
     *
     * @ORM\Id
     * @ORM\Column(type="string")
     */
    protected $id;

    /**
     * forum
     *
     * @var Forum
     * @ORM\ManyToOne(targetEntity="Forum")
     */
    private $forum;

    /**
     * @var string
     *
     * @ORM\Column(name="nom", type="string", length=255)
     */
    private $nom;

    /**
     * @Gedmo\Slug(fields={"nom"})
     * @ORM\Column(length=128, unique=true)
     */
    private $slug;

    /**
     * @var string
     *
     * @ORM\Column(name="body", type="text")
     * @var string
     */
    protected $body;

    /**
     * @var string
     *
     * @ORM\Column(name="url_video", type="string", length=255)
     */
    private $urlVideo;

    /**
     * Set id
     *
     * @param string $id
     * @return Thread
     */
    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Get id
     *
     * @return string 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set nom
     *
     * @param string $nom
     * @return Thread
     */
    public function setNom($nom)
    {
        $this->nom = $nom;

        return $this;
    }

    /**
     * Get nom
     *
     * @return string 
     */
    public function getNom()
    {
        return $this->nom;
    }

    /**
     * Set forum
     *
     * @param \NinjaTooken\ForumBundle\Entity\Forum $forum
     * @return Thread
     */
    public function setForum(\NinjaTooken\ForumBundle\Entity\Forum $forum = null)
    {
        $this->forum = $forum;

        return $this;
    }

    /**
     * Get forum
     *
     * @return \NinjaTooken\ForumBundle\Entity\Forum 
     */
    public function getForum()
    {
        return $this->forum;
    }

    /**
     * Set body
     *
     * @param string $body
     * @return Thread
     */
    public function setBody($body)
    {
        $this->body = $body;

        return $this;
    }

    /**
     * Get body
     *
     * @return string 
     */
    public function getBody()
    {
        return $this->body;
    }

    /**
     * Set slug
     *
     * @param string $slug
     * @return Thread
     */
    public function setSlug($slug)
    {
        $this->slug = $slug;

        return $this;
    }

    /**
     * Get slug
     *
     * @return string 
     */
    public function getSlug()
    {
        return $this->slug;
    }

    /**
     * Set urlVideo
     *
     * @param string $urlVideo
     * @return Thread
     */
    public function setUrlVideo($urlVideo)
    {
        $this->urlVideo = $urlVideo;

        return $this;
    }

    /**
     * Get urlVideo
     *
     * @return string 
     */
    public function getUrlVideo()
    {
        return $this->urlVideo;
    }
}
