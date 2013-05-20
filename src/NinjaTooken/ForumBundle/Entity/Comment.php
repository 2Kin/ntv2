<?php
namespace NinjaTooken\ForumBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use FOS\CommentBundle\Model\SignedCommentInterface;
use FOS\CommentBundle\Model\RawCommentInterface;
use FOS\CommentBundle\Entity\Comment as BaseComment;
use Symfony\Component\Security\Core\User\UserInterface;
use NinjaTooken\UserBundle\Entity\User;

/**
 * @ORM\Entity
 * @ORM\ChangeTrackingPolicy("DEFERRED_EXPLICIT")
 */
class Comment extends BaseComment implements SignedCommentInterface, RawCommentInterface
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
     * @ORM\ManyToOne(targetEntity="Thread")
     */
    protected $thread;

    /**
     * @ORM\Column(name="rawBody", type="text", nullable=true)
     * @var string
     */
    protected $rawBody;

    /**
    * Author of the comment
    *
    * @ORM\ManyToOne(targetEntity="NinjaTooken\UserBundle\Entity\User")
    * @var User
    */
    protected $author;

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
     * Gets the raw processed html.
     *
     * @return string
     */
    public function getRawBody(){
		return $this->rawBody;
	}

    /**
     * Sets the processed body with raw html.
     *
     * @param string $rawBody
     */
    public function setRawBody($rawBody){
		$this->rawBody = $rawBody;
	}
}