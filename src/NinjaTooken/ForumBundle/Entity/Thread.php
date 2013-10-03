<?php
namespace NinjaTooken\ForumBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity
 * @ORM\Table(name="nt_thread")
 * @ORM\Entity(repositoryClass="NinjaTooken\ForumBundle\Entity\ThreadRepository")
 */
class Thread
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @var int
     *
     * @ORM\Column(name="old_id", type="integer", nullable=true)
     */
    private $old_id;

    /**
     * Tells if the thread is viewable on top of list
     *
     * @var bool
     *
     * @ORM\Column(name="is_postit", type="boolean")
     */
    private $isPostit = false;

    /**
     * @var bool
     *
     * @ORM\Column(name="is_event", type="boolean")
     */
    private $isEvent = false;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_event_start", type="date", nullable=true)
     */
    private $dateEventStart;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_event_end", type="date", nullable=true)
     */
    private $dateEventEnd;

    /**
     * Tells if new comments can be added in this thread
     *
     * @var bool
     *
     * @ORM\Column(name="is_commentable", type="boolean")
     */
    private $isCommentable = true;

    /**
     * forum
     *
     * @var Forum
     *
     * @ORM\ManyToOne(targetEntity="Forum")
     * @ORM\JoinColumn(name="forum_id", referencedColumnName="id", onDelete="CASCADE")
     */
    private $forum;

    /**
     * @var string
     *
     * @ORM\Column(name="nom", type="string", length=255)
     * @Assert\MaxLength(255)
     * @Assert\NotBlank()
     */
    private $nom;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_ajout", type="datetime")
     */
    private $dateAjout;

    /**
     * @Gedmo\Slug(fields={"nom"})
     * @ORM\Column(length=128, unique=true)
     */
    private $slug;

    /**
     * @var string
     *
     * @ORM\Column(name="body", type="text")
     * @Assert\NotBlank()
     */
    protected $body;

    /**
     * @var string
     *
     * @ORM\Column(name="url_video", type="string", length=255, nullable=true)
     */
    private $urlVideo;

    /**
    * Author of the comment
    *
    * @ORM\ManyToOne(targetEntity="NinjaTooken\UserBundle\Entity\User")
    * @var User
    */
    private $author;

    /**
     * Denormalized number of comments
     *
     * @var integer
     *
     * @ORM\Column(name="num_comments", type="integer")
     */
    private $numComments = 0;

    /**
     * Denormalized date of the last comment
     *
     * @var DateTime
     *
     * @ORM\Column(name="last_comment_at", type="datetime", nullable=true)
     */
    private $lastCommentAt;

    /**
     * Denormalized author of the last comment
     *
     * @ORM\ManyToOne(targetEntity="NinjaTooken\UserBundle\Entity\User")
     * @var User
     */
    private $lastCommentBy;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->setDateAjout(new \DateTime());
        $this->setLastCommentAt(new \DateTime());
    }

    /**
     * Get id
     *
     * @return integer 
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

    /**
     * Set old_id
     *
     * @param integer $oldId
     * @return Thread
     */
    public function setOldId($oldId)
    {
        $this->old_id = $oldId;

        return $this;
    }

    /**
     * Get old_id
     *
     * @return integer 
     */
    public function getOldId()
    {
        return $this->old_id;
    }

    /**
     * Set dateAjout
     *
     * @param \DateTime $dateAjout
     * @return Forum
     */
    public function setDateAjout($dateAjout)
    {
        $this->dateAjout = $dateAjout;

        return $this;
    }

    /**
     * Get dateAjout
     *
     * @return \DateTime 
     */
    public function getDateAjout()
    {
        return $this->dateAjout;
    }

    /**
     * Set isEvent
     *
     * @param boolean $isEvent
     * @return Forum
     */
    public function setIsEvent($isEvent)
    {
        $this->isEvent = $isEvent;

        return $this;
    }

    /**
     * Get isEvent
     *
     * @return boolean 
     */
    public function getIsEvent()
    {
        return $this->isEvent;
    }

    /**
    * Set author's name
    * 
    * @param UserInterface $author 
    */
    public function setAuthor(\NinjaTooken\UserBundle\Entity\User $author)
    {
        $this->author = $author;
    }

    /**
    * Get author's name
    * 
    * @return type 
    */
    public function getAuthor()
    {
        return $this->author;
    }


    /**
     * Set isPostit
     *
     * @param boolean $isPostit
     * @return Thread
     */
    public function setIsPostit($isPostit)
    {
        $this->isPostit = $isPostit;

        return $this;
    }

    /**
     * Get isPostit
     *
     * @return boolean 
     */
    public function getIsPostit()
    {
        return $this->isPostit;
    }

    /**
     * Set lastCommentBy
     *
     * @param \NinjaTooken\UserBundle\Entity\User $lastCommentBy
     * @return Thread
     */
    public function setLastCommentBy(\NinjaTooken\UserBundle\Entity\User $lastCommentBy = null)
    {
        $this->lastCommentBy = $lastCommentBy;

        return $this;
    }

    /**
     * Get lastCommentBy
     *
     * @return \NinjaTooken\UserBundle\Entity\User 
     */
    public function getLastCommentBy()
    {
        return $this->lastCommentBy;
    }

    /**
     * Gets the number of comments
     *
     * @return integer
     */
    public function getNumComments()
    {
        return $this->numComments;
    }

    /**
     * Sets the number of comments
     *
     * @param integer $numComments
     */
    public function setNumComments($numComments)
    {
        $this->numComments = intval($numComments);
    }

    /**
     * Increments the number of comments by the supplied
     * value.
     *
     * @param  integer $by Value to increment comments by
     * @return integer The new comment total
     */
    public function incrementNumComments($by = 1)
    {
        return $this->numComments += intval($by);
    }

    /**
     * @return DateTime
     */
    public function getLastCommentAt()
    {
        return $this->lastCommentAt;
    }

    /**
     * @param  DateTime
     * @return null
     */
    public function setLastCommentAt($lastCommentAt)
    {
        $this->lastCommentAt = $lastCommentAt;
    }

    /**
     * Set dateEventStart
     *
     * @param \DateTime $dateEventStart
     * @return Thread
     */
    public function setDateEventStart($dateEventStart)
    {
        $this->dateEventStart = $dateEventStart;

        return $this;
    }

    /**
     * Get dateEventStart
     *
     * @return \DateTime 
     */
    public function getDateEventStart()
    {
        return $this->dateEventStart;
    }

    /**
     * Set dateEventEnd
     *
     * @param \DateTime $dateEventEnd
     * @return Thread
     */
    public function setDateEventEnd($dateEventEnd)
    {
        $this->dateEventEnd = $dateEventEnd;

        return $this;
    }

    /**
     * Get dateEventEnd
     *
     * @return \DateTime 
     */
    public function getDateEventEnd()
    {
        return $this->dateEventEnd;
    }

    /**
     * Set isCommentable
     *
     * @param boolean $isCommentable
     * @return Thread
     */
    public function setIsCommentable($isCommentable)
    {
        $this->isCommentable = $isCommentable;

        return $this;
    }

    /**
     * Get isCommentable
     *
     * @return boolean 
     */
    public function getIsCommentable()
    {
        return $this->isCommentable;
    }
}
