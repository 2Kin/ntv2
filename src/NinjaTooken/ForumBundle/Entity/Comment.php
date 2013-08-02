<?php
namespace NinjaTooken\ForumBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="nt_comment")
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
     */
    private $body;

    /**
    * Author of the comment
    *
    * @ORM\ManyToOne(targetEntity="NinjaTooken\UserBundle\Entity\User")
    * @var User
    */
    private $author;

    public function __construct()
    {
        $this->dateAjout = new DateTime();
    }

    /**
    * Set author's name
    * 
    * @param UserInterface $author 
    */
    public function setAuthor(UserInterface $author)
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
    * Get authors comeplete name
    * 
    * @return string 
    */
    public function getAuthorName()
    {
        if (null === $this->getAuthor()) {
            return 'Anonymous';
        }

        return $this->getAuthor()->getUsername();
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
     * @return null
     */
    public function setBody($body)
    {
        $this->body = $body;
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
     */
    public function setDateAjout(DateTime $dateAjout)
    {
        $this->dateAjout = $dateAjout;
    }

    /**
     * @return NinjaTooken\ForumBundle\Entity\Thread
     */
    public function getThread()
    {
        return $this->thread;
    }

    /**
     * @param ThreadInterface $thread
     *
     * @return void
     */
    public function setThread(NinjaTooken\ForumBundle\Entity\Thread $thread)
    {
        $this->thread = $thread;
    }
}