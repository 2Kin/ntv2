<?php
namespace NinjaTooken\ForumBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity
 * @ORM\Table(name="nt_comment")
 * @ORM\Entity(repositoryClass="NinjaTooken\ForumBundle\Entity\CommentRepository")
 */
class Comment
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * Thread of this comment
     *
     * @var Thread
     * @ORM\ManyToOne(targetEntity="NinjaTooken\ForumBundle\Entity\Thread")
     * @ORM\JoinColumn(name="thread_id", referencedColumnName="id", onDelete="CASCADE")
     */
    private $thread;

    /**
     * @var DateTime
     *
     * @ORM\Column(name="date_ajout", type="datetime")
     */
    private $dateAjout;

    /**
     * Comment text
     *
     * @var string
     *
     * @ORM\Column(name="body", type="text")
     * @Assert\NotBlank
     */
    private $body;

    /**
    * Author of the comment
    *
    * @ORM\ManyToOne(targetEntity="NinjaTooken\UserBundle\Entity\User")
    * @ORM\JoinColumn(name="author_id", referencedColumnName="id", onDelete="CASCADE")
    * @var User
    */
    private $author;

    /**
    * @var int
    *
    * @ORM\Column(name="old_id", type="integer", nullable=true)
    */
    private $old_id;

    public function __construct()
    {
        $this->setDateAjout(new \DateTime());
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
    * Set author's name
    * 
    * @param UserInterface $author 
    */
    public function setAuthor(\NinjaTooken\UserBundle\Entity\User $author)
    {
        $this->author = $author;

        return $this;
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
     * @return string
     */
    public function getBody()
    {
        return $this->body;
    }

    /**
     * @param  string
     *
     * @return Comment
     */
    public function setBody($body)
    {
        $this->body = $body;

        return $this;
    }

    /**
     * @return DateTime
     */
    public function getDateAjout()
    {
        return $this->dateAjout;
    }

    /**
     * Sets the creation date
     * @param DateTime $dateAjout
     *
     * @return Comment
     */
    public function setDateAjout(\DateTime $dateAjout)
    {
        $this->dateAjout = $dateAjout;

        return $this;
    }

    /**
     * @return NinjaTooken\ForumBundle\Entity\Thread
     */
    public function getThread()
    {
        return $this->thread;
    }

    /**
     * @param Thread $thread
     *
     * @return Comment
     */
    public function setThread(\NinjaTooken\ForumBundle\Entity\Thread $thread)
    {
        $this->thread = $thread;

        return $this;
    }

    /**
     * Set old_id
     *
     * @param integer $oldId
     * @return Comment
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
}